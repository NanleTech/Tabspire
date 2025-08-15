import type { ThemeType } from '../enums';

interface HeaderProps {
  theme: ThemeType;
  onThemeSelect: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeSelect }) => {
  return (
    <div className="header">
      {/* Header content can be added here in the future */}
    </div>
  );
};

export default Header;
