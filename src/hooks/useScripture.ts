import { useState, useCallback } from 'react';
import type { Scripture, BibleVerse } from '../types';
import verses from '../data/verses.json';
import { getRandomFallbackVerse } from '../data/fallback-verses';

const getRandomVerse = () => {
  return verses[Math.floor(Math.random() * verses.length)];
};

export function useScripture(bibleId: string) {
  const [scripture, setScripture] = useState<Scripture | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches a verse. If verseRef is provided, fetches that verse. Otherwise, fetches a random verse.
   * Returns the verse reference used.
   */
  const fetchScripture = useCallback(
    async (
      verseRef?: BibleVerse,
      overrideBibleId?: string
    ): Promise<BibleVerse | undefined> => {
      setLoading(true);
      try {
        const verse = verseRef || getRandomVerse();
        const idToUse = overrideBibleId || bibleId;
        const response = await fetch(
          `https://api.scripture.api.bible/v1/bibles/${idToUse}/verses/${verse.bookId}.${verse.chapterId}.${verse.verseId}`,
          {
            headers: {
              'api-key': process.env.REACT_APP_BIBLE_API_KEY || '',
            },
          }
        );
        const data = await response.json();
        setScripture({
          text: data.data.content.replace(/<[^>]*>/g, '').replace(/^\d+\s*/, ''),
          reference: data.data.reference,
        });
        return verse;
      } catch (error) {
        // Use a random fallback verse instead of always showing John 3:16
        const fallbackVerse = getRandomFallbackVerse();
        setScripture(fallbackVerse);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [bibleId]
  );

  return { scripture, loading, fetchScripture };
} 