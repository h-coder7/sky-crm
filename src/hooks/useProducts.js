"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_PRODUCTS = [
    { id: 1, title: "Content Creation", created_at: "2025-11-04" },
    { id: 2, title: "Exhibitions", created_at: "2025-11-04" },
    { id: 3, title: "Events", created_at: "2025-11-04" },
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useProducts() {
    return useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            await delay(500); // Simulate network
            const stored = localStorage.getItem("products");
            return stored ? JSON.parse(stored) : MOCK_PRODUCTS;
        },
    });
}

export function useTrashProducts() {
    return useQuery({
        queryKey: ["trash-products"],
        queryFn: async () => {
            await delay(300);
            const stored = localStorage.getItem("trash-products");
            return stored ? JSON.parse(stored) : [];
        },
    });
}

export function useAddProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newProduct) => {
            await delay(500);
            const products = JSON.parse(localStorage.getItem("products") || JSON.stringify(MOCK_PRODUCTS));
            const productWithId = { 
                ...newProduct, 
                id: Math.max(0, ...products.map(p => p.id)) + 1,
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [productWithId, ...products];
            localStorage.setItem("products", JSON.stringify(updated));
            return productWithId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product added successfully!");
        }
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedProduct) => {
            await delay(500);
            const products = JSON.parse(localStorage.getItem("products") || JSON.stringify(MOCK_PRODUCTS));
            const updated = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
            localStorage.setItem("products", JSON.stringify(updated));
            return updatedProduct;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product updated successfully!");
        }
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const products = JSON.parse(localStorage.getItem("products") || JSON.stringify(MOCK_PRODUCTS));
            const trash = JSON.parse(localStorage.getItem("trash-products") || "[]");
            
            const productToDelete = products.find(p => p.id === id);
            if (!productToDelete) return id;

            const updatedProducts = products.filter(p => p.id !== id);
            const updatedTrash = [productToDelete, ...trash];

            localStorage.setItem("products", JSON.stringify(updatedProducts));
            localStorage.setItem("trash-products", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["trash-products"] });
            toast.success("Product moved to trash!");
        }
    });
}

export function useRestoreProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const products = JSON.parse(localStorage.getItem("products") || JSON.stringify(MOCK_PRODUCTS));
            const trash = JSON.parse(localStorage.getItem("trash-products") || "[]");
            
            const productToRestore = trash.find(p => p.id === id);
            if (!productToRestore) return id;

            const updatedTrash = trash.filter(p => p.id !== id);
            const updatedProducts = [productToRestore, ...products];

            localStorage.setItem("products", JSON.stringify(updatedProducts));
            localStorage.setItem("trash-products", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["trash-products"] });
            toast.success("Product restored successfully!");
        }
    });
}

export function usePermanentDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const trash = JSON.parse(localStorage.getItem("trash-products") || "[]");
            const updatedTrash = trash.filter(p => p.id !== id);
            localStorage.setItem("trash-products", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trash-products"] });
            toast.success("Product permanently deleted!");
        }
    });
}

export function useBulkDeleteProducts() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const products = JSON.parse(localStorage.getItem("products") || JSON.stringify(MOCK_PRODUCTS));
            const trash = JSON.parse(localStorage.getItem("trash-products") || "[]");

            const itemsToDelete = products.filter(p => ids.includes(p.id));
            const remainingProducts = products.filter(p => !ids.includes(p.id));
            const updatedTrash = [...itemsToDelete, ...trash];

            localStorage.setItem("products", JSON.stringify(remainingProducts));
            localStorage.setItem("trash-products", JSON.stringify(updatedTrash));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["trash-products"] });
            toast.success("Selected products moved to trash!");
        }
    });
}
