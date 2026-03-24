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

export function useDailyLog() {
    return useQuery({
        queryKey: ["daily-logs"],
        queryFn: async () => {
            // 🚀 When Laravel API is ready:
            // const res = await fetch("https://your-laravel-api.com/api/daily-logs");
            // return res.json();

            await delay(500); // Simulate network
            const stored = localStorage.getItem("daily-logs");
            return stored ? JSON.parse(stored) : MOCK_DAILY_LOGS;
        },
    });
}

export function useTrashDailyLogs() {
    return useQuery({
        queryKey: ["trash-daily-logs"],
        queryFn: async () => {
            await delay(300);
            const stored = localStorage.getItem("trash-daily-logs");
            return stored ? JSON.parse(stored) : [];
        },
    });
}

export function useAddDailyLog() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newLog) => {
            // 🚀 When Laravel API is ready:
            // const res = await fetch("https://your-laravel-api.com/api/daily-logs", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(newLog)
            // });
            // return res.json();

            await delay(500);
            const logs = JSON.parse(localStorage.getItem("daily-logs") || JSON.stringify(MOCK_DAILY_LOGS));
            const logWithId = { 
                ...newLog, 
                id: Math.max(0, ...logs.map(l => l.id)) + 1,
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [logWithId, ...logs];
            localStorage.setItem("daily-logs", JSON.stringify(updated));
            return logWithId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["daily-logs"] });
            toast.success("Daily log entry added successfully!");
        }
    });
}

export function useUpdateDailyLog() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedLog) => {
            // 🚀 When Laravel API is ready:
            // const res = await fetch(`https://your-laravel-api.com/api/daily-logs/${updatedLog.id}`, {
            //     method: "PUT",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(updatedLog)
            // });
            // return res.json();

            await delay(500);
            const logs = JSON.parse(localStorage.getItem("daily-logs") || JSON.stringify(MOCK_DAILY_LOGS));
            const updated = logs.map(l => l.id === updatedLog.id ? updatedLog : l);
            localStorage.setItem("daily-logs", JSON.stringify(updated));
            return updatedLog;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["daily-logs"] });
            toast.success("Daily log entry updated successfully!");
        }
    });
}

export function useDeleteDailyLog() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const logs = JSON.parse(localStorage.getItem("daily-logs") || JSON.stringify(MOCK_DAILY_LOGS));
            const trash = JSON.parse(localStorage.getItem("trash-daily-logs") || "[]");
            
            const logToDelete = logs.find(l => l.id === id);
            if (!logToDelete) return id;

            const updatedLogs = logs.filter(l => l.id !== id);
            const updatedTrash = [logToDelete, ...trash];

            localStorage.setItem("daily-logs", JSON.stringify(updatedLogs));
            localStorage.setItem("trash-daily-logs", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["daily-logs"] });
            queryClient.invalidateQueries({ queryKey: ["trash-daily-logs"] });
            toast.success("Daily log entry moved to trash!");
        }
    });
}

export function useRestoreDailyLog() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const logs = JSON.parse(localStorage.getItem("daily-logs") || JSON.stringify(MOCK_DAILY_LOGS));
            const trash = JSON.parse(localStorage.getItem("trash-daily-logs") || "[]");
            
            const logToRestore = trash.find(l => l.id === id);
            if (!logToRestore) return id;

            const updatedTrash = trash.filter(l => l.id !== id);
            const updatedLogs = [logToRestore, ...logs];

            localStorage.setItem("daily-logs", JSON.stringify(updatedLogs));
            localStorage.setItem("trash-daily-logs", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["daily-logs"] });
            queryClient.invalidateQueries({ queryKey: ["trash-daily-logs"] });
            toast.success("Daily log entry restored successfully!");
        }
    });
}

export function usePermanentDeleteDailyLog() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const trash = JSON.parse(localStorage.getItem("trash-daily-logs") || "[]");
            const updatedTrash = trash.filter(l => l.id !== id);
            localStorage.setItem("trash-daily-logs", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trash-daily-logs"] });
            toast.success("Daily log entry permanently deleted!");
        }
    });
}

export function useBulkDeleteDailyLogs() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const logs = JSON.parse(localStorage.getItem("daily-logs") || JSON.stringify(MOCK_DAILY_LOGS));
            const trash = JSON.parse(localStorage.getItem("trash-daily-logs") || "[]");

            const itemsToDelete = logs.filter(l => ids.includes(l.id));
            const remainingLogs = logs.filter(l => !ids.includes(l.id));
            const updatedTrash = [...itemsToDelete, ...trash];

            localStorage.setItem("daily-logs", JSON.stringify(remainingLogs));
            localStorage.setItem("trash-daily-logs", JSON.stringify(updatedTrash));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["daily-logs"] });
            queryClient.invalidateQueries({ queryKey: ["trash-daily-logs"] });
            toast.success("Selected entries moved to trash!");
        }
    });
}
