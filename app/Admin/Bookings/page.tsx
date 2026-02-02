"use client";

import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { adminService } from "@/services/api";
import api from "@/services/api";
import { CalendarCheck, Search, Filter, Car, User, Trash2, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, ChevronDown, X, Eye, Calendar, MapPin } from "lucide-react";

interface Booking {
    id: number;
    userId?: number;
    user?: {
        id: number;
        fullName: string;
        email: string;
    };
    car?: {
        id: number;
        name: string;
        brand: string;
        image?: string;
    };
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    rentalType?: string;
    withDriver: boolean;
    createdAt?: string;
}

const STATUSES = [
    { value: "PENDING", label: "En attente", color: "bg-yellow-100 text-yellow-700 border-yellow-300", bgCard: "from-yellow-500 to-amber-600", icon: Clock },
    { value: "CONFIRMED", label: "Confirmée", color: "bg-emerald-100 text-emerald-700 border-emerald-300", bgCard: "from-emerald-500 to-emerald-600", icon: CheckCircle },
    { value: "COMPLETED", label: "Terminée", color: "bg-blue-100 text-blue-700 border-blue-300", bgCard: "from-blue-500 to-blue-600", icon: CheckCircle },
    { value: "CANCELLED", label: "Annulée", color: "bg-red-100 text-red-700 border-red-300", bgCard: "from-red-500 to-red-600", icon: XCircle },
];

