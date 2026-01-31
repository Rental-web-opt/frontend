"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext"; // On importe le contexte
import { UserCheck, Building2, ArrowRight } from "lucide-react";

import Link from "next/link";
import Landings from "@/components/Landings"; // COMPOSANT HERO AJOUTÉ
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
    <div className="bg-white flex flex-col gap-0">

      {/* 0. Hero Section (Landings) */}
      <Landings />

      {/* 1. Services */}
      <OurService />

      {/* 2. Agences */}
      <QualityAgencies />

      {/* 3. Véhicules en vedette & Why Choose Us */}
      <FeaturedVehicles />

      {/* 4. Section Partenaires (Harmonisée) */}
      <section className="py-16 px-6 max-w-[1440px] mx-auto w-full">
        <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-16">
          <div className="text-center mb-16">
            <span className="text-[#002AD7] font-bold tracking-wider text-sm uppercase bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
              Rejoignez-nous
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-blue-800 mt-4 mb-4">Espace Partenaires</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Vous avez un véhicule ou vous êtes chauffeur ? Connectez-vous, créez votre profil et commencez à générer des revenus dès aujourd'hui.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* CARTE CHAUFFEUR */}
            <div
              onClick={() => protect("/Dashboard/Upgrade/Driver")}
              className="bg-white rounded-[2.5rem] p-10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group text-center border border-slate-100"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-[#002AD7] transition-colors duration-300">
                <UserCheck size={36} className="text-[#002AD7] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Devenir Chauffeur</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Rejoignez notre flotte de chauffeurs professionnels. Gérez vos courses, vos disponibilités et encaissez vos gains facilement.
              </p>
              <button className="w-full py-4 bg-[#002AD7] text-white rounded-xl font-bold hover:bg-blue-800 transition flex items-center justify-center gap-2 text-lg">
                Commencer <ArrowRight size={20} />
              </button>
            </div>

            {/* CARTE AGENCE */}
            <div
              onClick={() => protect("/Dashboard/Upgrade/Agency")}
              className="bg-white rounded-[2.5rem] p-10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group text-center border border-slate-100"
            >
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-[#F76513] transition-colors duration-300">
                <Building2 size={36} className="text-[#F76513] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800">Devenir Agence</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Digitalisez votre agence de location. Gérez votre flotte, suivez vos réservations et augmentez votre visibilité.
              </p>
              <button className="w-full py-4 bg-[#F76513] text-white rounded-xl font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2 text-lg">
                Inscrire ma flotte <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Statistiques */}
      <StatsSection />

      {/* 6. Témoignages */}
      <Testimonials />
    </div>
  );
}