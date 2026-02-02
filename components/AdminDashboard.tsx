import React, { useEffect, useState } from 'react';
import { isMockMode } from '@/services/api';

interface User {
  id: number;
  fullName: string;
  email: string;
  agencyStatus: string;
}

// Données mock pour les demandes en attente
const mockPendingRequests: User[] = [
  { id: 101, fullName: "Jean Dupont", email: "jean.dupont@email.com", agencyStatus: "PENDING" },
  { id: 102, fullName: "Marie Claire", email: "marie.claire@email.com", agencyStatus: "PENDING" },
];

const AdminDashboard = () => {
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      if (isMockMode()) {
        // MODE MOCK: Utiliser les données simulées
        console.log("🎭 Mode démo: Chargement des demandes mock");
        await new Promise(resolve => setTimeout(resolve, 500));
        setRequests(mockPendingRequests);
      } else {
        // MODE RÉEL: Appel au Backend
        const axios = (await import('axios')).default;
        const response = await axios.get("http://localhost:8081/api/admin/agencies/pending");
        setRequests(response.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des demandes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      if (isMockMode()) {
        // MODE MOCK: Simuler l'action
        console.log(`🎭 Mode démo: ${action} pour utilisateur ${id}`);
        setRequests(prev => prev.filter(user => user.id !== id));
        alert(`✅ [DEMO] Utilisateur ${action === 'approve' ? 'approuvé' : 'refusé'} !`);
        return;
      }

      // MODE RÉEL: Appel au Backend
      const axios = (await import('axios')).default;
      await axios.put(`http://localhost:8081/api/admin/agencies/${id}/${action}`);
      fetchRequests();
      alert(`Utilisateur ${action === 'approve' ? 'approuvé' : 'refusé'} !`);
    } catch (error) {
      alert("Erreur lors de l'opération");
    }
  };

  if (loading) return <p className="p-10">Chargement des demandes...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord Administrateur</h1>

      {isMockMode() && (
        <div className="mb-4 bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded-lg text-sm">
          🎭 Mode démo: Les données affichées sont simulées
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Nom Complet</th>
              <th className="p-4">Email</th>
              <th className="p-4">Statut</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">Aucune demande en attente.</td>
              </tr>
            ) : (
              requests.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{user.fullName}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4 font-semibold text-orange-500">{user.agencyStatus}</td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => handleAction(user.id, 'approve')}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => handleAction(user.id, 'reject')}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Refuser
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;