import React from 'react';
import { Language } from '../utils/translations';

interface ShareButtonProps {
  onClick: () => void;
  currentLanguage: Language;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ShareButton: React.FC<ShareButtonProps> = ({
  onClick,
  currentLanguage,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'p-3 text-sm min-h-[44px]',
    md: 'p-4 text-base min-h-[48px]',
    lg: 'p-5 text-lg min-h-[52px]'
  };

  const getShareText = () => {
    switch (currentLanguage) {
      case 'zh-TW':
        return '分享';
      case 'ja':
        return '共有';
      default:
        return 'Share';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`!bg-blue-600 !text-white rounded-xl font-medium transition-colors duration-150 transform hover:scale-105 hover:!bg-blue-700 active:scale-95 shadow-lg touch-manipulation ${sizeClasses[size]} ${className}`}
    >
      <div className="flex items-center justify-center space-x-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
        <span>{getShareText()}</span>
      </div>
    </button>
  );
};

export default ShareButton; 