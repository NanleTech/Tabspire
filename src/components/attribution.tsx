import React from 'react';
import { UnsplashPhoto } from '../types';

interface AttributionProps {
  photo: UnsplashPhoto | null;
}

const Attribution: React.FC<AttributionProps> = ({ photo }) => {
  if (!photo) return null;
  return (
    <div className="attribution">
      Photo by{' '}
      <a
        href={`${photo.user.links.html}?utm_source=tabspire&utm_medium=referral`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {photo.user.name}
      </a>
      {' '}on{' '}
      <a
        href="https://unsplash.com/?utm_source=tabspire&utm_medium=referral"
        target="_blank"
        rel="noopener noreferrer"
      >
        Unsplash
      </a>
    </div>
  );
};

export default Attribution; 