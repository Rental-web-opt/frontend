"use client";

import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { carService } from "@/services/api";
import api from "@/services/api";
import { Car, Search, Filter, CheckCircle, XCircle, Trash2, MapPin, DollarSign } from "lucide-react";

interface CarType {
    id: number;
    name: string;
    brand: string;
    model: string;
    pricePerDay: number;
    location: string;
    available: boolean;
    type: string;
}

export default function CarsManagement() {
    const [cars, setCars] = useState<CarType[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await carService.getAll();
            setCars(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des voitures", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCar = async (id: number, name: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?\n\nCette action est irréversible !`)) return;

        try {
            await api.delete(`/admin/cars/${id}`);
            alert("✅ Voiture supprimée avec succès !");
            fetchCars();
        } catch (error) {
            alert("❌ Erreur lors de la suppression");
        }
    };

    const filteredCars = cars.filter(car => {
        const matchesFilter = filter === "ALL" ||
            (filter === "AVAILABLE" && car.available) ||
            (filter === "RENTED" && !car.available);
        const matchesSearch = car.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.brand?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: cars.length,
        available: cars.filter(c => c.available).length,
        rented: cars.filter(c => !c.available).length
    };

    if (loading) {
        return (
            <ProtectedAdminRoute>
                <AdminLayout>
                    <div className="flex items-center justify-center h-[60vh]">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-500 font-medium">Chargement des voitures...</p>
                        </div>
                    </div>
                </AdminLayout>
            </ProtectedAdminRoute>
        );
    }

    return (
        <ProtectedAdminRoute>
            <AdminLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 mb-1">
                                Gestion des Voitures
                            </h1>
                            <p className="text-slate-500">
                                {cars.length} véhicule(s) dans le catalogue
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-emerald-100 font-medium mb-1">Total</p>
                                    <p className="text-4xl font-black">{stats.total}</p>
                                </div>
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <Car size={28} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#002AD7] to-[#0044ff] rounded-2xl shadow-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 font-medium mb-1">Disponibles</p>
                                    <p className="text-4xl font-black">{stats.available}</p>
                                </div>
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <CheckCircle size={28} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#F76513] to-orange-500 rounded-2xl shadow-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 font-medium mb-1">Louées</p>
                                    <p className="text-4xl font-black">{stats.rented}</p>
                                </div>
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <XCircle size={28} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            {/* Search */}
                            <div className="relative w-full lg:w-96">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom ou marque..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Status Filters */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <Filter size={18} className="text-slate-400" />
                                {[
                                    { key: "ALL", label: "Toutes" },
                                    { key: "AVAILABLE", label: "Disponibles" },
                                    { key: "RENTED", label: "Louées" }
                                ].map(f => (
                                    <button
                                        key={f.key}
                                        onClick={() => setFilter(f.key)}
                                        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${filter === f.key
                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-4">
                            {filteredCars.length} résultat(s) affiché(s)
                        </p>
                    </div>

                    {/* Cars Table */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                                        <th className="px-6 py-4 text-left font-semibold text-sm">ID</th>
                                        <th className="px-6 py-4 text-left font-semibold text-sm">Véhicule</th>
                                        <th className="px-6 py-4 text-left font-semibold text-sm">Type</th>
                                        <th className="px-6 py-4 text-left font-semibold text-sm">Prix/Jour</th>
                                        <th className="px-6 py-4 text-left font-semibold text-sm">Statut</th>
                                        <th className="px-6 py-4 text-center font-semibold text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCars.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-12">
                                                <Car size={48} className="mx-auto text-slate-300 mb-3" />
                                                <p className="text-slate-500 font-medium">Aucune voiture trouvée</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCars.map((car, index) => (
                                            <tr
                                                key={car.id}
                                                className={`border-b border-slate-100 hover:bg-emerald-50/50 transition-colors ${index % 2 === 0 ? "bg-slate-50/50" : "bg-white"
                                                    }`}
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-sm text-slate-500">#{car.id}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                                            <Car size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-800">{car.name}</p>
                                                            <p className="text-sm text-slate-500">{car.brand}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">
                                                        {car.type || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                                                        <DollarSign size={16} />
                                                        <span>{car.pricePerDay?.toLocaleString() || 0} FCFA</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${car.available
                                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                        : "bg-red-100 text-red-700 border border-red-200"
                                                        }`}>
                                                        {car.available ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                        {car.available ? "Disponible" : "Louée"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => handleDeleteCar(car.id, car.name)}
                                                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-lg"
                                                        >
                                                            <Trash2 size={14} />
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedAdminRoute>
    );
}
