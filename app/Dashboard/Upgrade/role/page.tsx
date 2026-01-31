"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios"; // Assurez-vous d'avoir axios

export default function UpgradePage() {
  const params = useParams(); // role = "Driver" ou "Agency"
  const { user, login } = useAuth(); // On aura besoin de re-login pour mettre à jour le rôle local
  const router = useRouter();
  const roleTarget = params?.role as string; // "Driver" ou "Agency"

  const handleUpgrade = async () => {
    try {
      // Appel au Backend pour changer le rôle
      const response = await axios.post(`http://localhost:8081/api/users/${user?.id}/upgrade`, {
        role: roleTarget.toUpperCase() // "DRIVER" ou "AGENCY"
      });
      
      // On met à jour l'utilisateur dans le contexte (Simulé ici par un re-login)
      // Idéalement, le backend renvoie le nouvel objet User mis à jour
      const updatedUser = response.data;
      const token = localStorage.getItem("token") || "";
      
      login(updatedUser, token); // Cela va rediriger automatiquement vers le bon dashboard grâce au AuthContext !
      
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