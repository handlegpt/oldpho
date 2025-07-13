import Image from 'next/image';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import { Language, translations } from '../utils/translations';

interface HeaderProps {
  photo?: string | undefined;
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export default function Header({ photo, currentLanguage, onLanguageChange }: HeaderProps) {
  const t = translations[currentLanguage];

  const handleRestoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // 使用 window.location.href 进行强制跳转
    if (typeof window !== 'undefined') {
      window.location.href = '/restore';
    }
  };

  return (
    <header className='flex justify-between items-center w-full mt-3 sm:mt-5 border-b-2 pb-4 sm:pb-7 px-2 sm:px-4'>
      <Link href='/' className='flex space-x-2 items-center'>
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
      
      <div className='flex items-center space-x-2 sm:space-x-4'>
        <LanguageSelector 
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
        />
        {photo ? (
          <Image
            alt='Profile picture'
            src={photo}
            className='w-8 sm:w-10 rounded-full'
            width={32}
            height={28}
          />
        ) : (
          <div className='flex space-x-3 sm:space-x-6'>
            <Link
              href='/'
              className='hover:text-blue-400 transition flex items-center touch-manipulation min-h-[32px] sm:min-h-[40px]'
            >
              <p className='font-medium text-sm sm:text-base'>{t.navigation.home}</p>
            </Link>
            <button
              onClick={handleRestoreClick}
              className='hover:text-blue-400 transition flex items-center touch-manipulation min-h-[32px] sm:min-h-[40px]'
            >
              <p className='font-medium text-sm sm:text-base'>{t.navigation.restore}</p>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
