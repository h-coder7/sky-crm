"use client";

import { createContext, useContext, useState } from "react";

const CompaniesContext = createContext();

const MOCK_COMPANIES = [
    { id: 1, title: "Skybridge Technologies", sector: "Tech & Cybersecurity", created_at: "2026-01-10" },
    { id: 2, title: "Gulf Finance Corp", sector: "Banking, Insurance & FinTech", created_at: "2026-01-12" },
    { id: 3, title: "Emirates Real Estate", sector: "Real estate & Proptech", created_at: "2026-01-15" },
    { id: 4, title: "Al Noor Healthcare", sector: "Pharmaceutical, Medical & MedTech", created_at: "2026-01-18" },
    { id: 5, title: "Desert Energy Solutions", sector: "Renewable Energy, Oil & Gas", created_at: "2026-01-20" },
    { id: 6, title: "Falcon Aviation Group", sector: "Aviation, Hospitality & TravelTech", created_at: "2026-01-22" },
    { id: 7, title: "Pearl Luxury Brands", sector: "Luxury, Fashion & RetailTech", created_at: "2026-01-25" },
    { id: 8, title: "Metro Government Services", sector: "Government", created_at: "2026-01-28" },
];

export function CompaniesProvider({ children }) {
    const [companies, setCompanies] = useState(MOCK_COMPANIES);

    /* 
    // 🌐 Future API Integration:
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get("/companies");
                setCompanies(res.data);
            } catch (error) {
                console.error("Failed to fetch companies:", error);
            }
        };
        // fetchCompanies(); 
    }, []);
    */

    return (
        <CompaniesContext.Provider value={{ companies, setCompanies }}>
            {children}
        </CompaniesContext.Provider>
    );
}

export function useCompanies() {
    const context = useContext(CompaniesContext);
    if (!context) {
        throw new Error("useCompanies must be used within a CompaniesProvider");
    }
    return context;
}
