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
            // 🚀 When Laravel API is ready:
            // const res = await fetch("https://your-laravel-api.com/api/categories");
            // return res.json();

            await delay(500); // Simulate network
            const stored = localStorage.getItem("categories");
            return stored ? JSON.parse(stored) : MOCK_CATEGORIES;
        },
    });
}

export function useTrashCategories() {
    return useQuery({
        queryKey: ["trash-categories"],
        queryFn: async () => {
            await delay(300);
            const stored = localStorage.getItem("trash-categories");
            return stored ? JSON.parse(stored) : [];
        },
    });
}

export function useAddCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newCategory) => {
            // 🚀 When Laravel API is ready:
            // const res = await fetch("https://your-laravel-api.com/api/categories", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(newCategory)
            // });
            // return res.json();

            await delay(500);
            const categories = JSON.parse(localStorage.getItem("categories") || JSON.stringify(MOCK_CATEGORIES));
            const categoryWithId = { 
                ...newCategory, 
                id: Math.max(0, ...categories.map(c => c.id)) + 1,
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
            // 🚀 When Laravel API is ready:
            // const res = await fetch(`https://your-laravel-api.com/api/categories/${updatedCategory.id}`, {
            //     method: "PUT",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(updatedCategory)
            // });
            // return res.json();

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
            const trash = JSON.parse(localStorage.getItem("trash-categories") || "[]");
            
            const categoryToDelete = categories.find(c => c.id === id);
            if (!categoryToDelete) return id;

            const updatedCategories = categories.filter(c => c.id !== id);
            const updatedTrash = [categoryToDelete, ...trash];

            localStorage.setItem("categories", JSON.stringify(updatedCategories));
            localStorage.setItem("trash-categories", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["trash-categories"] });
            toast.success("Category moved to trash!");
        }
    });
}

export function useRestoreCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const categories = JSON.parse(localStorage.getItem("categories") || JSON.stringify(MOCK_CATEGORIES));
            const trash = JSON.parse(localStorage.getItem("trash-categories") || "[]");
            
            const categoryToRestore = trash.find(c => c.id === id);
            if (!categoryToRestore) return id;

            const updatedTrash = trash.filter(c => c.id !== id);
            const updatedCategories = [categoryToRestore, ...categories];

            localStorage.setItem("categories", JSON.stringify(updatedCategories));
            localStorage.setItem("trash-categories", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["trash-categories"] });
            toast.success("Category restored successfully!");
        }
    });
}

export function usePermanentDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const trash = JSON.parse(localStorage.getItem("trash-categories") || "[]");
            const updatedTrash = trash.filter(c => c.id !== id);
            localStorage.setItem("trash-categories", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trash-categories"] });
            toast.success("Category permanently deleted!");
        }
    });
}

export function useBulkDeleteCategories() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const categories = JSON.parse(localStorage.getItem("categories") || JSON.stringify(MOCK_CATEGORIES));
            const trash = JSON.parse(localStorage.getItem("trash-categories") || "[]");

            const itemsToDelete = categories.filter(c => ids.includes(c.id));
            const remainingCategories = categories.filter(c => !ids.includes(c.id));
            const updatedTrash = [...itemsToDelete, ...trash];

            localStorage.setItem("categories", JSON.stringify(remainingCategories));
            localStorage.setItem("trash-categories", JSON.stringify(updatedTrash));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["trash-categories"] });
            toast.success("Selected categories moved to trash!");
        }
    });
}
