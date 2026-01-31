"use client";

import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
    id: number;
    fullName: string;
    email: string;
    role: string;
    agencyStatus: string;
}

export default function UsersManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api/admin/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: number, name: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) return;

        try {
            await axios.delete(`http://localhost:8081/api/admin/users/${id}`);
            alert("✅ Utilisateur supprimé avec succès !");
            fetchUsers();
        } catch (error) {
            alert("❌ Erreur lors de la suppression");
        }
    };

    const handleChangeRole = async (id: number, currentRole: string) => {
        const newRole = prompt(`Nouveau rôle pour cet utilisateur (USER, ADMIN, AGENCY, DRIVER) :\nRôle actuel : ${currentRole}`, currentRole);
        if (!newRole || newRole === currentRole) return;

        if (!["USER", "ADMIN", "AGENCY", "DRIVER"].includes(newRole.toUpperCase())) {
            alert("❌ Rôle invalide !");
            return;
        }

        try {
            await axios.put(`http://localhost:8081/api/admin/users/${id}/role`, {
                role: newRole.toUpperCase(),
            });
            alert("✅ Rôle modifié avec succès !");
            fetchUsers();
        } catch (error) {
            alert("❌ Erreur lors de la modification du rôle");
        }
    };

    const filteredUsers = users.filter(user => {
        if (filter === "ALL") return true;
        return user.role === filter;
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
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">👥 Gestion des Utilisateurs</h1>
                    <p className="text-gray-600 mb-6">Gérer tous les utilisateurs de la plateforme</p>

                    {/* Filtres */}
                    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                        <div className="flex gap-2 flex-wrap">
                            {["ALL", "USER", "ADMIN", "AGENCY", "DRIVER"].map(role => (
                                <button
                                    key={role}
                                    onClick={() => setFilter(role)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === role
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {role === "ALL" ? "Tous" : role}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                            {filteredUsers.length} utilisateur(s) affiché(s)
                        </p>
                    </div>

                    {/* Tableau des utilisateurs */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">ID</th>
                                    <th className="px-6 py-4 text-left font-semibold">Nom Complet</th>
                                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                                    <th className="px-6 py-4 text-left font-semibold">Rôle</th>
                                    <th className="px-6 py-4 text-left font-semibold">Statut Agence</th>
                                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-gray-500">
                                            Aucun utilisateur trouvé
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                                }`}
                                        >
                                            <td className="px-6 py-4 font-mono text-sm">{user.id}</td>
                                            <td className="px-6 py-4 font-semibold">{user.fullName}</td>
                                            <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === "ADMIN"
                                                            ? "bg-red-100 text-red-700"
                                                            : user.role === "AGENCY"
                                                                ? "bg-purple-100 text-purple-700"
                                                                : user.role === "DRIVER"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-blue-100 text-blue-700"
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${user.agencyStatus === "APPROVED"
                                                            ? "bg-green-100 text-green-700"
                                                            : user.agencyStatus === "PENDING"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : user.agencyStatus === "REJECTED"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {user.agencyStatus || "NONE"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleChangeRole(user.id, user.role)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                                                    >
                                                        Changer Rôle
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id, user.fullName)}
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
