import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const AuthError: NextPage = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const { error } = router.query;
    
    switch (error) {
      case 'Configuration':
        setErrorMessage('There is a problem with the server configuration. Please contact support.');
        break;
      case 'AccessDenied':
        setErrorMessage('Access denied. You do not have permission to sign in.');
        break;
      case 'Verification':
        setErrorMessage('The verification token has expired or has already been used.');
        break;
      case 'EmailSignin':
        setErrorMessage('Unable to send verification email. Please check your email configuration.');
        break;
      case 'OAuthSignin':
        setErrorMessage('Error occurred during OAuth sign in. Please try again.');
        break;
      case 'OAuthCallback':
        setErrorMessage('Error occurred during OAuth callback. Please try again.');
        break;
      case 'OAuthCreateAccount':
        setErrorMessage('Could not create OAuth account. Please try again.');
        break;
      case 'EmailCreateAccount':
        setErrorMessage('Could not create account with this email. Please try again.');
        break;
      case 'Callback':
        setErrorMessage('Error occurred during authentication callback. Please try again.');
        break;
      case 'OAuthAccountNotLinked':
        setErrorMessage('This email is already associated with another account. Please sign in with the original method.');
        break;
      case 'EmailSignin':
        setErrorMessage('Unable to send verification email. Please check your email configuration.');
        break;
      case 'CredentialsSignin':
        setErrorMessage('Invalid credentials. Please check your email and password.');
        break;
      case 'SessionRequired':
        setErrorMessage('Please sign in to access this page.');
        break;
      default:
        setErrorMessage('An unexpected error occurred. Please try again.');
    }
  }, [router.query]);

  const handleRetry = () => {
    router.push('/auth/signin');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Authentication Error - Shin AI</title>
        <meta name="description" content="Authentication error occurred" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header photo={undefined} />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-strong border border-white/50">
              {/* Error Icon */}
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              {/* Error Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Authentication Error
              </h1>
              
              {/* Error Message */}
              <p className="text-lg text-gray-600 mb-8">
                {errorMessage}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  Try Again
                </button>
                
                <button
                  onClick={handleGoHome}
                  className="bg-gray-100 text-gray-700 font-semibold py-3 px-8 rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Go Home
                </button>
              </div>
              
              {/* Help Text */}
              <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>Need help?</strong> If this problem persists, please contact our support team or try using a different sign-in method.
                </p>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AuthError;