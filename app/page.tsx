'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState<{apiKey: boolean, apiUrl: boolean}>({ apiKey: false, apiUrl: false });
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    
    // Debug session data
    console.log("Session status:", status);
    console.log("Session data:", session);
  }, [status, router, session]);

  const handleCopy = (text: string, type: 'apiKey' | 'apiUrl') => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [type]: false }));
    }, 2000);
  };

  const testApiCredentials = async () => {
    if (!session?.user?.apiKey || !session?.user?.apiUrl) return;
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const apiUrl = `${window.location.origin}/api/data`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'x-api-key': session.user.apiKey,
          'x-api-url': session.user.apiUrl
        }
      });
      
      if (response.ok) {
        setTestResult({ success: true, message: "API credentials are valid! You can now use the API." });
      } else {
        const errorData = await response.json();
        setTestResult({ 
          success: false, 
          message: `API credentials are invalid: ${errorData.error || 'Unknown error'}` 
        });
      }
    } catch (error) {
      console.error("API test error:", error);
      setTestResult({ 
        success: false, 
        message: "Error testing API credentials. Please check your connection and try again." 
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-xl font-bold text-white">
                {session.user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">CRUD Platform</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {session.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* API Credentials Card */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">API Credentials</h2>
              <p className="mt-1 text-sm text-gray-600">Use these credentials to authenticate your API requests</p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API URL</label>
                <div className="flex rounded-lg shadow-sm">
                  <input
                    type="text"
                    readOnly
                    value={session.user?.apiUrl}
                    className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-lg border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleCopy(session.user?.apiUrl || '', 'apiUrl')}
                    className="inline-flex items-center px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    {copied.apiUrl ? (
                      <span className="text-green-600">Copied!</span>
                    ) : (
                      <span>Copy</span>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <div className="flex rounded-lg shadow-sm">
                  <input
                    type="text"
                    readOnly
                    value={session.user?.apiKey}
                    className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-lg border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleCopy(session.user?.apiKey || '', 'apiKey')}
                    className="inline-flex items-center px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    {copied.apiKey ? (
                      <span className="text-green-600">Copied!</span>
                    ) : (
                      <span>Copy</span>
                    )}
                  </button>
                </div>
              </div>
              
              {/* API Test Section */}
              <div className="mt-4">
                <button
                  onClick={testApiCredentials}
                  disabled={isTesting}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTesting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Testing...
                    </>
                  ) : (
                    "Test API Credentials"
                  )}
                </button>
                
                {testResult && (
                  <div className={`mt-3 p-3 rounded-md ${testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <p className="text-sm">{testResult.message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Credits Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Credits</h2>
              <p className="mt-1 text-sm text-gray-600">Your API usage credits</p>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-white">{session.user?.credits}</span>
                </div>
                <p className="text-lg font-medium text-gray-900">Remaining Credits</p>
                <p className="text-sm text-gray-600 mt-1">Each API request costs 1 credit</p>
              </div>
              
              {session.user?.credits === 0 && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    Your credits have been exhausted. To recharge, please send an email to{" "}
                    <a 
                      href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}?subject=Please recharge my credits`} 
                      className="font-medium text-yellow-900 underline hover:text-yellow-700 transition-colors duration-200"
                    >
                      {process.env.NEXT_PUBLIC_ADMIN_EMAIL}
                    </a>
                    {" "}with the subject &quot;Please recharge my credits&quot;.
                  </p>
                  <p className="text-xs text-yellow-700 mt-2">
                    Note: You can only recharge once. After that, you&apos;ll need to contact support for additional credits.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">API Documentation</h2>
            <p className="mt-1 text-sm text-gray-600">Learn how to use your API credentials</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Authentication</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Include your API credentials in the request headers:
                </p>
                <pre className="mt-2 p-3 bg-gray-800 text-gray-100 rounded-md overflow-x-auto text-sm">
                  <code>
                    x-api-key: your-api-key<br />
                    x-api-url: your-api-url
                  </code>
                </pre>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Testing Your API Credentials</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Follow these steps to test your API credentials:
                </p>
                <ol className="mt-2 list-decimal list-inside text-sm text-gray-600 space-y-2">
                  <li>Copy your API URL and API Key using the copy buttons above</li>
                  <li>Click the &quot;Test API Credentials&quot; button to verify your credentials</li>
                  <li>If successful, you&apos;ll see a green confirmation message</li>
                  <li>If there&apos;s an error, check your credentials and try again</li>
                </ol>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Endpoints</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-start">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 mr-2">GET</span>
                    <span className="text-sm text-gray-700">/api/data - Get all data</span>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">POST</span>
                    <span className="text-sm text-gray-700">/api/data - Create new data</span>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">PUT</span>
                    <span className="text-sm text-gray-700">/api/data/[id] - Update data</span>
                  </div>
                  <div className="flex items-start">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 mr-2">DELETE</span>
                    <span className="text-sm text-gray-700">/api/data/[id] - Delete data</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">Credit System</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Each API request costs 1 credit. When your credits are exhausted:
                </p>
                <ol className="mt-2 list-decimal list-inside text-sm text-gray-600 space-y-2">
                  <li>Send an email to {process.env.NEXT_PUBLIC_ADMIN_EMAIL} with the subject &quot;Please recharge my credits&quot;</li>
                  <li>You&apos;ll receive 4 additional credits (one-time only)</li>
                  <li>After using these credits, you&apos;ll need to contact support for more</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
