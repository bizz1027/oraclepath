'use client';

import { useEffect, useState } from 'react';

export default function BrowserCheck({ children }: { children: React.ReactNode }) {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [browserType, setBrowserType] = useState<string>('');
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isTikTok = userAgent.includes('tiktok');
    const isInApp = isTikTok || userAgent.includes('instagram') || userAgent.includes('fban') || userAgent.includes('fbav');
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    
    setIsInAppBrowser(isInApp);
    setIsIOS(isIOSDevice);
    
    if (isTikTok) {
      setBrowserType('TikTok');
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
          <h2 className="text-xl font-semibold mb-4">⚠️ Please Open in {isIOS ? 'Safari' : 'Chrome'}</h2>
          <p className="mb-6 text-purple-200">
            For security reasons, you need to open Oracle Path in your default browser to continue.
          </p>
          {browserType === 'TikTok' && (
            <div className="space-y-4">
              <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-600/30">
                <p className="font-medium mb-3">How to open in {isIOS ? 'Safari' : 'Chrome'}:</p>
                <ol className="text-left space-y-2 text-purple-200">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>Tap the <strong>three dots (...)</strong> in the top right corner</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>Select <strong>"Open in browser"</strong> from the menu</span>
                  </li>
                  {isIOS && (
                    <li className="flex items-start">
                      <span className="mr-2">3.</span>
                      <span>If prompted, choose <strong>"Open in Safari"</strong></span>
                    </li>
                  )}
                </ol>
              </div>
              <div className="text-sm text-purple-300">
                This step is required to enable secure Google Sign-In.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 