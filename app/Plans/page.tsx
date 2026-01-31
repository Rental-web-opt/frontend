"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, X, Crown, Car, Building2, UserCheck, ArrowLeft, Key, CalendarClock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function PlansPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Location Standard",
      price: "Gratuit",
      period: "",
      description: "Payez uniquement quand vous louez un véhicule.",
      features: [
        "Accès à tout le catalogue",
        "Réservation instantanée",
        "Support client standard",
        "Assurance de base incluse",
      ],
      notIncluded: ["Tarifs préférentiels", "Véhicule dédié", "Livraison gratuite"],
      icon: Car,
      color: "blue",
      actionLabel: "Plan actuel",
      actionLink: "/",
      isCurrent: user?.role === "USER" && !user?.role.includes("AGENCY") && !user?.role.includes("DRIVER"), 
    },
    {
      name: "Abonnement Auto", 
      price: isAnnual ? "250 000" : "25 000",
      currency: "FCFA", 
      period: isAnnual ? "/an" : "/mois", 
      description: "Accédez aux véhicules en location longue durée.",
      features: [
        "Accès aux tarifs 'Longue Durée'",
        "Véhicule de remplacement inclus",
        "Entretien & Assurance Tout Risque",
        "Kilométrage illimité",
        "Livraison du véhicule à domicile"
      ],
      notIncluded: [],
      icon: Key, 
      color: "purple",
      actionLabel: "S'abonner",
      actionLink: "/CarsPage?filter=subscription", 
      isCurrent: false, 
      popular: true,
    },
    {
      name: "Chauffeur Pro",
      price: "15% com.", 
      period: "sur les courses",
      description: "Devenez chauffeur certifié et gagnez de l'argent.",
      features: [
        "Accès au Dashboard Chauffeur",
        "Réception de courses en temps réel",
        "Paiements hebdomadaires",
        "Badge 'Chauffeur Vérifié'",
        "Support prioritaire"
      ],
      notIncluded: ["Gestion de flotte"],
      icon: UserCheck,
      color: "green",
      actionLabel: "Devenir Chauffeur",
      actionLink: "/Dashboard/Upgrade/Driver",
      isCurrent: user?.role === "DRIVER",
    },
    {
      name: "Partenaire Agence",
      price: isAnnual ? "240 000" : "25 000",
      currency: "FCFA",
      period: isAnnual ? "/an" : "/mois",
      description: "Pour les loueurs pro gérant plusieurs véhicules.",
      features: [
        "Dashboard Agence complet",
        "Gestion illimitée de véhicules",
        "Statistiques avancées",
        "Support 24/7",
        "Top visibilité sur le site",
      ],
      notIncluded: [],
      icon: Building2,
      color: "orange",
      actionLabel: "Devenir Agence",
      actionLink: "/Dashboard/Upgrade/Agency",
      isCurrent: user?.role === "AGENCY",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto mb-8">
        <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
        >
            <ArrowLeft size={20} /> Retour
        </button>
      </div>

      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">Nos Offres & Abonnements</h2>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">
          Une solution pour chaque besoin
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">
          Louez ponctuellement, abonnez-vous pour le mois, ou devenez partenaire.
        </p>
      </div>

      <div className="flex justify-center mb-16">
        <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 inline-flex relative shadow-sm">
            <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative z-10 ${
                    !isAnnual 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
                Mensuel
            </button>
            <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative z-10 flex items-center gap-2 ${
                    isAnnual 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
                Annuel
                <span className={`absolute -top-3 -right-3 md:-right-6 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm animate-bounce ${isAnnual ? 'opacity-100' : 'opacity-70'}`}>
                    -20%
                </span>
            </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`
                relative bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-xl border transition-all duration-300 hover:-translate-y-2 flex flex-col
                ${plan.popular ? 'border-purple-500 ring-4 ring-purple-500/10 dark:ring-purple-500/20' : 'border-slate-100 dark:border-slate-700'}
            `}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 z-20 whitespace-nowrap">
                <Crown size={14} /> Recommandé
              </div>
            )}

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 
                ${plan.color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : ''}
                ${plan.color === 'purple' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' : ''}
                ${plan.color === 'green' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : ''}
                ${plan.color === 'orange' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' : ''}
            `}>
              <plan.icon size={24} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 min-h-[40px] leading-relaxed">{plan.description}</p>
            
            <div className="mb-6">
               <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{plan.price}</span>
               {plan.currency && <span className="text-slate-900 dark:text-white text-lg font-bold"> {plan.currency}</span>}
               {plan.period && <span className="text-slate-400 text-xs font-medium"> {plan.period}</span>}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span className="text-slate-600 dark:text-slate-300 text-xs font-medium">{feature}</span>
                </li>
              ))}
              {plan.notIncluded.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 opacity-50">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center flex-shrink-0">
                    <X size={10} strokeWidth={3} />
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 text-xs">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href={plan.isCurrent ? "#" : plan.actionLink} className="mt-auto">
                <button 
                    disabled={plan.isCurrent}
                    className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-lg text-sm
                        ${plan.isCurrent 
                            ? 'bg-slate-100 text-slate-400 cursor-default dark:bg-slate-700 dark:text-slate-500' 
                            : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-500/30 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200'
                        }
                    `}
                >
                    {plan.isCurrent ? "Plan Actuel" : plan.actionLabel}
                </button>
            </Link>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-20 text-center bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] p-10 border border-blue-100 dark:border-blue-900/30">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Une question sur les abonnements ?</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Notre équipe commerciale est disponible pour vous conseiller sur la meilleure formule.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
            Discuter avec un agent
        </button>
      </div>

    </div>
  );
}