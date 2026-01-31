"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { bookingService, searchService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext"; // <-- Import
import { useFavorite } from "@/context/FavoriteContext";
import {
    Home, LayoutGrid, Heart, DollarSign, Bell, Settings, LogOut,
    Search, Edit2, ChevronDown, Calendar, Car, Trash2, User,
    Mail, MapPin, Lock, Smartphone, CreditCard, BellRing, Globe,
    Moon, Shield, FileText, HelpCircle, ChevronRight, ArrowLeft,
    Sun, Monitor, Crown, Menu, X, CalendarClock // Ajout de CalendarClock, Menu, X
} from "lucide-react";

// --- DONNÉES FACTICES ---

// --- SOUS-COMPOSANTS VUES ---

// Modifié pour accepter l'objet 'user'
const InformationView = ({ user }: { user: any }) => (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-500 w-full relative">
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-white/30 transition">
                <Edit2 className="text-white w-4 h-4" />
            </div>
        </div>
        <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-end -mt-12 mb-10 gap-4">
                <div className="flex items-end gap-6">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100 flex items-center justify-center">
                            {user?.fullName ? (
                                <span className="text-4xl font-bold text-slate-300">{user.fullName.charAt(0)}</span>
                            ) : (
                                <Image src="/assets/default-avatar.jpeg" alt="Avatar" width={128} height={128} className="object-cover h-full w-full" />
                            )}
                        </div>
                        <button className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full border-2 border-white text-white hover:bg-blue-700 transition shadow-sm">
                            <Edit2 size={14} />
                        </button>
                    </div>
                    <div className="mb-3">
                        <h2 className="text-2xl font-bold text-slate-800">{user?.fullName || "Utilisateur"}</h2>
                        <p className="text-slate-500 text-sm">Rôle : {user?.role || "Membre"}</p>
                    </div>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-lg">
                    Sauvegarder
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Informations Personnelles</h3>
                    <div>
                        <label className="block text-slate-600 text-sm font-medium mb-2">Nom Complet</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input type="text" defaultValue={user?.fullName || ""} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-600 text-sm font-medium mb-2">Genre</label>
                            <div className="relative">
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                    <option>Homme</option>
                                    <option>Femme</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-600 text-sm font-medium mb-2">Langue</label>
                            <div className="relative">
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                    <option>Français</option>
                                    <option>Anglais</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Coordonnées</h3>
                    <div>
                        <label className="block text-slate-600 text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input type="email" readOnly defaultValue={user?.email || ""} className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-500 outline-none cursor-not-allowed" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 text-sm font-medium mb-2">Adresse</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input type="text" defaultValue="Yaoundé, Cameroun" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Modifié pour afficher les favoris réels du contexte
const FavoriteView = () => {
    const { favorites, toggleFavorite } = useFavorite();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Mes Favoris</h2>
            {favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((car: any) => (
                        <div key={car.id} className="bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group relative flex flex-col h-full">

                            {/* Badge Abonnement */}
                            {car.monthlyPrice && (
                                <div className="absolute top-6 left-6 z-20 bg-orange-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                    <CalendarClock size={12} /> Abonnement dispo
                                </div>
                            )}

                            <div className="relative h-48 bg-slate-100 rounded-2xl overflow-hidden mb-4">
                                <Image src={car.image || "/assets/car1.jpeg"} alt={car.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                <button
                                    onClick={() => toggleFavorite(car)}
                                    className="absolute top-3 right-3 p-2 bg-blue-500 text-white shadow-md hover:bg-blue-600 transition z-30 rounded-full"
                                >
                                    <Heart className="fill-current w-5 h-5" />
                                </button>
                                <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">{car.type}</span>
                            </div>

                            <div className="px-2 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{car.name}</h3>
                                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                                        <span className="text-xs font-bold text-blue-600">{car.rating || "4.8"}</span>
                                        <span className="text-blue-400">★</span>
                                    </div>
                                </div>

                                <div className="mb-6 flex-1">
                                    <p className="text-slate-500 text-sm">
                                        À partir de <span className="text-blue-600 font-black text-lg">{(car.pricePerDay || car.price)?.toLocaleString()} CFA</span>/jour
                                    </p>
                                    {car.monthlyPrice && (
                                        <p className="text-slate-600 text-xs font-bold mt-1 flex items-center gap-1">
                                            <CalendarClock size={12} /> Ou {car.monthlyPrice.toLocaleString()} CFA /mois
                                        </p>
                                    )}
                                </div>

                                <Link href={`/CarsPage/${car.id}`}>
                                    <button className="w-full bg-blue-700 text-white rounded-xl py-3 font-bold hover:bg-blue-800 transition shadow-md hover:shadow-lg text-sm">
                                        Louer ou S'abonner
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                    <Link href="/CarsPage" className="border-2 border-dashed border-slate-200 rounded-3xl p-4 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 min-h-[350px] hover:border-blue-300 hover:bg-blue-50/30 transition cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4"><Search className="w-8 h-8 text-slate-300" /></div>
                        <p className="font-medium text-center px-4">Explorer plus de véhicules</p>
                    </Link>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                    <Heart size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500">Vous n'avez pas encore de favoris.</p>
                    <Link href="/CarsPage">
                        <button className="mt-4 text-blue-600 font-bold hover:underline">Découvrir nos voitures</button>
                    </Link>
                </div>
            )}
        </div>
    );
}

const NotificationsView = () => {
    const { notifications, markAllAsRead, clearNotification } = useNotification();

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 min-h-[600px]">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
                {notifications.length > 0 && (
                    <button onClick={markAllAsRead} className="text-sm text-blue-600 font-semibold hover:underline">
                        Tout marquer comme lu
                    </button>
                )}
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 font-medium">
                        Aucune notification pour le moment.
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div key={notif.id} className={`flex items-start gap-4 p-4 rounded-2xl transition-colors border group ${notif.read ? 'bg-white border-transparent hover:bg-slate-50' : 'bg-blue-50/40 border-blue-100'}`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 
                                ${notif.type === 'success' ? 'bg-green-100 text-green-600' : ''} 
                                ${notif.type === 'error' ? 'bg-red-100 text-red-600' : ''} 
                                ${notif.type === 'booking' ? 'bg-purple-100 text-purple-600' : ''} 
                                ${notif.type === 'info' ? 'bg-blue-100 text-blue-600' : ''}
                            `}>
                                <Bell className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors capitalize">{notif.type}</h3>
                                    <span className="text-xs text-slate-400 font-medium">{notif.timestamp.toLocaleTimeString()}</span>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed">{notif.message}</p>
                            </div>
                            <button onClick={() => clearNotification(notif.id)} className="text-slate-300 hover:text-red-500 transition p-2 opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// --- COMPOSANT TRANSACTIONS VIEW CORRIGÉ ---
const TransactionsView = ({ type }: { type: 'locations' | 'payments' }) => {
    const { user } = useAuth();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user || !user.id) return;

        setLoading(true);
        setError("");

        if (type === 'locations') {
            bookingService.getByUser(user.id)
                .then(res => {
                    const sorted = res.data.sort((a: any, b: any) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    setData(sorted);
                })
                .catch(err => {
                    console.error("Erreur check locations", err);
                    setError("Impossible de charger les réservations.");
                })
                .finally(() => setLoading(false));
        } else if (type === 'payments') {
            // Fetch payments
            // Note: need to import paymentService at top of file, assuming it's available in api.ts
            // But since imports are at top and I am editing middle, I rely on next command to fix imports if needed or assume user added it
            // For now I will assume I can access it or use axios directly if needed, but correct way is api.ts
            // Wait, I just added paymentService to api.ts, so I should be able to use it if imported.
            // To be safe I will use specific import or fully qualified if possible, but standard is import. 
            // Since I can't add import easily here without rewriting top, I'll assume 'paymentService' is imported or use 'require' or just 'api.get' via axios instance if exported.
            // Let's rely on api import. Wait, api.ts exports paymentService.
            // For now, I'll use the service I just created.
            const { paymentService } = require('@/services/api');
            paymentService.getMyPayments()
                .then((res: any) => setData(res.data))
                .catch((err: any) => {
                    console.error("Error payments", err);
                    setError("Impossible de charger l'historique des paiements.");
                })
                .finally(() => setLoading(false));
        }
    }, [user, type]);

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    // Stats
    const totalSpent = data.reduce((acc, item) => acc + (type === 'locations' ? (item.totalPrice || 0) : (item.amount || 0)), 0);
    const count = data.length;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${type === 'locations' ? 'bg-blue-600' : 'bg-green-600'}`}>
                        {type === 'locations' ? <Car size={24} /> : <DollarSign size={24} />}
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total {type === 'locations' ? 'Réservations' : 'Transactions'}</p>
                        <p className="text-2xl font-bold text-slate-800">{count}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md bg-slate-800">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Dépensé</p>
                        <p className="text-2xl font-bold text-slate-800">{totalSpent.toLocaleString()} CFA</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-xl text-slate-800">
                        {type === 'locations' ? 'Mes Réservations' : 'Historique des Paiements'}
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-slate-700">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="py-4 px-6 font-semibold text-sm">{type === 'locations' ? 'Véhicule' : 'Description'}</th>
                                <th className="py-4 px-6 font-semibold text-sm">Date</th>
                                <th className="py-4 px-6 font-semibold text-sm">Statut</th>
                                <th className="py-4 px-6 font-semibold text-sm text-right">Montant</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan={4} className="py-8 text-center text-slate-500">Chargement...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={4} className="py-8 text-center text-red-500">{error}</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan={4} className="py-8 text-center text-slate-500">Aucune donnée trouvée.</td></tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            {type === 'locations' ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden relative">
                                                        <Image src={item.car?.image || "/assets/car1.jpeg"} fill alt="Car" className="object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">{item.car?.name}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="font-medium text-slate-800">{item.description || "Paiement"}</div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            {formatDate(type === 'locations' ? item.startDate : item.createdAt)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5
                                                ${(item.status === 'CONFIRMED' || item.status === 'COMPLETED') ? 'bg-green-100 text-green-700' : ''}
                                                ${(item.status === 'PENDING') ? 'bg-orange-100 text-orange-700' : ''}
                                                ${(item.status === 'CANCELLED' || item.status === 'FAILED') ? 'bg-red-100 text-red-700' : ''}
                                            `}>
                                                <span className={`w-1.5 h-1.5 rounded-full 
                                                    ${(item.status === 'CONFIRMED' || item.status === 'COMPLETED') ? 'bg-green-500' : ''}
                                                    ${(item.status === 'PENDING') ? 'bg-orange-500' : ''}
                                                    ${(item.status === 'CANCELLED' || item.status === 'FAILED') ? 'bg-red-500' : ''}
                                                `}></span>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right font-bold text-slate-800">
                                            {(type === 'locations' ? item.totalPrice : item.amount)?.toLocaleString()} CFA
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- COMPOSANTS DE FORMULAIRES PARAMÈTRES (LIGHT ONLY) ---

const SettingsHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
    <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
    </div>
);

const ThemeForm = ({ onBack }: any) => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="max-w-2xl">
            <SettingsHeader title="Apparence" onBack={onBack} />
            <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-4">
                {[
                    { label: 'Thème clair', value: 'light', icon: Sun },
                    { label: 'Thème sombre', value: 'dark', icon: Moon }, // Gardé pour laisser le choix, mais le style est clair
                    { label: 'Système', value: 'system', icon: Monitor }
                ].map((option, i) => (
                    <label
                        key={i}
                        className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all group
                            ${theme === option.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 hover:bg-slate-50'
                            }
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <option.icon className={`
                                ${theme === option.value ? 'text-blue-600' : 'text-slate-500'}
                            `} />
                            <span className="font-medium text-slate-700">{option.label}</span>
                        </div>
                        <input
                            type="radio"
                            name="theme"
                            className="accent-blue-600 w-5 h-5"
                            checked={theme === option.value}
                            onChange={() => setTheme(option.value)}
                        />
                    </label>
                ))}
            </div>
        </div>
    );
};

const LanguageForm = ({ onBack }: any) => (
    <div className="max-w-2xl">
        <SettingsHeader title="Langue & Région" onBack={onBack} />
        <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-6">
            <div>
                <label className="block text-slate-700 font-medium mb-2">Langue de l'application</label>
                <div className="relative">
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-slate-700">
                        <option>Français (Cameroun)</option>
                        <option>English (US)</option>
                        <option>Français (France)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                </div>
            </div>
            <div>
                <label className="block text-slate-700 font-medium mb-2">Format de date</label>
                <div className="relative">
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-slate-700">
                        <option>JJ/MM/AAAA</option>
                        <option>MM/JJ/AAAA</option>
                        <option>AAAA-MM-JJ</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                </div>
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">Enregistrer</button>
        </div>
    </div>
);

const PasswordForm = ({ onBack }: any) => (
    <div className="max-w-2xl">
        <SettingsHeader title="Modifier le mot de passe" onBack={onBack} />
        <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-6">
            <div>
                <label className="block text-slate-700 font-medium mb-2">Mot de passe actuel</label>
                <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" />
            </div>
            <div>
                <label className="block text-slate-700 font-medium mb-2">Nouveau mot de passe</label>
                <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" />
            </div>
            <div>
                <label className="block text-slate-700 font-medium mb-2">Confirmer le mot de passe</label>
                <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800" />
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">Mettre à jour</button>
        </div>
    </div>
);

const NotificationsForm = ({ onBack }: any) => (
    <div className="max-w-2xl">
        <SettingsHeader title="Préférences de notifications" onBack={onBack} />
        <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-6">
            {['Notifications Email', 'Notifications SMS', 'Offres promotionnelles', 'Mises à jour de sécurité'].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                    <span className="text-slate-700 font-medium">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            ))}
            <button className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">Enregistrer les préférences</button>
        </div>
    </div>
);

const PaymentForm = ({ onBack }: any) => (
    <div className="max-w-2xl">
        <SettingsHeader title="Méthodes de paiement" onBack={onBack} />
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-blue-600 rounded-md"></div>
                    <div>
                        <p className="font-bold text-slate-800">Visa terminant par 4242</p>
                        <p className="text-xs text-slate-500">Expire le 12/25</p>
                    </div>
                </div>
                <button className="text-red-500 text-sm font-bold hover:underline">Retirer</button>
            </div>
            <button className="w-full border-2 border-dashed border-slate-300 rounded-2xl p-4 text-slate-500 font-bold hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2">
                <CreditCard size={20} /> Ajouter une nouvelle carte
            </button>
        </div>
    </div>
);

const SettingsView = () => {
    const [subView, setSubView] = useState('main');

    const SettingsItem = ({ icon: Icon, title, subtitle, onClick, color = "text-slate-600" }: any) => (
        <div onClick={onClick} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0 group">
            <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-100 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all">
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
        </div>
    );

    const Section = ({ title, children }: any) => (
        <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">{title}</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">{children}</div>
        </div>
    );

    if (subView === 'password') return <PasswordForm onBack={() => setSubView('main')} />;
    if (subView === 'notifications') return <NotificationsForm onBack={() => setSubView('main')} />;
    if (subView === 'payment') return <PaymentForm onBack={() => setSubView('main')} />;
    if (subView === 'theme') return <ThemeForm onBack={() => setSubView('main')} />;
    if (subView === 'language') return <LanguageForm onBack={() => setSubView('main')} />;

    return (
        <div className="max-w-4xl">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
                <p className="text-slate-500 mt-1">Gérez vos préférences et la sécurité de votre compte.</p>
            </header>

            <Section title="Compte & Sécurité">
                <SettingsItem icon={Lock} title="Mot de passe" subtitle="Modifiez votre mot de passe." color="text-blue-600" onClick={() => setSubView('password')} />
                <SettingsItem icon={CreditCard} title="Paiements" subtitle="Gérez vos cartes bancaires." color="text-green-600" onClick={() => setSubView('payment')} />
                <SettingsItem icon={Smartphone} title="Authentification à deux facteurs" subtitle="Sécurité renforcée." color="text-purple-600" onClick={() => { }} />
            </Section>

            <Section title="Préférences">
                <SettingsItem icon={BellRing} title="Notifications" subtitle="Emails et alertes." color="text-blue-500" onClick={() => setSubView('notifications')} />
                <SettingsItem icon={Globe} title="Langue & Région" subtitle="Français (Cameroun)" color="text-blue-400" onClick={() => setSubView('language')} />
                <SettingsItem icon={Moon} title="Apparence" subtitle="Thème clair, sombre ou système" color="text-slate-700" onClick={() => setSubView('theme')} />
            </Section>

            <Section title="Légal & Support">
                <SettingsItem icon={Shield} title="Politique de Confidentialité" subtitle="Contrôlez vos données." color="text-emerald-600" onClick={() => { }} />
                <SettingsItem icon={FileText} title="Conditions d'utilisation" subtitle="Règles de la plateforme." color="text-blue-600" onClick={() => { }} />
                <Link href="/Help"><SettingsItem icon={HelpCircle} title="Aide & Support" subtitle="Contactez notre équipe." color="text-red-500" onClick={() => { }} /></Link>
            </Section>

            <div className="mt-12 pt-8 border-t border-slate-200">
                <h2 className="text-red-600 font-bold mb-4">Zone de danger</h2>
                <button className="text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 font-bold py-3 px-6 rounded-xl transition-all text-sm flex items-center gap-2">
                    <Trash2 size={16} /> Supprimer mon compte
                </button>
            </div>
        </div>
    );
};

// --- PAGE PRINCIPALE ---

export default function ProfilePage() {
    const { user, logout } = useAuth(); // Utilisation du contexte Auth
    const { unreadCount } = useNotification(); // Utilisation du contexte Notif
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<"info" | "home" | "favorite" | "transactions" | "notifications" | "settings">("info");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // État pour le menu mobile

    // États pour la recherche globale
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length > 2) {
            setIsSearching(true);
            try {
                // Version locale pour Vercel
                const { allCars } = require("@/modules/carsData");
                const filtered = allCars.filter((car: any) =>
                    car.name.toLowerCase().includes(query.toLowerCase()) ||
                    car.specs.marque.toLowerCase().includes(query.toLowerCase())
                );
                setSearchResults(filtered);
            } catch (err) {
                console.error("Search error", err);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    // Lire le paramètre tab de l'URL pour rediriger vers l'onglet approprié
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'notifications') {
            setActiveTab('notifications');
        } else if (tab === 'favorite') {
            setActiveTab('favorite');
        } else if (tab === 'settings') {
            setActiveTab('settings');
        } else if (tab === 'info') {
            setActiveTab('info');
        } else if (tab === 'home') {
            setActiveTab('home');
        }
    }, [searchParams]);

    const menuItems = [
        { id: "home", label: "Tableau de bord", icon: LayoutGrid },
        { id: "info", label: "Informations", icon: User },
        { id: "plans_link", label: "Mon Abonnement", icon: Crown },
        { id: "favorite", label: "Favoris", icon: Heart },
        { id: "transactions", label: "Transactions", icon: DollarSign },
        { id: "notifications", label: "Notifications", icon: Bell, badge: unreadCount }, // Ajout du badge
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "home": return <TransactionsView type="locations" />;
            case "info": return <InformationView user={user} />; // Passer l'user à la vue
            case "favorite": return <FavoriteView />;
            case "transactions": return <TransactionsView type="payments" />;
            case "notifications": return <NotificationsView />;
            case "settings": return <SettingsView />;
            default: return <InformationView user={user} />;
        }
    };

    const handleTabChange = (id: any) => {
        if (id === "plans_link") return; // Si c'est un lien, on ne fait rien ici (géré par Link)
        setActiveTab(id);
        setIsMobileMenuOpen(false); // Fermer le menu après clic
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">


            <div className="flex flex-1 items-start max-w-[1440px] mx-auto w-full relative">

                {/* --- SIDEBAR (Mobile & Desktop) --- */}
                <aside className={`
                    fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 
                    transform transition-transform duration-300 ease-in-out
                    md:translate-x-0 md:static md:h-[calc(100vh-80px)] md:sticky md:top-20 md:flex md:flex-col py-8 rounded-br-3xl shadow-sm
                    ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
                `}>
                    <div className="px-6 mb-4 mt-16 md:mt-0">
                        {/* Header Mobile du menu */}
                        <div className="flex justify-between items-center md:hidden mb-6">
                            <span className="font-bold text-lg text-slate-800">Menu</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}><X className="text-slate-500" /></button>
                        </div>

                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Menu Principal</p>
                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                item.id === "plans_link" ? (
                                    <Link key={item.id} href="/Plans" className="block">
                                        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                            <item.icon className="w-5 h-5 text-blue-500" /> {item.label}
                                        </button>
                                    </Link>
                                ) : (
                                    <button
                                        key={item.id}
                                        onClick={() => handleTabChange(item.id)}
                                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.id ? 'bg-blue-50 text-blue-600 shadow-sm border-r-4 border-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                                    >
                                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                                        <span className="flex-1 text-left">{item.label}</span>
                                        {/* BADGE */}
                                        {item.badge && item.badge > 0 ? (
                                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                {item.badge}
                                            </span>
                                        ) : null}
                                    </button>
                                )
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto px-6 pt-4 border-t border-slate-100">
                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Autres</p>
                        <nav className="space-y-1">
                            <button onClick={() => handleTabChange("settings")} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                                <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-blue-600' : 'text-slate-400'}`} /> Paramètres
                            </button>
                            {/* BOUTON DÉCONNEXION */}
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
                            >
                                <LogOut className="w-5 h-5" /> Déconnexion
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Overlay sombre pour mobile */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                )}

                <main className="flex-1 p-6 md:p-10 w-full">
                    {/* Header Mobile Only pour le titre et Menu */}
                    <div className="md:hidden mb-6 flex items-center gap-4">
                        <button
                            className="p-2 text-slate-600 bg-white rounded-lg shadow-sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-slate-900 capitalize">
                            {activeTab === 'home' ? 'Tableau de bord' : activeTab}
                        </h2>
                    </div>

                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                        <div>
                            {/* BONJOUR DYNAMIQUE */}
                            <h1 className="text-3xl font-bold text-slate-900">Bonjour, {user?.fullName?.split(' ')[0] || "Invité"} !</h1>
                            <p className="text-slate-500 mt-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Compte actif • Connecté</p>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une voiture..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-100 shadow-sm text-slate-700"
                                />

                                {/* Résultats de recherche rapides */}
                                {searchQuery.length > 2 && (searchResults.length > 0 || isSearching) && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                                        {isSearching ? (
                                            <div className="p-4 text-center text-slate-500 text-sm">Recherche en cours...</div>
                                        ) : (
                                            searchResults.slice(0, 5).map(car => (
                                                <Link key={car.id} href={`/CarsPage/${car.id}`} className="block p-3 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                                                    <div className="font-bold text-slate-800 text-sm">{car.name}</div>
                                                    <div className="text-xs text-slate-500">{car.brand} • {car.pricePerDay} CFA</div>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                            <button className="relative p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm">
                                <Bell className="w-5 h-5 text-slate-600" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                        </div>
                    </header>
                    <div className="max-w-6xl mx-auto animate-fadeIn">{renderContent()}</div>
                </main>
            </div>
        </div>
    );
}