"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Car, Building2, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react'; // Assurez-vous d'avoir installé lucide-react

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    agencies: 0,
    cars: 0,
    bookings: 0
  });

  // Simulation de chargement de données (remplacez par vos vrais endpoints)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Exemple d'appels API parallèles
        // const usersRes = await axios.get("http://localhost:8081/api/users/count");
        // setStats({ ...stats, users: usersRes.data });

        // Données simulées pour l'exemple visuel
        setStats({ users: 124, agencies: 8, cars: 45, bookings: 312 });
      } catch (error) {
        console.error("Erreur stats", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-500 mt-1">Bienvenue dans l'interface d'administration EasyRent.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{new Date().toLocaleDateString('fr-FR', { dateStyle: 'full' })}</span>
        </div>
      </div>

      {/* Cartes de Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Utilisateurs"
          value={stats.users}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          trend="+12%"
          color="bg-blue-50 border-blue-100"
        />
        <StatCard
          title="Agences"
          value={stats.agencies}
          icon={<Building2 className="w-6 h-6 text-purple-600" />}
          trend="+2"
          color="bg-purple-50 border-purple-100"
        />
        <StatCard
          title="Voitures"
          value={stats.cars}
          icon={<Car className="w-6 h-6 text-green-600" />}
          trend="+5%"
          color="bg-green-50 border-green-100"
        />
        <StatCard
          title="Réservations"
          value={stats.bookings}
          icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
          trend="+18%"
          color="bg-orange-50 border-orange-100"
        />
      </div>

      {/* Section Activité Récente */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Dernières Inscriptions</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Voir tout</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Exemple de lignes statiques - à remplacer par un map() sur vos données */}
              <TableRow name="Jean Dupont" email="jean@example.com" role="Utilisateur" date="Aujourd'hui" status="Actif" />
              <TableRow name="AutoLux Yaoundé" email="contact@autolux.cm" role="Agence" date="Hier" status="En attente" />
              <TableRow name="Paul Biya" email="paul@prc.cm" role="Chauffeur" date="29 Jan 2026" status="Actif" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Composants auxiliaires pour le design

function StatCard({ title, value, icon, trend, color }: any) {
  return (
    <div className={`p-6 rounded-xl border ${color} transition-all duration-200 hover:shadow-md`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="p-2 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className="text-green-600 font-medium flex items-center">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          {trend}
        </span>
        <span className="text-gray-400 ml-2">vs mois dernier</span>
      </div>
    </div>
  );
}

function TableRow({ name, email, role, date, status }: any) {
  const statusColors: any = {
    "Actif": "bg-green-100 text-green-700",
    "En attente": "bg-yellow-100 text-yellow-700",
    "Inactif": "bg-red-100 text-red-700"
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{role}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{date}</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-600"}`}>
          {status}
        </span>
      </td>
    </tr>
  );
}