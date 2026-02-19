"use client";

import { createContext, useContext, useState, useEffect } from "react";
// import api from "@/app/api/api"; // 🔌 Import your configured axios instance

const SectorsContext = createContext();

const MOCK_SECTORS = [
    { id: 1, title: "Manufacturing", description: "Description", created_at: "2026-01-15" },
    { id: 2, title: "Banking, Insurance & FinTech", description: "Description", created_at: "2026-01-15" },
    { id: 3, title: "Telecomm, Media & Entertainment", description: "Description", created_at: "2026-01-15" },
    { id: 4, title: "Beauty, Cosmetics & BeautyTech", description: "Description", created_at: "2026-01-15" },
    { id: 5, title: "Defense & Security", description: "Description", created_at: "2026-01-15" },
    { id: 6, title: "FMCGs, F&B, Foodtech & Aggregators", description: "Description", created_at: "2026-01-15" },
    { id: 7, title: "Aviation, Hospitality & TravelTech", description: "Description", created_at: "2026-01-15" },
    { id: 8, title: "Real estate & Proptech", description: "Description", created_at: "2026-01-15" },
    { id: 9, title: "Luxury, Fashion & RetailTech", description: "Description", created_at: "2026-01-15" },
    { id: 10, title: "Renewable Energy, Oil & Gas", description: "Description", created_at: "2026-01-15" },
    { id: 11, title: "Business Services, Auditing & Consultancy", description: "Description", created_at: "2026-01-15" },
    { id: 12, title: "Government", description: "Description", created_at: "2026-01-15" },
    { id: 13, title: "Automotive & Autotech", description: "Description", created_at: "2026-01-15" },
    { id: 14, title: "Tech & Cybersecurity", description: "Description", created_at: "2026-01-15" },
    { id: 15, title: "Pharmaceutical, Medical & MedTech", description: "Description", created_at: "2026-01-15" },
];

export function SectorsProvider({ children }) {
    const [sectors, setSectors] = useState(MOCK_SECTORS);

    /* 
    // 🌐 Future API Integration:
    useEffect(() => {
        const fetchSectors = async () => {
            try {
                const res = await api.get("/sectors");
                setSectors(res.data);
            } catch (error) {
                console.error("Failed to fetch sectors:", error);
            }
        };
        // fetchSectors(); 
    }, []);
    */

    return (
        <SectorsContext.Provider value={{ sectors, setSectors }}>
            {children}
        </SectorsContext.Provider>
    );
}

export function useSectors() {
    const context = useContext(SectorsContext);
    if (!context) {
        throw new Error("useSectors must be used within a SectorsProvider");
    }
    return context;
}
