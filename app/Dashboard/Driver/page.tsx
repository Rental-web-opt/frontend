"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { UserCheck, MapPin, LogOut } from "lucide-react";

export default function DriverDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* En-tête */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <UserCheck className="text-blue-600" size={32} />
              Espace Chauffeur
            </h1>
            <p className="text-slate-500 mt-1">
              Prêt à conduire, <span className="font-bold text-slate-800">{user?.fullName}</span> ?
            </p>
          </div>
          <button 
            onClick={logout}
            className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition"
          >
            <LogOut size={20} className="inline mr-2" />
            Déconnexion
          </button>
        </div>

        {/* Liste des courses (Exemple) */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center py-20">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <MapPin size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-400">Aucune course pour le moment</h3>
            <p className="text-slate-400 mt-2">Activez votre statut pour recevoir des demandes.</p>
        </div>

      </div>
    </div>
  );
}