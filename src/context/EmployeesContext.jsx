"use client";

import { createContext, useContext, useState, useEffect } from "react";

const EmployeesContext = createContext();

const MOCK_EMPLOYEES = [
    { id: 1, name: "Ahmed Hassan", email: "ahmed@example.com", phone: "123456789", role: "Manager", created_at: "2026-01-20" },
    { id: 2, name: "Sarah John", email: "sarah@example.com", phone: "987654321", role: "Developer", created_at: "2026-01-22" },
    { id: 3, name: "Mohamed Ali", email: "mohamed@example.com", phone: "555666777", role: "Sales", created_at: "2026-01-25" },
];

export function EmployeesProvider({ children }) {
    const [employees, setEmployees] = useState(MOCK_EMPLOYEES);

    return (
        <EmployeesContext.Provider value={{ employees, setEmployees }}>
            {children}
        </EmployeesContext.Provider>
    );
}

export function useEmployees() {
    const context = useContext(EmployeesContext);
    if (!context) {
        throw new Error("useEmployees must be used within an EmployeesProvider");
    }
    return context;
}
