import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import AudioBiblePlayer from './components/AudioBiblePlayer';
import SettingsPanel from './components/SettingsPanel';
import icon from './icon.svg';
import html2canvas from 'html2canvas';
import VerseSearchBar from './components/VerseSearchBar';

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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>(() => localStorage.getItem('tabspire_voice') || '');
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioKey, setAudioKey] = useState(0);
  const [showDateTime, setShowDateTime] = useState(() => {
    const stored = localStorage.getItem('tabspire_show_datetime');
    return stored === null ? true : stored === 'true';
  });
  type CustomBg = { type: 'color' | 'gradient' | 'image' | ''; value: string };
  const getStoredBg = (): CustomBg => {
    try {
      const raw = localStorage.getItem('tabspire_custom_bg');
      if (!raw) return { type: '', value: '' };
      return JSON.parse(raw);
    } catch {
      return { type: '', value: '' };
    }
  };
  const [customBackground, setCustomBackground] = useState<CustomBg>(getStoredBg());

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

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
    localStorage.setItem('tabspire_theme', theme);
  };

  // Fetch browser voices for TTS
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      if (!selectedVoice && allVoices.length > 0) {
        setSelectedVoice(allVoices[0].voiceURI);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    // eslint-disable-next-line
  }, []);

  const handleVoiceChange = (voiceURI: string) => {
    setSelectedVoice(voiceURI);
    localStorage.setItem('tabspire_voice', voiceURI);
  };

  // Play logic for the verse card button
  async function fetchBibleIsAudioUrlWithTimeout(
    bibleId: string,
    bookId: string,
    chapterId: string,
    timeoutMs = 3000
  ): Promise<string | null> {
    const apiKey = process.env.REACT_APP_BIBLEIS_API_KEY;
    const url = `https://api.bible/v4/bibles/${bibleId}/chapters/${bookId}.${chapterId}/audio`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        headers: { 'api-key': apiKey || '' },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) return null;
      const data = await response.json();
      return data.data?.audioFiles?.[0]?.url || null;
    } catch {
      clearTimeout(timeout);
      return null;
    }
  }

  const playTTS = () => {
    if (scripture) {
      // Cancel any ongoing TTS
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(`${scripture.text} - ${scripture.reference}`);
      const voice = voices.find(v => v.voiceURI === selectedVoice);
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || language;
      utterance.onend = () => {
        setIsPlaying(false);
        setAudioLoading(false);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePlayVerse = async () => {
    if (!currentVerseRef) return;
    setIsPlaying(true);
    setAudioLoading(true);
    // Unmount audio element by clearing audioUrl and incrementing key
    setAudioUrl(null);
    setAudioKey(prev => prev + 1);
    const url = await fetchBibleIsAudioUrlWithTimeout(bibleId, currentVerseRef.bookId, currentVerseRef.chapterId);
    setAudioLoading(false);
    if (url) {
      setAudioUrl(url);
      setAudioKey(prev => prev + 1); // force remount
      setTimeout(() => {
        const audio = document.getElementById('bible-audio') as HTMLAudioElement;
        if (audio) {
          audio.play();
          audio.onended = () => {
            setIsPlaying(false);
            setAudioLoading(false);
          };
        }
      }, 100);
    } else {
      playTTS();
    }
  };

  // Share as image handler
  const handleShareImage = async () => {
    const shareCard = document.getElementById('share-card');
    if (!shareCard) return;
    // Use html2canvas to capture the card
    const canvas = await html2canvas(shareCard, { backgroundColor: null, useCORS: true });
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'verse.png', { type: 'image/png' });
      // Try Web Share API with files
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'Tabspire Verse', text: shareText });
        } catch {}
      } else {
        // Fallback: download the image
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'verse.png';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      }
    }, 'image/png');
  };

  // Handler to set a built-in or uploaded background
  const handleSetBackground = (bg: string, type: CustomBg['type']) => {
    const obj = { type, value: bg };
    setCustomBackground(obj);
    localStorage.setItem('tabspire_custom_bg', JSON.stringify(obj));
  };

  // Handler to reset to random/Unsplash
  const handleResetBackground = () => {
    setCustomBackground({ type: '', value: '' });
    localStorage.removeItem('tabspire_custom_bg');
  };

  // Handler for file upload
  const handleUploadBackground = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) {
        handleSetBackground(e.target.result as string, 'image');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleShowDateTimeChange = (val: boolean) => {
    setShowDateTime(val);
    localStorage.setItem('tabspire_show_datetime', val ? 'true' : 'false');
  };

  // Helper for pretty date/time
  function getPrettyDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    const time = now.toLocaleTimeString(undefined, {
      hour: 'numeric', minute: '2-digit', hour12: true
    });
    return `${date} · ${time}`;
  }

  // Handler to jump to a verse from search
  const handleJumpToVerse = (book: string, chapter: string, verse: string) => {
    // For now, just fetchScripture with the reference (API integration can be improved)
    fetchScripture({ bookId: book, chapterId: chapter, verseId: verse }, bibleId).then((verseRef) => {
      if (verseRef) setCurrentVerseRef(verseRef);
    });
  };

  if (loading || photoLoading) {
    return <div className="loading">Loading...</div>;
  }

  const shareText = scripture ? `${scripture.text} - ${scripture.reference}` : '';

  return (
    <div
      className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
      style={{
        backgroundColor: customBackground.type === 'color' ? customBackground.value : undefined,
        backgroundImage:
          customBackground.type === 'gradient' ? customBackground.value :
          customBackground.type === 'image' ? `url(${customBackground.value})` :
          photo ? `url(${photo.urls.regular})` : undefined,
        '--font-size': `${fontSize}rem`,
      } as React.CSSProperties}
    >
      {/* Logo at top left */}
      <img
        src={icon}
        alt="Tabspire Logo"
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          width: 56,
          height: 56,
          zIndex: 100,
          borderRadius: 16,
          boxShadow: '0 2px 8px #0002',
          padding: 6,
          background: 'rgba(255,255,255,0.7)',
        }}
      />
      {showThemeModal && <ThemeSelectModal onSelect={handleThemeSelect} />}
      <SettingsPanel
        open={settingsPanelOpen}
        onClose={() => setSettingsPanelOpen(false)}
        language={language}
        onLanguageChange={handleLanguageChange}
        fontStyle={fontStyle}
        onFontStyleChange={handleFontStyleChange}
        voices={voices}
        selectedVoice={selectedVoice}
        onVoiceChange={handleVoiceChange}
        theme={theme}
        onThemeChange={handleThemeChange}
        customBackground={customBackground}
        onSetBackground={handleSetBackground}
        onResetBackground={handleResetBackground}
        onUploadBackground={handleUploadBackground}
        showDateTime={showDateTime}
        onShowDateTimeChange={handleShowDateTimeChange}
      />
      <Controls
        onRefresh={handleRefresh}
        onToggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        onFontSizeChange={adjustFontSize}
        shareText={shareText}
        onShareImage={handleShareImage}
        showUpdateBanner={showUpdateBanner}
        onRefreshApp={onRefreshApp}
        onLanguageChange={handleLanguageChange}
        language={language}
        fontStyle={fontStyle}
        onFontStyleChange={handleFontStyleChange}
        onToggleHistoryPanel={() => setShowHistoryPanel(v => !v)}
        showHistoryPanel={showHistoryPanel}
        theme={theme}
        settingsButton={
          <button
            className="control-button"
            title="Settings"
            onClick={() => setSettingsPanelOpen(true)}
            style={{ fontSize: 18 }}
          >
            <span role="img" aria-label="Settings">⚙️</span>
          </button>
        }
      />
      {/* History panel (only for full theme) */}
      <HistoryPanel recentHistory={recentHistory} visible={theme === 'full' && showHistoryPanel} />
      <div className="content">
        <VerseSearchBar onSelect={handleJumpToVerse} bibleId={bibleId} />
        {showDateTime && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px auto',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                background: isDarkMode ? 'rgba(30,40,60,0.85)' : 'rgba(240,245,255,0.85)',
                color: isDarkMode ? '#e0e6ed' : '#222',
                borderRadius: 18,
                boxShadow: isDarkMode
                  ? '0 2px 8px #0006'
                  : '0 2px 8px #bcd0ee44',
                padding: '7px 22px 7px 16px',
                fontSize: 17,
                fontWeight: 500,
                fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
                letterSpacing: 0.2,
                gap: 10,
                userSelect: 'none',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {/* Calendar/clock icon */}
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: 6, opacity: 0.7}}>
                <circle cx="11" cy="11" r="10" stroke={isDarkMode ? '#38bdf8' : '#2563eb'} strokeWidth="2" fill="none" />
                <path d="M11 6v5l3 2" stroke={isDarkMode ? '#e0e6ed' : '#222'} strokeWidth="2" strokeLinecap="round" />
              </svg>
              {getPrettyDateTime()}
            </span>
          </div>
        )}
        <ScriptureDisplay
          scripture={scripture}
          fontStyle={fontStyle}
          onPlay={handlePlayVerse}
          isPlaying={isPlaying}
          disabled={audioLoading || isPlaying}
        />
        {/* Bookmarks row only for full theme */}
        {theme === 'full' && <BookmarksRow bookmarks={bookmarkLinks} />}
        {audioUrl && (
          <audio
            id="bible-audio"
            key={audioKey}
            src={audioUrl}
            controls
            autoPlay
            onEnded={() => { setIsPlaying(false); setAudioLoading(false); }}
            style={{ display: 'block', margin: '8px auto' }}
          />
        )}
        {audioLoading && <div style={{ color: '#38bdf8', fontSize: 14, textAlign: 'center' }}>Loading audio...</div>}
        {/* Hidden share card for image generation */}
        <div
          id="share-card"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 0,
            width: 600,
            height: 340,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: photo ? `url(${photo.urls.regular}) center/cover` : '#1a1a1a',
            color: isDarkMode ? 'white' : '#222',
            borderRadius: 18,
            boxShadow: '0 8px 32px #0004',
            overflow: 'hidden',
          }}
        >
          {/* Logo in share image */}
          <img
            src={icon}
            alt="Tabspire Logo"
            style={{
              position: 'absolute',
              top: 24,
              left: 24,
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.7)',
              boxShadow: '0 2px 8px #0002',
              padding: 6,
            }}
          />
          <div style={{
            position: 'relative',
            zIndex: 2,
            background: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
            borderRadius: 14,
            padding: '36px 32px',
            maxWidth: 480,
            textAlign: 'center',
            boxShadow: '0 2px 8px #0002',
          }}>
            <div style={{ fontFamily: fontStyle, fontSize: 28, lineHeight: 1.4, marginBottom: 18 }}>
              {scripture?.text}
            </div>
            <div style={{ fontSize: 20, fontStyle: 'italic', opacity: 0.85 }}>{scripture?.reference}</div>
            <div style={{ fontSize: 14, marginTop: 24, opacity: 0.7 }}>tabspire.com</div>
          </div>
        </div>
      </div>
      <Attribution photo={photo} />
      <Footer />
    </div>
  );
}

export default App; 