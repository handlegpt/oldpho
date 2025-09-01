import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface MobileFABProps {
  onUpload?: () => void;
}

export default function MobileFAB({ onUpload }: MobileFABProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // 控制 FAB 的显示/隐藏
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 处理主按钮点击
  const handleMainClick = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  };

  // 处理上传按钮点击
  const handleUploadClick = () => {
    setIsExpanded(false);
    if (onUpload) {
      onUpload();
    } else {
      router.push('/restore');
    }
  };

  // 处理画廊按钮点击
  const handleGalleryClick = () => {
    setIsExpanded(false);
    router.push('/gallery');
  };

  // 处理仪表板按钮点击
  const handleDashboardClick = () => {
    setIsExpanded(false);
    router.push('/dashboard');
  };

  // 处理分享按钮点击
  const handleShareClick = () => {
    setIsExpanded(false);
    if (navigator.share) {
      navigator.share({
        title: 'Shin AI - AI Photo Restoration',
        text: 'Check out this amazing AI-powered photo restoration tool!',
        url: window.location.href
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 扩展的按钮 */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 space-y-3">
          {/* 分享按钮 */}
          <button
            onClick={handleShareClick}
            className="mobile-fab-action bg-green-500 hover:bg-green-600"
            title="Share"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>

          {/* 仪表板按钮 */}
          {session && (
            <button
              onClick={handleDashboardClick}
              className="mobile-fab-action bg-purple-500 hover:bg-purple-600"
              title="Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
              </svg>
            </button>
          )}

          {/* 画廊按钮 */}
          {session && (
            <button
              onClick={handleGalleryClick}
              className="mobile-fab-action bg-blue-500 hover:bg-blue-600"
              title="Gallery"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          )}

          {/* 上传按钮 */}
          <button
            onClick={handleUploadClick}
            className="mobile-fab-action bg-orange-500 hover:bg-orange-600"
            title="Upload Photo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </button>
        </div>
      )}

      {/* 主按钮 */}
      <button
        onClick={handleMainClick}
        className={`mobile-fab transition-all duration-300 ${
          isExpanded ? 'rotate-45 bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        }`}
        title={isExpanded ? 'Close' : 'Quick Actions'}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
}

// 添加样式到全局 CSS
const styles = `
  .mobile-fab-action {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    transform: scale(0);
    animation: fabExpand 0.3s ease forwards;
  }

  .mobile-fab-action:nth-child(1) { animation-delay: 0.1s; }
  .mobile-fab-action:nth-child(2) { animation-delay: 0.2s; }
  .mobile-fab-action:nth-child(3) { animation-delay: 0.3s; }
  .mobile-fab-action:nth-child(4) { animation-delay: 0.4s; }

  @keyframes fabExpand {
    to {
      transform: scale(1);
    }
  }

  @media (max-width: 768px) {
    .mobile-fab {
      width: 3.5rem;
      height: 3.5rem;
    }
    
    .mobile-fab-action {
      width: 3rem;
      height: 3rem;
    }
  }
`;

// 动态添加样式
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
