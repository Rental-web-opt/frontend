import axios from 'axios';
import {
  mockUsers,
  mockAgencies,
  mockCars,
  mockDrivers,
  mockBookings,
  mockPayments,
  mockNotifications,
  mockAdminStats,
  MockBooking,
  MockNotification,
  MockPayment,
} from '@/modules/mockData';

// ============================================
// 🌐 CONFIGURATION ENVIRONNEMENT
// ============================================

// URL du backend (utilisé uniquement en local avec backend actif)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

// Fonction pour détecter si on doit utiliser les données mock (appelée au runtime)
const shouldUseMockData = (): boolean => {
  // Côté serveur (SSR) en production = mode mock
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production';
  }

  // Côté client : vérifier si on est sur Vercel ou pas sur localhost
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isVercel = hostname.includes('vercel.app');

  // Si on est sur Vercel OU pas en localhost = mode mock
  return isVercel || !isLocalhost;
};

// Variable pour le mode mock (recalculée à chaque appel)
const USE_MOCK_DATA = shouldUseMockData();


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// 📦 ÉTAT LOCAL POUR LE MODE DÉMO
// ============================================

// Copies mutables des données pour permettre les modifications en mode démo
let localBookings = [...mockBookings];
let localPayments = [...mockPayments];
let localNotifications = [...mockNotifications];
let notificationIdCounter = mockNotifications.length + 1;
let bookingIdCounter = mockBookings.length + 1;
let paymentIdCounter = mockPayments.length + 1;

// ============================================
// 🔧 HELPER POUR CRÉER DES RÉPONSES MOCK
// ============================================

const mockResponse = <T>(data: T) => Promise.resolve({ data });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// 🔔 SYSTÈME DE NOTIFICATIONS SIMULÉ
// ============================================

export const createMockNotification = (
  userId: number,
  title: string,
  message: string,
  type: "BOOKING" | "PAYMENT" | "SYSTEM" | "PROMO",
  data?: any
): MockNotification => {
  const notification: MockNotification = {
    id: notificationIdCounter++,
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
    data,
  };
  localNotifications.unshift(notification);
  return notification;
};

// Fonction pour générer les notifications après une réservation
export const generateBookingNotifications = (
  booking: MockBooking,
  currentUserId: number
) => {
  const car = booking.car;
  const user = booking.user;
  const agency = car.agency;

  // Notification pour l'utilisateur
  createMockNotification(
    currentUserId,
    "Réservation créée ✅",
    `Vous avez réservé ${car.name} du ${booking.startDate} au ${booking.endDate}. Montant: ${booking.totalPrice.toLocaleString()} CFA`,
    "BOOKING",
    { bookingId: booking.id, carId: car.id }
  );

  // Notification pour l'agence (userId de l'agence simulé)
  const agencyManagerId = mockUsers.find(u => u.role === "AGENCY" && u.email.includes(agency.name.toLowerCase().split(' ')[0]))?.id || 4;
  createMockNotification(
    agencyManagerId,
    "Nouvelle réservation 🚗",
    `${user.fullName} a réservé ${car.name} du ${booking.startDate} au ${booking.endDate}. Préparez le véhicule !`,
    "BOOKING",
    { bookingId: booking.id, userId: currentUserId, carId: car.id }
  );

  // Notification pour l'admin
  createMockNotification(
    1, // Admin ID
    "Nouvelle réservation sur la plateforme",
    `${user.fullName} a réservé ${car.name} chez ${agency.name} (${booking.totalPrice.toLocaleString()} CFA)`,
    "BOOKING",
    { bookingId: booking.id, agencyId: agency.id, userId: currentUserId }
  );
};

// ============================================
// 🚗 SERVICE VOITURES
// ============================================

export const carService = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(300); // Simuler latence réseau
      return mockResponse(mockCars);
    }
    return api.get('/cars');
  },
  getById: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const car = mockCars.find(c => c.id === id);
      return mockResponse(car || null);
    }
    return api.get(`/cars/${id}`);
  },
  create: async (data: any) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return mockResponse({ id: Date.now(), ...data });
    }
    return api.post('/cars', data);
  },
  getByAgency: async (agencyId: number) => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const cars = mockCars.filter(c => c.agency.id === agencyId);
      return mockResponse(cars);
    }
    return api.get(`/cars/agency/${agencyId}`);
  },
};

