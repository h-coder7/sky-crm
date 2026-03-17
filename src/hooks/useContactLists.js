"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_CONTACTS = [
    { 
        id: 1, 
        name: "John Doe", 
        gender: "Male",
        company: "Skybridge Technologies",
        job_title: "Marketing Manager",
        employee: "Ahmed Hassan",
        status: "New Lead",
        top_customer: "Yes",
        decision_maker_status: "Yes",
        country: "United Arab Emirates",
        address: "Dubai Internet City",
        email: "john.doe@skybridge.com",
        phones: ["+971 50 123 4567"],
        landlines: ["+971 4 123 4567"],
        notes: "Interested in Q1 campaign",
        budget: "50,000",
        avg_events_year: "4",
        avg_stands_year: "2",
        company_website_url: "https://skybridge.tech",
        social_links: ["https://linkedin.com/in/johndoe"],
        created_at: "2026-01-10" 
    },
    { 
        id: 2, 
        name: "Jane Smith", 
        gender: "Female",
        company: "Gulf Finance Corp",
        job_title: "Operation Director",
        employee: "Sarah Ali",
        status: "Proposal Submitted",
        top_customer: "No",
        decision_maker_status: "Yes",
        country: "Saudi Arabia",
        address: "King Fahd Rd, Riyadh",
        email: "jane.smith@gulffinance.sa",
        phones: ["+966 55 987 6543"],
        landlines: [""],
        notes: "Gathered at Tech Summit",
        budget: "120,000",
        avg_events_year: "2",
        avg_stands_year: "1",
        company_website_url: "https://gulffinance.sa",
        social_links: ["https://linkedin.com/company/gulffinance"],
        created_at: "2026-01-12" 
    }
];

// Helper to simulate API calls
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useContactLists() {
    return useQuery({
        queryKey: ["contact-lists"],
        queryFn: async () => {
            await delay(500); // Simulate network
            // In the future: return api.get("/contact-lists").then(res => res.data);
            return JSON.parse(localStorage.getItem("contacts") || JSON.stringify(MOCK_CONTACTS));
        },
    });
}

export function useAddContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newContact) => {
            await delay(500);
            const contacts = JSON.parse(localStorage.getItem("contacts") || JSON.stringify(MOCK_CONTACTS));
            const contactWithId = { 
                ...newContact, 
                id: Date.now(),
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
            const filtered = contacts.filter(c => c.id !== id);
            localStorage.setItem("contacts", JSON.stringify(filtered));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-lists"] });
            toast.success("Contact moved to trash!");
        }
    });
}

export function useBulkDeleteContacts() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const contacts = JSON.parse(localStorage.getItem("contacts") || JSON.stringify(MOCK_CONTACTS));
            const filtered = contacts.filter(c => !ids.includes(c.id));
            localStorage.setItem("contacts", JSON.stringify(filtered));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-lists"] });
            toast.success("Selected contacts moved to trash!");
        }
    });
}
