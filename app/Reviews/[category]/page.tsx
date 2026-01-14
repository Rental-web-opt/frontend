"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
// IMPORTS API
import { carService, driverService, agencyService } from "@/services/api";
import { 
  Star, User, Car, Building2, ShieldCheck, Quote, ArrowLeft, AlertCircle, MapPin
} from "lucide-react";

// --- COMPOSANT CARTE ---
const ReviewItemCard = ({ data, type }: { data: any, type: 'vehicle' | 'driver' | 'agency' }) => {
  const title = type === 'driver' ? data.name : data.name;
  let subtitle = "";
  if (type === 'vehicle') subtitle = data.type;
  else if (type === 'agency') subtitle = data.city;
  else subtitle = `${data.experience || "Expert"} d'expérience`;

  const image = type === 'agency' ? (data.logo || "/assets/agencies.png") : (data.image || (type === 'driver' ? "/assets/driver.png" : "/assets/car2.jpeg"));
  
  // Liens dynamiques
  let linkHref = "#";
  let buttonText = "Voir les détails";
  if (type === 'vehicle') linkHref = `/CarsPage/${data.id}`;
  else if (type === 'agency') linkHref = `/Agencies/${data.id}`;
  else if (type === 'driver') { linkHref = `/Drivers/${data.id}`; buttonText = "Voir le profil"; }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all group flex flex-col h-full">
      <div className="flex items-start gap-4 mb-6">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
<Image 
    src={image || "/assets/car1.jpeg"} // Sécurité aussi sur l'image
    alt={title || "Image de l'avis"}   // <--- C'EST ICI LA CLÉ (Le || ajoute un texte par défaut)
    fill 
    className="object-cover" 
/>        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1 line-clamp-1">{title}</h3>
          <p className="text-sm text-slate-500 mb-2 flex items-center gap-1">
            {type === 'driver' && <ShieldCheck size={14} className="text-green-500" />}
            {type === 'agency' && <MapPin size={14} className="text-blue-500" />}
            {subtitle}
          </p>
          <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg w-fit">
            <Star size={14} className="text-orange-500 fill-orange-500" />
            <span className="text-sm font-bold text-slate-700">{data.rating || "N/A"}</span>
          </div>
        </div>
      </div>
      <Link href={linkHref} className="mt-auto w-full py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all text-center block">
        {buttonText}
      </Link>
    </div>
  );
};

// --- PAGE PRINCIPALE ---
export default function ReviewsCategoryPage() {
  const params = useParams();
  const category = params.category as string; 

  const [contentData, setContentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Configuration statique pour l'UI
  const config = {
    vehicles: { title: "Avis Véhicules", desc: "Découvrez les retours sur notre flotte.", icon: <Car size={32} /> },
    drivers: { title: "Nos Chauffeurs", desc: "Des professionnels notés par la communauté.", icon: <User size={32} /> },
    agencies: { title: "Agences Partenaires", desc: "Transparence sur nos partenaires.", icon: <Building2 size={32} /> },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (category === 'vehicles') response = await carService.getAll();
        else if (category === 'drivers') response = await driverService.getAll();
        else if (category === 'agencies') response = await agencyService.getAll();
        
        if (response) setContentData(response.data);
      } catch (error) {
        console.error("Erreur API", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  const currentConfig = config[category as keyof typeof config];

  if (!currentConfig) return <div className="text-center py-20 font-bold text-red-500">Catégorie invalide</div>;
  if (loading) return <div className="text-center py-20 font-bold text-slate-500">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 md:px-12 py-4">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors">
                <ArrowLeft size={20} /> Retour
            </Link>
            <h1 className="font-bold text-lg text-slate-700">Espace Avis</h1>
            <div className="w-20"></div> 
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
                {currentConfig.icon}
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4">{currentConfig.title}</h1>
            <p className="text-slate-500 text-lg">{currentConfig.desc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contentData.length > 0 ? contentData.map((item: any) => (
                <ReviewItemCard 
                    key={item.id} 
                    data={item} 
                    type={category === 'vehicles' ? 'vehicle' : category === 'agencies' ? 'agency' : 'driver'} 
                />
            )) : (
              <div className="col-span-3 text-center py-10 text-slate-400">Aucun élément trouvé.</div>
            )}
        </div>
      </main>
    </div>
  );
}