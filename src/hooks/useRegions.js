"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_REGIONS = [
    {
        id: 1,
        title: "Abu Dhabi",
        country: "United Arab Emirates",
        created_at: "2025-12-22"
    },
    {
        id: 2,
        title: "test",
        country: "Albania",
        created_at: "2025-12-20"
    },
    {
        id: 3,
        title: "Dubai",
        country: "United Arab Emirates",
        created_at: "2025-12-16"
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
            // 🚀 When Laravel API is ready:
            // const res = await fetch("https://your-laravel-api.com/api/regions");
            // return res.json();

            await delay(500); // Simulate network
            const stored = localStorage.getItem("regions_v2");
            return stored ? JSON.parse(stored) : MOCK_REGIONS;
        },
    });
}

export function useTrashRegions() {
    return useQuery({
        queryKey: ["trash-regions"],
        queryFn: async () => {
            await delay(300);
            const stored = localStorage.getItem("trash-regions_v2");
            return stored ? JSON.parse(stored) : [];
        },
    });
}

export function useAddRegion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newRegion) => {
            // 🚀 When Laravel API is ready:
            // const res = await fetch("https://your-laravel-api.com/api/regions", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(newRegion)
            // });
            // return res.json();

            await delay(500);
            const regions = JSON.parse(localStorage.getItem("regions_v2") || JSON.stringify(MOCK_REGIONS));
            const regionWithId = { 
                ...newRegion, 
                id: Math.max(0, ...regions.map(r => r.id)) + 1,
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [regionWithId, ...regions];
            localStorage.setItem("regions_v2", JSON.stringify(updated));
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
            // 🚀 When Laravel API is ready:
            // const res = await fetch(`https://your-laravel-api.com/api/regions/${updatedRegion.id}`, {
            //     method: "PUT",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(updatedRegion)
            // });
            // return res.json();

            await delay(500);
            const regions = JSON.parse(localStorage.getItem("regions_v2") || JSON.stringify(MOCK_REGIONS));
            const updated = regions.map(r => r.id === updatedRegion.id ? updatedRegion : r);
            localStorage.setItem("regions_v2", JSON.stringify(updated));
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
            const regions = JSON.parse(localStorage.getItem("regions_v2") || JSON.stringify(MOCK_REGIONS));
            const trash = JSON.parse(localStorage.getItem("trash-regions_v2") || "[]");
            
            const regionToDelete = regions.find(r => r.id === id);
            if (!regionToDelete) return id;

            const updatedRegions = regions.filter(r => r.id !== id);
            const updatedTrash = [regionToDelete, ...trash];

            localStorage.setItem("regions_v2", JSON.stringify(updatedRegions));
            localStorage.setItem("trash-regions_v2", JSON.stringify(updatedTrash));
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
            const regions = JSON.parse(localStorage.getItem("regions_v2") || JSON.stringify(MOCK_REGIONS));
            const trash = JSON.parse(localStorage.getItem("trash-regions_v2") || "[]");
            
            const regionToRestore = trash.find(r => r.id === id);
            if (!regionToRestore) return id;

            const updatedTrash = trash.filter(r => r.id !== id);
            const updatedRegions = [regionToRestore, ...regions];

            localStorage.setItem("regions_v2", JSON.stringify(updatedRegions));
            localStorage.setItem("trash-regions_v2", JSON.stringify(updatedTrash));
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
            const trash = JSON.parse(localStorage.getItem("trash-regions_v2") || "[]");
            const updatedTrash = trash.filter(c => c.id !== id);
            localStorage.setItem("trash-regions_v2", JSON.stringify(updatedTrash));
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
            const regions = JSON.parse(localStorage.getItem("regions_v2") || JSON.stringify(MOCK_REGIONS));
            const trash = JSON.parse(localStorage.getItem("trash-regions_v2") || "[]");

            const itemsToDelete = regions.filter(r => ids.includes(r.id));
            const remainingRegions = regions.filter(r => !ids.includes(r.id));
            const updatedTrash = [...itemsToDelete, ...trash];

            localStorage.setItem("regions_v2", JSON.stringify(remainingRegions));
            localStorage.setItem("trash-regions_v2", JSON.stringify(updatedTrash));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["regions"] });
            queryClient.invalidateQueries({ queryKey: ["trash-regions"] });
            toast.success("Selected regions moved to trash!");
        }
    });
}
