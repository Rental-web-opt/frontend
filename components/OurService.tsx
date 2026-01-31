"use client";

import Image from 'next/image';
import Link from 'next/link'; // N'oubliez pas d'importer Link
import { Car, UserCheck, Building2, ArrowRight } from 'lucide-react';

export default function OurServices() {
  const services = [
    {
      id: 1,
      title: "Réservation de Véhicule",
      description: "Réservez tout type de véhicule en un clic : voitures, motos, et plus encore.",
      image: "/assets/vehicule1.png",
      icon: Car,
      color: "blue",
      link: "/Reviews/vehicles" // Lien vers les avis véhicules
    },
    {
      id: 2,
      title: "Chauffeur Privé",
      description: "Optez pour le confort en réservant un chauffeur professionnel noté.",
      image: "/assets/driver.png",
      icon: UserCheck,
      color: "orange",
      link: "/Reviews/drivers" // Lien vers les avis chauffeurs
    },
    {
      id: 3,
      title: "Gestion d'Agence",
      description: "Découvrez nos agences partenaires et leurs évaluations.",
      image: "/assets/agencies.png",
      icon: Building2,
      color: "blue",
      link: "/Reviews/agencies" // Lien vers les avis agences
    },
  ];

  return (
    <section className="py-16 w-full max-w-[1440px] mx-auto px-6">
      <div className="text-center mb-20">
        <span className="text-[#F76513] font-bold tracking-wider text-sm uppercase">Nos Services</span>
        <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mt-2">
          Tout ce dont vous avez besoin
        </h2>
        <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">
          Une suite complète de services pour faciliter vos déplacements.
          Consultez les avis de la communauté pour chaque catégorie.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="group bg-white rounded-3xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col"
          >
            {/* ... (Partie Image inchangée) ... */}
            <div className={`relative h-64 w-full rounded-2xl overflow-hidden mb-6 ${service.color === 'orange' ? 'bg-orange-50' : 'bg-blue-50'}`}>
              <div className="absolute inset-0 flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-500">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={400}
                  height={300}
                  className="object-contain w-full h-full drop-shadow-xl"
                />
              </div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm">
                <service.icon className={`w-6 h-6 ${service.color === 'orange' ? 'text-[#F76513]' : 'text-[#002AD7]'}`} />
              </div>
            </div>

            <div className="px-4 pb-4 flex-1 flex flex-col">
              <h3 className="text-2xl font-bold text-black mb-3 group-hover:text-[#002AD7] transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-500 leading-relaxed mb-6 flex-1">
                {service.description}
              </p>

              {/* Le Lien est ici */}
              <Link href={service.link}>
                <button className={`flex items-center gap-2 font-bold transition-all ${service.color === 'orange' ? 'text-[#F76513] hover:text-orange-700' : 'text-[#002AD7] hover:text-blue-800'}`}>
                  Voir les avis & profils <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}