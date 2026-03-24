"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ----------------------------------------------------------------------
// 📦 MOCK DATA & API SIMULATION
// ----------------------------------------------------------------------

const MOCK_EMPLOYEES = [
    { 
        id: 1, 
        name: "SKB Test", 
        email: "Skb@Test.com", 
        phone: "555759505", 
        role: "Head Department", 
        sector: "Manufacturing , Banking, Insurance & FinTech , Telecomm, Media & Entertainment , Beauty, Cosmetics & BeautyTech , Defense & Security , FMCGs, F&B, Foodtech & Aggregators , Aviation, Hospitality & TravelTech , Real estate & Proptech , Luxury, Fashion & RetailTech , Renewable Energy, Oil & Gas , Business Services, Auditing & Consultancy , Government , Automotive & Autotech , Tech & Cybersecurity , Pharmaceutical, Medical & MedTech",
        created_at: "2026-01-18",
        permissions: ["Get Employees", "Create Employee", "Edit Employee", "Show Employees", "Get Sectors", "Show Sector", "Get Countries", "Show Country"]
    },
    { 
        id: 2, 
        name: "Esslam Emad", 
        email: "esslam@inspire.com", 
        phone: "", 
        role: "Head Department", 
        sector: "Government",
        created_at: "2026-01-18",
        permissions: ["Get Employees", "Show Employees", "Get Sectors", "Show Sector", "Get Countries"]
    },
    { 
        id: 3, 
        name: "omar ibrahim elhosseny", 
        email: "omarseheim259@gmail.com", 
        phone: "51325586", 
        role: "Business Development Executive", 
        sector: "Manufacturing , Defense & Security",
        created_at: "2026-01-18",
        permissions: ["Get Employees", "Show Employees", "Get Deals", "Show Deal"]
    },
    { 
        id: 4, 
        name: "Houssen Salman", 
        email: "h.salman@skybridgeworld.com", 
        phone: "544561584", 
        role: "Senior Business Development Manager", 
        sector: "Aviation, Hospitality & TravelTech , Real estate & Proptech , Automotive & Autotech",
        created_at: "2026-01-16",
        permissions: ["Get Employees", "Show Employees", "Get Deals", "Show Deal", "Get Companies", "Show Company"]
    },
    { 
        id: 5, 
        name: "omar", 
        email: "omarseheim@gmail.com", 
        phone: "512345678", 
        role: "Senior Business Development Manager", 
        sector: "",
        created_at: "2025-12-11",
        permissions: ["Get Employees", "Show Employees"]
    },
    { 
        id: 6, 
        name: "Sedra Quraid", 
        email: "s.quraid@skybridgeworld.com", 
        phone: "506011612", 
        role: "Business Development Manager", 
        sector: "Government",
        created_at: "2025-12-03",
        permissions: ["Get Employees", "Show Employees", "Get Sectors"]
    },
    { 
        id: 7, 
        name: "Christina Skentos", 
        email: "c.skentos@skybridgeworld.com", 
        phone: "569239235", 
        role: "Business Development Manager", 
        sector: "Defense & Security , Renewable Energy, Oil & Gas , Tech & Cybersecurity",
        created_at: "2025-11-18",
        permissions: ["Get Employees", "Show Employees", "Get Sectors", "Show Sector"]
    },
    { 
        id: 8, 
        name: "Pretti Nayak", 
        email: "p.nayak@skybridgeworld.com", 
        phone: "557199469", 
        role: "Business Development Manager", 
        sector: "Banking, Insurance & FinTech , FMCGs, F&B, Foodtech & Aggregators",
        created_at: "2025-11-18",
        permissions: ["Get Employees", "Show Employees", "Get Companies", "Show Company"]
    },
    { 
        id: 9, 
        name: "Nourel Moulay", 
        email: "n.moulay@skybridgeworld.com", 
        phone: "585969851", 
        role: "Senior Business Development Manager", 
        sector: "Telecomm, Media & Entertainment , Beauty, Cosmetics & BeautyTech , Luxury, Fashion & RetailTech",
        created_at: "2025-11-18",
        permissions: ["Get Employees", "Show Employees", "Get Products", "Show Product"]
    },
    { 
        id: 10, 
        name: "Moustafa Sayed", 
        email: "m.sayed@skybridgeworld.com", 
        phone: "529066321", 
        role: "Business Development Executive", 
        sector: "Pharmaceutical, Medical & MedTech",
        created_at: "2025-11-04",
        permissions: ["Get Employees", "Show Employees", "Get Daily Log", "Show Log"]
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
            // ---------------------------------------------------------
            // 🚀 When Laravel API is ready:
            // const res = await fetch("https://your-laravel-api.com/api/employees");
            // return res.json();
            // ---------------------------------------------------------

            await delay(500); // Simulate network
            const stored = localStorage.getItem("employees_v3");
            return stored ? JSON.parse(stored) : MOCK_EMPLOYEES;
        },
    });
}

