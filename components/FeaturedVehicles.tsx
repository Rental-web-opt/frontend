"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Fuel, Gauge, User, ShieldCheck, Clock, Wallet, Headphones } from "lucide-react";
import { allCars } from "@/modules/carsData"; // On utilise la base de données centralisée

// --- CARTE VÉHICULE (Style Premium) ---
const HomeCarCard = ({ data }: { data: any }) => (
  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-100 flex-shrink-0 w-[300px] md:w-[340px]">
    {/* Image */}
    <div className="relative h-48 bg-gray-100 overflow-hidden">
      <Image 
        src={data.image} 
        alt={data.name} 
        fill 
        className="object-cover group-hover:scale-110 transition-transform duration-700" 
      />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold shadow-sm">
        <Star size={12} className="text-yellow-400 fill-yellow-400" />
        {data.rating}
      </div>
    </div>

    {/* Contenu */}
    <div className="p-5">
      <h3 className="font-bold text-slate-800 text-lg mb-1">{data.name}</h3>
      <p className="text-blue-600 font-extrabold text-xl mb-4">
        {data.price.toLocaleString()} <span className="text-sm font-medium text-slate-400">CFA/jr</span>
      </p>

      {/* Caractéristiques */}
      <div className="flex justify-between border-t border-slate-100 pt-4 mb-4">
        <div className="flex flex-col items-center gap-1">
          <Gauge size={18} className="text-slate-400" />
          <span className="text-xs text-slate-500 font-medium truncate w-16 text-center">{data.specs?.transmission || "Auto"}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Fuel size={18} className="text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">{data.fuel}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <User size={18} className="text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">{data.seats} pl.</span>
        </div>
      </div>

      {/* Bouton Réserver -> Lien vers Détails */}
      <Link href={`/CarsPage/${data.id}`}>
        <button className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-blue-600 transition-colors shadow-lg">
          Réserver
        </button>
      </Link>
    </div>
  </div>
);

// --- ITEM "WHY CHOOSE US" ---
const FeatureItem = ({ icon: Icon, title, desc, color }: any) => (
  <div className="flex gap-5 items-start p-4 hover:bg-slate-50 rounded-2xl transition-colors">
    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-sm`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default function FeaturedVehicles() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Utilisation de toutes les voitures ou une sélection
  const displayCars = allCars; 
  // Limite pour le carrousel (on boucle quand on arrive à la fin)
  const maxIndex = displayCars.length > 0 ? displayCars.length - 1 : 0;

  // Auto-scroll logique (Identique à QualityAgencies)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000); // Change toutes les 5 secondes
    return () => clearInterval(timer);
  }, [maxIndex]);

  return (
    <div className="flex flex-col gap-24 py-20">
      
      {/* === SECTION CARROUSEL VÉHICULES === */}
      <section className="w-full overflow-hidden">
        <div className="text-center mb-12">
          <span className="text-orange-500 font-bold tracking-wider text-sm uppercase">Collection Exclusive</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">Véhicules en Vedette</h2>
        </div>

        {/* Container du Carrousel */}
        <div className="max-w-[1440px] mx-auto px-4">
          <motion.div 
            className="flex gap-6"
            // Calcul du décalage : Largeur Carte (340px sur desktop) + Gap (24px = 6 * 4)
            // On ajuste approximativement à 364px par item pour le scroll
            animate={{ x: `-${currentIndex * 364}px` }} 
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            {displayCars.map((v) => (
              <HomeCarCard key={v.id} data={v} />
            ))}
          </motion.div>
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/CarsPage">
            <button className="bg-white border-2 border-slate-200 text-slate-700 font-bold py-3 px-8 rounded-full hover:border-blue-600 hover:text-blue-600 transition-all">
              Voir tout le catalogue
            </button>
          </Link>
        </div>
      </section>

      {/* === SECTION WHY CHOOSE US === */}
      <section className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-slate-100 w-full">
        <div className="w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6">Pourquoi nous choisir ?</h2>
            <p className="text-lg text-slate-500">
              Nous vous offrons une expérience de mobilité sans tracas, sécurisée et premium.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureItem icon={Clock} title="Rapide & Facile" desc="Réservez votre véhicule en moins de 2 minutes." color="bg-blue-600" />
            <FeatureItem icon={ShieldCheck} title="Sécurité Garantie" desc="Tous nos véhicules sont inspectés régulièrement." color="bg-orange-500" />
            <FeatureItem icon={User} title="Chauffeurs Pros" desc="Nos experts de la route vous conduisent en toute sérénité." color="bg-indigo-600" />
            <FeatureItem icon={Wallet} title="Prix Transparents" desc="Le prix affiché est le prix que vous payez." color="bg-emerald-500" />
            <FeatureItem icon={Headphones} title="Support 24/7" desc="Une équipe dédiée est à votre écoute à tout moment." color="bg-pink-500" />
            <FeatureItem icon={Star} title="Qualité Premium" desc="Nous sélectionnons uniquement les véhicules offrant le meilleur confort." color="bg-violet-600" />
          </div>
        </div>
      </section>
    </div>
  );
}