import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { UrlBuilder } from '@bytescale/sdk';
import {
  UploadWidgetConfig,
  UploadWidgetOnPreUploadResult,
} from '@bytescale/upload-widget';
import { UploadDropzone } from '@bytescale/upload-widget-react';
import { CompareSlider } from '../components/CompareSlider';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LoadingDots from '../components/LoadingDots';
import Toggle from '../components/Toggle';
import ErrorDisplay from '../components/ErrorDisplay';
import appendNewToName from '../utils/appendNewToName';
import downloadPhoto from '../utils/downloadPhoto';
// import NSFWFilter from 'nsfw-filter'; // 移除直接导入
import { useSession, signIn } from 'next-auth/react';
import useSWR from 'swr';
import { Rings } from 'react-loader-spinner';
import { addWatermark } from '../utils/watermark';
import { Language, translations } from '../utils/translations';
import { getStoredLanguage, setStoredLanguage } from '../utils/languageStorage';
import { ProcessingManager, ProgressTracker, performanceMonitor } from '../utils/performance';
import { getErrorDetails, ErrorDetails } from '../utils/errorHandling';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import AnimatedCard from '../components/AnimatedCard';
import ShareModal from '../components/ShareModal';
import ShareButton from '../components/ShareButton';

const Home: NextPage = () => {
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<ErrorDetails | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [hasWatermark, setHasWatermark] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'compare' | 'original' | 'restored'>('compare');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [progress, setProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  const t = translations[currentLanguage];

  // 初始化处理管理器
  const processingManager = new ProcessingManager({
    language: currentLanguage,
    enableErrorTracking: true,
    maxRetries: 3,
    retryDelay: 2000
  });

  // 进度追踪器
  const progressTracker = new ProgressTracker((progress, message) => {
    setProgress(progress);
    setProgressMessage(message);
  });

  useEffect(() => {
    setIsClient(true);
    // 从本地存储加载语言设置
    const storedLanguage = getStoredLanguage();
    setCurrentLanguage(storedLanguage);
    
    // 更新处理管理器的语言设置
    processingManager.updateOptions({ language: storedLanguage });
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setStoredLanguage(language);
    processingManager.updateOptions({ language });
  };

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, mutate } = useSWR('/api/remaining', fetcher);
  const { data: session, status } = useSession();

  const options: UploadWidgetConfig = {
    apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
      ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
      : 'free',
    maxFileCount: 1,
    mimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    editor: { images: { crop: false } },
    styles: { colors: { primary: '#000' } },
    onPreUpload: async (
      file: File
    ): Promise<UploadWidgetOnPreUploadResult | undefined> => {
      performanceMonitor.startTimer('upload_check');
      
      // 检查文件大小
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        const errorDetails = getErrorDetails(
          new Error('File too large'), 
          currentLanguage
        );
        setError(errorDetails);
        return { errorMessage: errorDetails.userMessage };
      }

      // 检查剩余次数
      if (data?.remainingGenerations === 0) {
        const errorDetails = getErrorDetails(
          new Error('Rate limit exceeded'), 
          currentLanguage
        );
        setError(errorDetails);
        return { errorMessage: errorDetails.userMessage };
      }
      
      performanceMonitor.endTimer('upload_check');
      return undefined;
    },
  };

  const UploadDropZone = () => (
    <div className="w-full max-w-2xl">
      <AnimatedCard className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-300">
        <UploadDropzone
          options={options}
          onUpdate={({ uploadedFiles }) => {
            if (uploadedFiles.length !== 0) {
              const image = uploadedFiles[0];
              const imageName = image.originalFile.originalFileName;
              const imageUrl = UrlBuilder.url({
                accountId: image.accountId,
                filePath: image.filePath,
                options: {
                  transformation: 'preset',
                  transformationPreset: 'thumbnail',
                },
              });
              setPhotoName(imageName);
              setOriginalPhoto(imageUrl);
              generatePhoto(imageUrl);
              setToast({ type: 'success', message: t.upload.success });
            }
          }}
          width='100%'
          height='200px'
        />
      </AnimatedCard>
    </div>
  );

  async function generatePhoto(fileUrl: string) {
    performanceMonitor.startTimer('photo_generation');
    progressTracker.startAutoProgress(120000); // 2分钟预估时间
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(true);
    setError(null);

    try {
      const result = await processingManager.processWithErrorHandling(
        async () => {
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl: fileUrl }),
          });

          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText);
          }

          let newPhoto = await res.json();
          try {
            if (typeof newPhoto === 'string') newPhoto = JSON.parse(newPhoto);
          } catch {}
          
          return newPhoto;
        },
        (errorDetails) => {
          setError(errorDetails);
        }
      );

      mutate();
      setRestoredImage(result.imageUrl);
      setHasWatermark(!!result.hasWatermark);
      setRestoredLoaded(true);
      progressTracker.update(100, '处理完成');
      
    } catch (err) {
      const errorDetails = getErrorDetails(err, currentLanguage);
      setError(errorDetails);
    } finally {
      setLoading(false);
      progressTracker.stopAutoProgress();
      performanceMonitor.endTimer('photo_generation');
    }
  }

  async function handleDownload() {
    performanceMonitor.startTimer('download');
    
    try {
      if (hasWatermark && restoredImage) {
        const watermarked = await addWatermark(restoredImage);
        downloadPhoto(watermarked, appendNewToName(photoName!));
      } else if (restoredImage) {
        downloadPhoto(restoredImage, appendNewToName(photoName!));
      }
    } catch (error) {
      const errorDetails = getErrorDetails(error, currentLanguage);
      setError(errorDetails);
    } finally {
      performanceMonitor.endTimer('download');
    }
  }

  const handleShare = () => {
    const shareData = {
      title: currentLanguage === 'zh-TW' 
        ? '我用 OldPho 修复了这张照片！' 
        : currentLanguage === 'ja' 
        ? 'OldPhoで写真を復元しました！'
        : 'I restored this photo with OldPho!',
      description: currentLanguage === 'zh-TW'
        ? '使用AI技术将模糊的照片恢复为清晰的高质量图片。'
        : currentLanguage === 'ja'
        ? 'AI技術でぼやけた写真を鮮明な高品質画像に復元しました。'
        : 'Restored blurry photos to crystal clear quality using AI technology.',
      url: isClient ? window.location.href : '',
      imageUrl: restoredImage || undefined
    };
    
    // 如果支持原生分享API，使用原生分享
    if (isClient && navigator.share && restoredImage) {
      navigator.share({
        title: shareData.title,
        text: shareData.description,
        url: shareData.url
      }).catch(() => {
        // 如果原生分享失败，显示自定义分享模态框
        setShowShareModal(true);
      });
    } else {
      // 显示自定义分享模态框
      setShowShareModal(true);
    }
  };

  const resetState = () => {
    setOriginalPhoto(null);
    setRestoredImage(null);
    setRestoredLoaded(false);
    setError(null);
    setViewMode('compare');
    setProgress(0);
    setProgressMessage('');
  };

  const handleRetry = () => {
    if (originalPhoto) {
      generatePhoto(originalPhoto);
    }
  };

  const handleDismissError = () => {
    setError(null);
  };

  const handleRefresh = () => {
    if (isClient) {
      window.location.reload();
    }
  };

  return (
    <div className='flex max-w-7xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
      <Head>
        <title>Restore Photo - OldPho</title>
        <meta name="description" content="Restore your old photos with AI technology" />
      </Head>
      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
      <main className='flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-20'>
        <div className='flex flex-col items-center justify-center w-full max-w-4xl'>
          <div className='flex flex-col items-center justify-center w-full max-w-2xl'>
            <h1 className='mx-auto max-w-4xl font-display text-2xl font-bold tracking-normal text-slate-900 sm:text-4xl mb-8'>
              {t.title}
            </h1>
            <p className='text-slate-500 mb-8'>{t.description}</p>
          </div>

          {/* 登录状态检查 */}
          {status === 'loading' ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="lg" color="blue" text="Loading..." />
            </div>
          ) : status === 'unauthenticated' ? (
            <div className="w-full max-w-2xl">
              <AnimatedCard className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 border-2 border-blue-200">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">
                    {currentLanguage === 'zh-TW' ? '需要登录' : currentLanguage === 'ja' ? 'ログインが必要です' : 'Login Required'}
                  </h2>
                  <p className="text-blue-700 mb-6">
                    {currentLanguage === 'zh-TW' 
                      ? '请先登录您的账户以使用照片修复功能。' 
                      : currentLanguage === 'ja' 
                      ? '写真復元機能を使用するには、まずアカウントにログインしてください。'
                      : 'Please log in to your account to use the photo restoration feature.'
                    }
                  </p>
                  <button
                    onClick={() => signIn('google')}
                    className="bg-blue-600 text-white rounded-xl font-semibold px-8 py-4 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg active:scale-95"
                  >
                    {currentLanguage === 'zh-TW' ? '使用 Google 登录' : currentLanguage === 'ja' ? 'Googleでログイン' : 'Sign in with Google'}
                  </button>
                </div>
              </AnimatedCard>
            </div>
          ) : status === 'authenticated' && data ? (
            <>
              {/* 显示剩余次数 */}
              <div className="w-full max-w-2xl mb-8">
                <AnimatedCard className="bg-green-50 border-green-200 p-4">
                  <p className='text-green-800'>
                    {currentLanguage === 'zh-TW' ? '您本月还有' : currentLanguage === 'ja' ? '今月はまだ' : 'You have'}{' '}
                    <span className='font-semibold text-green-900'>
                      {data.remainingGenerations} {currentLanguage === 'zh-TW' ? '次修复' : currentLanguage === 'ja' ? '回の復元' : 'generations'}
                    </span>{' '}
                    {currentLanguage === 'zh-TW' ? '剩余。您的配额将在' : currentLanguage === 'ja' ? 'が残っています。クォータは' : 'left this month. Your generations will renew in'}{' '}
                    <span className='font-semibold text-green-900'>
                      {data.hours} {currentLanguage === 'zh-TW' ? '小时' : currentLanguage === 'ja' ? '時間' : 'hours'} {currentLanguage === 'zh-TW' ? '和' : currentLanguage === 'ja' ? 'と' : 'and'} {data.minutes} {currentLanguage === 'zh-TW' ? '分钟' : currentLanguage === 'ja' ? '分' : 'minutes'}
                    </span>{' '}
                    {currentLanguage === 'zh-TW' ? '后重置。' : currentLanguage === 'ja' ? '後にリセットされます。' : '.'}
                  </p>
                </AnimatedCard>
              </div>

              {!originalPhoto ? (
                <UploadDropZone />
              ) : (
                <div className='flex flex-col items-center justify-center w-full max-w-4xl'>
                  <div className='flex flex-col sm:flex-row gap-8 items-center justify-center w-full'>
                    <div className='flex flex-col items-center justify-center'>
                      <h3 className='mb-4 font-semibold text-lg text-slate-700'>{t.original}</h3>
                      <AnimatedCard className='p-4'>
                        <Image
                          alt='original photo'
                          src={originalPhoto}
                          className='rounded-lg'
                          width={400}
                          height={400}
                        />
                      </AnimatedCard>
                    </div>
                    {loading && (
                      <div className='flex flex-col items-center justify-center'>
                        <LoadingSpinner 
                          size="lg" 
                          color="blue" 
                          text={progressMessage || t.processing}
                          showProgress={true}
                          progress={progress}
                        />
                      </div>
                    )}
                    {restoredImage && !loading && (
                      <div className='flex flex-col items-center justify-center'>
                        <h3 className='mb-4 font-semibold text-lg text-slate-700'>{t.restored}</h3>
                        <AnimatedCard className='p-4'>
                          <Image
                            alt='restored photo'
                            src={restoredImage}
                            className='rounded-lg'
                            width={400}
                            height={400}
                          />
                        </AnimatedCard>
                      </div>
                    )}
                  </div>

                  {restoredImage && !loading && (
                    <div className='flex flex-col sm:flex-row gap-4 mt-8'>
                      <button
                        onClick={handleDownload}
                        className='bg-black rounded-xl text-white font-medium px-8 py-4 hover:bg-black/80 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95'
                      >
                        {t.download}
                      </button>
                      <ShareButton
                        onClick={handleShare}
                        currentLanguage={currentLanguage}
                        className="flex-1"
                      />
                      <button
                        onClick={resetState}
                        className='bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium px-8 py-4 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95'
                      >
                        {t.reset}
                      </button>
                    </div>
                  )}

                  {error && (
                    <div className='mt-8 w-full max-w-2xl'>
                      <ErrorDisplay 
                        error={error}
                        onRetry={handleRetry}
                        onDismiss={handleDismissError}
                        language={currentLanguage}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="w-full max-w-2xl">
              <AnimatedCard className="bg-yellow-50 border-yellow-200 p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-yellow-900 mb-4">
                    {currentLanguage === 'zh-TW' ? '无法获取用户信息' : currentLanguage === 'ja' ? 'ユーザー情報を取得できません' : 'Unable to get user info'}
                  </h2>
                  <p className="text-yellow-700 mb-6">
                    {currentLanguage === 'zh-TW' 
                      ? '请刷新页面或重新登录。' 
                      : currentLanguage === 'ja' 
                      ? 'ページを更新するか、再ログインしてください。'
                      : 'Please refresh the page or log in again.'
                    }
                  </p>
                  <button
                    onClick={handleRefresh}
                    className="bg-yellow-600 text-white rounded-xl font-semibold px-8 py-4 hover:bg-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg active:scale-95"
                  >
                    {currentLanguage === 'zh-TW' ? '刷新页面' : currentLanguage === 'ja' ? 'ページを更新' : 'Refresh Page'}
                  </button>
                </div>
              </AnimatedCard>
            </div>
          )}
        </div>
      </main>
      <Footer />
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          show={true}
        />
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareData={{
          title: currentLanguage === 'zh-TW' 
            ? '我用 OldPho 修复了这张照片！' 
            : currentLanguage === 'ja' 
            ? 'OldPhoで写真を復元しました！'
            : 'I restored this photo with OldPho!',
          description: currentLanguage === 'zh-TW'
            ? '使用AI技术将模糊的照片恢复为清晰的高质量图片。'
            : currentLanguage === 'ja'
            ? 'AI技術でぼやけた写真を鮮明な高品質画像に復元しました。'
            : 'Restored blurry photos to crystal clear quality using AI technology.',
          url: isClient ? window.location.href : '',
          imageUrl: restoredImage || undefined
        }}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};

export default Home;
