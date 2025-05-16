import { useState, useCallback } from 'react';
import { Scripture, BibleVerse } from '../types';

const BIBLE_ID = 'de4e12af7f28f599-02'; // English Standard Version (ESV)

const getRandomVerse = (): BibleVerse => {
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

export function useScripture() {
  const [scripture, setScripture] = useState<Scripture | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchScripture = useCallback(async () => {
    setLoading(true);
    try {
      const verse = getRandomVerse();
      const response = await fetch(
        `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/verses/${verse.bookId}.${verse.chapterId}.${verse.verseId}`,
        {
          headers: {
            'api-key': process.env.REACT_APP_BIBLE_API_KEY || '',
          },
        }
      );
      const data = await response.json();
      setScripture({
        text: data.data.content.replace(/<[^>]*>/g, ''),
        reference: data.data.reference,
      });
    } catch (error) {
      setScripture({
        text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
        reference: "John 3:16"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { scripture, loading, fetchScripture };
} 