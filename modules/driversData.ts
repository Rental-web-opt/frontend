export interface Driver {
  id: number;
  name: string;
  age: number; // Nouveau
  experience: string;
  rating: number;
  reviewCount: number;
  image: string;
  languages: string[];
  location: string;
  price: number;
  phone: string; // Nouveau
  email: string; // Nouveau
  bio: string;   // Nouveau
  reviews: {
    id: number;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export const allDrivers: Driver[] = [
  {
    id: 1,
    name: "Jean-Pierre M.",
    age: 42,
    experience: "12 ans",
    rating: 4.9,
    reviewCount: 142,
    image: "/assets/driver.png", 
    languages: ["Français", "Anglais"],
    location: "Douala",
    price: 15000,
    phone: "+237 699 00 11 22",
    email: "jean.pierre@driver.com",
    bio: "Chauffeur professionnel depuis plus de 10 ans, je connais Douala comme ma poche. Spécialisé dans les déplacements VIP et la conduite de sécurité.",
    reviews: [
      { id: 1, user: "Marc A.", rating: 5, comment: "Conduite très douce et ponctualité irréprochable.", date: "10 Oct 2023" }
    ]
  },
  {
    id: 2,
    name: "Ibrahim S.",
    age: 35,
    experience: "8 ans",
    rating: 4.7,
    reviewCount: 98,
    image: "/assets/driver.png",
    languages: ["Français", "Haoussa"],
    location: "Yaoundé",
    price: 12000,
    phone: "+237 677 55 44 33",
    email: "ibrahim.s@driver.com",
    bio: "Ponctuel et discret, je vous accompagne dans tous vos déplacements professionnels à Yaoundé. Véhicule toujours impeccable.",
    reviews: [
      { id: 1, user: "Paul K.", rating: 4, comment: "Bon chauffeur, très prudent.", date: "15 Nov 2023" }
    ]
  },
  {
    id: 3,
    name: "Samuel E.",
    age: 29,
    experience: "5 ans",
    rating: 4.5,
    reviewCount: 56,
    image: "/assets/default-avatar.jpeg",
    languages: ["Français", "Pidgin"],
    location: "Kribi",
    price: 10000,
    phone: "+237 655 22 11 00",
    email: "samuel.kribi@driver.com",
    bio: "Guide et chauffeur local, je vous ferai découvrir les plus belles plages et restaurants de Kribi. Ambiance détendue garantie.",
    reviews: [
      { id: 1, user: "Alice M.", rating: 5, comment: "Super guide pour visiter Kribi !", date: "20 Jan 2024" }
    ]
  },
  {
    id: 4,
    name: "Alain Prost",
    age: 50,
    experience: "20 ans",
    rating: 5.0,
    reviewCount: 300,
    image: "/assets/driver.png",
    languages: ["Français", "Anglais", "Espagnol"],
    location: "Douala",
    price: 25000,
    phone: "+237 600 99 88 77",
    email: "alain.vip@driver.com",
    bio: "Excellence et discrétion. Je suis habitué à conduire des délégations officielles et des chefs d'entreprise. Maîtrise de la conduite défensive.",
    reviews: [
      { id: 1, user: "Henri T.", rating: 5, comment: "Le meilleur, tout simplement. Classe VIP.", date: "05 Dec 2023" }
    ]
  }
];