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
            return JSON.parse(localStorage.getItem("products") || JSON.stringify(MOCK_PRODUCTS));
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
                id: Date.now(),
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
            const filtered = products.filter(p => p.id !== id);
            localStorage.setItem("products", JSON.stringify(filtered));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product moved to trash!");
        }
    });
}

export function useBulkDeleteProducts() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const products = JSON.parse(localStorage.getItem("products") || JSON.stringify(MOCK_PRODUCTS));
            const filtered = products.filter(p => !ids.includes(p.id));
            localStorage.setItem("products", JSON.stringify(filtered));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Selected products moved to trash!");
        }
    });
}
