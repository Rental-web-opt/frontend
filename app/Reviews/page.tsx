"use client";

import Link from "next/link";
import { Star, ArrowLeft } from "lucide-react";

export default function ReviewsPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-8">
                    <ArrowLeft size={20} /> Retour à l'accueil
                </Link>

                <div className="text-center py-20">
                    <Star size={64} className="mx-auto text-yellow-400 mb-6" />
                    <h1 className="text-3xl font-bold text-slate-800 mb-4">Avis Clients</h1>
                    <p className="text-slate-500">Cette page sera bientôt disponible.</p>
                </div>
            </div>
        </div>
    );
}
