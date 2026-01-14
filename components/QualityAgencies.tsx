"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star, Clock, ArrowRight, CheckCircle, Building2 } from "lucide-react";
import { allAgencies } from "@/modules/agenciesData"; // On utilise la vraie base de données

export default function QualityAgencies() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // On affiche 3 cartes sur desktop, donc on limite l'index max
  const maxIndex = allAgencies.length > 0 ? allAgencies.length - 1 : 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Titre Section */}
      <div className="text-center mb-12">
        <span className="text-blue-600 font-bold tracking-wider text-sm uppercase bg-blue-50 px-3 py-1 rounded-full">
          Partenaires
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-4 mb-2">
          Nos Agences de Confiance
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Nous collaborons avec les meilleures agences certifiées pour vous garantir qualité et sécurité.
        </p>
      </div>

      {/* Carrousel */}
      <div className="max-w-[1440px] mx-auto overflow-hidden px-4">
        <motion.div 
          className="flex gap-6"
          animate={{ x: `-${currentIndex * 350}px` }} // Ajustement du scroll (largeur carte + gap)
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {allAgencies.map((agency) => (
            <div key={agency.id} className="min-w-[320px] md:min-w-[380px] p-2">
              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 group h-full flex flex-col">
                
                {/* Header Carte */}
                <div className="flex justify-between items-start mb-6">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center">
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
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${agency.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {agency.isOpen ? <CheckCircle size={12} /> : null}
                    {agency.isOpen ? "Ouvert" : "Fermé"}
                  </span>
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {agency.name}
                </h3>
                <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-2">
                  {agency.description}
                </p>

                {/* Métadonnées */}
                <div className="space-y-3 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-slate-600 gap-2">
                      <MapPin size={16} className="text-blue-500" />
                      <span className="truncate max-w-[120px]">{agency.city}</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-700">
                      <Star size={16} className="text-orange-400 fill-orange-400" />
                      {agency.rating}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-slate-600 gap-2 text-sm">
                    <Clock size={16} className="text-orange-500" />
                    {agency.openingHours}
                  </div>
                </div>

                {/* Bouton Voir - LIEN DYNAMIQUE AJOUTÉ */}
                <Link href={`/Agencies/${agency.id}`}>
                    <button className="w-full mt-6 py-3 rounded-xl bg-slate-50 text-blue-600 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-md">
                    Visiter l'agence <ArrowRight size={16} />
                    </button>
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer Bouton */}
      <div className="text-center mt-12">
        <Link href="/Agencies">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            Voir toutes les agences
          </button>
        </Link>
      </div>
    </section>
  );
}