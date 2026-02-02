"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import {
    LayoutDashboard,
    Users,
    Building2,
    Car,
    CalendarCheck,
    LogOut,
    Settings,
    ShieldCheck,
    Bell,
    Search,
    Menu,
    X,
    ArrowLeft,
    UserCircle
} from "lucide-react";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { name: "Tableau de Bord", path: "/Admin", icon: LayoutDashboard },
        { name: "Utilisateurs", path: "/Admin/Users", icon: Users },
        { name: "Agences", path: "/Admin/Agencies", icon: Building2 },
        { name: "Chauffeurs", path: "/Admin/Drivers", icon: UserCircle },
        { name: "Voitures", path: "/Admin/Cars", icon: Car },
        { name: "Réservations", path: "/Admin/Bookings", icon: CalendarCheck },
    ];

    const currentPage = menuItems.find(item => item.path === pathname)?.name || "Administration";

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            {/* Top Navigation Bar - Style Profil */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-3">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-gradient-to-br from-[#002AD7] to-[#0044ff] rounded-xl flex items-center justify-center">
                                <ShieldCheck size={20} className="text-white" />
                            </div>
                            <div>
                                <span className="text-lg font-black text-[#002AD7]">EASY</span>
                                <span className="text-lg font-black text-[#F76513]">-RENT</span>
                            </div>
                        </Link>
                        <span className="hidden md:block text-xs font-semibold text-white bg-[#002AD7] px-3 py-1 rounded-full">
                            Admin Console
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* User Badge */}
                        <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#002AD7] to-[#0044ff] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                {user?.fullName?.charAt(0).toUpperCase() || "A"}
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-sm text-slate-800">{user?.fullName || "Admin"}</p>
                                <p className="text-xs text-slate-500">{user?.email}</p>
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

                {/* --- SIDEBAR (Style Profil) --- */}
                <aside className={`
                    fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 
                    transform transition-transform duration-300 ease-in-out
                    md:translate-x-0 md:static md:h-[calc(100vh-60px)] md:sticky md:top-[60px] md:flex md:flex-col py-8 rounded-br-3xl shadow-sm
                    ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
                `}>
                    <div className="px-6 mb-4 mt-16 md:mt-0">
                        {/* Header Mobile du menu */}
                        <div className="flex justify-between items-center md:hidden mb-6">
                            <span className="font-bold text-lg text-slate-800">Menu Admin</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="text-slate-500" />
                            </button>
                        </div>

                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Menu Principal</p>
                        <nav className="space-y-1">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.path;
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

                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Tableau de Bord</h1>
                            <p className="text-slate-500 mt-1 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Gérez votre plateforme de location
                            </p>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-100 shadow-sm text-slate-700"
                                />
                            </div>
                        </div>
                    </header>

                    <div className="animate-fadeIn">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
