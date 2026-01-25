"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import AdminsTable from "@/components/dashboard/admins/AdminsTable";
import api from "@/app/api/api"; // 🔌 Import axios instance
import AdminModal from "@/components/dashboard/admins/AdminModal";
import TrashModal from "@/components/dashboard/admins/TrashModal";
import { confirmAction } from "@/utils/confirm";

/**
 * 🎯 Client Component for Admins Page
 * 
 * Handles all interactive logic:
 * - State management
 * - Event handlers
 * - Modals
 * - CRUD operations (ready for API integration)
 * 
 * Receives initial data from Server Component via props
 */
export default function AdminsClient({ initialAdmins = [] }) {
    // State Management
    const [admins, setAdmins] = useState(initialAdmins);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const [trashAdmins, setTrashAdmins] = useState([]);
    const [showTrashModal, setShowTrashModal] = useState(false);

    /* ======================================================================
       CRUD Handlers (Ready for API Integration)
       ====================================================================== */

    const handleSave = async (data) => {
        /*
        try {
          if (selectedAdmin) {
            // Update existing
            const res = await api.put(`/admins/${selectedAdmin.id}`, data);
            const updatedAdmin = res.data;
    
            setAdmins((prev) =>
              prev.map((admin) => (admin.id === updatedAdmin.id ? updatedAdmin : admin))
            );
          } else {
            // Create new
            const res = await api.post('/admins', data);
            const newAdmin = res.data;
    
            setAdmins((prev) => [newAdmin, ...prev]);
          }
          setShowModal(false);
          setSelectedAdmin(null);
        } catch (error) {
          console.error("Failed to save admin:", error);
          // Handle error (e.g., show toast)
        }
        */

        // 👇 TEMP: Local State Logic (Remove when API is ready)
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

    /**
     * Open edit modal with selected admin
     */
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
            onConfirm: async () => {
                /*
                try {
                   await api.delete(`/admins/${id}`); // Assuming delete moves to trash
                   
                   // If backend returns the deleted item or we need to refetch:
                   // const adminToDelete = admins.find((a) => a.id === id);
                   // setTrashAdmins((prev) => [adminToDelete, ...prev]); // optimistic update if needed
                   
                   setAdmins((prev) => prev.filter((a) => a.id !== id));
                } catch (error) {
                   console.error("Failed to delete admin:", error);
                }
                */

                // 👇 TEMP: Local State Logic
                const adminToDelete = admins.find((a) => a.id === id);
                if (adminToDelete) {
                    setTrashAdmins((prev) => [adminToDelete, ...prev]);
                    setAdmins((prev) => prev.filter((a) => a.id !== id));
                }
            }
        });
    };

    const handleRestore = async (id) => {
        /*
        try {
          await api.patch(`/admins/${id}/restore`); 
          
          const adminToRestore = trashAdmins.find((a) => a.id === id);
          if (adminToRestore) {
            setAdmins((prev) => [adminToRestore, ...prev]);
            setTrashAdmins((prev) => prev.filter((a) => a.id !== id));
          }
        } catch (error) {
          console.error("Failed to restore admin:", error);
        }
        */

        // 👇 TEMP: Local State Logic
        const adminToRestore = trashAdmins.find((a) => a.id === id);
        if (adminToRestore) {
            setAdmins((prev) => [adminToRestore, ...prev]);
            setTrashAdmins((prev) => prev.filter((a) => a.id !== id));
        }
    };

    const handlePermanentDelete = async (id) => {
        /*
        try {
          await api.delete(`/admins/${id}/permanent`);
          setTrashAdmins((prev) => prev.filter((a) => a.id !== id));
        } catch (error) {
           console.error("Failed to permanently delete admin:", error);
        }
        */

        // 👇 TEMP: Local State Logic
        setTrashAdmins((prev) => prev.filter((a) => a.id !== id));
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
                  await api.post('/admins/bulk-delete', { ids: selectedIds });
                  
                  const itemsToDelete = admins.filter(a => selectedIds.includes(a.id));
                  setTrashAdmins(prev => [...itemsToDelete, ...prev]);
                  setAdmins(prev => prev.filter(a => !selectedIds.includes(a.id)));
                  setSelectedIds([]);
                } catch (error) {
                  console.error("Failed to bulk delete:", error);
                }
                */

                // 👇 TEMP: Local State Logic
                const itemsToDelete = admins.filter(a => selectedIds.includes(a.id));
                setTrashAdmins(prev => [...itemsToDelete, ...prev]);
                setAdmins(prev => prev.filter(a => !selectedIds.includes(a.id)));
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

            {/* Add/Edit Modal */}
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
