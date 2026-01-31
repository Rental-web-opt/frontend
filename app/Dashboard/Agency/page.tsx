"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { bookingService, carService } from "@/services/api"; // Assurez-vous que carService est bien exporté dans api.ts
import { Building2, Plus, LogOut, Car, CalendarCheck, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function AgencyDashboard() {
  const { user, logout } = useAuth();

  // --- ÉTATS (DATA) ---
  const [activeTab, setActiveTab] = useState<'bookings' | 'cars'>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Récupérer les réservations (Toutes pour l'instant)
        const bookingsRes = await bookingService.getAll();
        // Tri : les plus récentes en haut
        const sortedBookings = bookingsRes.data.sort((a: any, b: any) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setBookings(sortedBookings);

        // 2. Récupérer les voitures
        const carsRes = await carService.getAll();
        setCars(carsRes.data);

      } catch (error) {
        console.error("Erreur chargement dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  // --- ACTION : CHANGER LE STATUT ---
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      // 1. Mise à jour visuelle immédiate (Optimistic UI)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));

      // 2. Appel au Backend
      await bookingService.updateStatus(id, newStatus);

    } catch (error) {
      console.error("Erreur mise à jour statut", error);
      alert("Erreur lors de la mise à jour.");
      // En cas d'erreur, on pourrait recharger les données ici
    }
  };

  // Calcul du nombre de demandes en attente
  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* --- EN-TÊTE --- */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <Building2 className="text-orange-500" size={32} />
              Espace Agence
            </h1>
            <p className="text-slate-500 mt-1">
              Bienvenue, <span className="font-bold text-slate-800">{user?.fullName || "Partenaire"}</span>.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="hidden md:flex bg-blue-50 text-blue-800 px-4 py-3 rounded-xl text-sm font-bold items-center gap-2">
              <Car size={18} /> {cars.length} Véhicules
            </div>
            <button
              onClick={logout}
              className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition flex items-center gap-2"
            >
              <LogOut size={20} /> Déconnexion
            </button>
          </div>
        </div>

        {/* --- ONGLETS DE NAVIGATION --- */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-2 ${activeTab === 'bookings' ? 'bg-slate-900 text-white shadow-lg transform scale-105' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
          >
            <CalendarCheck size={18} /> Réservations
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('cars')}
            className={`px-6 py-3 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-2 ${activeTab === 'cars' ? 'bg-slate-900 text-white shadow-lg transform scale-105' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
          >
            <Car size={18} /> Ma Flotte
          </button>
        </div>

        {/* --- CONTENU PRINCIPAL --- */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : activeTab === 'bookings' ? (

          // --- VUE LISTE DES RÉSERVATIONS ---
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 text-slate-400">
                Aucune demande de réservation pour le moment.
              </div>
            ) : (
              bookings.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6 hover:shadow-md transition duration-300">

                  {/* Info Gauche */}
                  <div className="flex items-center gap-5 w-full lg:w-auto">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden relative flex-shrink-0 border border-slate-200">
                      <Image
                        src={item.car?.image || "/assets/car1.jpeg"}
                        fill
                        className="object-cover"
                        alt={item.car?.name || "Véhicule"} // <--- Assurez-vous que cette ligne est là
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-lg">{item.car?.name || "Véhicule Supprimé"}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.rentalType === 'MONTHLY' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                          {item.rentalType === 'MONTHLY' ? 'Abonnement' : 'Court'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        Client ID: <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">#{item.userId}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Du {new Date(item.startDate).toLocaleDateString()} au {new Date(item.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="text-center lg:text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total</p>
                    <p className="font-black text-2xl text-slate-900">{item.totalPrice?.toLocaleString()} <span className="text-sm text-slate-400 font-normal">CFA</span></p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
                    {item.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(item.id, 'CONFIRMED')}
                          className="flex-1 lg:flex-none bg-green-500 text-white hover:bg-green-600 px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-green-200"
                        >
                          <CheckCircle size={18} /> Accepter
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, 'CANCELLED')}
                          className="flex-1 lg:flex-none bg-white border-2 border-slate-100 text-slate-400 hover:border-red-100 hover:text-red-500 px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition"
                        >
                          <XCircle size={18} /> Refuser
                        </button>
                      </>
                    ) : (
                      <div className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 
                                        ${item.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border border-green-100' : ''}
                                        ${item.status === 'CANCELLED' ? 'bg-slate-50 text-slate-400 border border-slate-100' : ''}
                                    `}>
                        {item.status === 'CONFIRMED' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                        {item.status === 'CONFIRMED' ? 'Confirmé' : 'Refusé'}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        ) : (

          // --- VUE GRILLE VÉHICULES ---
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {/* Carte "Ajouter" */}
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition min-h-[300px] group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition">
                <Plus size={32} />
              </div>
              <h3 className="font-bold text-slate-600 group-hover:text-blue-700">Ajouter un véhicule</h3>
            </div>

            {/* Liste des voitures */}
            {cars.map(car => (
              <div key={car.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 group hover:shadow-lg transition">
                <div className="relative h-48 bg-slate-50 rounded-2xl overflow-hidden mb-4">
                  <Image src={car.image || "/assets/car1.jpeg"} fill className="object-cover group-hover:scale-105 transition duration-500" alt={car.name} />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                    {car.pricePerDay?.toLocaleString()} CFA/j
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{car.name}</h3>
                <p className="text-xs text-slate-500 mb-4 uppercase font-bold tracking-wide">{car.brand} • {car.type}</p>

                <div className="flex gap-2">
                  <button className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition">Modifier</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}