"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { bookingService, carService, agencyService } from "@/services/api";
import {
  Building2, Plus, LogOut, Car, CalendarCheck, CheckCircle, XCircle, Loader2,
  TrendingUp, Eye, DollarSign, Bell, Search, Trash2, Edit2,
  BarChart3, Clock, MapPin, Star, AlertCircle, ChevronRight,
  Home
} from "lucide-react";

// Couleurs de la charte graphique
const COLORS = {
  primary: "#002AD7",
  primaryHover: "#0022B0",
  accent: "#F76513",
  accentHover: "#E05A10",
};

// Types
interface CarType {
  id: number;
  name: string;
  brand: string;
  type: string;
  pricePerDay: number;
  image?: string;
  available: boolean;
  transmission?: string;
  fuelType?: string;
  seats?: number;
}

interface BookingType {
  id: number;
  car: CarType;
  userId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  rentalType: string;
  withDriver: boolean;
  createdAt: string;
}

interface NotificationType {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function AgencyDashboard() {
  const { user, logout } = useAuth();

  // États
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'cars' | 'stats'>('dashboard');
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [cars, setCars] = useState<CarType[]>([]);
  const [agency, setAgency] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Modal ajout/édition véhicule
  const [showCarModal, setShowCarModal] = useState(false);
  const [editingCar, setEditingCar] = useState<CarType | null>(null);
  const [carForm, setCarForm] = useState({
    name: "", brand: "", type: "Berline", pricePerDay: 0,
    transmission: "Automatique", fuelType: "Essence", seats: 5
  });

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const agenciesRes = await agencyService.getAll();
        const userAgency = agenciesRes.data.find(
          (a: any) => a.email === user?.email || a.name.includes(user?.fullName?.split(" ")[0] || "")
        );
        setAgency(userAgency || agenciesRes.data[0]);

        const bookingsRes = await bookingService.getAll();
        const carsRes = await carService.getAll();
        const agencyCars = carsRes.data.filter((c: any) =>
          c.agency?.id === userAgency?.id || c.agency?.name === userAgency?.name
        );
        setCars(agencyCars);

        const agencyCarIds = agencyCars.map((c: any) => c.id);
        const agencyBookings = bookingsRes.data.filter((b: any) =>
          agencyCarIds.includes(b.car?.id || b.carId)
        );
        setBookings(agencyBookings.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));

