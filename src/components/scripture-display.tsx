import React from 'react';
import { Scripture } from '../types';

interface ScriptureDisplayProps {
  scripture: Scripture | null;
}

const ScriptureDisplay: React.FC<ScriptureDisplayProps> = ({ scripture }) => {
  if (!scripture) return null;
  return (
    <div className="scripture">
      <p className="scripture-text">{scripture.text}</p>
      <p className="scripture-reference">{scripture.reference}</p>
    </div>
  );
};

export default ScriptureDisplay; 