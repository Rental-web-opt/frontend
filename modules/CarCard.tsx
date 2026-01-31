import { Heart, User, Star, DoorOpen, CalendarClock } from "lucide-react";
import Image from "next/image";

interface CarProps {
  data: {
    name: string;
    price: number;
    monthlyPrice?: number; // <-- Nouveau champ optionnel
    currency: string;
    rating: number;
    seats: number;
    image: string;
    transmission: string; // Mis à jour en string pour correspondre à "Automatique"
    tag?: string;
    isFavorite: boolean;
  };
}

export default function CarCard({ data }: CarProps) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative flex flex-col items-center group h-full">
      
      {/* Badge Abonnement */}
      {data.monthlyPrice && (
        <div className="absolute top-4 left-4 z-10 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <CalendarClock size={12} /> Abonnement
        </div>
      )}

      {/* Header Card */}
      <div className="w-full flex justify-end items-start mb-2">
        <Heart 
          className={`w-5 h-5 cursor-pointer z-20 ${data.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} 
        />
      </div>

      {/* Image */}
      <div className="relative w-full h-40 mb-2 rounded-xl overflow-hidden bg-gray-50">
        <Image
            src={data.image}
            alt={data.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {data.tag && (
            <span className="absolute bottom-0 right-0 bg-orange-500 text-white text-xs px-3 py-1 rounded-tl-lg font-medium">
            {data.tag}
            </span>
        )}
      </div>

      {/* Titre */}
      <div className="w-full text-left mb-1">
         <h3 className="text-blue-900 font-bold text-lg leading-tight truncate">{data.name}</h3>
      </div>

      {/* Price Section */}
      <div className="w-full text-left mb-3">
        <div className="flex items-baseline gap-1">
             <span className="text-gray-900 font-black text-xl">
            {data.price.toLocaleString("fr-FR")} <span className="text-sm font-normal text-gray-500">{data.currency}/jr</span>
            </span>
        </div>
        
        {/* Prix Abonnement */}
        {data.monthlyPrice && (
            <div className="text-xs font-semibold text-purple-600 mt-0.5 flex items-center gap-1">
                <CalendarClock size={12}/> Ou {data.monthlyPrice.toLocaleString("fr-FR")} {data.currency} / mois
            </div>
        )}
      </div>

      {/* Specs Icons */}
      <div className="flex justify-start gap-4 w-full text-gray-400 text-xs mb-4 border-t border-gray-100 pt-3 mt-auto">
        <div className="flex items-center gap-1">
          <User size={14} /> <span>{data.seats}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star size={14} className="text-orange-400 fill-orange-400" /> <span>{data.rating}</span>
        </div>
        <div className="flex items-center gap-1">
          <DoorOpen size={14} /> <span>{data.transmission === "Automatique" ? "Auto" : "Man."}</span>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
        Réserver
      </button>
    </div>
  );
}