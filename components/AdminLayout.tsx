"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard, Users, Car, CalendarCheck,
    Settings, LogOut, ChevronRight, Building2,
    Menu, X, ShieldCheck, UserCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };

        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/Login');
    };

    const navItems = [
        { name: "Tableau de Bord", href: "/Admin", icon: LayoutDashboard },
        { name: "Utilisateurs", href: "/Admin/Users", icon: Users },
        { name: "Agences", href: "/Admin/Agencies", icon: Building2 },
        { name: "Voitures", href: "/Admin/Cars", icon: Car },
        { name: "Chauffeurs", href: "/Admin/Drivers", icon: UserCheck },
        { name: "Réservations", href: "/Admin/Bookings", icon: CalendarCheck },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">

            {/* Overlay mobile */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static top-0 left-0 z-50 h-screen bg-white border-r border-slate-200 shadow-xl transition-all duration-300 ease-in-out flex flex-col
                    ${isSidebarOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"}
                    ${isMobile ? "w-72" : ""}
                `}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
                    <div className={`flex items-center gap-2 overflow-hidden whitespace-nowrap transition-all duration-300 ${!isSidebarOpen && !isMobile ? "opacity-0 w-0" : "opacity-100"}`}>
                        <div className="w-8 h-8 bg-[#002AD7] rounded-lg flex items-center justify-center text-white">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="font-black text-xl tracking-tight text-[#002AD7]">EASY<span className="text-[#F76513]">-RENT</span></span>
                        <span className="ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wider">Admin</span>
                    </div>
                    {isMobile && (
                        <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* User Profile Summary */}
                <div className={`p-4 border-b border-slate-100 ${!isSidebarOpen && !isMobile ? "hidden" : ""}`}>
                    <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#002AD7] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
                            {user?.fullName?.charAt(0) || "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{user?.fullName || "Admin"}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                                    ${isActive
                                        ? "bg-[#002AD7] text-white shadow-lg shadow-blue-500/30"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-[#002AD7]"
                                    }
                                `}
                                title={!isSidebarOpen && !isMobile ? item.name : ""}
                            >
                                <div className={`flex items-center justify-center w-6 h-6 ${!isSidebarOpen && !isMobile ? "mx-auto" : ""}`}>
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={`font-medium whitespace-nowrap transition-all duration-300 ${!isSidebarOpen && !isMobile ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}`}>
                                    {item.name}
                                </span>
                                {isActive && isSidebarOpen && (
                                    <ChevronRight size={16} className="ml-auto opacity-50" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Controls */}
                <div className="p-4 border-t border-slate-200 space-y-2">
                    <Link
                        href="/Profil"
                        className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-[#002AD7] transition-all
                            ${!isSidebarOpen && !isMobile ? "justify-center" : ""}
                        `}
                        title="Retour au site"
                    >
                        <Settings size={20} />
                        <span className={`${!isSidebarOpen && !isMobile ? "hidden" : "font-medium"}`}>Retour au site</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all
                            ${!isSidebarOpen && !isMobile ? "justify-center" : ""}
                        `}
                        title="Déconnexion"
                    >
                        <LogOut size={20} />
                        <span className={`${!isSidebarOpen && !isMobile ? "hidden" : "font-medium"}`}>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Topbar mobile */}
                <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:hidden z-30 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg">
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-lg text-slate-900">Admin Console</span>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
