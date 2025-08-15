import type { ThemeType } from '../enums';

interface ThemeSelectModalProps {
  onSelect: (theme: ThemeType) => void;
}

const themes: Array<{ key: ThemeType; name: string; description: string }> = [
  {
    key: 'minimal',
    name: 'Minimal',
    description: 'Just the Bible verse and controls.'
  },
  {
    key: 'full',
    name: 'Full',
    description: 'Bible verse, controls, history, and bookmarks.'
  }
];

const ThemeSelectModal: React.FC<ThemeSelectModalProps> = ({ onSelect }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.45)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: 32,
        minWidth: 320,
        boxShadow: '0 8px 32px #0004',
        textAlign: 'center',
      }}>
        <h2 style={{marginBottom: 24}}>Choose Your Tabspire Theme</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {themes.map(theme => (
            <button
              key={theme.key}
              type="button"
              onClick={() => onSelect(theme.key)}
              style={{
                padding: '16px 20px',
                borderRadius: 8,
                border: '2px solid #38bdf8',
                background: '#f8fafc',
                color: '#222',
                fontWeight: 600,
                fontSize: 18,
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#38bdf8';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.color = '#222';
              }}
              onFocus={e => {
                e.currentTarget.style.background = '#38bdf8';
                e.currentTarget.style.color = '#fff';
              }}
              onBlur={e => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.color = '#222';
              }}
            >
              {theme.name}
              <div style={{ fontWeight: 400, fontSize: 14, marginTop: 6 }}>{theme.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectModal; 