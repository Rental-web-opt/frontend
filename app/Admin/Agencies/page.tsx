"use client";

import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { agencyService } from "@/services/api";
import api from "@/services/api";
import { Building2, Search, MapPin, Star, Trash2, Phone, Mail, Plus, X, Edit2, Globe, Clock } from "lucide-react";

interface Agency {
    id: number;
    name: string;
    city: string;
    location: string;
    description?: string;
    phone: string;
    email: string;
    website?: string;
    rating: number;
    reviewCount: number;
    open: boolean;
    openingHours?: string;
}

export default function AgenciesManagement() {
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "", city: "", location: "", description: "",
        phone: "", email: "", website: "", openingHours: "", open: true
    });

    useEffect(() => {
        fetchAgencies();
    }, []);

    const fetchAgencies = async () => {
        try {
            const response = await agencyService.getAll();
            setAgencies(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des agences", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAgency = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/agencies", formData);
            setShowAddModal(false);
            resetForm();
            fetchAgencies();
        } catch (error: any) {
            alert(error.response?.data?.message || "Erreur lors de la création");
        }
    };

    const handleEditAgency = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAgency) return;
        try {
            await api.put(`/agencies/${selectedAgency.id}`, formData);
            setShowEditModal(false);
            setSelectedAgency(null);
            resetForm();
            fetchAgencies();
        } catch (error: any) {
            alert(error.response?.data?.message || "Erreur lors de la modification");
        }
    };

    const handleDeleteAgency = async (id: number, name: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer l'agence "${name}" ?\n\nCette action est irréversible !`)) return;

        try {
            await api.delete(`/admin/agencies/${id}`);
            fetchAgencies();
        } catch (error) {
            alert("❌ Erreur lors de la suppression");
        }
    };

    const openEditModal = (agency: Agency) => {
        setSelectedAgency(agency);
        setFormData({
            name: agency.name || "",
            city: agency.city || "",
            location: agency.location || "",
            description: agency.description || "",
            phone: agency.phone || "",
            email: agency.email || "",
            website: agency.website || "",
            openingHours: agency.openingHours || "",
            open: agency.open ?? true
        });
        setShowEditModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: "", city: "", location: "", description: "",
            phone: "", email: "", website: "", openingHours: "", open: true
        });
    };

    const filteredAgencies = agencies.filter(agency =>
        agency.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const cities = [...new Set(agencies.map(a => a.city).filter(Boolean))];

    if (loading) {
        return (
            <ProtectedAdminRoute>
                <AdminLayout>
                    <div className="flex items-center justify-center h-[60vh]">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-500 font-medium">Chargement des agences...</p>
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
                                🏢 Gestion des Agences
                            </h1>
                            <p className="text-slate-500">
                                {agencies.length} agence(s) partenaire(s) • Gérez vos partenaires
                            </p>
                        </div>
                        <button
                            onClick={() => { resetForm(); setShowAddModal(true); }}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-105 transition-all"
                        >
                            <Plus size={20} /> Ajouter une agence
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-xl p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-200 text-sm font-medium">Total</p>
                                    <p className="text-3xl font-black">{agencies.length}</p>
                                </div>
                                <Building2 size={28} className="text-purple-300" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-emerald-200 text-sm font-medium">Ouvertes</p>
                                    <p className="text-3xl font-black">{agencies.filter(a => a.open).length}</p>
                                </div>
                                <Clock size={28} className="text-emerald-300" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-200 text-sm font-medium">Villes</p>
                                    <p className="text-3xl font-black">{cities.length}</p>
                                </div>
                                <MapPin size={28} className="text-blue-300" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-xl p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-200 text-sm font-medium">Note moy.</p>
                                    <p className="text-3xl font-black">
                                        {agencies.length > 0
                                            ? (agencies.reduce((sum, a) => sum + (a.rating || 0), 0) / agencies.length).toFixed(1)
                                            : "N/A"}
                                    </p>
                                </div>
                                <Star size={28} className="text-yellow-300" />
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5">
                        <div className="relative w-full lg:w-96">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom ou ville..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Agencies Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredAgencies.length === 0 ? (
                            <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-100">
                                <Building2 size={64} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-500 font-medium text-lg">Aucune agence trouvée</p>
                            </div>
                        ) : (
                            filteredAgencies.map((agency) => (
                                <div
                                    key={agency.id}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all overflow-hidden group"
                                >
                                    {/* Header */}
                                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-5 py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                                <Building2 size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg">{agency.name}</h3>
                                                <div className="flex items-center gap-1 text-purple-200 text-sm">
                                                    <MapPin size={12} /> {agency.city || "Non défini"}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-white/60 font-mono text-sm">#{agency.id}</span>
                                    </div>

                                    <div className="p-5 space-y-4">
                                        {/* Status & Rating */}
                                        <div className="flex items-center justify-between">
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${agency.open
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-red-100 text-red-700"}`}>
                                                {agency.open ? "✓ Ouvert" : "✕ Fermé"}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                                <span className="font-bold text-slate-800">{agency.rating || "N/A"}</span>
                                                <span className="text-slate-400 text-xs">({agency.reviewCount || 0})</span>
                                            </div>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="space-y-2">
                                            {agency.phone && (
                                                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                                                    <Phone size={14} className="text-slate-400" />
                                                    {agency.phone}
                                                </div>
                                            )}
                                            {agency.email && (
                                                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                                                    <Mail size={14} className="text-slate-400" />
                                                    {agency.email}
                                                </div>
                                            )}
                                            {agency.website && (
                                                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                                                    <Globe size={14} />
                                                    {agency.website}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-3 border-t border-slate-100">
                                            <button
                                                onClick={() => openEditModal(agency)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-600 hover:text-white text-purple-700 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                                            >
                                                <Edit2 size={14} /> Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAgency(agency.id, agency.name)}
                                                className="flex items-center justify-center bg-red-100 hover:bg-red-500 hover:text-white text-red-700 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* MODAL: Add Agency */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white sticky top-0">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">➕ Nouvelle Agence</h2>
                                    <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={handleAddAgency} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nom de l'agence *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                            placeholder="AutoLux Cameroun"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Ville *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                            placeholder="Douala"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Adresse</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                            placeholder="Rue Joss, Bonanjo"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                            placeholder="+237 6XX XXX XXX"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                            placeholder="contact@agence.cm"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Site web</label>
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                            placeholder="https://www.agence.cm"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Horaires d'ouverture</label>
                                        <input
                                            type="text"
                                            value={formData.openingHours}
                                            onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                            placeholder="Lun-Sam 8h-18h"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.open}
                                                onChange={(e) => setFormData({ ...formData, open: e.target.checked })}
                                                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="font-semibold text-slate-700">Agence actuellement ouverte</span>
                                        </label>
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
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
                                    >
                                        Créer l'agence
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL: Edit Agency */}
                {showEditModal && selectedAgency && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white sticky top-0">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">✏️ Modifier l'agence</h2>
                                    <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition">
                                        <X size={20} />
                                    </button>
                                </div>
                                <p className="text-blue-200 mt-1">{selectedAgency.name}</p>
                            </div>
                            <form onSubmit={handleEditAgency} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nom de l'agence *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Ville *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Adresse</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.open}
                                                onChange={(e) => setFormData({ ...formData, open: e.target.checked })}
                                                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="font-semibold text-slate-700">Agence actuellement ouverte</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
                                    >
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </ProtectedAdminRoute>
    );
}
