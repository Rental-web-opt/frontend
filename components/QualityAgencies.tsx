"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Clock, ArrowRight, CheckCircle, Building2 } from "lucide-react";
import { allAgencies } from "@/modules/agenciesData";

export default function QualityAgencies() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      // Ajuster selon la largeur réelle de la carte + gap
      const itemWidth = 380;
      const index = Math.round(scrollLeft / itemWidth);
      setActiveIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = 380; // Largeur approximative pour le scroll programmé
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: "smooth"
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-slate-50/50">
      {/* Titre Section */}
      <div className="text-center mb-16 px-6">
        <span className="text-[#002AD7] font-extrabold tracking-widest text-xs uppercase bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
          Partenaires
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-blue-800 mt-6 mb-4 leading-tight">
          Nos Agences de Confiance
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Nous collaborons exclusivement avec des agences certifiées pour vous garantir une qualité de service irréprochable.
        </p>
      </div>

      {/* Carrousel à défilement horizontal natif (SANS AUTO-SCROLL) */}
      <div className="max-w-[1440px] mx-auto px-4">

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto pb-12 px-4 snap-x snap-mandatory scrollbar-hide no-scrollbar"
          style={{ scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {allAgencies.map((agency) => (
            <div key={agency.id} className="min-w-[320px] md:min-w-[380px] snap-center">
              <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300 border border-slate-100 group h-full flex flex-col cursor-pointer">

                {/* Header Carte */}
                <div className="flex justify-between items-start mb-6">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-50 shadow-sm bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {agency.logo ? (
                      <Image
                        src={agency.logo}
                        alt={agency.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    ) : (
                      <Building2 className="text-slate-300" />
                    )}
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-wide ${agency.isOpen ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {agency.isOpen ? <CheckCircle size={12} /> : null}
                    {agency.isOpen ? "Ouvert" : "Fermé"}
                  </span>
                </div>

                {/* Info */}
                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#002AD7] transition-colors">
                  {agency.name}
                </h3>
                <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-2 leading-relaxed">
                  {agency.description}
                </p>

                {/* Métadonnées */}
                <div className="space-y-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-slate-500 gap-2">
                      <MapPin size={18} className="text-[#002AD7]" />
                      <span className="truncate max-w-[140px] font-medium">{agency.city}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg">
                      <Star size={14} className="text-[#F76513] fill-[#F76513]" />
                      {agency.rating}
                    </div>
                  </div>

                  <div className="flex items-center text-slate-500 gap-2 text-sm font-medium">
                    <Clock size={16} className="text-[#F76513]" />
                    {agency.openingHours}
                  </div>
                </div>

                {/* Bouton Voir - LIEN DYNAMIQUE AJOUTÉ */}
                <Link href={`/Agencies/${agency.id}`} className="mt-8">
                  <button className="w-full py-3.5 rounded-xl bg-slate-50 text-[#002AD7] font-bold text-sm hover:bg-[#002AD7] hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-lg border border-transparent hover:border-blue-500/10">
                    Visiter l'agence <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </div>
          ))}
          {/* Spacer de fin */}
          <div className="w-4 shrink-0" />
        </div>

        {/* DOTS DE NAVIGATION (MANUELLE UNIQUEMENT) */}
        <div className="flex justify-center gap-3 mt-8">
          {allAgencies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${idx === activeIndex
                ? "w-8 bg-[#002AD7]"
                : "w-2.5 bg-slate-200 hover:bg-slate-300"
                }`}
              aria-label={`Aller à l'agence ${idx + 1}`}
            />
          ))}
        </div>

      </div>

      {/* Footer Bouton */}
      <div className="text-center mt-16">
        <Link href="/Agencies">
          <button className="bg-[#002AD7] text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-2xl hover:shadow-blue-600/20 hover:-translate-y-1 transition-all">
            Voir toutes les agences
          </button>
        </Link>
      </div>
    </section>
  );
}