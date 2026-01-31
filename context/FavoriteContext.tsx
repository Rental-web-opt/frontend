"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoriteContextType {
    favorites: any[];
    toggleFavorite: (car: any) => void;
    isFavorite: (carId: number | string) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export function FavoriteProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<any[]>([]);

    // Charger les favoris au démarrage
    useEffect(() => {
        const savedFavorites = localStorage.getItem('easyrent_favorites');
        if (savedFavorites) {
            try {
                setFavorites(JSON.parse(savedFavorites));
            } catch (e) {
                console.error("Erreur lors du chargement des favoris", e);
            }
        }
    }, []);

    // Sauvegarder dès qu'ils changent
    useEffect(() => {
        localStorage.setItem('easyrent_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (car: any) => {
        setFavorites((prev) => {
            const exists = prev.find((fav) => fav.id === car.id);
            if (exists) {
                return prev.filter((fav) => fav.id !== car.id);
            } else {
                return [...prev, car];
            }
        });
    };

    const isFavorite = (carId: number | string) => {
        return favorites.some((fav) => fav.id === carId);
    };

    return (
        <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
}

export function useFavorite() {
    const context = useContext(FavoriteContext);
    if (context === undefined) {
        throw new Error('useFavorite must be used within a FavoriteProvider');
    }
    return context;
}
