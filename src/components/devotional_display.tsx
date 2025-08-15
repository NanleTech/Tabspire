import type { FC } from 'react';
import { useState } from 'react';
import type { Devotional } from '../types';
import ReadMoreModal from './read_more_modal';
import Card from './ui/card';
import Button from './ui/button';
import Tabs from './ui/tabs';
import {
  cleanDevotionalContent,
  extractBibleReadingPlan,
  createContentPreview,
  createBibleGatewayUrl,
} from '../utils/string_utils';

interface DevotionalDisplayProps {
  devotional: Devotional;
  fontStyle: string;
  fontSize: number;
  isDarkMode: boolean;
  bibleId?: string;
  onPlay?: () => void;
  isPlaying?: boolean;
  disabled?: boolean;
  elevenLabsVoiceId?: string;
}

const DevotionalDisplay: FC<DevotionalDisplayProps> = ({
  devotional,
  fontStyle,
  fontSize,
  isDarkMode,
  bibleId,
  onPlay,
  isPlaying = false,
  disabled = false,
  elevenLabsVoiceId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<'devotional' | 'reading-plan'>('devotional');
  const [isLoading, setIsLoading] = useState(false);
  
  // Debug: Log the Bible ID
  console.log('DevotionalDisplay received bibleId:', bibleId);
  
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

  // Handle refresh with loading state
  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate loading time
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  
  // Process devotional content using utilities
  const cleanedContent = cleanDevotionalContent(devotional.content);
  const { plan: bibleReadingPlan, cleanedContent: devotionalContent } = extractBibleReadingPlan(cleanedContent);
  const { preview: previewContent, hasMore: hasMoreContent } = createContentPreview(devotionalContent);

  console.log('Original content length:', devotional.content.length);
  console.log('Original content start:', devotional.content.substring(0, 100));
  console.log('Cleaned content length:', cleanedContent.length);
  console.log('Cleaned content start:', cleanedContent.substring(0, 100));
  console.log('Preview content length:', previewContent.length);
  console.log('Preview content:', previewContent);
  console.log('Bible Reading Plan:', bibleReadingPlan);
  console.log('Has more content:', hasMoreContent);
  
  // Define tabs for the Tabs component
  const tabs = [
    {
      id: 'devotional',
      label: 'Devotional',
      icon: '✨',
      content: (
        <div className="text-left">
          <div className="text-base leading-relaxed mb-4">
            <p 
              className="mb-4 text-justify"
              style={{ fontFamily: fontStyle, fontSize: `${fontSize}rem` }}
            >
              {previewContent}
            </p>
          </div>
          
          {hasMoreContent && (
            <div className={`text-center mt-6 p-4 rounded-xl ${
              isDarkMode 
                ? 'bg-primary-600/8 border-primary-600/20' 
                : 'bg-primary-600/4 border-primary-600/15'
            }`}>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="shadow-lg"
              >
                Read Full Devotional
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'reading-plan',
      label: 'Reading Plan',
      icon: '📖',
      content: (
        <div className="text-center p-4 w-full">
          {bibleReadingPlan ? (
            <>
              <div className={`text-lg font-semibold mb-4 uppercase tracking-wider ${
                isDarkMode ? 'text-success-400' : 'text-success-600'
              }`} style={{ fontSize: `${fontSize * 1.1}rem` }}>
                📖 Today's Bible Reading
              </div>
              <div className="text-base mb-4" style={{ fontSize: `${fontSize}rem` }}>
                {(() => {
                  const readingText = bibleReadingPlan.replace('Bible Reading Plan:', '').trim();
                  const passages = readingText.split(/[,;]/).map(p => p.trim()).filter(p => p);
                  
                  return passages.map((passage, index) => (
                    <span key={`passage-${passage.replace(/\s+/g, '-')}`}>
                      <button
                        type="button"
                        onClick={() => handleBiblePassageClick(passage)}
                        className={`bg-transparent border-none underline cursor-pointer text-base font-medium px-2 py-1 mx-1 rounded-lg transition-all duration-300 hover:scale-105 ${
                          isDarkMode 
                            ? 'text-primary-400 hover:bg-primary-400/10 hover:shadow-lg hover:shadow-primary-400/20' 
                            : 'text-primary-600 hover:bg-primary-600/10 hover:shadow-lg hover:shadow-primary-600/20'
                        }`}
                        style={{ fontSize: `${fontSize}rem` }}
                        title={`Click to open ${passage} in Bible Gateway`}
                      >
                        {passage}
                      </button>
                      {index < passages.length - 1 && ', '}
                    </span>
                  ));
                })()}
              </div>
              <div className={`text-sm italic ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`} style={{ fontSize: `${fontSize * 0.7}rem` }}>
                💡 Click on any passage above to open it in Bible Gateway
              </div>
            </>
          ) : (
            <div className={`text-base italic ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`} style={{ fontSize: `${fontSize}rem` }}>
              No Bible reading plan available for today.
            </div>
          )}
        </div>
      ),
    },
  ];
  
  return (
    <div>
      <Card
        isDarkMode={isDarkMode}
        padding="sm"
        variant="elevated"
        className="max-w-2xl mx-auto text-center min-h-[360px] flex flex-col"
      >
        {/* Header */}
        <div className="mb-3 text-center">
          <div className="flex justify-between items-start">
            <h1
              className={`text-lg font-bold leading-tight m-0 mb-1.5 flex-1 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}
              style={{ fontFamily: fontStyle, fontSize: `${fontSize}rem` }}
            >
              {devotional.title}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              title="Refresh Devotional"
              className="ml-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
              ) : (
                '🔄'
              )}
            </Button>
          </div>
          <div className={`text-xs mb-1.5 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`} style={{ fontSize: `${fontSize * 0.5}rem` }}>
            {devotional.date}
          </div>
          {devotional.reference && (
            <div className={`text-sm italic font-medium mb-2 p-2 rounded-lg ${
              isDarkMode 
                ? 'bg-primary-600/10 border-primary-600/20 text-gray-200' 
                : 'bg-primary-600/5 border-primary-600/15 text-gray-700'
            }`}>
              📖 {devotional.reference}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <Tabs
          tabs={tabs}
          activeTab={currentTab}
          onTabChange={(tabId: string) => setCurrentTab(tabId as 'devotional' | 'reading-plan')}
          isDarkMode={isDarkMode}
        />

        {/* Tab Content */}
        <div className="flex-1">
          {tabs.find(tab => tab.id === currentTab)?.content}
        </div>

        {/* Footer with audio only */}
        <div className="flex items-center justify-center pt-3 w-full text-center mt-auto">
          <div className="flex items-center gap-2 flex-col text-center">
            {/* Audio Button */}
            {elevenLabsVoiceId && elevenLabsVoiceId.trim() !== "" && (
              <button
                type="button"
                onClick={onPlay}
                disabled={disabled}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : isPlaying
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                title={isPlaying ? 'Stop Audio' : 'Listen to Audio'}
              >
                {isPlaying ? '⏹️ Stop' : '🔊 Listen'}
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Read More Modal - Outside Card for independent positioning */}
      <ReadMoreModal
        devotional={devotional}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fontStyle={fontStyle}
        fontSize={fontSize}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default DevotionalDisplay;
