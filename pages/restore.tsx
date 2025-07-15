import { useState, useRef } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import LoginButton from '../components/LoginButton';
import ShareButton from '../components/ShareButton';
import LanguageSelector from '../components/LanguageSelector';
import { translations, Language } from '../utils/translations';

export default function Restore() {
  const { data: session, status } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const t = translations[currentLanguage];

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

  return (
    <>
      <Head>
        <title>{t.title} - OldPho</title>
        <meta name="description" content={t.description} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-8">
                <a href="/" className="text-2xl font-bold text-gray-900">
                  OldPho
                </a>
                <nav className="hidden md:flex space-x-8">
                  <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors duration-150">
                    {t.navigation.home}
                  </a>
                  <a href="/restore" className="text-blue-600 font-medium">
                    {t.navigation.restore}
                  </a>
                  <a href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors duration-150">
                    Pricing
                  </a>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <LanguageSelector />
                <LoginButton />
              </div>
            </div>
          </div>
        </header>

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
            {/* Upload Section */}
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
                <div className="mt-4 flex justify-center">
                  <ShareButton
                    imageUrl={restoredImage}
                    title="Restored Image"
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
