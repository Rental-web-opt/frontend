import { loadStripe } from "@stripe/stripe-js";

// Remplacez par votre clé publique Stripe
export const stripePromise = loadStripe("pk_test_votre_cle_publique_ici");