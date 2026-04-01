import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import type { ViewType, ThemeType, FontStyle, BackgroundType } from '../enums';
import type { CustomBackground, Scripture, UnsplashPhoto, Devotional } from '../types';
import { usePersistedState } from '../hooks/use-persisted-state';
import { LANGUAGE_BIBLE_IDS, DEFAULT_VOICE_ID } from '../enums';

interface AppStateContextType {
  // Core state
  language: string;
  setLanguage: (lang: string) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  fontSize: number;
  adjustFontSize: (delta: number) => void;
  fontStyle: FontStyle;
  setFontStyle: (style: FontStyle) => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  elevenLabsVoiceId: string;
  setElevenLabsVoiceId: (voiceId: string) => void;
  
  // Computed
  bibleId: string;
  
  // Data (from hooks)
  scripture: Scripture | null;
  photo: UnsplashPhoto | null;
  devotional: Devotional | null;
  customBackground: CustomBackground;
  setCustomBackground: (bg: CustomBackground) => void;
  
  // UI state
  showDateTime: boolean;
  setShowDateTime: (value: boolean) => void;
  settingsPanelOpen: boolean;
  setSettingsPanelOpen: (value: boolean) => void;
  showHistoryPanel: boolean;
  setShowHistoryPanel: (value: boolean) => void;
  
  // Loading states
  isDataLoading: boolean;
  
  // Actions
  handleRefresh: () => void;
  toggleTheme: () => void;
  handleLanguageChange: (lang: string) => void;
  handleThemeSelect: (selectedTheme: ThemeType) => void;
  handleSetBackground: (bg: string, type: BackgroundType) => void;
  handleResetBackground: () => void;
  handleUploadBackground: (file: File) => void;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

interface AppStateProviderProps {
  children: React.ReactNode;
  scripture: Scripture | null;
  photo: UnsplashPhoto | null;
  devotional: Devotional | null;
  fetchScripture: (verseRef?: unknown, overrideBibleId?: string) => Promise<unknown>;
  fetchPhoto: () => Promise<void>;
  refetchDevotional: () => Promise<void>;
  scriptureReady: boolean;
  photoReady: boolean;
}

export function AppStateProvider({ 
  children, 
  scripture, 
  photo, 
  devotional,
  fetchScripture,
  fetchPhoto,
  refetchDevotional,
  scriptureReady,
  photoReady
}: AppStateProviderProps) {
  // Core state with persistence
  const [language, setLanguage] = usePersistedState('tabspire_language', 'en');
  const [currentView, setCurrentView] = useState<ViewType>('scripture');
  const [isDarkMode, setIsDarkMode] = usePersistedState('tabspire_dark_mode', true);
  const [fontSize, setFontSize] = usePersistedState('tabspire_font_size', 1.4);
  const [fontStyle, setFontStyle] = usePersistedState<FontStyle>('tabspire_font_style', 'serif');
  const [theme, setTheme] = usePersistedState<ThemeType>('tabspire_theme', 'minimal');
  const [elevenLabsVoiceId, setElevenLabsVoiceId] = usePersistedState('tabspire_elevenlabs_voice_id', DEFAULT_VOICE_ID);
  const [showDateTime, setShowDateTime] = usePersistedState('tabspire_show_datetime', true);
  
  // UI state (not persisted)
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  
  // Background state
  const [customBackground, setCustomBackground] = usePersistedState<CustomBackground>('tabspire_custom_bg', { type: '', value: '' });
  
  // Computed
  const bibleId = LANGUAGE_BIBLE_IDS[language];
  const isDataLoading = !scriptureReady && !photoReady;
  
  // Actions
  const adjustFontSize = useCallback((delta: number) => {
    setFontSize((prev) => Math.max(0.6, Math.min(3, prev + delta)));
  }, [setFontSize]);
  
  const toggleTheme = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode, setIsDarkMode]);
  
  const handleRefresh = useCallback(() => {
    fetchScripture();
    fetchPhoto();
    refetchDevotional();
  }, [fetchScripture, fetchPhoto, refetchDevotional]);
  
  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang);
    fetchScripture(undefined, LANGUAGE_BIBLE_IDS[lang]);
  }, [setLanguage, fetchScripture]);
  
  const handleThemeSelect = useCallback((selectedTheme: ThemeType) => {
    setTheme(selectedTheme);
  }, [setTheme]);
  
  const handleSetBackground = useCallback((bg: string, type: BackgroundType) => {
    setCustomBackground({ type, value: bg });
  }, [setCustomBackground]);
  
  const handleResetBackground = useCallback(() => {
    setCustomBackground({ type: '', value: '' });
  }, [setCustomBackground]);
  
  const handleUploadBackground = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setCustomBackground({ type: 'image', value: e.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  }, [setCustomBackground]);
  
  const value: AppStateContextType = {
    language,
    setLanguage,
    currentView,
    setCurrentView,
    isDarkMode,
    setIsDarkMode,
    fontSize,
    adjustFontSize,
    fontStyle,
    setFontStyle,
    theme,
    setTheme,
    elevenLabsVoiceId,
    setElevenLabsVoiceId,
    bibleId,
    scripture,
    photo,
    devotional,
    customBackground,
    setCustomBackground,
    showDateTime,
    setShowDateTime,
    settingsPanelOpen,
    setSettingsPanelOpen,
    showHistoryPanel,
    setShowHistoryPanel,
    isDataLoading,
    handleRefresh,
    toggleTheme,
    handleLanguageChange,
    handleThemeSelect,
    handleSetBackground,
    handleResetBackground,
    handleUploadBackground,
  };
  
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
