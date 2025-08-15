import type { Scripture, Devotional, ContentSliderProps } from '../types';
import ScriptureDisplay from './scripture_display';
import DevotionalDisplay from './devotional_display';

const ContentSlider: React.FC<ContentSliderProps> = ({
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
}) => {
  return (
    <div className="relative">
      {/* View Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => onViewChange('scripture')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            currentView === 'scripture'
              ? isDarkMode
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                : 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
              : isDarkMode
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📖 Bible Verse
        </button>
        <button
          type="button"
          onClick={() => onViewChange('devotional')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            currentView === 'devotional'
              ? isDarkMode
                ? 'bg-success-600 text-white shadow-lg shadow-success-600/30'
                : 'bg-success-600 text-white shadow-lg shadow-success-600/30'
              : isDarkMode
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ✨ Daily Devotional
        </button>
      </div>

      {/* Content Area */}
      <div className={`relative ${
        currentView === 'devotional' ? 'min-h-[360px]' : 'min-h-[280px]'
      }`}>
        <div className="transition-all duration-500 ease-in-out transform">
          {currentView === 'scripture' ? (
            <div className="text-center animate-fade-in">
              {scripture ? (
                <ScriptureDisplay
                  scripture={scripture}
                  fontStyle={fontStyle}
                  fontSize={fontSize}
                  onPlay={onPlay}
                  isPlaying={isPlaying}
                  disabled={disabled}
                  elevenLabsVoiceId={elevenLabsVoiceId}
                  isDarkMode={isDarkMode}
                />
              ) : (
                <div className={`text-lg ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No scripture available
                </div>
              )}
            </div>
          ) : (
            <div className="text-center animate-fade-in">
              {devotional ? (
                <DevotionalDisplay
                  devotional={devotional}
                  fontStyle={fontStyle}
                  fontSize={fontSize}
                  isDarkMode={isDarkMode}
                  bibleId={bibleId}
                  onPlay={onPlay}
                  isPlaying={isPlaying}
                  disabled={disabled}
                  elevenLabsVoiceId={elevenLabsVoiceId}
                />
              ) : (
                <div className={`text-lg ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No devotional available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentSlider;
