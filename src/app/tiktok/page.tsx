'use client';

import { useEffect, useState } from 'react';

export default function TikTokLandingPage() {
  const [isIOS, setIsIOS] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-4">
        <div className="max-w-md mx-auto pt-12 text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-4">
      <div className="max-w-md mx-auto pt-12 text-center space-y-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500">
          👋 Welcome TikTok User!
        </h1>
        <div className="bg-purple-900/50 p-6 rounded-lg border border-purple-700/50 backdrop-blur-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">🔮 Oracle Path</h2>
            <p className="text-purple-200">
              Your gateway to mystical insights and divine guidance
            </p>
          </div>

          <div className="bg-purple-800/30 p-4 rounded-lg border border-purple-600/30">
            <p className="font-medium mb-3">To begin your journey:</p>
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

          <div className="space-y-2">
            <p className="text-sm text-purple-300">
              ✨ Unlock your mystical journey with:
            </p>
            <ul className="text-sm text-purple-200 space-y-1">
              <li>• Daily oracle readings</li>
              <li>• Personalized predictions</li>
              <li>• Divine insights</li>
            </ul>
          </div>

          <div className="text-xs text-purple-400 pt-2">
            Opening in your default browser enables secure Google Sign-In
          </div>
        </div>
      </div>
    </div>
  );
} 