"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import EmployeesTable from "@/components/dashboard/employees/EmployeesTable";
import api from "@/app/api/api"; // 🔌 Import axios instance
import EmployeeModal from "@/components/dashboard/employees/EmployeeModal";
import TrashModal from "@/components/dashboard/employees/TrashModal";
import EmployeeDetailsOffcanvas from "@/components/dashboard/employees/EmployeeDetailsOffcanvas";
import { confirmAction } from "@/utils/confirm";
import { toast } from "react-hot-toast";
import {
    useEmployees,
    useAddEmployee,
    useUpdateEmployee,
    useDeleteEmployee,
    useBulkDeleteEmployees
} from "@/hooks/useEmployees";

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
    const { data: employees = [], isLoading } = useEmployees();
    const addEmployee = useAddEmployee();
    const updateEmployee = useUpdateEmployee();
    const deleteEmployee = useDeleteEmployee();
    const bulkDeleteEmployees = useBulkDeleteEmployees();

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const [trashEmployees, setTrashEmployees] = useState([]);
    const [showTrashModal, setShowTrashModal] = useState(false);

    const [viewEmployee, setViewEmployee] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

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
        if (selectedEmployee) {
            updateEmployee.mutate({ ...selectedEmployee, ...data }, {
                onSuccess: () => {
                    setShowModal(false);
                    setSelectedEmployee(null);
                }
            });
        } else {
            addEmployee.mutate(data, {
                onSuccess: () => {
                    setShowModal(false);
                    setSelectedEmployee(null);
                }
            });
        }
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
                const employeeToDelete = employees.find((e) => e.id === id);
                if (employeeToDelete) {
                    deleteEmployee.mutate(id, {
                        onSuccess: () => {
                            setTrashEmployees((prev) => [employeeToDelete, ...prev]);
                        }
                    });
                }
            }
        });
    };

    const handleRestore = async (id) => {
        const employeeToRestore = trashEmployees.find((e) => e.id === id);
        if (employeeToRestore) {
            addEmployee.mutate(employeeToRestore, {
                onSuccess: () => {
                    setTrashEmployees((prev) => prev.filter((e) => e.id !== id));
                    toast.success("Employee restored successfully!");
                }
            });
        }
    };

    const handlePermanentDelete = async (id) => {
        setTrashEmployees((prev) => prev.filter((e) => e.id !== id));
        toast.success("Employee permanently deleted!");
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;

        confirmAction({
            title: "Delete Selected Items?",
            message: `Are you sure you want to move ${selectedIds.length} items to trash?`,
            confirmLabel: "Yes, Delete",
            onConfirm: async () => {
                const itemsToDelete = employees.filter(e => selectedIds.includes(e.id));
                bulkDeleteEmployees.mutate(selectedIds, {
                    onSuccess: () => {
                        setTrashEmployees(prev => [...itemsToDelete, ...prev]);
                        setSelectedIds([]);
                    }
                });
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
                    onView={(emp) => {
                        setViewEmployee(emp);
                        setShowOffcanvas(true);
                    }}
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

            {/* Details Offcanvas */}
            <EmployeeDetailsOffcanvas
                show={showOffcanvas}
                employee={viewEmployee}
                onClose={() => {
                    setShowOffcanvas(false);
                    setViewEmployee(null);
                }}
            />
        </>
    );
}
