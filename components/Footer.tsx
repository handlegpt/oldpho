import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { currentLanguage } = useLanguage();

  const getFooterText = () => {
    switch (currentLanguage) {
      case 'zh-TW':
        return {
          poweredBy: '由',
          privacy: '隐私政策',
          help: '帮助',
          pricing: '价格',
          terms: '服务条款'
        };
      case 'ja':
        return {
          poweredBy: '提供',
          privacy: 'プライバシー',
          help: 'ヘルプ',
          pricing: '料金',
          terms: '利用規約'
        };
      default:
        return {
          poweredBy: 'Powered by',
          privacy: 'Privacy',
          help: 'Help',
          pricing: 'Pricing',
          terms: 'Terms'
        };
    }
  };

  const t = getFooterText();

  return (
    <footer className='bg-gray-50 border-t mt-8 py-8'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='md:col-span-2'>
            <div className='flex items-center space-x-2 mb-4'>
              <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>O</span>
              </div>
              <span className='text-xl font-bold text-gray-900'>OldPho</span>
            </div>
            <p className='text-gray-600 mb-4'>
              {currentLanguage === 'zh-TW' 
                ? '使用AI技术恢复老照片，让珍贵回忆重现光彩。'
                : currentLanguage === 'ja'
                ? 'AI技術で古い写真を復元し、大切な思い出を蘇らせます。'
                : 'Restore old photos with AI technology and bring precious memories back to life.'
              }
            </p>
            <p className='text-sm text-gray-500'>
              {t.poweredBy} <span className='font-semibold'>OldPho</span>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='font-semibold text-gray-900 mb-4'>
              {currentLanguage === 'zh-TW' ? '快速链接' : currentLanguage === 'ja' ? 'クイックリンク' : 'Quick Links'}
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/pricing' className='text-gray-600 hover:text-blue-600 transition-colors'>
                  {t.pricing}
                </Link>
              </li>
              <li>
                <Link href='/help' className='text-gray-600 hover:text-blue-600 transition-colors'>
                  {t.help}
                </Link>
              </li>
              <li>
                <Link href='/restore' className='text-gray-600 hover:text-blue-600 transition-colors'>
                  {currentLanguage === 'zh-TW' ? '开始修复' : currentLanguage === 'ja' ? '復元開始' : 'Start Restoring'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className='font-semibold text-gray-900 mb-4'>
              {currentLanguage === 'zh-TW' ? '法律条款' : currentLanguage === 'ja' ? '法的条項' : 'Legal'}
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/privacy' className='text-gray-600 hover:text-blue-600 transition-colors'>
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link href='/terms' className='text-gray-600 hover:text-blue-600 transition-colors'>
                  {t.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-sm text-gray-500 mb-2 md:mb-0'>
            © 2024 OldPho. {currentLanguage === 'zh-TW' ? '保留所有权利。' : currentLanguage === 'ja' ? '全著作権所有。' : 'All rights reserved.'}
          </p>
          <div className='flex space-x-4'>
            <Link href='/privacy' className='text-sm text-gray-500 hover:text-blue-600 transition-colors'>
              {t.privacy}
            </Link>
            <Link href='/terms' className='text-sm text-gray-500 hover:text-blue-600 transition-colors'>
              {t.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
