"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { bookingService, carService, agencyService } from "@/services/api";
import { Building2, Plus, LogOut, Car, CalendarCheck, CheckCircle, XCircle, Loader2, TrendingUp, DollarSign, BarChart3, X, Trash2, Edit2, Save } from "lucide-react";

// Type pour le formulaire véhicule
interface CarForm {
  name: string;
  brand: string;
  model: string;
  type: string;
  pricePerDay: number;
  pricePerHour: number;
  monthlyPrice: number;
  location: string;
  description: string;
  image: string;
  transmission: string;
  fuelType: string;
  seats: number;
  maxSpeed: number;
  isAvailable: boolean;
}

const emptyCarForm: CarForm = {
  name: "", brand: "", model: "", type: "SUV", pricePerDay: 0, pricePerHour: 0,
  monthlyPrice: 0, location: "", description: "", image: "", transmission: "Automatique",
  fuelType: "Essence", seats: 5, maxSpeed: 180, isAvailable: true,
};

export default function AgencyDashboard() {
  const { user, logout } = useAuth();

  // --- ÉTATS (DATA) ---
  const [activeTab, setActiveTab] = useState<'bookings' | 'cars'>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState<{ revenue: number; totalBookings: number; completedBookings: number }>({ revenue: 0, totalBookings: 0, completedBookings: 0 });
  const [agencyId, setAgencyId] = useState<number | null>(null);

  // --- ÉTATS MODAL VÉHICULE ---
  const [showCarModal, setShowCarModal] = useState(false);
  const [editingCar, setEditingCar] = useState<any>(null);
  const [carForm, setCarForm] = useState<CarForm>(emptyCarForm);
  const [savingCar, setSavingCar] = useState(false);
  const [carMessage, setCarMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const agencyRes = await agencyService.getByUserId(user.id);
        const agency = agencyRes.data;

        if (agency && agency.id) {
          console.log("Agence trouvée:", agency.name);
          setAgencyId(agency.id);

          const bookingsRes = await bookingService.getByAgency(agency.id);
          const sortedBookings = bookingsRes.data.sort((a: any, b: any) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
          setBookings(sortedBookings);

          const carsRes = await carService.getByAgency(agency.id);
          setCars(carsRes.data);

          try {
            const revenueRes = await agencyService.getRevenue(agency.id);
            setRevenue(revenueRes.data);
          } catch (e) {
            console.warn("Revenus non disponibles", e);
          }
        } else {
          console.warn("Aucune agence associée à cet utilisateur.");
          setBookings([]);
          setCars([]);
        }

      } catch (error) {
        console.error("Erreur chargement dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // --- ACTION : CHANGER LE STATUT ---
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      await bookingService.updateStatus(id, newStatus);
    } catch (error) {
      console.error("Erreur mise à jour statut", error);
      alert("Erreur lors de la mise à jour.");
    }
  };

  // --- OUVRIR MODAL AJOUT ---
  const openAddModal = () => {
    setEditingCar(null);
    setCarForm(emptyCarForm);
    setCarMessage(null);
    setShowCarModal(true);
  };

  // --- OUVRIR MODAL EDIT ---
  const openEditModal = (car: any) => {
    setEditingCar(car);
    setCarForm({
      name: car.name || "",
      brand: car.brand || "",
      model: car.model || "",
      type: car.type || "SUV",
      pricePerDay: car.pricePerDay || 0,
      pricePerHour: car.pricePerHour || 0,
      monthlyPrice: car.monthlyPrice || 0,
      location: car.location || "",
      description: car.description || "",
      image: car.image || "",
      transmission: car.transmission || "Automatique",
      fuelType: car.fuelType || "Essence",
      seats: car.seats || 5,
      maxSpeed: car.maxSpeed || 180,
      isAvailable: car.isAvailable ?? car.available ?? true,
    });
    setCarMessage(null);
    setShowCarModal(true);
  };

  // --- SAUVEGARDER VÉHICULE ---
  const handleSaveCar = async () => {
    if (!carForm.name.trim() || !carForm.brand.trim()) {
      setCarMessage({ type: "error", text: "Le nom et la marque sont obligatoires" });
      return;
    }
    if (carForm.pricePerDay <= 0) {
      setCarMessage({ type: "error", text: "Le prix par jour doit être supérieur à 0" });
      return;
    }

    setSavingCar(true);
    setCarMessage(null);

    try {
      if (editingCar) {
        // --- MODIFICATION ---
        const res = await carService.update(editingCar.id, { ...carForm, available: carForm.isAvailable });
        setCars(prev => prev.map(c => c.id === editingCar.id ? res.data : c));
        setCarMessage({ type: "success", text: "Véhicule modifié avec succès !" });
      } else {
        // --- CRÉATION ---
        const payload = {
          ...carForm,
          available: carForm.isAvailable,
          agency: { id: agencyId },
        };
        const res = await carService.create(payload);
        setCars(prev => [...prev, res.data]);
        setCarMessage({ type: "success", text: "Véhicule ajouté avec succès !" });
      }
      setTimeout(() => setShowCarModal(false), 1000);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erreur lors de la sauvegarde du véhicule";
      setCarMessage({ type: "error", text: msg });
    } finally {
      setSavingCar(false);
    }
  };

  // --- SUPPRIMER VÉHICULE ---
  const handleDeleteCar = async (carId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) return;
    setDeletingId(carId);
    try {
      await carService.delete(carId);
      setCars(prev => prev.filter(c => c.id !== carId));
    } catch (err) {
      console.error("Erreur suppression véhicule", err);
      alert("Erreur lors de la suppression.");
    } finally {
      setDeletingId(null);
    }
  };

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

          <div className="flex flex-wrap gap-3">
            <div className="flex bg-green-50 text-green-800 px-4 py-3 rounded-xl text-sm font-bold items-center gap-2">
              <DollarSign size={18} /> {revenue.revenue.toLocaleString()} CFA
            </div>
            <div className="hidden md:flex bg-blue-50 text-blue-800 px-4 py-3 rounded-xl text-sm font-bold items-center gap-2">
              <Car size={18} /> {cars.length} Véhicules
            </div>
            <div className="hidden md:flex bg-purple-50 text-purple-800 px-4 py-3 rounded-xl text-sm font-bold items-center gap-2">
              <BarChart3 size={18} /> {revenue.completedBookings}/{revenue.totalBookings} Réservations
            </div>
            <button
              onClick={logout}
              className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition flex items-center gap-2"
            >
              <LogOut size={20} /> Déconnexion
            </button>
          </div>
        </div>

        {/* --- ONGLETS --- */}
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

        {/* --- CONTENU --- */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : activeTab === 'bookings' ? (

          // --- RÉSERVATIONS ---
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 text-slate-400">
                Aucune demande de réservation pour le moment.
              </div>
            ) : (
              bookings.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6 hover:shadow-md transition duration-300">
                  <div className="flex items-center gap-5 w-full lg:w-auto">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden relative flex-shrink-0 border border-slate-200">
                      <Image src={item.car?.image || "/assets/car1.jpeg"} fill className="object-cover" alt={item.car?.name || "Véhicule"} />
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
                  <div className="text-center lg:text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total</p>
                    <p className="font-black text-2xl text-slate-900">{item.totalPrice?.toLocaleString()} <span className="text-sm text-slate-400 font-normal">CFA</span></p>
                  </div>
                  <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
                    {item.status === 'PENDING' ? (
                      <>
                        <button onClick={() => handleStatusChange(item.id, 'CONFIRMED')} className="flex-1 lg:flex-none bg-green-500 text-white hover:bg-green-600 px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-green-200">
                          <CheckCircle size={18} /> Accepter
                        </button>
                        <button onClick={() => handleStatusChange(item.id, 'CANCELLED')} className="flex-1 lg:flex-none bg-white border-2 border-slate-100 text-slate-400 hover:border-red-100 hover:text-red-500 px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition">
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

          // --- GRILLE VÉHICULES ---
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Carte Ajouter */}
            <div onClick={openAddModal} className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition min-h-[300px] group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition">
                <Plus size={32} />
              </div>
              <h3 className="font-bold text-slate-600 group-hover:text-blue-700">Ajouter un véhicule</h3>
            </div>

            {/* Véhicules existants */}
            {cars.map(car => (
              <div key={car.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 group hover:shadow-lg transition">
                <div className="relative h-48 bg-slate-50 rounded-2xl overflow-hidden mb-4">
                  <Image src={car.image || "/assets/car1.jpeg"} fill className="object-cover group-hover:scale-105 transition duration-500" alt={car.name} />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                    {car.pricePerDay?.toLocaleString()} CFA/j
                  </div>
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-bold ${(car.isAvailable || car.available) ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {(car.isAvailable || car.available) ? 'Disponible' : 'Indisponible'}
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{car.name}</h3>
                <p className="text-xs text-slate-500 mb-4 uppercase font-bold tracking-wide">{car.brand} • {car.type}</p>

                <div className="flex gap-2">
                  <button onClick={() => openEditModal(car)} className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition flex items-center justify-center gap-1">
                    <Edit2 size={14} /> Modifier
                  </button>
                  <button onClick={() => handleDeleteCar(car.id)} disabled={deletingId === car.id} className="bg-red-50 text-red-500 py-2.5 px-4 rounded-xl text-sm font-bold hover:bg-red-100 transition disabled:opacity-50 flex items-center justify-center">
                    {deletingId === car.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========== MODAL AJOUT/MODIFICATION VÉHICULE ========== */}
        {showCarModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-slate-100 p-6 rounded-t-3xl flex justify-between items-center z-10">
                <h2 className="text-xl font-black text-slate-900">
                  {editingCar ? "✏️ Modifier le véhicule" : "🚗 Ajouter un véhicule"}
                </h2>
                <button onClick={() => setShowCarModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              {/* Formulaire */}
              <div className="p-6 space-y-5">
                {carMessage && (
                  <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${carMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {carMessage.type === 'success' ? '✅' : '❌'} {carMessage.text}
                  </div>
                )}

                {/* Nom + Marque */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 text-sm">Nom du véhicule *</label>
                    <input type="text" value={carForm.name} onChange={e => setCarForm({ ...carForm, name: e.target.value })}
                      placeholder="Ex: Toyota Corolla 2024" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 text-sm">Marque *</label>
                    <input type="text" value={carForm.brand} onChange={e => setCarForm({ ...carForm, brand: e.target.value })}
                      placeholder="Ex: Toyota" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>

                {/* Modèle + Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 text-sm">Modèle</label>
                    <input type="text" value={carForm.model} onChange={e => setCarForm({ ...carForm, model: e.target.value })}
                      placeholder="Ex: Corolla" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 text-sm">Type</label>
                    <select value={carForm.type} onChange={e => setCarForm({ ...carForm, type: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                      <option>SUV</option><option>Berline</option><option>Citadine</option><option>Pick-up</option><option>Sportive</option><option>Utilitaire</option><option>Minivan</option>
                    </select>
                  </div>
                </div>

                {/* Prix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 text-sm">Prix/jour (CFA) *</label>
                    <input type="number" value={carForm.pricePerDay} onChange={e => setCarForm({ ...carForm, pricePerDay: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 text-sm">Prix/heure (CFA)</label>
                    <input type="number" value={carForm.pricePerHour} onChange={e => setCarForm({ ...carForm, pricePerHour: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 text-sm">Prix/mois (CFA)</label>
                    <input type="number" value={carForm.monthlyPrice} onChange={e => setCarForm({ ...carForm, monthlyPrice: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 text-sm">Transmission</label>
                    <select value={carForm.transmission} onChange={e => setCarForm({ ...carForm, transmission: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                      <option>Automatique</option><option>Manuelle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 text-sm">Carburant</label>
                    <select value={carForm.fuelType} onChange={e => setCarForm({ ...carForm, fuelType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                      <option>Essence</option><option>Diesel</option><option>Hybride</option><option>Electrique</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 text-sm">Places</label>
                    <input type="number" value={carForm.seats} onChange={e => setCarForm({ ...carForm, seats: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 text-sm">Vitesse max</label>
                    <input type="number" value={carForm.maxSpeed} onChange={e => setCarForm({ ...carForm, maxSpeed: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>

                {/* Localisation + Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 text-sm">Localisation</label>
                    <input type="text" value={carForm.location} onChange={e => setCarForm({ ...carForm, location: e.target.value })}
                      placeholder="Ex: Yaoundé, Bastos" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1.5 text-sm">URL de l&apos;image</label>
                    <input type="text" value={carForm.image} onChange={e => setCarForm({ ...carForm, image: e.target.value })}
                      placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1.5 text-sm">Description</label>
                  <textarea value={carForm.description} onChange={e => setCarForm({ ...carForm, description: e.target.value })}
                    rows={3} placeholder="Décrivez le véhicule..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
                </div>

                {/* Disponibilité */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">Véhicule disponible à la location</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={carForm.isAvailable} onChange={e => setCarForm({ ...carForm, isAvailable: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 rounded-b-3xl flex justify-end gap-3">
                <button onClick={() => setShowCarModal(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition text-sm">
                  Annuler
                </button>
                <button
                  onClick={handleSaveCar}
                  disabled={savingCar}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 text-sm shadow-lg"
                >
                  {savingCar ? (
                    <><Loader2 size={16} className="animate-spin" /> Sauvegarde...</>
                  ) : (
                    <><Save size={16} /> {editingCar ? "Modifier" : "Ajouter"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}