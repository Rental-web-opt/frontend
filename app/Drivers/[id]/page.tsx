"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { driverService } from "@/services/api"; // Import API
import { ArrowLeft, MapPin, Star, Phone, CheckCircle, User, ShieldCheck, MessageCircle, Languages } from "lucide-react";

export default function DriverProfilePage() {
  const params = useParams();
  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      const fetchDriver = async () => {
        try {
          const response = await driverService.getById(Number(params.id));
          setDriver(response.data);
        } catch (error) {
          console.error("Erreur", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDriver();
    }
  }, [params]);

  if (loading || !driver) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800">
      
      {/* Header */}
      <div className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-[1440px] mx-auto">
            <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white font-bold transition-colors mb-8">
                <ArrowLeft size={20} className="mr-2" /> Retour à l'accueil
            </Link>
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-700">
<Image 
    src={driver.image || "/assets/driver.png"} 
    alt={driver.name || "Photo du chauffeur"} // <--- AJOUTEZ LE TEXTE PAR DÉFAUT ICI
    fill 
    className="object-cover" 
/>                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">{driver.name}</h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-slate-300">
                        <span className="flex items-center gap-1"><MapPin size={16}/> {driver.location || "Cameroun"}</span>
                        <span className="flex items-center gap-1 text-yellow-400"><Star size={16} fill="currentColor"/> {driver.rating || "5.0"} (24 avis)</span>
                    </div>
                </div>
                <div className="md:ml-auto">
                    <div className="text-center md:text-right">
                        <p className="text-sm text-slate-400 mb-1">Tarif Journalier</p>
                        <p className="text-3xl font-black text-orange-500">{driver.pricePerDay?.toLocaleString()} CFA</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Infos Gauche */}
        <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><User size={20} className="text-blue-600"/> Infos Personnelles</h3>
                <ul className="space-y-4 text-sm">
                    <li className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500">Expérience</span>
                        <span className="font-bold">{driver.experience || "Non spécifié"}</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-50 pb-2">
                        <span className="text-slate-500">Âge</span>
                        <span className="font-bold">{driver.age || "N/A"} ans</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="text-slate-500">Permis</span>
                        <span className="font-bold text-green-600 flex items-center gap-1"><CheckCircle size={14}/> Vérifié</span>
                    </li>
                </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Languages size={20} className="text-blue-600"/> Langues</h3>
                <div className="flex flex-wrap gap-2">
                    {driver.languages && driver.languages.map((lang:string, i:number) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{lang}</span>
                    ))}
                    {!driver.languages && <span className="text-sm text-slate-400">Français</span>}
                </div>
            </div>
        </div>

        {/* Bio Droite */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Biographie</h2>
                <p className="text-slate-600 leading-relaxed">{driver.bio || "Ce chauffeur n'a pas encore ajouté de biographie."}</p>
            </div>

            <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                    <Phone size={20}/> Appeler
                </button>
                <button className="flex-1 bg-white border-2 border-slate-100 hover:border-blue-200 text-slate-700 py-4 rounded-2xl font-bold shadow-sm transition-all flex items-center justify-center gap-2">
                    <MessageCircle size={20}/> Message
                </button>
            </div>
        </div>

      </main>
    </div>
  );
}