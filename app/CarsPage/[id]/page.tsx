"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, CheckCircle, Calendar, CalendarClock, Clock, Loader2, UserCheck, User, AlertCircle, Tag, XCircle, CreditCard } from "lucide-react";
import { carService, bookingService, driverService } from "@/services/api";
import { allCars } from "@/modules/carsData";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";

export default function CarDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [car, setCar] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // États de Réservation
    const [pricingMode, setPricingMode] = useState<'daily' | 'monthly' | 'hourly'>('daily');

    // Dates selon le mode
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("08:00");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("18:00");

    // Disponibilité
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [occupiedSlots, setOccupiedSlots] = useState<any[]>([]);

    // Gestion Chauffeurs
    const [withDriver, setWithDriver] = useState(false);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
    const [loadingDrivers, setLoadingDrivers] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Option paiement
    const [payNow, setPayNow] = useState(true);

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
                            pricePerHour: found.price / 10,
                            monthlyPrice: found.monthlyPrice || (found.price * 30 * 0.8),
                        });
                    }
                })
                .finally(() => setLoading(false));

            // Charger les créneaux occupés
            api.get(`/bookings/car/${id}/occupied`)
                .then(res => setOccupiedSlots(res.data))
                .catch(err => console.log("Pas de créneaux occupés"));
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
    }, [withDriver, drivers.length]);

    // 3. Vérifier la disponibilité quand les dates changent
    useEffect(() => {
        const checkAvailability = async () => {
            if (!car || !startDate || !endDate) {
                setIsAvailable(null);
                return;
            }

            const fullStartDate = `${startDate}T${startTime}:00`;
            const fullEndDate = `${endDate}T${endTime}:00`;

            if (new Date(fullStartDate) >= new Date(fullEndDate)) {
                setIsAvailable(null);
                return;
            }

            setCheckingAvailability(true);
            try {
                const res = await api.get(`/bookings/check-availability`, {
                    params: {
                        carId: car.id,
                        startDate: fullStartDate,
                        endDate: fullEndDate
                    }
                });
                setIsAvailable(res.data.available);
            } catch (err) {
                console.error("Erreur vérification disponibilité", err);
                setIsAvailable(null);
            } finally {
                setCheckingAvailability(false);
            }
        };

        const timeout = setTimeout(checkAvailability, 500); // Debounce
        return () => clearTimeout(timeout);
    }, [car, startDate, endDate, startTime, endTime]);

    // === CALCUL DYNAMIQUE DU PRIX ===
    const priceCalculation = useMemo(() => {
        if (!car) return { unitPrice: 0, totalPrice: 0, duration: 0, durationHours: 0, unit: "jour", discount: 0 };

        const dailyPrice = car.pricePerDay || 0;
        const hourlyPrice = car.pricePerHour || (dailyPrice / 10);
        const monthlyPrice = car.monthlyPrice || (dailyPrice * 30 * 0.8);
        const driverDailyPrice = 15000;

        let unitPrice = dailyPrice;
        let unit = "jour";
        let duration = 1;
        let durationHours = 0;
        let totalPrice = dailyPrice;
        let discount = 0;

        if (startDate && endDate) {
            const fullStartDate = `${startDate}T${startTime}:00`;
            const fullEndDate = `${endDate}T${endTime}:00`;
            const start = new Date(fullStartDate);
            const end = new Date(fullEndDate);

            if (end > start) {
                // Calcul en heures exactes
                durationHours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));

                if (pricingMode === 'hourly') {
                    duration = durationHours;
                    unitPrice = hourlyPrice;
                    unit = "heure";
                    totalPrice = unitPrice * duration;

                } else if (pricingMode === 'monthly') {
                    const totalDays = Math.ceil(durationHours / 24);
                    const months = Math.floor(totalDays / 30);
                    const remainingDays = totalDays % 30;

                    unitPrice = monthlyPrice;
                    unit = "mois";

                    if (months >= 1) {
                        duration = months;
                        totalPrice = (months * monthlyPrice) + (remainingDays * dailyPrice * 0.9);
                        discount = 20;
                    } else {
                        duration = totalDays;
                        unit = "jour";
                        totalPrice = dailyPrice * totalDays * 0.95;
                        discount = 5;
                    }

                } else {
                    // DAILY - calcul précis
                    duration = Math.ceil(durationHours / 24);
                    if (duration < 1) duration = 1;

                    unitPrice = dailyPrice;
                    unit = "jour";
                    totalPrice = unitPrice * duration;

                    // Réductions progressives
                    if (duration >= 7 && duration < 14) {
                        discount = 5;
                        totalPrice = totalPrice * 0.95;
                    } else if (duration >= 14 && duration < 30) {
                        discount = 10;
                        totalPrice = totalPrice * 0.90;
                    } else if (duration >= 30) {
                        discount = 15;
                        totalPrice = totalPrice * 0.85;
                    }
                }
            }
        }

        // Ajouter le chauffeur
        if (withDriver && durationHours > 0) {
            const daysForDriver = Math.ceil(durationHours / 24);
            totalPrice += driverDailyPrice * Math.max(1, daysForDriver);
        }

        return { unitPrice, totalPrice, duration, durationHours, unit, discount };
    }, [car, startDate, endDate, startTime, endTime, pricingMode, withDriver]);

    const handleBooking = async () => {
        if (!user) { router.push("/Login"); return; }

        if (!startDate || !endDate) {
            setStatusMsg({ type: 'error', text: "Veuillez sélectionner les dates." });
            return;
        }

        const fullStartDate = `${startDate}T${startTime}:00`;
        const fullEndDate = `${endDate}T${endTime}:00`;

        if (new Date(fullStartDate) >= new Date(fullEndDate)) {
            setStatusMsg({ type: 'error', text: "La date/heure de fin doit être après le début." });
            return;
        }

        if (isAvailable === false) {
            setStatusMsg({ type: 'error', text: "Ce véhicule n'est pas disponible pour cette période." });
            return;
        }

        if (withDriver && !selectedDriverId) {
            setStatusMsg({ type: 'error', text: "Veuillez choisir un chauffeur." });
            return;
        }

        setIsSubmitting(true);
        setStatusMsg(null);

        try {
            const bookingPayload = {
                car: { id: car.id },
                userId: user.id,
                driverId: withDriver ? selectedDriverId : null,
                startDate: fullStartDate,
                endDate: fullEndDate,
                rentalType: pricingMode === 'monthly' ? "MONTHLY" : (pricingMode === 'hourly' ? "HOURLY" : "DAILY"),
                withDriver: withDriver
            };

            console.log("Envoi :", bookingPayload);

            const res = await bookingService.create(bookingPayload);

            if (res.data.error) {
                setStatusMsg({ type: 'error', text: res.data.message });
                return;
            }

            const bookingId = res.data.id;
            const totalAmount = res.data.totalPrice || priceCalculation.totalPrice;

            if (payNow) {
                // Rediriger vers le paiement
                setStatusMsg({ type: 'success', text: "Réservation créée ! Redirection vers le paiement..." });
                setTimeout(() => {
                    router.push(`/Checkout?amount=${totalAmount}&bookingId=${bookingId}&description=Location ${car.name}`);
                }, 1500);
            } else {
                // Paiement différé - rester sur la page profil
                setStatusMsg({ type: 'success', text: "Réservation enregistrée ! Vous pouvez payer plus tard depuis votre profil." });
                setTimeout(() => {
                    router.push("/Profil?tab=home");
                }, 2000);
            }

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

    // Prix de base pour affichage
    const dailyPrice = car.pricePerDay || 0;
    const monthlyPrice = car.monthlyPrice || (dailyPrice * 30 * 0.8);
    const hourlyPrice = car.pricePerHour || (dailyPrice / 10);

    return (
        <div className="min-h-screen bg-slate-50 font-sans py-10 px-4 md:px-8">
            <div className="max-w-6xl mx-auto mb-8">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition font-bold">
                    <ArrowLeft size={20} /> Retour
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* IMAGES */}
                <div className="flex flex-col gap-6">
                    <div className="relative h-[400px] md:h-[500px] bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100">
                        <Image src={car.image || "/assets/car1.jpeg"} alt={car.name || "Voiture"} fill className="object-cover" />
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-sm font-bold text-sm">
                            <Star size={16} className="text-orange-400 fill-orange-400" /> {car.rating || 4.8}
                        </div>
                    </div>

                    {/* Créneaux occupés */}
                    {occupiedSlots.length > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                            <h4 className="font-bold text-orange-800 text-sm mb-2">📅 Périodes déjà réservées</h4>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {occupiedSlots.map((slot, i) => (
                                    <div key={i} className="text-xs text-orange-700 bg-orange-100 rounded-lg px-3 py-2">
                                        {new Date(slot.startDate).toLocaleDateString('fr-FR')} → {new Date(slot.endDate).toLocaleDateString('fr-FR')}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* INFOS */}
                <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-xl border border-slate-100 h-fit">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">{car.name}</h1>

                    {/* SÉLECTEUR TYPE */}
                    <div className="bg-slate-50 p-1.5 rounded-2xl flex relative mb-6 border border-slate-200">
                        <button onClick={() => setPricingMode('hourly')} className={`flex-1 py-3 px-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1 ${pricingMode === 'hourly' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}><Clock size={16} /> Heure</button>
                        <button onClick={() => setPricingMode('daily')} className={`flex-1 py-3 px-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1 ${pricingMode === 'daily' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}><Calendar size={16} /> Jour</button>
                        <button onClick={() => setPricingMode('monthly')} className={`flex-1 py-3 px-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1 ${pricingMode === 'monthly' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500'}`}><CalendarClock size={16} /> Mois</button>
                    </div>

                    {/* PRIX DE BASE */}
                    <div className="mb-4">
                        <div className="flex items-end gap-2 mb-1">
                            <span className="text-4xl font-black tracking-tighter text-slate-900">
                                {pricingMode === 'hourly' ? hourlyPrice.toLocaleString() : pricingMode === 'monthly' ? monthlyPrice.toLocaleString() : dailyPrice.toLocaleString()}
                            </span>
                            <span className="text-lg font-bold text-slate-400 mb-1">CFA / {pricingMode === 'hourly' ? 'heure' : pricingMode === 'monthly' ? 'mois' : 'jour'}</span>
                        </div>
                        {pricingMode === 'monthly' && (
                            <p className="text-xs text-purple-600 font-bold flex items-center gap-1">
                                <Tag size={12} /> Réduction de 20% incluse
                            </p>
                        )}
                    </div>

                    {/* CHAUFFEUR */}
                    {pricingMode !== 'hourly' && (
                        <div className="mb-6">
                            <div
                                onClick={() => { setWithDriver(!withDriver); if (withDriver) setSelectedDriverId(null); }}
                                className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all mb-4
                                    ${withDriver ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${withDriver ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        <UserCheck size={20} />
                                    </div>
                                    <div>
                                        <p className={`font-bold ${withDriver ? 'text-blue-900' : 'text-slate-700'}`}>Chauffeur privé</p>
                                        <p className="text-xs text-slate-500">+15 000 CFA/jour</p>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${withDriver ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                                    {withDriver && <CheckCircle size={14} className="text-white" />}
                                </div>
                            </div>

                            {withDriver && (
                                <div className="animate-fadeIn">
                                    <h3 className="text-sm font-bold text-slate-700 mb-3">Choisissez votre chauffeur :</h3>
                                    {loadingDrivers ? (
                                        <div className="text-center py-4"><Loader2 className="animate-spin inline text-blue-500" /></div>
                                    ) : drivers.length === 0 ? (
                                        <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg flex items-center gap-2">
                                            <AlertCircle size={16} /> Aucun chauffeur disponible.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                                            {drivers.map((driver) => (
                                                <div
                                                    key={driver.id}
                                                    onClick={() => setSelectedDriverId(driver.id)}
                                                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3
                                                        ${selectedDriverId === driver.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-blue-300'}`}
                                                >
                                                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                                                        <User size={20} className="text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-900">{driver.fullName || "Chauffeur"}</p>
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

                    {/* DATES SELON LE MODE */}
                    <div className="space-y-4 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Date début</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Heure début</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Date fin</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Heure fin</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* INDICATEUR DISPONIBILITÉ */}
                    {startDate && endDate && (
                        <div className={`p-3 rounded-xl mb-4 flex items-center gap-2 text-sm font-bold transition-all
                            ${checkingAvailability ? 'bg-slate-100 text-slate-500' :
                                isAvailable === true ? 'bg-green-100 text-green-700' :
                                    isAvailable === false ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                            {checkingAvailability ? (
                                <><Loader2 size={16} className="animate-spin" /> Vérification...</>
                            ) : isAvailable === true ? (
                                <><CheckCircle size={16} /> Véhicule disponible !</>
                            ) : isAvailable === false ? (
                                <><XCircle size={16} /> Non disponible pour cette période</>
                            ) : null}
                        </div>
                    )}

                    {/* RÉSUMÉ PRIX */}
                    {startDate && endDate && priceCalculation.durationHours > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-4 mb-4">
                            <h4 className="text-sm font-bold text-slate-700 mb-2">📋 Récapitulatif</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Durée:</span>
                                    <span className="font-bold text-slate-800">
                                        {priceCalculation.duration} {priceCalculation.unit}{priceCalculation.duration > 1 ? 's' : ''}
                                        <span className="text-slate-400 font-normal ml-1">({priceCalculation.durationHours}h)</span>
                                    </span>
                                </div>
                                {priceCalculation.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Réduction:</span>
                                        <span className="font-bold">-{priceCalculation.discount}%</span>
                                    </div>
                                )}
                                {withDriver && (
                                    <div className="flex justify-between text-blue-600">
                                        <span>Chauffeur:</span>
                                        <span className="font-bold">+ inclus</span>
                                    </div>
                                )}
                                <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between">
                                    <span className="font-bold text-slate-800">TOTAL:</span>
                                    <span className="font-black text-xl text-blue-600">{Math.round(priceCalculation.totalPrice).toLocaleString()} CFA</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* OPTION PAIEMENT */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <button
                            type="button"
                            onClick={() => setPayNow(true)}
                            className={`p-4 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center gap-1
                                ${payNow ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                        >
                            <CreditCard size={20} />
                            Payer maintenant
                        </button>
                        <button
                            type="button"
                            onClick={() => setPayNow(false)}
                            className={`p-4 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center gap-1
                                ${!payNow ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                        >
                            <Clock size={20} />
                            Payer plus tard
                        </button>
                    </div>

                    {/* MESSAGES */}
                    {statusMsg && (
                        <div className={`p-4 rounded-xl mb-4 text-sm font-bold flex items-center gap-2 ${statusMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {statusMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {statusMsg.text}
                        </div>
                    )}

                    {/* BOUTON */}
                    <button
                        onClick={handleBooking}
                        disabled={isSubmitting || isAvailable === false || !startDate || !endDate}
                        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all flex items-center justify-center gap-2
                            ${isSubmitting || isAvailable === false ? 'bg-slate-400 cursor-not-allowed' : payNow ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-500 hover:bg-orange-600'}`}
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : (
                            <>
                                {payNow ? 'Réserver et Payer' : 'Réserver (payer plus tard)'}
                                {priceCalculation.totalPrice > 0 && ` • ${Math.round(priceCalculation.totalPrice).toLocaleString()} CFA`}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}