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
      // Immediate redirect for TikTok
      const targetUrl = window.location.href;
      if (/iphone|ipad/i.test(userAgent)) {
        window.location.href = `x-safari-${targetUrl}`;
      } else if (/android/i.test(userAgent)) {
        window.location.href = `intent://${targetUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
      }
    } else if (userAgent.includes('instagram')) {
      setBrowserType('Instagram');
    } else if (userAgent.includes('fban') || userAgent.includes('fbav')) {
      setBrowserType('Facebook');
    }
  }, []);

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
            For the best experience, please open Oracle Path in your default browser.
          </p>
          {browserType === 'TikTok' && (
            <div className="text-sm text-purple-300 space-y-2">
              <p>To continue:</p>
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