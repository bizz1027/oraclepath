'use client';

import { useEffect, useState } from 'react';

export default function BrowserCheck({ children }: { children: React.ReactNode }) {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [browserType, setBrowserType] = useState<string>('');
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    
    // List of in-app browser identifiers
    const inAppBrowsers = [
      'tiktok',
      'instagram',
      'fban', // Facebook App
      'fbav', // Facebook App
      'line',
      'wv', // WebView
      'fb_iab', // Facebook in-app browser
      'linkedinapp'
    ];

    const isInApp = inAppBrowsers.some(app => userAgent.includes(app));
    const isMobile = /iphone|ipad|android/i.test(userAgent);

    setIsInAppBrowser(isInApp);
    setIsMobileDevice(isMobile);

    // Set browser type for UI messaging
    if (userAgent.includes('tiktok')) {
      setBrowserType('TikTok');
    } else if (userAgent.includes('instagram')) {
      setBrowserType('Instagram');
    } else if (userAgent.includes('fban') || userAgent.includes('fbav')) {
      setBrowserType('Facebook');
    } else if (userAgent.includes('twitter')) {
      setBrowserType('Twitter');
    } else if (userAgent.includes('linkedinapp')) {
      setBrowserType('LinkedIn');
    }

    // Immediate redirect for in-app browsers
    if (isMobile && isInApp) {
      const url = window.location.href;
      
      // For iOS devices
      if (/iphone|ipad/i.test(userAgent)) {
        window.location.href = 'x-safari-' + url;
        return;
      }
      
      // For Android devices
      if (/android/i.test(userAgent)) {
        window.location.href = 'intent://' + url.replace(/^https?:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;end';
        return;
      }
    }
  }, []);

  if (!isInAppBrowser || !isMobileDevice) {
    return <>{children}</>;
  }

  const handleOpenInBrowser = () => {
    const url = window.location.href;
    
    if (/iphone|ipad/i.test(window.navigator.userAgent.toLowerCase())) {
      // iOS devices
      window.location.href = 'x-safari-' + url;
    } else if (/android/i.test(window.navigator.userAgent.toLowerCase())) {
      // Android devices
      window.location.href = 'intent://' + url.replace(/^https?:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;end';
    } else {
      // Fallback for other devices
      window.location.href = url;
    }
  };

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
            Please open Oracle Path in your default browser ({/iphone|ipad/i.test(window.navigator.userAgent.toLowerCase()) ? 'Safari' : 'Chrome'}) to access all features:
          </p>
          <div className="space-y-4">
            <button
              onClick={handleOpenInBrowser}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>🌐</span>
              <span>Open in Default Browser</span>
            </button>
            {browserType && (
              <div className="text-sm text-purple-300 space-y-2">
                <p>If the button doesn't work:</p>
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