"use client";

import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface Stats {
    totalUsers: number;
    totalAgencies: number;
    totalCars: number;
    totalBookings: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api/admin/stats");
            setStats(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des statistiques", error);
        } finally {
            setLoading(false);
        }
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
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Tableau de Bord Administrateur</h1>
                    <p className="text-gray-600 mb-8">Vue d'ensemble de la plateforme de location</p>

                    {/* Cartes de statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Utilisateurs */}
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-white bg-opacity-20 rounded-full p-3">
                                    <span className="text-3xl">👥</span>
                                </div>
                                <span className="text-4xl font-bold">{stats?.totalUsers || 0}</span>
                            </div>
                            <h3 className="text-lg font-semibold opacity-90">Utilisateurs</h3>
                            <p className="text-sm opacity-75">Total inscrits</p>
                        </div>

                        {/* Total Agences */}
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-white bg-opacity-20 rounded-full p-3">
                                    <span className="text-3xl">🏢</span>
                                </div>
                                <span className="text-4xl font-bold">{stats?.totalAgencies || 0}</span>
                            </div>
                            <h3 className="text-lg font-semibold opacity-90">Agences</h3>
                            <p className="text-sm opacity-75">Partenaires actifs</p>
                        </div>

                        {/* Total Voitures */}
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-white bg-opacity-20 rounded-full p-3">
                                    <span className="text-3xl">🚗</span>
                                </div>
                                <span className="text-4xl font-bold">{stats?.totalCars || 0}</span>
                            </div>
                            <h3 className="text-lg font-semibold opacity-90">Voitures</h3>
                            <p className="text-sm opacity-75">Véhicules disponibles</p>
                        </div>

                        {/* Total Réservations */}
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-white bg-opacity-20 rounded-full p-3">
                                    <span className="text-3xl">📅</span>
                                </div>
                                <span className="text-4xl font-bold">{stats?.totalBookings || 0}</span>
                            </div>
                            <h3 className="text-lg font-semibold opacity-90">Réservations</h3>
                            <p className="text-sm opacity-75">Total effectuées</p>
                        </div>
                    </div>

                    {/* Accès rapides */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">🚀 Accès Rapides</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <a href="/Admin/Users" className="block p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors border-2 border-blue-200">
                                <div className="text-3xl mb-2">👥</div>
                                <h3 className="font-semibold text-gray-800">Gérer les utilisateurs</h3>
                            </a>
                            <a href="/Admin/Agencies" className="block p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors border-2 border-purple-200">
                                <div className="text-3xl mb-2">🏢</div>
                                <h3 className="font-semibold text-gray-800">Gérer les agences</h3>
                            </a>
                            <a href="/Admin/Cars" className="block p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors border-2 border-green-200">
                                <div className="text-3xl mb-2">🚗</div>
                                <h3 className="font-semibold text-gray-800">Gérer les voitures</h3>
                            </a>
                            <a href="/Admin/Bookings" className="block p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors border-2 border-orange-200">
                                <div className="text-3xl mb-2">📅</div>
                                <h3 className="font-semibold text-gray-800">Gérer les réservations</h3>
                            </a>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedAdminRoute>
    );
}
