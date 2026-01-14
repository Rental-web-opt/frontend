"use client";

import Image from 'next/image';
import { TrendingUp, Users, Car, Building2 } from 'lucide-react'; // J'ajoute les icônes pour le style "Premium"

// Fichier : components/StatsSection.jsx

/**
 * Composant Helper pour une boîte de statistique
 * Mise à jour : Fond blanc pour ressortir sur le fond "Slate-50"
 */
function StatBox({ value, label, icon: Icon }) {
  return (
    <div className="bg-white border-2 border-blue-100 rounded-3xl p-6 text-center shadow-lg hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center justify-center h-full">
      {Icon && (
        <div className="mb-3 p-3 bg-blue-50 rounded-full text-blue-600">
          <Icon size={24} />
        </div>
      )}
      <p className="text-3xl md:text-4xl font-extrabold text-slate-800">{value}</p>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

export default function StatsSection() {
  return (
    // Changement ici : bg-white -> bg-slate-50 pour le fond "bleu clair"
    <section className="bg-slate-50 py-16 md:py-24 rounded-[3rem] my-8">
      <div className="max-w-[1440px] mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ----- COLONNE DE GAUCHE (Titre + Image) ----- */}
          <div className="text-center lg:text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-xs font-bold mb-4 border border-blue-200">
              NOS RÉSULTATS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              La performance <br/>
              <span className="text-blue-600">au service de votre mobilité</span>
            </h2>
            <p className="text-slate-500 text-lg mb-10 max-w-lg mx-auto lg:mx-0">
              Nous connectons des milliers d'utilisateurs aux meilleures agences du pays avec une efficacité record.
            </p>
            
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                 <Image
                  src="/assets/key.png" 
                  alt="Clé de voiture"
                  fill
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* ----- COLONNE DE DROITE (Grille 2x2 des stats) ----- */}
          <div className="grid grid-cols-2 gap-6">
            <StatBox value="10k +" label="Véhicules" icon={Car} />
            <StatBox value="150 +" label="Agences" icon={Building2} />
            <StatBox value="1M +" label="Utilisateurs" icon={Users} />
            <StatBox value="1k +" label="Chauffeurs" icon={TrendingUp} />
          </div>

        </div>
      </div>
    </section>
  );
}