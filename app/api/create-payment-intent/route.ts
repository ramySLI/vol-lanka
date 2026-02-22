import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key from environment variables
// Note: In a real app, ensure process.env.STRIPE_SECRET_KEY is defined
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2025-02-24.acacia' as any, // Bypass strict type check for the default version mapped to package
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, programId, userId, paymentType } = body;

        // Validate request
        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency: 'usd',
            // Automatic payment methods configuration
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                programId,
                userId: userId || 'anonymous',
                paymentType: paymentType || 'deposit', // 'deposit' or 'full'
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error: any) {
        console.error('Error creating payment intent:', error);
        return NextResponse.json(
            { error: error.message || 'Error occurred during payment initialization' },
            { status: 500 }
        );
    }
}
