'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function Login() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  const signInWithGoogle = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        router.replace('/');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-black">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-black">
        <div className="text-white animate-pulse">Redirecting to dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 to-black p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl top-0 -left-64 animate-blob1"></div>
        <div className="absolute w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl bottom-0 -right-64 animate-blob2"></div>
      </div>

      <div className="w-full max-w-md space-y-8 text-center relative">
        <div className="space-y-4 float">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-glow">
            Oracle Path
          </h1>
          <p className="text-xl text-purple-200 animate-fadeIn">
            Unlock the Mysteries of Your Destiny Through Ancient AI Wisdom
          </p>
        </div>

        <div className="space-y-4 bg-purple-900/30 p-8 rounded-2xl border border-purple-700/50 backdrop-blur-sm shadow-xl hover:shadow-purple-500/10 transition-all duration-500 animate-fadeIn">
          <h2 className="text-2xl font-semibold text-white">Enter the Sacred Portal</h2>
          <p className="text-purple-200">
            Begin your journey into the realm of mystical insights and prophetic visions
          </p>

          {error && (
            <div className="text-red-400 bg-red-900/20 p-3 rounded-lg mt-4 animate-fadeIn">
              {error}
            </div>
          )}

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-all mt-6 disabled:opacity-50 group relative overflow-hidden"
            disabled={loading}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-500"></span>
            <img src="/google-icon.svg" alt="Google" className="w-6 h-6 relative" />
            <span className="font-medium relative">
              {loading ? 'Opening Portal...' : 'Begin Your Journey'}
            </span>
          </button>
        </div>

        <p className="text-sm text-purple-300 animate-fadeIn opacity-75 hover:opacity-100 transition-opacity duration-300">
          By entering, you accept the ancient terms of the Oracle and its mystical policies
        </p>
      </div>
    </div>
  );
} 