// ============================================
// 🧑‍✈️ SERVICE CHAUFFEURS
// ============================================

export const driverService = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockResponse(mockDrivers);
    }
    return api.get('/drivers');
  },
  getById: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(200);
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
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockResponse(mockAgencies);
    }
    return api.get('/agencies');
  },
  getById: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(200);
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
  create: async (data: any, currentUserId?: number) => {
    if (USE_MOCK_DATA) {
      await delay(800); // Simuler le temps de traitement

      const car = mockCars.find(c => c.id === data.carId);
      const user = mockUsers.find(u => u.id === (currentUserId || data.userId)) || mockUsers[1];

      if (!car) return mockResponse({ error: "Véhicule non trouvé" });

      const newBooking: MockBooking = {
        id: bookingIdCounter++,
        userId: currentUserId || data.userId || 2,
        user,
        carId: data.carId,
        car,
        startDate: data.startDate,
        endDate: data.endDate,
        totalPrice: data.totalPrice || car.pricePerDay,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        paymentStatus: "PENDING",
      };

      localBookings.unshift(newBooking);

      // Générer les notifications
      if (currentUserId) {
        generateBookingNotifications(newBooking, currentUserId);
      }

      return mockResponse(newBooking);
    }
    return api.post('/bookings', data);
  },

  getById: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockResponse(localBookings.find(b => b.id === id) || null);
    }
    return api.get(`/bookings/${id}`);
  },

  getByUser: async (userId: number) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockResponse(localBookings.filter(b => b.userId === userId));
    }
    return api.get(`/bookings/user/${userId}`);
  },

  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockResponse(localBookings);
    }
    return api.get('/bookings');
  },

  updateStatus: async (id: number, status: string) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const booking = localBookings.find(b => b.id === id);
      if (booking) {
        booking.status = status as any;

        // Notification de mise à jour
        createMockNotification(
          booking.userId,
          status === "CONFIRMED" ? "Réservation confirmée ✅" : `Réservation ${status.toLowerCase()}`,
          `Votre réservation #${id} a été ${status === "CONFIRMED" ? "confirmée" : status.toLowerCase()}.`,
          "BOOKING",
          { bookingId: id }
        );
      }
      return mockResponse(booking);
    }
    return api.put(`/bookings/${id}/status?status=${status}`);
  },

  confirm: async (id: number) => {
    return bookingService.updateStatus(id, "CONFIRMED");
  },

  cancel: async (id: number) => {
    return bookingService.updateStatus(id, "CANCELLED");
  },

  complete: async (id: number) => {
    return bookingService.updateStatus(id, "COMPLETED");
  },

  checkAvailability: async (carId: number, startDate: string, endDate: string) => {
    if (USE_MOCK_DATA) {
      await delay(200);
      // Vérifier si le véhicule est déjà réservé pour ces dates
      const isOccupied = localBookings.some(b =>
        b.carId === carId &&
        b.status !== "CANCELLED" &&
        ((startDate >= b.startDate && startDate <= b.endDate) ||
          (endDate >= b.startDate && endDate <= b.endDate))
      );
      return mockResponse({ available: !isOccupied });
    }
    return api.get(`/bookings/check-availability`, { params: { carId, startDate, endDate } });
  },

  getOccupiedSlots: async (carId: number) => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const slots = localBookings
        .filter(b => b.carId === carId && b.status !== "CANCELLED")
        .map(b => ({ startDate: b.startDate, endDate: b.endDate }));
      return mockResponse(slots);
    }
    return api.get(`/bookings/car/${carId}/occupied`);
  },
};

// ============================================
// 🔍 SERVICE RECHERCHE
// ============================================

