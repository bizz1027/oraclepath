'use client';

import { useEffect, useState } from 'react';

export default function BrowserCheck({ children }: { children: React.ReactNode }) {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [browserType, setBrowserType] = useState<string>('');

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isTikTok = userAgent.includes('tiktok');
    const isInApp = isTikTok || userAgent.includes('instagram') || userAgent.includes('fban') || userAgent.includes('fbav');
    
    setIsInAppBrowser(isInApp);
    
    if (isTikTok) {
      setBrowserType('TikTok');
    } else if (userAgent.includes('instagram')) {
      setBrowserType('Instagram');
    } else if (userAgent.includes('fban') || userAgent.includes('fbav')) {
      setBrowserType('Facebook');
    }
  }, []);

  const handleOpenInBrowser = () => {
    const path = window.location.pathname;
    const targetUrl = `https://www.oracle-path.com${path}`;
    
    // For TikTok, we'll try both methods
    if (browserType === 'TikTok') {
      // Method 1: Direct HTTPS URL
      window.location.href = targetUrl;
      
      // Method 2: After a small delay, try the browser scheme
      setTimeout(() => {
        window.location.href = `browser://${targetUrl}`;
      }, 100);
    } else {
      window.location.href = targetUrl;
    }
  };

  if (!isInAppBrowser) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-4">
      <div className="max-w-md mx-auto pt-12 text-center space-y-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500">
          🔮 Oracle Path
        </h1>
        <div className="bg-purple-900/50 p-6 rounded-lg border border-purple-700/50 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">⚠️ Browser Compatibility Notice</h2>
          <p className="mb-4">
            For security reasons, Google Sign-In is not supported in the TikTok browser.
          </p>
          <button
            onClick={handleOpenInBrowser}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2 mb-4"
          >
            <span>🌐</span>
            <span>Open in Browser</span>
          </button>
          {browserType === 'TikTok' && (
            <div className="text-sm text-purple-300 space-y-2">
              <p>If the button doesn't work:</p>
              <ol className="text-left space-y-1 pl-4">
                <li>1. Tap the three dots (...) in the top right</li>
                <li>2. Select "Open in browser"</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 