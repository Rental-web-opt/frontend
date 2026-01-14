export interface Agency {
  id: number;
  name: string;
  city: string;
  location: string; // Quartier/Adresse précise
  description: string;
  logo: string;
  coverImage: string; // Image de couverture pour la page détails
  rating: number;
  reviewCount: number;
  vehicleCount: number;
  isOpen: boolean;
  openingHours: string;
  phone: string;
  email: string;
  tags: string[];
  reviews: {
    id: number;
    user: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export const allAgencies: Agency[] = [
  {
    id: 1,
    name: "Agence Prestige",
    city: "Yaoundé",
    location: "Bastos, Rue 123",
    description: "Spécialiste des véhicules de luxe et de cérémonie. Nous offrons un service VIP avec ou sans chauffeur pour tous vos événements importants.",
    logo: "/assets/company-logo.jpg",
    coverImage: "/assets/car2.jpeg", // Vous pouvez mettre une image d'agence ici si vous en avez
    rating: 4.8,
    reviewCount: 156,
    vehicleCount: 45,
    isOpen: true,
    openingHours: "08:00 - 20:00",
    phone: "+237 600 00 00 01",
    email: "contact@prestige.cm",
    tags: ["Luxe", "Mariage", "VIP"],
    reviews: [
      { id: 1, user: "Alain K.", avatar: "/assets/default-avatar.jpeg", rating: 5, comment: "Service impeccable pour mon mariage.", date: "12 Mai 2024" }
    ]
  },
  {
    id: 2,
    name: "Douala Cars",
    city: "Douala",
    location: "Akwa, Blvd de la Liberté",
    description: "Le leader de la location à Douala. Une large flotte de SUV et de berlines pour vos déplacements d'affaires et touristiques.",
    logo: "/assets/agencies.png",
    coverImage: "/assets/car6.png",
    rating: 4.5,
    reviewCount: 89,
    vehicleCount: 120,
    isOpen: true,
    openingHours: "07:30 - 19:00",
    phone: "+237 600 00 00 02",
    email: "info@doualacars.cm",
    tags: ["Business", "Tourisme"],
    reviews: []
  },
  {
    id: 3,
    name: "Kribi Beach Rent",
    city: "Kribi",
    location: "Centre Ville, Près du Port",
    description: "Profitez de votre séjour à la plage avec nos quads, buggys et 4x4. L'aventure commence ici.",
    logo: "/assets/company-logo.jpg",
    coverImage: "/assets/quad.png",
    rating: 4.9,
    reviewCount: 42,
    vehicleCount: 20,
    isOpen: false, // Fermé actuellement
    openingHours: "09:00 - 18:00",
    phone: "+237 600 00 00 03",
    email: "surf@kribirent.cm",
    tags: ["Loisir", "Plage"],
    reviews: []
  },
  {
    id: 4,
    name: "Easy Drive",
    city: "Yaoundé",
    location: "Mvan, Gare Routière",
    description: "La location simple et pas chère. Idéal pour les étudiants et les petits budgets.",
    logo: "/assets/agencies.png",
    coverImage: "/assets/car1.jpeg",
    rating: 4.2,
    reviewCount: 30,
    vehicleCount: 60,
    isOpen: true,
    openingHours: "06:00 - 22:00",
    phone: "+237 600 00 00 04",
    email: "hello@easydrive.cm",
    tags: ["Économique", "24/7"],
    reviews: []
  },
  {
    id: 5,
    name: "Luxury Wheels",
    city: "Douala",
    location: "Bonapriso",
    description: "L'élégance à l'état pur. Louez les dernières Mercedes et BMW avec chauffeur privé.",
    logo: "/assets/company-logo.jpg",
    coverImage: "/assets/limousine.jpg",
    rating: 5.0,
    reviewCount: 12,
    vehicleCount: 15,
    isOpen: true,
    openingHours: "08:00 - 18:00",
    phone: "+237 600 00 00 05",
    email: "vip@luxurywheels.cm",
    tags: ["Premium", "Chauffeur"],
    reviews: []
  }
];