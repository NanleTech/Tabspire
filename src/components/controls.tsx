import React from 'react';
import type { FontStyle, ThemeType } from '../enums';

interface ControlsProps {
  onRefresh: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onFontSizeChange: (delta: number) => void;
  shareText: string;
  onLanguageChange: (lang: string) => void;
  language: string;
  fontStyle: FontStyle;
  onFontStyleChange: (style: FontStyle) => void;
  onToggleHistoryPanel: () => void;
  showHistoryPanel: boolean;
  theme: ThemeType;
  settingsButton?: React.ReactNode;
  onRefreshDevotional?: () => void;
  currentView?: 'scripture' | 'devotional';
}

const Controls: React.FC<ControlsProps> = ({
  onRefresh,
  onToggleTheme,
  isDarkMode,
  onFontSizeChange,
  shareText,
  onLanguageChange,
  language,
  fontStyle,
  onFontStyleChange,
  onToggleHistoryPanel,
  showHistoryPanel,
  theme,
  settingsButton,
  onRefreshDevotional,
  currentView,
}) => {
  return (
    <div className="controls">
      {theme === 'full' && (
        <button
          type="button"
          onClick={onToggleHistoryPanel}
          className="control-button"
          title={showHistoryPanel ? 'Hide History' : 'Show History'}
          style={{ fontSize: 18, background: showHistoryPanel ? '#38bdf8' : undefined, color: showHistoryPanel ? '#fff' : undefined }}
        >
          <span role="img" aria-label="history">🕒</span>
        </button>
      )}
      <button 
        type="button"
        onClick={onRefresh} 
        className="control-button" 
        title="New Verse"
      >
        ↻
      </button>
      {onRefreshDevotional && currentView === 'devotional' && (
        <button 
          type="button"
          onClick={onRefreshDevotional} 
          className="control-button" 
          title="New Devotional"
          style={{ fontSize: 16 }}
        >
          ✨
        </button>
      )}
      <button
        type="button"
        className="control-button"
        title="Share"
        onClick={async () => {
          if (navigator.share) {
            try {
              await navigator.share({ text: shareText });
            } catch {}
          } else {
            try {
              await navigator.clipboard.writeText(shareText);
              alert('Verse copied to clipboard!');
            } catch {
              alert('Could not copy to clipboard.');
            }
          }
        }}
      >
        <span role="img" aria-label="Share">🔗</span>
      </button>
      <button 
        type="button"
        onClick={onToggleTheme} 
        className="control-button" 
        title="Toggle Theme"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      <div className="font-controls">
        <button 
          type="button"
          onClick={() => onFontSizeChange(-0.2)} 
          className="control-button" 
          title="Decrease Font Size"
        >
          A-
        </button>
        <button 
          type="button"
          onClick={() => onFontSizeChange(0.2)} 
          className="control-button" 
          title="Increase Font Size"
        >
          A+
        </button>
      </div>
      {settingsButton}
    </div>
  );
};

export default Controls; 