export default function BookingsManagement() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [newStatus, setNewStatus] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await adminService.getAllBookings();
            setBookings(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des réservations", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBooking = async (id: number) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer cette réservation #${id} ?\n\nCette action est irréversible !`)) return;

        try {
            await api.delete(`/admin/bookings/${id}`);
            fetchBookings();
        } catch (error) {
            alert("❌ Erreur lors de la suppression");
        }
    };

    const openStatusModal = (booking: Booking) => {
        setSelectedBooking(booking);
        setNewStatus(booking.status);
        setShowStatusModal(true);
    };

    const openDetailsModal = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowDetailsModal(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedBooking) return;
        try {
            await api.put(`/admin/bookings/${selectedBooking.id}/status`, { status: newStatus });
            setShowStatusModal(false);
            setSelectedBooking(null);
            fetchBookings();
        } catch (error) {
            alert("❌ Erreur lors de la modification du statut");
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = filter === "ALL" || booking.status === filter;
        const matchesSearch =
            booking.car?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(booking.id).includes(searchQuery);
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === "CONFIRMED").length,
        pending: bookings.filter(b => b.status === "PENDING").length,
        completed: bookings.filter(b => b.status === "COMPLETED").length,
        totalRevenue: bookings.filter(b => b.status === "CONFIRMED" || b.status === "COMPLETED").reduce((sum, b) => sum + (b.totalPrice || 0), 0)
    };

    const getStatusConfig = (status: string) => STATUSES.find(s => s.value === status) || STATUSES[0];

    if (loading) {
        return (
            <ProtectedAdminRoute>
                <AdminLayout>
                    <div className="flex items-center justify-center h-[60vh]">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-[#F76513] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-500 font-medium">Chargement des réservations...</p>
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
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-1">
                            📅 Gestion des Réservations
                        </h1>
                        <p className="text-slate-500">
                            {bookings.length} réservation(s) • Suivez et gérez toutes les locations
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl shadow-xl p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-300 text-sm font-medium">Total</p>
                                    <p className="text-3xl font-black">{stats.total}</p>
                                </div>
                                <CalendarCheck size={28} className="text-slate-400" />
                            </div>
                        </div>

                        {STATUSES.slice(0, 3).map(status => {
                            const count = bookings.filter(b => b.status === status.value).length;
                            const Icon = status.icon;
                            return (
                                <div key={status.value} className={`bg-gradient-to-br ${status.bgCard} rounded-2xl shadow-xl p-5 text-white`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/80 text-sm font-medium">{status.label}</p>
                                            <p className="text-3xl font-black">{count}</p>
                                        </div>
                                        <Icon size={28} className="text-white/60" />
                                    </div>
                                </div>
                            );
                        })}

                        <div className="bg-gradient-to-br from-[#002AD7] to-[#0044ff] rounded-2xl shadow-xl p-5 text-white">
                            <div>
                                <p className="text-blue-200 text-sm font-medium">Revenu</p>
                                <p className="text-2xl font-black">{stats.totalRevenue.toLocaleString()}</p>
                                <p className="text-xs text-blue-200">FCFA</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full lg:w-96">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par ID, voiture ou client..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F76513] focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <Filter size={18} className="text-slate-400" />
                                <button
                                    onClick={() => setFilter("ALL")}
                                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${filter === "ALL" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                                >
                                    Toutes
                                </button>
                                {STATUSES.map(s => (
                                    <button
                                        key={s.value}
                                        onClick={() => setFilter(s.value)}
                                        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${filter === s.value ? "bg-[#F76513] text-white shadow-lg shadow-orange-500/30" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bookings Grid - Card Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredBookings.length === 0 ? (
                            <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-100">
                                <CalendarCheck size={64} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-500 font-medium text-lg">Aucune réservation trouvée</p>
                            </div>
                        ) : (
                            filteredBookings.map((booking) => {
                                const statusConfig = getStatusConfig(booking.status);
                                const StatusIcon = statusConfig.icon;
                                return (
                                    <div
                                        key={booking.id}
                                        className="bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all overflow-hidden group"
                                    >
                                        {/* Header Band */}
                                        <div className={`bg-gradient-to-r ${statusConfig.bgCard} px-5 py-3 flex items-center justify-between`}>
                                            <span className="text-white font-bold text-sm flex items-center gap-2">
                                                <StatusIcon size={16} /> {statusConfig.label}
                                            </span>
                                            <span className="text-white/80 font-mono text-sm">#{booking.id}</span>
                                        </div>

                                        <div className="p-5">
                                            {/* Car Info */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                                                    <Car size={24} className="text-slate-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-slate-900">{booking.car?.name || "Véhicule"}</h3>
                                                    <p className="text-sm text-slate-500">{booking.car?.brand || ""}</p>
                                                </div>
                                                {booking.rentalType && (
                                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs font-bold">
                                                        {booking.rentalType}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Client */}
                                            <div className="flex items-center gap-2 mb-4 p-3 bg-slate-50 rounded-xl">
                                                <User size={16} className="text-slate-400" />
                                                <span className="text-sm font-medium text-slate-700">{booking.user?.fullName || `Utilisateur #${booking.userId || "?"}`}</span>
                                            </div>

                                            {/* Dates */}
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div className="bg-emerald-50 p-3 rounded-xl">
                                                    <p className="text-xs text-emerald-600 font-bold mb-1">Début</p>
                                                    <p className="text-sm font-semibold text-slate-800">{formatDate(booking.startDate)}</p>
                                                </div>
                                                <div className="bg-red-50 p-3 rounded-xl">
                                                    <p className="text-xs text-red-600 font-bold mb-1">Fin</p>
                                                    <p className="text-sm font-semibold text-slate-800">{formatDate(booking.endDate)}</p>
                                                </div>
                                            </div>

                                            {/* Price & Driver */}
                                            <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-xl">
                                                <div>
                                                    <p className="text-xs text-blue-600 font-bold">Total</p>
                                                    <p className="text-lg font-black text-blue-700">{(booking.totalPrice || 0).toLocaleString()} FCFA</p>
                                                </div>
                                                {booking.withDriver && (
                                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
                                                        + Chauffeur
                                                    </span>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-3 border-t border-slate-100">
                                                <button
                                                    onClick={() => openDetailsModal(booking)}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                                                >
                                                    <Eye size={14} /> Détails
                                                </button>
                                                <button
                                                    onClick={() => openStatusModal(booking)}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-[#002AD7] hover:bg-[#001a8f] text-white px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                                                >
                                                    <ChevronDown size={14} /> Statut
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBooking(booking.id)}
                                                    className="flex items-center justify-center bg-red-100 hover:bg-red-500 hover:text-white text-red-700 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* MODAL: Change Status */}
                {showStatusModal && selectedBooking && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="bg-gradient-to-r from-[#002AD7] to-[#0044ff] p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">📋 Modifier le statut</h2>
                                    <button onClick={() => setShowStatusModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition">
                                        <X size={20} />
                                    </button>
                                </div>
                                <p className="text-blue-200 mt-2">Réservation #{selectedBooking.id}</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="text-sm text-slate-500 mb-4">
                                    Véhicule: <strong>{selectedBooking.car?.name}</strong><br />
                                    Client: <strong>{selectedBooking.user?.fullName || `User #${selectedBooking.userId}`}</strong>
                                </p>

                                <label className="block text-sm font-bold text-slate-700 mb-2">Nouveau statut</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {STATUSES.map(status => {
                                        const Icon = status.icon;
                                        return (
                                            <button
                                                key={status.value}
                                                type="button"
                                                onClick={() => setNewStatus(status.value)}
                                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${newStatus === status.value
                                                    ? "border-[#002AD7] bg-blue-50 ring-2 ring-[#002AD7]"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                            >
                                                <Icon size={24} className={newStatus === status.value ? "text-[#002AD7]" : "text-slate-400"} />
                                                <span className={`font-semibold text-sm ${newStatus === status.value ? "text-[#002AD7]" : "text-slate-600"}`}>
                                                    {status.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowStatusModal(false)}
                                        className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleUpdateStatus}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-[#002AD7] to-[#0044ff] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
                                    >
                                        Confirmer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: Details */}
                {showDetailsModal && selectedBooking && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className={`bg-gradient-to-r ${getStatusConfig(selectedBooking.status).bgCard} p-6 text-white`}>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold">🔍 Détails de la réservation</h2>
                                    <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-white/20 rounded-xl transition">
                                        <X size={20} />
                                    </button>
                                </div>
                                <p className="text-white/80 mt-1">#{selectedBooking.id} • {getStatusConfig(selectedBooking.status).label}</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-xl">
                                        <p className="text-xs text-slate-500 font-bold mb-1">Véhicule</p>
                                        <p className="font-bold text-slate-900">{selectedBooking.car?.name}</p>
                                        <p className="text-sm text-slate-600">{selectedBooking.car?.brand}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl">
                                        <p className="text-xs text-slate-500 font-bold mb-1">Client</p>
                                        <p className="font-bold text-slate-900">{selectedBooking.user?.fullName || `User #${selectedBooking.userId}`}</p>
                                        <p className="text-sm text-slate-600">{selectedBooking.user?.email || ""}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-emerald-50 p-4 rounded-xl">
                                        <p className="text-xs text-emerald-600 font-bold mb-1">Date début</p>
                                        <p className="font-bold text-slate-900">{formatDate(selectedBooking.startDate)}</p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-xl">
                                        <p className="text-xs text-red-600 font-bold mb-1">Date fin</p>
                                        <p className="font-bold text-slate-900">{formatDate(selectedBooking.endDate)}</p>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-blue-600 font-bold mb-1">Prix Total</p>
                                        <p className="text-2xl font-black text-blue-700">{(selectedBooking.totalPrice || 0).toLocaleString()} FCFA</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-blue-600 font-bold mb-1">Type</p>
                                        <p className="font-bold text-blue-700">{selectedBooking.rentalType || "DAILY"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className={`flex-1 p-3 rounded-xl text-center ${selectedBooking.withDriver ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                        <p className="font-bold">{selectedBooking.withDriver ? "✓ Avec chauffeur" : "✕ Sans chauffeur"}</p>
                                    </div>
                                </div>

                                {selectedBooking.createdAt && (
                                    <p className="text-xs text-slate-400 text-center">
                                        Créée le {formatDate(selectedBooking.createdAt)}
                                    </p>
                                )}

                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </ProtectedAdminRoute>
    );
}
