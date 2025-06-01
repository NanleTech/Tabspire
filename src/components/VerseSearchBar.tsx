import React, { useState, useRef } from 'react';

// Helper: parse reference like 'John 3:16' or 'Jn 3:16'
function parseReference(input: string): { book: string; chapter: string; verse: string } | null {
  const refRegex = /^([1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+)$/;
  const match = input.trim().match(refRegex);
  if (!match) return null;
  return { book: match[1].replace(/\s+/g, ''), chapter: match[2], verse: match[3] };
}

interface VerseSearchBarProps {
  onSelect: (book: string, chapter: string, verse: string) => void;
  bibleId?: string;
}

const VerseSearchBar: React.FC<VerseSearchBarProps> = ({ onSelect, bibleId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search handler
  const handleSearch = async (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    // Reference search
    const ref = parseReference(val);
    if (ref) {
      setResults([
        { text: `Go to ${ref.book} ${ref.chapter}:${ref.verse}`, reference: `${ref.book} ${ref.chapter}:${ref.verse}`, ...ref },
      ]);
      setShowDropdown(true);
      setLoading(false);
      return;
    }
    // Keyword search (scripture.api.bible)
    try {
      if (!bibleId) throw new Error('No Bible ID');
      const resp = await fetch(
        `https://api.scripture.api.bible/v1/bibles/${bibleId}/search?query=${encodeURIComponent(val)}`,
        { headers: { 'api-key': process.env.REACT_APP_BIBLE_API_KEY || '' } }
      );
      if (!resp.ok) throw new Error('API error');
      const data = await resp.json();
      if (data.data && Array.isArray(data.data.verses)) {
        setResults(data.data.verses.map((v: any) => ({
          text: v.text,
          reference: v.reference,
          book: v.bookId,
          chapter: v.chapterId.split('.')[1],
          verse: v.id.split('.')[2],
        })));
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    }
    setShowDropdown(true);
    setLoading(false);
  };

  const handleSelect = (book: string, chapter: string, verse: string) => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    onSelect(book, chapter, verse);
    if (inputRef.current) inputRef.current.blur();
  };

  return (
    <div style={{ position: 'relative', margin: '0 auto 18px auto', maxWidth: 420 }}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => handleSearch(e.target.value)}
        placeholder="Search verse or keyword (e.g. John 3:16 or love)"
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: 14,
          border: '1.5px solid #38bdf8',
          fontSize: 16,
          outline: 'none',
          boxShadow: '0 2px 8px #0001',
          background: 'rgba(255,255,255,0.95)',
          color: '#222',
        }}
        onFocus={() => setShowDropdown(results.length > 0)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 120)}
      />
      {showDropdown && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 44,
          left: 0,
          right: 0,
          background: '#fff',
          border: '1.5px solid #38bdf8',
          borderRadius: 12,
          boxShadow: '0 4px 16px #0002',
          zIndex: 20,
          maxHeight: 220,
          overflowY: 'auto',
        }}>
          {results.map((r, i) => (
            <div
              key={i}
              onMouseDown={() => handleSelect(r.book, r.chapter, r.verse)}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                borderBottom: i < results.length - 1 ? '1px solid #e5e7eb' : 'none',
                background: '#fff',
                color: '#222',
                fontSize: 15.5,
                fontWeight: 500,
                transition: 'background 0.15s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#f0f9ff')}
              onMouseOut={e => (e.currentTarget.style.background = '#fff')}
            >
              <div>{r.text}</div>
              <div style={{ fontSize: 13, color: '#38bdf8', marginTop: 2 }}>{r.reference}</div>
            </div>
          ))}
        </div>
      )}
      {loading && <div style={{ position: 'absolute', top: 44, left: 0, color: '#38bdf8', fontSize: 14 }}>Searching...</div>}
    </div>
  );
};

export default VerseSearchBar; 