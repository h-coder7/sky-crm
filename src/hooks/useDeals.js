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
            // 🚀 When Laravel API is ready:
            // const res = await fetch("https://your-laravel-api.com/api/deals");
            // return res.json();

            await delay(500); // Simulate network
            const stored = localStorage.getItem("deals");
            return stored ? JSON.parse(stored) : MOCK_DEALS;
        },
    });
}

export function useTrashDeals() {
    return useQuery({
        queryKey: ["trash-deals"],
        queryFn: async () => {
            await delay(300);
            const stored = localStorage.getItem("trash-deals");
            return stored ? JSON.parse(stored) : [];
        },
    });
}

export function useAddDeal() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newDeal) => {
            // 🚀 When Laravel API is ready:
            // const res = await fetch("https://your-laravel-api.com/api/deals", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(newDeal)
            // });
            // return res.json();

            await delay(500);
            const deals = JSON.parse(localStorage.getItem("deals") || JSON.stringify(MOCK_DEALS));
            const dealWithId = { 
                ...newDeal, 
                id: Math.max(0, ...deals.map(d => d.id)) + 1,
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
            // 🚀 When Laravel API is ready:
            // const res = await fetch(`https://your-laravel-api.com/api/deals/${updatedDeal.id}`, {
            //     method: "PUT",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(updatedDeal)
            // });
            // return res.json();

            await delay(500);
            const deals = JSON.parse(localStorage.getItem("deals") || JSON.stringify(MOCK_DEALS));
            const updated = deals.map(d => d.id === updatedDeal.id ? updatedDeal : d);
            localStorage.setItem("deals", JSON.stringify(updated));
            return updatedDeal;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] });
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
            const trash = JSON.parse(localStorage.getItem("trash-deals") || "[]");
            
            const dealToDelete = deals.find(d => d.id === id);
            if (!dealToDelete) return id;

            const updatedDeals = deals.filter(d => d.id !== id);
            const updatedTrash = [dealToDelete, ...trash];

            localStorage.setItem("deals", JSON.stringify(updatedDeals));
            localStorage.setItem("trash-deals", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] });
            queryClient.invalidateQueries({ queryKey: ["trash-deals"] });
            toast.success("Deal moved to trash!");
        }
    });
}

export function useRestoreDeal() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const deals = JSON.parse(localStorage.getItem("deals") || JSON.stringify(MOCK_DEALS));
            const trash = JSON.parse(localStorage.getItem("trash-deals") || "[]");
            
            const dealToRestore = trash.find(d => d.id === id);
            if (!dealToRestore) return id;

            const updatedTrash = trash.filter(d => d.id !== id);
            const updatedDeals = [dealToRestore, ...deals];

            localStorage.setItem("deals", JSON.stringify(updatedDeals));
            localStorage.setItem("trash-deals", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] });
            queryClient.invalidateQueries({ queryKey: ["trash-deals"] });
            toast.success("Deal restored successfully!");
        }
    });
}

export function usePermanentDeleteDeal() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const trash = JSON.parse(localStorage.getItem("trash-deals") || "[]");
            const updatedTrash = trash.filter(d => d.id !== id);
            localStorage.setItem("trash-deals", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trash-deals"] });
            toast.success("Deal permanently deleted!");
        }
    });
}

export function useBulkDeleteDeals() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const deals = JSON.parse(localStorage.getItem("deals") || JSON.stringify(MOCK_DEALS));
            const trash = JSON.parse(localStorage.getItem("trash-deals") || "[]");

            const itemsToDelete = deals.filter(d => ids.includes(d.id));
            const remainingDeals = deals.filter(d => !ids.includes(d.id));
            const updatedTrash = [...itemsToDelete, ...trash];

            localStorage.setItem("deals", JSON.stringify(remainingDeals));
            localStorage.setItem("trash-deals", JSON.stringify(updatedTrash));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] });
            queryClient.invalidateQueries({ queryKey: ["trash-deals"] });
            toast.success("Selected deals moved to trash!");
        }
    });
}

export function useUpdateDealStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status, month }) => {
            // 🚀 When Laravel API is ready:
            // const res = await fetch(`https://your-laravel-api.com/api/deals/${id}/status`, {
            //     method: "PATCH",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ status, month })
            // });
            // return res.json();

            // No artificial delay for snappier DND
            const deals = JSON.parse(localStorage.getItem("deals") || JSON.stringify(MOCK_DEALS));
            const updated = deals.map(d => d.id === id ? { ...d, status, month: month || d.month } : d);
            localStorage.setItem("deals", JSON.stringify(updated));
            return { id, status, month };
        },
        // --- Optimistic Update ---
        onMutate: async (updatedVars) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["deals"] });

            // Snapshot the previous value
            const previousDeals = queryClient.getQueryData(["deals"]);

            // Optimistically update to the new value
            queryClient.setQueryData(["deals"], (old) => {
                if (!old) return [];
                return old.map(d => d.id === updatedVars.id ? { ...d, status: updatedVars.status, month: updatedVars.month || d.month } : d);
            });

            // Return a context object with the snapshotted value
            return { previousDeals };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, newTodo, context) => {
            queryClient.setQueryData(["deals"], context.previousDeals);
            toast.error("Failed to update status");
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] });
        },
        onSuccess: () => {
            toast.success("Deal moved successfully!");
        }
    });
}
