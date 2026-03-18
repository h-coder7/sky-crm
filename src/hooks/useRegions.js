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
            const stored = localStorage.getItem("regions");
            return stored ? JSON.parse(stored) : MOCK_REGIONS;
        },
    });
}

export function useTrashRegions() {
    return useQuery({
        queryKey: ["trash-regions"],
        queryFn: async () => {
            await delay(300);
            const stored = localStorage.getItem("trash-regions");
            return stored ? JSON.parse(stored) : [];
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
                id: Math.max(0, ...regions.map(r => r.id)) + 1,
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
            const trash = JSON.parse(localStorage.getItem("trash-regions") || "[]");
            
            const regionToDelete = regions.find(r => r.id === id);
            if (!regionToDelete) return id;

            const updatedRegions = regions.filter(r => r.id !== id);
            const updatedTrash = [regionToDelete, ...trash];

            localStorage.setItem("regions", JSON.stringify(updatedRegions));
            localStorage.setItem("trash-regions", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["regions"] });
            queryClient.invalidateQueries({ queryKey: ["trash-regions"] });
            toast.success("Region moved to trash!");
        }
    });
}

export function useRestoreRegion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const regions = JSON.parse(localStorage.getItem("regions") || JSON.stringify(MOCK_REGIONS));
            const trash = JSON.parse(localStorage.getItem("trash-regions") || "[]");
            
            const regionToRestore = trash.find(r => r.id === id);
            if (!regionToRestore) return id;

            const updatedTrash = trash.filter(r => r.id !== id);
            const updatedRegions = [regionToRestore, ...regions];

            localStorage.setItem("regions", JSON.stringify(updatedRegions));
            localStorage.setItem("trash-regions", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["regions"] });
            queryClient.invalidateQueries({ queryKey: ["trash-regions"] });
            toast.success("Region restored successfully!");
        }
    });
}

export function usePermanentDeleteRegion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const trash = JSON.parse(localStorage.getItem("trash-regions") || "[]");
            const updatedTrash = trash.filter(c => c.id !== id);
            localStorage.setItem("trash-regions", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trash-regions"] });
            toast.success("Region permanently deleted!");
        }
    });
}

export function useBulkDeleteRegions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const regions = JSON.parse(localStorage.getItem("regions") || JSON.stringify(MOCK_REGIONS));
            const trash = JSON.parse(localStorage.getItem("trash-regions") || "[]");

            const itemsToDelete = regions.filter(r => ids.includes(r.id));
            const remainingRegions = regions.filter(r => !ids.includes(r.id));
            const updatedTrash = [...itemsToDelete, ...trash];

            localStorage.setItem("regions", JSON.stringify(remainingRegions));
            localStorage.setItem("trash-regions", JSON.stringify(updatedTrash));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["regions"] });
            queryClient.invalidateQueries({ queryKey: ["trash-regions"] });
            toast.success("Selected regions moved to trash!");
        }
    });
}
