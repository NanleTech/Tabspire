import { useState, useCallback } from 'react';
import { UnsplashPhoto } from '../types';
import React from 'react';

const APP_VERSION = '1.0.0'; // Update this on each deploy
const CACHE_KEY = 'unsplash_photo_cache';
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in ms

const FALLBACK_IMAGES = [
  '/images/1.jpg',
  '/images/2.jpg',
  '/images/3.jpg',
  '/images/4.jpg',
  '/images/5.jpg',
  '/images/6.jpg',
];

function getRandomFallbackImage() {
  const idx = Math.floor(Math.random() * FALLBACK_IMAGES.length);
  return {
    urls: { regular: FALLBACK_IMAGES[idx] },
    user: { name: 'Tabspire', links: { html: '#' } },
  };
}

export function useUnsplash() {
  const [photo, setPhoto] = useState<UnsplashPhoto | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPhoto = useCallback(async () => {
    setLoading(true);
    let imageToUse = null;
    try {
      // Try Unsplash
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=nature&orientation=landscape&client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`
      );
      if (!response.ok) throw new Error('Unsplash error');
      const data = await response.json();
      imageToUse = data;
    } catch (error) {
      // Try Pexels
      try {
        const pexelsResponse = await fetch(
          'https://api.pexels.com/v1/search?query=nature&orientation=landscape&per_page=1',
          {
            headers: {
              Authorization: process.env.REACT_APP_PEXELS_ACCESS_KEY || '',
            },
          }
        );
        if (!pexelsResponse.ok) throw new Error('Pexels error');
        const pexelsData = await pexelsResponse.json();
        if (pexelsData.photos && pexelsData.photos.length > 0) {
          // Adapt Pexels photo to UnsplashPhoto type
          const pexelsPhoto = pexelsData.photos[0];
          imageToUse = {
            urls: { regular: pexelsPhoto.src.landscape },
            user: {
              name: pexelsPhoto.photographer,
              links: { html: pexelsPhoto.url },
            },
          };
        } else {
          throw new Error('No Pexels photos');
        }
      } catch (pexelsError) {
        // Fallback to random local image
        imageToUse = getRandomFallbackImage();
      }
    }
    setPhoto(imageToUse);
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        photo: imageToUse,
        timestamp: Date.now(),
        version: APP_VERSION,
      })
    );
    setLoading(false);
  }, []);

  // On mount, check cache
  React.useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { photo, timestamp, version } = JSON.parse(cached);
        const isFresh = Date.now() - timestamp < CACHE_DURATION;
        const isSameVersion = version === APP_VERSION;
        if (isFresh && isSameVersion) {
          setPhoto(photo);
          setLoading(false);
          return;
        }
      } catch {}
    }
    fetchPhoto();
    // eslint-disable-next-line
  }, []);

  return { photo, loading, fetchPhoto };
} 