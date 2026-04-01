import { useState, useCallback, useEffect } from 'react';
import type { Scripture, BibleVerse } from '../types';
import verses from '../data/verses.json';
import { getRandomFallbackVerse } from '../data/fallback-verses';
import { usePersistedState } from './use-persisted-state';

const CACHE_KEY = 'tabspire_cached_scripture';
const REQUEST_TIMEOUT_MS = 4500;
const getRandomVerse = () => {
  return verses[Math.floor(Math.random() * verses.length)];
};

export function useScripture(bibleId: string) {
  const [cachedScripture, setCachedScripture] = usePersistedState<Scripture | null>(CACHE_KEY, null);
  const [scripture, setScripture] = useState<Scripture | null>(cachedScripture);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Show cached scripture immediately on mount
  useEffect(() => {
    if (cachedScripture) {
      setScripture(cachedScripture);
      setIsReady(true);
      return;
    }

    setScripture(getRandomFallbackVerse());
    setIsReady(true);
  }, [cachedScripture]);

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
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        let response: Response;
        try {
          response = await fetch(
            `https://api.scripture.api.bible/v1/bibles/${idToUse}/verses/${verse.bookId}.${verse.chapterId}.${verse.verseId}`,
            {
              headers: {
                'api-key': process.env.REACT_APP_BIBLE_API_KEY || '',
              },
              signal: controller.signal,
            }
          );
        } finally {
          window.clearTimeout(timeoutId);
        }

        if (!response.ok) {
          throw new Error(`Scripture API request failed: ${response.status}`);
        }

        const data = await response.json();
        const newScripture: Scripture = {
          text: data.data.content.replace(/<[^>]*>/g, '').replace(/^\d+\s*/, ''),
          reference: data.data.reference,
        };
        setScripture(newScripture);
        setCachedScripture(newScripture);
        setIsReady(true);
        return verse;
      } catch (error) {
        // Use a random fallback verse instead of always showing John 3:16
        const fallbackVerse = getRandomFallbackVerse();
        setScripture(fallbackVerse);
        // Don't cache fallback verses
        setIsReady(true);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [bibleId, setCachedScripture]
  );

  return { scripture, loading, isReady, fetchScripture };
} 