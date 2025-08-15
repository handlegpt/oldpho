import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import { translations } from '../utils/translations';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  photo?: string | undefined;
}

export default function Header({ photo }: HeaderProps) {
  const { currentLanguage, setLanguage } = useLanguage();
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
    <header className='flex justify-between items-center w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-sm pt-4 sm:pt-6 pb-4 sm:pb-7 px-4 sm:px-6 lg:px-8 sticky top-0 z-50'>
      <Link href='/' className='flex space-x-2 items-center min-h-[44px] touch-manipulation group'>
        <div className='relative'>
          <div className='w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300'>
            <svg className='w-5 h-5 sm:w-7 sm:h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
            </svg>
          </div>
          <div className='absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white'></div>
        </div>
        <h1 className='text-lg sm:text-3xl font-bold ml-2 tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
          OldPho
        </h1>
      </Link>
      
      <div className='flex items-center space-x-3 sm:space-x-6'>
        <LanguageSelector 
          currentLanguage={currentLanguage}
          onLanguageChange={setLanguage}
        />
        
        {session?.user ? (
          // User is logged in - show profile menu
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-all duration-200 min-h-[44px] touch-manipulation"
            >
              <div className="relative">
                <Image
                  alt='Profile picture'
                  src={session.user.image || '/default-avatar.png'}
                  className='w-8 sm:w-10 rounded-full border-2 border-gray-200 hover:border-blue-300 transition-colors duration-200'
                  width={32}
                  height={32}
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {session.user.name || session.user.email}
              </span>
              <svg 
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
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
                  href="/admin"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {currentLanguage === 'zh-TW' ? '管理员后台' : currentLanguage === 'ja' ? '管理者ダッシュボード' : 'Admin Dashboard'}
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
              className='hover:text-blue-600 transition-colors duration-200 flex items-center touch-manipulation min-h-[44px] px-3 sm:px-4 rounded-lg hover:bg-blue-50'
            >
              <p className='font-medium text-sm sm:text-base'>{t.navigation.home}</p>
            </Link>
            <button
              onClick={handleRestoreClick}
              className='hover:text-blue-600 transition-colors duration-200 flex items-center touch-manipulation min-h-[44px] px-3 sm:px-4 rounded-lg hover:bg-blue-50'
            >
              <p className='font-medium text-sm sm:text-base'>{t.navigation.restore}</p>
            </button>
            <Link
              href='/pricing'
              className='hover:text-blue-600 transition-colors duration-200 flex items-center touch-manipulation min-h-[44px] px-3 sm:px-4 rounded-lg hover:bg-blue-50'
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
