"use client";

import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { driverService } from "@/services/api";
import api from "@/services/api";
import { Car, Search, Star, Trash2, Phone, Mail, Plus, X, Edit2, User, Shield, Copy, CheckCircle } from "lucide-react";

interface Driver {
    id: number;
    fullName: string;
    email?: string;
    phone?: string;
    licenseNumber?: string;
    available: boolean;
    rating?: number;
    experience?: number;
}

interface GeneratedCredentials {
    email: string;
    password: string;
    driverName: string;
}

export default function DriversManagement() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [generatedCredentials, setGeneratedCredentials] = useState<GeneratedCredentials | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fullName: "", email: "", phone: "", licenseNumber: "", available: true, experience: 0
    });

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await driverService.getAll();
            setDrivers(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des chauffeurs", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 Création avec génération automatique d'identifiants
    const handleAddDriver = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            // L'endpoint POST /drivers génère automatiquement les identifiants
            const response = await api.post("/drivers", formData);

            // Récupérer les identifiants générés depuis DriverCreationResponse
            const { driver, email, generatedPassword } = response.data;

            setGeneratedCredentials({
                email: email,
                password: generatedPassword,
                driverName: formData.fullName
            });

            setShowAddModal(false);
            setShowCredentialsModal(true);
            resetForm();
            fetchDrivers();
        } catch (error: any) {
            alert(error.response?.data?.message || "Erreur lors de la création du chauffeur");
        } finally {
            setIsCreating(false);
        }
    };

    const handleEditDriver = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDriver) return;
        try {
            await api.put(`/drivers/${selectedDriver.id}`, formData);
            setShowEditModal(false);
            setSelectedDriver(null);
            resetForm();
            fetchDrivers();
        } catch (error: any) {
            alert(error.response?.data?.message || "Erreur lors de la modification");
        }
    };

    const handleDeleteDriver = async (id: number, name: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer le chauffeur "${name}" ?`)) return;

        try {
            await api.delete(`/drivers/${id}`);
            fetchDrivers();
        } catch (error) {
            alert("❌ Erreur lors de la suppression");
        }
    };

    const handleToggleAvailability = async (driver: Driver) => {
        try {
            await api.put(`/drivers/${driver.id}`, { ...driver, available: !driver.available });
            fetchDrivers();
        } catch (error) {
            alert("❌ Erreur lors de la mise à jour");
        }
    };

    const openEditModal = (driver: Driver) => {
        setSelectedDriver(driver);
        setFormData({
            fullName: driver.fullName || "",
            email: driver.email || "",
            phone: driver.phone || "",
            licenseNumber: driver.licenseNumber || "",
            available: driver.available ?? true,
            experience: driver.experience || 0
        });
        setShowEditModal(true);
    };

    const resetForm = () => {
        setFormData({
            fullName: "", email: "", phone: "", licenseNumber: "", available: true, experience: 0
        });
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const filteredDrivers = drivers.filter(driver =>
        driver.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <ProtectedAdminRoute>
                <AdminLayout>
                    <div className="flex items-center justify-center h-[60vh]">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-[#002AD7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-500 font-medium">Chargement des chauffeurs...</p>
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
                                🚗 Gestion des Chauffeurs
                            </h1>
                            <p className="text-slate-500">
                                {drivers.length} chauffeur(s) • Gérez votre équipe de conducteurs
                            </p>
                        </div>
                        <button
                            onClick={() => { resetForm(); setShowAddModal(true); }}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#002AD7] to-[#0044ff] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all"
                        >
                            <Plus size={20} /> Ajouter un chauffeur
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-[#002AD7] to-[#0044ff] rounded-2xl shadow-xl p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-200 text-sm font-medium">Total</p>
                                    <p className="text-3xl font-black">{drivers.length}</p>
                                </div>
                                <Car size={28} className="text-blue-300" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-emerald-200 text-sm font-medium">Disponibles</p>
                                    <p className="text-3xl font-black">{drivers.filter(d => d.available).length}</p>
                                </div>
                                <Shield size={28} className="text-emerald-300" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-200 text-sm font-medium">En service</p>
                                    <p className="text-3xl font-black">{drivers.filter(d => !d.available).length}</p>
                                </div>
                                <User size={28} className="text-orange-300" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-xl p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-200 text-sm font-medium">Note moy.</p>
                                    <p className="text-3xl font-black">
                                        {drivers.length > 0
                                            ? (drivers.reduce((sum, d) => sum + (d.rating || 4.5), 0) / drivers.length).toFixed(1)
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
                                placeholder="Rechercher par nom ou téléphone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#002AD7] focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Drivers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredDrivers.length === 0 ? (
                            <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-100">
                                <Car size={64} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-500 font-medium text-lg">Aucun chauffeur trouvé</p>
                            </div>
                        ) : (
                            filteredDrivers.map((driver) => (
                                <div
                                    key={driver.id}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all overflow-hidden"
                                >
                                    {/* Header */}
                                    <div className={`px-5 py-4 flex items-center justify-between ${driver.available ? 'bg-gradient-to-r from-[#002AD7] to-[#0044ff]' : 'bg-gradient-to-r from-slate-500 to-slate-700'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                                                {driver.fullName?.charAt(0).toUpperCase() || "?"}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg">{driver.fullName}</h3>
                                                <div className="flex items-center gap-1 text-white/80 text-sm">
                                                    <Star size={12} fill="currentColor" /> {driver.rating || 4.5}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-white/60 font-mono text-sm">#{driver.id}</span>
                                    </div>

                                    <div className="p-5 space-y-4">
                                        {/* Status */}
                                        <div className="flex items-center justify-between">
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${driver.available
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-slate-100 text-slate-700"}`}>
                                                {driver.available ? "✓ Disponible" : "⏳ En service"}
                                            </span>
                                            <button
                                                onClick={() => handleToggleAvailability(driver)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${driver.available
                                                    ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                                                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}
                                            >
                                                {driver.available ? "Marquer occupé" : "Marquer disponible"}
                                            </button>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="space-y-2">
                                            {driver.phone && (
                                                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                                                    <Phone size={14} className="text-slate-400" />
                                                    {driver.phone}
                                                </div>
                                            )}
                                            {driver.email && (
                                                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                                                    <Mail size={14} className="text-slate-400" />
                                                    {driver.email}
                                                </div>
                                            )}
                                            {driver.licenseNumber && (
                                                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                                                    <Shield size={14} />
                                                    Permis: {driver.licenseNumber}
                                                </div>
                                            )}
                                        </div>

                                        {/* Experience */}
                                        {driver.experience && (
                                            <div className="text-center p-3 bg-blue-50 rounded-xl">
                                                <p className="text-2xl font-black text-[#002AD7]">{driver.experience}</p>
                                                <p className="text-xs text-blue-700 font-bold">années d'expérience</p>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-3 border-t border-slate-100">
                                            <button
                                                onClick={() => openEditModal(driver)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-blue-100 hover:bg-[#002AD7] hover:text-white text-blue-700 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                                            >
                                                <Edit2 size={14} /> Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDriver(driver.id, driver.fullName)}
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

                {/* MODAL: Add Driver */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                            <div className="bg-gradient-to-r from-[#002AD7] to-[#0044ff] p-6 text-white sticky top-0">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">➕ Nouveau Chauffeur</h2>
                                    <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition">
                                        <X size={20} />
                                    </button>
                                </div>
                                <p className="text-blue-200 text-sm mt-2">
                                    💡 Des identifiants de connexion seront générés automatiquement
                                </p>
                            </div>
                            <form onSubmit={handleAddDriver} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nom complet *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002AD7] outline-none"
                                        placeholder="Jean-Pierre Mbarga"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002AD7] outline-none"
                                            placeholder="+237 6XX XXX XXX"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email de contact</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002AD7] outline-none"
                                            placeholder="chauffeur@email.cm"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">N° Permis *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.licenseNumber}
                                            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002AD7] outline-none"
                                            placeholder="ABC123456"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Expérience (années)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002AD7] outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.available}
                                            onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                            className="w-5 h-5 rounded text-[#002AD7] focus:ring-[#002AD7]"
                                        />
                                        <span className="font-semibold text-slate-700">Disponible immédiatement</span>
                                    </label>
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
                                        disabled={isCreating}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-[#002AD7] to-[#0044ff] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50"
                                    >
                                        {isCreating ? "Création..." : "Créer"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL: Generated Credentials */}
                {showCredentialsModal && generatedCredentials && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white rounded-t-3xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">✅ Chauffeur créé !</h2>
                                        <p className="text-emerald-100 text-sm">{generatedCredentials.driverName}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <p className="text-amber-800 text-sm font-medium">
                                        ⚠️ Important : Notez ces identifiants de connexion. Ils ne seront plus affichés !
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <label className="block text-xs font-bold text-slate-500 mb-1">EMAIL DE CONNEXION</label>
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-slate-800">{generatedCredentials.email}</span>
                                            <button
                                                onClick={() => copyToClipboard(generatedCredentials.email, 'email')}
                                                className="p-2 hover:bg-slate-200 rounded-lg transition"
                                            >
                                                {copiedField === 'email' ? <CheckCircle size={18} className="text-emerald-500" /> : <Copy size={18} className="text-slate-400" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <label className="block text-xs font-bold text-slate-500 mb-1">MOT DE PASSE</label>
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-slate-800">{generatedCredentials.password}</span>
                                            <button
                                                onClick={() => copyToClipboard(generatedCredentials.password, 'password')}
                                                className="p-2 hover:bg-slate-200 rounded-lg transition"
                                            >
                                                {copiedField === 'password' ? <CheckCircle size={18} className="text-emerald-500" /> : <Copy size={18} className="text-slate-400" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setShowCredentialsModal(false); setGeneratedCredentials(null); }}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-[#002AD7] to-[#0044ff] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
                                >
                                    J'ai noté les identifiants
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: Edit Driver */}
                {showEditModal && selectedDriver && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white sticky top-0">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">✏️ Modifier le chauffeur</h2>
                                    <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition">
                                        <X size={20} />
                                    </button>
                                </div>
                                <p className="text-blue-200 mt-1">{selectedDriver.fullName}</p>
                            </div>
                            <form onSubmit={handleEditDriver} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nom complet *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
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
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">N° Permis</label>
                                        <input
                                            type="text"
                                            value={formData.licenseNumber}
                                            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Expérience (années)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.available}
                                            onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                            className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="font-semibold text-slate-700">Disponible</span>
                                    </label>
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
