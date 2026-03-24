"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_COUNTRIES = [
    { id: 1, title: "United Arab Emirates", country_key: "971", created_at: "2025-08-31" },
    { id: 2, title: "saudia arabia", country_key: "966", created_at: "2021-08-07" },
    { id: 3, title: "Afghanistan", country_key: "93", created_at: "2025-08-31" },
    { id: 4, title: "Aland Islands", country_key: "358", created_at: "2025-08-31" },
    { id: 5, title: "Albania", country_key: "355", created_at: "2025-08-31" },
    { id: 6, title: "Algeria", country_key: "213", created_at: "2025-08-31" },
    { id: 7, title: "American Samoa", country_key: "1684", created_at: "2025-08-31" },
    { id: 8, title: "Andorra", country_key: "376", created_at: "2025-08-31" },
    { id: 9, title: "Angola", country_key: "244", created_at: "2025-08-31" },
    { id: 10, title: "Anguilla", country_key: "1264", created_at: "2025-08-31" },
    { id: 11, title: "Antarctica", country_key: "672", created_at: "2025-08-31" },
    { id: 12, title: "Antigua and Barbuda", country_key: "1268", created_at: "2025-08-31" },
    { id: 13, title: "Argentina", country_key: "54", created_at: "2025-08-31" },
    { id: 14, title: "Armenia", country_key: "374", created_at: "2025-08-31" },
    { id: 15, title: "Aruba", country_key: "297", created_at: "2025-08-31" },
    { id: 16, title: "Australia", country_key: "61", created_at: "2025-08-31" },
    { id: 17, title: "Austria", country_key: "43", created_at: "2025-08-31" },
    { id: 18, title: "Azerbaijan", country_key: "994", created_at: "2025-08-31" },
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useCountries() {
    return useQuery({
        queryKey: ["countries"],
        queryFn: async () => {
            // 🚀 When Laravel API is ready:
            // const res = await fetch("https://your-laravel-api.com/api/countries");
            // return res.json();

            await delay(500); // Simulate network
            const stored = localStorage.getItem("countries");
            return stored ? JSON.parse(stored) : MOCK_COUNTRIES;
        },
    });
}

export function useTrashCountries() {
    return useQuery({
        queryKey: ["trash-countries"],
        queryFn: async () => {
            await delay(300);
            const stored = localStorage.getItem("trash-countries");
            return stored ? JSON.parse(stored) : [];
        },
    });
}

export function useAddCountry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newCountry) => {
            // 🚀 When Laravel API is ready:
            // const res = await fetch("https://your-laravel-api.com/api/countries", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(newCountry)
            // });
            // return res.json();

            await delay(500);
            const countries = JSON.parse(localStorage.getItem("countries") || JSON.stringify(MOCK_COUNTRIES));
            const countryWithId = { 
                ...newCountry, 
                id: Math.max(0, ...countries.map(c => c.id)) + 1,
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [countryWithId, ...countries];
            localStorage.setItem("countries", JSON.stringify(updated));
            return countryWithId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["countries"] });
            toast.success("Country added successfully!");
        }
    });
}

export function useUpdateCountry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedCountry) => {
            // 🚀 When Laravel API is ready:
            // const res = await fetch(`https://your-laravel-api.com/api/countries/${updatedCountry.id}`, {
            //     method: "PUT",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(updatedCountry)
            // });
            // return res.json();

            await delay(500);
            const countries = JSON.parse(localStorage.getItem("countries") || JSON.stringify(MOCK_COUNTRIES));
            const updated = countries.map(c => c.id === updatedCountry.id ? updatedCountry : c);
            localStorage.setItem("countries", JSON.stringify(updated));
            return updatedCountry;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["countries"] });
            toast.success("Country updated successfully!");
        }
    });
}

export function useDeleteCountry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const countries = JSON.parse(localStorage.getItem("countries") || JSON.stringify(MOCK_COUNTRIES));
            const trash = JSON.parse(localStorage.getItem("trash-countries") || "[]");
            
            const countryToDelete = countries.find(c => c.id === id);
            if (!countryToDelete) return id;

            const updatedCountries = countries.filter(c => c.id !== id);
            const updatedTrash = [countryToDelete, ...trash];

            localStorage.setItem("countries", JSON.stringify(updatedCountries));
            localStorage.setItem("trash-countries", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["countries"] });
            queryClient.invalidateQueries({ queryKey: ["trash-countries"] });
            toast.success("Country moved to trash!");
        }
    });
}

export function useRestoreCountry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const countries = JSON.parse(localStorage.getItem("countries") || JSON.stringify(MOCK_COUNTRIES));
            const trash = JSON.parse(localStorage.getItem("trash-countries") || "[]");
            
            const countryToRestore = trash.find(c => c.id === id);
            if (!countryToRestore) return id;

            const updatedTrash = trash.filter(c => c.id !== id);
            const updatedCountries = [countryToRestore, ...countries];

            localStorage.setItem("countries", JSON.stringify(updatedCountries));
            localStorage.setItem("trash-countries", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["countries"] });
            queryClient.invalidateQueries({ queryKey: ["trash-countries"] });
            toast.success("Country restored successfully!");
        }
    });
}

export function usePermanentDeleteCountry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const trash = JSON.parse(localStorage.getItem("trash-countries") || "[]");
            const updatedTrash = trash.filter(c => c.id !== id);
            localStorage.setItem("trash-countries", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trash-countries"] });
            toast.success("Country permanently deleted!");
        }
    });
}

export function useBulkDeleteCountries() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const countries = JSON.parse(localStorage.getItem("countries") || JSON.stringify(MOCK_COUNTRIES));
            const trash = JSON.parse(localStorage.getItem("trash-countries") || "[]");

            const itemsToDelete = countries.filter(c => ids.includes(c.id));
            const remainingCountries = countries.filter(c => !ids.includes(c.id));
            const updatedTrash = [...itemsToDelete, ...trash];

            localStorage.setItem("countries", JSON.stringify(remainingCountries));
            localStorage.setItem("trash-countries", JSON.stringify(updatedTrash));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["countries"] });
            queryClient.invalidateQueries({ queryKey: ["trash-countries"] });
            toast.success("Selected countries moved to trash!");
        }
    });
}
