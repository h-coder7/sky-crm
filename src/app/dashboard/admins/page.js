"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import AdminsTable from "@/components/dashboard/admins/AdminsTable";
import AdminModal from "@/components/dashboard/admins/AdminModal";
import TrashModal from "@/components/dashboard/admins/TrashModal";
import { confirmAction } from "@/utils/confirm";

const MOCK_ADMINS = [
  { 
    id: 1, 
    name: "John Doe", 
    email: "john@example.com", 
    phone: "+1234567890", 
    role: "Super Admin", 
    created_at: "2025-01-15",
    image: "/images/profile.svg"
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    email: "jane@example.com", 
    phone: "+1987654321", 
    role: "Admin", 
    created_at: "2025-02-20",
    image: "/images/profile.svg" 
  },
  { 
    id: 3, 
    name: "Mike Johnson", 
    email: "mike@example.com", 
    phone: "+1122334455", 
    role: "Sub Admin", 
    created_at: "2025-03-10",
    image: "/images/profile.svg"
  },
];

export default function AdminsPage() {
  const [admins, setAdmins] = useState(MOCK_ADMINS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [trashAdmins, setTrashAdmins] = useState([]);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const handleSave = (data) => {
    if (selectedAdmin) {
      // Update existing
      setAdmins((prev) =>
        prev.map((admin) =>
          admin.id === selectedAdmin.id
            ? { ...admin, ...data }
            : admin
        )
      );
    } else {
      // Create new
      const newAdmin = {
        id: Date.now(),
        ...data,
        created_at: new Date().toISOString().split("T")[0],
      };
      setAdmins((prev) => [newAdmin, ...prev]);
    }
    setShowModal(false);
    setSelectedAdmin(null);
  };

  const handleEdit = (id) => {
    const admin = admins.find((a) => a.id === id);
    if (admin) {
        setSelectedAdmin(admin);
        setShowModal(true);
    }
  };

  const handleDelete = (id) => {
    confirmAction({
      title: "Move to Trash?",
      message: "This admin will be moved to the recycle bin.",
      confirmLabel: "Yes, Move it",
      onConfirm: () => {
        const adminToDelete = admins.find((a) => a.id === id);
        if (adminToDelete) {
            setTrashAdmins((prev) => [adminToDelete, ...prev]);
            setAdmins((prev) => prev.filter((a) => a.id !== id));
        }
      }
    });
  };

  const handleRestore = (id) => {
    const adminToRestore = trashAdmins.find((a) => a.id === id);
    if (adminToRestore) {
      setAdmins((prev) => [adminToRestore, ...prev]);
      setTrashAdmins((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handlePermanentDelete = (id) => {
    setTrashAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  const handleBulkDelete = () => {
      if (selectedIds.length === 0) return;
      confirmAction({
        title: "Delete Selected Admins?",
        message: `Are you sure you want to move ${selectedIds.length} admins to trash?`,
        confirmLabel: "Yes, Delete",
        onConfirm: () => {
          const itemsToDelete = admins.filter(a => selectedIds.includes(a.id));
          setTrashAdmins(prev => [...itemsToDelete, ...prev]);
          setAdmins(prev => prev.filter(c => !selectedIds.includes(c.id)));
          setSelectedIds([]);
        }
      });
  };

  return (
    <>
      <PageHeader
        title="Admins"
        onFilterChange={(field, checked) =>
          console.log("Filter:", field, checked)
        }
      >
        {/* Add Button */}
        <button
          type="button"
          className="alert alert-success rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
          onClick={() => {
              setSelectedAdmin(null);
              setShowModal(true);
          }}
        >
          <i className="fal fa-plus"></i>
          <span className="txt ms-2">Add Admin</span>
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
          <span className="txt ms-2">View Trash ({trashAdmins.length})</span>
        </button>
      </PageHeader>

      {/* Page Content */}
      <div className="mt-4">
        <AdminsTable
          data={admins}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Admin Modal */}
      <AdminModal
        show={showModal}
        admin={selectedAdmin}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />

      {/* Trash Modal */}
      <TrashModal
        show={showTrashModal}
        trashAdmins={trashAdmins}
        onClose={() => setShowTrashModal(false)}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
      />
    </>
  );
}
