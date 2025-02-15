'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function DisclaimerModal() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [user] = useAuthState(auth);
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkDisclaimerStatus() {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          const hasAccepted = userDoc.data()?.hasAcceptedDisclaimer || false;
          setHasAcceptedDisclaimer(hasAccepted);
          setShowDisclaimer(!hasAccepted);
        } catch (error) {
          console.error('Error checking disclaimer status:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    checkDisclaimerStatus();
  }, [user]);

  const acceptDisclaimer = async () => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          hasAcceptedDisclaimer: true,
          disclaimerAcceptedAt: new Date().toISOString(),
        }, { merge: true });
        
        setHasAcceptedDisclaimer(true);
        setShowDisclaimer(false);
      } catch (error) {
        console.error('Error saving disclaimer acceptance:', error);
      }
    }
  };

  const reviewDisclaimer = () => {
    setShowDisclaimer(true);
  };

  if (loading) return null;

  if (!showDisclaimer) {
    return (
      <button
        onClick={reviewDisclaimer}
        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
      >
        {hasAcceptedDisclaimer ? 'Review Legal Disclaimer (Accepted)' : 'Review Legal Disclaimer'}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-gradient-to-b from-purple-950/95 to-purple-900/95 border border-purple-700/30 rounded-xl p-4 sm:p-6 max-w-2xl w-full space-y-3 sm:space-y-4 my-2 sm:my-8 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          🔮 Oracle Path Legal Disclaimer
        </h2>
        
        <div className="space-y-3 sm:space-y-4 text-purple-100 text-sm sm:text-base">
          <div className="space-y-2">
            <div>
              <p className="text-purple-200 font-semibold">Entertainment Purposes</p>
              <p className="text-sm">Oracle Path is designed for entertainment and self-reflection purposes only. The mystical guidance provided is generated through AI technology and should be viewed as a tool for contemplation rather than definitive advice.</p>
            </div>
            
            <div>
              <p className="text-purple-200 font-semibold">Not Professional Advice</p>
              <p className="text-sm">The insights provided by Oracle Path do not constitute professional medical, financial, legal, or other expert advice. For such matters, please consult qualified professionals.</p>
            </div>
            
            <div>
              <p className="text-purple-200 font-semibold">Personal Responsibility</p>
              <p className="text-sm">Any actions taken based on Oracle Path's guidance are solely your responsibility. We do not accept liability for decisions or actions resulting from your interaction with our service.</p>
            </div>
            
            <div>
              <p className="text-purple-200 font-semibold">Exercise Judgment</p>
              <p className="text-sm">Users must exercise their own judgment and critical thinking when interpreting the mystical insights provided. The Oracle's wisdom should complement, not replace, rational decision-making.</p>
            </div>
            
            <div>
              <p className="text-purple-200 font-semibold">Serious Matters</p>
              <p className="text-sm">For serious life decisions, health concerns, or legal matters, always seek appropriate professional guidance. Oracle Path is not a substitute for professional consultation.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 sm:mt-6">
          {!hasAcceptedDisclaimer ? (
            <button
              onClick={acceptDisclaimer}
              className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-lg hover:shadow-purple-500/20 text-sm sm:text-base"
            >
              I Understand & Accept
            </button>
          ) : (
            <button
              onClick={() => setShowDisclaimer(false)}
              className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-lg hover:shadow-purple-500/20 text-sm sm:text-base"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 