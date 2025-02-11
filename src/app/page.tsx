'use client';

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, db } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { savePrediction } from '../lib/predictions';
import { checkDailyLimit, incrementDailyUsage, getRemainingPredictions } from '../lib/usage';
import PredictionHistory from '../components/PredictionHistory';
import PaymentModal from '../components/PaymentModal';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [remainingPredictions, setRemainingPredictions] = useState<number>(5);
  const [showHistory, setShowHistory] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isSubscriptionCancelled, setIsSubscriptionCancelled] = useState(false);

  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      updateRemainingPredictions();
      checkPremiumStatus();
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkPremiumStatus = async () => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      const isPremium = userData?.hasPremiumAccess === true;
      setHasPremiumAccess(isPremium);
      setIsPremium(isPremium);
      setIsSubscriptionCancelled(userData?.subscriptionStatus === 'cancelling');
    }
  };

  const updateRemainingPredictions = async () => {
    if (user) {
      const remaining = await getRemainingPredictions(user.uid);
      setRemainingPredictions(remaining);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    router.replace('/login');
  };

  const handlePremiumClick = () => {
    if (!hasPremiumAccess) {
      setShowPaymentModal(true);
    } else {
      setIsPremium(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setHasPremiumAccess(true);
    setIsPremium(true);
  };

  const handleCancelSubscription = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid }),
      });

      const data = await response.json();
      
      if (data.error) {
        console.error('Error canceling subscription:', data.error);
        setPrediction('🌌 The Oracle encountered an issue while processing your request. Please try again later.');
      } else {
        // Update the user document in Firestore
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          subscriptionStatus: 'cancelling',
          updatedAt: new Date().toISOString()
        });

        setPrediction('🌌 Your Divine Insight subscription will be canceled at the end of your current billing period. You can continue to use premium features until then.');
        setIsSubscriptionCancelled(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setPrediction('🌌 The cosmic energies are turbulent. Please try again later.');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check daily limit for free users
      if (!isPremium && user) {
        const canProceed = await checkDailyLimit(user.uid);
        if (!canProceed) {
          setPrediction('🌌 You have reached your daily limit of mystic visions. Return tomorrow for more insights, or unlock Divine Insight for unlimited access to the Oracle\'s wisdom.');
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, isPremium }),
      });

      const data = await response.json();
      
      if (data.error) {
        setPrediction(data.error);
      } else {
        setPrediction(data.prediction);
        if (user) {
          await savePrediction({
            userId: user.uid,
            prompt,
            prediction: data.prediction,
            isPremium,
          });

          // Increment usage for free predictions only
          if (!isPremium) {
            await incrementDailyUsage(user.uid);
            await updateRemainingPredictions();
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setPrediction('🌌 The cosmic energies are turbulent. The Oracle requires a moment to realign. Please seek guidance again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-black">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500 drop-shadow-[0_0_15px_rgba(192,132,252,0.2)]">
            Oracle Path
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <span>📜</span>
              <span>{showHistory ? 'Hide Prophecies' : 'View Prophecies'}</span>
            </button>
            
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-800/50 hover:bg-purple-700/50 transition-colors"
              >
                <img
                  src={user?.photoURL || ''}
                  alt={user?.displayName || 'Seeker'}
                  className="w-8 h-8 rounded-full"
                />
                <span>{user?.displayName}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-purple-900/95 backdrop-blur-sm border border-purple-700/50 rounded-lg shadow-xl z-50">
                  {hasPremiumAccess && !isSubscriptionCancelled && (
                    <button
                      onClick={() => {
                        handleCancelSubscription();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-red-300 hover:bg-purple-800/50 transition-colors text-sm"
                    >
                      Cancel Subscription
                    </button>
                  )}
                  {hasPremiumAccess && isSubscriptionCancelled && (
                    <div className="px-4 py-2 text-sm text-purple-400 italic">
                      Subscription ending soon
                    </div>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-purple-300 hover:bg-purple-800/50 transition-colors text-sm"
                  >
                    Leave Portal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-12 flex flex-col items-center space-y-6">
          {!hasPremiumAccess && (
            <div className="w-full max-w-2xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 rounded-xl border border-purple-500/30 shadow-xl backdrop-blur-sm hover:shadow-purple-500/10 transition-all duration-500">
              <div className="text-center space-y-3">
                <h2 className="text-xl font-semibold text-purple-200">✨ Enhance Your Oracle Experience</h2>
                <p className="text-purple-300">Unlock unlimited Divine Insights and deeper mystical wisdom</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handlePremiumClick}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all shadow-lg"
                  >
                    ✨ Unlock Divine Insight - €4.99
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsPremium(false)}
              className={`px-6 py-2 rounded-full ${
                !isPremium
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-900 text-purple-300'
              }`}
            >
              Mystic Vision
            </button>
            {hasPremiumAccess && (
              <button
                onClick={() => setIsPremium(true)}
                className={`px-6 py-2 rounded-full ${
                  isPremium
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-900 text-purple-300'
                }`}
              >
                Divine Insight
              </button>
            )}
          </div>
          {!isPremium && (
            <div className="text-sm text-purple-300">
              {remainingPredictions} Mystic Visions remaining today
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Share your question with the Oracle... Let your thoughts flow freely, and the ancient wisdom shall guide you."
              className="w-full h-40 p-4 rounded-lg bg-purple-900/50 text-white placeholder-purple-300 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-purple-900/60 focus:bg-purple-900/70 backdrop-blur-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || (isPremium && !hasPremiumAccess) || (!isPremium && remainingPredictions === 0)}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 relative overflow-hidden group shadow-lg hover:shadow-purple-500/20"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 group-hover:scale-110 transform transition-all duration-700 ease-out"></span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] transition-opacity duration-500"></span>
            <span className="relative">
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Consulting the Ancient Wisdom...</span>
                </span>
              ) : (
                'Seek Divine Guidance'
              )}
            </span>
          </button>
        </form>

        {prediction && (
          <div className="mt-8 p-6 rounded-lg bg-purple-900/30 border border-purple-700 backdrop-blur-sm animate-fadeIn hover:shadow-purple-500/10 transition-all duration-500">
            <h2 className="text-xl font-semibold mb-4">🔮 The Oracle Speaks:</h2>
            <p className="whitespace-pre-wrap">{prediction}</p>
          </div>
        )}

        {showHistory && (
          <div className="mt-8">
            <PredictionHistory />
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-purple-300 hover:text-purple-200 transition-colors"
          >
            <span>📚</span>
            <span>Explore the Oracle's Blog</span>
          </Link>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </main>
  );
} 