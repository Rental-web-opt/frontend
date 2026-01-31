"use client";

import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface Agency {
    id: number;
    name: string;
    city: string;
    location: string;
    phone: string;
    email: string;
    rating: number;
    reviewCount: number;
}

export default function AgenciesManagement() {
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAgencies();
    }, []);

    const fetchAgencies = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api/admin/agencies/all");
            setAgencies(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des agences", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAgency = async (id: number, name: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer l'agence "${name}" ?`)) return;

        try {
            await axios.delete(`http://localhost:8081/api/admin/agencies/${id}`);
            alert("✅ Agence supprimée avec succès !");
            fetchAgencies();
        } catch (error) {
            alert("❌ Erreur lors de la suppression");
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
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">🏢 Gestion des Agences</h1>
                    <p className="text-gray-600 mb-6">Gérer toutes les agences partenaires</p>

                    {/* Statistiques */}
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 mb-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg opacity-90">Total des agences</h3>
                                <p className="text-4xl font-bold mt-2">{agencies.length}</p>
                            </div>
                            <div className="text-6xl opacity-80">🏢</div>
                        </div>
                    </div>

                    {/* Tableau des agences */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">ID</th>
                                    <th className="px-6 py-4 text-left font-semibold">Nom</th>
                                    <th className="px-6 py-4 text-left font-semibold">Ville</th>
                                    <th className="px-6 py-4 text-left font-semibold">Contact</th>
                                    <th className="px-6 py-4 text-left font-semibold">Note</th>
                                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agencies.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-gray-500">
                                            Aucune agence trouvée
                                        </td>
                                    </tr>
                                ) : (
                                    agencies.map((agency, index) => (
                                        <tr
                                            key={agency.id}
                                            className={`border-b hover:bg-purple-50 transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                                }`}
                                        >
                                            <td className="px-6 py-4 font-mono text-sm">{agency.id}</td>
                                            <td className="px-6 py-4 font-semibold">{agency.name}</td>
                                            <td className="px-6 py-4">{agency.city}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div>{agency.phone || "N/A"}</div>
                                                <div className="text-gray-500">{agency.email || "N/A"}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-500">⭐</span>
                                                    <span className="font-semibold">{agency.rating || "N/A"}</span>
                                                    <span className="text-gray-500 text-sm">({agency.reviewCount || 0} avis)</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleDeleteAgency(agency.id, agency.name)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                                                    >
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
            </AdminLayout>
        </ProtectedAdminRoute>
    );
}
