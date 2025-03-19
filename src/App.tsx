import React, { useEffect, useState } from 'react';
import './App.css';

interface Scripture {
  text: string;
  reference: string;
}

interface BibleVerse {
  bookId: string;
  chapterId: string;
  verseId: string;
}

interface CachedData {
  scripture: Scripture;
  background: string;
  timestamp: number;
}

const BIBLE_ID = 'de4e12af7f28f599-02'; // English Standard Version (ESV)
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function App() {
  const [background, setBackground] = useState<string>('');
  const [scripture, setScripture] = useState<Scripture | null>(null);
  const [loading, setLoading] = useState(true);

  const getRandomVerse = (): BibleVerse => {
    // Common verses for inspiration (you can expand this list)
    const verses = [
      { bookId: 'JHN', chapterId: '3', verseId: '16' },
      { bookId: 'PSA', chapterId: '23', verseId: '1' },
      { bookId: 'PHP', chapterId: '4', verseId: '13' },
      { bookId: 'JER', chapterId: '29', verseId: '11' },
      { bookId: 'ROM', chapterId: '8', verseId: '28' },
      { bookId: 'PSA', chapterId: '46', verseId: '1' },
      { bookId: 'ISA', chapterId: '41', verseId: '10' },
      { bookId: 'MAT', chapterId: '6', verseId: '33' },
      { bookId: 'HEB', chapterId: '11', verseId: '1' },
      { bookId: '2CO', chapterId: '5', verseId: '7' },
    ];
    return verses[Math.floor(Math.random() * verses.length)];
  };

  const getCachedData = async (): Promise<CachedData | null> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['tabspireCache'], (result) => {
        const cache = result.tabspireCache as CachedData;
        if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
          resolve(cache);
        } else {
          resolve(null);
        }
      });
    });
  };

  const setCachedData = async (data: CachedData) => {
    return new Promise<void>((resolve) => {
      chrome.storage.local.set({
        tabspireCache: {
          ...data,
          timestamp: Date.now(),
        },
      }, resolve);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get cached data first
        const cachedData = await getCachedData();
        if (cachedData) {
          setBackground(cachedData.background);
          setScripture(cachedData.scripture);
          setLoading(false);
          return;
        }

        // If no cache or expired, fetch new data
        const [backgroundData, scriptureData] = await Promise.all([
          fetch(
            `https://api.unsplash.com/photos/random?query=nature&orientation=landscape&client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`
          ).then(res => res.json()),
          (async () => {
            const verse = getRandomVerse();
            const response = await fetch(
              `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/verses/${verse.bookId}.${verse.chapterId}.${verse.verseId}`,
              {
                headers: {
                  'api-key': process.env.REACT_APP_BIBLE_API_KEY || '',
                },
              }
            );
            return response.json();
          })()
        ]);

        const newScripture = {
          text: scriptureData.data.content.replace(/<[^>]*>/g, ''), // Remove HTML tags
          reference: scriptureData.data.reference,
        };

        // Cache the new data
        await setCachedData({
          scripture: newScripture,
          background: backgroundData.urls.regular,
          timestamp: Date.now(),
        });

        setBackground(backgroundData.urls.regular);
        setScripture(newScripture);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback content
        setScripture({
          text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
          reference: "John 3:16"
        });
        setBackground(''); // Will use a CSS background color as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app" style={{ backgroundImage: background ? `url(${background})` : undefined }}>
      <div className="content">
        {scripture && (
          <div className="scripture">
            <p className="scripture-text">{scripture.text}</p>
            <p className="scripture-reference">{scripture.reference}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 