import { useEffect } from 'react';
import type { Devotional } from '../types';
import {
  cleanDevotionalContent,
  extractBibleReadingPlan,
  createBibleGatewayUrl,
} from '../utils/string_utils';

interface ReadMoreModalProps {
  devotional: Devotional;
  isOpen: boolean;
  onClose: () => void;
  fontStyle: string;
  fontSize: number;
  isDarkMode: boolean;
}

const ReadMoreModal: React.FC<ReadMoreModalProps> = ({
  devotional,
  isOpen,
  onClose,
  fontStyle,
  fontSize,
  isDarkMode,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Bible passage clicks by opening Bible Gateway links
  const handleBiblePassageClick = (passage: string) => {
    console.log('Opening Bible passage in Bible Gateway:', passage);
    
    const url = createBibleGatewayUrl(passage);
    if (url) {
      console.log('Opening Bible Gateway URL:', url);
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.error('Could not parse Bible reference:', passage);
      alert(`Could not parse Bible reference: ${passage}`);
    }
  };

  // Process devotional content using utilities
  const cleanedContent = cleanDevotionalContent(devotional.content);
  const { plan: bibleReadingPlan, cleanedContent: devotionalContent } = extractBibleReadingPlan(cleanedContent);

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div
        className={`rounded-3xl p-8 max-w-[95vw] max-h-[90vh] overflow-auto shadow-2xl shadow-black/30 border ${
          isDarkMode 
            ? 'bg-gray-800 border-white/10' 
            : 'bg-white border-black/10'
        }`}
        style={{ position: 'relative', zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div
            className={`text-sm font-semibold mb-3 uppercase tracking-wider ${
              isDarkMode ? 'text-primary-400' : 'text-primary-600'
            }`}
          >
            Daily Devotional
          </div>
          <h1
            className={`text-3xl font-bold leading-tight mb-4 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}
            style={{ fontFamily: fontStyle, fontSize: `${fontSize * 1.5}rem` }}
          >
            {devotional.title}
          </h1>
          <div className={`text-base mb-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`} style={{ fontSize: `${fontSize * 0.8}rem` }}>
            {devotional.date}
          </div>
          {devotional.reference && (
            <div className={`text-lg italic font-medium mb-6 p-4 rounded-xl ${
              isDarkMode 
                ? 'bg-primary-600/10 border border-primary-600/20 text-gray-200' 
                : 'bg-primary-600/5 border border-primary-600/15 text-gray-700'
            }`}>
              📖 {devotional.reference}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mb-8">
          <div
            className={`text-lg leading-relaxed mb-6 text-left max-w-6xl mx-auto ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}
            style={{ fontFamily: fontStyle, fontSize: `${fontSize}rem` }}
          >
            {devotionalContent.split('\n').map((paragraph, index) => (
              <p key={`paragraph-${index}-${paragraph.substring(0, 20)}`} className="mb-6 text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Bible Reading Plan */}
          {bibleReadingPlan && (
            <div className={`p-6 rounded-xl border max-w-6xl mx-auto ${
              isDarkMode 
                ? 'bg-success-600/10 border-success-600/20' 
                : 'bg-success-600/5 border-success-600/15'
            }`}>
              <div className={`text-lg font-semibold mb-4 uppercase tracking-wider text-center ${
                isDarkMode ? 'text-success-400' : 'text-success-600'
              }`} style={{ fontSize: `${fontSize * 1.1}rem` }}>
                📖 Bible Reading Plan
              </div>
              <div className={`text-base mb-4 text-center ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`} style={{ fontSize: `${fontSize}rem` }}>
                {(() => {
                  const readingText = bibleReadingPlan.replace('Bible Reading Plan:', '').trim();
                  const passages = readingText.split(/[,;]/).map(p => p.trim()).filter(p => p);
                  
                  return passages.map((passage, index) => (
                    <span key={`modal-passage-${passage.replace(/\s+/g, '-')}`}>
                      <button
                        type="button"
                        onClick={() => handleBiblePassageClick(passage)}
                        className={`bg-transparent border-none underline cursor-pointer text-base font-medium px-2 py-1 mx-1 rounded-lg transition-all duration-300 hover:scale-105 ${
                          isDarkMode 
                            ? 'text-primary-400 hover:bg-primary-400/10 hover:shadow-lg hover:shadow-primary-400/20' 
                            : 'text-primary-600 hover:bg-primary-600/10 hover:shadow-lg hover:shadow-primary-600/20'
                        }`}
                        style={{ fontSize: `${fontSize}rem` }}
                        title={`Click to open ${passage} in Bible Gateway (NIV)`}
                      >
                        {passage}
                      </button>
                      {index < passages.length - 1 && ', '}
                    </span>
                  ));
                })()}
              </div>
              <div className={`text-sm italic text-center ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`} style={{ fontSize: `${fontSize * 0.7}rem` }}>
                💡 Click on any passage above to open it in Bible Gateway (NIV)
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            type="button"
            onClick={onClose}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-lg ${
              isDarkMode
                ? 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadMoreModal;