export const searchService = {
  searchCars: async (query: string) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const q = query.toLowerCase();
      const results = mockCars.filter(car =>
        car.name.toLowerCase().includes(q) ||
        car.brand.toLowerCase().includes(q) ||
        car.type.toLowerCase().includes(q) ||
        car.location.toLowerCase().includes(q)
      );
      return mockResponse(results);
    }
    return api.get(`/search/cars?query=${encodeURIComponent(query)}`);
  },

  searchByType: async (type: string) => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockResponse(mockCars.filter(car => car.type.toLowerCase().includes(type.toLowerCase())));
    }
    return api.get(`/search/cars/type/${type}`);
  },

  getAvailable: async () => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockResponse(mockCars.filter(car => car.available));
    }
    return api.get('/search/cars/available');
  },

  searchByPrice: async (min: number, max: number) => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockResponse(mockCars.filter(car => car.pricePerDay >= min && car.pricePerDay <= max));
    }
    return api.get(`/search/cars/price?min=${min}&max=${max}`);
  },

  searchAgencies: async (query: string) => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const q = query.toLowerCase();
      const results = mockAgencies.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q)
      );
      return mockResponse(results);
    }
    return api.get(`/search/agencies?query=${encodeURIComponent(query)}`);
  },

  searchAgenciesByCity: async (city: string) => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockResponse(mockAgencies.filter(a => a.city.toLowerCase() === city.toLowerCase()));
    }
    return api.get(`/search/agencies/city/${city}`);
  },
};

// ============================================
// 💳 SERVICE PAIEMENTS
// ============================================

export const paymentService = {
  getByUser: async (userId: number) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockResponse(localPayments.filter(p => p.userId === userId));
    }
    return api.get(`/payments/user/${userId}`);
  },

  getMyPayments: async (userId?: number) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockResponse(userId ? localPayments.filter(p => p.userId === userId) : []);
    }
    return api.get('/payments/my-payments', { params: { userId } });
  },

  getSavedMethods: async () => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockResponse([
        { id: 1, type: "mobile_money", name: "Orange Money", last4: "7890" },
        { id: 2, type: "mobile_money", name: "MTN MoMo", last4: "1234" },
      ]);
    }
    return api.get('/payments/methods');
  },

  create: async (data: any) => {
    if (USE_MOCK_DATA) {
      await delay(600);
      const newPayment: MockPayment = {
        id: paymentIdCounter++,
        userId: data.userId,
        bookingId: data.bookingId,
        amount: data.amount,
        method: data.method || "Mobile Money",
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };
      localPayments.unshift(newPayment);

      // Notification de paiement
      createMockNotification(
        data.userId,
        "Paiement initié 💳",
        `Paiement de ${data.amount?.toLocaleString()} CFA en cours de traitement...`,
        "PAYMENT",
        { paymentId: newPayment.id, bookingId: data.bookingId }
      );

      return mockResponse(newPayment);
    }
    return api.post('/payments', data);
  },

  confirm: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      const payment = localPayments.find(p => p.id === id);
      if (payment) {
        payment.status = "COMPLETED";

        // Mettre à jour la réservation associée
        const booking = localBookings.find(b => b.id === payment.bookingId);
        if (booking) {
          booking.paymentStatus = "PAID";
          booking.status = "CONFIRMED";
        }

        createMockNotification(
          payment.userId,
          "Paiement confirmé ✅",
          `Votre paiement de ${payment.amount.toLocaleString()} CFA a été confirmé!`,
          "PAYMENT",
          { paymentId: id }
        );
      }
      return mockResponse(payment);
    }
    return api.put(`/payments/${id}/confirm`);
  },

  confirmByBooking: async (bookingId: number, paymentMethod?: string) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const booking = localBookings.find(b => b.id === bookingId);
      if (booking) {
        booking.paymentStatus = "PAID";
        booking.status = "CONFIRMED";

        // Créer le paiement
        const payment: MockPayment = {
          id: paymentIdCounter++,
          userId: booking.userId,
          bookingId,
          amount: booking.totalPrice,
          method: paymentMethod || "Mobile Money",
          status: "COMPLETED",
          createdAt: new Date().toISOString(),
        };
        localPayments.unshift(payment);

        createMockNotification(
          booking.userId,
          "Paiement confirmé ✅",
          `Votre paiement de ${booking.totalPrice.toLocaleString()} CFA pour ${booking.car.name} a été confirmé!`,
          "PAYMENT",
          { paymentId: payment.id, bookingId }
        );
      }
      return mockResponse({ success: true, booking });
    }
    return api.put(`/payments/booking/${bookingId}/confirm`, { paymentMethod });
  },
};

