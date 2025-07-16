import { NextPage } from 'next';
import Head from 'next/head';
import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { translations } from '../utils/translations';
import { useLanguage } from '../contexts/LanguageContext';
import AnimatedCard from '../components/AnimatedCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Language } from '../types/language';
import LoginButton from '../components/LoginButton';
import ShareButton from '../components/ShareButton';
import LanguageSelector from '../components/LanguageSelector';
import downloadPhoto from '../utils/downloadPhoto';

const Restore: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentLanguage, setLanguage } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[currentLanguage];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
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
    setSuccess(null);

    try {
      console.log('Attempting to send email to:', email);
      
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: window.location.href
      });

      console.log('SignIn result:', result);

      if (result?.error) {
        console.error('Email sending failed:', result.error);
        setError(getErrorMessage(result.error));
      } else {
        console.log('Email sent successfully');
        setIsEmailSent(true);
        setSuccess(getSuccessMessage());
      }
    } catch (err) {
      console.error('Email sending error:', err);
      setError(getErrorMessage('unknown'));
    } finally {
      setIsSendingEmail(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (currentLanguage) {
      case 'zh-TW':
        switch (errorCode) {
          case 'EMAIL_REQUIRES_ADAPTER_ERROR':
            return '邮箱配置错误，请联系管理员';
          case 'EMAIL_SERVER_ERROR':
            return '邮箱服务器连接失败，请稍后重试';
          case 'EMAIL_SEND_ERROR':
            return '邮件发送失败，请检查邮箱地址';
          default:
            return '发送失败，请稍后重试';
        }
      case 'ja':
        switch (errorCode) {
          case 'EMAIL_REQUIRES_ADAPTER_ERROR':
            return 'メール設定エラーです。管理者にお問い合わせください';
          case 'EMAIL_SERVER_ERROR':
            return 'メールサーバー接続に失敗しました。後でもう一度お試しください';
          case 'EMAIL_SEND_ERROR':
            return 'メール送信に失敗しました。メールアドレスを確認してください';
          default:
            return '送信に失敗しました。後でもう一度お試しください';
        }
      default:
        switch (errorCode) {
          case 'EMAIL_REQUIRES_ADAPTER_ERROR':
            return 'Email configuration error, please contact administrator';
          case 'EMAIL_SERVER_ERROR':
            return 'Email server connection failed, please try again later';
          case 'EMAIL_SEND_ERROR':
            return 'Email sending failed, please check email address';
          default:
            return 'Sending failed, please try again later';
        }
    }
  };

  const getSuccessMessage = () => {
    switch (currentLanguage) {
      case 'zh-TW':
        return `登录链接已发送到 ${email}，请检查您的邮箱（包括垃圾邮件文件夹）`;
      case 'ja':
        return `ログインリンクを ${email} に送信しました。メールボックス（スパムフォルダーも含む）を確認してください`;
      default:
        return `Login link sent to ${email}, please check your email (including spam folder)`;
    }
  };

  const handleRestore = async () => {
    if (!previewUrl) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate API call
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }
      
      // For demo purposes, use the uploaded image as restored
      setResult(previewUrl);
    } catch (err) {
      setError('Restore failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setSuccess(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
  };

  const handleShare = () => {
    if (result) {
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
    if (result) {
      const filename = `restored_photo_${Date.now()}.jpg`;
      downloadPhoto(result, filename);
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
          description: '我们将向您的邮箱发送一个登录链接，点击链接即可登录。',
          resend: '发送到其他邮箱'
        };
      case 'ja':
        return {
          title: 'メールアドレスを入力',
          placeholder: 'メールアドレスを入力してください',
          button: 'ログインリンクを送信',
          sent: 'ログインリンクをメールで送信しました',
          description: 'メールアドレスにログインリンクを送信します。リンクをクリックしてログインしてください。',
          resend: '別のメールアドレスに送信'
        };
      default:
        return {
          title: 'Enter Email to Login',
          placeholder: 'Enter your email address',
          button: 'Send Login Link',
          sent: 'Login link sent to your email',
          description: 'We will send a login link to your email. Click the link to sign in.',
          resend: 'Send to different email'
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
        <Header />

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
                          {currentLanguage === 'zh-TW' ? '发送中...' : currentLanguage === 'ja' ? '送信中...' : 'Sending...'}
                        </>
                      ) : (
                        emailText.button
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="max-w-md mx-auto">
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                      <p className="text-green-800">{success}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsEmailSent(false);
                        setEmail('');
                        setSuccess(null);
                      }}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {emailText.resend}
                    </button>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 max-w-md mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-red-800">{error}</p>
                    </div>
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

                {previewUrl && (
                  <div className="mt-6">
                    <div className="flex justify-center">
                      <img
                        src={previewUrl}
                        alt="Uploaded"
                        className="max-w-md max-h-64 object-contain rounded-lg"
                      />
                    </div>
                    <div className="mt-4 flex justify-center space-x-4">
                      <button
                        onClick={handleRestore}
                        disabled={isProcessing}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                      >
                        {isProcessing ? 'Restoring...' : 'Restore Image'}
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

                {isProcessing && (
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
            {result && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Restored Image
                </h2>
                <div className="flex justify-center">
                  <img
                    src={result}
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

export default Restore;
