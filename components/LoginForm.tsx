"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/services/api"; // <--- IMPORT AJOUTÉ (Indispensable)

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  
  // États
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Appel API Login
      // L'URL doit correspondre à votre AuthController Java ("/auth/login")
      const response = await api.post('/auth/login', { 
          email: formData.email, 
          password: formData.password 
      });
      
      console.log("Réponse Login :", response.data);

      // On passe l'objet utilisateur COMPLET au contexte
      // Cela permet d'avoir accès à user.id, user.role, etc.
      login(response.data); 

      // La redirection est gérée dans login() du AuthContext, 
      // mais on peut forcer ici si besoin :
      // router.push('/Profil');

    } catch (err: any) {
      console.error("Erreur login", err);
      // Récupération du message d'erreur envoyé par le backend (Map.of("message", ...))
      const msg = err.response?.data?.message || "Email ou mot de passe incorrect.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 min-h-[500px] flex flex-col justify-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Se connecter</h1>
        <p className="text-slate-500 text-sm">Accédez à votre compte EASY-RENT.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm mb-6 flex items-center gap-2 animate-pulse">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="email" 
              required 
              placeholder="exemple@mail.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type={showPassword ? 'text' : 'password'} 
              required 
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-12 py-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition"
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link href="#" className="text-xs font-bold text-blue-600 hover:underline">Mot de passe oublié ?</Link>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Se connecter"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm">
          Pas encore de compte ?{" "}
          <Link href="/Register" className="text-blue-600 font-bold hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}