export function useTrashEmployees() {
    return useQuery({
        queryKey: ["trash-employees"],
        queryFn: async () => {
            await delay(300);
            const stored = localStorage.getItem("trash-employees-v3");
            return stored ? JSON.parse(stored) : [];
        },
    });
}

export function useAddEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newEmployee) => {
            // ---------------------------------------------------------
            // 🚀 When Laravel API is ready:
            // const res = await fetch("https://your-laravel-api.com/api/employees", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(newEmployee)
            // });
            // return res.json();
            // ---------------------------------------------------------

            await delay(500);
            const employees = JSON.parse(localStorage.getItem("employees_v3") || JSON.stringify(MOCK_EMPLOYEES));
            const employeeWithId = { 
                ...newEmployee, 
                id: Math.max(0, ...employees.map(e => e.id)) + 1,
                created_at: new Date().toISOString().split("T")[0] 
            };
            const updated = [employeeWithId, ...employees];
            localStorage.setItem("employees_v3", JSON.stringify(updated));
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
            // ---------------------------------------------------------
            // 🚀 When Laravel API is ready:
            // const res = await fetch(`https://your-laravel-api.com/api/employees/${updatedEmployee.id}`, {
            //     method: "PUT",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(updatedEmployee)
            // });
            // return res.json();
            // ---------------------------------------------------------

            await delay(500);
            const employees = JSON.parse(localStorage.getItem("employees_v3") || JSON.stringify(MOCK_EMPLOYEES));
            const updated = employees.map(e => e.id === updatedEmployee.id ? updatedEmployee : e);
            localStorage.setItem("employees_v3", JSON.stringify(updated));
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
            // ---------------------------------------------------------
            // 🚀 When Laravel API is ready:
            // await fetch(`https://your-laravel-api.com/api/employees/${id}`, { method: "DELETE" });
            // return id;
            // ---------------------------------------------------------

            await delay(500);
            const employees = JSON.parse(localStorage.getItem("employees_v3") || JSON.stringify(MOCK_EMPLOYEES));
            const trash = JSON.parse(localStorage.getItem("trash-employees-v3") || "[]");
            
            const employeeToDelete = employees.find(e => e.id === id);
            if (!employeeToDelete) return id;

            const updatedEmployees = employees.filter(e => e.id !== id);
            const updatedTrash = [employeeToDelete, ...trash];

            localStorage.setItem("employees_v3", JSON.stringify(updatedEmployees));
            localStorage.setItem("trash-employees-v3", JSON.stringify(updatedTrash));
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
            const employees = JSON.parse(localStorage.getItem("employees_v3") || JSON.stringify(MOCK_EMPLOYEES));
            const trash = JSON.parse(localStorage.getItem("trash-employees-v3") || "[]");
            
            const employeeToRestore = trash.find(e => e.id === id);
            if (!employeeToRestore) return id;

            const updatedTrash = trash.filter(e => e.id !== id);
            const updatedEmployees = [employeeToRestore, ...employees];

            localStorage.setItem("employees_v3", JSON.stringify(updatedEmployees));
            localStorage.setItem("trash-employees-v3", JSON.stringify(updatedTrash));
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
            const trash = JSON.parse(localStorage.getItem("trash-employees-v3") || "[]");
            const updatedTrash = trash.filter(e => e.id !== id);
            localStorage.setItem("trash-employees-v3", JSON.stringify(updatedTrash));
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
            const employees = JSON.parse(localStorage.getItem("employees_v3") || JSON.stringify(MOCK_EMPLOYEES));
            const trash = JSON.parse(localStorage.getItem("trash-employees-v3") || "[]");

            const itemsToDelete = employees.filter(e => ids.includes(e.id));
            const remainingEmployees = employees.filter(e => !ids.includes(e.id));
            const updatedTrash = [...itemsToDelete, ...trash];

            localStorage.setItem("employees_v3", JSON.stringify(remainingEmployees));
            localStorage.setItem("trash-employees-v3", JSON.stringify(updatedTrash));
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            queryClient.invalidateQueries({ queryKey: ["trash-employees"] });
            toast.success("Selected employees moved to trash!");
        }
    });
}
