"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { bookingService } from "@/services/api";
import { useAuth } from "@/context/AuthContext"; // Import du contexte
import {
    Home, LayoutGrid, Heart, DollarSign, Bell, Settings, LogOut,
    Search, Edit2, ChevronDown, Calendar, Car, Trash2, User,
    Mail, MapPin, Lock, Smartphone, CreditCard, BellRing, Globe,
    Moon, Shield, FileText, HelpCircle, ChevronRight, ArrowLeft,
    Sun, Monitor, Crown, Menu, X, CalendarClock // Ajout de CalendarClock, Menu, X
} from "lucide-react";

// --- DONNÉES FACTICES (Mises à jour avec monthlyPrice) ---

const mockNotifications = [
    { id: 1, title: "Réservation confirmée", content: "Votre réservation pour la Mercedes GLE 450 a été confirmée.", date: "Aujourd'hui, 10:30", type: "success" },
    { id: 2, title: "Rappel de paiement", content: "N'oubliez pas de régler le solde avant le 15 juin.", date: "Hier, 14:00", type: "warning" },
    { id: 3, title: "Nouvelle offre", content: "-20% sur toutes les locations à Kribi !", date: "08 Juin, 09:00", type: "info" },
];

const mockTransactions = [
    { id: 1, car: "Toyota RAV4", plate: "CE 123 AA", provider: "Avis", user: "Moi", period: "07 Juin - 10 Juin", status: "Terminé", amount: "150 000 FCFA" },
    { id: 2, car: "Mercedes Classe C", plate: "LT 456 BB", provider: "Hertz", user: "Moi", period: "15 Juin - 17 Juin", status: "En cours", amount: "200 000 FCFA" },
    { id: 3, car: "Hyundai Tucson", plate: "OU 789 CC", provider: "Sixt", user: "Moi", period: "20 Mai - 22 Mai", status: "Annulé", amount: "0 FCFA" },
];

const mockFavorites = [
    {
        id: 1,
        name: "Toyota Camry",
        price: "45 000",
        monthlyPrice: "850 000", // PRIX ABONNEMENT
        image: "/assets/car2.jpeg",
        rating: 4.8,
        type: "Berline"
    },
    {
        id: 2,
        name: "Range Rover Evoque",
        price: "120 000",
        monthlyPrice: "2 500 000", // PRIX ABONNEMENT
        image: "/assets/car3.jpeg",
        rating: 5.0,
        type: "SUV"
    },
    {
        id: 3,
        name: "Audi A4",
        price: "60 000",
        // Pas d'abonnement sur celle-ci
        image: "/assets/car4.jpeg",
        rating: 4.6,
        type: "Berline"
    },
];

// --- SOUS-COMPOSANTS VUES ---