        setNotifications([
          { id: 1, type: "booking", message: "Nouvelle réservation pour Mercedes GLE 450", timestamp: "Il y a 5 min", read: false },
          { id: 2, type: "view", message: "Votre agence a été vue 15 fois aujourd'hui", timestamp: "Il y a 1h", read: false },
          { id: 3, type: "review", message: "Nouvel avis 5 étoiles reçu!", timestamp: "Il y a 2h", read: true },
        ]);

      } catch (error) {
        console.error("Erreur chargement dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  // Actions
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      await bookingService.updateStatus(id, newStatus);
    } catch (error) {
      console.error("Erreur mise à jour statut", error);
      alert("Erreur lors de la mise à jour.");
    }
  };

  const handleDeleteCar = async (carId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce véhicule?")) return;
    try {
      setCars(prev => prev.filter(c => c.id !== carId));
    } catch (error) {
      console.error("Erreur suppression", error);
    }
  };

  const handleSaveCar = async () => {
    try {
      if (editingCar) {
        setCars(prev => prev.map(c => c.id === editingCar.id ? { ...c, ...carForm } : c));
      } else {
        const newCar: CarType = {
          id: Date.now(),
          ...carForm,
          available: true,
          image: "/assets/car1.jpeg"
        };
        setCars(prev => [...prev, newCar]);
      }
      setShowCarModal(false);
      resetCarForm();
    } catch (error) {
      console.error("Erreur sauvegarde", error);
    }
  };

  const resetCarForm = () => {
    setCarForm({ name: "", brand: "", type: "Berline", pricePerDay: 0, transmission: "Automatique", fuelType: "Essence", seats: 5 });
    setEditingCar(null);
  };

  const openEditModal = (car: CarType) => {
    setEditingCar(car);
    setCarForm({
      name: car.name,
      brand: car.brand,
      type: car.type,
      pricePerDay: car.pricePerDay,
      transmission: car.transmission || "Automatique",
      fuelType: car.fuelType || "Essence",
      seats: car.seats || 5
    });
    setShowCarModal(true);
  };

  // Calculs statistiques
  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Recherche et filtrage
  const filteredCars = cars.filter(car => {
    const matchSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = !filterType || car.type === filterType;
    return matchSearch && matchType;
  });

  const carTypes = [...new Set(cars.map(c => c.type))];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin" size={48} style={{ color: COLORS.primary }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Header - Style cohérent avec le site */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Logo comme sur le site */}
            <Link href="/" className="flex items-center gap-2 mr-6">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: COLORS.primary }}>
                <Car size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold">
                <span style={{ color: COLORS.primary }}>EASY</span>
                <span style={{ color: COLORS.accent }}>-RENT</span>
              </span>
            </Link>

            <div className="h-8 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: COLORS.primary }}>
                {agency?.name?.charAt(0) || "A"}
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">{agency?.name || "Mon Agence"}</h1>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin size={10} /> {agency?.city || "Cameroun"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition"
              >
                <Bell size={20} className="text-slate-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Notifications</h3>
                    <button className="text-xs font-semibold" style={{ color: COLORS.primary }}>Tout marquer lu</button>
                  </div>
                  <div className="max-h-80 overflow-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                        <p className="text-sm text-slate-700">{notif.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{notif.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/" className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
              <Home size={20} className="text-slate-600" />
            </Link>

            <button
              onClick={logout}
              className="text-white px-4 py-2.5 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2 text-sm"
              style={{ backgroundColor: COLORS.accent }}
            >
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Navigation Tabs - Style cohérent */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'Tableau de bord' },
            { id: 'bookings', icon: CalendarCheck, label: 'Réservations', badge: pendingCount },
            { id: 'cars', icon: Car, label: 'Mes Véhicules', badge: cars.length },
            { id: 'stats', icon: TrendingUp, label: 'Statistiques' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-xl font-semibold transition whitespace-nowrap flex items-center gap-2 text-sm ${activeTab === tab.id
                  ? 'text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              style={activeTab === tab.id ? { backgroundColor: COLORS.primary } : {}}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* CONTENU */}

        {/* ===== DASHBOARD ===== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${COLORS.primary}15` }}>
                    <Car style={{ color: COLORS.primary }} size={22} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{cars.length}</p>
                    <p className="text-sm text-slate-500">Véhicules</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-50">
                    <CalendarCheck className="text-green-600" size={22} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{confirmedCount}</p>
                    <p className="text-sm text-slate-500">Réservations actives</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${COLORS.accent}15` }}>
                    <DollarSign style={{ color: COLORS.accent }} size={22} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-slate-500">CFA Revenus</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-50">
                    <Eye className="text-purple-600" size={22} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{agency?.reviewCount || 0}</p>
                    <p className="text-sm text-slate-500">Vues ce mois</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Demandes en attente */}
            {pendingCount > 0 && (
              <div className="rounded-2xl p-5 text-white" style={{ backgroundColor: COLORS.accent }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{pendingCount} demande{pendingCount > 1 ? 's' : ''} en attente</h3>
                      <p className="text-white/80 text-sm">Répondez rapidement pour satisfaire vos clients</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="bg-white px-5 py-2.5 rounded-xl font-semibold hover:bg-white/90 transition flex items-center gap-2 text-sm"
                    style={{ color: COLORS.accent }}
                  >
                    Voir <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Dernières réservations */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-slate-900">Dernières réservations</h2>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  style={{ color: COLORS.primary }}
                >
                  Voir tout <ChevronRight size={16} />
                </button>
              </div>

              {bookings.slice(0, 3).map(booking => (
                <div key={booking.id} className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0">
                  <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden relative">
                    <Image src={booking.car?.image || "/assets/car1.jpeg"} fill className="object-cover" alt="" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{booking.car?.name}</h4>
                    <p className="text-sm text-slate-500">Client #{booking.userId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{booking.totalPrice?.toLocaleString()} CFA</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${booking.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' :
                          'bg-slate-100 text-slate-500'
                      }`}>
                      {booking.status === 'PENDING' ? 'En attente' :
                        booking.status === 'CONFIRMED' ? 'Confirmé' : booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== RÉSERVATIONS ===== */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                <CalendarCheck size={40} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-400">Aucune réservation</h3>
                <p className="text-slate-400 mt-1 text-sm">Les réservations apparaîtront ici.</p>
              </div>
            ) : (
              bookings.map(booking => (
                <div key={booking.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-5 hover:shadow-md transition">
                  <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden relative">
                      <Image src={booking.car?.image || "/assets/car1.jpeg"} fill className="object-cover" alt="" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{booking.car?.name || "Véhicule"}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${booking.rentalType === 'MONTHLY' ? 'bg-purple-100 text-purple-600' : 'text-white'
                          }`} style={booking.rentalType !== 'MONTHLY' ? { backgroundColor: COLORS.primary } : {}}>
                          {booking.rentalType === 'MONTHLY' ? 'Mensuel' : 'Journalier'}
                        </span>
                        {booking.withDriver && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: COLORS.accent }}>
                            + Chauffeur
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">Client #{booking.userId}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-center lg:text-right">
                    <p className="font-bold text-xl text-slate-900">{booking.totalPrice?.toLocaleString()} <span className="text-sm font-normal text-slate-400">CFA</span></p>
                  </div>

                  <div className="flex items-center gap-2">
                    {booking.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                          className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition"
                        >
                          <CheckCircle size={16} /> Accepter
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                          className="bg-white border border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-500 px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition"
                        >
                          <XCircle size={16} /> Refuser
                        </button>
                      </>
                    ) : (
                      <div className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-700' :
                          booking.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700' :
                            'bg-slate-50 text-slate-400'
                        }`}>
                        {booking.status === 'CONFIRMED' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                        {booking.status === 'CONFIRMED' ? 'Confirmé' :
                          booking.status === 'COMPLETED' ? 'Terminé' : 'Annulé'}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ===== MES VÉHICULES ===== */}
        {activeTab === 'cars' && (
          <div className="space-y-5">
            {/* Barre de recherche */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher un véhicule..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:border-transparent text-sm"
                  style={{ '--tw-ring-color': COLORS.primary } as any}
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm"
              >
                <option value="">Tous les types</option>
                {carTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <button
                onClick={() => { resetCarForm(); setShowCarModal(true); }}
                className="text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2 text-sm"
                style={{ backgroundColor: COLORS.primary }}
              >
                <Plus size={18} /> Ajouter
              </button>
            </div>

            {/* Grille véhicules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredCars.map(car => (
                <div key={car.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-lg transition">
                  <div className="relative h-40 bg-slate-100 overflow-hidden">
                    <Image src={car.image || "/assets/car1.jpeg"} fill className="object-cover group-hover:scale-105 transition duration-300" alt={car.name} />
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold ${car.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                      {car.available ? '✓ Disponible' : 'Indisponible'}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded-lg font-bold text-sm text-slate-900 shadow">
                      {car.pricePerDay?.toLocaleString()} CFA/j
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-1">{car.name}</h3>
                    <p className="text-xs text-slate-500 mb-3">{car.brand} • {car.type}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(car)}
                        className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-xl font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-1.5 text-sm"
                        style={{ '--tw-text-opacity': 1 } as any}
                      >
                        <Edit2 size={14} /> Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car.id)}
                        className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== STATISTIQUES ===== */}
        {activeTab === 'stats' && (
          <div className="space-y-5">
            {/* Info Agence */}
            <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: COLORS.primary }}>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold">
                  {agency?.name?.charAt(0) || "A"}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{agency?.name}</h2>
                  <p className="text-white/80 flex items-center gap-2 text-sm">
                    <MapPin size={14} /> {agency?.location || agency?.city}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-xl font-bold">
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    {agency?.rating || "N/A"}
                  </div>
                  <p className="text-white/80 text-sm">{agency?.reviewCount || 0} avis</p>
                </div>
              </div>
            </div>

            {/* Stats détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Performance ce mois</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Réservations</span>
                    <span className="font-bold text-slate-900">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Taux d'acceptation</span>
                    <span className="font-bold text-green-600">
                      {bookings.length > 0 ? Math.round((confirmedCount / bookings.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Revenus</span>
                    <span className="font-bold text-slate-900">{totalRevenue.toLocaleString()} CFA</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Véhicules populaires</h3>
                {cars.slice(0, 3).map((car, i) => (
                  <div key={car.id} className="flex items-center gap-3 py-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' :
                        i === 1 ? 'bg-slate-100 text-slate-600' :
                          'bg-orange-100 text-orange-700'
                      }`}>
                      {i + 1}
                    </span>
                    <span className="text-slate-700 flex-1 text-sm">{car.name}</span>
                    <span className="text-xs text-slate-400">{car.pricePerDay?.toLocaleString()} CFA</span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Visibilité</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Vues du profil</span>
                    <span className="font-bold text-slate-900">{(agency?.reviewCount || 0) * 10}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Clics véhicules</span>
                    <span className="font-bold text-slate-900">{(agency?.reviewCount || 0) * 5}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Conversion</span>
                    <span className="font-bold" style={{ color: COLORS.primary }}>8.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Véhicule */}
      {showCarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCar ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
              </h2>
              <button onClick={() => { setShowCarModal(false); resetCarForm(); }} className="text-slate-400 hover:text-slate-600">
                <XCircle size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nom du véhicule</label>
                <input
                  type="text"
                  value={carForm.name}
                  onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                  placeholder="Ex: Mercedes GLE 450"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Marque</label>
                  <input
                    type="text"
                    value={carForm.brand}
                    onChange={(e) => setCarForm({ ...carForm, brand: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={carForm.type}
                    onChange={(e) => setCarForm({ ...carForm, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm"
                  >
                    <option>Berline</option>
                    <option>SUV</option>
                    <option>Sport</option>
                    <option>Luxe</option>
                    <option>Économique</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Prix/jour (CFA)</label>
                <input
                  type="number"
                  value={carForm.pricePerDay}
                  onChange={(e) => setCarForm({ ...carForm, pricePerDay: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowCarModal(false); resetCarForm(); }}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveCar}
                className="flex-1 py-2.5 text-white rounded-xl font-semibold hover:opacity-90 transition text-sm"
                style={{ backgroundColor: COLORS.primary }}
              >
                {editingCar ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}