import React from 'react';

interface HistoryPanelProps {
  recentHistory: { id?: string; url: string; title?: string }[];
  visible: boolean;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ recentHistory, visible }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: 'absolute',
      top: 64,
      left: 16,
      zIndex: 30,
      background: 'rgba(30,41,59,0.98)',
      color: '#f8fafc',
      borderRadius: 12,
      boxShadow: '0 8px 32px #0008',
      padding: 18,
      minWidth: 320,
      maxWidth: 400,
      maxHeight: 400,
      overflowY: 'auto',
    }}>
      <h4 style={{margin: 0, marginBottom: 12, letterSpacing: 1, fontWeight: 700}}>Recent History</h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {recentHistory.map(item => (
          <li
            key={item.id || item.url}
            style={{
              marginBottom: 10,
              background: '#222',
              borderRadius: 8,
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 2px 8px rgba(56,189,248,0.08)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onClick={() => window.open(item.url, '_blank')}
            onMouseOver={e => (e.currentTarget.style.background = '#334155')}
            onMouseOut={e => (e.currentTarget.style.background = '#222')}
            title={item.url}
          >
            <span style={{ flex: 1, marginRight: 12, fontWeight: 500, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title || item.url || 'No title'}</span>
            <span style={{ color: '#38bdf8', fontSize: 12, marginLeft: 8, direction: 'ltr' }}>{item.url.replace(/^https?:\/\//, '').split('/')[0]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryPanel; 