"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise, isStripeDemoMode } from "@/lib/stripe";
import CheckoutForm from "@/components/CheckoutForm";
import { ArrowLeft, Shield, Lock } from "lucide-react";
import Link from "next/link";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const totalAmount = parseFloat(searchParams.get("amount") || searchParams.get("total") || "0");
    const description = searchParams.get("description") || "Location de véhicule";
    const bookingId = searchParams.get("bookingId");

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/CarsPage" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition font-medium text-sm mb-4">
                        <ArrowLeft size={16} /> Retour aux véhicules
                    </Link>
                </div>

                {/* Main Card */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <Lock className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Paiement Sécurisé</h1>
                            <p className="text-sm text-slate-500">
                                {isStripeDemoMode ? "Mode démo - Paiement simulé" : "Transaction cryptée et protégée"}
                            </p>
                        </div>
                    </div>

                    {/* Résumé */}
                    <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl">
                        <p className="text-sm font-medium text-blue-600 mb-2">{description}</p>
                        <div className="flex justify-between items-baseline">
                            <span className="text-sm text-slate-600">Montant total</span>
                            <p className="text-3xl font-black text-slate-900">{totalAmount.toLocaleString()} <span className="text-lg font-bold text-slate-500">FCFA</span></p>
                        </div>
                        {bookingId && (
                            <p className="text-xs text-slate-500 mt-2">Réservation #{bookingId}</p>
                        )}
                    </div>

                    {/* Formulaire de paiement */}
                    <Elements stripe={stripePromise}>
                        <CheckoutForm amount={totalAmount} />
                    </Elements>

                    {/* Footer sécurité */}
                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                            <Shield size={14} /> SSL 256-bit
                        </div>
                        <div className="flex items-center gap-1">
                            <Lock size={14} /> Données protégées
                        </div>
                    </div>
                </div>

                {/* Info supplémentaire */}
                <p className="text-center text-xs text-slate-400 mt-6">
                    En procédant au paiement, vous acceptez nos conditions générales de location.
                </p>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-slate-500">Chargement...</div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}