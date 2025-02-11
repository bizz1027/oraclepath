import { NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get Firestore instance
    const db = getFirebaseAdminDb();
    
    // Update user document to make them an admin
    await db.collection('users').doc(userId).set({
      isAdmin: true,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({
      message: 'User has been granted admin access',
      userId
    });
  } catch (error) {
    console.error('Error making user admin:', error);
    return NextResponse.json(
      { error: 'Failed to grant admin access' },
      { status: 500 }
    );
  }
} 