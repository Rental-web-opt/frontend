"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedAdminRouteProps {
    children: ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            // Si l'utilisateur n'est pas connecté
            if (!user) {
                router.push("/Login");
                return;
            }

            // Si l'utilisateur n'est pas admin
            if (user.role !== "ADMIN") {
                alert("⛔ Accès refusé : Vous devez être administrateur pour accéder à cette page.");
                router.push("/");
                return;
            }
        }
    }, [user, isLoading, router]);

    // Pendant le chargement
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Vérification des permissions...</p>
                </div>
            </div>
        );
    }

    // Si pas connecté ou pas admin, on n'affiche rien (redirection en cours)
    if (!user || user.role !== "ADMIN") {
        return null;
    }

    // Si tout est OK, afficher le contenu
    return <>{children}</>;
}
