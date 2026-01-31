"use client";

import { usePathname } from 'next/navigation';
import AnimatedCarImage from './AnimatedCarImages';
import { useAuth } from '@/context/AuthContext';
import SearchBar from './SearchBar';

export default function Landings() {
  const pathname = usePathname();
  const { protect } = useAuth();

  // Affiche UNIQUEMENT sur la page d'accueil
  if (pathname !== '/') {
    return null;
  }

  return (
    <div className="bg-slate-50">
      {/* ======================================= */}
      {/* === HERO SECTION (PROTÉGÉE) === */}
      {/* ======================================= */}
      <section className="relative bg-[#2563EB] px-6 md:px-12 py-20 overflow-hidden min-h-[600px] rounded-b-[3rem] shadow-lg mx-0 md:mx-4 mt-0 md:mt-4">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
                Louez la voiture <br />
                <span className="text-white">de vos rêves.</span>
              </h2>
              <p className="text-blue-100 text-lg md:text-xl leading-relaxed font-light max-w-lg mx-auto lg:mx-0">
                Accédez à une large gamme de véhicules pour toutes les occasions.
                Disponible immédiatement dans plusieurs agences partenaires.
              </p>

              {/* 🔍 Barre de recherche Elasticsearch */}
              <div className="pt-4">
                <SearchBar />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

                {/* Bouton Réserver -> Protégé */}
                <button
                  onClick={() => protect('/CarsPage')}
                  className="bg-[#F76513] hover:bg-[#e55a0f] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1"
                >
                  Réserver maintenant
                </button>

                {/* Bouton Agences -> Protégé */}
                <button
                  onClick={() => protect('/Agencies')}
                  className="bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold px-8 py-4 rounded-xl transition-all hover:bg-white/20"
                >
                  Voir les agences
                </button>

              </div>
            </div>

            {/* Right Content - Car Image */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative z-20 w-full max-w-3xl transform hover:scale-105 transition-transform duration-700">
                <AnimatedCarImage />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}