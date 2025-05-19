export interface Scripture {
  text: string;
  reference: string;
}

export interface BibleVerse {
  bookId: string;
  chapterId: string;
  verseId: string;
}

export interface UnsplashPhoto {
  urls: {
    regular: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

export interface UnsplashPhotoCache {
  photo: UnsplashPhoto;
  timestamp: number;
  version: string;
} 