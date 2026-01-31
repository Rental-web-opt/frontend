import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import axios from 'axios';

// Replace with your actual publishable key
const stripePromise = loadStripe('pk_test_51QcGMJCBELr1mKQ6yXQhXYXQyXQyXQyXQyXQyXQyXQyXQyXQyXQyXQyXQyXQyX'); // Use a valid key here

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    // Get parameters from URL
    const amount = Number(searchParams.get('amount') || 0);
    const bookingId = searchParams.get('bookingId');
    const description = searchParams.get('description') || "Paiement EasyRent";

    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            // Wait for auth check or redirect
            return;
        }

        if (amount <= 0) {
            setError("Montant invalide");
            setLoading(false);
            return;
        }

        // Create PaymentIntent as soon as the page loads
        const createIntent = async () => {
            try {
                const res = await axios.post('http://localhost:8081/api/payments/create-intent', {
                    amount: amount,
                    currency: 'XAF',
                    bookingId: bookingId ? Number(bookingId) : null,
                    description: description
                }, {
                    withCredentials: true
                });

                setClientSecret(res.data.clientSecret);
            } catch (err: any) {
                console.error("Error creating payment intent", err);
                setError("Impossible d'initialiser le paiement. Veuillez réessayer.");
            } finally {
                setLoading(false);
            }
        };

        createIntent();
    }, [user, amount, bookingId, description]);

    const handleSuccess = async (paymentIntentId: string) => {
        // Confirm payment in backend (optional double verification)
        try {
            await axios.post('http://localhost:8081/api/payments/confirm', {
                paymentIntentId: paymentIntentId
            }, { withCredentials: true });

            // Redirect to success page or profile
            router.push('/Profil?tab=transactions&success=true');
        } catch (err) {
            console.error("Confirmation error", err);
            // Even if backend confirm fails API call, stripe succeeded so we can probably redirect
            router.push('/Profil?tab=transactions');
        }
    };

    if (!user && !loading) {
        router.push('/Login');
        return null;
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Erreur</h2>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <button onClick={() => router.back()} className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition">
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe' as const,
            variables: {
                colorPrimary: '#2563eb',
                borderRadius: '12px',
            },
        },
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-md mx-auto">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition font-bold mb-8">
                    <ArrowLeft size={20} /> Annuler
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-blue-600 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldCheck size={100} />
                        </div>
                        <p className="text-blue-100 text-sm font-medium mb-1">Total à payer</p>
                        <h1 className="text-4xl font-black">{amount.toLocaleString()} CFA</h1>
                        <p className="text-blue-100 text-xs mt-2 opacity-80">{description}</p>
                    </div>

                    <div className="p-8">
                        {clientSecret && (
                            <Elements stripe={stripePromise} options={options}>
                                <CheckoutForm amount={amount} onSuccess={handleSuccess} />
                            </Elements>
                        )}
                    </div>
                </div>

                <p className="text-center text-slate-400 text-xs mt-8">
                    EasyRent utilise un chiffrement SSL sécurisé pour protéger vos données.
                </p>
            </div>
        </div>
    );
}
