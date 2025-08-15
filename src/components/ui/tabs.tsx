import type { ReactNode, FC } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isDarkMode?: boolean;
  className?: string;
}

const Tabs: FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  isDarkMode = false,
  className = '',
}) => {
  const baseClasses = 'flex justify-center gap-3 mb-6';
  const classes = `${baseClasses} ${className}`;
  
  return (
    <div className={classes}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`
            px-6 py-3 rounded-full border-none font-semibold text-sm cursor-pointer
            transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
            transform hover:scale-105 active:scale-95
            ${activeTab === tab.id
              ? isDarkMode
                ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/40 scale-105'
                : 'bg-primary-600 text-white shadow-xl shadow-primary-600/40 scale-105'
              : isDarkMode
                ? 'bg-white/10 text-gray-200 hover:bg-white/20 hover:shadow-lg hover:shadow-white/10'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-lg hover:shadow-gray-900/10'
            }
          `}
        >
          {tab.icon && <span className="mr-2 transition-transform duration-300 group-hover:scale-110">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
