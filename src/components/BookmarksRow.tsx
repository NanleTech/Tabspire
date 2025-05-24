import React from 'react';

interface BookmarksRowProps {
  bookmarks: { id: string; url: string; title?: string }[];
}

const BookmarksRow: React.FC<BookmarksRowProps> = ({ bookmarks }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, margin: '18px 0 0 0' }}>
    {bookmarks.slice(0, 5).map(bm => (
      <button
        key={bm.id}
        onClick={() => window.open(bm.url, '_blank')}
        style={{
          background: 'rgba(255,255,255,0.7)',
          border: 'none',
          borderRadius: 8,
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          padding: 0,
          transition: 'background 0.2s',
        }}
        title={bm.title || bm.url}
        onMouseOver={e => (e.currentTarget.style.background = '#38bdf8')}
        onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.7)')}
      >
        <img
          src={'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(bm.url)}
          alt="icon"
          style={{ width: 22, height: 22, borderRadius: 4, background: '#fff' }}
          onError={e => ((e.target as HTMLImageElement).src = 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(bm.url))}
        />
      </button>
    ))}
  </div>
);

export default BookmarksRow; 