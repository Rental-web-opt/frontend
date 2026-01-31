"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, CheckCircle, Calendar, CalendarClock, Clock, Loader2, UserCheck, User, AlertCircle } from "lucide-react";
import { carService, bookingService, driverService } from "@/services/api";
import { allCars } from "@/modules/carsData";
import { useAuth } from "@/context/AuthContext";

export default function CarDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [car, setCar] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // États de Réservation
    const [pricingMode, setPricingMode] = useState<'daily' | 'monthly' | 'hourly'>('daily');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Gestion Chauffeurs
    const [withDriver, setWithDriver] = useState(false);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
    const [loadingDrivers, setLoadingDrivers] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // 1. Charger la voiture
    useEffect(() => {
        if (id) {
            setLoading(true);
            carService.getById(Number(id))
                .then((res) => setCar(res.data))
                .catch((err) => {
                    console.error("Erreur API, recherche dans les données statiques:", err);
                    const found = allCars.find((c) => c.id === Number(id));
                    if (found) {
                        setCar({
                            ...found,
                            pricePerDay: found.price,
                            pricePerHour: found.price / 10, // Estimation
                        });
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    // 2. Charger les chauffeurs
    useEffect(() => {
        if (withDriver && drivers.length === 0) {
            setLoadingDrivers(true);
            driverService.getAll()
                .then(res => setDrivers(res.data))
                .catch(err => console.error("Erreur chargement chauffeurs", err))
                .finally(() => setLoadingDrivers(false));
        }
    }, [withDriver, drivers.length]); // Ajout dépendance safe

    const handleBooking = async () => {
        if (!user) { router.push("/Login"); return; }

        // --- VALIDATION DES DATES ---
        if (!startDate || !endDate) {
            setStatusMsg({ type: 'error', text: "Veuillez sélectionner les dates de début et de fin." });
            return;
        }
        if (new Date(startDate) >= new Date(endDate)) {
            setStatusMsg({ type: 'error', text: "La date de fin doit être après la date de début." });
            return;
        }

        // --- VALIDATION CHAUFFEUR ---
        if (withDriver && !selectedDriverId) {
            setStatusMsg({ type: 'error', text: "Veuillez choisir un chauffeur dans la liste." });
            return;
        }

        setIsSubmitting(true);
        setStatusMsg(null);

        try {
            const formatForJava = (dateStr: string) => {
                if (!dateStr.includes("T")) return dateStr + "T08:00:00";
                return dateStr.length === 16 ? dateStr + ":00" : dateStr;
            };

            const bookingPayload = {
                carId: car.id,
                userId: user.id,
                driverId: withDriver ? selectedDriverId : null,
                startDate: formatForJava(startDate),
                endDate: formatForJava(endDate),
                rentalType: pricingMode === 'monthly' ? "MONTHLY" : (pricingMode === 'hourly' ? "HOURLY" : "DAILY"),
                withDriver: withDriver
            };

            console.log("Envoi :", bookingPayload);

            await bookingService.create(bookingPayload)
                .then(res => {
                    const bookingId = res.data.id; // Assume API returns created booking with ID
                    const totalAmount = displayedPrice; // Value calculated above

                    setStatusMsg({ type: 'success', text: "Réservation initiée ! Redirection vers le paiement..." });

                    setTimeout(() => {
                        router.push(`/Checkout?amount=${totalAmount}&bookingId=${bookingId}&description=Location ${car.name}`);
                    }, 1000);
                });


        } catch (error: any) {
            console.error("Erreur:", error);
            const msg = error.response?.data?.message || "Erreur lors de la réservation.";
            setStatusMsg({ type: 'error', text: String(msg) });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
    if (!car) return <div className="min-h-screen flex items-center justify-center">Véhicule introuvable</div>;

    // Calculs Prix
    const dailyPrice = car.pricePerDay || 0;
    const monthlyPrice = car.monthlyPrice || (dailyPrice * 30 * 0.8);
    const hourlyPrice = car.pricePerHour || (dailyPrice / 10);
    const driverPrice = 15000;

    let displayedPrice = dailyPrice;
    let unit = "/ jour";
    if (pricingMode === 'monthly') { displayedPrice = monthlyPrice; unit = "/ mois"; }
    else if (pricingMode === 'hourly') { displayedPrice = hourlyPrice; unit = "/ heure"; }

    if (withDriver && pricingMode === 'daily') displayedPrice += driverPrice;

    return (
        <div className="min-h-screen bg-slate-50 font-sans py-10 px-4 md:px-8">

            <div className="max-w-6xl mx-auto mb-8">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition font-bold">
                    <ArrowLeft size={20} /> Retour
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* IMAGES - Galerie Horizontale à gauche */}
                <div className="flex flex-col gap-6">
                    <div className="relative h-[400px] md:h-[500px] bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100">
                        <Image src={car.image || "/assets/car1.jpeg"} alt={car.name || "Voiture"} fill className="object-cover" />
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-sm font-bold text-sm">
                            <Star size={16} className="text-orange-400 fill-orange-400" /> {car.rating || 4.8}
                        </div>
                    </div>

                    {/* Aligné horizontalement */}
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="relative h-32 bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition hover:scale-105 cursor-pointer">
                                <Image
                                    src={car.gallery?.[i] || car.image || "/assets/car1.jpeg"}
                                    alt={`Vue ${i}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* INFOS */}
                <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-xl border border-slate-100 h-fit">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">{car.name}</h1>

                    {/* SÉLECTEUR TYPE */}
                    <div className="bg-slate-50 p-1.5 rounded-2xl flex relative mb-6 border border-slate-200 overflow-x-auto">
                        <button onClick={() => setPricingMode('hourly')} className={`flex-1 py-3 px-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1 ${pricingMode === 'hourly' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}><Clock size={16} /> Heure</button>
                        <button onClick={() => setPricingMode('daily')} className={`flex-1 py-3 px-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1 ${pricingMode === 'daily' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}><Calendar size={16} /> Jour</button>
                        <button onClick={() => setPricingMode('monthly')} className={`flex-1 py-3 px-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1 ${pricingMode === 'monthly' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500'}`}><CalendarClock size={16} /> Mois</button>
                    </div>

                    {/* PRIX */}
                    <div className="mb-6">
                        <div className="flex items-end gap-2 mb-1">
                            <span className="text-5xl font-black tracking-tighter text-slate-900">{displayedPrice.toLocaleString()}</span>
                            <span className="text-xl font-bold text-slate-400 mb-1">CFA {unit}</span>
                        </div>
                        {withDriver && pricingMode === 'daily' && (
                            <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                                <CheckCircle size={12} /> Chauffeur inclus (+15 000 CFA)
                            </p>
                        )}
                    </div>

                    {/* --- SECTION CHAUFFEUR --- */}
                    {pricingMode !== 'monthly' && (
                        <div className="mb-8">
                            {/* Toggle Option */}
                            <div
                                onClick={() => {
                                    setWithDriver(!withDriver);
                                    // Si on décoche, on réinitialise le choix
                                    if (withDriver) setSelectedDriverId(null);
                                }}
                                className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all mb-4
                            ${withDriver ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}
                        `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${withDriver ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        <UserCheck size={20} />
                                    </div>
                                    <div>
                                        <p className={`font-bold ${withDriver ? 'text-blue-900' : 'text-slate-700'}`}>Chauffeur privé</p>
                                        <p className="text-xs text-slate-500">Service premium (+15 000 CFA)</p>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${withDriver ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                                    {withDriver && <CheckCircle size={14} className="text-white" />}
                                </div>
                            </div>

                            {/* LISTE DES CHAUFFEURS DISPONIBLES */}
                            {withDriver && (
                                <div className="animate-fadeIn">
                                    <h3 className="text-sm font-bold text-slate-700 mb-3 ml-1">Choisissez votre chauffeur :</h3>

                                    {loadingDrivers ? (
                                        <div className="text-center py-4"><Loader2 className="animate-spin inline text-blue-500" /> Chargement...</div>
                                    ) : drivers.length === 0 ? (
                                        <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg flex items-center gap-2">
                                            <AlertCircle size={16} /> Aucun chauffeur disponible pour le moment.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                                            {drivers.map((driver) => (
                                                <div
                                                    key={driver.id}
                                                    onClick={() => setSelectedDriverId(driver.id)}
                                                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3
                                                ${selectedDriverId === driver.id
                                                            ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                                                            : 'border-slate-100 hover:border-blue-300 bg-white'}
                                            `}
                                                >
                                                    <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden flex-shrink-0 relative">
                                                        {driver.avatar ? (
                                                            <Image
                                                                src={driver.avatar}
                                                                fill
                                                                sizes="40px"
                                                                alt={driver.fullName || "Chauffeur"}
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={20} /></div>
                                                        )}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="font-bold text-sm truncate text-slate-900">{driver.fullName || "Chauffeur"}</p>
                                                        <div className="flex items-center text-xs text-orange-500 font-bold gap-1">
                                                            <Star size={10} fill="currentColor" /> 4.9
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* DATES */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Début</label>
                            <input
                                type="datetime-local"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Fin</label>
                            <input
                                type="datetime-local"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* MESSAGES & BOUTON */}
                    {statusMsg && (
                        <div className={`p-4 rounded-xl mb-4 text-sm font-bold flex items-center gap-2 ${statusMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {statusMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {statusMsg.text}
                        </div>
                    )}

                    <button
                        onClick={handleBooking}
                        disabled={isSubmitting}
                        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all flex items-center justify-center gap-2
                    ${isSubmitting ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-orange-600'}
                `}
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirmer la réservation"}
                    </button>

                </div>
            </div>
        </div>
    );
}