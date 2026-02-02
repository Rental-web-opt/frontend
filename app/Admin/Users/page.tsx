"use client";

import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import api, { userService } from "@/services/api";
import { Users, Search, Shield, UserX, UserCheck, Filter, Plus, X, Eye, EyeOff, Key, ChevronDown, Mail, Phone, Edit2, Trash2, MoreVertical, User, Building, Car } from "lucide-react";

interface UserType {
    id: number;
    fullName: string;
    email: string;
    role: string;
    phone?: string;
    createdAt?: string;
}

const ROLES = [
    { value: "USER", label: "Utilisateur", color: "bg-blue-100 text-blue-700 border-blue-200", icon: User },
    { value: "ADMIN", label: "Administrateur", color: "bg-red-100 text-red-700 border-red-200", icon: Shield },
    { value: "AGENCY", label: "Agence", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Building },
    { value: "DRIVER", label: "Chauffeur", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: Car },
];

export default function UsersManagement() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

    // Form states
    const [newUser, setNewUser] = useState({ fullName: "", email: "", password: "", role: "USER", phone: "" });
    const [newRole, setNewRole] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await userService.getAll();
            setUsers(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/auth/register", newUser);
            setShowAddModal(false);
            setNewUser({ fullName: "", email: "", password: "", role: "USER", phone: "" });
            fetchUsers();
        } catch (error: any) {
            alert(error.response?.data?.message || "Erreur lors de la création");
        }
    };

    const handleDeleteUser = async (id: number, name: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) return;
        try {
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (error) {
            alert("❌ Erreur lors de la suppression");
        }
    };

    const handleChangeRole = async () => {
        if (!selectedUser || !newRole) return;
        try {
            await api.put(`/admin/users/${selectedUser.id}/role`, { role: newRole });
            setShowRoleModal(false);
            setSelectedUser(null);
            setNewRole("");
            fetchUsers();
        } catch (error) {
            alert("❌ Erreur lors de la modification du rôle");
        }
    };

    const handleResetPassword = async () => {
        if (!selectedUser || !newPassword) return;
        try {
            await api.put(`/admin/users/${selectedUser.id}/password`, { password: newPassword });
            setShowPasswordModal(false);
            setSelectedUser(null);
            setNewPassword("");
            alert("✅ Mot de passe réinitialisé avec succès !");
        } catch (error) {
            alert("❌ Erreur lors de la réinitialisation");
        }
    };

    const openRoleModal = (user: UserType) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setShowRoleModal(true);
    };

    const openPasswordModal = (user: UserType) => {
        setSelectedUser(user);
        setNewPassword("");
        setShowPasswordModal(true);
    };

    const filteredUsers = users.filter(user => {
        const matchesFilter = filter === "ALL" || user.role === filter;
        const matchesSearch = user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getRoleConfig = (role: string) => ROLES.find(r => r.value === role) || ROLES[0];

    if (loading) {
        return (
            <ProtectedAdminRoute>
                <AdminLayout>
                    <div className="flex items-center justify-center h-[60vh]">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-[#002AD7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-500 font-medium">Chargement des utilisateurs...</p>
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
                                👥 Gestion des Utilisateurs
                            </h1>
                            <p className="text-slate-500">
                                {users.length} utilisateur(s) • Gérez les comptes et les rôles
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#002AD7] to-[#0044ff] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all"
                        >
                            <Plus size={20} /> Ajouter un utilisateur
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ROLES.map(role => {
                            const count = users.filter(u => u.role === role.value).length;
                            const Icon = role.icon;
                            return (
                                <div key={role.value} className={`p-4 rounded-2xl border-2 ${role.color} flex items-center gap-3`}>
                                    <div className="w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center">
                                        <Icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black">{count}</p>
                                        <p className="text-sm font-semibold opacity-75">{role.label}s</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Filters & Search */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full lg:w-96">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom ou email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#002AD7] focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Filter size={18} className="text-slate-400" />
                                {["ALL", ...ROLES.map(r => r.value)].map(role => (
                                    <button
                                        key={role}
                                        onClick={() => setFilter(role)}
                                        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${filter === role
                                            ? "bg-[#002AD7] text-white shadow-lg shadow-blue-500/30"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                    >
                                        {role === "ALL" ? "Tous" : role}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Users Grid - Card Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredUsers.length === 0 ? (
                            <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-100">
                                <UserX size={64} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-500 font-medium text-lg">Aucun utilisateur trouvé</p>
                            </div>
                        ) : (
                            filteredUsers.map((user) => {
                                const roleConfig = getRoleConfig(user.role);
                                const Icon = roleConfig.icon;
                                return (
                                    <div
                                        key={user.id}
                                        className="bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all p-5 group"
                                    >
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-14 h-14 bg-gradient-to-br from-[#002AD7] to-[#0044ff] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
                                                    {user.fullName?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-lg">{user.fullName}</h3>
                                                    <p className="text-sm text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-mono text-slate-400">#{user.id}</span>
                                        </div>

                                        {/* Role Badge */}
                                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold border ${roleConfig.color} mb-4`}>
                                            <Icon size={16} />
                                            {roleConfig.label}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-4 border-t border-slate-100">
                                            <button
                                                onClick={() => openRoleModal(user)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-[#002AD7] hover:text-white text-slate-700 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                                            >
                                                <Edit2 size={14} /> Rôle
                                            </button>
                                            <button
                                                onClick={() => openPasswordModal(user)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-orange-100 hover:bg-orange-500 hover:text-white text-orange-700 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                                            >
                                                <Key size={14} /> Mot de passe
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id, user.fullName)}
                                                className="flex items-center justify-center bg-red-100 hover:bg-red-500 hover:text-white text-red-700 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* MODAL: Add User */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="bg-gradient-to-r from-[#002AD7] to-[#0044ff] p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">➕ Nouvel Utilisateur</h2>
                                    <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={handleAddUser} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nom complet</label>
                                    <input
                                        type="text"
                                        required
                                        value={newUser.fullName}
                                        onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002AD7] outline-none"
                                        placeholder="Jean Dupont"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002AD7] outline-none"
                                        placeholder="jean@exemple.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Mot de passe</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002AD7] outline-none pr-12"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Rôle</label>
                                    <div className="relative">
                                        <select
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002AD7] outline-none appearance-none cursor-pointer"
                                        >
                                            {ROLES.map(role => (
                                                <option key={role.value} value={role.value}>{role.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-[#002AD7] to-[#0044ff] text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl transition"
                                    >
                                        Créer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL: Change Role */}
                {showRoleModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">🔄 Modifier le rôle</h2>
                                    <button onClick={() => setShowRoleModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition">
                                        <X size={20} />
                                    </button>
                                </div>
                                <p className="text-purple-200 mt-2">{selectedUser.fullName}</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nouveau rôle</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {ROLES.map(role => {
                                        const Icon = role.icon;
                                        return (
                                            <button
                                                key={role.value}
                                                type="button"
                                                onClick={() => setNewRole(role.value)}
                                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${newRole === role.value
                                                    ? "border-[#002AD7] bg-blue-50 ring-2 ring-[#002AD7]"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                            >
                                                <Icon size={24} className={newRole === role.value ? "text-[#002AD7]" : "text-slate-400"} />
                                                <span className={`font-semibold text-sm ${newRole === role.value ? "text-[#002AD7]" : "text-slate-600"}`}>
                                                    {role.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowRoleModal(false)}
                                        className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleChangeRole}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
                                    >
                                        Confirmer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: Reset Password */}
                {showPasswordModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-700 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">🔑 Réinitialiser le mot de passe</h2>
                                    <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition">
                                        <X size={20} />
                                    </button>
                                </div>
                                <p className="text-orange-200 mt-2">{selectedUser.fullName}</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nouveau mot de passe</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none pr-12"
                                            placeholder="Nouveau mot de passe"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowPasswordModal(false)}
                                        className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleResetPassword}
                                        disabled={!newPassword}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50"
                                    >
                                        Réinitialiser
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </ProtectedAdminRoute>
    );
}
