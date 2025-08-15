// App Constants
export const APP_VERSION = '1.0.0';
export const CACHE_KEY = 'unsplash_photo_cache';

// Bible Language IDs
export const LANGUAGE_BIBLE_IDS: Record<string, string> = {
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

// ElevenLabs Constants
export const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL';

// Built-in Backgrounds
export const BUILTIN_BACKGROUNDS = [
  { type: 'color', value: '#1a1a1a' },
  { type: 'color', value: '#f8fafc' },
  { type: 'color', value: '#38bdf8' },
  { type: 'gradient', value: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #fbbf24 0%, #f472b6 100%)' },
  { type: 'image', value: '/images/1.jpg' },
  { type: 'image', value: '/images/2.jpg' },
  { type: 'image', value: '/images/3.jpg' },
] as const;

// Fallback Images
export const FALLBACK_IMAGES = [
  '/images/1.jpg',
  '/images/2.jpg',
  '/images/3.jpg',
  '/images/4.jpg',
  '/images/5.jpg',
  '/images/6.jpg',
];

// CORS Proxies
export const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://thingproxy.freeboard.io/fetch/',
];

// Cache Duration
export const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in ms

// Sample Verse for Preview
export const SAMPLE_VERSE = {
  text: 'For God so loved the world, that he gave his only Son...',
  reference: 'John 3:16',
};

// View Types
export type ViewType = 'scripture' | 'devotional';

// Theme Types
export type ThemeType = 'minimal' | 'full';

// Font Styles
export type FontStyle = 'serif' | 'sans-serif' | 'monospace' | 'cursive';

// Background Types
export type BackgroundType = 'color' | 'gradient' | 'image' | '';

// Button Variants
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'ghost' | 'outline';

// Button Sizes
export type ButtonSize = 'sm' | 'md' | 'lg';

// Card Variants
export type CardVariant = 'default' | 'elevated' | 'subtle';

// Card Padding
export type CardPadding = 'sm' | 'md' | 'lg';
