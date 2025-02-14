import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';

// Initialize Stripe with the test publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (result.error) {
        setError(result.error.message || 'An error occurred');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('An unexpected error occurred. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{
        layout: 'tabs',
        defaultValues: {
          billingDetails: {
            name: 'Oracle Seeker',
          }
        }
      }} />
      {error && (
        <div className="text-red-400 bg-red-900/20 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-purple-300 hover:text-white transition-colors"
          disabled={processing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {processing ? 'Processing...' : 'Subscribe to Divine Insight (€4.99/month)'}
        </button>
      </div>
    </form>
  );
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (isOpen && user) {
      setError(null);
      // Create a new subscription when the modal opens
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error('Subscription creation error:', data.error);
            setError(data.error);
          } else {
            setClientSecret(data.clientSecret);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setError('Failed to initialize subscription. Please try again.');
        });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-purple-900/95 border border-purple-700/50 rounded-xl p-6 max-w-md w-full space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-red-400">{error}</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-purple-900/95 border border-purple-700/50 rounded-xl p-6 max-w-md w-full space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-purple-900/95 border border-purple-700/50 rounded-xl p-6 max-w-md w-full space-y-4 my-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          Subscribe to Divine Insight
        </h2>
        <p className="text-purple-200 mb-6">
          Gain unlimited access to deeper mystical insights and comprehensive guidance from the Oracle.
        </p>
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'night',
              variables: {
                colorPrimary: '#9333ea',
                colorBackground: '#581c87',
                colorText: '#ffffff',
                colorDanger: '#ef4444',
              },
            },
          }}
        >
          <CheckoutForm onSuccess={onSuccess} onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
} 