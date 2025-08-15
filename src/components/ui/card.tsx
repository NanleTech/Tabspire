import type { ReactNode, FC } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  isDarkMode?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'subtle';
}

const Card: FC<CardProps> = ({
  children,
  className = '',
  isDarkMode = false,
  padding = 'md',
  variant = 'default',
}) => {
  const baseClasses = 'rounded-2xl backdrop-blur-md border transition-all duration-300 ease-in-out';
  
  const themeClasses = isDarkMode
    ? 'bg-black/70 border-white/20 shadow-2xl shadow-black/40'
    : 'bg-white/90 border-gray-200/50 shadow-xl shadow-gray-900/10';
  
  const variantClasses = {
    default: '',
    elevated: isDarkMode 
      ? 'shadow-3xl shadow-black/50 border-white/30' 
      : 'shadow-2xl shadow-gray-900/20 border-gray-300/60',
    subtle: isDarkMode 
      ? 'bg-black/50 border-white/10 shadow-lg shadow-black/20' 
      : 'bg-white/70 border-gray-100/80 shadow-md shadow-gray-900/5',
  };
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const hoverClasses = 'hover:scale-[1.02] hover:shadow-2xl';
  
  const classes = `${baseClasses} ${themeClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;
