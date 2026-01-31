"use client";

import React, { useState } from "react";
import { Search, Filter, X, Loader2 } from "lucide-react";
import { searchService } from "@/services/api";

interface CarResult {
    id: string;
    name: string;
    brand: string;
    type: string;
    pricePerDay: number;
    available: boolean;
}

interface SearchBarProps {
    onResults?: (results: CarResult[]) => void;
}

export default function SearchBar({ onResults }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<CarResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [filters, setFilters] = useState({
        type: "",
        minPrice: "",
        maxPrice: "",
    });
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = async () => {
        if (!query.trim() && !filters.type && !filters.minPrice && !filters.maxPrice) {
            return;
        }

        setLoading(true);
        try {
            // Pour Vercel : On utilise les données locales (allCars)
            const allMockCars = require("@/modules/carsData").allCars;

            const filtered = allMockCars.filter((car: any) => {
                const matchQuery = !query.trim() ||
                    car.name.toLowerCase().includes(query.toLowerCase()) ||
                    (car.specs?.marque && car.specs.marque.toLowerCase().includes(query.toLowerCase()));

                const matchType = !filters.type || car.type.toLowerCase() === filters.type.toLowerCase();

                const min = filters.minPrice ? parseFloat(filters.minPrice) : 0;
                const max = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
                const matchPrice = car.price >= min && car.price <= max;

                return matchQuery && matchType && matchPrice;
            });

            // Conversion au format CarResult
            const mappedResults: CarResult[] = filtered.map((car: any) => ({
                id: car.id.toString(),
                name: car.name,
                brand: car.specs?.marque || "Inconnu",
                type: car.type,
                pricePerDay: car.price,
                available: true
            }));

            setResults(mappedResults);
            setShowResults(true);
            if (onResults) onResults(mappedResults);
        } catch (error) {
            console.error("Erreur de recherche locale:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
        setShowResults(false);
        setFilters({ type: "", minPrice: "", maxPrice: "" });
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            {/* Barre de recherche principale */}
            <div className="flex items-center gap-2 bg-white rounded-2xl shadow-lg p-2 border border-slate-200">
                <div className="flex-1 flex items-center gap-3 px-4">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une voiture (marque, modèle...)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="flex-1 py-3 outline-none text-slate-700 placeholder-slate-400"
                    />
                    {query && (
                        <button onClick={clearSearch} className="p-1 hover:bg-slate-100 rounded-full">
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-3 rounded-xl transition-colors ${showFilters ? "bg-blue-100 text-blue-600" : "hover:bg-slate-100 text-slate-500"
                        }`}
                >
                    <Filter className="w-5 h-5" />
                </button>

                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Rechercher"}
                </button>
            </div>

            {/* Filtres avancés */}
            {showFilters && (
                <div className="mt-3 bg-white rounded-xl shadow-lg p-4 border border-slate-200 animate-fadeIn">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-600 mb-1 block">Type</label>
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Tous</option>
                                <option value="SUV">SUV</option>
                                <option value="Berline">Berline</option>
                                <option value="Citadine">Citadine</option>
                                <option value="Sport">Sport</option>
                                <option value="Luxe">Luxe</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600 mb-1 block">Prix min (FCFA)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={filters.minPrice}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600 mb-1 block">Prix max (FCFA)</label>
                            <input
                                type="number"
                                placeholder="500000"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Résultats de recherche */}
            {showResults && results.length > 0 && (
                <div className="mt-3 bg-white rounded-xl shadow-lg border border-slate-200 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-slate-100">
                        <span className="text-sm text-slate-500">{results.length} résultat(s)</span>
                    </div>
                    {results.map((car) => (
                        <div
                            key={car.id}
                            className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold text-slate-800">{car.name}</h4>
                                    <p className="text-sm text-slate-500">{car.brand} • {car.type}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-blue-600">{car.pricePerDay?.toLocaleString()} FCFA/jour</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${car.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        }`}>
                                        {car.available ? "Disponible" : "Indisponible"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showResults && results.length === 0 && !loading && (
                <div className="mt-3 bg-white rounded-xl shadow-lg p-6 text-center border border-slate-200">
                    <p className="text-slate-500">Aucun résultat trouvé</p>
                </div>
            )}
        </div>
    );
}
