'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';

export default function DisclaimerModal() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [user] = useAuthState(auth);
  const [hasShownForSession, setHasShownForSession] = useState(false);

  useEffect(() => {
    // Show disclaimer when user logs in and hasn't seen it this session
    if (user && !hasShownForSession) {
      setShowDisclaimer(true);
      setHasShownForSession(true);
    }
  }, [user, hasShownForSession]);

  const acceptDisclaimer = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setShowDisclaimer(false);
  };

  const reviewDisclaimer = () => {
    setShowDisclaimer(true);
  };

  if (!showDisclaimer) {
    return (
      <button
        onClick={reviewDisclaimer}
        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
      >
        Review Legal Disclaimer
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-purple-950/95 to-purple-900/95 border border-purple-700/30 rounded-xl p-6 max-w-2xl w-full space-y-4 my-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          🔮 Oracle Path Legal Disclaimer
        </h2>
        
        <div className="space-y-4 text-purple-100">
          <p>
            Welcome, seeker of mystical wisdom. Before embarking on your journey with Oracle Path, please acknowledge the following:
          </p>
          
          <div className="space-y-2 text-sm">
            <p className="text-purple-200 font-semibold">Entertainment Purposes</p>
            <p>Oracle Path is designed for entertainment and self-reflection purposes only. The mystical guidance provided is generated through AI technology and should be viewed as a tool for contemplation rather than definitive advice.</p>
            
            <p className="text-purple-200 font-semibold mt-4">Not Professional Advice</p>
            <p>The insights provided by Oracle Path do not constitute professional medical, financial, legal, or other expert advice. For such matters, please consult qualified professionals.</p>
            
            <p className="text-purple-200 font-semibold mt-4">Personal Responsibility</p>
            <p>Any actions taken based on Oracle Path's guidance are solely your responsibility. We do not accept liability for decisions or actions resulting from your interaction with our service.</p>
            
            <p className="text-purple-200 font-semibold mt-4">Exercise Judgment</p>
            <p>Users must exercise their own judgment and critical thinking when interpreting the mystical insights provided. The Oracle's wisdom should complement, not replace, rational decision-making.</p>
            
            <p className="text-purple-200 font-semibold mt-4">Serious Matters</p>
            <p>For serious life decisions, health concerns, or legal matters, always seek appropriate professional guidance. Oracle Path is not a substitute for professional consultation.</p>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={acceptDisclaimer}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-lg hover:shadow-purple-500/20"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
} 