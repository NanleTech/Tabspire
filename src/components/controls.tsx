import React from 'react';

interface ControlsProps {
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
}

const Controls: React.FC<ControlsProps> = ({
  onRefresh,
  onToggleTheme,
  isDarkMode,
  onFontSizeChange,
  shareText,
  showUpdateBanner = false,
  onRefreshApp,
  onLanguageChange,
  language,
  fontStyle,
  onFontStyleChange,
  onToggleHistoryPanel,
  showHistoryPanel,
  theme,
}) => {
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
        {theme === 'full' && (
          <button
            onClick={onToggleHistoryPanel}
            className="control-button"
            title={showHistoryPanel ? 'Hide History' : 'Show History'}
            style={{ fontSize: 18, background: showHistoryPanel ? '#38bdf8' : undefined, color: showHistoryPanel ? '#fff' : undefined }}
          >
            <span role="img" aria-label="history">🕒</span>
          </button>
        )}
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
        <select
          value={language}
          onChange={e => onLanguageChange(e.target.value)}
          className="control-button"
          title="Select Language"
          style={{ minWidth: 90 }}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="hat">Haitian Creole</option>
          <option value="hau">Hausa</option>
          <option value="hbo">Hebrew (Ancient)</option>
          <option value="heb">Hebrew (Modern)</option>
          <option value="hi">Hindi</option>
          <option value="hrv">Croatian</option>
          <option value="hun">Hungarian</option>
          <option value="ibo">Igbo</option>
          <option value="ind">Indonesian</option>
          <option value="isl">Icelandic</option>
          <option value="ita">Italian</option>
          <option value="pol">Polish</option>
          <option value="por">Portuguese</option>
          <option value="swh">Swahili</option>
          <option value="vie">Vietnamese</option>
          <option value="yor">Yoruba</option>
          <option value="ukr">Ukrainian</option>
          <option value="lug">Luganda</option>
          <option value="lin">Lingala</option>
          <option value="nya">Chichewa</option>
          <option value="nob">Norwegian</option>
          <option value="sna">Shona</option>
          <option value="twi">Twi</option>
        </select>
        <select
          value={fontStyle}
          onChange={e => onFontStyleChange(e.target.value)}
          className="control-button"
          title="Font Style"
          style={{ minWidth: 90 }}
        >
          <option value="serif">Serif</option>
          <option value="sans-serif">Sans Serif</option>
          <option value="monospace">Monospace</option>
          <option value="cursive">Cursive</option>
        </select>
      </div>
    </>
  );
};

export default Controls; 