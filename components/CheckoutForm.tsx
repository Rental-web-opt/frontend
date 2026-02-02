import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, Smartphone, CheckCircle, AlertCircle } from "lucide-react";
import { bookingService, isMockMode } from "@/services/api";

interface CheckoutFormProps {
    amount: number;
}

export default function CheckoutForm({ amount }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Récupérer l'ID de la réservation depuis les paramètres URL
    const bookingId = searchParams.get("bookingId");

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // State pour la méthode de paiement : 'CARD', 'MTN', 'ORANGE'
    const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'MTN' | 'ORANGE'>('CARD');
    const [phoneNumber, setPhoneNumber] = useState("");

    /**
     * Confirme la réservation après un paiement réussi
     */
    const confirmBookingAfterPayment = async () => {
        if (!bookingId) {
            console.warn("Aucun ID de réservation fourni, impossible de confirmer");
            return false;
        }

        try {
            await bookingService.confirm(Number(bookingId));
            console.log("✅ Réservation confirmée avec succès");
            return true;
        } catch (error) {
            console.error("Erreur lors de la confirmation de la réservation:", error);
            return false;
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            if (paymentMethod === 'CARD') {
                // MODE MOCK: Simuler le paiement
                if (isMockMode()) {
                    console.log("🎭 Mode démo: Simulation du paiement par carte");
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    // Simulation réussie - confirmer la réservation
                    const confirmed = await confirmBookingAfterPayment();

                    setSuccessMessage("🎭 [DEMO] Paiement simulé réussi ! Votre réservation est confirmée.");

                    setTimeout(() => {
                        router.push("/Profil?tab=home");
                    }, 2000);
                } else {
                    // MODE RÉEL avec Stripe
                    if (!stripe || !elements) return;

                    const axios = (await import('axios')).default;
                    const response = await axios.post("http://localhost:8081/api/payment/create-payment-intent", {
                        amount: amount,
                        currency: "xaf"
                    });

                    const { clientSecret } = response.data;

                    const result = await stripe.confirmCardPayment(clientSecret, {
                        payment_method: {
                            card: elements.getElement(CardElement)!,
                        },
                    });

                    if (result.error) {
                        setErrorMessage(result.error.message || "Erreur de paiement");
                    } else {
                        if (result.paymentIntent?.status === "succeeded") {
                            const confirmed = await confirmBookingAfterPayment();
                            setSuccessMessage("Paiement réussi ! Votre réservation est confirmée.");

                            setTimeout(() => {
                                router.push("/Profil?tab=home");
                            }, 2000);
                        }
                    }
                }
            } else {
                // SIMULATION MOBILE MONEY (MTN / ORANGE)
                if (phoneNumber.length < 9) {
                    throw new Error("Numéro de téléphone invalide (9 chiffres minimum)");
                }

                // Simule délai réseau
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Simulation de validation réussie - CONFIRMER LA RÉSERVATION
                const confirmed = await confirmBookingAfterPayment();

                setSuccessMessage(`Paiement ${paymentMethod} confirmé ! Votre réservation est validée.`);

                setTimeout(() => {
                    router.push("/Profil?tab=home");
                }, 2000);
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
                    className={`flex flex-col items-center justify-center py-3 px-1 rounded-lg text-xs font-bold transition-all ${paymentMethod === 'CARD' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <CreditCard size={20} className="mb-1" /> Carte Bancaire
                </button>
                <button
                    type="button"
                    onClick={() => setPaymentMethod('MTN')}
                    className={`flex flex-col items-center justify-center py-3 px-1 rounded-lg text-xs font-bold transition-all ${paymentMethod === 'MTN' ? 'bg-yellow-400 text-yellow-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Smartphone size={20} className="mb-1" /> MTN MoMo
                </button>
                <button
                    type="button"
                    onClick={() => setPaymentMethod('ORANGE')}
                    className={`flex flex-col items-center justify-center py-3 px-1 rounded-lg text-xs font-bold transition-all ${paymentMethod === 'ORANGE' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
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

            {/* Messages d'erreur / succès */}
            {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl flex items-center gap-2">
                    <AlertCircle size={18} /> {errorMessage}
                </div>
            )}

            {successMessage && (
                <div className="p-4 bg-green-50 border border-green-100 text-green-600 text-sm font-medium rounded-xl flex items-center gap-2">
                    <CheckCircle size={18} /> {successMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={(paymentMethod === 'CARD' && !stripe) || loading || !!successMessage}
                className={`w-full font-bold py-4 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-white
                    ${paymentMethod === 'CARD' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                    ${paymentMethod === 'MTN' ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500' : ''}
                    ${paymentMethod === 'ORANGE' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                    disabled:opacity-50 disabled:cursor-not-allowed
                `}
            >
                {loading ? (
                    <span className="animate-pulse">Traitement en cours...</span>
                ) : successMessage ? (
                    <>
                        <CheckCircle size={20} /> Paiement confirmé !
                    </>
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

            {/* Info réservation */}
            {bookingId && (
                <p className="text-center text-xs text-gray-400">
                    Réservation #{bookingId}
                </p>
            )}
        </form>
    );
}