"use client";

import React from 'react';
import { Heart, Settings, Car } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from './NotificationBell';

import { usePathname } from 'next/navigation';

export default function Navbar() {
    const { protect, user } = useAuth();
    const pathname = usePathname();

    // Masquer la Navbar sur les pages d'auth
    if (pathname.startsWith('/Login') || pathname.startsWith('/Register')) {
        return null;
    }

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 md:px-12 py-4">
            <div className="flex items-center justify-between max-w-[1440px] mx-auto">

                {/* Logo */}
                <button
                    onClick={() => protect('/')}
                    className="text-2xl font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                    <div className="bg-[#002AD7] text-white p-1 rounded-lg">
                        <Car size={24} />
                    </div>
                    <span className="text-[#002AD7]">EASY</span>
                    <span className="text-[#F76513]">-RENT</span>
                </button>

                {/* Liens de Navigation */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                    <button
                        onClick={() => protect('/')}
                        className={`transition-colors ${pathname === '/' ? 'text-[#002AD7] font-bold' : 'hover:text-[#002AD7]'}`}
                    >
                        Home
                    </button>
                    <button onClick={() => protect('/CarsPage')} className={pathname === '/CarsPage' ? 'text-[#002AD7] font-bold' : 'hover:text-[#002AD7] transition-colors'}>Cars</button>
                    <button onClick={() => protect('/Agencies')} className={pathname === '/Agencies' ? 'text-[#002AD7] font-bold' : 'hover:text-[#002AD7] transition-colors'}>Agencies</button>
                    <button onClick={() => protect('/Help')} className={pathname === '/Help' ? 'text-[#002AD7] font-bold' : 'hover:text-[#002AD7] transition-colors'}>Help</button>
                </nav>

                {/* Icônes d'Action */}
                <div className="flex gap-4 items-center pl-4 border-l border-slate-200 ml-4">

                    {/* 🔔 Notifications en temps réel */}
                    {user && <NotificationBell />}

                    <button
                        onClick={() => protect('/Favorites')}
                        className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    >
                        <Heart size={20} />
                    </button>

                    <button
                        onClick={() => protect('/Profil?tab=settings')}
                        className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition text-slate-600"
                    >
                        <Settings size={20} />
                    </button>

                    {/* Avatar / Indicateur */}
                    <div className="w-9 h-9 bg-[#F76513] rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs cursor-pointer" onClick={() => protect('/Profil?tab=info')}>
                        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
}
