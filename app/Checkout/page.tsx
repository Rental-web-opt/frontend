"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import CheckoutForm from "@/components/CheckoutForm";
export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const totalAmount = parseFloat(searchParams.get("total") || "0");
    const description = searchParams.get("description") || "Paiement";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 font-sans">Paiement Sécurisé</h1>
                <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg">
                    <p className="text-sm font-medium text-blue-600 mb-1">{description}</p>
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm">Montant à payer</span>
                        <p className="text-3xl font-bold">{totalAmount.toLocaleString()} FCFA</p>
                    </div>
                </div>

                <Elements stripe={stripePromise}>
                    <CheckoutForm amount={totalAmount} />
                </Elements>
            </div>
        </div>
    );
}