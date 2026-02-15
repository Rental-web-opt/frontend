import { loadStripe, Stripe } from "@stripe/stripe-js";

// Clé publique Stripe (remplacez par votre vraie clé pour activer les paiements)
// Pour la démo, laissez vide ou commenté pour simuler les paiements
const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY || "";

// Charger Stripe seulement si une vraie clé est fournie
export const stripePromise: Promise<Stripe | null> = STRIPE_PUBLIC_KEY && !STRIPE_PUBLIC_KEY.includes("votre_cle")
    ? loadStripe(STRIPE_PUBLIC_KEY)
    : Promise.resolve(null);

// Mode démo activé si pas de clé Stripe valide
export const isStripeDemoMode = !STRIPE_PUBLIC_KEY || STRIPE_PUBLIC_KEY.includes("votre_cle");