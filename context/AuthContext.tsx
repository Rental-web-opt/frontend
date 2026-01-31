"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: any) => void;
  logout: () => void;
  protect: (redirectUrl: string) => void; // <--- AJOUT DE LA FONCTION PROTECT
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("user");
        }
      } catch (e) {
        console.error("Erreur lecture user localStorage", e);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: any) => {
    if (!userData || !userData.id) {
      console.error("Erreur Login : L'objet utilisateur ne contient pas d'ID", userData);
      return;
    }
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // Redirection selon le rôle
    if (userData.role === 'ADMIN') router.push('/Admin');
    else if (userData.role === 'AGENCY') router.push('/Dashboard/Agency');
    else if (userData.role === 'DRIVER') router.push('/Dashboard/Driver');
    else router.push('/Profil');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/Login");
  };

  // --- NOUVELLE FONCTION PROTECT ---
  const protect = (redirectUrl: string) => {
    if (!user) {
      // Si pas connecté, on redirige vers Login (on pourrait passer l'URL de retour en paramètre)
      router.push("/Login");
    } else {
      // Si connecté, on va vers la page demandée
      router.push(redirectUrl);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, protect, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};