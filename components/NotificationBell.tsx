"use client";

import React, { useState } from "react";
import { Bell, X, Check, AlertCircle, Info } from "lucide-react";
import { useNotification, Notification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";

export default function NotificationBell() {
    const { notifications, unreadCount, markAllAsRead, clearNotification, connected } = useNotification();
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <Check className="w-4 h-4 text-green-500" />;
            case "error": return <AlertCircle className="w-4 h-4 text-red-500" />;
            case "booking": return <Bell className="w-4 h-4 text-blue-500" />;
            default: return <Info className="w-4 h-4 text-slate-500" />;
        }
    };

    return (
        <div className="relative">
            {/* Bouton cloche */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
                <Bell className={`w-6 h-6 ${connected ? "text-slate-700" : "text-slate-400"}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
                {connected && (
                    <span className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                )}
            </button>

            {/* Dropdown des notifications */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline">
                                Tout marquer comme lu
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-slate-400">
                                <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p>Aucune notification</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div key={notif.id} className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${!notif.read ? "bg-blue-50/50" : ""}`}>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">{getIcon(notif.type)}</div>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-700">{notif.message}</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {notif.timestamp.toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <button onClick={() => clearNotification(notif.id)} className="text-slate-400 hover:text-slate-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Bouton voir toutes les notifications */}
                    <div className="p-3 border-t border-slate-100 bg-slate-50">
                        <button
                            onClick={() => {
                                setShowDropdown(false);
                                router.push('/Profil?tab=notifications');
                            }}
                            className="w-full py-2 text-sm font-semibold text-[#002AD7] hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            Voir toutes les notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
