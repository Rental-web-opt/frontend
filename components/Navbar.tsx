"use client";

import React, { useState } from 'react';
import { Heart, Settings, Car, Menu, X, Home, CarFront, Building2, HelpCircle, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from './NotificationBell';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const { protect, user } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Masquer la Navbar sur les pages d'auth ET les pages Admin (Admin a sa propre sidebar)
    if (pathname.startsWith('/Login') || pathname.startsWith('/Register') || pathname.startsWith('/Admin')) {
        return null;
    }

    const navLinks = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/CarsPage', label: 'Cars', icon: CarFront },
        { href: '/Agencies', label: 'Agencies', icon: Building2 },
        { href: '/Help', label: 'Help', icon: HelpCircle },
    ];

    return (
        <>
            <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-4 sm:px-6 md:px-12 py-3 md:py-4">
                <div className="flex items-center justify-between max-w-[1440px] mx-auto">

                    {/* Logo */}
                    <button
                        onClick={() => protect('/')}
                        className="text-xl md:text-2xl font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
                    >
                        <div className="bg-[#002AD7] text-white p-1 rounded-lg">
                            <Car size={20} className="md:w-6 md:h-6" />
                        </div>
                        <span className="text-[#002AD7]">EASY</span>
                        <span className="text-[#F76513]">-RENT</span>
                    </button>

                    {/* Liens de Navigation - Desktop */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => protect(link.href)}
                                className={`transition-colors ${pathname === link.href ? 'text-[#002AD7] font-bold' : 'hover:text-[#002AD7]'}`}
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    {/* Icônes d'Action */}
                    <div className="flex gap-2 sm:gap-4 items-center">

                        {/* 🔔 Notifications en temps réel */}
                        {user && <NotificationBell />}

                        {/* Favoris - Masqué sur très petit écran */}
                        <button
                            onClick={() => protect('/Favorites')}
                            className="hidden sm:flex p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                        >
                            <Heart size={18} />
                        </button>

                        {/* Settings - Masqué sur mobile */}
                        <button
                            onClick={() => protect('/Profil?tab=settings')}
                            className="hidden md:flex p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition text-slate-600"
                        >
                            <Settings size={18} />
                        </button>

                        {/* Avatar / Indicateur */}
                        <div
                            className="w-8 h-8 md:w-9 md:h-9 bg-[#F76513] rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs cursor-pointer"
                            onClick={() => protect('/Profil?tab=info')}
                        >
                            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>

                        {/* Bouton Menu Mobile */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition text-slate-600"
                        >
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Menu Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Menu Mobile Drawer */}
            <div className={`
                fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden
                ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="p-6">
                    {/* Header du menu */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#002AD7] text-white p-1.5 rounded-lg">
                                <Car size={18} />
                            </div>
                            <span className="font-bold text-lg">
                                <span className="text-[#002AD7]">EASY</span>
                                <span className="text-[#F76513]">-RENT</span>
                            </span>
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 rounded-lg hover:bg-slate-100 transition"
                        >
                            <X size={20} className="text-slate-500" />
                        </button>
                    </div>

                    {/* User Info */}
                    {user && (
                        <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#F76513] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {user.fullName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{user.fullName || 'Utilisateur'}</p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <nav className="space-y-2">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <button
                                    key={link.href}
                                    onClick={() => {
                                        protect(link.href);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all
                                        ${isActive
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-slate-600 hover:bg-slate-100'
                                        }
                                    `}
                                >
                                    <Icon size={20} />
                                    {link.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Divider */}
                    <div className="border-t border-slate-200 my-6"></div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                        <button
                            onClick={() => {
                                protect('/Favorites');
                                setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
                        >
                            <Heart size={20} />
                            Mes Favoris
                        </button>
                        <button
                            onClick={() => {
                                protect('/Profil?tab=info');
                                setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                        >
                            <User size={20} />
                            Mon Profil
                        </button>
                        <button
                            onClick={() => {
                                protect('/Profil?tab=settings');
                                setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                        >
                            <Settings size={20} />
                            Paramètres
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation Mobile (Fixed) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-2 py-2 safe-area-pb">
                <div className="flex justify-around items-center max-w-md mx-auto">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <button
                                key={link.href}
                                onClick={() => protect(link.href)}
                                className={`
                                    flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px]
                                    ${isActive
                                        ? 'text-blue-600'
                                        : 'text-slate-400 hover:text-slate-600'
                                    }
                                `}
                            >
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-[10px] font-semibold ${isActive ? 'text-blue-600' : ''}`}>
                                    {link.label}
                                </span>
                            </button>
                        );
                    })}
                    <button
                        onClick={() => protect('/Profil?tab=info')}
                        className={`
                            flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px]
                            ${pathname.startsWith('/Profil')
                                ? 'text-blue-600'
                                : 'text-slate-400 hover:text-slate-600'
                            }
                        `}
                    >
                        <User size={22} strokeWidth={pathname.startsWith('/Profil') ? 2.5 : 2} />
                        <span className={`text-[10px] font-semibold ${pathname.startsWith('/Profil') ? 'text-blue-600' : ''}`}>
                            Profil
                        </span>
                    </button>
                </div>
            </nav>
        </>
    );
}