// ============================================
// 🔔 SERVICE NOTIFICATIONS  
// ============================================

export const notificationService = {
  getByUser: async (userId: number) => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockResponse(localNotifications.filter(n => n.userId === userId));
    }
    return api.get(`/notifications/user/${userId}`);
  },

  getUnreadCount: async (userId: number) => {
    if (USE_MOCK_DATA) {
      const unread = localNotifications.filter(n => n.userId === userId && !n.read).length;
      return mockResponse({ count: unread });
    }
    return api.get(`/notifications/user/${userId}/unread-count`);
  },

  markAsRead: async (id: number) => {
    if (USE_MOCK_DATA) {
      const notification = localNotifications.find(n => n.id === id);
      if (notification) notification.read = true;
      return mockResponse(notification);
    }
    return api.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async (userId: number) => {
    if (USE_MOCK_DATA) {
      localNotifications.forEach(n => {
        if (n.userId === userId) n.read = true;
      });
      return mockResponse({ success: true });
    }
    return api.put(`/notifications/user/${userId}/read-all`);
  },

  // Permet d'ajouter une notification manuellement (pour les tests)
  create: async (userId: number, title: string, message: string, type: "BOOKING" | "PAYMENT" | "SYSTEM" | "PROMO") => {
    if (USE_MOCK_DATA) {
      const notification = createMockNotification(userId, title, message, type);
      return mockResponse(notification);
    }
    return api.post('/notifications', { userId, title, message, type });
  },
};

// ============================================
// 👥 SERVICE UTILISATEURS
// ============================================

export const userService = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockResponse(mockUsers);
    }
    return api.get('/users');
  },

  getById: async (id: number) => {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockResponse(mockUsers.find(u => u.id === id) || null);
    }
    return api.get(`/users/${id}`);
  },

  // Authentification simulée pour le mode démo
  login: async (email: string, password: string) => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        return mockResponse({ user, token: "mock-jwt-token-" + user.id });
      }
      return Promise.reject({ response: { data: { message: "Identifiants incorrects" } } });
    }
    return api.post('/auth/login', { email, password });
  },

  register: async (data: any) => {
    if (USE_MOCK_DATA) {
      await delay(600);
      const newUser = {
        id: mockUsers.length + 1,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || "",
        role: "USER" as const,
        createdAt: new Date().toISOString().split('T')[0],
      };
      mockUsers.push(newUser);
      return mockResponse({ user: newUser, token: "mock-jwt-token-" + newUser.id });
    }
    return api.post('/auth/register', data);
  },
};

// ============================================
// 📊 SERVICE ADMIN
// ============================================

export const adminService = {
  getStats: async () => {
    if (USE_MOCK_DATA) {
      await delay(400);
      // Calculer les statistiques dynamiquement
      const totalRevenue = localBookings
        .filter(b => b.paymentStatus === "PAID")
        .reduce((sum, b) => sum + b.totalPrice, 0);

      return mockResponse({
        ...mockAdminStats,
        totalRevenue,
        totalBookings: localBookings.length,
      });
    }
    return api.get('/admin/stats');
  },

  getUsers: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockResponse(mockUsers);
    }
    return api.get('/admin/users');
  },

  getAllBookings: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockResponse(localBookings);
    }
    return api.get('/admin/bookings');
  },

  getAllPayments: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockResponse(localPayments);
    }
    return api.get('/admin/payments');
  },

  getRevenueByAgency: async () => {
    if (USE_MOCK_DATA) {
      await delay(300);
      return mockResponse(mockAdminStats.revenueByAgency);
    }
    return api.get('/admin/revenue-by-agency');
  },
};

// ============================================
// 🔧 UTILITAIRES
// ============================================

// Réinitialiser les données (utile pour les tests)
export const resetMockData = () => {
  localBookings = [...mockBookings];
  localPayments = [...mockPayments];
  localNotifications = [...mockNotifications];
  bookingIdCounter = mockBookings.length + 1;
  paymentIdCounter = mockPayments.length + 1;
  notificationIdCounter = mockNotifications.length + 1;
};

// Vérifier si on est en mode mock
export const isMockMode = () => USE_MOCK_DATA;

export default api;