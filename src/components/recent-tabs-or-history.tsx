import React, { useEffect, useState, useRef } from 'react';

interface RecentTabsOrHistoryProps {
  mode: 'tabs' | 'history';
}

interface TabItem {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
  active?: boolean;
  pinned?: boolean;
}

interface HistoryItem {
  id: string;
  title: string;
  url: string;
  lastVisitTime?: number;
}

const fallbackIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="10" fill="#7dd3fc" />
    <text x="10" y="15" textAnchor="middle" fontSize="10" fill="#222">🌐</text>
  </svg>
);

const accent = '#38bdf8';
const bgGradient = 'linear-gradient(135deg, #222 0%, #1e293b 100%)';

const RecentTabsOrHistory: React.FC<RecentTabsOrHistoryProps> = ({ mode }) => {
  const [items, setItems] = useState<(TabItem | HistoryItem)[]>([]);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [showHistory, setShowHistory] = useState(true);
  const [historyHeight, setHistoryHeight] = useState<number | undefined>(undefined);
  const historyListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (mode === 'tabs' && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ lastFocusedWindow: true }, (tabs) => {
        const tabItems = tabs.slice(0, 10).map(tab => ({
          id: tab.id || 0,
          title: tab.title || tab.url || 'No title',
          url: tab.url || '',
          favIconUrl: tab.favIconUrl,
          active: tab.active,
          pinned: tab.pinned,
        }));
        setItems(tabItems);
      });
    } else if (mode === 'history' && chrome.history && chrome.history.search) {
      chrome.history.search({ text: '', maxResults: 10 }, (historyItems) => {
        const histItems = historyItems.map(item => ({
          id: item.id || item.url || '',
          title: item.title || item.url || 'No title',
          url: item.url || '',
          lastVisitTime: item.lastVisitTime,
        }));
        setItems(histItems);
      });
    } else {
      setApiAvailable(false);
    }
  }, [mode]);

  useEffect(() => {
    if (mode === 'history' && historyListRef.current) {
      setHistoryHeight(showHistory ? historyListRef.current.scrollHeight : 0);
    }
  }, [showHistory, items, mode]);

  const reversedItems = [...items].reverse();

  const formatTime = (ms?: number) => {
    if (!ms) return '';
    const date = new Date(ms);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!apiAvailable) {
    return (
      <div style={{ background: bgGradient, color: '#f8fafc', borderRadius: 8, padding: 12, margin: '16px 0', maxWidth: 500, direction: 'rtl' }}>
        <h3 style={{ marginTop: 0 }}>{mode === 'tabs' ? 'Recent Tabs' : 'Browser History'}</h3>
        <div style={{ color: '#f88', fontWeight: 500 }}>
          This feature is not available in this context.<br />
          Please use the extension popup to access recent tabs and history.
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: bgGradient, color: '#f8fafc', borderRadius: 8, padding: 12, margin: '16px 0', maxWidth: 500, direction: 'rtl', boxShadow: '0 4px 24px #0004' }}>
      <h3 style={{ marginTop: 0, marginBottom: 12, letterSpacing: 1 }}>
        {mode === 'tabs' ? 'Recent Tabs' : 'Browser History'}
        {mode === 'history' && (
          <button
            onClick={() => setShowHistory(v => !v)}
            style={{
              marginRight: 12,
              float: 'left',
              background: showHistory ? accent : '#222',
              color: showHistory ? '#111' : accent,
              border: 'none',
              borderRadius: 6,
              padding: '2px 10px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              transition: 'background 0.2s, color 0.2s',
              boxShadow: showHistory ? '0 2px 8px #38bdf855' : undefined,
            }}
            title={showHistory ? 'Hide history' : 'Show history'}
          >
            {showHistory ? 'Hide' : 'Show'}
          </button>
        )}
      </h3>
      {mode === 'history' && (
        <div style={{
          overflow: 'hidden',
          transition: 'height 0.35s cubic-bezier(.4,2,.6,1)',
          height: historyHeight,
        }}>
          <ul ref={historyListRef} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {showHistory && reversedItems.map((item) => (
              <li
                key={item.id}
                style={{
                  marginBottom: 12,
                  background: '#222',
                  borderRadius: 10,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 2px 12px rgba(56,189,248,0.08)',
                  transition: 'background 0.2s, transform 0.2s',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onClick={() => window.open(item.url, '_blank')}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#334155';
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#222';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title={item.url}
              >
                <span style={{ flex: 1, marginRight: 12, fontWeight: 500, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title}
                </span>
                <span style={{ color: accent, fontSize: 12, marginLeft: 8, direction: 'ltr' }}>
                  {item.url.replace(/^https?:\/\//, '').split('/')[0]}
                </span>
                {typeof (item as HistoryItem).lastVisitTime === 'number' && (
                  <span style={{ color: '#fbbf24', fontSize: 11, marginLeft: 8 }}>
                    {formatTime((item as HistoryItem).lastVisitTime)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {mode === 'tabs' && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {reversedItems.map((item) => (
            <li
              key={item.id}
              style={{
                marginBottom: 12,
                background: '#222',
                borderRadius: 10,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 12px rgba(56,189,248,0.08)',
                transition: 'background 0.2s, transform 0.2s',
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={() => window.open(item.url, '_blank')}
              onMouseOver={e => {
                e.currentTarget.style.background = '#334155';
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#222';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title={item.url}
            >
              {mode === 'tabs' && (
                (item as TabItem).favIconUrl ? (
                  <img
                    src={(item as TabItem).favIconUrl!}
                    alt="icon"
                    style={{ width: 22, height: 22, marginLeft: 8, borderRadius: 5, background: '#fff' }}
                    onError={e => ((e.target as HTMLImageElement).src = 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(item.url))}
                  />
                ) : (
                  <span style={{ width: 22, height: 22, marginLeft: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{fallbackIcon}</span>
                )
              )}
              <span style={{ flex: 1, marginRight: 12, fontWeight: 500, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.title}
                {(item as TabItem).active && <span style={{ color: accent, fontWeight: 700, marginRight: 6, fontSize: 12 }}>●</span>}
                {(item as TabItem).pinned && <span style={{ color: '#fbbf24', fontWeight: 700, marginRight: 6, fontSize: 12 }}>📌</span>}
              </span>
              <span style={{ color: accent, fontSize: 12, marginLeft: 8, direction: 'ltr' }}>
                {item.url.replace(/^https?:\/\//, '').split('/')[0]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentTabsOrHistory; 