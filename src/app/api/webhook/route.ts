import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
      throw new Error('Missing stripe signature or endpoint secret');
    }
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) {
          throw new Error('Customer was deleted');
        }
        
        // Create users collection reference
        const usersCollection = collection(db, 'users');
        const userRef = doc(usersCollection, customer.metadata.userId);

        // Update subscription status based on the subscription state
        let subscriptionStatus = 'active';
        if (subscription.cancel_at_period_end) {
          subscriptionStatus = 'cancelling';
        } else if (subscription.status === 'canceled') {
          subscriptionStatus = 'inactive';
        }

        // Update or create user document
        await setDoc(userRef, {
          subscriptionStatus,
          subscriptionId: subscription.id,
          customerId: customerId,
          priceId: subscription.items.data[0].price.id,
          hasPremiumAccess: subscription.status === 'active',
          updatedAt: new Date().toISOString()
        }, { merge: true });
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        const deletedCustomerId = deletedSubscription.customer as string;
        const deletedCustomer = await stripe.customers.retrieve(deletedCustomerId);
        if (!deletedCustomer.deleted) {
          const usersCollection = collection(db, 'users');
          const userRef = doc(usersCollection, deletedCustomer.metadata.userId);
          
          await setDoc(userRef, {
            subscriptionStatus: 'inactive',
            hasPremiumAccess: false,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
} 