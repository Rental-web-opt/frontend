import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual publishable key
// In production, use process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe('pk_test_51QcGMJCBELr1mKQ6yXQhXYXQyXQyXQyXQyXQyXQyXQyXQyXQyXQyXQyXQyXQyX');

export default stripePromise;
