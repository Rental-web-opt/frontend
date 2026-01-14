"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Building2, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UpgradeAgencyPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpgrade = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      // 1. Appel Backend -> Rôle AGENCY
      const response = await axios.post(`http://localhost:8081/api/users/${user.id}/upgrade`, {
        role: "AGENCY"
      });

      // 2. Récupération User mis à jour
      const updatedUser = response.data;

      // 3. Mise à jour Contexte -> Redirection vers /Dashboard/Agency
      login(updatedUser);

    } catch (err: any) {
      console.error(err);
      setError("Erreur technique. Vérifiez que le serveur est lancé.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-2xl w-full rounded-[2.5rem] p-10 shadow-xl border border-slate-100 text-center">
        
        <div className="w-24 h-24 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building2 size={48} />
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-4">Espace Partenaire</h1>
        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          Vous possédez des véhicules ? Passez en compte <strong>Agence</strong> pour gérer votre flotte 
          et publier vos annonces de location.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center justify-center gap-2">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button 
            onClick={handleUpgrade} 
            disabled={loading}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2 text-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Activer mon Compte Agence"}
            {!loading && <ArrowRight size={20} />}
          </button>
          
          <button 
            onClick={() => router.back()}
            className="text-slate-400 font-bold hover:text-slate-600 transition py-2"
          >
            Retour
          </button>
        </div>

      </div>
    </div>
  );
}