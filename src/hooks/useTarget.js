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
            const stored = localStorage.getItem("targets");
            return stored ? JSON.parse(stored) : MOCK_TARGETS;
        },
    });
}

export function useTrashTargets() {
    return useQuery({
        queryKey: ["trash-targets"],
        queryFn: async () => {
            await delay(300);
            const stored = localStorage.getItem("trash-targets");
            return stored ? JSON.parse(stored) : [];
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
                id: Math.max(0, ...targets.map(t => t.id)) + 1,
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
            const trash = JSON.parse(localStorage.getItem("trash-targets") || "[]");
            
            const targetToDelete = targets.find(t => t.id === id);
            if (!targetToDelete) return id;

            const updatedTargets = targets.filter(t => t.id !== id);
            const updatedTrash = [targetToDelete, ...trash];

            localStorage.setItem("targets", JSON.stringify(updatedTargets));
            localStorage.setItem("trash-targets", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["targets"] });
            queryClient.invalidateQueries({ queryKey: ["trash-targets"] });
            toast.success("Target moved to trash!");
        }
    });
}

export function useRestoreTarget() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const targets = JSON.parse(localStorage.getItem("targets") || JSON.stringify(MOCK_TARGETS));
            const trash = JSON.parse(localStorage.getItem("trash-targets") || "[]");
            
            const targetToRestore = trash.find(t => t.id === id);
            if (!targetToRestore) return id;

            const updatedTrash = trash.filter(t => t.id !== id);
            const updatedTargets = [targetToRestore, ...targets];

            localStorage.setItem("targets", JSON.stringify(updatedTargets));
            localStorage.setItem("trash-targets", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["targets"] });
            queryClient.invalidateQueries({ queryKey: ["trash-targets"] });
            toast.success("Target restored successfully!");
        }
    });
}

export function usePermanentDeleteTarget() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const trash = JSON.parse(localStorage.getItem("trash-targets") || "[]");
            const updatedTrash = trash.filter(t => t.id !== id);
            localStorage.setItem("trash-targets", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trash-targets"] });
            toast.success("Target permanently deleted!");
        }
    });
}

export function useBulkDeleteTargets() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const targets = JSON.parse(localStorage.getItem("targets") || JSON.stringify(MOCK_TARGETS));
            const trash = JSON.parse(localStorage.getItem("trash-targets") || "[]");

            const itemsToDelete = targets.filter(t => ids.includes(t.id));
            const remainingTargets = targets.filter(t => !ids.includes(t.id));
            const updatedTrash = [...itemsToDelete, ...trash];

            localStorage.setItem("targets", JSON.stringify(remainingTargets));
            localStorage.setItem("trash-targets", JSON.stringify(updatedTrash));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["targets"] });
            queryClient.invalidateQueries({ queryKey: ["trash-targets"] });
            toast.success("Selected targets moved to trash!");
        }
    });
}
