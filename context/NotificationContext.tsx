"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface Notification {
    id: string;
    type: "booking" | "info" | "success" | "error";
    message: string;
    timestamp: Date;
    read: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAllAsRead: () => void;
    clearNotification: (id: string) => void;
    connected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [connected, setConnected] = useState(false);

    const addNotification = useCallback((type: string, message: string) => {
        const newNotif: Notification = {
            id: Date.now().toString(),
            type: type as any,
            message,
            timestamp: new Date(),
            read: false,
        };
        setNotifications((prev) => [newNotif, ...prev].slice(0, 50)); // On garde les 50 dernières
    }, []);

    useEffect(() => {
        if (!user?.id) return;

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
    }, [user?.id, addNotification]);

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const clearNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, clearNotification, connected }}>
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
