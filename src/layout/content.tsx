import SimpleModeView from '../components/simple-mode-view';
import WorkModeView from '../components/work-mode-view';
import FullModeView from '../components/full-mode-view';
import DevotionalModern from '../components/devotional-modern';
import GoalsDashboardView from '../components/goals-dashboard-view';
import type { ViewType, FontStyle, ThemeType } from '../enums';
import type { Scripture, Devotional } from '../types';

interface ContentProps {
  mode: 'simple' | 'work' | 'full';
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
  isDataLoading?: boolean;
  onRefresh: () => void;
}

const Content: React.FC<ContentProps> = ({
  mode,
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
  onRefresh,
}) => {
  if (currentView === 'devotional') {
    return (
      <div className="content work-content">
        {devotional ? (
          <DevotionalModern
            devotional={devotional}
            fontStyle={fontStyle}
            fontSize={fontSize}
            isDarkMode={isDarkMode}
            onPlay={onPlay}
            isPlaying={isPlaying}
            disabled={disabled}
            onBack={() => onViewChange('scripture')}
          />
        ) : (
          <div className="mx-auto max-w-xl rounded-2xl border border-white/20 bg-black/35 px-6 py-8 text-center text-white/80 backdrop-blur-md">
            Loading devotional...
          </div>
        )}
      </div>
    );
  }

  if (currentView === 'goals' && mode === 'full') {
    return (
      <div className="content work-content">
        <GoalsDashboardView onBack={() => onViewChange('scripture')} />
      </div>
    );
  }

  if (mode === 'simple') {
    return (
      <div className="content work-content">
        <SimpleModeView
          scripture={scripture}
          onPlay={onPlay}
          onRefresh={onRefresh}
          onOpenDevotional={() => onViewChange('devotional')}
        />
      </div>
    );
  }

  if (mode === 'work') {
    return (
      <div className="content work-content">
        <WorkModeView
          scripture={scripture}
          onPlay={onPlay}
          onRefresh={onRefresh}
          onOpenDevotional={() => onViewChange('devotional')}
        />
      </div>
    );
  }

  return (
    <div className="content work-content">
      <FullModeView
        scripture={scripture}
        onPlay={onPlay}
        onRefresh={onRefresh}
        onOpenDevotional={() => onViewChange('devotional')}
        onOpenGoals={() => onViewChange('goals')}
      />
    </div>
  );
};

export default Content;
