import type { ReactNode, FC } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  title?: string;
}

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
  title,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95';
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-600/40',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20',
    success: 'bg-success-600 hover:bg-success-700 text-white focus:ring-success-500 shadow-lg shadow-success-600/30 hover:shadow-xl hover:shadow-success-600/40',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500 hover:shadow-md hover:shadow-gray-900/10',
    outline: 'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500 transition-colors duration-300',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100' : 'cursor-pointer';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      title={title}
    >
      {children}
    </button>
  );
};

export default Button;
