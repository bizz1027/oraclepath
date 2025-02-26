import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';

export default function FeedbackForm() {
  const [user] = useAuthState(auth);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in to submit feedback');
      return;
    }
    if (!feedback.trim()) {
      setError('Please enter your feedback');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Attempting to submit feedback:', {
        userId: user.uid,
        feedbackLength: feedback.length,
        timestamp: new Date().toISOString()
      });

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          message: feedback.trim(),
          platform: 'web',
          userAgent: window.navigator.userAgent
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      console.log('Feedback submitted successfully:', data.feedbackId);

      setFeedback('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Detailed feedback submission error:', err);
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to submit feedback. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 mb-8 px-4">
      <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          🌟 Share Your Mystical Experience
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
                setError(null);
              }}
              maxLength={500}
              placeholder="How has your journey with Oracle Path been? Share your thoughts..."
              className="w-full h-32 px-4 py-3 bg-purple-800/30 border border-purple-600/50 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              disabled={isSubmitting}
            />
            <div className="flex justify-end mt-1">
              <span className="text-sm text-purple-400">
                {feedback.length}/500
              </span>
            </div>
          </div>

          {error && (
            <div className="text-red-400 bg-red-900/20 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {showSuccess && (
            <div className="text-emerald-400 bg-emerald-900/20 p-3 rounded-lg text-sm animate-fadeIn">
              Thank you for sharing your experience! 🙏✨
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 group-hover:scale-110 transform transition-all duration-700 ease-out"></span>
            <span className="relative">
              {isSubmitting ? 'Sending to the cosmos...' : 'Share Feedback'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
} 