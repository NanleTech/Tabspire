import React from 'react';

interface ControlsProps {
  onRefresh: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onFontSizeChange: (delta: number) => void;
  shareText: string;
}

const Controls: React.FC<ControlsProps> = ({
  onRefresh,
  onToggleTheme,
  isDarkMode,
  onFontSizeChange,
  shareText,
}) => {
  const encodedText = encodeURIComponent(shareText);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  const telegramUrl = `https://t.me/share/url?text=${encodedText}`;

  return (
    <div className="controls">
      <button onClick={onRefresh} className="control-button" title="New Verse">
        ↻
      </button>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="control-button"
        title="Share on WhatsApp"
      >
        <span role="img" aria-label="WhatsApp">🟢</span>
      </a>
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="control-button"
        title="Share on Telegram"
      >
        <span role="img" aria-label="Telegram">📨</span>
      </a>
      <button onClick={onToggleTheme} className="control-button" title="Toggle Theme">
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      <div className="font-controls">
        <button onClick={() => onFontSizeChange(-0.2)} className="control-button" title="Decrease Font Size">
          A-
        </button>
        <button onClick={() => onFontSizeChange(0.2)} className="control-button" title="Increase Font Size">
          A+
        </button>
      </div>
    </div>
  );
};

export default Controls; 