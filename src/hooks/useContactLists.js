"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_CONTACTS = [
    {
        id: 1,
        name: "Shaima Al Suwaidi",
        gender: "Female",
        address: "Dubai culture and art authority",
        phones: ["+971501014411"],
        landlines: [""],
        email: "shaima.alsuwaidi@dubaiculture.ae",
        top_customer: "No",
        decision_maker_status: "Yes",
        status: "New Lead",
        employee: "Sedra Quraid",
        country: "United Arab Emirates",
        company: "Dubai Culture & Arts Authority",
        budget: "5000",
        avg_stands_year: "2024",
        avg_events_year: "2025",
        company_website_url: "https://example.com",
        social_links: [""],
        job_title: "CEO",
        notes: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
        created_at: "2026-01-20"
    },
    {
        id: 2,
        name: "maitha al blooshi",
        gender: "Female",
        address: "Dubai culture and art authority",
        phones: ["+971508879993", "+971508879993"],
        landlines: [""],
        email: "alblooshi@dubaiculture.gov.ae",
        top_customer: "No",
        decision_maker_status: "No",
        status: "New Lead",
        employee: "Sedra Quraid",
        country: "United Arab Emirates",
        company: "Dubai Culture & Arts Authority",
        budget: "10000",
        avg_stands_year: "2024",
        avg_events_year: "2025",
        company_website_url: "https://example.com",
        social_links: [""],
        job_title: "event manager",
        notes: "she is responsible for Al Marmoom film festival...",
        created_at: "2026-01-20"
    },
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useContactLists() {
    return useQuery({
        queryKey: ["contact-lists"],
        queryFn: async () => {
            // 🚀 When Laravel API is ready:
            // const res = await fetch("https://your-laravel-api.com/api/contact-lists");
            // return res.json();

            await delay(500); // Simulate network
            const stored = localStorage.getItem("contacts");
            return stored ? JSON.parse(stored) : MOCK_CONTACTS;
        },
    });
}

export function useTrashContacts() {
    return useQuery({
        queryKey: ["trash-contacts"],
        queryFn: async () => {
            await delay(300);
            const stored = localStorage.getItem("trash-contacts");
            return stored ? JSON.parse(stored) : [];
        },
    });
}

export function useAddContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newContact) => {
            // 🚀 When Laravel API is ready:
            // const res = await fetch("https://your-laravel-api.com/api/contact-lists", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(newContact)
            // });
            // return res.json();

            await delay(500);
            const contacts = JSON.parse(localStorage.getItem("contacts") || JSON.stringify(MOCK_CONTACTS));
            const contactWithId = { 
                ...newContact, 
                id: Math.max(0, ...contacts.map(c => c.id)) + 1,
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [contactWithId, ...contacts];
            localStorage.setItem("contacts", JSON.stringify(updated));
            return contactWithId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-lists"] });
            toast.success("Contact added successfully!");
        }
    });
}

export function useUpdateContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedContact) => {
            // 🚀 When Laravel API is ready:
            // const res = await fetch(`https://your-laravel-api.com/api/contact-lists/${updatedContact.id}`, {
            //     method: "PUT",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(updatedContact)
            // });
            // return res.json();

            await delay(500);
            const contacts = JSON.parse(localStorage.getItem("contacts") || JSON.stringify(MOCK_CONTACTS));
            const updated = contacts.map(c => c.id === updatedContact.id ? updatedContact : c);
            localStorage.setItem("contacts", JSON.stringify(updated));
            return updatedContact;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-lists"] });
            toast.success("Contact updated successfully!");
        }
    });
}

export function useDeleteContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const contacts = JSON.parse(localStorage.getItem("contacts") || JSON.stringify(MOCK_CONTACTS));
            const trash = JSON.parse(localStorage.getItem("trash-contacts") || "[]");
            
            const contactToDelete = contacts.find(c => c.id === id);
            if (!contactToDelete) return id;

            const updatedContacts = contacts.filter(c => c.id !== id); // ERROR: countries instead of contacts? Fixed below
            const updatedTrash = [contactToDelete, ...trash];

            localStorage.setItem("contacts", JSON.stringify(contacts.filter(c => c.id !== id)));
            localStorage.setItem("trash-contacts", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-lists"] });
            queryClient.invalidateQueries({ queryKey: ["trash-contacts"] });
            toast.success("Contact moved to trash!");
        }
    });
}

export function useRestoreContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const contacts = JSON.parse(localStorage.getItem("contacts") || JSON.stringify(MOCK_CONTACTS));
            const trash = JSON.parse(localStorage.getItem("trash-contacts") || "[]");
            
            const contactToRestore = trash.find(c => c.id === id);
            if (!contactToRestore) return id;

            const updatedTrash = trash.filter(c => c.id !== id);
            const updatedContacts = [contactToRestore, ...contacts];

            localStorage.setItem("contacts", JSON.stringify(updatedContacts));
            localStorage.setItem("trash-contacts", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-lists"] });
            queryClient.invalidateQueries({ queryKey: ["trash-contacts"] });
            toast.success("Contact restored successfully!");
        }
    });
}

export function usePermanentDeleteContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const trash = JSON.parse(localStorage.getItem("trash-contacts") || "[]");
            const updatedTrash = trash.filter(c => c.id !== id);
            localStorage.setItem("trash-contacts", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trash-contacts"] });
            toast.success("Contact permanently deleted!");
        }
    });
}

export function useBulkDeleteContacts() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const contacts = JSON.parse(localStorage.getItem("contacts") || JSON.stringify(MOCK_CONTACTS));
            const trash = JSON.parse(localStorage.getItem("trash-contacts") || "[]");

            const itemsToDelete = contacts.filter(c => ids.includes(c.id));
            const remainingContacts = contacts.filter(c => !ids.includes(c.id));
            const updatedTrash = [...itemsToDelete, ...trash];

            localStorage.setItem("contacts", JSON.stringify(remainingContacts));
            localStorage.setItem("trash-contacts", JSON.stringify(updatedTrash));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-lists"] });
            queryClient.invalidateQueries({ queryKey: ["trash-contacts"] });
            toast.success("Selected contacts moved to trash!");
        }
    });
}
