import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getFirebaseAdminApp() {
  // Check if app is already initialized
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Get private key
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('FIREBASE_ADMIN_PRIVATE_KEY is not set in environment variables');
  }

  // Initialize the app with credentials
  try {
    return initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        // Handle the private key without any string manipulation
        privateKey: privateKey.includes('\\n') 
          ? JSON.parse('"' + privateKey + '"') 
          : privateKey,
      }),
    });
  } catch (error: any) {
    console.error('Error initializing Firebase Admin:', {
      error: error.message,
      privateKeyLength: privateKey.length,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL
    });
    throw error;
  }
}

export function getFirebaseAdminDb() {
  try {
    return getFirestore(getFirebaseAdminApp());
  } catch (error: any) {
    console.error('Error getting Firestore instance:', error);
    throw error;
  }
} 