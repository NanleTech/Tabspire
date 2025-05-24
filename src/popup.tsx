import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import RecentTabsOrHistory from './components/RecentTabsOrHistory';

const Popup: React.FC = () => {
  const [mode, setMode] = useState<'tabs' | 'history'>('tabs');

  useEffect(() => {
    if (chrome && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(['tabsOrHistoryMode'], (result) => {
        if (result.tabsOrHistoryMode === 'tabs' || result.tabsOrHistoryMode === 'history') setMode(result.tabsOrHistoryMode);
      });
    }
  }, []);

  useEffect(() => {
    if (chrome && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ tabsOrHistoryMode: mode });
    }
  }, [mode]);

  return (
    <div style={{ padding: 16, background: '#222', color: '#f8fafc', minWidth: 320, minHeight: 200, direction: 'rtl', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 300 }}>
      <div style={{ flex: 1 }}>
        <RecentTabsOrHistory mode={mode} />
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
        <span>Show:</span>
        <select
          value={mode}
          onChange={e => setMode(e.target.value as 'tabs' | 'history')}
          style={{ background: '#111', color: '#f8fafc', border: '1px solid #444', borderRadius: 4 }}
        >
          <option value="tabs">Recent Tabs</option>
          <option value="history">Browser History</option>
        </select>
      </label>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<Popup />); 