import { useState, useCallback } from 'react';
import { UnsplashPhoto } from '../types';

export function useUnsplash() {
  const [photo, setPhoto] = useState<UnsplashPhoto | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPhoto = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=nature&orientation=landscape&client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      setPhoto(data);
    } catch (error) {
      setPhoto(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { photo, loading, fetchPhoto };
} 