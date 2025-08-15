import type { FC } from 'react';

interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
}

const Skeleton: FC<SkeletonProps> = ({ 
  className = '', 
  lines = 1, 
  height = 'h-4' 
}) => {
  if (lines === 1) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded ${height} ${className}`} />
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={`skeleton-${Date.now()}-${index}`}
          className={`animate-pulse bg-gray-200 rounded ${height} ${className}`}
        />
      ))}
    </div>
  );
};

export default Skeleton;
