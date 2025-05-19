import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { useScripture } from './hooks/useScripture';
import { useUnsplash } from './hooks/useUnsplash';
import ScriptureDisplay from './components/scripture-display';
import Attribution from './components/attribution';
import Controls from './components/controls';

const APP_VERSION = '1.0.0'; // Update this on each deploy
const CACHE_KEY = 'unsplash_photo_cache';

function App() {
  const { scripture, loading: scriptureLoading, fetchScripture } = useScripture();
  const { photo, loading: photoLoading, fetchPhoto } = useUnsplash();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(2); // in rem
  const [loading, setLoading] = useState(true);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    Promise.all([fetchScripture(), fetchPhoto()]).finally(() => setLoading(false));
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

  useEffect(() => {
    Promise.all([fetchScripture()]).finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  if (loading || scriptureLoading || photoLoading) {
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
      />
      <div className="content">
        <ScriptureDisplay scripture={scripture} />
      </div>
      <Attribution photo={photo} />
    </div>
  );
}

export default App; 