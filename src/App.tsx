import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { useScripture } from './hooks/useScripture';
import { useUnsplash } from './hooks/useUnsplash';
import ScriptureDisplay from './components/scripture-display';
import Attribution from './components/attribution';
import Controls from './components/controls';

function App() {
  const { scripture, loading: scriptureLoading, fetchScripture } = useScripture();
  const { photo, loading: photoLoading, fetchPhoto } = useUnsplash();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(2); // in rem
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    Promise.all([fetchScripture(), fetchPhoto()]).finally(() => setLoading(false));
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
      />
      <div className="content">
        <ScriptureDisplay scripture={scripture} />
      </div>
      <Attribution photo={photo} />
    </div>
  );
}

export default App; 