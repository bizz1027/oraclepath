import { NextResponse } from 'next/server';
import { getFirebaseAdminDb } from '../../../lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { userId, userEmail, message, platform, userAgent } = await req.json();

    if (!userId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = getFirebaseAdminDb();
    
    const feedbackData = {
      userId,
      userEmail,
      message: message.trim(),
      createdAt: new Date(),
      status: 'new',
      platform: platform || 'web',
      userAgent: userAgent || 'unknown'
    };

    const feedbackRef = await db.collection('feedback').add(feedbackData);

    return NextResponse.json({ 
      success: true, 
      feedbackId: feedbackRef.id 
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to submit feedback';
      
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 