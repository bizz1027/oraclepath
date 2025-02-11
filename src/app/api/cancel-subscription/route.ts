import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirebaseAdminDb } from '@/lib/firebase-admin';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
});

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's subscription info from Firestore using Admin SDK
    const db = getFirebaseAdminDb();
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData?.subscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Cancel the subscription at period end
    const subscription = await stripe.subscriptions.update(
      userData.subscriptionId,
      {
        cancel_at_period_end: true
      }
    );

    return NextResponse.json({
      message: 'Subscription will be canceled at the end of the billing period',
      cancelAt: subscription.cancel_at
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
} 