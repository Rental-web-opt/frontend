"use client";

import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface Car {
    id: number;
    name: string;
    brand: string;
    model: string;
    pricePerDay: number;
    location: string;
    isAvailable: boolean;
    type: string;
}

interface CarStats {
    total: number;
    available: number;
    rented: number;
}

export default function CarsManagement() {
    const [cars, setCars] = useState<Car[]>([]);
    const [stats, setStats] = useState<CarStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        fetchCars();
        fetchStats();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api/admin/cars");
            setCars(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des voitures", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api/admin/cars/stats");
            setStats(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des statistiques", error);
        }
    };

    const filteredCars = cars.filter(car => {
        if (filter === "ALL") return true;
        if (filter === "AVAILABLE") return car.isAvailable;
        if (filter === "RENTED") return !car.isAvailable;
        return true;
    });

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
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">🚗 Gestion des Voitures</h1>
                    <p className="text-gray-600 mb-6">Gérer toutes les voitures de la plateforme</p>

                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg opacity-90">Total</h3>
                                    <p className="text-4xl font-bold mt-2">{stats?.total || 0}</p>
                                </div>
                                <div className="text-5xl opacity-80">🚗</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg opacity-90">Disponibles</h3>
                                    <p className="text-4xl font-bold mt-2">{stats?.available || 0}</p>
                                </div>
                                <div className="text-5xl opacity-80">✅</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg opacity-90">Louées</h3>
                                    <p className="text-4xl font-bold mt-2">{stats?.rented || 0}</p>
                                </div>
                                <div className="text-5xl opacity-80">🔒</div>
                            </div>
                        </div>
                    </div>

                    {/* Filtres */}
                    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                        <div className="flex gap-2 flex-wrap">
                            {["ALL", "AVAILABLE", "RENTED"].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === f
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {f === "ALL" ? "Toutes" : f === "AVAILABLE" ? "Disponibles" : "Louées"}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                            {filteredCars.length} voiture(s) affichée(s)
                        </p>
                    </div>

                    {/* Tableau des voitures */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">ID</th>
                                    <th className="px-6 py-4 text-left font-semibold">Nom</th>
                                    <th className="px-6 py-4 text-left font-semibold">Marque / Modèle</th>
                                    <th className="px-6 py-4 text-left font-semibold">Type</th>
                                    <th className="px-6 py-4 text-left font-semibold">Prix/Jour</th>
                                    <th className="px-6 py-4 text-left font-semibold">Localisation</th>
                                    <th className="px-6 py-4 text-center font-semibold">Disponibilité</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCars.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-gray-500">
                                            Aucune voiture trouvée
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCars.map((car, index) => (
                                        <tr
                                            key={car.id}
                                            className={`border-b hover:bg-green-50 transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                                }`}
                                        >
                                            <td className="px-6 py-4 font-mono text-sm">{car.id}</td>
                                            <td className="px-6 py-4 font-semibold">{car.name}</td>
                                            <td className="px-6 py-4">{car.brand} {car.model}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold">
                                                    {car.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-green-600">
                                                {car.pricePerDay}€
                                            </td>
                                            <td className="px-6 py-4">{car.location}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${car.isAvailable
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {car.isAvailable ? "✅ Disponible" : "🔒 Louée"}
                                                </span>
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
