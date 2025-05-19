import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { useScripture } from './hooks/useScripture';
import { useUnsplash } from './hooks/useUnsplash';
import ScriptureDisplay from './components/scripture-display';
import Attribution from './components/attribution';
import Controls from './components/controls';

const APP_VERSION = '1.0.0'; // Update this on each deploy
const CACHE_KEY = 'unsplash_photo_cache';

const LANGUAGE_BIBLE_IDS: Record<string, string> = {
  en: 'de4e12af7f28f599-02', // ESV
  es: '592420522e16049f-01', // RVR1960
  fr: 'f5b73c3b260c01b9-01', // LSG
  de: 'c5da6c63581eafc0-01', // German (LUTH1545)
  pt: 'bba9f40183526463-01', // Portuguese (ARC)
  zh: 'c315fa9c1e7bafeb-01', // Chinese (CUVS)
  ru: 'b9f7b3b3c7d5c2e9-01', // Russian (RUSV)
  hi: 'f8eecf3a1c6b4b68-01', // Hindi (IRV-HIN)
};

function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem('tabspire_language') || 'en');
  const bibleId = LANGUAGE_BIBLE_IDS[language];
  const [currentVerseRef, setCurrentVerseRef] = useState<{ bookId: string; chapterId: string; verseId: string } | null>(null);
  const { scripture, fetchScripture } = useScripture(bibleId);
  const { photo, loading: photoLoading, fetchPhoto } = useUnsplash();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(2); // in rem
  const [loading, setLoading] = useState(true);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [fontStyle, setFontStyle] = useState(() => localStorage.getItem('tabspire_font_style') || 'serif');

  const handleRefresh = useCallback(() => {
    setLoading(true);
    fetchScripture().then((verseRef) => {
      if (verseRef) setCurrentVerseRef(verseRef);
      setLoading(false);
    });
    fetchPhoto().finally(() => {});
  }, [fetchScripture, fetchPhoto]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const adjustFontSize = (delta: number) => {
    setFontSize((prev) => Math.max(1.5, Math.min(3, prev + delta)));
  };

  // Version detection logic
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { version } = JSON.parse(cached);
        if (version && version !== APP_VERSION) {
          setShowUpdateBanner(true);
        }
      } catch {}
    }
  }, []);

  const onRefreshApp = () => {
    window.location.reload();
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('tabspire_language', lang);
    setLoading(true);
    const newBibleId = LANGUAGE_BIBLE_IDS[lang];
    if (currentVerseRef) {
      fetchScripture(currentVerseRef, newBibleId).finally(() => setLoading(false));
    } else {
      fetchScripture(undefined, newBibleId).then((verseRef) => {
        if (verseRef) setCurrentVerseRef(verseRef);
        setLoading(false);
      });
    }
  };

  const handleFontStyleChange = (style: string) => {
    setFontStyle(style);
    localStorage.setItem('tabspire_font_style', style);
  };

  useEffect(() => {
    if (!currentVerseRef) {
      fetchScripture().then((verseRef) => {
        if (verseRef) setCurrentVerseRef(verseRef);
        setLoading(false);
      });
    } else {
      fetchScripture(currentVerseRef).finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [bibleId]);

  if (loading || photoLoading) {
    return <div className="loading">Loading...</div>;
  }

  const shareText = scripture ? `${scripture.text} - ${scripture.reference}` : '';

  return (
    <div
      className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
      style={{
        backgroundImage: photo ? `url(${photo.urls.regular})` : undefined,
        '--font-size': `${fontSize}rem`,
      } as React.CSSProperties}
    >
      <Controls
        onRefresh={handleRefresh}
        onToggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        onFontSizeChange={adjustFontSize}
        shareText={shareText}
        showUpdateBanner={showUpdateBanner}
        onRefreshApp={onRefreshApp}
        onLanguageChange={handleLanguageChange}
        language={language}
        fontStyle={fontStyle}
        onFontStyleChange={handleFontStyleChange}
      />
      <div className="content">
        <ScriptureDisplay scripture={scripture} fontStyle={fontStyle} />
      </div>
      <Attribution photo={photo} />
    </div>
  );
}

export default App; 