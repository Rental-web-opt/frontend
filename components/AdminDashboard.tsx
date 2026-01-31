import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  fullName: string;
  email: string;
  agencyStatus: string;
}

const AdminDashboard = () => {
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les demandes au démarrage
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/admin/agencies/pending");
      setRequests(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des demandes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      await axios.put(`http://localhost:8081/api/admin/agencies/${id}/${action}`);
      // On rafraîchit la liste après l'action
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