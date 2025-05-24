import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { useScripture } from './hooks/useScripture';
import { useUnsplash } from './hooks/useUnsplash';
import ScriptureDisplay from './components/scripture-display';
import Attribution from './components/attribution';
import Controls from './components/controls';
import ThemeSelectModal from './components/ThemeSelectModal';
import Footer from './components/Footer';
import BookmarksRow from './components/BookmarksRow';
import HistoryPanel from './components/HistoryPanel';

const APP_VERSION = '1.0.0'; // Update this on each deploy
const CACHE_KEY = 'unsplash_photo_cache';

const LANGUAGE_BIBLE_IDS: Record<string, string> = {
  en: 'de4e12af7f28f599-02', // English (ESV)
  es: '592420522e16049f-01', // Spanish (Reina Valera 1909)
  hat: 'hatbsa', // Haitian Creole (Bib Sen An)
  hau: '0ab0c764d56a715d-01', // Hausa (Biblica Open Hausa Contemporary Bible 2020)
  hbo: '0b262f1ed7f084a6-01', // Hebrew, Ancient (Westminister Leningrad Codex)
  heb: 'a8a97eebae3c98e4-01', // Hebrew, Modern (Biblica Open Hebrew Living New Testament 2009)
  hi: '1e8ab327edbce67f-01', // Hindi (Indian Revised Version Hindi - 2019)
  hrv: 'b00de703b3d02a5a-01', // Croatian (Biblica Open Croatian Living New Testament 2000)
  hun: 'fcfc25677b0a53c9-01', // Hungarian (Biblica Open Hungarian New Testament)
  ibo: 'a36fc06b086699f1-02', // Igbo (Biblica Open Igbo Contemporary Bible 2020)
  ind: '2dd568eeff29fb3c-02', // Indonesian (Plain Indonesian Translation)
  isl: 'e4581313051f2861-01', // Icelandic (Biblica Open Icelandic Contemporary NT and Psalms)
  ita: '41f25b97f468e10b-01', // Italian (Diodati Bible 1885)
  pol: 'fbb8b0e1943b417c-01', // Polish (Biblica Open Polish Living New Testament 2016)
  por: 'd63894c8d9a7a503-01', // Portuguese (Biblia Livre Para Todos)
  swh: '611f8eb23aec8f13-01', // Swahili (Biblica Open Kiswahili Contemporary Version)
  vie: '5cc7093967a0a392-01', // Vietnamese (Biblica Open Vietnamese Contemporary Bible 2015)
  yor: 'b8d1feac6e94bd74-01', // Yoruba (Biblica Open Yoruba Contemporary Bible 2017)
  ukr: '6c696cd1d82e2723-03', // Ukrainian (Biblica Open New Ukrainian Translation 2022)
  lug: 'f276be3571f516cb-01', // Luganda (Biblica Open Luganda Contemporary Bible 2014)
  lin: 'ac6b6b7cd1e93057-01', // Lingala (Biblica Open Lingala Contemporary Bible 2020)
  nya: '43247c35dbe56e1c-01', // Chichewa (Biblica Open God's Word in Contemporary Chichewa 2016)
  nob: '246ad95eade0d0a1-01', // Norwegian (Biblica Open Norwegian Living New Testament)
  sna: 'e8d99085dcb83ab5-01', // Shona (Biblica Open Shona Contemporary Bible)
  twi: 'b6aee081108c0bc6-01', // Twi (Biblica Open Akuapem Twi Contemporary Bible 2020)
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
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [bookmarkLinks, setBookmarkLinks] = useState<any[]>([]);
  const [recentHistory, setRecentHistory] = useState<any[]>([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('tabspire_theme') || '');
  const [showThemeModal, setShowThemeModal] = useState(false);

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

  // Fetch first 5 bookmarks (flattened)
  useEffect(() => {
    if (chrome.bookmarks && chrome.bookmarks.getTree) {
      chrome.bookmarks.getTree((nodes) => {
        // Flatten bookmarks tree
        const flatten = (arr: any[]): any[] => arr.reduce((acc, node) => {
          if (node.url) acc.push(node);
          if (node.children) acc.push(...flatten(node.children));
          return acc;
        }, []);
        const allBookmarks = flatten(nodes);
        console.log('Fetched bookmarks:', allBookmarks);
        setBookmarkLinks(allBookmarks.slice(0, 5));
      });
    }
  }, []);

  // Fetch recent history (10 items)
  useEffect(() => {
    if (chrome.history && chrome.history.search) {
      chrome.history.search({ text: '', maxResults: 10 }, (historyItems) => {
        setRecentHistory(historyItems);
      });
    }
  }, []);

  // Show modal if no theme is selected
  useEffect(() => {
    if (!theme) setShowThemeModal(true);
  }, [theme]);

  const handleThemeSelect = (selectedTheme: string) => {
    setTheme(selectedTheme);
    localStorage.setItem('tabspire_theme', selectedTheme);
    setShowThemeModal(false);
  };

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
      {showThemeModal && <ThemeSelectModal onSelect={handleThemeSelect} />}
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
        onToggleHistoryPanel={() => setShowHistoryPanel(v => !v)}
        showHistoryPanel={showHistoryPanel}
        theme={theme}
      />
      {/* History panel (only for full theme) */}
      <HistoryPanel recentHistory={recentHistory} visible={theme === 'full' && showHistoryPanel} />
      <div className="content">
        <ScriptureDisplay scripture={scripture} fontStyle={fontStyle} />
        {/* Bookmarks row only for full theme */}
        {theme === 'full' && <BookmarksRow bookmarks={bookmarkLinks} />}
      </div>
      <Attribution photo={photo} />
      <Footer />
    </div>
  );
}

export default App; 