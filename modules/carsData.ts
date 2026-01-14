export interface Car {
  id: number;
  name: string;
  price: number;
  monthlyPrice?: number; // Champ pour l'abonnement
  currency: string;
  type: string;
  fuel: string;
  seats: number;
  transmission: string;
  rating: number;
  reviewsCount: number;
  isFavorite: boolean;
  image: string;
  gallery: string[];
  tag?: string;
  description: string;
  location: string;
  specs: {
    modele: string;
    marque: string;
    capacite: string;
    couleur: string;
    kilometrage: string;
    vitesseMax: string;
    portes: number;
  };
  reviewsList: {
    id: number;
    user: string;
    avatar: string;
    rating: number;
    comment: string;
  }[];
}

// ATTENTION : L'export doit s'appeler "allCars" pour que le reste du site fonctionne
export const allCars: Car[] = [
  {
    id: 1,
    name: "Audi Rouge Sport",
    price: 150000,
    monthlyPrice: 2500000, // Prix abonnement ajouté
    currency: "CFA",
    type: "Sport",
    fuel: "Essence",
    seats: 2,
    transmission: "Automatique",
    rating: 4.8,
    reviewsCount: 12,
    isFavorite: true,
    tag: "Populaire",
    image: "/assets/car2.jpeg", 
    gallery: ["/assets/car2.jpeg", "/assets/car1.jpeg", "/assets/car3.jpeg", "/assets/car4.jpeg"],
    description: "Une voiture sportive élégante, parfaite pour les mariages ou les week-ends de luxe.",
    location: "Yaoundé, Route de Kribi",
    specs: {
      modele: "R8 Coupé",
      marque: "Audi",
      capacite: "2 Personnes",
      couleur: "Rouge",
      kilometrage: "15 000 km",
      vitesseMax: "330 Km/h",
      portes: 2
    },
    reviewsList: [
      { id: 1, user: "Manuella DK", avatar: "/assets/default-avatar.jpeg", rating: 5, comment: "J'ai adoré cette voiture !" },
      { id: 2, user: "Paul H.", avatar: "/assets/default-avatar.jpeg", rating: 4, comment: "Superbe expérience." }
    ]
  },
  {
    id: 2,
    name: "Toyota Fortuner",
    price: 85000,
    monthlyPrice: 1500000, // Prix abonnement ajouté
    currency: "CFA",
    type: "SUV",
    fuel: "Diesel",
    seats: 7,
    transmission: "Automatique",
    rating: 4.5,
    reviewsCount: 24,
    isFavorite: false,
    tag: "Familial",
    image: "/assets/fortuner.jpg",
    gallery: ["/assets/fortuner.jpg", "/assets/car6.png", "/assets/car5.png"],
    description: "Le SUV parfait pour les routes camerounaises. Robuste et spacieux.",
    location: "Douala, Bonapriso",
    specs: {
      modele: "Fortuner",
      marque: "Toyota",
      capacite: "7 Personnes",
      couleur: "Blanc",
      kilometrage: "45 000 km",
      vitesseMax: "200 Km/h",
      portes: 5
    },
    reviewsList: [
      { id: 1, user: "Jean Marc", avatar: "/assets/default-avatar.jpeg", rating: 5, comment: "Très robuste." }
    ]
  },
  {
    id: 3,
    name: "Mercedes GLE 450",
    price: 120000,
    monthlyPrice: 2800000, // Prix abonnement ajouté
    currency: "CFA",
    type: "Luxe",
    fuel: "Hybride",
    seats: 5,
    transmission: "Automatique",
    rating: 5.0,
    reviewsCount: 8,
    isFavorite: true,
    tag: "Premium",
    image: "/assets/mercedes gle.webp",
    gallery: ["/assets/car6.png", "/assets/limousine.jpg"],
    description: "Le summum du luxe et de la technologie.",
    location: "Yaoundé, Bastos",
    specs: {
      modele: "GLE 450",
      marque: "Mercedes",
      capacite: "5 Personnes",
      couleur: "Noir",
      kilometrage: "10 000 km",
      vitesseMax: "250 Km/h",
      portes: 5
    },
    reviewsList: []
  },
  {
    id: 4,
    name: "Limousine Alpha",
    price: 200000,
    // Pas d'abonnement pour une limousine
    currency: "CFA",
    type: "Luxe",
    fuel: "Essence",
    seats: 8,
    transmission: "Automatique",
    rating: 5.0,
    reviewsCount: 5,
    isFavorite: true,
    tag: "VIP",
    image: "/assets/limousine.jpg",
    gallery: ["/assets/limousine.jpg"],
    description: "Pour vos événements les plus prestigieux.",
    location: "Douala, Akwa",
    specs: {
      modele: "Stretch Limo",
      marque: "Lincoln",
      capacite: "8 Personnes",
      couleur: "Blanc",
      kilometrage: "5 000 km",
      vitesseMax: "180 Km/h",
      portes: 4
    },
    reviewsList: []
  },
  {
    id: 5,
    name: "Moto Cross",
    price: 25000,
    currency: "CFA",
    type: "Moto",
    fuel: "Essence",
    seats: 1,
    transmission: "Manuelle",
    rating: 4.0,
    reviewsCount: 10,
    isFavorite: false,
    tag: "Aventure",
    image: "/assets/motocross.jpeg",
    gallery: ["/assets/motocross.jpeg"],
    description: "Parfaite pour les terrains difficiles.",
    location: "Bafoussam",
    specs: {
      modele: "Cross 250",
      marque: "KTM",
      capacite: "1 Personne",
      couleur: "Orange",
      kilometrage: "2 000 km",
      vitesseMax: "140 Km/h",
      portes: 0
    },
    reviewsList: []
  },
  {
    id: 6,
    name: "Quad Bike",
    price: 40000,
    currency: "CFA",
    type: "Quad",
    fuel: "Essence",
    seats: 2,
    transmission: "Automatique",
    rating: 4.5,
    reviewsCount: 15,
    isFavorite: false,
    tag: "Loisir",
    image: "/assets/quad.png",
    gallery: ["/assets/quad.png"],
    description: "Pour des balades inoubliables en bord de mer.",
    location: "Kribi",
    specs: {
      modele: "Raptor",
      marque: "Yamaha",
      capacite: "2 Personnes",
      couleur: "Noir",
      kilometrage: "1 500 km",
      vitesseMax: "100 Km/h",
      portes: 0
    },
    reviewsList: []
  }
];