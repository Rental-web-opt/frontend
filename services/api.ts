import axios from 'axios';
import { allCars } from '@/modules/carsData';

// ============================================
// 🌐 CONFIGURATION ENVIRONNEMENT
// ============================================

// Détecte si on est sur Vercel (production) ou en local (development)
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const USE_MOCK_DATA = IS_PRODUCTION; // En production, utiliser les données fictives

// URL du backend (utilisé uniquement en local)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// 📦 DONNÉES MOCK POUR LE MODE DÉMO
// ============================================

const mockAgencies = [
  { id: 1, name: "AutoLux Douala", city: "Douala", location: "Bonanjo", open: true, rating: 4.8, reviewCount: 45 },
  { id: 2, name: "Premium Cars Yaoundé", city: "Yaoundé", location: "Bastos", open: true, rating: 4.5, reviewCount: 32 },
];

const mockDrivers = [
  { id: 1, fullName: "Paul Biya", name: "Paul Biya", age: 45, experience: 15, location: "Yaoundé", pricePerDay: 25000, available: true, rating: 4.8 },
  { id: 2, fullName: "Jean Makoun", name: "Jean Makoun", age: 38, experience: 10, location: "Douala", pricePerDay: 20000, available: true, rating: 4.6 },
];

const mockUsers = [
  { id: 1, fullName: "Admin Demo", email: "admin@easyrent.cm", role: "ADMIN" },
  { id: 2, fullName: "User Demo", email: "user@easyrent.cm", role: "USER" },
];

const mockBookings: any[] = [];
const mockPayments: any[] = [];

// Convertir les données de carsData vers le format API
const mockCars = allCars.map((car, index) => ({
  id: car.id,
  name: car.name,
  brand: car.specs.marque,
  type: car.type,
  pricePerDay: car.price,
  monthlyPrice: car.monthlyPrice,
  image: car.image,
  images: car.gallery,
  available: true,
  transmission: car.transmission,
  fuelType: car.fuel,
  seats: car.seats,
  maxSpeed: parseInt(car.specs.vitesseMax) || null,
  description: car.description,
  location: car.location,
  agency: mockAgencies[index % mockAgencies.length],
}));

// ============================================
// 🔧 HELPER POUR CRÉER DES RÉPONSES MOCK
// ============================================

const mockResponse = <T>(data: T) => Promise.resolve({ data });

// ============================================
// 🚗 SERVICE VOITURES
// ============================================

export const carService = {
  getAll: () => {
    if (USE_MOCK_DATA) return mockResponse(mockCars);
    return api.get('/cars');
  },
  getById: (id: number) => {
    if (USE_MOCK_DATA) {
      const car = mockCars.find(c => c.id === id);
      return mockResponse(car || null);
    }
    return api.get(`/cars/${id}`);
  },
  create: (data: any) => {
    if (USE_MOCK_DATA) return mockResponse({ id: Date.now(), ...data });
    return api.post('/cars', data);
  },
};

// ============================================
// 🧑‍✈️ SERVICE CHAUFFEURS
// ============================================

export const driverService = {
  getAll: () => {
    if (USE_MOCK_DATA) return mockResponse(mockDrivers);
    return api.get('/drivers');
  },
  getById: (id: number) => {
    if (USE_MOCK_DATA) {
      const driver = mockDrivers.find(d => d.id === id);
      return mockResponse(driver || null);
    }
    return api.get(`/drivers/${id}`);
  },
};

// ============================================
// 🏢 SERVICE AGENCES
// ============================================

export const agencyService = {
  getAll: () => {
    if (USE_MOCK_DATA) return mockResponse(mockAgencies);
    return api.get('/agencies');
  },
  getById: (id: number) => {
    if (USE_MOCK_DATA) {
      const agency = mockAgencies.find(a => a.id === id);
      return mockResponse(agency || null);
    }
    return api.get(`/agencies/${id}`);
  },
};

// ============================================
// 📅 SERVICE RÉSERVATIONS
// ============================================

