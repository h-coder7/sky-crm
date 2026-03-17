"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_TARGETS = [
  { id: 1, employee: "John Doe", product: "Content Creation", year: "2025", length: "12", values: "50000" },
  { id: 2, employee: "Jane Smith", product: "Exhibitions", year: "2025", length: "6", values: "100000" },
  { id: 3, employee: "Mike Jones", product: "Events", year: "2024", length: "8", values: "75000" },
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useTarget() {
    return useQuery({
        queryKey: ["targets"],
        queryFn: async () => {
            await delay(500); // Simulate network
            return JSON.parse(localStorage.getItem("targets") || JSON.stringify(MOCK_TARGETS));
        },
    });
}

export function useAddTarget() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTarget) => {
            await delay(500);
            const targets = JSON.parse(localStorage.getItem("targets") || JSON.stringify(MOCK_TARGETS));
            const targetWithId = { 
                ...newTarget, 
                id: Date.now(),
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [targetWithId, ...targets];
            localStorage.setItem("targets", JSON.stringify(updated));
            return targetWithId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["targets"] });
            toast.success("Target added successfully!");
        }
    });
}

export function useUpdateTarget() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedTarget) => {
            await delay(500);
            const targets = JSON.parse(localStorage.getItem("targets") || JSON.stringify(MOCK_TARGETS));
            const updated = targets.map(t => t.id === updatedTarget.id ? updatedTarget : t);
            localStorage.setItem("targets", JSON.stringify(updated));
            return updatedTarget;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["targets"] });
            toast.success("Target updated successfully!");
        }
    });
}

export function useDeleteTarget() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const targets = JSON.parse(localStorage.getItem("targets") || JSON.stringify(MOCK_TARGETS));
            const filtered = targets.filter(t => t.id !== id);
            localStorage.setItem("targets", JSON.stringify(filtered));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["targets"] });
            toast.success("Target moved to trash!");
        }
    });
}

export function useBulkDeleteTargets() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const targets = JSON.parse(localStorage.getItem("targets") || JSON.stringify(MOCK_TARGETS));
            const filtered = targets.filter(t => !ids.includes(t.id));
            localStorage.setItem("targets", JSON.stringify(filtered));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["targets"] });
            toast.success("Selected targets moved to trash!");
        }
    });
}
