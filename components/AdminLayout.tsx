"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const menuItems = [
        { name: "📊 Tableau de Bord", path: "/Admin", icon: "📊" },
        { name: "👥 Utilisateurs", path: "/Admin/Users", icon: "👥" },
        { name: "🏢 Agences", path: "/Admin/Agencies", icon: "🏢" },
        { name: "🚗 Voitures", path: "/Admin/Cars", icon: "🚗" },
        { name: "📅 Réservations", path: "/Admin/Bookings", icon: "📅" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-2xl z-50">
                <div className="p-6 border-b border-blue-700">
                    <h1 className="text-2xl font-bold">🛡️ Admin Panel</h1>
                    <p className="text-blue-200 text-sm mt-1">{user?.fullName}</p>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? "bg-white text-blue-900 shadow-lg font-semibold"
                                        : "hover:bg-blue-700 text-blue-100"
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.name.replace(/^[^\s]+ /, "")}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
                    <button
                        onClick={logout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
                    >
                        🚪 Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
