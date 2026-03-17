"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_EMPLOYEES = [
    { id: 1, name: "Ahmed Hassan", email: "ahmed@example.com", phone: "123456789", role: "Manager", created_at: "2026-01-20" },
    { id: 2, name: "Sarah John", email: "sarah@example.com", phone: "987654321", role: "Developer", created_at: "2026-01-22" },
    { id: 3, name: "Mohamed Ali", email: "mohamed@example.com", phone: "555666777", role: "Sales", created_at: "2026-01-25" },
];

// Helper to simulate API calls
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useEmployees() {
    return useQuery({
        queryKey: ["employees"],
        queryFn: async () => {
            await delay(500); // Simulate network
            return JSON.parse(localStorage.getItem("employees") || JSON.stringify(MOCK_EMPLOYEES));
        },
    });
}

export function useAddEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newEmployee) => {
            await delay(500);
            const employees = JSON.parse(localStorage.getItem("employees") || JSON.stringify(MOCK_EMPLOYEES));
            const employeeWithId = { 
                ...newEmployee, 
                id: Date.now(),
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [employeeWithId, ...employees];
            localStorage.setItem("employees", JSON.stringify(updated));
            return employeeWithId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            toast.success("Employee added successfully!");
        }
    });
}

export function useUpdateEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updatedEmployee) => {
            await delay(500);
            const employees = JSON.parse(localStorage.getItem("employees") || JSON.stringify(MOCK_EMPLOYEES));
            const updated = employees.map(e => e.id === updatedEmployee.id ? updatedEmployee : e);
            localStorage.setItem("employees", JSON.stringify(updated));
            return updatedEmployee;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            toast.success("Employee updated successfully!");
        }
    });
}

export function useDeleteEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const employees = JSON.parse(localStorage.getItem("employees") || JSON.stringify(MOCK_EMPLOYEES));
            const filtered = employees.filter(e => e.id !== id);
            localStorage.setItem("employees", JSON.stringify(filtered));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            toast.success("Employee moved to trash!");
        }
    });
}

export function useBulkDeleteEmployees() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const employees = JSON.parse(localStorage.getItem("employees") || JSON.stringify(MOCK_EMPLOYEES));
            const filtered = employees.filter(e => !ids.includes(e.id));
            localStorage.setItem("employees", JSON.stringify(filtered));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            toast.success("Selected employees moved to trash!");
        }
    });
}
