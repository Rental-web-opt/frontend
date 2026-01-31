"use client";

import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface Booking {
    id: number;
    userId: number;
    car: {
        id: number;
        name: string;
        brand: string;
    };
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    withDriver: boolean;
}

interface BookingStats {
    total: number;
    totalRevenue: number;
}

export default function BookingsManagement() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [stats, setStats] = useState<BookingStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
        fetchStats();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api/admin/bookings");
            setBookings(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des réservations", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api/admin/bookings/stats");
            setStats(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des statistiques", error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <ProtectedAdminRoute>
                <AdminLayout>
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
                    </div>
                </AdminLayout>
            </ProtectedAdminRoute>
        );
    }

    return (
        <ProtectedAdminRoute>
            <AdminLayout>
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">📅 Gestion des Réservations</h1>
                    <p className="text-gray-600 mb-6">Gérer toutes les réservations de la plateforme</p>

                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg opacity-90">Total Réservations</h3>
                                    <p className="text-4xl font-bold mt-2">{stats?.total || 0}</p>
                                </div>
                                <div className="text-6xl opacity-80">📅</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg opacity-90">Revenu Total</h3>
                                    <p className="text-4xl font-bold mt-2">{stats?.totalRevenue?.toFixed(2) || 0}€</p>
                                </div>
                                <div className="text-6xl opacity-80">💰</div>
                            </div>
                        </div>
                    </div>

                    {/* Tableau des réservations */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">ID</th>
                                    <th className="px-6 py-4 text-left font-semibold">Voiture</th>
                                    <th className="px-6 py-4 text-left font-semibold">User ID</th>
                                    <th className="px-6 py-4 text-left font-semibold">Dates</th>
                                    <th className="px-6 py-4 text-left font-semibold">Prix Total</th>
                                    <th className="px-6 py-4 text-left font-semibold">Statut</th>
                                    <th className="px-6 py-4 text-center font-semibold">Chauffeur</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-gray-500">
                                            Aucune réservation trouvée
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking, index) => (
                                        <tr
                                            key={booking.id}
                                            className={`border-b hover:bg-orange-50 transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                                }`}
                                        >
                                            <td className="px-6 py-4 font-mono text-sm">{booking.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold">{booking.car?.name || "N/A"}</div>
                                                <div className="text-sm text-gray-500">{booking.car?.brand || "N/A"}</div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-sm">{booking.userId}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div>Du: {formatDate(booking.startDate)}</div>
                                                <div>Au: {formatDate(booking.endDate)}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-green-600">
                                                {booking.totalPrice?.toFixed(2) || 0}€
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === "CONFIRMED"
                                                            ? "bg-green-100 text-green-700"
                                                            : booking.status === "PENDING"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : booking.status === "CANCELLED"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {booking.withDriver ? (
                                                    <span className="text-green-600 font-semibold">✅ Oui</span>
                                                ) : (
                                                    <span className="text-gray-400">❌ Non</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedAdminRoute>
    );
}
