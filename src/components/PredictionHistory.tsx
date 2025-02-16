'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { getUserPredictions } from '../lib/predictions';
import { Prediction } from '../types/prediction';

export default function PredictionHistory() {
  const [user] = useAuthState(auth);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPredictions() {
    if (!user) {
      console.log('No user found, cannot load predictions');
      setError('Please sign in to view your predictions');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting to load predictions for user:', user.uid);
      console.log('User object:', {
        uid: user.uid,
        email: user.email,
        isAnonymous: user.isAnonymous,
        emailVerified: user.emailVerified
      });

      const userPredictions = await getUserPredictions(user.uid);
      console.log('Successfully loaded predictions:', userPredictions);
      setPredictions(userPredictions);
      setLoading(false);
    } catch (error: any) {
      console.error('Detailed error loading predictions:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      setError(`Error loading predictions: ${error.message}`);
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log('PredictionHistory mounted, user state:', !!user);
    loadPredictions();
  }, [user]);

  if (!user) {
    return (
      <div className="mt-8 text-center text-purple-300">
        Please sign in to view your prophecies
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-8">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-center text-purple-300 mt-4">Consulting the ancient scrolls...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={loadPredictions}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="mt-8 text-center text-purple-300">
        Your scroll of prophecies awaits its first inscription...
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📜 Scroll of Past Revelations</h2>
      </div>
      <div className="space-y-6">
        {predictions.map((prediction) => (
          <div
            key={prediction.id}
            className="p-6 rounded-lg bg-purple-900/30 border border-purple-700"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-purple-300">
                Revealed on {prediction.createdAt.toLocaleDateString()} at{' '}
                {prediction.createdAt.toLocaleTimeString()}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  prediction.isPremium
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-900 text-purple-300'
                }`}
              >
                {prediction.isPremium ? 'Divine Insight' : 'Mystic Vision'}
              </span>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Your Inquiry:</h3>
              <p className="text-purple-100">{prediction.prompt}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">🔮 Oracle's Response:</h3>
              <p className="text-purple-100 whitespace-pre-wrap">
                {prediction.prediction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 