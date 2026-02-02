"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isMockMode } from "@/services/api";

export default function UpgradePage() {
  const params = useParams();
  const { user, login } = useAuth();
  const router = useRouter();
  const roleTarget = params?.role as string; // "Driver" ou "Agency"

  const handleUpgrade = async () => {
    try {
      // MODE MOCK: Simuler le changement de rôle
      if (isMockMode()) {
        console.log("🎭 Mode démo: Simulation du changement de rôle");

        if (user) {
          // Créer un utilisateur mis à jour avec le nouveau rôle
          const updatedUser = {
            ...user,
            role: roleTarget.toUpperCase()
          };

          // Sauvegarder dans localStorage
          localStorage.setItem("user", JSON.stringify(updatedUser));

          login(updatedUser);
          alert(`✅ [DEMO] Votre compte a été mis à niveau en ${roleTarget} !`);
        }
        return;
      }

      // MODE RÉEL: Appel au Backend
      const axios = (await import('axios')).default;
      const response = await axios.post(`http://localhost:8081/api/users/${user?.id}/upgrade`, {
        role: roleTarget.toUpperCase()
      });

      const updatedUser = response.data;
      login(updatedUser);

    } catch (error) {
      alert("Erreur lors du changement de rôle");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">Confirmation</h1>
        <p className="text-slate-600 mb-8">
          Vous êtes sur le point de passer votre compte en mode
          <span className="font-bold text-blue-600"> {roleTarget}</span>.
        </p>
        {isMockMode() && (
          <p className="text-xs text-orange-500 mb-4 bg-orange-50 p-2 rounded-lg">
            🎭 Mode démo: Le changement sera simulé localement
          </p>
        )}
        <button
          onClick={handleUpgrade}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700"
        >
          Confirmer et Accéder au Dashboard
        </button>
      </div>
    </div>
  );
}