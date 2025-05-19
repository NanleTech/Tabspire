import React from 'react';

interface ControlsProps {
  onRefresh: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onFontSizeChange: (delta: number) => void;
  shareText: string;
  showUpdateBanner?: boolean;
  onRefreshApp?: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  onRefresh,
  onToggleTheme,
  isDarkMode,
  onFontSizeChange,
  shareText,
  showUpdateBanner = false,
  onRefreshApp,
}) => {
  const encodedText = encodeURIComponent(shareText);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  const telegramUrl = `https://t.me/share/url?text=${encodedText}`;

  return (
    <>
      {showUpdateBanner && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          background: '#fffae6',
          color: '#333',
          padding: '0.75rem 1rem',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          <span>A new version is available. Refresh to update.</span>
          <button onClick={onRefreshApp} style={{ marginLeft: '1rem', padding: '0.5rem 1rem', borderRadius: 4, border: 'none', background: '#3182ce', color: '#fff', cursor: 'pointer' }}>Refresh</button>
        </div>
      )}
      <div className="controls">
        <button onClick={onRefresh} className="control-button" title="New Verse">
          ↻
        </button>
        <button
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
    </>
  );
};

export default Controls; 