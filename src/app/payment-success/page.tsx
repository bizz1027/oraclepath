'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '../../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user] = useAuthState(auth);
  const paymentIntent = searchParams.get('payment_intent');
  const redirectStatus = searchParams.get('redirect_status');

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (redirectStatus === 'succeeded' && user) {
        // Wait a moment for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check premium status
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        
        if (userData?.hasPremiumAccess) {
          // Redirect back to home after 3 seconds
          const timer = setTimeout(() => {
            router.replace('/');
          }, 3000);

          return () => clearTimeout(timer);
        } else {
          // If premium status not yet set, wait longer
          setTimeout(checkAndRedirect, 1000);
        }
      } else {
        // If payment wasn't successful, redirect immediately
        router.replace('/');
      }
    };

    checkAndRedirect();
  }, [router, redirectStatus, user]);

  if (redirectStatus !== 'succeeded') {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-black text-white p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="text-6xl mb-4">✨</div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Divine Insight Subscription Activated!
        </h1>
        <p className="text-purple-200">
          Your journey to deeper mystical wisdom begins now. Redirecting you back to the Oracle...
        </p>
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-black">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
} 