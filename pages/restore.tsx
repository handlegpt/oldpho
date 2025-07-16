import { useState, useRef } from 'react';
import Head from 'next/head';
import { useSession, signIn } from 'next-auth/react';
import LoginButton from '../components/LoginButton';
import ShareButton from '../components/ShareButton';
import LanguageSelector from '../components/LanguageSelector';
import Header from '../components/Header';
import { translations, Language } from '../utils/translations';
import downloadPhoto from '../utils/downloadPhoto';

export default function Restore() {
  const { data: session, status } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const t = translations[currentLanguage as Language];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSendingEmail(true);
    setError(null);

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: window.location.href
      });

      if (result?.error) {
        setError('Failed to send email. Please try again.');
      } else {
        setIsEmailSent(true);
      }
    } catch (err) {
      setError('Failed to send email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleRestore = async () => {
    if (!uploadedImage) return;

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate API call
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }
      
      // For demo purposes, use the uploaded image as restored
      setRestoredImage(uploadedImage);
    } catch (err) {
      setError('Restore failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setRestoredImage(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
  };

  const handleShare = () => {
    if (restoredImage) {
      // Use native share API if available
      if (navigator.share) {
        navigator.share({
          title: 'Restored Image - OldPho',
          text: 'I restored this photo using OldPho AI technology!',
          url: window.location.href
        }).catch(console.error);
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('Link copied to clipboard!');
        }).catch(console.error);
      }
    }
  };

  const handleDownload = () => {
    if (restoredImage) {
      const filename = `restored_photo_${Date.now()}.jpg`;
      downloadPhoto(restoredImage, filename);
    }
  };

  const getDownloadText = () => {
    switch (currentLanguage) {
      case 'zh-TW':
        return '下载';
      case 'ja':
        return 'ダウンロード';
      default:
        return 'Download';
    }
  };

  const getEmailText = () => {
    switch (currentLanguage) {
      case 'zh-TW':
        return {
          title: '输入邮箱登录',
          placeholder: '请输入您的邮箱地址',
          button: '发送登录链接',
          sent: '登录链接已发送到您的邮箱',
          description: '我们将向您的邮箱发送一个登录链接，点击链接即可登录。'
        };
      case 'ja':
        return {
          title: 'メールアドレスを入力',
          placeholder: 'メールアドレスを入力してください',
          button: 'ログインリンクを送信',
          sent: 'ログインリンクをメールで送信しました',
          description: 'メールアドレスにログインリンクを送信します。リンクをクリックしてログインしてください。'
        };
      default:
        return {
          title: 'Enter Email to Login',
          placeholder: 'Enter your email address',
          button: 'Send Login Link',
          sent: 'Login link sent to your email',
          description: 'We will send a login link to your email. Click the link to sign in.'
        };
    }
  };

  const emailText = getEmailText();

  return (
    <>
      <Head>
        <title>{t.title} - OldPho</title>
        <meta name="description" content={t.description} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header 
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.description}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Login Required Section */}
            {status === 'loading' ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            ) : status === 'unauthenticated' ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {emailText.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {emailText.description}
                  </p>
                </div>
                
                {!isEmailSent ? (
                  <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
                    <div className="mb-4">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={emailText.placeholder}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSendingEmail || !email}
                      className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                      {isSendingEmail ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        emailText.button
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="max-w-md mx-auto">
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                      <p className="text-green-800">{emailText.sent}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsEmailSent(false);
                        setEmail('');
                      }}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Send to different email
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Upload Section - Only shown when logged in */
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                  >
                    Select Image
                  </label>
                  <p className="mt-2 text-sm text-gray-500">
                    Supported formats: JPEG, PNG, JPG
                  </p>
                </div>

                {uploadedImage && (
                  <div className="mt-6">
                    <div className="flex justify-center">
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="max-w-md max-h-64 object-contain rounded-lg"
                      />
                    </div>
                    <div className="mt-4 flex justify-center space-x-4">
                      <button
                        onClick={handleRestore}
                        disabled={isUploading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                      >
                        {isUploading ? 'Restoring...' : 'Restore Image'}
                      </button>
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                      >
                        {t.reset}
                      </button>
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-2">
                      {t.processing} {progress}%
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}
              </div>
            )}

            {/* Results Section */}
            {restoredImage && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Restored Image
                </h2>
                <div className="flex justify-center">
                  <img
                    src={restoredImage}
                    alt="Restored"
                    className="max-w-md max-h-64 object-contain rounded-lg"
                  />
                </div>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {getDownloadText()}
                  </button>
                  <ShareButton
                    onClick={handleShare}
                    currentLanguage={currentLanguage}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
