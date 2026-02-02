"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { notificationService, isMockMode } from '@/services/api';

export interface Notification {
    id: string;
    type: "booking" | "info" | "success" | "error" | "payment" | "promo";
    title?: string;
    message: string;
    timestamp: Date;
    read: boolean;
    data?: any;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAllAsRead: () => void;
    clearNotification: (id: string) => void;
    addNotification: (type: string, message: string, title?: string) => void;
    connected: boolean;
    refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [connected, setConnected] = useState(false);

    const addNotification = useCallback((type: string, message: string, title?: string) => {
        const newNotif: Notification = {
            id: Date.now().toString(),
            type: type as any,
            title,
            message,
            timestamp: new Date(),
            read: false,
        };
        setNotifications((prev) => [newNotif, ...prev].slice(0, 50)); // On garde les 50 dernières
    }, []);

    // Fonction pour charger les notifications depuis l'API (mock ou réel)
    const loadNotifications = useCallback(async () => {
        if (!user?.id) return;

        try {
            const response = await notificationService.getByUser(user.id);
            const apiNotifications = response.data.map((n: any) => ({
                id: n.id.toString(),
                type: n.type?.toLowerCase() || "info",
                title: n.title,
                message: n.message,
                timestamp: new Date(n.createdAt),
                read: n.read,
                data: n.data,
            }));
            setNotifications(apiNotifications);
        } catch (error) {
            console.log("Erreur chargement notifications:", error);
        }
    }, [user?.id]);

    // Rafraîchir les notifications
    const refreshNotifications = useCallback(() => {
        loadNotifications();
    }, [loadNotifications]);

    useEffect(() => {
        if (!user?.id) return;

        // Charger les notifications initiales
        loadNotifications();

        // En mode mock (Vercel), on simule les notifications avec un polling
        if (isMockMode()) {
            console.log(`🔔 Mode démo: Notifications simulées pour user ${user.id}`);
            setConnected(true);

            // Rafraîchir toutes les 5 secondes en mode démo
            const interval = setInterval(() => {
                loadNotifications();
            }, 5000);

            return () => clearInterval(interval);
        }

        // En mode réel (local avec backend), utiliser SSE
        console.log(`🔌 Initialisation SSE pour user ${user.id} depuis le Contexte`);

        const eventSource = new EventSource(
            `http://localhost:8081/api/notifications/stream/${user.id}`,
            { withCredentials: true }
        );

        eventSource.onopen = () => setConnected(true);

        eventSource.addEventListener("connected", (event) => console.log("✅ SSE:", event.data));
        eventSource.addEventListener("notification", (event) => addNotification("info", event.data));
        eventSource.addEventListener("booking", (event) => addNotification("booking", event.data));
        eventSource.addEventListener("success", (event) => addNotification("success", event.data));
        eventSource.addEventListener("payment", (event) => addNotification("payment", event.data));

        eventSource.addEventListener("error", (event) => {
            if (eventSource.readyState === EventSource.CLOSED) {
                setConnected(false);
            }
        });

        eventSource.onerror = () => {
            console.log("❌ Erreur SSE");
            setConnected(false);
        };

        return () => {
            eventSource.close();
            setConnected(false);
        };
    }, [user?.id, addNotification, loadNotifications]);

    const markAllAsRead = async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

        // Marquer comme lu côté API
        if (user?.id) {
            try {
                await notificationService.markAllAsRead(user.id);
            } catch (error) {
                console.log("Erreur markAllAsRead:", error);
            }
        }
    };

    const clearNotification = async (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));

        // Marquer comme lu côté API
        try {
            await notificationService.markAsRead(parseInt(id));
        } catch (error) {
            console.log("Erreur clearNotification:", error);
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAllAsRead,
            clearNotification,
            addNotification,
            connected,
            refreshNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
