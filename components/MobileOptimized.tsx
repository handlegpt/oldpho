import React, { ReactNode } from 'react';

interface MobileOptimizedProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const MobileOptimized: React.FC<MobileOptimizedProps> = ({
  children,
  className = '',
  padding = 'md'
}) => {
  const paddingClasses = {
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6'
  };

  return (
    <div className={`w-full max-w-full overflow-x-hidden ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default MobileOptimized; 