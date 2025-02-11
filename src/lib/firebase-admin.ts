import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Helper function to format private key
function formatPrivateKey(key: string | undefined) {
  if (!key) throw new Error('No private key found');
  // Handle newlines in the private key if stored with \n
  return key.replace(/\\n/g, '\n');
}

function getFirebaseAdminApp() {
  const privateKey = formatPrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY);
  
  if (getApps().length === 0) {
    return initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  }
  return getApps()[0];
}

export function getFirebaseAdminDb() {
  return getFirestore(getFirebaseAdminApp());
} 