"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Fuel, Gauge, User, ShieldCheck, Clock, Wallet, Headphones } from "lucide-react";
import { allCars } from "@/modules/carsData";

// --- CARTE VÉHICULE PREMIUM (REFONTE) ---
const HomeCarCard = ({ data }: { data: any }) => (
  <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden group border border-slate-100 flex-shrink-0 w-[300px] md:w-[360px] cursor-pointer">
    {/* Image Container avec effet de zoom subtil */}
    <div className="relative h-56 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <Image
        src={data.image}
        alt={data.name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* Badge Note Flottant */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-sm border border-slate-100">
        <Star size={14} className="text-[#F76513] fill-[#F76513]" />
        <span className="text-slate-800">{data.rating}</span>
      </div>

      {/* Badge Catégorie (Optionnel, ex: SUV) */}
      <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-wider">
        {data.category || "Premium"}
      </div>
    </div>

    {/* Contenu */}
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-slate-900 text-xl tracking-tight group-hover:text-[#002AD7] transition-colors">{data.name}</h3>
      </div>

      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-[#002AD7] font-extrabold text-2xl">{data.price.toLocaleString()}</span>
        <span className="text-sm font-medium text-slate-400">CFA/jour</span>
      </div>

      {/* Caractéristiques (Style minimaliste) */}
      <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-50 mb-4 bg-slate-50/50 rounded-xl px-2">
        <div className="flex flex-col items-center gap-1.5">
          <Gauge size={18} className="text-slate-400 group-hover:text-[#002AD7] transition-colors" />
          <span className="text-[11px] text-slate-500 font-semibold truncate w-full text-center">{data.specs?.transmission || "Auto"}</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 border-l border-slate-200/50">
          <Fuel size={18} className="text-slate-400 group-hover:text-[#F76513] transition-colors" />
          <span className="text-[11px] text-slate-500 font-semibold">{data.fuel}</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 border-l border-slate-200/50">
          <User size={18} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
          <span className="text-[11px] text-slate-500 font-semibold">{data.seats} places</span>
        </div>
      </div>

      {/* Bouton Réserver */}
      <Link href={`/CarsPage/${data.id}`} className="block">
        <button className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-[#002AD7] transition-colors shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] duration-200 text-sm tracking-wide">
          Réserver ce véhicule
        </button>
      </Link>
    </div>
  </div>
);

// --- ITEM "WHY CHOOSE US" ---
const FeatureItem = ({ icon: Icon, title, desc, color }: any) => (
  <div className="flex gap-5 items-start p-6 hover:bg-slate-50 rounded-3xl transition-colors border border-transparent hover:border-slate-100 group">
    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#002AD7] transition-colors">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default function FeaturedVehicles() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const displayCars = allCars;

  // --- LOGIQUE DE SCROLL & DOTS ---
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth = 360 + 24; // Card width + gap
      const index = Math.round(scrollLeft / itemWidth);
      setActiveIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = 360 + 24;
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: "smooth"
      });
      setActiveIndex(index);
    }
  };

  // --- AUTO-SLIDE DOUX AVEC PAUSE ---
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const nextIndex = (activeIndex + 1) % displayCars.length;
        scrollTo(nextIndex);
      }
    }, 4000); // 4 secondes par slide

    return () => clearInterval(interval);
  }, [activeIndex, isPaused, displayCars.length]);


  return (
    <div className="flex flex-col gap-24 py-24 bg-gradient-to-b from-white to-slate-50/50">

      {/* === CARROUSEL INTERACTIF === */}
      <section
        className="w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="text-center mb-16 px-6">
          <span className="text-[#002AD7] font-extrabold tracking-widest text-xs uppercase bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 mb-4 inline-block">
            Collection Exclusive
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#002AD7] tracking-tight mt-2">
            Véhicules en Vedette
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            Découvrez nos véhicules les plus prisés, sélectionnés pour leur confort et leur performance.
          </p>
        </div>

        {/* CONTENEUR DE SCROLL HORIZONTAL (Natif & Fluide) */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-8 overflow-x-auto pb-12 px-6 md:px-12 snap-x snap-mandatory scrollbar-hide no-scrollbar"
          style={{ scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {displayCars.map((v) => (
            <div key={v.id} className="snap-center">
              <HomeCarCard data={v} />
            </div>
          ))}
          {/* Spacer pour le dernier élément */}
          <div className="w-1 shrink-0 snap-center" />
        </div>

        {/* DOTS DE NAVIGATION */}
        <div className="flex justify-center gap-3 mt-2">
          {displayCars.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${idx === activeIndex
                ? "w-8 bg-[#002AD7]"
                : "w-2.5 bg-slate-200 hover:bg-slate-300"
                }`}
              aria-label={`Aller au véhicule ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/CarsPage">
            <button className="bg-white border-2 border-slate-100 text-slate-900 font-bold py-4 px-10 rounded-full hover:border-[#002AD7] hover:text-[#002AD7] hover:bg-blue-50/10 transition-all duration-300 shadow-sm hover:shadow-lg text-sm tracking-wide">
              Voir tout le catalogue
            </button>
          </Link>
        </div>
      </section>

      {/* === SECTION WHY CHOOSE US (Refondue) === */}
      <section className="w-full max-w-[1440px] mx-auto px-6">
        <div className="bg-white rounded-[3rem] p-10 md:p-20 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100/60 relative overflow-hidden">

          {/* Décoration background subtile */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none opacity-50"></div>

          <div className="w-full relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-blue-800 mb-6 tracking-tight">Pourquoi nous choisir ?</h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Nous redéfinissons la location de voiture avec une approche centrée sur l'utilisateur, la transparence et la qualité premium.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              <FeatureItem icon={Clock} title="Rapide & Facile" desc="Réservez votre véhicule en moins de 2 minutes via notre interface optimisée." color="bg-[#002AD7]" />
              <FeatureItem icon={ShieldCheck} title="Sécurité Garantie" desc="Véhicules rigoureusement inspectés avant et après chaque location." color="bg-[#F76513]" />
              <FeatureItem icon={User} title="Chauffeurs Experts" desc="Voyagez l'esprit tranquille avec nos chauffeurs professionnels certifiés." color="bg-[#002AD7]" />
              <FeatureItem icon={Wallet} title="Prix Transparents" desc="Aucun frais caché. Le prix affiché est le prix final que vous payez." color="bg-[#002AD7]" />
              <FeatureItem icon={Headphones} title="Support 24/7" desc="Une équipe locale dédiée, disponible à tout moment pour vous assister." color="bg-[#F76513]" />
              <FeatureItem icon={Star} title="Qualité Premium" desc="Une flotte moderne et confortable pour des trajets toujours agréables." color="bg-slate-900" />
            </div>
          </div>
        </div>
      </section >
    </div >
  );
}