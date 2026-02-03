"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";
import Image from "next/image";
import {
    LayoutDashboard,
    Car,
    Clock,
    LogOut,
    Settings,
    Bell,
    Menu,
    X,
    ArrowLeft,
    Navigation,
    Star,
    Power
} from "lucide-react";

// Couleurs de la charte graphique
const COLORS = {
    primary: "#002AD7",
    accent: "#F76513",
};

interface DriverLayoutProps {
    children: ReactNode;
    driverName?: string;
    driverImage?: string;
    driverRating?: number;
    isAvailable?: boolean;
    onToggleAvailability?: () => void;
}

export default function DriverLayout({
    children,
    driverName = "Chauffeur",
    driverImage,
    driverRating,
    isAvailable = true,
    onToggleAvailability
}: DriverLayoutProps) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'dashboard';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { name: "Tableau de Bord", path: "/Dashboard/Driver", tab: "dashboard", icon: LayoutDashboard },
        { name: "Courses en cours", path: "/Dashboard/Driver?tab=courses", tab: "courses", icon: Navigation },
        { name: "Historique", path: "/Dashboard/Driver?tab=history", tab: "history", icon: Clock },
    ];

    const currentPage = menuItems.find(item => item.tab === currentTab)?.name || "Dashboard Chauffeur";

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
                        <span className="hidden md:block text-xs font-semibold text-white px-3 py-1 rounded-full" style={{ backgroundColor: COLORS.primary }}>
                            Espace Chauffeur
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Toggle Disponibilité */}
                        <button
                            onClick={onToggleAvailability}
                            className={`hidden md:flex px-4 py-2 rounded-xl font-semibold text-sm items-center gap-2 transition border ${isAvailable
                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                }`}
                        >
                            <Power size={16} />
                            {isAvailable ? 'En service' : 'Hors service'}
                        </button>

                        {/* User Badge */}
                        <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl">
                            <div className="w-8 h-8 rounded-full overflow-hidden relative">
                                {driverImage ? (
                                    <Image src={driverImage} fill className="object-cover" alt="" />
                                ) : (
                                    <div className="w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #0044ff)` }}>
                                        {driverName?.charAt(0).toUpperCase() || "C"}
                                    </div>
                                )}
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-sm text-slate-800">{driverName}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`flex items-center gap-1 text-xs ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        {isAvailable ? 'Disponible' : 'Indisponible'}
                                    </span>
                                    {driverRating && (
                                        <span className="flex items-center gap-1 text-xs text-slate-500">
                                            <Star size={10} className="text-yellow-500 fill-yellow-500" /> {driverRating}
                                        </span>
                                    )}
                                </div>
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
                            <span className="font-bold text-lg text-slate-800">Menu Chauffeur</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="text-slate-500" />
                            </button>
                        </div>

                        {/* Profil Card Mobile */}
                        <div className="md:hidden mb-6 p-4 rounded-xl" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #0044ff)` }}>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-white/30">
                                    {driverImage ? (
                                        <Image src={driverImage} fill className="object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-lg font-bold">
                                            {driverName?.charAt(0) || "C"}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{driverName}</p>
                                    <div className="flex items-center gap-2">
                                        {driverRating && (
                                            <span className="flex items-center gap-1 text-xs text-white/80">
                                                <Star size={10} className="text-yellow-400 fill-yellow-400" /> {driverRating}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onToggleAvailability}
                                className={`mt-3 w-full py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 ${isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                    }`}
                            >
                                <Power size={14} />
                                {isAvailable ? 'En service' : 'Hors service'}
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
