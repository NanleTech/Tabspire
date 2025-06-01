import React from 'react';
import { Scripture } from '../types';

interface ScriptureDisplayProps {
  scripture: Scripture | null;
  fontStyle: string;
  onPlay?: () => void;
  isPlaying?: boolean;
  disabled?: boolean;
}

const PlayIcon = ({ size = 28, color = '#38bdf8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill={color} fillOpacity="0.12" />
    <path d="M9.5 8.5V15.5L16 12L9.5 8.5Z" fill={color} />
  </svg>
);

const ScriptureDisplay: React.FC<ScriptureDisplayProps> = ({ scripture, fontStyle, onPlay, isPlaying, disabled }) => {
  if (!scripture) return null;
  return (
    <div className="scripture" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ flex: 1 }}>
        <p className="scripture-text" style={{ fontFamily: fontStyle }}>{scripture.text}</p>
        <p className="scripture-reference">{scripture.reference}</p>
      </div>
      {onPlay && (
        <button
          onClick={onPlay}
          className="control-button"
          title="Play verse audio"
          style={{ marginLeft: 18, background: 'none', border: 'none', padding: 0, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          disabled={disabled}
        >
          <PlayIcon size={32} color={isPlaying ? '#0ea5e9' : '#38bdf8'} />
        </button>
      )}
    </div>
  );
};

export default ScriptureDisplay; 