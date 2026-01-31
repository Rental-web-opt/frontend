"use client";

import { useState, type ReactNode } from "react";
import { Star, User, Building2, Car, ThumbsUp, Calendar, TrendingUp, Award, CheckCircle, LucideIcon } from "lucide-react";

// --- TYPES & INTERFACES ---

interface TabProps {
  value: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: ReactNode;
}

interface TabsListProps {
  className?: string;
  children: ReactNode;
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: ReactNode;
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
}

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  vehicle: string;
}

interface ReviewCardProps {
  review: Review;
  type: "particuliers" | "professionnels";
  index: number;
}

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

// --- COMPOSANTS TAB (Navigation) ---

const Tabs = ({ value, onValueChange, className, children }: TabProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

const TabsList = ({ className, children }: TabsListProps) => {
  return (
    <div className={`${className} bg-white shadow-lg rounded-2xl p-2 border border-gray-200`}>
      {children}
    </div>
  );
};

const TabsTrigger = ({ value, className, children, ...props }: TabsTriggerProps) => {
  return (
    <button
      className={`${className} px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105`}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, className, children }: TabsContentProps) => {
  return (
    <div className={`${className} animate-fadeIn`}>
      {children}
    </div>
  );
};

// --- COMPOSANT REVIEW CARD ---

const ReviewCard = ({ review, type, index }: ReviewCardProps) => {
  const bgGradient = type === "particuliers"
    ? "bg-gradient-to-br from-blue-50 via-white to-blue-50"
    : "bg-gradient-to-br from-orange-50 via-white to-orange-50";
  const accentColor = type === "particuliers" ? "text-[#002AD7]" : "text-[#F76513]";
  const borderColor = type === "particuliers" ? "border-blue-200" : "border-orange-200";
  const badgeColor = type === "particuliers" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700";

  return (
    <div
      className={`${bgGradient} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border ${borderColor} backdrop-blur-sm`}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'slideUp 0.6s ease-out forwards',
        opacity: 0
      }}
    >
      {/* En-tête de la carte */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 ${type === "particuliers" ? "bg-[#002AD7]" : "bg-[#F76513]"} rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:rotate-12`}>
            {type === "particuliers" ? (
              <User className="w-8 h-8 text-white" />
            ) : (
              <Building2 className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-900">{review.name}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <span>📍</span> {review.location}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 transition-all duration-300 ${i < review.rating
                  ? `fill-yellow-400 text-yellow-400 animate-pulse`
                  : "text-gray-300"
                  }`}
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeColor}`}>
            {review.rating}/5
          </span>
        </div>
      </div>

      {/* Commentaire avec citation visuelle */}
      <div className="relative mb-6">
        <div className="absolute -left-2 -top-2 text-6xl text-gray-200 font-serif">"</div>
        <p className="text-gray-700 text-lg leading-relaxed pl-6 italic">{review.comment}</p>
        <div className="absolute -right-2 -bottom-2 text-6xl text-gray-200 font-serif">"</div>
      </div>

      {/* Métadonnées */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4 bg-white/50 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="font-medium">{review.date}</span>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <ThumbsUp className="w-5 h-5" />
          <span className="font-semibold">{review.helpful}</span>
          <span className="text-gray-600">utile</span>
        </div>
      </div>

      {/* Véhicule */}
      {review.vehicle && (
        <div className={`flex items-center gap-2 pt-4 border-t-2 ${type === "particuliers" ? "border-blue-200" : "border-orange-200"}`}>
          <Car className={`w-5 h-5 ${accentColor}`} />
          <span className={`${accentColor} font-bold text-sm`}>
            {review.vehicle}
          </span>
          <CheckCircle className={`w-4 h-4 ${accentColor} ml-auto`} />
        </div>
      )}
    </div>
  );
};

// --- COMPOSANT STATS CARD ---

const StatsCard = ({ icon: Icon, label, value, color }: StatsCardProps) => (
  <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${color} transform hover:scale-105 transition-all duration-300`}>
    <div className="flex items-center gap-4">
      <div className={`w-14 h-14 ${color.replace('border', 'bg').replace('200', '100')} rounded-xl flex items-center justify-center`}>
        <Icon className={`w-7 h-7 ${color.replace('border', 'text').replace('200', '600')}`} />
      </div>
      <div>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

