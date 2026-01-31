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
  create: (data: any) => api.post('/bookings', data),
  getByUser: (userId: number) => api.get(`/bookings/user/${userId}`),
  getAll: () => api.get('/bookings'),
  updateStatus: (id: number, status: string) => api.put(`/bookings/${id}/status?status=${status}`),
};

// --- SERVICE DE RECHERCHE ELASTICSEARCH ---
export const searchService = {
  // Recherche par nom/marque
  searchCars: (query: string) => api.get(`/search/cars?query=${encodeURIComponent(query)}`),

  // Recherche par type (SUV, Berline, etc.)
  searchByType: (type: string) => api.get(`/search/cars/type/${type}`),

  // Voitures disponibles
  getAvailable: () => api.get('/search/cars/available'),

  // Recherche par gamme de prix
  searchByPrice: (min: number, max: number) => api.get(`/search/cars/price?min=${min}&max=${max}`),

  // --- RECHERCHE AGENCES ---
  searchAgencies: (query: string) => api.get(`/search/agencies?query=${encodeURIComponent(query)}`),
  searchAgenciesByCity: (city: string) => api.get(`/search/agencies/city/${city}`),
};

export const paymentService = {
  getMyPayments: () => api.get('/payments/my-payments', { withCredentials: true }),
  getSavedMethods: () => api.get('/payments/methods', { withCredentials: true }),
};



export default api;