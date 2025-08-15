import type { FontStyle, ThemeType, ViewType } from '../enums';

// Core Types
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

export interface Devotional {
  title: string;
  content: string;
  date: string;
  reference: string;
  url: string;
}

// Component Props
export interface ScriptureDisplayProps {
  scripture: Scripture;
  fontStyle: string;
  onPlay: () => void;
  isPlaying: boolean;
  disabled: boolean;
  elevenLabsVoiceId: string;
  isDarkMode?: boolean;
}

export interface DevotionalDisplayProps {
  devotional: Devotional;
  fontStyle: string;
  isDarkMode: boolean;
  bibleId?: string;
  onPlay?: () => void;
  isPlaying?: boolean;
  disabled?: boolean;
  elevenLabsVoiceId?: string;
}

export interface ReadMoreModalProps {
  devotional: Devotional;
  isOpen: boolean;
  onClose: () => void;
  fontStyle: string;
  fontSize: number;
  isDarkMode: boolean;
}

export interface ContentSliderProps {
  scripture: Scripture | null;
  devotional: Devotional | null;
  fontStyle: FontStyle;
  fontSize: number;
  isDarkMode: boolean;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onPlay: () => void;
  isPlaying: boolean;
  disabled: boolean;
  elevenLabsVoiceId: string;
  bibleId?: string;
}

export interface ControlsProps {
  onRefresh: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onFontSizeChange: (delta: number) => void;
  shareText: string;
  showUpdateBanner?: boolean;
  onRefreshApp?: () => void;
  onLanguageChange: (lang: string) => void;
  language: string;
  fontStyle: string;
  onFontStyleChange: (style: string) => void;
  onToggleHistoryPanel: () => void;
  showHistoryPanel: boolean;
  theme: string;
  settingsButton?: React.ReactNode;
  onShareImage?: () => void;
  onRefreshDevotional?: () => void;
  currentView?: 'scripture' | 'devotional';
}

export interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  fontStyle: string;
  onFontStyleChange: (style: string) => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  onVoiceChange: (voiceURI: string) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
  customBackground: CustomBackground;
  onSetBackground: (bg: string, type: 'color' | 'gradient' | 'image' | '') => void;
  onResetBackground: () => void;
  onUploadBackground: (file: File) => void;
  showDateTime: boolean;
  onShowDateTimeChange: (val: boolean) => void;
  elevenLabsVoiceId?: string;
  onElevenLabsVoiceChange?: (voiceId: string) => void;
}

export interface FooterProps {
  photo: UnsplashPhoto | null;
}

export interface ThemeSelectModalProps {
  onSelect: (theme: string) => void;
}

export interface BookmarksRowProps {
  bookmarks: { id: string; url: string; title?: string }[];
}

export interface HistoryPanelProps {
  recentHistory: { id?: string; url: string; title?: string }[];
  visible: boolean;
}

export interface RecentTabsOrHistoryProps {
  mode: 'tabs' | 'history';
}

export interface VerseSearchBarProps {
  onSelect: (book: string, chapter: string, verse: string) => void;
  bibleId?: string;
}

// UI Component Props
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  title?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  isDarkMode?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'subtle';
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isDarkMode?: boolean;
  className?: string;
}

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  content: React.ReactNode;
}

export interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
}

// App State Types
export interface CustomBackground {
  type: 'color' | 'gradient' | 'image' | '';
  value: string;
}

export interface UnsplashPhotoCache {
  photo: UnsplashPhoto;
  timestamp: number;
  version: string;
}

export interface ContentSlider {
  currentView: 'scripture' | 'devotional';
}

// Hook Return Types
export interface UseScriptureReturn {
  scripture: Scripture | null;
  loading: boolean;
  fetchScripture: (verseRef?: BibleVerse, overrideBibleId?: string) => Promise<BibleVerse | undefined>;
}

export interface UseUnsplashReturn {
  photo: UnsplashPhoto | null;
  loading: boolean;
  fetchPhoto: () => Promise<void>;
}

export interface UseDevotionalReturn {
  devotional: Devotional | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} 