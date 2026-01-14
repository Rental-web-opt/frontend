"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext"; // On importe le contexte
import { UserCheck, Building2, ArrowRight } from "lucide-react";

// Importez vos composants existants (vérifiez les chemins)
import FeaturedVehicles from "@/components/FeaturedVehicles";
import QualityAgencies from "@/components/QualityAgencies";
import OurService from "@/components/OurService";
import StatsSection from "@/components/StatsSection";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  // On récupère UNIQUEMENT la fonction protect du contexte
  // Plus besoin de router ou de logique compliquée ici
  const { protect } = useAuth();

  return (
    <div className="bg-white">
      <div className="py-8 bg-slate-50"><OurService /></div>
      <div className="py-8"><QualityAgencies /></div>
      <div className="py-8"><FeaturedVehicles /></div>

      {/* --- SECTION HÉROS / CARTE PARTENAIRES --- */}
      <section className="py-16 px-6 max-w-[1440px] mx-auto bg-slate-50 mt-8 rounded-[3rem]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Espace Partenaires</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Vous avez un véhicule ou vous êtes chauffeur ? Connectez-vous pour rejoindre le réseau.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* CARTE : DEVENIR CHAUFFEUR */}
          <div
            // C'est ici que la magie opère : protect() gère tout (Login ou Redirection)
            onClick={() => protect("/Dashboard/Upgrade/Driver")}
            className="bg-white rounded-[2rem] p-8 border border-slate-100 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer group text-center"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
              <UserCheck size={32} className="text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-800">Devenir Chauffeur</h3>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
              Créez votre profil professionnel, recevez des courses et gérez votre emploi du temps via votre <strong>Dashboard Chauffeur</strong>.
            </p>
            <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
              Devenir Chauffeur <ArrowRight size={18} />
            </button>
          </div>

          {/* CARTE : DEVENIR AGENCE */}
          <div
            onClick={() => protect("/Dashboard/Upgrade/Agency")}
            className="bg-white rounded-[2rem] p-8 border border-slate-100 hover:border-orange-500 hover:shadow-xl transition-all cursor-pointer group text-center"
          >
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-600 transition-colors">
              <Building2 size={32} className="text-orange-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-800">Devenir Agence</h3>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">
              Inscrivez vos véhicules, gérez votre flotte et suivez vos réservations via votre <strong>Dashboard Agence</strong>.
            </p>
            <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2">
              Inscrire mes véhicules <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </section>

      <StatsSection />
      <div className="py-8 bg-slate-50"><Testimonials /></div>
    </div>
  );
}