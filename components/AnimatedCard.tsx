import React, { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  shadow?: 'sm' | 'md' | 'lg';
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  onClick,
  hover = true,
  shadow = 'md'
}) => {
  const shadowClasses = {
    sm: 'shadow-sm hover:shadow-md',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl'
  };

  const baseClasses = 'bg-white rounded-xl border border-gray-100 transition-all duration-300';
  const hoverClasses = hover ? 'hover:scale-105 hover:border-gray-200' : '';
  const clickClasses = onClick ? 'cursor-pointer active:scale-95' : '';

  return (
    <div
      className={`${baseClasses} ${shadowClasses[shadow]} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default AnimatedCard; 