export const bookingService = {
  create: (data: any) => {
    if (USE_MOCK_DATA) {
      const newBooking = { id: Date.now(), ...data, status: "PENDING", createdAt: new Date().toISOString() };
      mockBookings.push(newBooking);
      return mockResponse(newBooking);
    }
    return api.post('/bookings', data);
  },
  getById: (id: number) => {
    if (USE_MOCK_DATA) return mockResponse(mockBookings.find(b => b.id === id) || null);
    return api.get(`/bookings/${id}`);
  },
  getByUser: (userId: number) => {
    if (USE_MOCK_DATA) return mockResponse(mockBookings.filter(b => b.userId === userId));
    return api.get(`/bookings/user/${userId}`);
  },
  getAll: () => {
    if (USE_MOCK_DATA) return mockResponse(mockBookings);
    return api.get('/bookings');
  },
  updateStatus: (id: number, status: string) => {
    if (USE_MOCK_DATA) {
      const booking = mockBookings.find(b => b.id === id);
      if (booking) booking.status = status;
      return mockResponse(booking);
    }
    return api.put(`/bookings/${id}/status?status=${status}`);
  },
  confirm: (id: number) => {
    if (USE_MOCK_DATA) return bookingService.updateStatus(id, "CONFIRMED");
    return api.put(`/bookings/${id}/confirm`);
  },
  cancel: (id: number) => {
    if (USE_MOCK_DATA) return bookingService.updateStatus(id, "CANCELLED");
    return api.put(`/bookings/${id}/cancel`);
  },
  complete: (id: number) => {
    if (USE_MOCK_DATA) return bookingService.updateStatus(id, "COMPLETED");
    return api.put(`/bookings/${id}/complete`);
  },
  checkAvailability: (carId: number, startDate: string, endDate: string) => {
    if (USE_MOCK_DATA) return mockResponse({ available: true });
    return api.get(`/bookings/check-availability`, { params: { carId, startDate, endDate } });
  },
  getOccupiedSlots: (carId: number) => {
    if (USE_MOCK_DATA) return mockResponse([]);
    return api.get(`/bookings/car/${carId}/occupied`);
  },
};

// ============================================
// 🔍 SERVICE RECHERCHE
// ============================================

export const searchService = {
  searchCars: (query: string) => {
    if (USE_MOCK_DATA) {
      const results = mockCars.filter(car =>
        car.name.toLowerCase().includes(query.toLowerCase()) ||
        car.brand.toLowerCase().includes(query.toLowerCase())
      );
      return mockResponse(results);
    }
    return api.get(`/search/cars?query=${encodeURIComponent(query)}`);
  },
  searchByType: (type: string) => {
    if (USE_MOCK_DATA) {
      return mockResponse(mockCars.filter(car => car.type.toLowerCase() === type.toLowerCase()));
    }
    return api.get(`/search/cars/type/${type}`);
  },
  getAvailable: () => {
    if (USE_MOCK_DATA) return mockResponse(mockCars.filter(car => car.available));
    return api.get('/search/cars/available');
  },
  searchByPrice: (min: number, max: number) => {
    if (USE_MOCK_DATA) {
      return mockResponse(mockCars.filter(car => car.pricePerDay >= min && car.pricePerDay <= max));
    }
    return api.get(`/search/cars/price?min=${min}&max=${max}`);
  },
  searchAgencies: (query: string) => {
    if (USE_MOCK_DATA) {
      const results = mockAgencies.filter(a =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.city.toLowerCase().includes(query.toLowerCase())
      );
      return mockResponse(results);
    }
    return api.get(`/search/agencies?query=${encodeURIComponent(query)}`);
  },
  searchAgenciesByCity: (city: string) => {
    if (USE_MOCK_DATA) {
      return mockResponse(mockAgencies.filter(a => a.city.toLowerCase() === city.toLowerCase()));
    }
    return api.get(`/search/agencies/city/${city}`);
  },
};

// ============================================
// 💳 SERVICE PAIEMENTS
// ============================================

export const paymentService = {
  getByUser: (userId: number) => {
    if (USE_MOCK_DATA) return mockResponse(mockPayments.filter(p => p.userId === userId));
    return api.get(`/payments/user/${userId}`);
  },
  getMyPayments: (userId?: number) => {
    if (USE_MOCK_DATA) return mockResponse(userId ? mockPayments.filter(p => p.userId === userId) : []);
    return api.get('/payments/my-payments', { params: { userId } });
  },
  getSavedMethods: () => {
    if (USE_MOCK_DATA) return mockResponse([]);
    return api.get('/payments/methods');
  },
  create: (data: any) => {
    if (USE_MOCK_DATA) {
      const newPayment = { id: Date.now(), ...data, status: "PENDING", createdAt: new Date().toISOString() };
      mockPayments.push(newPayment);
      return mockResponse(newPayment);
    }
    return api.post('/payments', data);
  },
  confirm: (id: number) => {
    if (USE_MOCK_DATA) {
      const payment = mockPayments.find(p => p.id === id);
      if (payment) payment.status = "COMPLETED";
      return mockResponse(payment);
    }
    return api.put(`/payments/${id}/confirm`);
  },
  confirmByBooking: (bookingId: number, paymentMethod?: string) => {
    if (USE_MOCK_DATA) return mockResponse({ success: true });
    return api.put(`/payments/booking/${bookingId}/confirm`, { paymentMethod });
  },
};

// ============================================
// 👥 SERVICE ADMIN (pour les stats)
// ============================================

export const adminService = {
  getStats: () => {
    if (USE_MOCK_DATA) {
      return mockResponse({
        totalUsers: mockUsers.length,
        totalAgencies: mockAgencies.length,
        totalCars: mockCars.length,
        totalBookings: mockBookings.length,
      });
    }
    return api.get('/admin/stats');
  },
  getUsers: () => {
    if (USE_MOCK_DATA) return mockResponse(mockUsers);
    return api.get('/admin/users');
  },
};

export default api;