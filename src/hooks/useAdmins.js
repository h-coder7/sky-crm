"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_ADMINS = [
    { id: 1, name: "Admin One", email: "admin1@example.com", phone: "111111111", role: "Super Admin", created_at: "2026-01-01" },
    { id: 2, name: "Admin Two", email: "admin2@example.com", phone: "222222222", role: "Admin", created_at: "2026-01-05" },
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useAdmins() {
    return useQuery({
        queryKey: ["admins"],
        queryFn: async () => {
            await delay(500); // Simulate network
            return JSON.parse(localStorage.getItem("admins") || JSON.stringify(MOCK_ADMINS));
        },
    });
}

export function useAddAdmin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newAdmin) => {
            await delay(500);
            const admins = JSON.parse(localStorage.getItem("admins") || JSON.stringify(MOCK_ADMINS));
            const adminWithId = { 
                ...newAdmin, 
                id: Date.now(),
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [adminWithId, ...admins];
            localStorage.setItem("admins", JSON.stringify(updated));
            return adminWithId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            toast.success("Admin added successfully!");
        }
    });
}

export function useUpdateAdmin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedAdmin) => {
            await delay(500);
            const admins = JSON.parse(localStorage.getItem("admins") || JSON.stringify(MOCK_ADMINS));
            const updated = admins.map(a => a.id === updatedAdmin.id ? updatedAdmin : a);
            localStorage.setItem("admins", JSON.stringify(updated));
            return updatedAdmin;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            toast.success("Admin updated successfully!");
        }
    });
}

export function useDeleteAdmin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const admins = JSON.parse(localStorage.getItem("admins") || JSON.stringify(MOCK_ADMINS));
            const filtered = admins.filter(a => a.id !== id);
            localStorage.setItem("admins", JSON.stringify(filtered));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            toast.success("Admin moved to trash!");
        }
    });
}

export function useBulkDeleteAdmins() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const admins = JSON.parse(localStorage.getItem("admins") || JSON.stringify(MOCK_ADMINS));
            const filtered = admins.filter(a => !ids.includes(a.id));
            localStorage.setItem("admins", JSON.stringify(filtered));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            toast.success("Selected admins moved to trash!");
        }
    });
}
