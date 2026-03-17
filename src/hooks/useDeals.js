"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_DEALS = [
  { 
    id: 1, 
    title: "Project Alpha", 
    description: "Web development project", 
    start_date: "2025-01-01", 
    end_date: "2025-03-01", 
    employee: "Esslam Emad", 
    product: "Next.js App", 
    contact_list: "Tech Leads", 
    company: "Sky Tech", 
    status: "1", // Brief Submitted
    amount: 5000, 
    month: "1", // January
    created_at: "2025-01-10" 
  },
  { 
    id: 2, 
    title: "Project Beta", 
    description: "Marketing campaign", 
    start_date: "2025-02-15", 
    end_date: "2025-04-15", 
    employee: "Sedra Quraid", 
    product: "SEO Bundle", 
    contact_list: "Marketing Managers", 
    company: "InnoSoft", 
    status: "7", // Proposal Submitted
    amount: 3200, 
    month: "2", // February
    created_at: "2025-02-01" 
  },
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useDeals() {
    return useQuery({
        queryKey: ["deals"],
        queryFn: async () => {
            await delay(500); // Simulate network
            return JSON.parse(localStorage.getItem("deals") || JSON.stringify(MOCK_DEALS));
        },
    });
}

export function useAddDeal() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newDeal) => {
            await delay(500);
            const deals = JSON.parse(localStorage.getItem("deals") || JSON.stringify(MOCK_DEALS));
            const dealWithId = { 
                ...newDeal, 
                id: Date.now(),
                status: newDeal.status || "1",
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [dealWithId, ...deals];
            localStorage.setItem("deals", JSON.stringify(updated));
            return dealWithId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] });
            toast.success("Deal added successfully!");
        }
    });
}

export function useUpdateDeal() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedDeal) => {
            await delay(500);
            const deals = JSON.parse(localStorage.getItem("deals") || JSON.stringify(MOCK_DEALS));
            const updated = deals.map(d => d.id === updatedDeal.id ? updatedDeal : d);
            localStorage.setItem("deals", JSON.stringify(updated));
            return updatedDeal;
        },
        // 🚀 Optimistic Update
        onMutate: async (updatedDeal) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["deals"] });

            // Snapshot the previous value
            const previousDeals = queryClient.getQueryData(["deals"]);

            // Optimistically update to the new value
            queryClient.setQueryData(["deals"], (old) => {
                return old.map(d => d.id === updatedDeal.id ? { ...d, ...updatedDeal } : d);
            });

            // Return a context object with the snapshotted value
            return { previousDeals };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, updatedDeal, context) => {
            queryClient.setQueryData(["deals"], context.previousDeals);
            toast.error("Failed to update deal.");
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] });
        },
        onSuccess: () => {
            toast.success("Deal updated successfully!");
        }
    });
}

export function useDeleteDeal() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const deals = JSON.parse(localStorage.getItem("deals") || JSON.stringify(MOCK_DEALS));
            const filtered = deals.filter(d => d.id !== id);
            localStorage.setItem("deals", JSON.stringify(filtered));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] });
            toast.success("Deal moved to trash!");
        }
    });
}

export function useBulkDeleteDeals() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const deals = JSON.parse(localStorage.getItem("deals") || JSON.stringify(MOCK_DEALS));
            const filtered = deals.filter(d => !ids.includes(d.id));
            localStorage.setItem("deals", JSON.stringify(filtered));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] });
            toast.success("Selected deals moved to trash!");
        }
    });
}
