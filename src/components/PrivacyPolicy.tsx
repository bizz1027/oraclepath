'use client';

import { useState } from 'react';

export default function PrivacyPolicy() {
  const [showPolicy, setShowPolicy] = useState(false);

  const togglePolicy = () => {
    setShowPolicy(!showPolicy);
  };

  if (!showPolicy) {
    return (
      <button
        onClick={togglePolicy}
        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
      >
        Privacy Policy
      </button>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm"></div>
      <div className="relative w-full h-full overflow-y-auto flex items-start justify-center p-4">
        <div className="relative bg-gradient-to-b from-purple-950/95 to-purple-900/95 border border-purple-700/30 rounded-xl p-4 sm:p-6 max-w-2xl w-full my-8 sm:my-12 shadow-xl">
          <div className="text-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Privacy Policy
            </h2>
            <button
              onClick={togglePolicy}
              className="text-purple-400 hover:text-purple-300 absolute right-4 top-4"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4 text-purple-100 text-sm sm:text-base text-center">
            <section>
              <h3 className="text-lg font-semibold text-purple-200 mb-2">1. Introduction</h3>
              <p>This Privacy Policy explains how J.J. Search Solutions Handelsbolag ("Oracle Path", "we", "us", or "our") collects, uses, and protects your personal information when you use our mystical guidance service.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-200 mb-2">2. Information We Collect</h3>
              <p>We collect and process the following information:</p>
              <div className="space-y-2 mt-2">
                <p>Authentication data through Google Sign-In (name, email, profile picture)</p>
                <p>User queries and interactions with our Oracle service</p>
                <p>Usage data and predictions history</p>
                <p>Payment information for premium subscriptions (processed securely through Stripe)</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-200 mb-2">3. How We Use Your Information</h3>
              <div className="space-y-2">
                <p>To provide and personalize our mystical guidance services</p>
                <p>To maintain your account and prediction history</p>
                <p>To process premium subscription payments</p>
                <p>To improve our services and user experience</p>
                <p>To communicate important updates and information</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-200 mb-2">4. Data Storage and Security</h3>
              <p>Your data is securely stored using Firebase (Google Cloud Platform) with industry-standard encryption. We implement appropriate technical and organizational measures to protect your personal information.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-200 mb-2">5. Your Rights</h3>
              <p>Under GDPR, you have the following rights:</p>
              <div className="space-y-2 mt-2">
                <p>Right to access your personal data</p>
                <p>Right to rectification of inaccurate data</p>
                <p>Right to erasure ("right to be forgotten")</p>
                <p>Right to restrict processing</p>
                <p>Right to data portability</p>
                <p>Right to object to processing</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-200 mb-2">6. Third-Party Services</h3>
              <p>We use the following third-party services:</p>
              <div className="space-y-2 mt-2">
                <p>Google Firebase for authentication and data storage</p>
                <p>Stripe for payment processing</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-200 mb-2">7. Contact Information</h3>
              <p>For any privacy-related queries or to exercise your rights, please contact:</p>
              <p>J.J. Search Solutions Handelsbolag</p>
              <p>Email: kontakt@leadfabriken.se</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-200 mb-2">8. Updates to This Policy</h3>
              <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website.</p>
            </section>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={togglePolicy}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-lg hover:shadow-purple-500/20 text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 