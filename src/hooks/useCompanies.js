"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

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

// Helper to simulate API calls
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useCompanies() {
    return useQuery({
        queryKey: ["companies"],
        queryFn: async () => {
            await delay(500); // Simulate network
            return JSON.parse(localStorage.getItem("companies") || JSON.stringify(MOCK_COMPANIES));
        },
    });
}

export function useAddCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newCompany) => {
            await delay(500);
            const companies = JSON.parse(localStorage.getItem("companies") || JSON.stringify(MOCK_COMPANIES));
            const companyWithId = { 
                ...newCompany, 
                id: Date.now(),
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [companyWithId, ...companies];
            localStorage.setItem("companies", JSON.stringify(updated));
            return companyWithId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            toast.success("Company added successfully!");
        }
    });
}

export function useUpdateCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedCompany) => {
            await delay(500);
            const companies = JSON.parse(localStorage.getItem("companies") || JSON.stringify(MOCK_COMPANIES));
            const updated = companies.map(c => c.id === updatedCompany.id ? updatedCompany : c);
            localStorage.setItem("companies", JSON.stringify(updated));
            return updatedCompany;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            toast.success("Company updated successfully!");
        }
    });
}

export function useDeleteCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const companies = JSON.parse(localStorage.getItem("companies") || JSON.stringify(MOCK_COMPANIES));
            const filtered = companies.filter(c => c.id !== id);
            localStorage.setItem("companies", JSON.stringify(filtered));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            toast.success("Company moved to trash!");
        }
    });
}

export function useBulkDeleteCompanies() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const companies = JSON.parse(localStorage.getItem("companies") || JSON.stringify(MOCK_COMPANIES));
            const filtered = companies.filter(c => !ids.includes(c.id));
            localStorage.setItem("companies", JSON.stringify(filtered));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            toast.success("Selected companies moved to trash!");
        }
    });
}
