"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

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

// Helper to simulate API calls
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useCountries() {
    return useQuery({
        queryKey: ["countries"],
        queryFn: async () => {
            await delay(500); // Simulate network
            return JSON.parse(localStorage.getItem("countries") || JSON.stringify(MOCK_COUNTRIES));
        },
    });
}

export function useAddCountry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newCountry) => {
            await delay(500);
            const countries = JSON.parse(localStorage.getItem("countries") || JSON.stringify(MOCK_COUNTRIES));
            const countryWithId = { 
                ...newCountry, 
                id: Date.now(),
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [countryWithId, ...countries];
            localStorage.setItem("countries", JSON.stringify(updated));
            return countryWithId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["countries"] });
            toast.success("Country added successfully!");
        }
    });
}

export function useUpdateCountry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedCountry) => {
            await delay(500);
            const countries = JSON.parse(localStorage.getItem("countries") || JSON.stringify(MOCK_COUNTRIES));
            const updated = countries.map(c => c.id === updatedCountry.id ? updatedCountry : c);
            localStorage.setItem("countries", JSON.stringify(updated));
            return updatedCountry;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["countries"] });
            toast.success("Country updated successfully!");
        }
    });
}

export function useDeleteCountry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const countries = JSON.parse(localStorage.getItem("countries") || JSON.stringify(MOCK_COUNTRIES));
            const filtered = countries.filter(c => c.id !== id);
            localStorage.setItem("countries", JSON.stringify(filtered));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["countries"] });
            toast.success("Country moved to trash!");
        }
    });
}

export function useBulkDeleteCountries() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const countries = JSON.parse(localStorage.getItem("countries") || JSON.stringify(MOCK_COUNTRIES));
            const filtered = countries.filter(c => !ids.includes(c.id));
            localStorage.setItem("countries", JSON.stringify(filtered));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["countries"] });
            toast.success("Selected countries moved to trash!");
        }
    });
}
