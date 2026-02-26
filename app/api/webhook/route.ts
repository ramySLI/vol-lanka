/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase/admin';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2025-02-24.acacia' as any,
});

// Stripe requires the raw body to verify webhooks. In Next.js App Router, 
// this is handled automatically via req.text() instead of the old bodyParser config.

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'
        );
    } catch (err: any) {
        console.error(`Webhook Error message: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);

            const { programId, userId, paymentType } = paymentIntent.metadata;

            // In a full implementation, we'd update the Firestore Booking document here
            /*
            if (userId && programId) {
               try {
                 // Search for booking by user and program, or create new if not existing
                 // Update status to 'confirmed' and append payment details
                 const bookingRef = adminDb.collection('bookings').where('userId', '==', userId)...
                 
                 console.log('Successfully recorded payment to Firestore');
               } catch(e) {
                 console.error('Firestore update failed in webhook', e);
               }
            }
            */
            break;

        case 'payment_intent.payment_failed':
            console.error('Payment failed.');
            break;

        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }

    return NextResponse.json({ received: true });
}
