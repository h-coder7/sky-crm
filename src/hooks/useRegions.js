"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_REGIONS = [
  {
    id: 1,
    title: "Middle East",
    country: "United Arab Emirates",
    created_at: "2026-01-20"
  },
  {
    id: 2,
    title: "Europe",
    country: "Germany",
    created_at: "2026-01-21"
  },
  {
    id: 3,
    title: "Asia",
    country: "Singapore",
    created_at: "2026-01-22"
  }
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useRegions() {
    return useQuery({
        queryKey: ["regions"],
        queryFn: async () => {
            await delay(500); // Simulate network
            return JSON.parse(localStorage.getItem("regions") || JSON.stringify(MOCK_REGIONS));
        },
    });
}

export function useAddRegion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newRegion) => {
            await delay(500);
            const regions = JSON.parse(localStorage.getItem("regions") || JSON.stringify(MOCK_REGIONS));
            const regionWithId = { 
                ...newRegion, 
                id: Date.now(),
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [regionWithId, ...regions];
            localStorage.setItem("regions", JSON.stringify(updated));
            return regionWithId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["regions"] });
            toast.success("Region added successfully!");
        }
    });
}

export function useUpdateRegion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedRegion) => {
            await delay(500);
            const regions = JSON.parse(localStorage.getItem("regions") || JSON.stringify(MOCK_REGIONS));
            const updated = regions.map(r => r.id === updatedRegion.id ? updatedRegion : r);
            localStorage.setItem("regions", JSON.stringify(updated));
            return updatedRegion;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["regions"] });
            toast.success("Region updated successfully!");
        }
    });
}

export function useDeleteRegion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const regions = JSON.parse(localStorage.getItem("regions") || JSON.stringify(MOCK_REGIONS));
            const filtered = regions.filter(r => r.id !== id);
            localStorage.setItem("regions", JSON.stringify(filtered));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["regions"] });
            toast.success("Region moved to trash!");
        }
    });
}

export function useBulkDeleteRegions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const regions = JSON.parse(localStorage.getItem("regions") || JSON.stringify(MOCK_REGIONS));
            const filtered = regions.filter(r => !ids.includes(r.id));
            localStorage.setItem("regions", JSON.stringify(filtered));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["regions"] });
            toast.success("Selected regions moved to trash!");
        }
    });
}
