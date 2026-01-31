"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Car, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios'; // Assurez-vous d'avoir installé axios (npm install axios)
import { useAuth } from '@/context/AuthContext'; // Pour la connexion auto

export default function RegisterForm() {
  const router = useRouter();
  // On récupère la méthode login pour connecter l'utilisateur directement après l'inscription
  // Si useAuth n'est pas encore dispo, vous pouvez retirer cette ligne et la partie login()
  const { login } = useAuth(); 

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState(""); // Pour l'erreur générale
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Effacer l'erreur serveur dès qu'on modifie quelque chose
    if (serverError) setServerError("");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis.';
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide.";
    }
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      // ÉTAPE 1 : INSCRIPTION
      // On envoie les infos pour créer le compte en base
      await axios.post("http://localhost:8081/api/auth/register", {
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: "USER"
      });

      // ÉTAPE 2 : CONNEXION AUTOMATIQUE (Auto-Login)
      // C'est ici qu'on récupère le VRAI objet User avec l'ID et le Rôle
      const loginResponse = await axios.post("http://localhost:8081/api/auth/login", {
        email: formData.email,
        password: formData.password
      });

      // ÉTAPE 3 : SUCCÈS & REDIRECTION
      setSuccess(true);
      
      // On envoie l'utilisateur complet au Context
      // Le Context va lire le rôle et rediriger vers la bonne page (Accueil ou Dashboard)
      if (login) {
          login(loginResponse.data); // Ne pas passer response.data du register !
      }

    } catch (err: any) {
      console.error("Erreur:", err);
      const msg = err.response?.data?.message || "Impossible de contacter le serveur.";
      setServerError(String(msg));
      setIsSubmitting(false); // On arrête le chargement seulement si erreur
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center max-w-md w-full animate-fade-in">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Bienvenue !</h2>
          <p className="text-slate-500 mb-6">Votre compte a été créé avec succès.</p>
          <p className="text-sm text-blue-600 font-bold animate-pulse">Redirection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-10 w-full max-w-md animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-2xl shadow-lg">
              <Car size={40} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Créer un compte</h2>
          <p className="text-slate-500 text-base">Rejoignez EASY-RENT maintenant.</p>
        </div>

        {/* Message d'erreur serveur (Rouge) */}
        {serverError && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <span className="font-medium">{serverError}</span>
            </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-2 gap-4">
            {/* Prénom */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Prénom</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.firstName ? 'border-red-300' : 'border-slate-200'}`}
                    placeholder="Jean"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName}</p>}
            </div>
            {/* Nom */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Nom</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.lastName ? 'border-red-300' : 'border-slate-200'}`}
                    placeholder="Fred"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.email ? 'border-red-300' : 'border-slate-200'}`}
                placeholder="exemple@mail.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Mot de passe</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.password ? 'border-red-300' : 'border-slate-200'}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 mt-4 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Créer mon compte'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
                Déjà inscrit ? <span onClick={() => router.push('/Login')} className="text-blue-600 font-bold cursor-pointer hover:underline">Se connecter</span>
            </p>
        </div>

      </div>
    </div>
  );
}