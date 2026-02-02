import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CreditCard, Smartphone } from "lucide-react";

interface CheckoutFormProps {
    amount: number;
}

export default function CheckoutForm({ amount }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // State pour la méthode de paiement : 'CARD', 'MTN', 'ORANGE'
    const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'MTN' | 'ORANGE'>('CARD');
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            if (paymentMethod === 'CARD') {
                if (!stripe || !elements) return;

                // 1. Demander le ClientSecret au Backend
                const response = await axios.post("http://localhost:8081/api/payment/create-payment-intent", {
                    amount: amount,
                    currency: "xaf"
                });

                const { clientSecret } = response.data;

                // 2. Confirmer le paiement avec Stripe
                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement)!,
                    },
                });

                if (result.error) {
                    setErrorMessage(result.error.message || "Erreur de paiement");
                } else {
                    if (result.paymentIntent?.status === "succeeded") {
                        alert("Paiement par Carte réussi !");
                        router.push("/Profil?tab=transactions");
                    }
                }
            } else {
                // SIMULATION MOBILE MONEY (MTN / ORANGE)
                // Ici, on simulerait un appel à une API Mobile Money (ex: CinetPay, monetbil, etc.)
                // Pour l'instant, on simule une attente et une réussite.

                await new Promise(resolve => setTimeout(resolve, 2000)); // Simule délai réseau

                if (phoneNumber.length < 9) {
                    throw new Error("Numéro de téléphone invalide");
                }

                alert(`Paiement ${paymentMethod} initié sur le ${phoneNumber}. Veuillez valider sur votre téléphone.`);

                // Simulation de validation réussie
                alert("Paiement Mobile Money confirmé !");
                router.push("/Profil?tab=transactions");
            }

        } catch (error: any) {
            console.error(error);
            setErrorMessage(error.message || "Une erreur est survenue lors du traitement.");
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* SÉLECTEUR DE MÉTHODE */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl">
                <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-bold transition-all ${paymentMethod === 'CARD' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <CreditCard size={20} className="mb-1" /> Carte Bancaire
                </button>
                <button
                    type="button"
                    onClick={() => setPaymentMethod('MTN')}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-bold transition-all ${paymentMethod === 'MTN' ? 'bg-yellow-400 text-yellow-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Smartphone size={20} className="mb-1" /> MTN MoMo
                </button>
                <button
                    type="button"
                    onClick={() => setPaymentMethod('ORANGE')}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-bold transition-all ${paymentMethod === 'ORANGE' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Smartphone size={20} className="mb-1" /> Orange Money
                </button>
            </div>

            <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
                {paymentMethod === 'CARD' ? (
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Informations de la carte</label>
                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg shadow-md ${paymentMethod === 'MTN' ? 'bg-yellow-400' : 'bg-orange-500'}`}>
                                {paymentMethod === 'MTN' ? 'M' : 'O'}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{paymentMethod === 'MTN' ? 'MTN Mobile Money' : 'Orange Money'}</h3>
                                <p className="text-xs text-gray-500">Paiement mobile sécurisé</p>
                            </div>
                        </div>

                        <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">+237</span>
                            <input
                                type="tel"
                                placeholder="6 XX XX XX XX"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full pl-14 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                                maxLength={9}
                            />
                        </div>
                        <p className="text-xs text-gray-500">Entrez le numéro associé à votre compte {paymentMethod === 'MTN' ? 'MoMo' : 'Orange Money'}.</p>
                    </div>
                )}
            </div>

            {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-lg flex items-center gap-2">
                    ⚠️ {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={(paymentMethod === 'CARD' && !stripe) || loading}
                className={`w-full font-bold py-4 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-white
                    ${paymentMethod === 'CARD' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                    ${paymentMethod === 'MTN' ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500' : ''}
                    ${paymentMethod === 'ORANGE' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                    disabled:opacity-50 disabled:cursor-not-allowed
                `}
            >
                {loading ? (
                    <span className="animate-pulse">Traitement en cours...</span>
                ) : (
                    <>
                        {paymentMethod === 'CARD' ? <CreditCard size={20} /> : <Smartphone size={20} />}
                        Payer {amount.toLocaleString()} FCFA
                    </>
                )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Paiement 100% Sécurisé
            </p>
        </form>
    );
}