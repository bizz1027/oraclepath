'use client';

import { useEffect, useState } from 'react';

export default function BrowserCheck({ children }: { children: React.ReactNode }) {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [browserType, setBrowserType] = useState<string>('');

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isInApp = /tiktok|instagram|facebook|fbios|twitter|line|wv|micromessenger/.test(userAgent);
    setIsInAppBrowser(isInApp);

    if (userAgent.includes('tiktok')) {
      setBrowserType('TikTok');
    } else if (userAgent.includes('instagram')) {
      setBrowserType('Instagram');
    } else if (userAgent.includes('facebook') || userAgent.includes('fbios')) {
      setBrowserType('Facebook');
    } else if (userAgent.includes('twitter')) {
      setBrowserType('Twitter');
    }
  }, []);

  if (!isInAppBrowser) {
    return <>{children}</>;
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-4">
      <div className="max-w-md mx-auto pt-12 text-center space-y-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500">
          🔮 Oracle Path
        </h1>
        <div className="bg-purple-900/50 p-6 rounded-lg border border-purple-700/50 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">⚠️ Browser Compatibility Notice</h2>
          <p className="mb-4">
            For security reasons, Google Sign-In is not supported in the {browserType} in-app browser.
          </p>
          <p className="mb-6">
            Please open Oracle Path in your default browser (Safari/Chrome) to access all features:
          </p>
          <div className="space-y-4">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = `https://www.oracle-path.com${window.location.pathname}`;
                }
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>🌐</span>
              <span>Open in Default Browser</span>
            </button>
            {browserType === 'TikTok' && (
              <div className="text-sm text-purple-300 space-y-2">
                <p>How to open in your browser:</p>
                <ol className="text-left space-y-1 pl-4">
                  <li>1. Tap the ••• menu in the top right</li>
                  <li>2. Select "Open in browser"</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 