"use client";

import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { adminService, agencyService, carService, bookingService } from "@/services/api";
import {
    Users, Building2, Car, CalendarCheck, TrendingUp, Activity,
    ArrowUpRight, DollarSign, BarChart3, PieChart, Eye, MapPin
} from "lucide-react";
import Link from "next/link";

interface Stats {
    totalUsers: number;
    totalAgencies: number;
    totalCars: number;
    totalBookings: number;
}

interface Agency {
    id: number;
    name: string;
    city: string;
    rating?: number;
    open: boolean;
}

interface Car {
    id: number;
    name: string;
    brand: string;
    pricePerDay: number;
    agency: Agency;
    available: boolean;
}

interface Booking {
    id: number;
    car: Car;
    totalPrice: number;
    status: string;
    createdAt: string;
}

interface AgencyStats {
    agency: Agency;
    vehicleCount: number;
    totalRevenue: number;
    bookingCount: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [agencyStats, setAgencyStats] = useState<AgencyStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            // Utiliser les services qui supportent le mode mock
            const [statsRes, agenciesRes, carsRes, bookingsRes] = await Promise.all([
                adminService.getStats(),
                agencyService.getAll(),
                carService.getAll(),
                bookingService.getAll()
            ]);

            setStats(statsRes.data);
            setAgencies(agenciesRes.data);
            setCars(carsRes.data);
            setBookings(bookingsRes.data);

            // Calculer les statistiques par agence
            const agencyMap = new Map<number, AgencyStats>();

            // Initialiser avec toutes les agences
            agenciesRes.data.forEach((agency: Agency) => {
                agencyMap.set(agency.id, {
                    agency,
                    vehicleCount: 0,
                    totalRevenue: 0,
                    bookingCount: 0
                });
            });

            // Compter les véhicules par agence
            carsRes.data.forEach((car: Car) => {
                if (car.agency && agencyMap.has(car.agency.id)) {
                    const stats = agencyMap.get(car.agency.id)!;
                    stats.vehicleCount++;
                }
            });

            // Calculer les revenus par agence (basé sur les réservations confirmées)
            let revenue = 0;
            bookingsRes.data.forEach((booking: Booking) => {
                if (booking.car?.agency && agencyMap.has(booking.car.agency.id)) {
                    const stats = agencyMap.get(booking.car.agency.id)!;
                    if (booking.status === "CONFIRMED" || booking.status === "COMPLETED") {
                        stats.totalRevenue += booking.totalPrice || 0;
                        stats.bookingCount++;
                        revenue += booking.totalPrice || 0;
                    }
                }
            });

