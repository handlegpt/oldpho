import { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const TestDashboard: NextPage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <>
      <Head>
        <title>Test Dashboard - OldPho</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Test Dashboard</h1>
          
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">User Info</h2>
            <p><strong>Name:</strong> {session.user?.name}</p>
            <p><strong>Email:</strong> {session.user?.email}</p>
            <p><strong>Status:</strong> {status}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Navigation Test</h2>
            <div className="space-y-4">
              <Link 
                href="/dashboard" 
                className="block bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
              <Link 
                href="/settings" 
                className="block bg-green-600 text-white p-3 rounded hover:bg-green-700"
              >
                Go to Settings
              </Link>
              <Link 
                href="/" 
                className="block bg-gray-600 text-white p-3 rounded hover:bg-gray-700"
              >
                Go to Home
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({ session, status }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestDashboard; 