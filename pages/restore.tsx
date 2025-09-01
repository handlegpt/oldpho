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
  const [enhancementType, setEnhancementType] = useState<'basic' | 'face' | 'color' | 'upscale' | 'full'>('full');
  const [scale, setScale] = useState(2);
  const [faceEnhancement, setFaceEnhancement] = useState(true);
  const [colorization, setColorization] = useState(false);
  const [upscaling, setUpscaling] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[currentLanguage];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
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
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: window.location.href
      });

      if (result?.error) {
        setError(getErrorMessage(result.error));
      } else {
        setIsEmailSent(true);
        setSuccess(getEmailSuccessMessage());
      }
    } catch (err) {
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

  const getEmailSuccessMessage = () => {
    switch (currentLanguage) {
      case 'zh-TW':
        return `登录链接已发送到 ${email}，请检查您的邮箱（包括垃圾邮件文件夹）`;
      case 'ja':
        return `ログインリンクを ${email} に送信しました。メールボックス（スパムフォルダーも含む）を確認してください`;
      default:
        return `Login link sent to ${email}, please check your email (including spam folder)`;
    }
  };

  const getRestoreSuccessMessage = () => {
    switch (currentLanguage) {
      case 'zh-TW':
        return '图片恢复成功！';
      case 'ja':
        return '画像の復元が完了しました！';
      default:
        return 'Image restoration completed successfully!';
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) {
      setError(currentLanguage === 'zh-TW' ? '请先选择图片' : 
              currentLanguage === 'ja' ? '画像を選択してください' :
              'Please select an image first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Progress: 10%');
      setProgress(10);

      // Create FormData and append the file and options
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('enhancementType', enhancementType);
      formData.append('scale', scale.toString());
      formData.append('faceEnhancement', faceEnhancement.toString());
      formData.append('colorization', colorization.toString());
      formData.append('upscaling', upscaling.toString());

      const uploadResponse = await fetch('/api/restore', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', uploadResponse.status);

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error('Upload failed:', errorData);
        throw new Error(errorData.error || 'Failed to upload and process image');
      }

      console.log('Progress: 50%');
      setProgress(50);

      const result = await uploadResponse.json();
      console.log('Upload result:', result);

      console.log('Progress: 100%');
      setProgress(100);
      setResult(result.restoredImage);
      setSuccess(getRestoreSuccessMessage());

    } catch (err) {
      console.error('Restore error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Restore failed. Please try again.';
      
      let userFriendlyError = errorMessage;
      if (errorMessage.includes('Failed to upload')) {
        userFriendlyError = currentLanguage === 'zh-TW' ? '图片上传失败，请重试' : 
                           currentLanguage === 'ja' ? '画像のアップロードに失敗しました。もう一度お試しください' :
                           'Image upload failed, please try again';
      } else if (errorMessage.includes('Internal server error')) {
        userFriendlyError = currentLanguage === 'zh-TW' ? '服务器内部错误，请稍后重试' : 
                           currentLanguage === 'ja' ? 'サーバー内部エラーです。後でもう一度お試しください' :
                           'Internal server error, please try again later';
      }
      
      setError(userFriendlyError);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
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
      if (navigator.share) {
        navigator.share({
          title: 'Restored Image - Shin AI',
          text: 'I restored this photo using Shin AI technology!',
          url: window.location.href
        }).catch(console.error);
      } else {
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

  const enhancementOptions = [
    {
      value: 'basic',
      label: currentLanguage === 'zh-TW' ? '基础修复' : currentLanguage === 'ja' ? '基本修復' : 'Basic',
      description: currentLanguage === 'zh-TW' ? '快速修复照片质量' : currentLanguage === 'ja' ? '写真の品質を素早く修復' : 'Quick quality restoration',
      icon: '🔧'
    },
    {
      value: 'face',
      label: currentLanguage === 'zh-TW' ? '人脸修复' : currentLanguage === 'ja' ? '顔修復' : 'Face',
      description: currentLanguage === 'zh-TW' ? '专门修复人脸细节' : currentLanguage === 'ja' ? '顔の詳細を専門的に修復' : 'Specialized face restoration',
      icon: '👤'
    },
    {
      value: 'color',
      label: currentLanguage === 'zh-TW' ? '照片上色' : currentLanguage === 'ja' ? '写真着色' : 'Color',
      description: currentLanguage === 'zh-TW' ? '为黑白照片添加色彩' : currentLanguage === 'ja' ? '白黒写真に色を追加' : 'Add color to black & white photos',
      icon: '🎨'
    },
    {
      value: 'upscale',
      label: currentLanguage === 'zh-TW' ? '超分辨率' : currentLanguage === 'ja' ? '超解像度' : 'Upscale',
      description: currentLanguage === 'zh-TW' ? '提高照片分辨率' : currentLanguage === 'ja' ? '写真の解像度を向上' : 'Increase photo resolution',
      icon: '📐'
    },
    {
      value: 'full',
      label: currentLanguage === 'zh-TW' ? '完整修复' : currentLanguage === 'ja' ? '完全修復' : 'Full',
      description: currentLanguage === 'zh-TW' ? '综合多种修复效果' : currentLanguage === 'ja' ? '複数の修復効果を組み合わせ' : 'Combined restoration effects',
      icon: '✨'
    }
  ];

  return (
    <>
      <Head>
        <title>{t.title} - Shin AI</title>
        <meta name="description" content={t.description} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header photo={undefined} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="text-center py-12">
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                <span className="gradient-text">
                  {currentLanguage === 'zh-TW' ? 'AI 照片修复' : 
                   currentLanguage === 'ja' ? 'AI 写真修復' : 
                   'AI Photo Restoration'}
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                {currentLanguage === 'zh-TW' ? '使用最新的 AI 技术恢复您的珍贵照片' :
                 currentLanguage === 'ja' ? '最新のAI技術で大切な写真を復元' :
                 'Restore your precious photos with the latest AI technology'}
              </p>
            </section>

            {/* Enhancement Type Selection */}
            <section className="mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-strong border border-white/50">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  {currentLanguage === 'zh-TW' ? '选择修复类型' :
                   currentLanguage === 'ja' ? '修復タイプを選択' :
                   'Choose Restoration Type'}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {enhancementOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setEnhancementType(option.value as any)}
                      className={`p-4 rounded-2xl border-2 transition-medium text-left ${
                        enhancementType === option.value
                          ? 'border-blue-500 bg-blue-50 shadow-medium'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-soft'
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <div className="font-semibold text-gray-900 mb-1">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </button>
                  ))}
                </div>

                {/* Advanced Options */}
                {enhancementType === 'full' && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {currentLanguage === 'zh-TW' ? '高级选项' :
                       currentLanguage === 'ja' ? '詳細オプション' :
                       'Advanced Options'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={faceEnhancement}
                          onChange={(e) => setFaceEnhancement(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">
                          {currentLanguage === 'zh-TW' ? '人脸增强' :
                           currentLanguage === 'ja' ? '顔強化' :
                           'Face Enhancement'}
                        </span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={colorization}
                          onChange={(e) => setColorization(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">
                          {currentLanguage === 'zh-TW' ? '照片上色' :
                           currentLanguage === 'ja' ? '写真着色' :
                           'Colorization'}
                        </span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={upscaling}
                          onChange={(e) => setUpscaling(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">
                          {currentLanguage === 'zh-TW' ? '超分辨率' :
                           currentLanguage === 'ja' ? '超解像度' :
                           'Upscaling'}
                        </span>
                      </label>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {currentLanguage === 'zh-TW' ? '放大倍数' :
                         currentLanguage === 'ja' ? '拡大倍率' :
                         'Scale Factor'}
                      </label>
                      <select
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={1}>1x</option>
                        <option value={2}>2x</option>
                        <option value={4}>4x</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Upload Section */}
            <section className="mb-12">
              <AnimatedCard>
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-strong border border-white/50">
                  {!session?.user ? (
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {currentLanguage === 'zh-TW' ? '登录以开始修复' :
                         currentLanguage === 'ja' ? '修復を開始するにはログインしてください' :
                         'Sign in to Start Restoring'}
                      </h2>
                      <LoginButton />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        {currentLanguage === 'zh-TW' ? '上传您的照片' :
                         currentLanguage === 'ja' ? '写真をアップロード' :
                         'Upload Your Photo'}
                      </h2>

                      {/* File Upload Area */}
                      <div
                        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-medium ${
                          dragActive
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        {!previewUrl ? (
                          <div>
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <p className="text-lg text-gray-600 mb-4">
                              {currentLanguage === 'zh-TW' ? '拖拽照片到这里，或点击选择文件' :
                               currentLanguage === 'ja' ? '写真をここにドラッグするか、クリックしてファイルを選択' :
                               'Drag and drop your photo here, or click to select file'}
                            </p>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-medium"
                            >
                              {currentLanguage === 'zh-TW' ? '选择文件' :
                               currentLanguage === 'ja' ? 'ファイルを選択' :
                               'Choose File'}
                            </button>
                          </div>
                        ) : (
                          <div>
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="max-w-full h-64 object-contain rounded-xl mx-auto mb-4"
                            />
                            <div className="flex justify-center space-x-4">
                              <button
                                onClick={handleRestore}
                                disabled={isProcessing}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                                                 {isProcessing ? (
                                   <div className="flex items-center space-x-2">
                                     <LoadingSpinner size="sm" />
                                     <span>
                                       {currentLanguage === 'zh-TW' ? '处理中...' :
                                        currentLanguage === 'ja' ? '処理中...' :
                                        'Processing...'}
                                     </span>
                                   </div>
                                 ) : (
                                  currentLanguage === 'zh-TW' ? '开始修复' :
                                  currentLanguage === 'ja' ? '修復開始' :
                                  'Start Restoration'
                                )}
                              </button>
                              <button
                                onClick={handleReset}
                                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-medium"
                              >
                                {currentLanguage === 'zh-TW' ? '重新选择' :
                                 currentLanguage === 'ja' ? '再選択' :
                                 'Choose Another'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {isProcessing && (
                        <div className="mt-6">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <p className="text-center text-gray-600 mt-2">
                            {progress}% {currentLanguage === 'zh-TW' ? '完成' : currentLanguage === 'ja' ? '完了' : 'Complete'}
                          </p>
                        </div>
                      )}

                      {/* Error/Success Messages */}
                      {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                          <p className="text-red-600">{error}</p>
                        </div>
                      )}

                      {success && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                          <p className="text-green-600">{success}</p>
                        </div>
                      )}

                      {/* Result Display */}
                      {result && (
                        <div className="mt-8">
                          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                            {currentLanguage === 'zh-TW' ? '修复结果' :
                             currentLanguage === 'ja' ? '修復結果' :
                             'Restoration Result'}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-gray-700 mb-2">
                                {currentLanguage === 'zh-TW' ? '原始图片' :
                                 currentLanguage === 'ja' ? '元の画像' :
                                 'Original'}
                              </h4>
                              <img
                                src={previewUrl!}
                                alt="Original"
                                className="w-full rounded-xl shadow-medium"
                              />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-700 mb-2">
                                {currentLanguage === 'zh-TW' ? '修复后' :
                                 currentLanguage === 'ja' ? '修復後' :
                                 'Restored'}
                              </h4>
                              <img
                                src={result}
                                alt="Restored"
                                className="w-full rounded-xl shadow-medium"
                              />
                            </div>
                          </div>
                          <div className="flex justify-center space-x-4 mt-6">
                            <button
                              onClick={handleDownload}
                              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-medium"
                            >
                              {getDownloadText()}
                            </button>
                            <button
                              onClick={handleShare}
                              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-medium"
                            >
                              {currentLanguage === 'zh-TW' ? '分享' :
                               currentLanguage === 'ja' ? '共有' :
                               'Share'}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </AnimatedCard>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Restore;
