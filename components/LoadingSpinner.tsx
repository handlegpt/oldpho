import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple';
  text?: string;
  showProgress?: boolean;
  progress?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  text,
  showProgress = false,
  progress = 0
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin rounded-full border-2 border-gray-200 border-t-current`}></div>
        {showProgress && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">{Math.round(progress)}%</span>
          </div>
        )}
      </div>
      {text && (
        <div className="text-center">
          <p className="text-sm text-gray-600 font-medium">{text}</p>
          {showProgress && (
            <div className="w-32 bg-gray-200 rounded-full h-1 mt-2">
              <div 
                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner; 