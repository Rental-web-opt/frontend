"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);

  // Charger les demandes en attente
  const loadRequests = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/admin/agencies/pending");
      setRequests(res.data);
    } catch (err) {
      console.error("Erreur chargement admin", err);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const handleAction = async (id: number, status: 'approve' | 'reject') => {
    try {
      await axios.put(`http://localhost:8081/api/admin/agencies/${id}/${status}`);
      alert(status === 'approve' ? "Agence validée !" : "Demande refusée.");
      loadRequests(); // Rafraîchir la liste
    } catch (err) {
      alert("Erreur lors de l'action");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Validation des Agences</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
              <th className="px-5 py-3">Nom</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((u: any) => (
              <tr key={u.id} className="border-b">
                <td className="px-5 py-5">{u.fullName}</td>
                <td className="px-5 py-5">{u.email}</td>
                <td className="px-5 py-5 space-x-3">
                  <button onClick={() => handleAction(u.id, 'approve')} className="bg-green-500 text-white px-4 py-2 rounded">Accepter</button>
                  <button onClick={() => handleAction(u.id, 'reject')} className="bg-red-500 text-white px-4 py-2 rounded">Refuser</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}