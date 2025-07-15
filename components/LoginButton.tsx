import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Language } from '../utils/translations';

interface LoginButtonProps {
  currentLanguage: Language;
  className?: string;
  onError?: (error: string) => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ 
  currentLanguage, 
  className = '',
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleSignIn = async () => {
    setIsLoading(true);
    
    try {
      // Use NextAuth's default redirect behavior
      await signIn('google', {
        callbackUrl: '/restore'
      });
      
      // If we reach here, it means the redirect didn't happen
      // This could be due to an error or configuration issue
      console.log('Sign in completed without redirect');
      
    } catch (error) {
      console.error('Sign in exception:', error);
      onError?.('Network error during login. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      return currentLanguage === 'zh-TW' 
        ? '登入中...' 
        : currentLanguage === 'ja' 
        ? 'ログイン中...'
        : 'Signing in...';
    }
    
    return currentLanguage === 'zh-TW' 
      ? '使用 Google 登录' 
      : currentLanguage === 'ja' 
      ? 'Googleでログイン'
      : 'Sign in with Google';
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className={`bg-blue-600 text-white rounded-xl font-semibold px-8 py-4 hover:bg-blue-700 transition-colors duration-150 transform hover:scale-105 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {getButtonText()}
    </button>
  );
};

export default LoginButton; 