"use client";

import { usePathname } from 'next/navigation';
import Image from 'next/image';
// Note: On n'utilise plus 'Link' directement pour forcer la vérification
import { Search, Heart, Settings, Car } from 'lucide-react'; 
import AnimatedCarImage from './AnimatedCarImages';
import { useAuth } from '@/context/AuthContext'; // <-- Import du Gardien

export default function Landings() {
  const pathname = usePathname();
  const { protect } = useAuth(); // <-- On récupère la fonction de protection

  // Logique pour cacher le composant sur certaines pages
  if (pathname === '/CarsPage' || pathname === '/Agencies' || pathname === '/Profil' || pathname === '/Help' || pathname.startsWith('/CarsPage/') || pathname.startsWith('/Agencies/') || pathname === '/Plans' || pathname.startsWith('/Reviews') || pathname.startsWith('/Drivers') || pathname.startsWith('/Login')|| pathname.startsWith('/Register') || pathname.startsWith('/Dashboard') ) {
    return null;
  }

  return (
    <div className="bg-slate-50">

      {/* ======================================= */}
      {/* === NAVBAR UNIFIÉE (PROTÉGÉE) === */}
      {/* ======================================= */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 md:px-12 py-4">
        <div className="flex items-center justify-between max-w-[1440px] mx-auto">

          {/* Logo (Protégé aussi) */}
          <button 
            onClick={() => protect('/')} 
            className="text-2xl font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <div className="bg-blue-600 text-white p-1 rounded-lg">
              <Car size={24} />
            </div>
            <span className="text-blue-600">EASY</span>
            <span className="text-orange-500">-RENT</span>
          </button>

          {/* Liens de Navigation (Transformés en Boutons Protégés) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button onClick={() => protect('/')} className="hover:text-blue-600 transition-colors">Home</button>
            <button onClick={() => protect('/CarsPage')} className="hover:text-blue-600 transition-colors">Cars</button>
            <button onClick={() => protect('/Agencies')} className="hover:text-blue-600 transition-colors">Agencies</button>
            <button onClick={() => protect('/Help')} className="hover:text-blue-600 transition-colors">Help</button>
          </nav>

          {/* Icônes d'Action */}
          <div className="flex gap-4 items-center pl-4 border-l border-slate-200 ml-4">
            
            <button 
              onClick={() => protect('/Favorites')} // Exemple de route protégée
              className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            >
              <Heart size={20} />
            </button>
            
            <button 
              onClick={() => protect('/Profil')} 
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition text-slate-600"
            >
              <Settings size={20} />
            </button>
            
            {/* Indicateur visuel (Optionnel) */}
            <div className="w-9 h-9 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        </div>
      </header>

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
                <span className="text-orange-400">de vos rêves.</span>
              </h2>
              <p className="text-blue-100 text-lg md:text-xl leading-relaxed font-light max-w-lg mx-auto lg:mx-0">
                Accédez à une large gamme de véhicules pour toutes les occasions.
                Disponible immédiatement dans plusieurs agences partenaires.
              </p>

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
              <div className="relative z-20 w-full max-w-xl transform hover:scale-105 transition-transform duration-700">
                <AnimatedCarImage />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}