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
      const result = await signIn('google', {
        callbackUrl: '/restore',
        redirect: false
      });

      if (result?.error) {
        console.error('Sign in error:', result.error);
        
        // 根据错误类型提供不同的处理
        if (result.error === 'Configuration') {
          onError?.('認證配置錯誤，請聯絡管理員');
        } else if (result.error === 'AccessDenied') {
          onError?.('存取被拒絕，請檢查您的權限');
        } else if (result.error === 'Verification') {
          onError?.('驗證失敗，請重新嘗試');
        } else {
          onError?.('登入過程中發生錯誤，請重新嘗試');
        }
        
        // 如果重试次数少于3次，自动重试
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            handleSignIn();
          }, 2000);
        }
      } else if (result?.url) {
        // 登录成功，重定向
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Sign in exception:', error);
      onError?.('登入過程中發生錯誤，請重新嘗試');
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
      className={`bg-blue-600 text-white rounded-xl font-semibold px-8 py-4 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
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