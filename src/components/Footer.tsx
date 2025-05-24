import React from 'react';

const Footer: React.FC = () => (
  <footer style={{
    position: 'fixed',
    bottom: 12,
    left: 0,
    width: '100vw',
    textAlign: 'center',
    zIndex: 100,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    letterSpacing: 0.2,
    fontWeight: 400,
    pointerEvents: 'none',
  }}>
    <span style={{ pointerEvents: 'auto' }}>
      Made with <span style={{ color: '#e25555', fontWeight: 600 }}>♥</span> by{' '}
      <a href="https://nanletech.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>
        NanleTech
      </a>
    </span>
  </footer>
);

export default Footer; 