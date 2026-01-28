"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import EmployeesTable from "@/components/dashboard/employees/EmployeesTable";
import api from "@/app/api/api"; // 🔌 Import axios instance
import EmployeeModal from "@/components/dashboard/employees/EmployeeModal";
import TrashModal from "@/components/dashboard/employees/TrashModal";
import { confirmAction } from "@/utils/confirm";

/**
 * 🎯 Client Component for Employees Page
 * 
 * Handles all interactive logic:
 * - State management
 * - Event handlers
 * - Modals
 * - CRUD operations (ready for API integration)
 * 
 * Receives initial data from Server Component via props
 */
export default function EmployeesClient({ initialEmployees = [] }) {
    // State Management
    const [employees, setEmployees] = useState(initialEmployees);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const [trashEmployees, setTrashEmployees] = useState([]);
    const [showTrashModal, setShowTrashModal] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (searchParams.get("action") === "add") {
            setSelectedEmployee(null);
            setShowModal(true);
            // Clean URL
            const params = new URLSearchParams(searchParams);
            params.delete("action");
            const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
            router.replace(newUrl, { scroll: false });
        }
    }, [searchParams, pathname, router]);

    /* ======================================================================
       CRUD Handlers (Ready for API Integration)
       ====================================================================== */

    const handleSave = async (data) => {
        /*
        try {
          if (selectedEmployee) {
            // Update existing
            const res = await api.put(`/employees/${selectedEmployee.id}`, data);
            const updatedEmployee = res.data;
    
            setEmployees((prev) =>
              prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
            );
          } else {
            // Create new
            const res = await api.post('/employees', data);
            const newEmployee = res.data;
    
            setEmployees((prev) => [newEmployee, ...prev]);
          }
          setShowModal(false);
          setSelectedEmployee(null);
        } catch (error) {
          console.error("Failed to save employee:", error);
          // Handle error (e.g., show toast)
        }
        */

        // 👇 TEMP: Local State Logic (Remove when API is ready)
        if (selectedEmployee) {
            // Update existing
            setEmployees((prev) =>
                prev.map((emp) =>
                    emp.id === selectedEmployee.id
                        ? { ...emp, ...data }
                        : emp
                )
            );
        } else {
            // Create new
            const newEmployee = {
                id: Date.now(),
                ...data,
                created_at: new Date().toISOString().split("T")[0],
            };
            setEmployees((prev) => [newEmployee, ...prev]);
        }
        setShowModal(false);
        setSelectedEmployee(null);
    };

    /**
     * Open edit modal with selected employee
     */
    const handleEdit = (id) => {
        const employee = employees.find((e) => e.id === id);
        if (employee) {
            setSelectedEmployee(employee);
            setShowModal(true);
        }
    };

    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "This employee will be moved to the recycle bin.",
            confirmLabel: "Yes, Move it",
            onConfirm: async () => {
                /*
                try {
                   await api.delete(`/employees/${id}`); // Assuming delete moves to trash
                   
                   // If backend returns the deleted item or we need to refetch:
                   // const employeeToDelete = employees.find((e) => e.id === id);
                   // setTrashEmployees((prev) => [employeeToDelete, ...prev]); // optimistic update if needed
                   
                   setEmployees((prev) => prev.filter((e) => e.id !== id));
                } catch (error) {
                   console.error("Failed to delete employee:", error);
                }
                */

                // 👇 TEMP: Local State Logic
                const employeeToDelete = employees.find((e) => e.id === id);
                if (employeeToDelete) {
                    setTrashEmployees((prev) => [employeeToDelete, ...prev]);
                    setEmployees((prev) => prev.filter((e) => e.id !== id));
                }
            }
        });
    };

    const handleRestore = async (id) => {
        /*
        try {
          await api.patch(`/employees/${id}/restore`); 
          
          const employeeToRestore = trashEmployees.find((e) => e.id === id);
          if (employeeToRestore) {
            setEmployees((prev) => [employeeToRestore, ...prev]);
            setTrashEmployees((prev) => prev.filter((e) => e.id !== id));
          }
        } catch (error) {
          console.error("Failed to restore employee:", error);
        }
        */

        // 👇 TEMP: Local State Logic
        const employeeToRestore = trashEmployees.find((e) => e.id === id);
        if (employeeToRestore) {
            setEmployees((prev) => [employeeToRestore, ...prev]);
            setTrashEmployees((prev) => prev.filter((e) => e.id !== id));
        }
    };

    const handlePermanentDelete = async (id) => {
        /*
        try {
          await api.delete(`/employees/${id}/permanent`);
          setTrashEmployees((prev) => prev.filter((e) => e.id !== id));
        } catch (error) {
           console.error("Failed to permanently delete employee:", error);
        }
        */

        // 👇 TEMP: Local State Logic
        setTrashEmployees((prev) => prev.filter((e) => e.id !== id));
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;

        confirmAction({
            title: "Delete Selected Items?",
            message: `Are you sure you want to move ${selectedIds.length} items to trash?`,
            confirmLabel: "Yes, Delete",
            onConfirm: async () => {
                /*
                try {
                  await api.post('/employees/bulk-delete', { ids: selectedIds });
                  
                  const itemsToDelete = employees.filter(e => selectedIds.includes(e.id));
                  setTrashEmployees(prev => [...itemsToDelete, ...prev]);
                  setEmployees(prev => prev.filter(e => !selectedIds.includes(e.id)));
                  setSelectedIds([]);
                } catch (error) {
                  console.error("Failed to bulk delete:", error);
                }
                */

                // 👇 TEMP: Local State Logic
                const itemsToDelete = employees.filter(e => selectedIds.includes(e.id));
                setTrashEmployees(prev => [...itemsToDelete, ...prev]);
                setEmployees(prev => prev.filter(e => !selectedIds.includes(e.id)));
                setSelectedIds([]);
            }
        });
    };

    /* ======================================================================
       Render
       ====================================================================== */

    return (
        <>
            <PageHeader
                title="Employees"
                icon="fal fa-users"
                titleCol="col-lg-4"
                actionCol="col-lg-8"
                onFilterChange={(field, checked) =>
                    console.log("Filter:", field, checked)
                }
            >
                {/* Add Button */}
                <button
                    type="button"
                    className="alert alert-success rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
                    onClick={() => {
                        setSelectedEmployee(null);
                        setShowModal(true);
                    }}
                >
                    <i className="fal fa-plus"></i>
                    <span className="txt ms-2">Add Employee</span>
                </button>

                {/* Delete Button */}
                <button
                    type="button"
                    className="alert alert-danger rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
                    onClick={handleBulkDelete}
                >
                    <i className="fal fa-trash"></i>
                    <span className="txt ms-2">Delete ({selectedIds.length})</span>
                </button>

                {/* View Trash Button */}
                <button
                    type="button"
                    className="alert alert-secondary rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
                    onClick={() => setShowTrashModal(true)}
                >
                    <i className="fal fa-trash-undo"></i>
                    <span className="txt ms-2">View Trash ({trashEmployees.length})</span>
                </button>
            </PageHeader>

            {/* Page Content */}
            <div className="mt-4">
                <EmployeesTable
                    data={employees}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* Add/Edit Modal */}
            <EmployeeModal
                show={showModal}
                employee={selectedEmployee}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
            />

            {/* Trash Modal */}
            <TrashModal
                show={showTrashModal}
                trashEmployees={trashEmployees}
                onClose={() => setShowTrashModal(false)}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
            />
        </>
    );
}
