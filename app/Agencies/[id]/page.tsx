"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { agencyService, carService } from "@/services/api";
import {
  ArrowLeft, MapPin, Star, AlertCircle,
  Phone, Mail, Clock, CheckCircle, XCircle, Globe, Info, Loader2,
  Car, Fuel, Users, Gauge, ArrowRight
} from "lucide-react";

interface CarType {
  id: number;
  name: string;
  brand: string;
  type: string;
  pricePerDay: number;
  image?: string;
  images?: string[];
  available: boolean;
  transmission?: string;
  fuelType?: string;
  seats?: number;
}

export default function AgencyDetailsPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("vehicules");

  const [agency, setAgency] = useState<any>(null);
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [carsLoading, setCarsLoading] = useState(true);

  const isShopOpen = (openingHours: string) => {
    if (!openingHours) return false;
    try {
      const now = new Date();
      const currentHour = now.getHours();
      const hours = openingHours.match(/(\d+)/g);
      if (hours && hours.length >= 2) {
        return currentHour >= parseInt(hours[0]) && currentHour < parseInt(hours[1]);
      }
    } catch (e) { return false; }
    return false;
  };

  useEffect(() => {
    if (params?.id) {
      const fetchData = async () => {
        try {
          // Récupérer l'agence
          const agencyRes = await agencyService.getById(Number(params.id));
          setAgency(agencyRes.data);
          setLoading(false);

          // Récupérer tous les véhicules et filtrer par agence
          const carsRes = await carService.getAll();
          const agencyCars = carsRes.data.filter(
            (car: any) => car.agency && car.agency.id === Number(params.id)
          );
          setCars(agencyCars);
          setCarsLoading(false);
        } catch (error) {
          console.error("Erreur", error);
          setLoading(false);
          setCarsLoading(false);
        }
      };
      fetchData();
    }
  }, [params]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-blue-600 font-bold">
      <Loader2 className="animate-spin mr-2" /> Chargement...
    </div>
  );

  if (!agency) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <AlertCircle size={48} className="text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-700">Agence introuvable</h1>
        <Link href="/Agencies" className="text-blue-600 hover:underline mt-4 font-bold">Retour aux agences</Link>
      </div>
    );
  }

  const isOpenNow = isShopOpen(agency.openingHours);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800">

      {/* Header Navigation */}
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <Link href="/Agencies" className="inline-flex items-center text-slate-600 hover:text-blue-600 font-bold transition-colors group">
          <div className="p-2.5 bg-white rounded-full shadow-sm border border-slate-100 mr-3 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
            <ArrowLeft size={20} className="text-slate-500 group-hover:text-blue-600" />
          </div>
          Retour à la liste
        </Link>
      </div>

      <main className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        {/* === COLONNE GAUCHE (Infos Contact & Map) === */}
        <div className="lg:col-span-4 space-y-8">

          {/* Carte Profil Agence */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-blue-800"></div>

            <div className="relative z-10">
              <div className="w-28 h-28 mx-auto bg-white rounded-2xl p-1 shadow-lg mb-4 mt-8">
                <div className="w-full h-full relative rounded-xl overflow-hidden border border-slate-100">
                  {agency.logo ? (
                    <Image src={agency.logo} alt={agency.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-bold text-2xl">
                      {agency.name?.charAt(0) || "A"}
                    </div>
                  )}
                </div>
              </div>

              <h1 className="text-2xl font-extrabold text-slate-800 mb-1">{agency.name}</h1>
              <p className="text-slate-500 text-sm font-medium mb-2">{agency.city || "Cameroun"}</p>

              {/* Stats rapides */}
              <div className="flex justify-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-black text-blue-600">{cars.length}</p>
                  <p className="text-xs text-slate-500">Véhicules</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-yellow-500">{agency.rating || "N/A"}</p>
                  <p className="text-xs text-slate-500">Note</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-emerald-600">{agency.reviewCount || 0}</p>
                  <p className="text-xs text-slate-500">Avis</p>
                </div>
              </div>

              {agency.tags && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {agency.tags.map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{tag}</span>
                  ))}
                </div>
              )}

              <div className="space-y-4 text-left bg-slate-50 p-5 rounded-2xl">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-white rounded-full text-blue-600 shadow-sm"><Phone size={16} /></div>
                  <span className="font-semibold text-slate-700">{agency.phone || "Non renseigné"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-white rounded-full text-blue-600 shadow-sm"><Mail size={16} /></div>
                  <span className="font-semibold text-slate-700 truncate">{agency.email || "Non renseigné"}</span>
                </div>
                {agency.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-white rounded-full text-blue-600 shadow-sm"><Globe size={16} /></div>
                    <span className="font-semibold text-slate-700">Site Web Officiel</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section Localisation */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
              <MapPin className="text-blue-600" /> Localisation
            </h3>
            <div className="bg-slate-100 rounded-3xl h-52 relative overflow-hidden w-full group border border-slate-200">
              <iframe
                width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent((agency.location || "Douala") + ', ' + (agency.city || "Cameroun"))}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="absolute inset-0 w-full h-full rounded-3xl grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
            <p className="mt-3 text-sm text-slate-500 flex items-start gap-2">
              <Info size={14} className="mt-0.5 flex-shrink-0" />
              <span>Adresse : <span className="font-bold text-slate-700">{agency.location || agency.city}</span></span>
            </p>
          </div>

          {/* Section Horaires */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="text-orange-500" /> Horaires
            </h3>
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
              <span className="text-slate-600 font-medium">Lundi - Samedi</span>
              <span className="font-bold text-slate-800">{agency.openingHours || "08h - 18h"}</span>
            </div>
            <div className={`mt-4 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-sm ${isOpenNow ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {isOpenNow ? <CheckCircle size={16} /> : <XCircle size={16} />}
              {isOpenNow ? "Ouvert actuellement" : "Fermé actuellement"}
            </div>
          </div>

        </div>

        {/* === COLONNE DROITE (Contenu Principal) === */}
        <div className="lg:col-span-8 space-y-8">

          {/* Image de Couverture */}
          <div className="relative w-full h-64 md:h-72 rounded-[2.5rem] overflow-hidden shadow-md group">
            {agency.coverImage ? (
              <Image src={agency.coverImage} alt="Cover" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-8 text-white">
              <h2 className="text-3xl font-black mb-2">{agency.name}</h2>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={i < Math.round(agency.rating || 5) ? "fill-current" : "text-white/30"} />
                  ))}
                </div>
                <span className="font-bold text-lg">{agency.rating || "N/A"}</span>
                <span className="text-sm opacity-80">({agency.reviewCount || 0} avis)</span>
              </div>
              <p className="font-medium text-white/90 flex items-center gap-2">
                <MapPin size={18} /> {agency.location || agency.city}
              </p>
            </div>
          </div>

          {/* Onglets */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px] flex flex-col">
            <div className="flex border-b border-slate-100 overflow-x-auto hide-scrollbar bg-white sticky top-0 z-10">
              {[
                { id: "vehicules", label: "🚗 Véhicules", count: cars.length },
                { id: "apropos", label: "À propos" },
                { id: "avis", label: "Avis Clients" }
              ].map((tab) => (
                <button
                  key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-5 px-6 text-sm font-bold capitalize transition-all relative whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === tab.id ? 'text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
                </button>
              ))}
            </div>

            <div className="p-6 bg-slate-50/30 h-full flex-1">
              {/* ONGLET VEHICULES */}
              {activeTab === "vehicules" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xl text-slate-800">
                      Véhicules disponibles chez {agency.name}
                    </h3>
                  </div>

                  {carsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                  ) : cars.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                      <Car size={48} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500 font-medium">Aucun véhicule disponible pour cette agence.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {cars.map((car) => (
                        <Link
                          key={car.id}
                          href={`/CarsPage/${car.id}`}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all group"
                        >
                          {/* Image du véhicule */}
                          <div className="relative h-40 bg-slate-100 overflow-hidden">
                            {car.image || (car.images && car.images[0]) ? (
                              <Image
                                src={car.image || car.images![0]}
                                alt={car.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                                <Car size={48} className="text-slate-300" />
                              </div>
                            )}
                            {/* Badge disponibilité */}
                            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${car.available ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                              }`}>
                              {car.available ? '✓ Disponible' : 'Indisponible'}
                            </div>
                          </div>

                          {/* Infos */}
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{car.name}</h4>
                                <p className="text-sm text-slate-500">{car.brand} • {car.type}</p>
                              </div>
                            </div>

                            {/* Caractéristiques */}
                            <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                              {car.transmission && (
                                <span className="flex items-center gap-1">
                                  <Gauge size={12} /> {car.transmission}
                                </span>
                              )}
                              {car.fuelType && (
                                <span className="flex items-center gap-1">
                                  <Fuel size={12} /> {car.fuelType}
                                </span>
                              )}
                              {car.seats && (
                                <span className="flex items-center gap-1">
                                  <Users size={12} /> {car.seats} places
                                </span>
                              )}
                            </div>

                            {/* Prix */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                              <div>
                                <p className="text-2xl font-black text-blue-600">{formatPrice(car.pricePerDay)}</p>
                                <p className="text-xs text-slate-400">CFA / jour</p>
                              </div>
                              <div className="flex items-center gap-1 text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                Voir <ArrowRight size={16} />
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ONGLET A PROPOS */}
              {activeTab === "apropos" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-xl text-slate-800 mb-3">Description</h3>
                    <p className="text-slate-600 leading-relaxed">{agency.description || "Aucune description fournie."}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                    <h4 className="font-bold text-blue-800 mb-2">Pourquoi nous choisir ?</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-slate-700 text-sm"><CheckCircle size={16} className="text-blue-500" /> Véhicules inspectés régulièrement</li>
                      <li className="flex items-center gap-2 text-slate-700 text-sm"><CheckCircle size={16} className="text-blue-500" /> Assistance 24/7 incluse</li>
                      <li className="flex items-center gap-2 text-slate-700 text-sm"><CheckCircle size={16} className="text-blue-500" /> Annulation flexible</li>
                      <li className="flex items-center gap-2 text-slate-700 text-sm"><CheckCircle size={16} className="text-blue-500" /> Prix transparents, sans frais cachés</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ONGLET AVIS */}
              {activeTab === "avis" && (
                <div className="space-y-4">
                  {agency.reviews && agency.reviews.length > 0 ? agency.reviews.map((review: any) => (
                    <div key={review.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden relative flex-shrink-0 border border-slate-200">
                        <Image src={review.avatar || "/assets/default-avatar.jpeg"} alt={review.user} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-slate-800 text-sm">{review.user}</span>
                          <span className="text-xs text-slate-400">{review.date}</span>
                        </div>
                        <div className="flex text-orange-400 mb-2">
                          {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < review.rating ? "fill-current" : "text-gray-200"} />)}
                        </div>
                        <p className="text-slate-600 text-sm italic leading-relaxed">"{review.comment}"</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                      <Star size={48} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-400 text-sm">Aucun avis pour le moment.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}