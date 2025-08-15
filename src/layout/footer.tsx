import { useState, useEffect, useRef, useMemo } from 'react';
import type { UnsplashPhoto } from '../types';

interface FooterProps {
  photo: UnsplashPhoto | null;
}

const Footer: React.FC<FooterProps> = ({ photo }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const currentTextRef = useRef('');

  // Dynamic attribution based on photo data - memoized to prevent unnecessary re-renders
  const attributions = useMemo(() => {
    const photoAttribution = photo?.user?.name 
      ? `📸 Photo by ${photo.user.name}`
      : '📸 Photo by Unsplash';
    
    return [
      photoAttribution,
      '📖 Devotional by triump30',
      'Made with ♥ by NanleTech'
    ];
  }, [photo?.user?.name]);

  useEffect(() => {
    const currentAttribution = attributions[currentIndex];
    
    if (isTyping) {
      // Type out the text
      let currentText = '';
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (charIndex < currentAttribution.length) {
          currentText += currentAttribution[charIndex];
          setDisplayText(currentText);
          currentTextRef.current = currentText;
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          
          // Wait before clearing
          setTimeout(() => {
            setIsTyping(true);
            setCurrentIndex((prev) => (prev + 1) % attributions.length);
          }, 4000); // Show for 4 seconds
        }
      }, 200); // Type speed - increased from 100ms to 200ms
      
      return () => clearInterval(typeInterval);
    }
    
    // Clear the text
    let currentText = currentTextRef.current;
    
    const clearTextInterval = setInterval(() => {
      if (currentText.length > 0) {
        currentText = currentText.slice(0, -1);
        setDisplayText(currentText);
        currentTextRef.current = currentText;
      } else {
        clearInterval(clearTextInterval);
      }
    }, 100); // Clear speed - increased from 50ms to 100ms
    
    return () => clearInterval(clearTextInterval);
  }, [currentIndex, isTyping, attributions]);

  return (
    <footer className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-4">
        {/* Static links on the left */}
        <div className="flex items-center gap-3 text-xs text-white/70">
          <a 
            href={photo?.user?.links?.html || "https://unsplash.com/?utm_source=tabspire&utm_medium=referral"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition-colors duration-200"
          >
            {photo?.user?.name ? `Unsplash: ${photo.user.name}` : 'Unsplash'}
          </a>
          <span className="text-white/40">•</span>
          <a 
            href="https://t30.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-green-300 transition-colors duration-200"
          >
            triump30
          </a>
          <span className="text-white/40">•</span>
          <a 
            href="https://nanletech.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-purple-300 transition-colors duration-200"
          >
            NanleTech
          </a>
        </div>

        {/* Typewriter effect on the right */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20 shadow-lg">
          <span className="text-white text-sm font-medium">
            <span className="inline-block min-w-[200px]">
              {displayText}
              <span className="animate-pulse text-blue-300">|</span>
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 