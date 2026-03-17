"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_DAILY_LOGS = [
  {
    id: 1,
    employee: "Amira Hassan",
    contact_list: "Real Estate Leads",
    job_title: "Sales Manager",
    company: "Sky Bridge",
    date: "2024-03-20",
    type: "Call",
    objective: "Follow up on proposal",
    estimated_sale: "5000",
    contact_status: "Interested",
    next_action: "Schedule Meeting",
    next_contact: "2024-03-25",
    created_at: "2024-03-20"
  },
  {
    id: 2,
    employee: "Ahmed Farouk",
    contact_list: "Software Solutions",
    job_title: "Technical Consultant",
    company: "Tech Global",
    date: "2024-03-21",
    type: "Email",
    objective: "Product Demo",
    estimated_sale: "12000",
    contact_status: "Neutral",
    next_action: "Send Brochure",
    next_contact: "2024-03-24",
    created_at: "2024-03-21"
  }
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useDailyLogs() {
    return useQuery({
        queryKey: ["daily-logs"],
        queryFn: async () => {
            await delay(500); // Simulate network
            return JSON.parse(localStorage.getItem("daily-logs") || JSON.stringify(MOCK_DAILY_LOGS));
        },
    });
}

export function useAddDailyLog() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newLog) => {
            await delay(500);
            const logs = JSON.parse(localStorage.getItem("daily-logs") || JSON.stringify(MOCK_DAILY_LOGS));
            const logWithId = { 
                ...newLog, 
                id: Date.now(),
                date: newLog.date || new Date().toISOString().split("T")[0],
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [logWithId, ...logs];
            localStorage.setItem("daily-logs", JSON.stringify(updated));
            return logWithId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["daily-logs"] });
            toast.success("Daily log added successfully!");
        }
    });
}

export function useUpdateDailyLog() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedLog) => {
            await delay(500);
            const logs = JSON.parse(localStorage.getItem("daily-logs") || JSON.stringify(MOCK_DAILY_LOGS));
            const updated = logs.map(l => l.id === updatedLog.id ? updatedLog : l);
            localStorage.setItem("daily-logs", JSON.stringify(updated));
            return updatedLog;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["daily-logs"] });
            toast.success("Daily log updated successfully!");
        }
    });
}

export function useDeleteDailyLog() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const logs = JSON.parse(localStorage.getItem("daily-logs") || JSON.stringify(MOCK_DAILY_LOGS));
            const filtered = logs.filter(l => l.id !== id);
            localStorage.setItem("daily-logs", JSON.stringify(filtered));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["daily-logs"] });
            toast.success("Log entry moved to trash!");
        }
    });
}

export function useBulkDeleteDailyLogs() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const logs = JSON.parse(localStorage.getItem("daily-logs") || JSON.stringify(MOCK_DAILY_LOGS));
            const filtered = logs.filter(l => !ids.includes(l.id));
            localStorage.setItem("daily-logs", JSON.stringify(filtered));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["daily-logs"] });
            toast.success("Selected logs moved to trash!");
        }
    });
}
