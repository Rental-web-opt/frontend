"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, MapPin, Star, Share2, Heart, 
  User, Fuel, Gauge, Calendar, DoorOpen 
} from "lucide-react";

// --- DONNÉES FICTIVES (Basées sur les images) ---
const carData = {
  id: 1,
  name: "Audi Rouge Sport",
  price: 150000,
  description: "J'ai commencé à utiliser cette voiture, elle est confortable et très facile d'usage.",
  location: "Yaoundé, Route de Kribi",
  images: [
    "/assets/car2.jpeg", // Image principale
    "/assets/car1.jpeg",
    "/assets/car3.jpeg",
    "/assets/car4.jpeg",
  ],
  specs: {
    modele: "R8 Coupé",
    marque: "Audi",
    capacite: "2 Personnes",
    couleur: "Rouge",
    carburant: "Essence",
    kilometrage: "15 000 km",
    transmission: "Automatique",
    portes: 2,
    vitesseMax: "330 Km/h"
  },
  reviews: [
    {
      id: 1,
      user: "Manuella DK",
      avatar: "/assets/default-avatar.jpeg",
      rating: 4,
      comment: "J'ai commencé à utiliser cette voiture, elle est confortable, et très facile d'usage."
    }
  ]
};

// --- COMPOSANTS INTERNES ---

// 1. Onglet Présentation (Specs)
const PresentationTab = ({ specs }: { specs: typeof carData.specs }) => (
  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
      {[
        { label: "Nom du véhicule", value: "Audi Sport" },
        { label: "Modèle", value: specs.modele },
        { label: "Marque", value: specs.marque },
        { label: "Capacité", value: specs.capacite },
        { label: "Couleur extérieure", value: specs.couleur },
        { label: "Type de Carburant", value: specs.carburant },
        { label: "Kilométrage", value: specs.kilometrage },
        { label: "Transmission", value: specs.transmission },
        { label: "Nombre de sièges", value: "2" }, // Doublon dans votre screen, j'en mets un
        { label: "Nombre de portes", value: specs.portes },
      ].map((item, i) => (
        <div key={i} className="flex flex-col border-b border-slate-50 pb-2 last:border-0">
          <span className="text-blue-600 font-semibold mb-1">{item.label} :</span>
          <span className="text-slate-600 font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

// 2. Onglet Avis
const ReviewsTab = ({ reviews }: { reviews: typeof carData.reviews }) => (
  <div className="space-y-4">
    {reviews.map((review) => (
      <div key={review.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex gap-4 items-center">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100">
            <Image src={review.avatar} alt={review.user} width={48} height={48} className="object-cover" />
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-800 text-sm">{review.user}</h4>
          <div className="flex text-orange-500 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < review.rating ? "fill-current" : "text-gray-200"} />
            ))}
          </div>
          <p className="text-slate-500 text-xs italic">"{review.comment}"</p>
        </div>
      </div>
    ))}
  </div>
);

// 3. Onglet Statistiques (Les cartes bleues)
const StatsTab = ({ specs }: { specs: typeof carData.specs }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {/* Carte Note */}
    <div className="aspect-square rounded-2xl border-2 border-blue-600 flex flex-col items-center justify-center p-4">
      <Star size={32} className="text-orange-500 fill-orange-500 mb-2" />
      <span className="text-3xl font-bold text-slate-800">5</span>
    </div>
    
    {/* Carte Vitesse */}
    <div className="aspect-square rounded-2xl border-2 border-blue-600 flex flex-col items-center justify-center p-4">
      <span className="text-3xl font-bold text-slate-800">150 +</span>
      <span className="text-slate-500 font-medium">Km/h</span>
    </div>

    {/* Cartes Vides (Comme sur la capture) */}
    {[...Array(6)].map((_, i) => (
      <div key={i} className="aspect-square rounded-2xl border-2 border-blue-600"></div>
    ))}
  </div>
);

export default function CarDetailsPage() {
  const [activeTab, setActiveTab] = useState<"presentation" | "avis" | "history" | "stats">("presentation");

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Header Navigation */}
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        <Link href="/CarsPage" className="inline-flex items-center text-slate-600 hover:text-blue-600 font-bold transition-colors">
          <div className="p-2 bg-white rounded-full shadow-sm mr-3">
             <ArrowLeft size={20} />
          </div>
          Back to Cars
        </Link>
      </div>

      <main className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* === COLONNE GAUCHE (Images & Map) === */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Galerie Photos (Grille de 4) */}
          <div className="grid grid-cols-2 gap-4">
            {carData.images.map((img, index) => (
              <div key={index} className="relative aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group">
                <Image 
                  src={img} 
                  alt={`Vue ${index + 1}`} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
            ))}
          </div>

          {/* Section Localisation */}
          <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Localisation</h2>
            <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100 h-64 relative overflow-hidden">
                {/* Image Map Placeholder (Simulée) */}
                <div className="absolute inset-0 bg-slate-100">
                    {/* Ceci simule votre image de map */}
                    <div className="w-full h-full opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/OpenStreetMap_transport_layer.png')] bg-cover"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-blue-600 p-3 rounded-full shadow-xl animate-bounce">
                            <MapPin className="text-white" size={24} />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* === COLONNE DROITE (Infos & Onglets) === */}
        <div className="lg:col-span-5 space-y-10">
          
          {/* Carte Principale "Rent Now" */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-slate-100 text-center">
            <h1 className="text-3xl font-extrabold text-blue-600 mb-6">{carData.name}</h1>
            
            {/* Grande Image Principale */}
            <div className="relative w-full h-56 mb-6 rounded-2xl overflow-hidden">
                <Image 
                    src={carData.images[0]} 
                    alt="Main Car" 
                    fill 
                    className="object-contain" 
                />
            </div>

            <button className="w-full bg-[#F76513] hover:bg-[#e55a0f] text-white font-bold text-xl py-4 rounded-2xl shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1">
              Rent now
            </button>
          </div>

          {/* Section Onglets (Tabs) */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
            {/* Barre de navigation des onglets */}
            <div className="flex border-b border-slate-100 overflow-x-auto hide-scrollbar">
              {[
                { id: "presentation", label: "Présentation" },
                { id: "avis", label: "Avis" },
                { id: "history", label: "Historique des courses" },
                { id: "stats", label: "Statistiques" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-5 px-4 text-sm font-bold whitespace-nowrap transition-colors relative
                    ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}
                  `}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Contenu des onglets */}
            <div className="p-8 bg-slate-50/50 h-full">
                {activeTab === "presentation" && <PresentationTab specs={carData.specs} />}
                
                {activeTab === "avis" && <ReviewsTab reviews={carData.reviews} />}
                
                {activeTab === "stats" && <StatsTab specs={carData.specs} />}
                
                {/* Historique : j'ai repris la structure présentation pour l'exemple, car le screen est similaire */}
                {activeTab === "history" && (
                    <div className="text-center text-slate-400 py-10">
                        <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Aucun historique disponible pour ce véhicule.</p>
                    </div>
                )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}