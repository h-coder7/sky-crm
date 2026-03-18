"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_EMPLOYEES = [
    { 
        id: 1, 
        name: "Sedra Quraid", 
        email: "s.quraid@skybridgeworld.com", 
        phone: "506011612", 
        role: "Business Development Executive", 
        sector: "Real estate & Construction , Government & Public Services",
        created_at: "2025-12-03",
    },
    { 
        id: 2, 
        name: "Christina Skentos", 
        email: "c.skentos@skybridgeworld.com", 
        phone: "569239235", 
        role: "Business Development Manager", 
        sector: "Logistics, Travel & Leisure , Oil & Gas, & Energy",
        created_at: "2025-11-18",
    },
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ----------------------------------------------------------------------
// 🚀 HOOKS
// ----------------------------------------------------------------------

export function useEmployees() {
    return useQuery({
        queryKey: ["employees"],
        queryFn: async () => {
            await delay(500); // Simulate network
            const stored = localStorage.getItem("employees");
            return stored ? JSON.parse(stored) : MOCK_EMPLOYEES;
        },
    });
}

export function useTrashEmployees() {
    return useQuery({
        queryKey: ["trash-employees"],
        queryFn: async () => {
            await delay(300);
            const stored = localStorage.getItem("trash-employees");
            return stored ? JSON.parse(stored) : [];
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
                id: Math.max(0, ...employees.map(e => e.id)) + 1,
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
            const trash = JSON.parse(localStorage.getItem("trash-employees") || "[]");
            
            const employeeToDelete = employees.find(e => e.id === id);
            if (!employeeToDelete) return id;

            const updatedEmployees = employees.filter(e => e.id !== id);
            const updatedTrash = [employeeToDelete, ...trash];

            localStorage.setItem("employees", JSON.stringify(updatedEmployees));
            localStorage.setItem("trash-employees", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            queryClient.invalidateQueries({ queryKey: ["trash-employees"] });
            toast.success("Employee moved to trash!");
        }
    });
}

export function useRestoreEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const employees = JSON.parse(localStorage.getItem("employees") || JSON.stringify(MOCK_EMPLOYEES));
            const trash = JSON.parse(localStorage.getItem("trash-employees") || "[]");
            
            const employeeToRestore = trash.find(e => e.id === id);
            if (!employeeToRestore) return id;

            const updatedTrash = trash.filter(e => e.id !== id);
            const updatedEmployees = [employeeToRestore, ...employees];

            localStorage.setItem("employees", JSON.stringify(updatedEmployees));
            localStorage.setItem("trash-employees", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            queryClient.invalidateQueries({ queryKey: ["trash-employees"] });
            toast.success("Employee restored successfully!");
        }
    });
}

export function usePermanentDeleteEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            await delay(500);
            const trash = JSON.parse(localStorage.getItem("trash-employees") || "[]");
            const updatedTrash = trash.filter(e => e.id !== id);
            localStorage.setItem("trash-employees", JSON.stringify(updatedTrash));
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trash-employees"] });
            toast.success("Employee permanently deleted!");
        }
    });
}

export function useBulkDeleteEmployees() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids) => {
            await delay(500);
            const employees = JSON.parse(localStorage.getItem("employees") || JSON.stringify(MOCK_EMPLOYEES));
            const trash = JSON.parse(localStorage.getItem("trash-employees") || "[]");

            const itemsToDelete = employees.filter(e => ids.includes(e.id));
            const remainingEmployees = employees.filter(e => !ids.includes(e.id));
            const updatedTrash = [...itemsToDelete, ...trash];

            localStorage.setItem("employees", JSON.stringify(remainingEmployees));
            localStorage.setItem("trash-employees", JSON.stringify(updatedTrash));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            queryClient.invalidateQueries({ queryKey: ["trash-employees"] });
            toast.success("Selected employees moved to trash!");
        }
    });
}
