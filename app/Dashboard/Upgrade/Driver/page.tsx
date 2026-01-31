"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Building2, LogOut } from "lucide-react";

export default function AgencyDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl p-8 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Building2 className="text-orange-500" size={32} />
              Espace Agence
            </h1>
            <p className="text-slate-500">Bienvenue, {user?.fullName}</p>
          </div>
          <button onClick={logout} className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition">
            <LogOut size={20} className="inline mr-2" /> Déconnexion
          </button>
        </div>
        
        <div className="p-10 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400">
          Vos véhicules et statistiques apparaîtront ici.
        </div>
      </div>
    </div>
  );
}