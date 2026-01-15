"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import EmployeesTable from "@/components/dashboard/employees/EmployeesTable";
import EmployeeModal from "@/components/dashboard/employees/EmployeeModal";
import TrashModal from "@/components/dashboard/employees/TrashModal";
import { confirmAction } from "@/utils/confirm";

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

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [selectedIds, setSelectedIds] = useState([]);
  const [trashEmployees, setTrashEmployees] = useState([]);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleSave = (data) => {
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
      onConfirm: () => {
        const employeeToDelete = employees.find((e) => e.id === id);
        if (employeeToDelete) {
            setTrashEmployees((prev) => [employeeToDelete, ...prev]);
            setEmployees((prev) => prev.filter((e) => e.id !== id));
        }
      }
    });
  };

  const handleRestore = (id) => {
    const employeeToRestore = trashEmployees.find((e) => e.id === id);
    if (employeeToRestore) {
      setEmployees((prev) => [employeeToRestore, ...prev]);
      setTrashEmployees((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handlePermanentDelete = (id) => {
    setTrashEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const handleBulkDelete = () => {
      if (selectedIds.length === 0) return;
      confirmAction({
        title: "Delete Selected Employees?",
        message: `Are you sure you want to move ${selectedIds.length} employees to trash?`,
        confirmLabel: "Yes, Delete",
        onConfirm: () => {
          const itemsToDelete = employees.filter(e => selectedIds.includes(e.id));
          setTrashEmployees(prev => [...itemsToDelete, ...prev]);
          setEmployees(prev => prev.filter(c => !selectedIds.includes(c.id)));
          setSelectedIds([]);
        }
      });
  };

  return (
    <>
      <PageHeader
        title="Employees"
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

      {/* Employee Modal */}
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
