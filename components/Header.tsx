import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import { Language, translations } from '../utils/translations';

interface HeaderProps {
  photo?: string | undefined;
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export default function Header({ photo, currentLanguage, onLanguageChange }: HeaderProps) {
  const t = translations[currentLanguage];
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRestoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use window.location.href for forced navigation
    if (typeof window !== 'undefined') {
      window.location.href = '/restore';
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleDashboardClick = () => {
    console.log('Dashboard clicked');
    setIsMenuOpen(false);
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    setIsMenuOpen(false);
  };

  return (
    <header className='flex justify-between items-center w-full border-b-2 pt-4 sm:pt-6 pb-4 sm:pb-7 px-4 sm:px-6 lg:px-8'>
      <Link href='/' className='flex space-x-2 items-center min-h-[44px] touch-manipulation'>
        <Image
          alt='header text'
          src='/imageIcon.png'
          className='w-6 h-6 sm:w-10 sm:h-10'
          width={20}
          height={20}
        />
        <h1 className='text-lg sm:text-3xl font-bold ml-2 tracking-tight'>
          OldPho
        </h1>
      </Link>
      
      <div className='flex items-center space-x-3 sm:space-x-6'>
        <LanguageSelector 
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
        />
        
        {session?.user ? (
          // User is logged in - show profile menu
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity min-h-[44px] px-2 touch-manipulation"
            >
              <Image
                alt='Profile picture'
                src={session.user.image || '/default-avatar.png'}
                className='w-8 sm:w-10 rounded-full'
                width={32}
                height={32}
              />
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {session.user.name || session.user.email}
              </span>
              <svg 
                className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-3 text-sm text-gray-500 border-b border-gray-100">
                  {session.user.email}
                </div>
                <Link
                  href="/dashboard"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
                  onClick={handleDashboardClick}
                >
                  {currentLanguage === 'zh-TW' ? '仪表板' : currentLanguage === 'ja' ? 'ダッシュボード' : 'Dashboard'}
                </Link>
                <Link
                  href="/restore"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.navigation.restore}
                </Link>
                <Link
                  href="/pricing"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {currentLanguage === 'zh-TW' ? '价格' : currentLanguage === 'ja' ? '料金' : 'Pricing'}
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
                  onClick={handleSettingsClick}
                >
                  {currentLanguage === 'zh-TW' ? '设置' : currentLanguage === 'ja' ? '設定' : 'Settings'}
                </Link>
                <Link
                  href="/help"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {currentLanguage === 'zh-TW' ? '帮助' : currentLanguage === 'ja' ? 'ヘルプ' : 'Help'}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors touch-manipulation"
                >
                  {currentLanguage === 'zh-TW' ? '退出登录' : currentLanguage === 'ja' ? 'ログアウト' : 'Sign Out'}
                </button>
              </div>
            )}
          </div>
        ) : (
          // User is not logged in - show navigation links
          <div className='flex space-x-2 sm:space-x-4 lg:space-x-8'>
            <Link
              href='/'
              className='hover:text-blue-400 transition flex items-center touch-manipulation min-h-[44px] px-3 sm:px-4'
            >
              <p className='font-medium text-sm sm:text-base'>{t.navigation.home}</p>
            </Link>
            <button
              onClick={handleRestoreClick}
              className='hover:text-blue-400 transition flex items-center touch-manipulation min-h-[44px] px-3 sm:px-4'
            >
              <p className='font-medium text-sm sm:text-base'>{t.navigation.restore}</p>
            </button>
            <Link
              href='/pricing'
              className='hover:text-blue-400 transition flex items-center touch-manipulation min-h-[44px] px-3 sm:px-4'
            >
              <p className='font-medium text-sm sm:text-base'>
                {currentLanguage === 'zh-TW' ? '价格' : currentLanguage === 'ja' ? '料金' : 'Pricing'}
              </p>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
