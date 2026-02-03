"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";
import {
    LayoutDashboard,
    Building2,
    Car,
    CalendarCheck,
    LogOut,
    Settings,
    Bell,
    Menu,
    X,
    ArrowLeft,
    TrendingUp,
    MapPin
} from "lucide-react";

// Couleurs de la charte graphique
const COLORS = {
    primary: "#002AD7",
    accent: "#F76513",
};

interface AgencyLayoutProps {
    children: ReactNode;
    agencyName?: string;
    agencyCity?: string;
}

export default function AgencyLayout({ children, agencyName = "Mon Agence", agencyCity = "Cameroun" }: AgencyLayoutProps) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'dashboard';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { name: "Tableau de Bord", path: "/Dashboard/Agency", tab: "dashboard", icon: LayoutDashboard },
        { name: "Réservations", path: "/Dashboard/Agency?tab=bookings", tab: "bookings", icon: CalendarCheck },
        { name: "Mes Véhicules", path: "/Dashboard/Agency?tab=cars", tab: "cars", icon: Car },
        { name: "Statistiques", path: "/Dashboard/Agency?tab=stats", tab: "stats", icon: TrendingUp },
    ];

    const currentPage = menuItems.find(item => item.tab === currentTab)?.name || "Dashboard Agence";

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-3">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #0044ff)` }}>
                                <Car size={20} className="text-white" />
                            </div>
                            <div>
                                <span className="text-lg font-black" style={{ color: COLORS.primary }}>EASY</span>
                                <span className="text-lg font-black" style={{ color: COLORS.accent }}>-RENT</span>
                            </div>
                        </Link>
                        <span className="hidden md:block text-xs font-semibold text-white px-3 py-1 rounded-full" style={{ backgroundColor: COLORS.accent }}>
                            Espace Agence
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* User Badge */}
                        <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #0044ff)` }}>
                                {agencyName?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-sm text-slate-800">{agencyName}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <MapPin size={10} /> {agencyCity}
                                </p>
                            </div>
                        </div>

                        {/* Notification */}
                        <button className="relative p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition">
                            <Bell className="w-5 h-5 text-slate-600" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2.5 bg-slate-50 rounded-xl"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu size={20} className="text-slate-600" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 items-start max-w-[1440px] mx-auto w-full relative">

                {/* --- SIDEBAR --- */}
                <aside className={`
                    fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 
                    transform transition-transform duration-300 ease-in-out
                    md:translate-x-0 md:static md:h-[calc(100vh-60px)] md:sticky md:top-[60px] md:flex md:flex-col py-8 rounded-br-3xl shadow-sm
                    ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
                `}>
                    <div className="px-6 mb-4 mt-16 md:mt-0">
                        {/* Header Mobile du menu */}
                        <div className="flex justify-between items-center md:hidden mb-6">
                            <span className="font-bold text-lg text-slate-800">Menu Agence</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="text-slate-500" />
                            </button>
                        </div>

                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Menu Principal</p>
                        <nav className="space-y-1">
                            {menuItems.map((item) => {
                                const isActive = item.tab === currentTab;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-blue-50 text-blue-600 shadow-sm border-r-4 border-blue-600'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                        <span className="flex-1 text-left">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="mt-auto px-6 pt-4 border-t border-slate-100">
                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Autres</p>
                        <nav className="space-y-1">
                            {/* Retour au Profil */}
                            <Link
                                href="/Profil"
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-400" />
                                Retour au Profil
                            </Link>

                            {/* Paramètres */}
                            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <Settings className="w-5 h-5 text-slate-400" />
                                Paramètres
                            </button>

                            {/* Déconnexion */}
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                Déconnexion
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Overlay sombre pour mobile */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-10 w-full">
                    {/* Header Mobile Only pour le titre et Menu */}
                    <div className="md:hidden mb-6 flex items-center gap-4">
                        <button
                            className="p-2 text-slate-600 bg-white rounded-lg shadow-sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-slate-900">{currentPage}</h2>
                    </div>

                    <div className="animate-fadeIn">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
