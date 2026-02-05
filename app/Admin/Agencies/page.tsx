"use client";

import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { agencyService } from "@/services/api";
import api from "@/services/api";
import { Building2, Search, MapPin, Star, Trash2, Phone, Mail, Plus, X, Edit2, Globe, Clock, Copy, CheckCircle } from "lucide-react";

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

interface GeneratedCredentials {
    email: string;
    password: string;
    agencyName: string;
}

export default function AgenciesManagement() {
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
    const [generatedCredentials, setGeneratedCredentials] = useState<GeneratedCredentials | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Jours de la semaine
    const DAYS = [
        { key: 'lun', label: 'Lun', full: 'Lundi' },
        { key: 'mar', label: 'Mar', full: 'Mardi' },
        { key: 'mer', label: 'Mer', full: 'Mercredi' },
        { key: 'jeu', label: 'Jeu', full: 'Jeudi' },
        { key: 'ven', label: 'Ven', full: 'Vendredi' },
        { key: 'sam', label: 'Sam', full: 'Samedi' },
        { key: 'dim', label: 'Dim', full: 'Dimanche' }
    ];

    // État des horaires d'ouverture structurés
    const [openingSchedule, setOpeningSchedule] = useState<{
        [key: string]: { isOpen: boolean; openTime: string; closeTime: string }
    }>({
        lun: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
        mar: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
        mer: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
        jeu: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
        ven: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
        sam: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
        dim: { isOpen: false, openTime: '08:00', closeTime: '18:00' }
    });

    // Form state
    const [formData, setFormData] = useState({
        name: "", city: "", location: "", description: "",
        phone: "", email: "", website: "", openingHours: "", open: true
    });

    // Fonction pour formater les horaires en chaîne lisible et JSON
    const formatOpeningHours = () => {
        const schedule = openingSchedule;
        const parts: string[] = [];

        // Grouper les jours consécutifs avec les mêmes horaires
        let i = 0;
        while (i < DAYS.length) {
            const day = DAYS[i];
            const daySchedule = schedule[day.key];

            if (!daySchedule.isOpen) {
                i++;
                continue;
            }

            // Trouver les jours consécutifs avec les mêmes horaires
            let j = i + 1;
            while (j < DAYS.length) {
                const nextDay = DAYS[j];
                const nextSchedule = schedule[nextDay.key];
                if (nextSchedule.isOpen &&
                    nextSchedule.openTime === daySchedule.openTime &&
                    nextSchedule.closeTime === daySchedule.closeTime) {
                    j++;
                } else {
                    break;
                }
            }

            // Créer la chaîne
            if (j - i > 1) {
                // Plusieurs jours consécutifs
                parts.push(`${DAYS[i].label}-${DAYS[j - 1].label} ${daySchedule.openTime}-${daySchedule.closeTime}`);
            } else {
                // Un seul jour
                parts.push(`${day.label} ${daySchedule.openTime}-${daySchedule.closeTime}`);
            }

            i = j;
        }

        return parts.join(', ') || 'Fermé';
    };

    // Convertir le JSON en schedule
    const parseOpeningHours = (hoursString: string) => {
        try {
            // Essayer de parser comme JSON d'abord
            if (hoursString.startsWith('{')) {
                return JSON.parse(hoursString);
            }
        } catch (e) {
            // Sinon, retourner le schedule par défaut
        }
        return {
            lun: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
            mar: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
            mer: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
            jeu: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
            ven: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
            sam: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
            dim: { isOpen: false, openTime: '08:00', closeTime: '18:00' }
        };
    };

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

    // 🔥 Création avec génération automatique d'identifiants
    const handleAddAgency = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            // Préparer les données avec les horaires structurés
            const dataToSubmit = {
                ...formData,
                openingHours: JSON.stringify(openingSchedule) // Stocker en JSON pour parsing futur
            };

            // L'endpoint POST /agencies génère automatiquement les identifiants
            const response = await api.post("/agencies", dataToSubmit);

            // Récupérer les identifiants générés depuis AgencyCreationResponse
            const { agency, email, generatedPassword } = response.data;

            setGeneratedCredentials({
                email: email,
                password: generatedPassword,
                agencyName: formData.name
            });

            setShowAddModal(false);
            setShowCredentialsModal(true);
            resetForm();
            fetchAgencies();
        } catch (error: any) {
            alert(error.response?.data?.message || "Erreur lors de la création de l'agence");
        } finally {
            setIsCreating(false);
        }
    };

    const handleEditAgency = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAgency) return;
        try {
            // Préparer les données avec les horaires structurés
            const dataToSubmit = {
                ...formData,
                openingHours: JSON.stringify(openingSchedule)
            };
            await api.put(`/agencies/${selectedAgency.id}`, dataToSubmit);
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
        // Parser les horaires existants
        setOpeningSchedule(parseOpeningHours(agency.openingHours || ""));
        setShowEditModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: "", city: "", location: "", description: "",
            phone: "", email: "", website: "", openingHours: "", open: true
        });
        setOpeningSchedule({
            lun: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
            mar: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
            mer: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
            jeu: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
            ven: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
            sam: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
            dim: { isOpen: false, openTime: '08:00', closeTime: '18:00' }
        });
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
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
                            <div className="w-16 h-16 border-4 border-[#002AD7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
                            className="flex items-center gap-2 bg-gradient-to-r from-[#002AD7] to-[#0044ff] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all"
                        >
                            <Plus size={20} /> Ajouter une agence
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-[#002AD7] to-[#0044ff] rounded-2xl shadow-xl p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-200 text-sm font-medium">Total</p>
                                    <p className="text-3xl font-black">{agencies.length}</p>
                                </div>
                                <Building2 size={28} className="text-blue-300" />
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
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#002AD7] focus:border-transparent outline-none transition-all"
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
                                    <div className="bg-gradient-to-r from-[#002AD7] to-[#0044ff] px-5 py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                                <Building2 size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg">{agency.name}</h3>
                                                <div className="flex items-center gap-1 text-blue-200 text-sm">
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
                                                className="flex-1 flex items-center justify-center gap-2 bg-blue-100 hover:bg-[#002AD7] hover:text-white text-blue-700 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
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
                            <div className="bg-gradient-to-r from-[#002AD7] to-[#0044ff] p-6 text-white sticky top-0">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">➕ Nouvelle Agence</h2>
                                    <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition">
                                        <X size={20} />
                                    </button>
                                </div>
                                <p className="text-blue-200 text-sm mt-2">
                                    💡 Des identifiants de connexion seront générés automatiquement
                                </p>
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
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002AD7] outline-none"
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
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002AD7] outline-none"
                                            placeholder="Douala"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Adresse</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002AD7] outline-none"
                                            placeholder="Rue Joss, Bonanjo"
                                        />
                                    </div>
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
                                            placeholder="contact@agence.cm"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Site web</label>
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002AD7] outline-none"
                                            placeholder="https://www.agence.cm"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-3">
                                            <Clock className="inline-block mr-2" size={16} />
                                            Horaires d'ouverture *
                                        </label>

                                        {/* Aperçu des horaires */}
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                                            <p className="text-sm text-blue-800 font-medium">
                                                📅 {formatOpeningHours()}
                                            </p>
                                        </div>

                                        {/* Sélection par jour */}
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {DAYS.map((day) => (
                                                <div
                                                    key={day.key}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${openingSchedule[day.key]?.isOpen
                                                        ? 'bg-white border-[#002AD7]/20'
                                                        : 'bg-slate-50 border-slate-200'
                                                        }`}
                                                >
                                                    {/* Toggle jour */}
                                                    <label className="flex items-center gap-2 cursor-pointer min-w-[100px]">
                                                        <input
                                                            type="checkbox"
                                                            checked={openingSchedule[day.key]?.isOpen || false}
                                                            onChange={(e) => setOpeningSchedule(prev => ({
                                                                ...prev,
                                                                [day.key]: { ...prev[day.key], isOpen: e.target.checked }
                                                            }))}
                                                            className="w-4 h-4 rounded text-[#002AD7] focus:ring-[#002AD7]"
                                                        />
                                                        <span className={`font-semibold text-sm ${openingSchedule[day.key]?.isOpen ? 'text-slate-800' : 'text-slate-400'
                                                            }`}>
                                                            {day.full}
                                                        </span>
                                                    </label>

                                                    {/* Horaires si ouvert */}
                                                    {openingSchedule[day.key]?.isOpen && (
                                                        <div className="flex items-center gap-2 flex-1">
                                                            <input
                                                                type="time"
                                                                value={openingSchedule[day.key]?.openTime || '08:00'}
                                                                onChange={(e) => setOpeningSchedule(prev => ({
                                                                    ...prev,
                                                                    [day.key]: { ...prev[day.key], openTime: e.target.value }
                                                                }))}
                                                                className="px-2 py-1 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002AD7] outline-none"
                                                            />
                                                            <span className="text-slate-400">→</span>
                                                            <input
                                                                type="time"
                                                                value={openingSchedule[day.key]?.closeTime || '18:00'}
                                                                onChange={(e) => setOpeningSchedule(prev => ({
                                                                    ...prev,
                                                                    [day.key]: { ...prev[day.key], closeTime: e.target.value }
                                                                }))}
                                                                className="px-2 py-1 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002AD7] outline-none"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Badge fermé */}
                                                    {!openingSchedule[day.key]?.isOpen && (
                                                        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                                                            Fermé
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Boutons rapides */}
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                type="button"
                                                onClick={() => setOpeningSchedule({
                                                    lun: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
                                                    mar: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
                                                    mer: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
                                                    jeu: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
                                                    ven: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
                                                    sam: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
                                                    dim: { isOpen: false, openTime: '08:00', closeTime: '18:00' }
                                                })}
                                                className="flex-1 px-3 py-2 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
                                            >
                                                Lun-Sam 8h-18h
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setOpeningSchedule({
                                                    lun: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
                                                    mar: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
                                                    mer: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
                                                    jeu: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
                                                    ven: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
                                                    sam: { isOpen: true, openTime: '09:00', closeTime: '13:00' },
                                                    dim: { isOpen: false, openTime: '09:00', closeTime: '19:00' }
                                                })}
                                                className="flex-1 px-3 py-2 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
                                            >
                                                Lun-Ven 9h-19h
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setOpeningSchedule({
                                                    lun: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
                                                    mar: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
                                                    mer: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
                                                    jeu: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
                                                    ven: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
                                                    sam: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
                                                    dim: { isOpen: true, openTime: '00:00', closeTime: '23:59' }
                                                })}
                                                className="flex-1 px-3 py-2 text-xs font-medium bg-[#002AD7]/10 text-[#002AD7] rounded-lg hover:bg-[#002AD7]/20 transition"
                                            >
                                                24h/24 7j/7
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.open}
                                                onChange={(e) => setFormData({ ...formData, open: e.target.checked })}
                                                className="w-5 h-5 rounded text-[#002AD7] focus:ring-[#002AD7]"
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
                                        disabled={isCreating}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-[#002AD7] to-[#0044ff] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50"
                                    >
                                        {isCreating ? "Création..." : "Créer l'agence"}
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
                                        <h2 className="text-xl font-bold">✅ Agence créée !</h2>
                                        <p className="text-emerald-100 text-sm">{generatedCredentials.agencyName}</p>
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

                                    {/* Horaires d'ouverture structurés */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-3">
                                            <Clock className="inline-block mr-2" size={16} />
                                            Horaires d'ouverture
                                        </label>

                                        {/* Aperçu des horaires */}
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                                            <p className="text-sm text-blue-800 font-medium">
                                                📅 {formatOpeningHours()}
                                            </p>
                                        </div>

                                        {/* Sélection par jour */}
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {DAYS.map((day) => (
                                                <div
                                                    key={day.key}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${openingSchedule[day.key]?.isOpen
                                                            ? 'bg-white border-blue-200'
                                                            : 'bg-slate-50 border-slate-200'
                                                        }`}
                                                >
                                                    {/* Toggle jour */}
                                                    <label className="flex items-center gap-2 cursor-pointer min-w-[100px]">
                                                        <input
                                                            type="checkbox"
                                                            checked={openingSchedule[day.key]?.isOpen || false}
                                                            onChange={(e) => setOpeningSchedule(prev => ({
                                                                ...prev,
                                                                [day.key]: { ...prev[day.key], isOpen: e.target.checked }
                                                            }))}
                                                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className={`font-semibold text-sm ${openingSchedule[day.key]?.isOpen ? 'text-slate-800' : 'text-slate-400'
                                                            }`}>
                                                            {day.full}
                                                        </span>
                                                    </label>

                                                    {/* Horaires si ouvert */}
                                                    {openingSchedule[day.key]?.isOpen && (
                                                        <div className="flex items-center gap-2 flex-1">
                                                            <input
                                                                type="time"
                                                                value={openingSchedule[day.key]?.openTime || '08:00'}
                                                                onChange={(e) => setOpeningSchedule(prev => ({
                                                                    ...prev,
                                                                    [day.key]: { ...prev[day.key], openTime: e.target.value }
                                                                }))}
                                                                className="px-2 py-1 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                            />
                                                            <span className="text-slate-400">→</span>
                                                            <input
                                                                type="time"
                                                                value={openingSchedule[day.key]?.closeTime || '18:00'}
                                                                onChange={(e) => setOpeningSchedule(prev => ({
                                                                    ...prev,
                                                                    [day.key]: { ...prev[day.key], closeTime: e.target.value }
                                                                }))}
                                                                className="px-2 py-1 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Badge fermé */}
                                                    {!openingSchedule[day.key]?.isOpen && (
                                                        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                                                            Fermé
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Boutons rapides */}
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                type="button"
                                                onClick={() => setOpeningSchedule({
                                                    lun: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
                                                    mar: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
                                                    mer: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
                                                    jeu: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
                                                    ven: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
                                                    sam: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
                                                    dim: { isOpen: false, openTime: '08:00', closeTime: '18:00' }
                                                })}
                                                className="flex-1 px-3 py-2 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
                                            >
                                                Lun-Sam 8h-18h
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setOpeningSchedule({
                                                    lun: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
                                                    mar: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
                                                    mer: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
                                                    jeu: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
                                                    ven: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
                                                    sam: { isOpen: true, openTime: '00:00', closeTime: '23:59' },
                                                    dim: { isOpen: true, openTime: '00:00', closeTime: '23:59' }
                                                })}
                                                className="flex-1 px-3 py-2 text-xs font-medium bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                                            >
                                                24h/24 7j/7
                                            </button>
                                        </div>
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
