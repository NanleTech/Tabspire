import type { Scripture } from '../types';
import Card from './ui/card';

interface ScriptureDisplayProps {
  scripture: Scripture;
  fontStyle: string;
  fontSize: number;
  onPlay: () => void;
  isPlaying: boolean;
  disabled: boolean;
  elevenLabsVoiceId: string;
  isDarkMode?: boolean;
}

const ScriptureDisplay: React.FC<ScriptureDisplayProps> = ({
  scripture,
  fontStyle,
  fontSize,
  onPlay,
  isPlaying,
  disabled,
  elevenLabsVoiceId,
  isDarkMode = false,
}) => {
  return (
    <Card
      isDarkMode={isDarkMode}
      padding="sm"
      variant="elevated"
      className="max-w-2xl mx-auto text-center min-h-[280px] flex flex-col"
    >
      <div className="flex-1 flex flex-col justify-center py-1">
        <div
          className={`text-lg leading-relaxed mb-2 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-800'
          }`}
          style={{ fontFamily: fontStyle, fontSize: `${fontSize}rem` }}
        >
          {scripture.text}
        </div>
        <div className={`text-base mb-2 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`} style={{ fontSize: `${fontSize * 0.6}rem` }}>
          {scripture.reference}
        </div>
        
        {/* Audio Button */}
        {elevenLabsVoiceId && elevenLabsVoiceId.trim() !== "" && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={onPlay}
              disabled={disabled}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : isPlaying
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              title={isPlaying ? 'Stop Audio' : 'Listen to Audio'}
            >
              {isPlaying ? '⏹️ Stop' : '🔊 Listen'}
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ScriptureDisplay; 