// Modifié pour accepter l'objet 'user'
const InformationView = ({ user }: { user: any }) => (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-500 w-full relative">
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-white/30 transition">
                <Edit2 className="text-white w-4 h-4" />
            </div>
        </div>
        <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-end -mt-12 mb-10 gap-4">
                <div className="flex items-end gap-6">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-md overflow-hidden bg-slate-100 flex items-center justify-center">
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
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{user?.fullName || "Utilisateur"}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Rôle : {user?.role || "Membre"}</p>
                    </div>
                </div>
                <button className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition shadow-lg">
                    Sauvegarder
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Informations Personnelles</h3>
                    <div>
                        <label className="block text-slate-600 dark:text-slate-300 text-sm font-medium mb-2">Nom Complet</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input type="text" defaultValue={user?.fullName || ""} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-600 dark:text-slate-300 text-sm font-medium mb-2">Genre</label>
                            <div className="relative">
                                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                    <option>Homme</option>
                                    <option>Femme</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-600 dark:text-slate-300 text-sm font-medium mb-2">Langue</label>
                            <div className="relative">
                                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                    <option>Français</option>
                                    <option>Anglais</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Coordonnées</h3>
                    <div>
                        <label className="block text-slate-600 dark:text-slate-300 text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input type="email" readOnly defaultValue={user?.email || ""} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-600 dark:text-slate-300 text-sm font-medium mb-2">Adresse</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input type="text" defaultValue="Yaoundé, Cameroun" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Modifié pour afficher l'abonnement
const FavoriteView = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Mes Favoris</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFavorites.map((car: any) => (
                <div key={car.id} className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 dark:border-slate-700 group relative">

                    {/* Badge Abonnement */}
                    {car.monthlyPrice && (
                        <div className="absolute top-6 left-6 z-20 bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <CalendarClock size={12} /> Abonnement dispo
                        </div>
                    )}

                    <div className="relative h-48 bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden mb-4">
                        <Image src={car.image} alt={car.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 shadow-sm hover:bg-red-50 transition z-30">
                            <Heart className="fill-current w-5 h-5" />
                        </button>
                        <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">{car.type}</span>
                    </div>
                    <div className="px-2">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{car.name}</h3>
                            <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">
                                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{car.rating}</span>
                                <span className="text-orange-400">★</span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                À partir de <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">{car.price} FCFA</span>/jour
                            </p>
                            {/* Affichage du prix abonnement */}
                            {car.monthlyPrice && (
                                <p className="text-purple-600 dark:text-purple-400 text-xs font-bold mt-1 flex items-center gap-1 animate-pulse">
                                    <CalendarClock size={12} /> Ou {car.monthlyPrice} FCFA /mois
                                </p>
                            )}
                        </div>
                        <button className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                            Louer ou S'abonner
                        </button>
                    </div>
                </div>
            ))}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-4 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 min-h-[350px] hover:border-blue-300 hover:bg-blue-50/30 transition cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4"><Search className="w-8 h-8 text-slate-300" /></div>
                <p className="font-medium">Explorer plus de véhicules</p>
            </div>
        </div>
    </div>
);

