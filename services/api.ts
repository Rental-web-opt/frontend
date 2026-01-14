import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const carService = {
  getAll: () => api.get('/cars'),
  getById: (id: number) => api.get(`/cars/${id}`),
  create: (data: any) => api.post('/cars', data),
};

export const driverService = {
  getAll: () => api.get('/drivers'),
  getById: (id: number) => api.get(`/drivers/${id}`),
};

export const agencyService = {
  getAll: () => api.get('/agencies'),
  getById: (id: number) => api.get(`/agencies/${id}`),
};

export const bookingService = {
  create: (data: any) => api.post('/bookings', data), // Pour créer une réservation (Client)
  getByUser: (userId: number) => api.get(`/bookings/user/${userId}`), // Pour l'historique (Client)
  
  // --- AJOUTS POUR LE DASHBOARD AGENCE ---
  getAll: () => api.get('/bookings'), // Pour voir toutes les demandes
  updateStatus: (id: number, status: string) => api.put(`/bookings/${id}/status?status=${status}`), // Pour Valider/Refuser
};

export default api;