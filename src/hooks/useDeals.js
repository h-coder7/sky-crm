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
        mutationFn: async ({ id, status }) => {
            await delay(300);
            const deals = JSON.parse(localStorage.getItem("deals") || JSON.stringify(MOCK_DEALS));
            const updated = deals.map(d => d.id === id ? { ...d, status } : d);
            localStorage.setItem("deals", JSON.stringify(updated));
            return { id, status };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] });
            toast.success("Deal status updated!");
        }
    });
}
