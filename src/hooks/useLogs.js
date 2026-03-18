"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_LOGS = [
    { id: 1, timestamp: "2026-01-27 16:29:22", user: "Super Admin", action: "created", item: "DailyLog entry", module: "DailyLog" },
    { id: 2, timestamp: "2026-01-27 14:00:02", user: "Super Admin", action: "updated", item: "SKB Test", module: "Employee" },
    { id: 3, timestamp: "2026-01-27 13:36:32", user: "Houssen Salman", action: "created", item: "Mohammad Al Khatibeh", module: "ContactList" },
    { id: 4, timestamp: "2026-01-27 13:09:46", user: "Super Admin", action: "updated", item: "SKB Test", module: "Employee" },
    { id: 5, timestamp: "2026-01-26 16:02:27", user: "Christina Skentos", action: "created", item: "Ministry of Defense", module: "Company" },
    { id: 6, timestamp: "2026-01-26 15:49:40", user: "Christina Skentos", action: "created", item: "Redwan Obaid", module: "ContactList" },
    { id: 7, timestamp: "2026-01-26 15:31:56", user: "Christina Skentos", action: "created", item: "Tawazun", module: "Company" },
    { id: 8, timestamp: "2026-01-26 15:21:32", user: "Christina Skentos", action: "created", item: "Carlo Igniades", module: "ContactList" },
    { id: 9, timestamp: "2026-01-26 15:17:50", user: "Christina Skentos", action: "created", item: "L3 Harris", module: "Company" },
    { id: 10, timestamp: "2026-01-26 15:03:54", user: "Christina Skentos", action: "created", item: "Nandini Garg", module: "ContactList" },
    { id: 11, timestamp: "2026-01-26 14:48:13", user: "Christina Skentos", action: "created", item: "LODD", module: "Company" },
    { id: 12, timestamp: "2026-01-26 14:30:35", user: "Christina Skentos", action: "updated", item: "Christina Skentos", module: "Employee" },
    { id: 13, timestamp: "2026-01-26 14:24:47", user: "Super Admin", action: "updated", item: "Sobha Realty", module: "Company" },
    { id: 14, timestamp: "2026-01-20 17:50:14", user: "Super Admin", action: "updated", item: "Albania", module: "Country" },
    { id: 15, timestamp: "2026-01-20 17:50:03", user: "Super Admin", action: "updated", item: "Albania", module: "Country" },
    { id: 16, timestamp: "2026-01-20 15:31:14", user: "Super Admin", action: "deleted", item: "test", module: "Employee" },
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useLogs() {
    return useQuery({
        queryKey: ["logs"],
        queryFn: async () => {
            await delay(500); // Simulate network
            const stored = localStorage.getItem("activity-logs");
            return stored ? JSON.parse(stored) : MOCK_LOGS;
        },
    });
}

export function useAddLog() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newLog) => {
            await delay(100);
            const logs = JSON.parse(localStorage.getItem("activity-logs") || JSON.stringify(MOCK_LOGS));
            const logWithId = { 
                ...newLog, 
                id: Date.now(),
                timestamp: new Date().toISOString().replace("T", " ").split(".")[0] 
            };
            const updated = [logWithId, ...logs];
            localStorage.setItem("activity-logs", JSON.stringify(updated));
            return logWithId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logs"] });
        }
    });
}

export function useClearLogs() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await delay(500);
            localStorage.setItem("activity-logs", JSON.stringify([]));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logs"] });
            toast.success("Logs cleared successfully!");
        }
    });
}
