"use client";

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Car, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 font-sans">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* --- PARTIE HAUTE (Grille) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Colonne 1 : Marque */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-bold flex items-center gap-2 mb-6">
               <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                  <Car size={24} />
               </div>
               <div>
                 <span className="text-blue-600">EASY</span>
                 <span className="text-orange-500">-RENT</span>
               </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              La plateforme de location de véhicules numéro 1 au Cameroun. 
              Simple, rapide et sécurisé.
            </p>
          </div>

          {/* Colonne 2 : Liens Entreprise (AVEC LE LIEN PLANS) */}
          <div>
            <h3 className="font-bold text-slate-800 mb-6 text-lg">Entreprise</h3>
            <ul className="space-y-4 text-slate-600 text-sm font-medium">
              <li><Link href="#" className="hover:text-blue-600 transition-colors flex items-center gap-2">À propos</Link></li>
              
              {/* --- LIEN STRATÉGIQUE --- */}
              <li>
                <Link href="/Plans" className="hover:text-blue-600 transition-colors flex items-center gap-2 text-blue-600 font-bold">
                     Nos Forfaits Illimités
                </Link>
              </li>
              {/* ------------------------ */}

              <li><Link href="#" className="hover:text-blue-600 transition-colors flex items-center gap-2">Carrières</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors flex items-center gap-2">Blog & Actualités</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Liens Support */}
          <div>
            <h3 className="font-bold text-slate-800 mb-6 text-lg">Support</h3>
            <ul className="space-y-4 text-slate-600 text-sm font-medium">
              <li><Link href="/Help" className="hover:text-blue-600 transition-colors">Centre d'aide</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Conditions générales</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Confidentialité</Link></li>
            </ul>
          </div>

          {/* Colonne 4 : Réseaux */}
          <div>
            <h3 className="font-bold text-slate-800 mb-6 text-lg">Restez connecté</h3>
            <div className="flex gap-3 mb-8">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <div key={i} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                    <Icon size={18} />
                </div>
              ))}
            </div>
            {/* Newsletter simplifiée */}
            <div className="flex">
                <input type="email" placeholder="Email" className="bg-slate-50 border border-slate-200 rounded-l-xl px-4 py-2 text-sm w-full" />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-xl text-sm font-bold">OK</button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2025 Easy-Rent. Tous droits réservés.</p>
          <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full">
          </div>
        </div>
      </div>
    </footer>
  );
}