            setTotalRevenue(revenue);
            setAgencyStats(Array.from(agencyMap.values()).sort((a, b) => b.totalRevenue - a.totalRevenue));

        } catch (error) {
            console.error("Erreur lors du chargement", error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR').format(price);
    };

    if (loading) {
        return (
            <ProtectedAdminRoute>
                <AdminLayout>
                    <div className="flex items-center justify-center h-[60vh]">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-[#002AD7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-500 font-medium">Chargement du dashboard...</p>
                        </div>
                    </div>
                </AdminLayout>
            </ProtectedAdminRoute>
        );
    }

    return (
        <ProtectedAdminRoute>
            <AdminLayout>
                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 mb-1">
                                🏪 Marketplace Admin
                            </h1>
                            <p className="text-slate-500">
                                Supervisez toutes les agences partenaires et leurs performances
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl">
                            <Activity size={18} />
                            <span className="font-semibold text-sm">Plateforme active</span>
                        </div>
                    </div>

                    {/* Statistiques principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Carte Revenus Total */}
                        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                                    <DollarSign size={28} />
                                </div>
                                <span className="text-emerald-200 text-sm font-medium">Total Plateforme</span>
                            </div>
                            <p className="text-4xl font-black mb-1">{formatPrice(totalRevenue)} <span className="text-lg">CFA</span></p>
                            <p className="text-emerald-200">Revenus totaux générés</p>
                        </div>

                        {/* Cartes stats */}
                        <Link href="/Admin/Agencies" className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <Building2 size={24} className="text-purple-200" />
                                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-3xl font-black">{stats?.totalAgencies || 0}</p>
                            <p className="text-purple-200 text-sm">Agences partenaires</p>
                        </Link>

                        <Link href="/Admin/Cars" className="bg-gradient-to-br from-[#002AD7] to-[#0044ff] rounded-2xl p-5 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <Car size={24} className="text-blue-200" />
                                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-3xl font-black">{stats?.totalCars || 0}</p>
                            <p className="text-blue-200 text-sm">Véhicules totaux</p>
                        </Link>

                        <Link href="/Admin/Bookings" className="bg-gradient-to-br from-[#F76513] to-orange-500 rounded-2xl p-5 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <CalendarCheck size={24} className="text-orange-200" />
                                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-3xl font-black">{stats?.totalBookings || 0}</p>
                            <p className="text-orange-200 text-sm">Réservations</p>
                        </Link>
                    </div>

                    {/* Section principale : Performances par Agence */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5 text-white">
                            <div className="flex items-center gap-3">
                                <BarChart3 size={24} />
                                <div>
                                    <h2 className="text-xl font-bold">📊 Performances par Agence</h2>
                                    <p className="text-slate-300 text-sm">Revenus et véhicules de chaque agence partenaire</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {agencyStats.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    <Building2 size={48} className="mx-auto mb-4 text-slate-300" />
                                    <p>Aucune agence enregistrée</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {agencyStats.map((stat, index) => {
                                        const revenuePercent = totalRevenue > 0 ? (stat.totalRevenue / totalRevenue) * 100 : 0;
                                        return (
                                            <div
                                                key={stat.agency.id}
                                                className="bg-slate-50 rounded-2xl p-5 hover:bg-slate-100 transition-all border border-slate-100"
                                            >
                                                <div className="flex items-start gap-4">
                                                    {/* Rang */}
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white ${index === 0 ? 'bg-amber-500' :
                                                        index === 1 ? 'bg-slate-400' :
                                                            index === 2 ? 'bg-amber-700' : 'bg-slate-300'
                                                        }`}>
                                                        #{index + 1}
                                                    </div>

                                                    {/* Infos agence */}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="font-bold text-lg text-slate-800">{stat.agency.name}</h3>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${stat.agency.open ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                {stat.agency.open ? '● Ouvert' : '● Fermé'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                                                            <span className="flex items-center gap-1">
                                                                <MapPin size={14} /> {stat.agency.city || 'Non spécifié'}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Car size={14} /> {stat.vehicleCount} véhicule(s)
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <CalendarCheck size={14} /> {stat.bookingCount} réservation(s)
                                                            </span>
                                                        </div>

                                                        {/* Barre de progression revenus */}
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex-1">
                                                                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                                                                        style={{ width: `${Math.max(revenuePercent, 2)}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                            <span className="text-sm text-slate-500 w-16 text-right">{revenuePercent.toFixed(1)}%</span>
                                                        </div>
                                                    </div>

                                                    {/* Revenue */}
                                                    <div className="text-right">
                                                        <p className="text-2xl font-black text-emerald-600">{formatPrice(stat.totalRevenue)}</p>
                                                        <p className="text-sm text-slate-500">CFA générés</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Grid: Véhicules par Agence + Top véhicules */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Répartition des véhicules */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-[#002AD7] rounded-xl flex items-center justify-center">
                                    <PieChart size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Répartition des Véhicules</h3>
                                    <p className="text-sm text-slate-500">Par agence partenaire</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {agencyStats.slice(0, 5).map((stat, index) => {
                                    const colors = ['bg-[#002AD7]', 'bg-purple-500', 'bg-emerald-500', 'bg-[#F76513]', 'bg-pink-500'];
                                    const vehiclePercent = cars.length > 0 ? (stat.vehicleCount / cars.length) * 100 : 0;
                                    return (
                                        <div key={stat.agency.id} className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                                            <span className="flex-1 text-sm text-slate-600 truncate">{stat.agency.name}</span>
                                            <span className="text-sm font-bold text-slate-800">{stat.vehicleCount}</span>
                                            <span className="text-xs text-slate-400 w-12 text-right">{vehiclePercent.toFixed(0)}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Derniers véhicules ajoutés */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                                        <Car size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Catalogue Global</h3>
                                        <p className="text-sm text-slate-500">Aperçu des véhicules</p>
                                    </div>
                                </div>
                                <Link href="/Admin/Cars" className="text-[#002AD7] hover:underline text-sm font-semibold flex items-center gap-1">
                                    Voir tout <Eye size={14} />
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {cars.slice(0, 5).map((car) => (
                                    <div key={car.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                                        <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                                            <Car size={18} className="text-slate-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-800 truncate">{car.name}</p>
                                            <p className="text-xs text-slate-500">{car.brand} • {car.agency?.name || 'N/A'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-[#002AD7]">{formatPrice(car.pricePerDay)}</p>
                                            <p className="text-xs text-slate-400">CFA/jour</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Accès rapides */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                                <TrendingUp size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Gestion Rapide</h2>
                                <p className="text-sm text-slate-500">Accédez aux différentes sections</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/Admin/Users" className="p-5 rounded-xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 transition-all group">
                                <Users size={28} className="text-[#002AD7] mb-3" />
                                <h3 className="font-bold text-slate-800">Utilisateurs</h3>
                                <p className="text-sm text-slate-500">{stats?.totalUsers} inscrits</p>
                            </Link>
                            <Link href="/Admin/Agencies" className="p-5 rounded-xl bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 transition-all group">
                                <Building2 size={28} className="text-purple-600 mb-3" />
                                <h3 className="font-bold text-slate-800">Agences</h3>
                                <p className="text-sm text-slate-500">{stats?.totalAgencies} partenaires</p>
                            </Link>
                            <Link href="/Admin/Cars" className="p-5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 transition-all group">
                                <Car size={28} className="text-emerald-600 mb-3" />
                                <h3 className="font-bold text-slate-800">Véhicules</h3>
                                <p className="text-sm text-slate-500">{stats?.totalCars} au catalogue</p>
                            </Link>
                            <Link href="/Admin/Bookings" className="p-5 rounded-xl bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 transition-all group">
                                <CalendarCheck size={28} className="text-[#F76513] mb-3" />
                                <h3 className="font-bold text-slate-800">Réservations</h3>
                                <p className="text-sm text-slate-500">{stats?.totalBookings} au total</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedAdminRoute>
    );
}
