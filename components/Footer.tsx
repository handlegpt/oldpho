import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='text-center h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col justify-between items-center px-3 space-y-3 sm:mb-0 mb-3'>
      <div>
        Powered by{' '}
        <span className='font-bold'>
          OldPho
        </span>
        .
      </div>
      <div className='flex space-x-4 pb-4 sm:pb-0'>
        <Link
          href='/privacy'
          className='text-gray-600 hover:text-gray-800 transition-colors text-sm'
        >
          Privacy
        </Link>
      </div>
    </footer>
  );
}