// --- SOUS-SECTION : PARTICULIERS ---

const ReviewsParticuliers = () => {
  const reviews: Review[] = [
    {
      id: 1,
      name: "Sophie Therese",
      location: "Yaounde, Cameroun",
      rating: 5,
      comment: "Service exceptionnel ! La voiture était impeccable et la réservation s'est faite en quelques clics. L'équipe est très professionnelle et à l'écoute.",
      date: "15 Nov 2024",
      helpful: 24,
      vehicle: "Renault Clio"
    },
    {
      id: 2,
      name: "Thomas Frank",
      location: "Bafoussam, Cameroun",
      rating: 4,
      comment: "Très bonne expérience globale. Le véhicule était propre et en bon état. Petit bémol sur le délai de récupération, mais le service client a été réactif.",
      date: "10 Nov 2024",
      helpful: 18,
      vehicle: "Peugeot 208"
    },
    {
      id: 3,
      name: "Marie Essono",
      location: "Douala, Cameroun",
      rating: 5,
      comment: "Parfait pour un weekend ! Prix compétitifs et véhicule récent. J'ai particulièrement apprécié la flexibilité des horaires de restitution.",
      date: "5 Nov 2024",
      helpful: 31,
      vehicle: "Citroën C3"
    },
    {
      id: 4,
      name: "Pierre Atangana",
      location: "Kribi, Cameroun",
      rating: 5,
      comment: "Excellent rapport qualité-prix. Le processus de location est simple et rapide. La voiture était exactement comme décrite. Service au top !",
      date: "1 Nov 2024",
      helpful: 15,
      vehicle: "Volkswagen Polo"
    }
  ];

  return (
    <div>
      <div className="text-center mb-12 animate-fadeIn">
        <div className="inline-block mb-4">
          <span className="bg-[#002AD7] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
            ⭐ Avis Vérifiés
          </span>
        </div>
        <h2 className="text-5xl font-extrabold text-[#002AD7] mb-4">
          Nos Clients Particuliers
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Découvrez les expériences authentiques de nos clients satisfaits
        </p>

        <div className="flex items-center justify-center gap-4 mt-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl p-6 max-w-md mx-auto shadow-xl border-2 border-blue-200">
          <div className="flex flex-col items-center">
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-4xl font-black text-blue-900">4.8/5</span>
          </div>
          <div className="text-left">
            <p className="text-gray-700 font-semibold">Note moyenne</p>
            <p className="text-gray-600 text-sm">{reviews.length} avis clients</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
        <StatsCard icon={TrendingUp} label="Satisfaction" value="98%" color="border-blue-200" />
        <StatsCard icon={Award} label="Notes 5★" value="75%" color="border-blue-200" />
        <StatsCard icon={User} label="Clients" value="1,250+" color="border-blue-200" />
      </div>

      <div className="grid gap-8 max-w-5xl mx-auto">
        {reviews.map((review, index) => (
          <ReviewCard key={review.id} review={review} type="particuliers" index={index} />
        ))}
      </div>
    </div>
  );
};

// --- SOUS-SECTION : PROFESSIONNELS ---

