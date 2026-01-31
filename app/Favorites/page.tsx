"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
    const router = useRouter();

    useEffect(() => {
        // Rediriger vers la page Profil avec l'onglet favoris actif
        router.replace("/Profil?tab=favorite");
    }, [router]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
}
