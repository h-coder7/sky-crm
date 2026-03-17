"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_CATEGORIES = [
  { id: 1, title: "A", start_price: "500001.00", end_price: "1000000.00", created_at: "2025-10-01" },
  { id: 2, title: "B", start_price: "100001.00", end_price: "500000.00", created_at: "2025-10-01" },
  { id: 3, title: "C", start_price: "10000.00", end_price: "100000.00", created_at: "2025-10-01" },
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useCategories() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            await delay(500); // Simulate network
            return JSON.parse(localStorage.getItem("categories") || JSON.stringify(MOCK_CATEGORIES));
        },
    });
}

export function useAddCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newCategory) => {
            await delay(500);
            const categories = JSON.parse(localStorage.getItem("categories") || JSON.stringify(MOCK_CATEGORIES));
            const categoryWithId = { 
                ...newCategory, 
                id: Date.now(),
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [categoryWithId, ...categories];
            localStorage.setItem("categories", JSON.stringify(updated));
            return categoryWithId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category added successfully!");
        }
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedCategory) => {
            await delay(500);
            const categories = JSON.parse(localStorage.getItem("categories") || JSON.stringify(MOCK_CATEGORIES));
            const updated = categories.map(c => c.id === updatedCategory.id ? updatedCategory : c);
            localStorage.setItem("categories", JSON.stringify(updated));
            return updatedCategory;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category updated successfully!");
        }
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const categories = JSON.parse(localStorage.getItem("categories") || JSON.stringify(MOCK_CATEGORIES));
            const filtered = categories.filter(c => c.id !== id);
            localStorage.setItem("categories", JSON.stringify(filtered));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category moved to trash!");
        }
    });
}

export function useBulkDeleteCategories() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const categories = JSON.parse(localStorage.getItem("categories") || JSON.stringify(MOCK_CATEGORIES));
            const filtered = categories.filter(c => !ids.includes(c.id));
            localStorage.setItem("categories", JSON.stringify(filtered));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Selected categories moved to trash!");
        }
    });
}
