"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

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

// Helper to simulate API calls
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useSectors() {
    return useQuery({
        queryKey: ["sectors"],
        queryFn: async () => {
            await delay(500); // Simulate network
            return JSON.parse(localStorage.getItem("sectors") || JSON.stringify(MOCK_SECTORS));
        },
    });
}

export function useAddSector() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newSector) => {
            await delay(500);
            const sectors = JSON.parse(localStorage.getItem("sectors") || JSON.stringify(MOCK_SECTORS));
            const sectorWithId = { 
                ...newSector, 
                id: Date.now(),
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [sectorWithId, ...sectors];
            localStorage.setItem("sectors", JSON.stringify(updated));
            return sectorWithId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sectors"] });
            toast.success("Sector added successfully!");
        }
    });
}

export function useUpdateSector() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedSector) => {
            await delay(500);
            const sectors = JSON.parse(localStorage.getItem("sectors") || JSON.stringify(MOCK_SECTORS));
            const updated = sectors.map(s => s.id === updatedSector.id ? updatedSector : s);
            localStorage.setItem("sectors", JSON.stringify(updated));
            return updatedSector;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sectors"] });
            toast.success("Sector updated successfully!");
        }
    });
}

export function useDeleteSector() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const sectors = JSON.parse(localStorage.getItem("sectors") || JSON.stringify(MOCK_SECTORS));
            const filtered = sectors.filter(s => s.id !== id);
            localStorage.setItem("sectors", JSON.stringify(filtered));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sectors"] });
            toast.success("Sector moved to trash!");
        }
    });
}

export function useBulkDeleteSectors() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const sectors = JSON.parse(localStorage.getItem("sectors") || JSON.stringify(MOCK_SECTORS));
            const filtered = sectors.filter(s => !ids.includes(s.id));
            localStorage.setItem("sectors", JSON.stringify(filtered));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sectors"] });
            toast.success("Selected sectors moved to trash!");
        }
    });
}
