"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_COMPANIES = [
    {
        id: 1,
        title: "Ministry of Defense",
        address: "Abu dhabi",
        description: "They are Defense and Military",
        domain: "https://mod.gov.ae/",
        sector: "Defense & Security",
        country: "United Arab Emirates",
        created_at: "2026-01-26"
    },
    {
        id: 2,
        title: "Tawazun",
        address: "Abu dhabi",
        description: "Military and defense entity",
        domain: "",
        sector: "Defense & Security",
        country: "United Arab Emirates",
        created_at: "2026-01-26"
    },
    {
        id: 3,
        title: "L3 Harris",
        address: "Marina Park AD",
        description: "U.S. defense firm building secure comms and tech.",
        domain: "https://www.l3harris.com/en-ae/uae?regional_redire...",
        sector: "Defense & Security",
        country: "United Arab Emirates",
        created_at: "2026-01-26"
    },
];

// Helper to simulate API calls
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useCompanies() {
    return useQuery({
        queryKey: ["companies"],
        queryFn: async () => {
            await delay(500); // Simulate network
            const stored = localStorage.getItem("companies");
            return stored ? JSON.parse(stored) : MOCK_COMPANIES;
        },
    });
}

export function useTrashCompanies() {
    return useQuery({
        queryKey: ["trash-companies"],
        queryFn: async () => {
            await delay(300);
            const stored = localStorage.getItem("trash-companies");
            return stored ? JSON.parse(stored) : [];
        },
    });
}

export function useAddCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newCompany) => {
            await delay(500);
            const companies = JSON.parse(localStorage.getItem("companies") || JSON.stringify(MOCK_COMPANIES));
            const companyWithId = { 
                ...newCompany, 
                id: Math.max(0, ...companies.map(c => c.id)) + 1,
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [companyWithId, ...companies];
            localStorage.setItem("companies", JSON.stringify(updated));
            return companyWithId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            toast.success("Company added successfully!");
        }
    });
}

export function useUpdateCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedCompany) => {
            await delay(500);
            const companies = JSON.parse(localStorage.getItem("companies") || JSON.stringify(MOCK_COMPANIES));
            const updated = companies.map(c => c.id === updatedCompany.id ? updatedCompany : c);
            localStorage.setItem("companies", JSON.stringify(updated));
            return updatedCompany;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            toast.success("Company updated successfully!");
        }
    });
}

export function useDeleteCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const companies = JSON.parse(localStorage.getItem("companies") || JSON.stringify(MOCK_COMPANIES));
            const trash = JSON.parse(localStorage.getItem("trash-companies") || "[]");
            
            const companyToDelete = companies.find(c => c.id === id);
            if (!companyToDelete) return id;

            const updatedCompanies = companies.filter(c => c.id !== id);
            const updatedTrash = [companyToDelete, ...trash];

            localStorage.setItem("companies", JSON.stringify(updatedCompanies));
            localStorage.setItem("trash-companies", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            queryClient.invalidateQueries({ queryKey: ["trash-companies"] });
            toast.success("Company moved to trash!");
        }
    });
}

export function useRestoreCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const companies = JSON.parse(localStorage.getItem("companies") || JSON.stringify(MOCK_COMPANIES));
            const trash = JSON.parse(localStorage.getItem("trash-companies") || "[]");
            
            const companyToRestore = trash.find(c => c.id === id);
            if (!companyToRestore) return id;

            const updatedTrash = trash.filter(c => c.id !== id);
            const updatedCompanies = [companyToRestore, ...companies];

            localStorage.setItem("companies", JSON.stringify(updatedCompanies));
            localStorage.setItem("trash-companies", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            queryClient.invalidateQueries({ queryKey: ["trash-companies"] });
            toast.success("Company restored successfully!");
        }
    });
}

export function usePermanentDeleteCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const trash = JSON.parse(localStorage.getItem("trash-companies") || "[]");
            const updatedTrash = trash.filter(c => c.id !== id);
            localStorage.setItem("trash-companies", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trash-companies"] });
            toast.success("Company permanently deleted!");
        }
    });
}

export function useBulkDeleteCompanies() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const companies = JSON.parse(localStorage.getItem("companies") || JSON.stringify(MOCK_COMPANIES));
            const trash = JSON.parse(localStorage.getItem("trash-companies") || "[]");

            const itemsToDelete = companies.filter(c => ids.includes(c.id));
            const remainingCompanies = companies.filter(c => !ids.includes(c.id));
            const updatedTrash = [...itemsToDelete, ...trash];

            localStorage.setItem("companies", JSON.stringify(remainingCompanies));
            localStorage.setItem("trash-companies", JSON.stringify(updatedTrash));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            queryClient.invalidateQueries({ queryKey: ["trash-companies"] });
            toast.success("Selected companies moved to trash!");
        }
    });
}
