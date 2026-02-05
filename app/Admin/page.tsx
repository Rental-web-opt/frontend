"use client";

import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { adminService, agencyService, carService, bookingService } from "@/services/api";
import {
    Users, Building2, Car, CalendarCheck, TrendingUp, Activity,
    ArrowUpRight, DollarSign, BarChart3, PieChart, Eye, MapPin, Star
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

            agenciesRes.data.forEach((agency: Agency) => {
                agencyMap.set(agency.id, {
                    agency,
                    vehicleCount: 0,
                    totalRevenue: 0,
                    bookingCount: 0
                });
            });

            carsRes.data.forEach((car: Car) => {
                if (car.agency && agencyMap.has(car.agency.id)) {
                    const stats = agencyMap.get(car.agency.id)!;
                    stats.vehicleCount++;
                }
            });

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
                                Tableau de Bord
                            </h1>
                            <p className="text-slate-500">
                                Supervisez votre plateforme de location
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-[#002AD7]/10 text-[#002AD7] px-4 py-2 rounded-xl">
                            <Activity size={18} />
                            <span className="font-semibold text-sm">Plateforme active</span>
                        </div>
                    </div>

                    {/* Statistiques principales - Palette bleue cohérente */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Carte Revenus Total - Bleu principal */}
                        <div className="lg:col-span-1 bg-gradient-to-br from-[#002AD7] to-[#001a8f] rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                                    <DollarSign size={24} />
                                </div>
                                <span className="text-blue-200 text-xs font-medium uppercase tracking-wider">Revenus</span>
                            </div>
                            <p className="text-3xl font-black mb-1">{formatPrice(totalRevenue)}</p>
                            <p className="text-blue-200 text-sm">CFA générés</p>
                        </div>

                        {/* Agences */}
                        <Link href="/Admin/Agencies" className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-[#002AD7]/30 transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-[#002AD7]/10 rounded-xl p-3">
                                    <Building2 size={24} className="text-[#002AD7]" />
                                </div>
                                <ArrowUpRight size={16} className="text-slate-300 group-hover:text-[#002AD7] transition-colors" />
                            </div>
                            <p className="text-3xl font-black text-slate-900">{stats?.totalAgencies || 0}</p>
                            <p className="text-slate-500 text-sm">Agences partenaires</p>
                        </Link>

                        {/* Véhicules */}
                        <Link href="/Admin/Cars" className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-[#002AD7]/30 transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-[#002AD7]/10 rounded-xl p-3">
                                    <Car size={24} className="text-[#002AD7]" />
                                </div>
                                <ArrowUpRight size={16} className="text-slate-300 group-hover:text-[#002AD7] transition-colors" />
                            </div>
                            <p className="text-3xl font-black text-slate-900">{stats?.totalCars || 0}</p>
                            <p className="text-slate-500 text-sm">Véhicules totaux</p>
                        </Link>

                        {/* Réservations */}
                        <Link href="/Admin/Bookings" className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-[#002AD7]/30 transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-[#002AD7]/10 rounded-xl p-3">
                                    <CalendarCheck size={24} className="text-[#002AD7]" />
                                </div>
                                <ArrowUpRight size={16} className="text-slate-300 group-hover:text-[#002AD7] transition-colors" />
                            </div>
                            <p className="text-3xl font-black text-slate-900">{stats?.totalBookings || 0}</p>
                            <p className="text-slate-500 text-sm">Réservations</p>
                        </Link>
                    </div>

                    {/* Section principale : Performances par Agence - Header Bleu */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#002AD7] to-[#0044ff] px-6 py-5 text-white">
                            <div className="flex items-center gap-3">
                                <BarChart3 size={24} />
                                <div>
                                    <h2 className="text-xl font-bold">Performances par Agence</h2>
                                    <p className="text-blue-200 text-sm">Revenus et véhicules de chaque agence partenaire</p>
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
                                                className="bg-slate-50 rounded-2xl p-5 hover:bg-blue-50/50 transition-all border border-slate-100 hover:border-[#002AD7]/20"
                                            >
                                                <div className="flex items-start gap-4">
                                                    {/* Rang avec dégradé bleu */}
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white ${index === 0 ? 'bg-gradient-to-br from-[#002AD7] to-[#0044ff]' :
                                                            index === 1 ? 'bg-gradient-to-br from-slate-500 to-slate-600' :
                                                                index === 2 ? 'bg-gradient-to-br from-slate-400 to-slate-500' : 'bg-slate-300'
                                                        }`}>
                                                        #{index + 1}
                                                    </div>

                                                    {/* Infos agence */}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="font-bold text-lg text-slate-800">{stat.agency.name}</h3>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${stat.agency.open ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
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

                                                        {/* Barre de progression - Bleu */}
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex-1">
                                                                <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-[#002AD7] to-[#0066ff] rounded-full transition-all duration-500"
                                                                        style={{ width: `${Math.max(revenuePercent, 2)}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                            <span className="text-sm text-slate-500 w-14 text-right font-medium">{revenuePercent.toFixed(1)}%</span>
                                                        </div>
                                                    </div>

                                                    {/* Revenue - Bleu */}
                                                    <div className="text-right">
                                                        <p className="text-2xl font-black text-[#002AD7]">{formatPrice(stat.totalRevenue)}</p>
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
                                    // Palette de bleus différents
                                    const colors = ['bg-[#002AD7]', 'bg-[#0044ff]', 'bg-[#4d79ff]', 'bg-[#809fff]', 'bg-[#b3c6ff]'];
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

                        {/* Catalogue véhicules */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#002AD7] rounded-xl flex items-center justify-center">
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
                                    <div key={car.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-blue-50/50 transition border border-transparent hover:border-[#002AD7]/10">
                                        <div className="w-10 h-10 bg-[#002AD7]/10 rounded-lg flex items-center justify-center">
                                            <Car size={18} className="text-[#002AD7]" />
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

                    {/* Accès rapides - Thème bleu uniforme */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#002AD7] rounded-xl flex items-center justify-center">
                                <TrendingUp size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Gestion Rapide</h2>
                                <p className="text-sm text-slate-500">Accédez aux différentes sections</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/Admin/Users" className="p-5 rounded-xl bg-[#002AD7]/5 hover:bg-[#002AD7]/10 border-2 border-[#002AD7]/10 hover:border-[#002AD7]/30 transition-all group">
                                <Users size={28} className="text-[#002AD7] mb-3" />
                                <h3 className="font-bold text-slate-800">Utilisateurs</h3>
                                <p className="text-sm text-slate-500">{stats?.totalUsers} inscrits</p>
                            </Link>
                            <Link href="/Admin/Agencies" className="p-5 rounded-xl bg-[#002AD7]/5 hover:bg-[#002AD7]/10 border-2 border-[#002AD7]/10 hover:border-[#002AD7]/30 transition-all group">
                                <Building2 size={28} className="text-[#002AD7] mb-3" />
                                <h3 className="font-bold text-slate-800">Agences</h3>
                                <p className="text-sm text-slate-500">{stats?.totalAgencies} partenaires</p>
                            </Link>
                            <Link href="/Admin/Cars" className="p-5 rounded-xl bg-[#002AD7]/5 hover:bg-[#002AD7]/10 border-2 border-[#002AD7]/10 hover:border-[#002AD7]/30 transition-all group">
                                <Car size={28} className="text-[#002AD7] mb-3" />
                                <h3 className="font-bold text-slate-800">Véhicules</h3>
                                <p className="text-sm text-slate-500">{stats?.totalCars} au catalogue</p>
                            </Link>
                            <Link href="/Admin/Bookings" className="p-5 rounded-xl bg-[#002AD7]/5 hover:bg-[#002AD7]/10 border-2 border-[#002AD7]/10 hover:border-[#002AD7]/30 transition-all group">
                                <CalendarCheck size={28} className="text-[#002AD7] mb-3" />
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