const ReviewsPublics = () => {
  const reviews: Review[] = [
    {
      id: 1,
      name: "TechCorp Solutions",
      location: "Yaounde",
      rating: 5,
      comment: "Partenaire fiable pour notre flotte d'entreprise. Gestion professionnelle des contrats longue durée et service de maintenance impeccable.",
      date: "20 Nov 2024",
      helpful: 42,
      vehicle: "Flotte de 15 véhicules"
    },
    {
      id: 2,
      name: "Consulting Group",
      location: "Douala",
      rating: 5,
      comment: "Excellent service B2B. Les véhicules sont toujours disponibles pour nos consultants en déplacement. Facturation claire et service dédié.",
      date: "18 Nov 2024",
      helpful: 35,
      vehicle: "Mercedes Classe E"
    },
    {
      id: 3,
      name: "BTP Construction",
      location: "Kribi",
      rating: 4,
      comment: "Bonne solution pour nos besoins ponctuels en véhicules utilitaires. Tarifs compétitifs pour les entreprises et large choix de véhicules adaptés.",
      date: "12 Nov 2024",
      helpful: 28,
      vehicle: "Renault Master"
    },
    {
      id: 4,
      name: "Services Logistiques Pro",
      location: "Bafoussam",
      rating: 5,
      comment: "Partenariat de confiance depuis 2 ans. La flexibilité des contrats et la qualité du service nous permettent de répondre aux besoins de nos clients.",
      date: "8 Nov 2024",
      helpful: 51,
      vehicle: "Flotte mixte VP/VU"
    }
  ];

  return (
    <div>
      <div className="text-center mb-12 animate-fadeIn">
        <div className="inline-block mb-4">
          <span className="bg-[#F76513] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
            🏢 Partenaires Pro
          </span>
        </div>
        <h2 className="text-5xl font-extrabold text-[#F76513] mb-4">
          Nos Clients Entreprises
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          La confiance des professionnels depuis plus de 10 ans
        </p>

        <div className="flex items-center justify-center gap-4 mt-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-3xl p-6 max-w-md mx-auto shadow-xl border-2 border-orange-200">
          <div className="flex flex-col items-center">
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-4xl font-black text-orange-900">4.9/5</span>
          </div>
          <div className="text-left">
            <p className="text-gray-700 font-semibold">Note moyenne</p>
            <p className="text-gray-600 text-sm">{reviews.length} avis entreprises</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
        <StatsCard icon={Building2} label="Entreprises" value="350+" color="border-orange-200" />
        <StatsCard icon={Award} label="Notes 5★" value="85%" color="border-orange-200" />
        <StatsCard icon={TrendingUp} label="Renouvellement" value="92%" color="border-orange-200" />
      </div>

      <div className="grid gap-8 max-w-5xl mx-auto">
        {reviews.map((review, index) => (
          <ReviewCard key={review.id} review={review} type="professionnels" index={index} />
        ))}
      </div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL (Refactorisé en Section) ---
export default function Testimonials() {
  const [activeTab, setActiveTab] = useState("particuliers");

  return (
    <section className="py-24 bg-gradient-to-br from-white via-blue-50/30 to-orange-50/30">
      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>

      {/* Header de Section (Remplace le Header de Page) */}
      <div className="container mx-auto px-6 mb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200 mb-6">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-green-800 font-bold text-xs uppercase tracking-wider">Avis Vérifiés</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">
          Ce qu'ils disent <span className="text-[#002AD7]">de nous</span>
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Découvrez les retours d'expérience de notre communauté grandissante de particuliers et de professionnels.
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tabs avec effet moderne */}
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 mb-16">
            <TabsTrigger
              value="particuliers"
              className={`flex items-center justify-center gap-3 ${activeTab === "particuliers"
                ? "bg-[#002AD7] text-white shadow-xl"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              onClick={() => setActiveTab("particuliers")}
            >
              <User className="w-5 h-5" />
              <span className="font-bold">Particuliers</span>
            </TabsTrigger>
            <TabsTrigger
              value="professionnels"
              className={`flex items-center justify-center gap-3 ${activeTab === "professionnels"
                ? "bg-[#F76513] text-white shadow-xl"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              onClick={() => setActiveTab("professionnels")}
            >
              <Building2 className="w-5 h-5" />
              <span className="font-bold">Entreprises</span>
            </TabsTrigger>
          </TabsList>

          {activeTab === "particuliers" && (
            <TabsContent value="particuliers" className="mt-0">
              <ReviewsParticuliers />
            </TabsContent>
          )}

          {activeTab === "professionnels" && (
            <TabsContent value="professionnels" className="mt-0">
              <ReviewsPublics />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </section>
  );
}