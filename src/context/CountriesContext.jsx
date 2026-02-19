"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CountriesContext = createContext();

const MOCK_COUNTRIES = [
    { id: 1, title: "Saudi Arabia", country_key: "SA", created_at: "2026-01-15" },
    { id: 2, title: "United Arab Emirates", country_key: "UAE", created_at: "2026-01-15" },
    { id: 3, title: "Egypt", country_key: "EG", created_at: "2026-01-15" },
    { id: 4, title: "Qatar", country_key: "QA", created_at: "2026-01-15" },
    { id: 5, title: "Kuwait", country_key: "KW", created_at: "2026-01-15" },
    { id: 6, title: "Bahrain", country_key: "BH", created_at: "2026-01-15" },
    { id: 7, title: "Oman", country_key: "OM", created_at: "2026-01-15" },
    { id: 8, title: "Jordan", country_key: "JO", created_at: "2026-01-15" },
];

export function CountriesProvider({ children }) {
    const [countries, setCountries] = useState(MOCK_COUNTRIES);

    return (
        <CountriesContext.Provider value={{ countries, setCountries }}>
            {children}
        </CountriesContext.Provider>
    );
}

export function useCountries() {
    const context = useContext(CountriesContext);
    if (!context) {
        throw new Error("useCountries must be used within a CountriesProvider");
    }
    return context;
}
