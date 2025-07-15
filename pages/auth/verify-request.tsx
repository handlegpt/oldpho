import Head from 'next/head';
import { useRouter } from 'next/router';

export default function VerifyRequest() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Check your email - OldPho</title>
        <meta name="description" content="Check your email for the sign-in link" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              A sign-in link has been sent to your email address.
            </p>
          </div>

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-sm text-gray-700">
                <p>
                  If you don't see it, check your spam folder. The link will expire in 24 hours.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleBack}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 