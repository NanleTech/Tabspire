import type { FC } from 'react';

interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
  width?: string;
  variant?: 'text' | 'rect' | 'circle';
}

const Skeleton: FC<SkeletonProps> = ({ 
  className = '', 
  lines = 1, 
  height = 'h-4',
  width,
  variant = 'rect'
}) => {
  const baseClasses = 'animate-pulse bg-gray-200/70 dark:bg-gray-700/70 rounded';
  const dimensionClasses = variant === 'circle' 
    ? 'rounded-full aspect-square' 
    : variant === 'text' 
      ? 'rounded-md' 
      : 'rounded';
  const style = width ? { width } : undefined;

  if (lines === 1) {
    return (
      <div 
        className={`${baseClasses} ${dimensionClasses} ${height} ${className}`}
        style={style}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={`skeleton-${index}`}
          className={`${baseClasses} ${dimensionClasses} ${height} ${className}`}
          style={index === lines - 1 ? { ...style, width: '85%' } : style}
        />
      ))}
    </div>
  );
};

export default Skeleton;