const NotificationsView = () => (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 min-h-[600px]">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Notifications</h2>
            <button className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">Tout marquer comme lu</button>
        </div>
        <div className="space-y-4">
            {mockNotifications.map((notif) => (
                <div key={notif.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-600 group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.type === 'success' ? 'bg-green-100 text-green-600' : ''} ${notif.type === 'warning' ? 'bg-orange-100 text-orange-600' : ''} ${notif.type === 'info' ? 'bg-blue-100 text-blue-600' : ''}`}><Bell className="w-6 h-6" /></div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">{notif.title}</h3>
                            <span className="text-xs text-slate-400 font-medium">{notif.date}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{notif.content}</p>
                    </div>
                    <button className="text-slate-300 hover:text-red-500 transition p-2 opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                </div>
            ))}
        </div>
    </div>
);

// --- COMPOSANT TRANSACTIONS VIEW CORRIGÉ ---
const TransactionsView = ({ type }: { type: 'locations' | 'payments' }) => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // 1. Si on est sur l'onglet Paiements (pas encore implémenté), on arrête le chargement
        if (type !== 'locations') {
            setLoading(false);
            return;
        }

        // 2. Si l'utilisateur n'est pas là, on attend (ou on arrête si on est sûr qu'il n'est pas connecté)
        if (!user) {
            // On laisse 'loading' à true le temps que AuthContext charge, 
            // ou on peut mettre false si on veut afficher "Non connecté".
            return;
        }

        // 3. Si l'utilisateur est là mais n'a pas d'ID (Problème critique)
        if (!user.id) {
            console.error("Erreur critique : Utilisateur connecté sans ID", user);
            setError("Erreur de profil : Impossible de récupérer vos réservations.");
            setLoading(false);
            return;
        }

        // 4. Tout est bon, on lance la requête
        setLoading(true);
        bookingService.getByUser(user.id)
            .then(res => {
                const sorted = res.data.sort((a: any, b: any) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setBookings(sorted);
            })
            .catch(err => {
                console.error("Erreur chargement réservations", err);
                setError("Impossible de charger l'historique.");
            })
            .finally(() => {
                setLoading(false);
            });

    }, [user, type]); // Dépendances

    // --- Fonction utilitaire date ---
    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Calculs
    const activeRentals = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
    const totalSpent = bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);

    return (
        <div className="space-y-8">
            {type === 'locations' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Réservations Actives", value: activeRentals.toString(), icon: Car, color: "bg-blue-600" },
                        { label: "Total Dépensé", value: `${(totalSpent).toLocaleString()} F`, icon: DollarSign, color: "bg-green-500" },
                        { label: "Total Historique", value: bookings.length.toString(), icon: Calendar, color: "bg-orange-500" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${stat.color}`}><stat.icon size={24} /></div>
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="font-bold text-xl text-slate-800 dark:text-white">
                        {type === 'locations' ? 'Mes Réservations' : 'Historique des Paiements'}
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-slate-700 dark:text-slate-200">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="py-4 px-6 font-semibold text-sm">Véhicule</th>
                                <th className="py-4 px-6 font-semibold text-sm hidden md:table-cell">Type</th>
                                <th className="py-4 px-6 font-semibold text-sm">Dates</th>
                                <th className="py-4 px-6 font-semibold text-sm">Statut</th>
                                <th className="py-4 px-6 font-semibold text-sm text-right">Montant</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                            {loading ? (
                                <tr><td colSpan={5} className="py-8 text-center text-slate-500">Chargement des données...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={5} className="py-8 text-center text-red-500 font-bold">{error}</td></tr>
                            ) : bookings.length === 0 ? (
                                <tr><td colSpan={5} className="py-8 text-center text-slate-500">Aucune réservation trouvée.</td></tr>
                            ) : (
                                bookings.map((item) => (
                                    <tr key={item.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                    <Image
                                                        src={item.car?.image || "/assets/car1.jpeg"}
                                                        width={48} height={48}
                                                        alt={item.car?.name || "Image véhicule"} // <--- AJOUTEZ CECI
                                                        className="object-cover h-full w-full"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white">{item.car?.name || "Véhicule"}</p>
                                                    <p className="text-xs text-slate-400 font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded inline-block mt-1">
                                                        {item.car?.brand || "Marque"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 hidden md:table-cell">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${item.rentalType === 'MONTHLY' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {item.rentalType === 'MONTHLY' ? 'ABONNEMENT' : 'JOURNALIER'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm font-medium">
                                                {formatDate(item.startDate)} <br /> <span className="text-xs text-slate-400">au</span> {formatDate(item.endDate)}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold 
                                        ${item.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : ''} 
                                        ${item.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : ''}
                                        ${item.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : ''}
                                    `}>
                                                <span className={`w-1.5 h-1.5 rounded-full 
                                            ${item.status === 'CONFIRMED' ? 'bg-green-500' : ''}
                                            ${item.status === 'PENDING' ? 'bg-orange-500' : ''}
                                            ${item.status === 'CANCELLED' ? 'bg-red-500' : ''}
                                        `}></span>
                                                {item.status === 'PENDING' ? 'En attente' : item.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className="font-bold text-slate-800 dark:text-white">
                                                {item.totalPrice?.toLocaleString()} CFA
                                            </span>
                                        </td>
                                    </tr>
                                )))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- COMPOSANTS DE FORMULAIRES PARAMÈTRES ---

const SettingsHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
    <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
    </div>
);

const ThemeForm = ({ onBack }: any) => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="max-w-2xl">
            <SettingsHeader title="Apparence" onBack={onBack} />
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4">
                {[
                    { label: 'Thème clair', value: 'light', icon: Sun },
                    { label: 'Thème sombre', value: 'dark', icon: Moon },
                    { label: 'Système', value: 'system', icon: Monitor }
                ].map((option, i) => (
                    <label
                        key={i}
                        className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all group
                            ${theme === option.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <option.icon className={`
                                ${theme === option.value ? 'text-blue-600' : 'text-slate-500 dark:text-slate-400'}
                            `} />
                            <span className="font-medium text-slate-700 dark:text-slate-200">{option.label}</span>
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
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-6">
            <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-2">Langue de l'application</label>
                <div className="relative">
                    <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-slate-700 dark:text-slate-200">
                        <option>Français (Cameroun)</option>
                        <option>English (US)</option>
                        <option>Français (France)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                </div>
            </div>
            <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-2">Format de date</label>
                <div className="relative">
                    <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-slate-700 dark:text-slate-200">
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
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-6">
            <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-2">Mot de passe actuel</label>
                <input type="password" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
            </div>
            <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-2">Nouveau mot de passe</label>
                <input type="password" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
            </div>
            <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-2">Confirmer le mot de passe</label>
                <input type="password" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">Mettre à jour</button>
        </div>
    </div>
);

const NotificationsForm = ({ onBack }: any) => (
    <div className="max-w-2xl">
        <SettingsHeader title="Préférences de notifications" onBack={onBack} />
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-6">
            {['Notifications Email', 'Notifications SMS', 'Offres promotionnelles', 'Mises à jour de sécurité'].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            ))}
            <button className="w-full mt-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition">Enregistrer les préférences</button>
        </div>
    </div>
);

const PaymentForm = ({ onBack }: any) => (
    <div className="max-w-2xl">
        <SettingsHeader title="Méthodes de paiement" onBack={onBack} />
        <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-blue-900 rounded-md"></div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-white">Visa terminant par 4242</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Expire le 12/25</p>
                    </div>
                </div>
                <button className="text-red-500 text-sm font-bold hover:underline">Retirer</button>
            </div>
            <button className="w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-4 text-slate-500 dark:text-slate-400 font-bold hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2">
                <CreditCard size={20} /> Ajouter une nouvelle carte
            </button>
        </div>
    </div>
);

// --- VUE PRINCIPALE DES PARAMÈTRES ---

const SettingsView = () => {
    const [subView, setSubView] = useState('main');

    const SettingsItem = ({ icon: Icon, title, subtitle, onClick, color = "text-slate-600" }: any) => (
        <div onClick={onClick} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0 group">
            <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:shadow-sm transition-all">
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
        </div>
    );

    const Section = ({ title, children }: any) => (
        <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 px-1">{title}</h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">{children}</div>
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
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Paramètres</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Gérez vos préférences et la sécurité de votre compte.</p>
            </header>

            <Section title="Compte & Sécurité">
                <SettingsItem icon={Lock} title="Mot de passe" subtitle="Modifiez votre mot de passe." color="text-blue-600" onClick={() => setSubView('password')} />
                <SettingsItem icon={CreditCard} title="Paiements" subtitle="Gérez vos cartes bancaires." color="text-green-600" onClick={() => setSubView('payment')} />
                <SettingsItem icon={Smartphone} title="Authentification à deux facteurs" subtitle="Sécurité renforcée." color="text-purple-600" onClick={() => { }} />
            </Section>

            <Section title="Préférences">
                <SettingsItem icon={BellRing} title="Notifications" subtitle="Emails et alertes." color="text-orange-500" onClick={() => setSubView('notifications')} />
                <SettingsItem icon={Globe} title="Langue & Région" subtitle="Français (Cameroun)" color="text-blue-400" onClick={() => setSubView('language')} />
                <SettingsItem icon={Moon} title="Apparence" subtitle="Thème clair, sombre ou système" color="text-slate-700 dark:text-slate-300" onClick={() => setSubView('theme')} />
            </Section>

            <Section title="Légal & Support">
                <SettingsItem icon={Shield} title="Politique de Confidentialité" subtitle="Contrôlez vos données." color="text-emerald-600" onClick={() => { }} />
                <SettingsItem icon={FileText} title="Conditions d'utilisation" subtitle="Règles de la plateforme." color="text-blue-600" onClick={() => { }} />
                <Link href="/Help"><SettingsItem icon={HelpCircle} title="Aide & Support" subtitle="Contactez notre équipe." color="text-red-500" onClick={() => { }} /></Link>
            </Section>

            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                <h2 className="text-red-600 font-bold mb-4">Zone de danger</h2>
                <button className="text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:border-red-900/30 hover:border-red-300 font-bold py-3 px-6 rounded-xl transition-all text-sm flex items-center gap-2">
                    <Trash2 size={16} /> Supprimer mon compte
                </button>
            </div>
        </div>
    );
};

// --- PAGE PRINCIPALE ---

export default function ProfilePage() {
    const { user, logout } = useAuth(); // Utilisation du contexte Auth
    const [activeTab, setActiveTab] = useState<"info" | "home" | "favorite" | "transactions" | "notifications" | "settings">("info");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // État pour le menu mobile

    const menuItems = [
        { id: "home", label: "Tableau de bord", icon: LayoutGrid },
        { id: "info", label: "Informations", icon: User },
        { id: "plans_link", label: "Mon Abonnement", icon: Crown },
        { id: "favorite", label: "Favoris", icon: Heart },
        { id: "transactions", label: "Transactions", icon: DollarSign },
        { id: "notifications", label: "Notifications", icon: Bell },
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans flex flex-col transition-colors duration-300">
            {/* Header */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 px-6 md:px-12 py-4">
                <div className="flex items-center justify-between max-w-[1440px] mx-auto">
                    <Link href="/" className="text-2xl font-bold flex items-center gap-1">
                        <div className="bg-blue-600 text-white p-1 rounded-lg"><Car size={24} /></div>
                        <span className="text-blue-600">EASY</span><span className="text-orange-500">-RENT</span>
                    </Link>

                    {/* Bouton Hamburger Mobile */}
                    <button
                        className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        <Link href="/CarsPage" className="hover:text-blue-600 transition-colors">Cars</Link>
                        <Link href="/Agencies" className="hover:text-blue-600 transition-colors">Agencies</Link>
                        <Link href="/Help" className="hover:text-blue-600 transition-colors">Help</Link>
                    </nav>

                    <div className="hidden md:flex gap-4 items-center pl-4 border-l border-slate-200 dark:border-slate-700 ml-4">
                        <button className="p-2 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition"><Heart size={20} /></button>
                        <div className="w-9 h-9 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-full border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden flex items-center justify-center text-white font-bold">
                            {user?.fullName?.charAt(0) || "U"}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 items-start max-w-[1440px] mx-auto w-full relative">

                {/* --- SIDEBAR (Mobile & Desktop) --- */}
                <aside className={`
                    fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 
                    transform transition-transform duration-300 ease-in-out
                    md:translate-x-0 md:static md:h-[calc(100vh-80px)] md:sticky md:top-20 md:flex md:flex-col py-8 rounded-br-3xl
                    ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
                `}>
                    <div className="px-6 mb-4 mt-16 md:mt-0">
                        {/* Header Mobile du menu */}
                        <div className="flex justify-between items-center md:hidden mb-6">
                            <span className="font-bold text-lg text-slate-800 dark:text-white">Menu</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}><X className="text-slate-500" /></button>
                        </div>

                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Menu Principal</p>
                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                item.id === "plans_link" ? (
                                    <Link key={item.id} href="/Plans" className="block">
                                        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 transition-colors">
                                            <item.icon className="w-5 h-5 text-orange-500" /> {item.label}
                                        </button>
                                    </Link>
                                ) : (
                                    <button
                                        key={item.id}
                                        onClick={() => handleTabChange(item.id)}
                                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm border-r-4 border-blue-600 dark:border-blue-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}
                                    >
                                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} /> {item.label}
                                    </button>
                                )
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto px-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Autres</p>
                        <nav className="space-y-1">
                            <button onClick={() => handleTabChange("settings")} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}`}>
                                <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} /> Paramètres
                            </button>
                            {/* BOUTON DÉCONNEXION */}
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-medium transition-colors"
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
                    {/* Header Mobile Only pour le titre */}
                    <div className="md:hidden mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
                            {activeTab === 'home' ? 'Tableau de bord' : activeTab}
                        </h2>
                    </div>

                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                        <div>
                            {/* BONJOUR DYNAMIQUE */}
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Bonjour, {user?.fullName?.split(' ')[0] || "Invité"} !</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Compte actif • Connecté</p>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input type="text" placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-blue-100 shadow-sm text-slate-700 dark:text-white" />
                            </div>
                            <button className="relative p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm">
                                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                            </button>
                        </div>
                    </header>
                    <div className="max-w-6xl mx-auto animate-fadeIn">{renderContent()}</div>
                </main>
            </div>
        </div>
    );
}