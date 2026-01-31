import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface CheckoutFormProps {
    amount: number;
    onSuccess: (paymentIntentId: string) => void;
}

export default function CheckoutForm({ amount, onSuccess }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            // Trigger form validation and wallet collection
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setErrorMessage(submitError.message || "Une erreur est survenue");
                setIsProcessing(false);
                return;
            }

            // Create the PaymentIntent on the backend (usually done before, but here we confirm)
            // Actually with PaymentElement, we confirm the payment

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/Checkout/Success`,
                },
                redirect: 'if_required', // Use 'if_required' to handle redirect manually or avoid it if possible
            });

            if (error) {
                setErrorMessage(error.message || "Paiement échoué");
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                onSuccess(paymentIntent.id);
            }
        } catch (e: any) {
            setErrorMessage(e.message || "Une erreur inattendue est survenue");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-6">
                <PaymentElement />
            </div>

            {errorMessage && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm font-medium">
                    <AlertCircle size={18} />
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
          ${isProcessing ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
        `}
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="animate-spin" /> Traitement...
                    </>
                ) : (
                    `Payer ${amount.toLocaleString()} CFA`
                )}
            </button>

            <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                <CheckCircle size={12} /> Paiement sécurisé par Stripe
            </p>
        </form>
    );
}
