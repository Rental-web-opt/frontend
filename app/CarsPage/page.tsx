"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, SlidersHorizontal, Users, Fuel, Gauge, Car, Star, CalendarClock, Filter, X } from "lucide-react";
import { allCars } from "@/modules/carsData";
import { useFavorite } from "@/context/FavoriteContext";

// --- COMPOSANT CARTE AMÉLIORÉ ---
const CarCard = ({ data }: { data: any }) => {
  const { toggleFavorite, isFavorite } = useFavorite();
  const favorited = isFavorite(data.id);

  return (
    <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-100 flex flex-col h-full relative">

      {/* Badge Abonnement (Si prix mensuel existe) */}
      {data.monthlyPrice && (
        <div className="absolute top-4 left-4 z-20 bg-orange-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <CalendarClock size={12} /> Abonnement dispo
        </div>
      )}

      <div className="relative h-56 bg-slate-100 overflow-hidden">
        <Image
          src={data.image || "/assets/car1.jpeg"}
          alt={data.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(data);
          }}
          className={`absolute top-4 right-4 backdrop-blur-md p-2 rounded-full transition cursor-pointer z-20 ${favorited ? "bg-orange-500 text-white shadow-lg" : "bg-white/80 text-slate-400 hover:text-red-500 hover:bg-red-50"
            }`}
        >
          <Heart size={18} fill={favorited ? "currentColor" : "none"} />
        </div>

        {/* Tag Disponibilité */}
        <div className={`absolute bottom-3 left-3 px-3 py-1 text-xs font-bold rounded-full ${data.isAvailable ? "bg-orange-600 text-white" : "bg-red-500 text-white"}`}>
          {data.isAvailable ? "Disponible" : "Loué"}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{data.name}</h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Star size={12} className="text-blue-400 fill-blue-400" />
              <span>{data.rating || "4.8"} (24 avis)</span>
            </div>
          </div>
        </div>

        {/* Prix Double Affichage */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-blue-600">{data.pricePerDay?.toLocaleString()} CFA</span>
            <span className="text-xs text-slate-400 font-medium">/jour</span>
          </div>
          {data.monthlyPrice && (
            <div className="flex items-center gap-1 text-xs font-bold text-slate-600 mt-1 animate-pulse">
              <CalendarClock size={12} /> Ou {data.monthlyPrice.toLocaleString()} CFA /mois
            </div>
          )}
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100 mb-4">
          <div className="flex flex-col items-center text-center gap-1">
            <Users size={16} className="text-slate-400" />
            <span className="text-xs text-slate-600 font-medium">{data.seats || 5} Pl.</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <Fuel size={16} className="text-slate-400" />
            <span className="text-xs text-slate-600 font-medium">{data.fuelType || "Essence"}</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <Gauge size={16} className="text-slate-400" />
            <span className="text-xs text-slate-600 font-medium truncate w-full">{data.transmission || "Auto"}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Link href={`/CarsPage/${data.id}`}>
            <button className="w-full py-3 bg-blue-700 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg flex items-center justify-center gap-2">
              Voir les offres
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function CarsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(200000);
  const [selectedType, setSelectedType] = useState("Tous");

  // On utilise directement les données mockées pour Vercel
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Mapping des données mockées au format attendu
    const mappedCars = allCars.map((c: any) => ({
      ...c,
      pricePerDay: c.price,
      fuelType: c.fuel,
      isAvailable: true,
      rating: 4.8
    }));
    setCars(mappedCars);
  }, []);

  const filteredCars = cars.filter((car) => {
    const matchName = car.name && car.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPrice = (car.pricePerDay || 0) <= priceRange;
    const matchType = selectedType === "Tous" || (car.type && car.type.toLowerCase() === selectedType.toLowerCase());
    return matchName && matchPrice && matchType;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">

      <main className="max-w-[1440px] mx-auto p-6 flex flex-col md:flex-row gap-8 relative mt-4">

        {/* SIDEBAR FILTRES */}
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-80 bg-white p-6 shadow-2xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-[320px] md:shadow-sm md:rounded-2xl md:border md:border-slate-100 md:h-fit md:sticky md:top-24
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-slate-900 text-xl font-black flex items-center gap-2"><SlidersHorizontal size={20} className="text-blue-600" /> Filtres</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400"><X size={24} /></button>
            <button onClick={() => { setSearchTerm(""); setPriceRange(200000); setSelectedType("Tous") }} className="hidden md:block text-xs text-blue-600 hover:underline font-bold">Réinitialiser</button>
          </div>

          <div className="mb-8">
            <div className="flex justify-between mb-4">
              <label className="text-slate-700 font-bold text-sm">Prix Max / Jour</label>
              <span className="text-sm font-bold text-blue-600">{priceRange.toLocaleString()} CFA</span>
            </div>
            <input type="range" min="5000" max="200000" step="5000" value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>

          <div className="mb-8">
            <label className="text-slate-700 font-bold text-sm mb-4 block">Type de véhicule</label>
            <div className="space-y-3">
              {["Tous", "Sport", "SUV", "Luxe", "Moto", "Quad"].map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedType === type ? 'border-blue-600' : 'border-slate-300'}`}>
                    {selectedType === type && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                  </div>
                  <input type="radio" name="type" className="hidden" checked={selectedType === type} onChange={() => setSelectedType(type)} />
                  <span className={`text-sm font-bold ${selectedType === type ? 'text-blue-700' : 'text-slate-500'}`}>{type}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* CONTENU */}
        <section className="flex-1 pb-20">
          {/* Bannière Promo */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-[2.5rem] p-8 md:p-12 mb-12 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative z-10 max-w-2xl">
              <div className="inline-block bg-blue-500/30 border border-blue-400/30 px-4 py-1.5 rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
                ✨ Nouveauté 2024
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">Découvrez l'Abonnement Auto</h1>
              <p className="text-blue-100 text-lg mb-8">Plus besoin d'acheter. Abonnez-vous à votre véhicule préféré au mois et changez quand vous voulez.</p>
              <Link href="/Plans">
                <button className="bg-white text-blue-900 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg flex items-center gap-2">
                  Voir les formules <CalendarClock size={18} />
                </button>
              </Link>
            </div>
          </div>

          {/* Barre de Recherche Locale (pour Vercel) */}
          <div className="mb-12 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Rechercher une voiture par nom, marque..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-white border border-slate-200 outline-none focus:ring-4 focus:ring-blue-100 shadow-lg text-lg text-slate-700 transition-all placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              {searchTerm ? `Résultats pour "${searchTerm}"` : `${filteredCars.length} véhicules disponibles`}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map((car) => (
                <CarCard key={car.id} data={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Car size={32} />
              </div>
              <p className="text-slate-500 font-medium">Aucun véhicule ne correspond à vos critères.</p>
              <button onClick={() => { setSearchTerm(""); setPriceRange(200000); setSelectedType("Tous") }} className="mt-4 text-blue-600 font-bold hover:underline">Effacer les filtres</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}