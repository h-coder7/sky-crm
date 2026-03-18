"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_ADMINS = [
    { 
      id: 1, 
      name: "John Doe", 
      email: "john@example.com", 
      phone: "+1234567890", 
      role: "Super Admin", 
      created_at: "2025-01-15",
    },
    { 
      id: 2, 
      name: "Jane Smith", 
      email: "jane@example.com", 
      phone: "+1987654321", 
      role: "Admin", 
      created_at: "2025-02-20",
    },
    { 
      id: 3, 
      name: "Mike Johnson", 
      email: "mike@example.com", 
      phone: "+1122334455", 
      role: "Sub Admin", 
      created_at: "2025-03-10",
    },
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
            const stored = localStorage.getItem("admins");
            return stored ? JSON.parse(stored) : MOCK_ADMINS;
        },
    });
}

export function useTrashAdmins() {
    return useQuery({
        queryKey: ["trash-admins"],
        queryFn: async () => {
            await delay(300);
            const stored = localStorage.getItem("trash-admins");
            return stored ? JSON.parse(stored) : [];
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
            const trash = JSON.parse(localStorage.getItem("trash-admins") || "[]");
            
            const adminToDelete = admins.find(a => a.id === id);
            if (!adminToDelete) return id;

            const updatedAdmins = admins.filter(a => a.id !== id);
            const updatedTrash = [adminToDelete, ...trash];

            localStorage.setItem("admins", JSON.stringify(updatedAdmins));
            localStorage.setItem("trash-admins", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            queryClient.invalidateQueries({ queryKey: ["trash-admins"] });
            toast.success("Admin moved to trash!");
        }
    });
}

export function useRestoreAdmin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const admins = JSON.parse(localStorage.getItem("admins") || JSON.stringify(MOCK_ADMINS));
            const trash = JSON.parse(localStorage.getItem("trash-admins") || "[]");
            
            const adminToRestore = trash.find(a => a.id === id);
            if (!adminToRestore) return id;

            const updatedTrash = trash.filter(a => a.id !== id);
            const updatedAdmins = [adminToRestore, ...admins];

            localStorage.setItem("admins", JSON.stringify(updatedAdmins));
            localStorage.setItem("trash-admins", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            queryClient.invalidateQueries({ queryKey: ["trash-admins"] });
            toast.success("Admin restored successfully!");
        }
    });
}

export function usePermanentDeleteAdmin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const trash = JSON.parse(localStorage.getItem("trash-admins") || "[]");
            const updatedTrash = trash.filter(a => a.id !== id);
            localStorage.setItem("trash-admins", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trash-admins"] });
            toast.success("Admin permanently deleted!");
        }
    });
}

export function useBulkDeleteAdmins() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const admins = JSON.parse(localStorage.getItem("admins") || JSON.stringify(MOCK_ADMINS));
            const trash = JSON.parse(localStorage.getItem("trash-admins") || "[]");

            const itemsToDelete = admins.filter(a => ids.includes(a.id));
            const remainingAdmins = admins.filter(a => !ids.includes(a.id));
            const updatedTrash = [...itemsToDelete, ...trash];

            localStorage.setItem("admins", JSON.stringify(remainingAdmins));
            localStorage.setItem("trash-admins", JSON.stringify(updatedTrash));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            queryClient.invalidateQueries({ queryKey: ["trash-admins"] });
            toast.success("Selected admins moved to trash!");
        }
    });
}
