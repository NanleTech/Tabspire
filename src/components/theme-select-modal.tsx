import type { ThemeType } from '../enums';

interface ThemeSelectModalProps {
  onSelect: (theme: ThemeType) => void;
}

const themes: Array<{ key: ThemeType; name: string; description: string }> = [
  {
    key: 'minimal',
    name: 'Minimal',
    description: 'Just the Bible verse and controls.'
  },
  {
    key: 'full',
    name: 'Full',
    description: 'Bible verse, controls, history, and bookmarks.'
  }
];

const ThemeSelectModal: React.FC<ThemeSelectModalProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-80 max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Tabspire Theme</h2>
        <div className="space-y-4">
          {themes.map(theme => (
            <button
              key={theme.key}
              type="button"
              onClick={() => onSelect(theme.key)}
              className="w-full p-4 rounded-xl border-2 border-blue-500 bg-gray-50 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white transition-all duration-200 text-left group"
            >
              <div className="font-semibold text-lg text-gray-900 group-hover:text-white group-focus:text-white transition-colors">
                {theme.name}
              </div>
              <div className="font-normal text-sm text-gray-600 group-hover:text-blue-100 group-focus:text-blue-100 mt-1 transition-colors">
                {theme.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelectModal; 