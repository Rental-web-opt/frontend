"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { bookingService, driverService } from "@/services/api";
import {
  UserCheck, MapPin, LogOut, Car, Calendar, Clock, Star,
  CheckCircle, XCircle, Loader2, Navigation,
  DollarSign, BarChart3, Home, Bell, Power, ChevronRight, AlertCircle
} from "lucide-react";

// Couleurs de la charte graphique
const COLORS = {
  primary: "#002AD7",
  primaryHover: "#0022B0",
  accent: "#F76513",
  accentHover: "#E05A10",
};

interface CourseType {
  id: number;
  car: any;
  userId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  pickup?: string;
  dropoff?: string;
}

export default function DriverDashboard() {
  const { user, logout } = useAuth();

  // États
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'history'>('dashboard');
  const [driver, setDriver] = useState<any>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const driversRes = await driverService.getAll();
        const currentDriver = driversRes.data.find(
          (d: any) => d.email === user?.email || d.fullName === user?.fullName
        ) || driversRes.data[0];
        setDriver(currentDriver);
        setIsAvailable(currentDriver?.available !== false);

        const bookingsRes = await bookingService.getAll();
        const driverCourses = bookingsRes.data.filter((b: any) => b.withDriver);
        setCourses(driverCourses.sort((a: any, b: any) =>
          new Date(b.createdAt || b.startDate).getTime() - new Date(a.createdAt || a.startDate).getTime()
        ));

        setNotifications([
          { id: 1, message: "Nouvelle demande de course", time: "Il y a 10 min", read: false },
          { id: 2, message: "Course #45 confirmée", time: "Il y a 1h", read: true },
        ]);

      } catch (error) {
        console.error("Erreur chargement données", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  // Toggle disponibilité
  const toggleAvailability = async () => {
    try {
      setIsAvailable(!isAvailable);
      if (driver?.id) {
        await driverService.update(driver.id, { available: !isAvailable });
      }
    } catch (error) {
      console.error("Erreur mise à jour disponibilité", error);
      setIsAvailable(isAvailable);
    }
  };

  // Statistiques
  const pendingCourses = courses.filter(c => c.status === 'PENDING' || c.status === 'CONFIRMED');
  const completedCourses = courses.filter(c => c.status === 'COMPLETED');
  const totalEarnings = completedCourses.reduce((sum, c) => sum + ((c.totalPrice || 0) * 0.3), 0);
  const unreadCount = notifications.filter(n => !n.read).length;

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
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Logo */}
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
              <div className="w-12 h-12 rounded-full overflow-hidden relative border-2" style={{ borderColor: `${COLORS.primary}30` }}>
                {driver?.image ? (
                  <Image src={driver.image} fill className="object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: COLORS.primary }}>
                    {driver?.fullName?.charAt(0) || user?.fullName?.charAt(0) || "C"}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">{driver?.fullName || user?.fullName}</h1>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {isAvailable ? 'Disponible' : 'Indisponible'}
                  </span>
                  {driver?.rating && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" /> {driver.rating}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Disponibilité */}
            <button
              onClick={toggleAvailability}
              className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition border ${isAvailable
                  ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                  : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                }`}
            >
              <Power size={16} />
              {isAvailable ? 'En service' : 'Hors service'}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition"
              >
                <Bell size={20} className="text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.accent }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-14 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Notifications</h3>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className={`p-4 border-b border-slate-50 ${!n.read ? 'bg-blue-50/30' : ''}`}>
                      <p className="text-sm text-slate-700">{n.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="/" className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
              <Home size={20} className="text-slate-600" />
            </Link>

            <button
              onClick={logout}
              className="text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2 text-sm"
              style={{ backgroundColor: COLORS.accent }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'Tableau de bord' },
            { id: 'courses', icon: Navigation, label: 'Courses', badge: pendingCourses.length },
            { id: 'history', icon: Clock, label: 'Historique' },
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
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'text-white'
                  }`} style={activeTab !== tab.id ? { backgroundColor: COLORS.accent } : {}}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ===== DASHBOARD ===== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${COLORS.accent}15` }}>
                    <Navigation style={{ color: COLORS.accent }} size={22} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{pendingCourses.length}</p>
                    <p className="text-sm text-slate-500">Courses sollicitées</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-50">
                    <CheckCircle className="text-green-600" size={22} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{completedCourses.length}</p>
                    <p className="text-sm text-slate-500">Courses effectuées</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${COLORS.primary}15` }}>
                    <DollarSign style={{ color: COLORS.primary }} size={22} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{totalEarnings.toLocaleString()}</p>
                    <p className="text-sm text-slate-500">CFA gagnés</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profil Card */}
            <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: COLORS.primary }}>
              <div className="flex flex-col md:flex-row items-center gap-5">
                <div className="w-20 h-20 rounded-full overflow-hidden relative border-4 border-white/30">
                  {driver?.image ? (
                    <Image src={driver.image} fill className="object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                      {driver?.fullName?.charAt(0) || "C"}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl font-bold">{driver?.fullName}</h2>
                  <p className="text-white/80 flex items-center justify-center md:justify-start gap-2 mt-1 text-sm">
                    <MapPin size={14} /> {driver?.location || "Cameroun"}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                      {driver?.experience || 0} ans d'expérience
                    </span>
                    {driver?.languages?.map((lang: string, i: number) => (
                      <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2 text-2xl font-bold">
                    <Star className="text-yellow-400 fill-yellow-400" size={24} />
                    {driver?.rating || "N/A"}
                  </div>
                  <p className="text-white/80 text-sm">{driver?.reviewCount || 0} avis</p>
                </div>
              </div>
            </div>

            {/* Alerte si indisponible */}
            {!isAvailable && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-center gap-4">
                <AlertCircle className="text-red-500" size={22} />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-700">Vous êtes hors service</h3>
                  <p className="text-red-600 text-sm">Activez votre statut pour recevoir des demandes.</p>
                </div>
                <button
                  onClick={toggleAvailability}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 transition text-sm"
                >
                  Activer
                </button>
              </div>
            )}

            {/* Dernières courses */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-slate-900">Dernières courses</h2>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  style={{ color: COLORS.primary }}
                >
                  Voir tout <ChevronRight size={16} />
                </button>
              </div>

              {pendingCourses.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Navigation size={36} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Aucune course en attente</p>
                </div>
              ) : (
                pendingCourses.slice(0, 3).map(course => (
                  <div key={course.id} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${COLORS.primary}15` }}>
                      <Car style={{ color: COLORS.primary }} size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{course.car?.name || "Course"}</h4>
                      <p className="text-xs text-slate-500">
                        {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.status === 'PENDING' ? 'text-white' : 'bg-green-100 text-green-600'
                      }`} style={course.status === 'PENDING' ? { backgroundColor: COLORS.accent } : {}}>
                      {course.status === 'PENDING' ? 'En attente' : 'Confirmée'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ===== COURSES ===== */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            {pendingCourses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                <Navigation size={40} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-400">Aucune course en attente</h3>
                <p className="text-slate-400 mt-1 text-sm">
                  {isAvailable
                    ? "Les prochaines demandes apparaîtront ici."
                    : "Activez votre statut pour recevoir des courses."}
                </p>
              </div>
            ) : (
              pendingCourses.map(course => (
                <div key={course.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden relative">
                        <Image src={course.car?.image || "/assets/car1.jpeg"} fill className="object-cover" alt="" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{course.car?.name}</h3>
                        <p className="text-sm text-slate-500">Client #{course.userId}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <Calendar size={12} />
                          {new Date(course.startDate).toLocaleDateString()} → {new Date(course.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${course.status === 'PENDING' ? 'text-white' : 'bg-green-100 text-green-700'
                      }`} style={course.status === 'PENDING' ? { backgroundColor: COLORS.accent } : {}}>
                      {course.status === 'PENDING' ? 'Nouvelle demande' : 'Confirmée'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ===== HISTORIQUE ===== */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {completedCourses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                <Clock size={40} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-400">Aucun historique</h3>
                <p className="text-slate-400 mt-1 text-sm">Vos courses terminées apparaîtront ici.</p>
              </div>
            ) : (
              completedCourses.map(course => (
                <div key={course.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="text-green-600" size={22} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{course.car?.name}</h3>
                        <p className="text-sm text-slate-500">
                          {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-slate-900">
                        +{((course.totalPrice || 0) * 0.3).toLocaleString()} CFA
                      </p>
                      <p className="text-xs text-slate-400">Commission chauffeur</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}