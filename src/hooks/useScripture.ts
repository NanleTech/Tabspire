import { useState, useCallback } from 'react';
import { Scripture, BibleVerse } from '../types';
import verses from '../verses.json';

const getRandomVerse = (): BibleVerse => {
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
          text: data.data.content.replace(/<[^>]*>/g, ''),
          reference: data.data.reference,
        });
        return verse;
      } catch (error) {
        setScripture({
          text:
            'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
          reference: 'John 3:16',
        });
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [bibleId]
  );

  return { scripture, loading, fetchScripture };
} 