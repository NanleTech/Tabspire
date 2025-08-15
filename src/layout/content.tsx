import VerseSearchBar from '../components/VerseSearchBar';
import ContentSlider from '../components/content_slider';
import BookmarksRow from '../components/BookmarksRow';
import type { ViewType, FontStyle, ThemeType } from '../enums';
import type { Scripture, Devotional } from '../types';

interface ContentProps {
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
  bibleId: string;
  theme: ThemeType;
  bookmarkLinks: Array<{ id: string; url: string; title?: string }>;
}

const Content: React.FC<ContentProps> = ({
  scripture,
  devotional,
  fontStyle,
  fontSize,
  isDarkMode,
  currentView,
  onViewChange,
  onPlay,
  isPlaying,
  disabled,
  elevenLabsVoiceId,
  bibleId,
  theme,
  bookmarkLinks,
}) => {
  return (
    <div className="content">
      {currentView === "scripture" && (
        <VerseSearchBar onSelect={() => {}} bibleId={bibleId} />
      )}

      <ContentSlider
        scripture={scripture}
        devotional={devotional}
        fontStyle={fontStyle}
        fontSize={fontSize}
        isDarkMode={isDarkMode}
        currentView={currentView}
        onViewChange={onViewChange}
        onPlay={onPlay}
        isPlaying={isPlaying}
        disabled={disabled}
        elevenLabsVoiceId={elevenLabsVoiceId}
        bibleId={bibleId}
      />

      {/* Bookmarks */}
      {theme === "full" && <BookmarksRow bookmarks={bookmarkLinks} />}
    </div>
  );
};

export default Content;
