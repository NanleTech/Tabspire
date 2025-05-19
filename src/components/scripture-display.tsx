import React from 'react';
import { Scripture } from '../types';

interface ScriptureDisplayProps {
  scripture: Scripture | null;
  fontStyle: string;
}

const ScriptureDisplay: React.FC<ScriptureDisplayProps> = ({ scripture, fontStyle }) => {
  if (!scripture) return null;
  return (
    <div className="scripture">
      <p className="scripture-text" style={{ fontFamily: fontStyle }}>{scripture.text}</p>
      <p className="scripture-reference">{scripture.reference}</p>
    </div>
  );
};

export default ScriptureDisplay; 