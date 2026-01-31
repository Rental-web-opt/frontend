"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search, Heart, Settings, Car, HelpCircle,
  MessageCircle, Mail, Phone, Video,
  FileText, Shield, User, CreditCard, ChevronRight, Zap,
  ArrowLeft, Send, CheckCircle, AlertCircle
} from 'lucide-react';

// --- COMPOSANTS UI ---

const QuickActionCard = ({ icon: Icon, title, desc, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group cursor-pointer">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const FaqItem = ({ title, category, views }: any) => (
  <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
        <FileText size={20} />
      </div>
      <div>
        <h4 className="font-semibold text-slate-800 group-hover:text-blue-700">{title}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">{category}</span>
          <span className="text-xs text-slate-400">• {views} vues</span>
        </div>
      </div>
    </div>
    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
      <ChevronRight size={18} />
    </div>
  </div>
);

// --- COMPOSANT FORMULAIRE DE TICKET ---

const TicketForm = ({ onBack, onSubmit }: { onBack: () => void, onSubmit: () => void }) => (
  <div className="max-w-3xl mx-auto animate-fadeIn">
    <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-6 transition-colors">
      <ArrowLeft size={20} /> Retour à l'aide
    </button>

    <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
          <Mail size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Ouvrir un nouveau ticket</h2>
        <p className="text-slate-500 mt-2">Décrivez votre problème, notre équipe vous répondra sous 24h.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Votre Nom</label>
            <input type="text" placeholder="Serge Kenfack" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email de contact</label>
            <input type="email" placeholder="jean@exemple.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Catégorie</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-600">
              <option>Problème technique</option>
              <option>Facturation & Remboursement</option>
              <option>Compte & Sécurité</option>
              <option>Autre demande</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Priorité</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-600">
              <option>Normale</option>
              <option>Haute</option>
              <option>Urgente</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Sujet</label>
          <input type="text" placeholder="Ex: Impossible de télécharger ma facture" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Message détaillé</label>
          <textarea rows={5} placeholder="Expliquez votre problème en détails..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" required></textarea>
        </div>

        <div className="pt-4">
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
            <Send size={20} /> Envoyer le ticket
          </button>
        </div>
      </form>
    </div>
  </div>
);

// --- VUE SUCCÈS ---

const SuccessView = ({ onReset }: { onReset: () => void }) => (
  <div className="max-w-xl mx-auto text-center py-12 animate-fadeIn">
    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-bounce">
      <CheckCircle size={48} />
    </div>
    <h2 className="text-4xl font-bold text-slate-800 mb-4">Ticket Envoyé !</h2>
    <p className="text-slate-500 text-lg mb-8 leading-relaxed">
      Votre demande a bien été reçue. Notre équipe de support vous contactera à l'adresse email fournie dans les plus brefs délais (généralement sous 24h).
    </p>
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 inline-block">
      <p className="text-sm text-slate-600 font-medium">Numéro de ticket : <span className="text-blue-600 font-bold">#TK-88349</span></p>
    </div>
    <div>
      <button onClick={onReset} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">
        Retour à l'accueil
      </button>
    </div>
  </div>
);

// --- PAGE PRINCIPALE ---

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [view, setView] = useState<'main' | 'form' | 'success'>('main');

  const categories = [
    { id: 'all', name: 'Tout', icon: HelpCircle },
    { id: 'getting-started', name: 'Démarrage', icon: Zap },
    { id: 'account', name: 'Compte', icon: User },
    { id: 'security', name: 'Sécurité', icon: Shield },
    { id: 'billing', name: 'Facturation', icon: CreditCard },
  ];

  const helpTopics = [
    { title: 'Comment créer un compte ?', category: 'getting-started', views: '2.5k' },
    { title: 'Réinitialiser mon mot de passe', category: 'security', views: '1.8k' },
    { title: 'Gérer mes préférences de paiement', category: 'billing', views: '1.2k' },
    { title: 'Modifier mes informations personnelles', category: 'account', views: '950' },
    { title: 'Activer l\'authentification à deux facteurs', category: 'security', views: '780' },
    { title: 'Politique de remboursement', category: 'billing', views: '620' },
  ];

  // --- FILTRAGE AMÉLIORÉ ---
  const filteredTopics = helpTopics.filter(topic => {
    // Vérifier si la catégorie correspond (ou si 'all' est sélectionné)
    const matchesCategory = activeCategory === 'all' || topic.category === activeCategory;

    // Vérifier si le titre contient la recherche (insensible à la casse)
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">

      {/* NAVBAR SUPPRIMÉE CAR GÉRÉE PAR LE LAYOUT */}

      {/* HERO SECTION (Uniquement visible sur la vue principale) */}
      {view === 'main' && (
        <section className="bg-[#2563EB] px-6 pt-16 pb-24 rounded-b-[3rem] shadow-lg mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/30 text-blue-100 text-xs font-bold mb-6 border border-blue-400/30 uppercase tracking-widest">Support Center</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Comment pouvons-nous <br /> <span className="text-orange-400">vous aider ?</span></h1>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Recherchez des réponses à vos questions, parcourez la documentation ou contactez notre équipe support.</p>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none"><Search className="h-6 w-6 text-white/50" /></div>
              <input
                type="text"
                className="block w-full pl-14 pr-6 py-5 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl text-white placeholder:text-blue-100 focus:ring-4 focus:ring-white/30 text-lg transition-all"
                placeholder="Rechercher un problème, une question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>
      )}

      {/* MAIN CONTENT */}
      <main className={`max-w-[1440px] mx-auto px-6 pb-20 ${view === 'main' ? '-mt-16' : 'mt-10'} relative z-20`}>

        {/* VUE PRINCIPALE : FAQ & BOUTONS */}
        {view === 'main' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <QuickActionCard icon={MessageCircle} title="Chat en direct" desc="Discutez instantanément avec notre équipe support." color="bg-blue-500" />
              <QuickActionCard icon={Mail} title="Email Support" desc="Envoyez-nous un email, réponse sous 24h." color="bg-purple-500" />
              <QuickActionCard icon={Phone} title="Téléphone" desc="Appelez-nous directement pour une urgence." color="bg-orange-500" />
              <QuickActionCard icon={Video} title="Tutoriels Vidéo" desc="Regardez nos guides pour apprendre à utiliser la plateforme." color="bg-emerald-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-3">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-28">
                  <h3 className="font-bold text-slate-800 mb-4 px-2">Catégories</h3>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeCategory === cat.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <cat.icon size={18} /> {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-9 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {searchQuery ? `Résultats pour "${searchQuery}"` : 'Sujets Populaires'}
                  </h2>
                  <button className="text-blue-600 text-sm font-bold hover:underline">Voir tout</button>
                </div>
                <div className="space-y-4">
                  {filteredTopics.length > 0 ? (
                    filteredTopics.map((topic, index) => <FaqItem key={index} {...topic} />)
                  ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                      <p className="text-slate-400 font-medium">Aucun résultat trouvé pour votre recherche.</p>
                    </div>
                  )}
                </div>

                {/* CTA Box avec Bouton Actif */}
                <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-10 text-center relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-4">Vous ne trouvez pas votre réponse ?</h3>
                    <p className="text-blue-100 mb-8 max-w-lg mx-auto">Notre équipe est disponible 24h/24 et 7j/7 pour vous aider.</p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setView('form')}
                        className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
                      >
                        Ouvrir un ticket
                      </button>
                      <button className="bg-blue-800/50 hover:bg-blue-800 text-white border border-blue-400/30 px-8 py-3 rounded-xl font-bold transition-all backdrop-blur-sm">
                        Consulter le Forum
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* VUE FORMULAIRE DE TICKET */}
        {view === 'form' && (
          <TicketForm onBack={() => setView('main')} onSubmit={() => setView('success')} />
        )}

        {/* VUE SUCCÈS */}
        {view === 'success' && (
          <SuccessView onReset={() => setView('main')} />
        )}

      </main>
    </div>
  );
}