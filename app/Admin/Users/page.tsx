"use client";

import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { adminService } from "@/services/api";
import api from "@/services/api";
import {
    Users, Search, Filter, Shield, User,
    MoreHorizontal, CheckCircle, Mail, Calendar,
    Trash2, KeyRound, X, AlertTriangle
} from "lucide-react";

interface UserType {
    id: number;
    email: string;
    fullName: string;
    role: "USER" | "ADMIN" | "AGENCY" | "DRIVER";
    createdAt?: string;
    active?: boolean;
}

export default function UsersManagement() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState("ALL");

    // Modal states
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [generatingPass, setGeneratingPass] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await adminService.getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error("Erreur chargement utilisateurs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm("⚠️ Êtes-vous sûr de vouloir supprimer cet utilisateur ?\nCette action supprimera également toutes ses données associées (réservations, agence, etc.).")) return;

        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
            alert("Utilisateur supprimé avec succès.");
        } catch (error) {
            alert("Erreur lors de la suppression.");
        }
    };

    const handleResetPassword = async () => {
        if (!selectedUser || !newPassword) return;

        try {
            await api.put(`/admin/users/${selectedUser.id}/password`, { password: newPassword });
            setShowPasswordModal(false);
            alert(`Mot de passe modifie pour ${selectedUser.fullName}`);
            setNewPassword("");
            setSelectedUser(null);
        } catch (error) {
            alert("Erreur lors de la réinitialisation du mot de passe.");
        }
    };

    const generateRandomPassword = () => {
        setGeneratingPass(true);
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        let pass = "";
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewPassword(pass);
        setGeneratingPass(false);
    };

    const openPasswordModal = (user: UserType) => {
        setSelectedUser(user);
        setNewPassword("");
        setShowPasswordModal(true);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = filterRole === "ALL" || user.role === filterRole;

        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "ADMIN":
                return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Shield size={12} /> ADMIN</span>;
            case "AGENCY":
                return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Users size={12} /> AGENCE</span>;
            case "DRIVER":
                return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><User size={12} /> CHAUFFEUR</span>;
            default:
                return <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><User size={12} /> UTILISATEUR</span>;
        }
    };

    if (loading) {
        return (
            <ProtectedAdminRoute>
                <AdminLayout>
                    <div className="flex items-center justify-center h-[60vh]">
                        <div className="w-16 h-16 border-4 border-[#002AD7] border-t-transparent rounded-full animate-spin"></div>
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
                            <h1 className="text-3xl font-black text-slate-900 mb-1">👥 Gestion Utilisateurs</h1>
                            <p className="text-slate-500">{users.length} comptes enregistrés</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="bg-[#002AD7]/10 text-[#002AD7] px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                                <Users size={20} /> Total: {users.length}
                            </div>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom ou email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002AD7] transition-all"
                                />
                            </div>
                            <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto">
                                {["ALL", "USER", "AGENCY", "DRIVER", "ADMIN"].map(role => (
                                    <button
                                        key={role}
                                        onClick={() => setFilterRole(role)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filterRole === role ? "bg-white text-[#002AD7] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                    >
                                        {role === "ALL" ? "Tous" : role}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tableau Utilisateurs */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Utilisateur</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rôle</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date d'inscription</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                Aucun utilisateur trouvé
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#002AD7] to-[#0044ff] text-white flex items-center justify-center font-bold text-lg">
                                                            {user.fullName?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">{user.fullName}</p>
                                                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                                                <Mail size={12} /> {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getRoleBadge(user.role)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                                                        <Calendar size={14} className="text-slate-400" />
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : "N/A"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                        Actif
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openPasswordModal(user)}
                                                            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-[#002AD7] transition-all"
                                                            title="Réinitialiser mot de passe"
                                                        >
                                                            <KeyRound size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-500 hover:text-red-700 transition-all"
                                                            title="Supprimer l'utilisateur"
                                                        >
                                                            <Trash2 size={18} />
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

                {/* Password Modal */}
                {showPasswordModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
                            <div className="bg-[#002AD7] p-6 text-white text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <KeyRound size={32} />
                                </div>
                                <h2 className="text-xl font-bold">Réinitialisation Mot de Passe</h2>
                                <p className="text-blue-200 text-sm mt-1">Pour {selectedUser.fullName}</p>
                            </div>

                            <div className="p-6">
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex gap-3">
                                    <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
                                    <p className="text-sm text-yellow-700">
                                        Cette action modifiera immédiatement le mot de passe de l'utilisateur. Assurez-vous de lui communiquer le nouveau mot de passe.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nouveau mot de passe</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002AD7] outline-none font-mono"
                                                placeholder="Entrez ou générez..."
                                            />
                                            <button
                                                onClick={generateRandomPassword}
                                                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                                                title="Générer aléatoirement"
                                            >
                                                🎲
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() => setShowPasswordModal(false)}
                                            className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={handleResetPassword}
                                            disabled={!newPassword}
                                            className="flex-1 py-3 bg-[#002AD7] text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Confirmer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </ProtectedAdminRoute>
    );
}
