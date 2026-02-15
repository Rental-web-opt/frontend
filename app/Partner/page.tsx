"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Building2, Car, CheckCircle, AlertCircle, Clock, MapPin, Phone, Mail, User, Shield, Info } from 'lucide-react';

// Types simplifiés pour le formulaire
interface AgencyFormData {
    name: string;
    city: string;
    location: string;
    description: string;
    phone: string;
    email: string;
    website: string;
    openingHours: string;
}

interface DriverFormData {
    fullName: string;
    age: number;
    experience: number;
    location: string;
    licenseNumber: string;
    pricePerDay: number;
    bio: string;
    phone: string;
    email: string;
}

export default function PartnerPage() {
    const { user, login } = useAuth(); // isAuthenticated removed
    const router = useRouter();
    const searchParams = useSearchParams();

    // Déterminer l'onglet actif via l'URL (?type=driver ou ?type=agency)
    const initialTab = searchParams.get('type') === 'driver' ? 'driver' : 'agency';
    const [activeTab, setActiveTab] = useState<'agency' | 'driver'>(initialTab);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Redirection si non connecté
    useEffect(() => {
        // Simple check sur user
        if (!user && !loading) {
            // On laisse un petit délai ou on redirige direct
            // router.push('/Login'); // Géré par protect() ou rendu conditionnel
        }
    }, [user, router, loading]);

    // Redirection si déjà partenaire
    useEffect(() => {
        if (user) {
            if (user.role === 'AGENCY') {
                router.push('/Dashboard/Agency'); // Modifié pour pointer vers le bon dashboard
            } else if (user.role === 'DRIVER') {
                router.push('/Dashboard/Driver');
            }
        }
    }, [user, router]);

    // États des formulaires
    const [agencyData, setAgencyData] = useState<AgencyFormData>({
        name: '',
        city: 'Douala',
        location: '',
        description: '',
        phone: '',
        email: '',
        website: '',
        openingHours: 'Lun-Ven: 08h-18h, Sam: 09h-14h'
    });

    const [driverData, setDriverData] = useState<DriverFormData>({
        fullName: user?.fullName || '',
        age: 25,
        experience: 2,
        location: 'Douala',
        licenseNumber: '',
        pricePerDay: 15000,
        bio: '',
        phone: '',
        email: user?.email || ''
    });

    const handleAgencySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("🏢 Tentative de soumission Agence...");

        if (!user || !user.id) {
            console.error("❌ Erreur: ID utilisateur manquant", user);
            setError("Erreur : Utilisateur non identifié. Veuillez vous reconnecter.");
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            ...agencyData,
            isOpen: true
        };
        console.log("📦 Payload Agence envoyé:", payload);

        try {
            console.log(`🔌 Envoi POST vers /api/agencies/${user.id}/become-agency`);
            const response = await fetch(`http://localhost:8081/api/agencies/${user.id}/become-agency`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            console.log("📨 Réponse statut:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Erreur Backend:", errorData);
                throw new Error(errorData.error || `Erreur serveur (${response.status})`);
            }

            setSuccess("Félicitations ! Votre compte est maintenant une Agence. Vous allez être redirigé...");

            // Mettre à jour le contexte utilisateur localement
            if (user) {
                const updatedUser = { ...user, role: 'AGENCY' };
                login(updatedUser);
            }

            setTimeout(() => {
                router.push('/Dashboard/Agency');
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDriverSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("🚗 Tentative de soumission Chauffeur...");

        if (!user || !user.id) {
            console.error("❌ Erreur: ID utilisateur manquant", user);
            setError("Erreur : Utilisateur non identifié. Veuillez vous reconnecter.");
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            ...driverData,
            available: true,
            rating: 5.0,
            reviewCount: 0,
            languages: ["Français", "Anglais"]
        };
        console.log("📦 Payload envoyé:", payload);

        try {
            console.log(`🔌 Envoi POST vers /api/drivers/${user.id}/become-driver`);
            const response = await fetch(`http://localhost:8081/api/drivers/${user.id}/become-driver`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            console.log("📨 Réponse statut:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Erreur Backend:", errorData);
                throw new Error(errorData.error || `Erreur serveur (${response.status})`);
            }

            setSuccess("Félicitations ! Votre compte est maintenant un Chauffeur. Vous allez être redirigé...");

            // Mettre à jour le contexte utilisateur localement
            if (user) {
                const updatedUser = { ...user, role: 'DRIVER' };
                login(updatedUser);
            }

            setTimeout(() => {
                router.push('/Dashboard/Driver');
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900">Devenir Partenaire Easy-Rent</h1>
                    <p className="mt-2 text-slate-600">Rejoignez notre réseau et commencez à gagner de l'argent avec votre flotte ou vos compétences.</p>
                </div>

                {/* Onglets */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('agency')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'agency'
                            ? 'bg-[#002AD7] text-white shadow-lg scale-105'
                            : 'bg-white text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        <Building2 size={20} />
                        Devenir Agence
                    </button>
                    <button
                        onClick={() => setActiveTab('driver')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'driver'
                            ? 'bg-[#002AD7] text-white shadow-lg scale-105'
                            : 'bg-white text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        <User size={20} />
                        Devenir Chauffeur
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                        <CheckCircle size={20} /> {success}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                    {/* FORMULAIRE AGENCE */}
                    {activeTab === 'agency' && (
                        <form onSubmit={handleAgencySubmit} className="p-8 space-y-6">
                            <div className="border-b border-slate-100 pb-4 mb-6">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Building2 className="text-[#002AD7]" /> Informations de l'Agence
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Créez votre agence pour gérer votre flotte de véhicules.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nom de l'agence *</label>
                                    <input
                                        required
                                        type="text"
                                        value={agencyData.name}
                                        onChange={(e) => setAgencyData({ ...agencyData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002AD7] outline-none"
                                        placeholder="Ex: AutoLux Douala"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Ville *</label>
                                    <select
                                        value={agencyData.city}
                                        onChange={(e) => setAgencyData({ ...agencyData, city: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002AD7] outline-none"
                                    >
                                        <option value="Douala">Douala</option>
                                        <option value="Yaoundé">Yaoundé</option>
                                        <option value="Bafoussam">Bafoussam</option>
                                        <option value="Kribi">Kribi</option>
                                        <option value="Garoua">Garoua</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Adresse / Localisation *</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input
                                            required
                                            type="text"
                                            value={agencyData.location}
                                            onChange={(e) => setAgencyData({ ...agencyData, location: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002AD7] outline-none"
                                            placeholder="Ex: Akwa, Boulevard de la Liberté"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input
                                            required
                                            type="tel"
                                            value={agencyData.phone}
                                            onChange={(e) => setAgencyData({ ...agencyData, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002AD7] outline-none"
                                            placeholder="+237 ..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Contact</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            value={agencyData.email}
                                            onChange={(e) => setAgencyData({ ...agencyData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002AD7] outline-none"
                                            placeholder={user?.email || "contact@agence.com"}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                    <textarea
                                        value={agencyData.description}
                                        onChange={(e) => setAgencyData({ ...agencyData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002AD7] outline-none h-24"
                                        placeholder="Décrivez votre agence et vos services..."
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Horaires d'ouverture</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={agencyData.openingHours}
                                            onChange={(e) => setAgencyData({ ...agencyData, openingHours: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002AD7] outline-none"
                                            placeholder="Ex: Lun-Sam: 08h-18h"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Vous pourrez configurer des horaires détaillés plus tard dans votre espace agence.</p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#002AD7] text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {loading ? "Traitement..." : "Créer mon Agence"}
                            </button>
                        </form>
                    )}

                    {/* FORMULAIRE CHAUFFEUR */}
                    {activeTab === 'driver' && (
                        <form onSubmit={handleDriverSubmit} className="p-8 space-y-6">
                            <div className="border-b border-slate-100 pb-4 mb-6">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <User className="text-[#002AD7]" /> Profil Chauffeur Professionnel
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Devenez chauffeur et proposez vos services aux clients Easy-Rent.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nom Complet *</label>
                                    <input
                                        required
                                        type="text"
                                        value={driverData.fullName}
                                        onChange={(e) => setDriverData({ ...driverData, fullName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002AD7] outline-none"
                                        placeholder="Votre nom complet"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Ville de résidence *</label>
                                    <select
                                        value={driverData.location}
                                        onChange={(e) => setDriverData({ ...driverData, location: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002AD7] outline-none"
                                    >
                                        <option value="Douala">Douala</option>
                                        <option value="Yaoundé">Yaoundé</option>
                                        <option value="Bafoussam">Bafoussam</option>
                                        <option value="Kribi">Kribi</option>
                                        <option value="Garoua">Garoua</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Âge *</label>
                                    <input
                                        required
                                        type="number"
                                        min="21"
                                        max="70"
                                        value={driverData.age}
                                        onChange={(e) => setDriverData({ ...driverData, age: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002AD7] outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Années d'expérience *</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        value={driverData.experience}
                                        onChange={(e) => setDriverData({ ...driverData, experience: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002AD7] outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Numéro de Permis *</label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input
                                            required
                                            type="text"
                                            value={driverData.licenseNumber}
                                            onChange={(e) => setDriverData({ ...driverData, licenseNumber: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002AD7] outline-none"
                                            placeholder="N° Permis de conduire"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Prix par jour (FCFA) *</label>
                                    <input
                                        required
                                        type="number"
                                        step="500"
                                        value={driverData.pricePerDay}
                                        onChange={(e) => setDriverData({ ...driverData, pricePerDay: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002AD7] outline-none font-bold text-[#002AD7]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone *</label>
                                    <input
                                        required
                                        type="tel"
                                        value={driverData.phone}
                                        onChange={(e) => setDriverData({ ...driverData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002AD7] outline-none"
                                        placeholder="+237 ..."
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Biographie / Présentation</label>
                                    <textarea
                                        value={driverData.bio}
                                        onChange={(e) => setDriverData({ ...driverData, bio: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#002AD7] outline-none h-24"
                                        placeholder="Parlez de vous, votre expérience, vos spécialités..."
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#002AD7] text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {loading ? "Traitement..." : "Devenir Chauffeur"}
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
}

