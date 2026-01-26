"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import SectorsTable from "@/components/dashboard/sectors/SectorsTable";
import api from "@/app/api/api"; // 🔌 Import axios instance
import SectorModal from "@/components/dashboard/sectors/SectorModal";
import TrashModal from "@/components/dashboard/sectors/TrashModal";
import { confirmAction } from "@/utils/confirm";

/**
 * 🎯 Client Component for Sectors Page
 * 
 * Handles all interactive logic:
 * - State management
 * - Event handlers
 * - Modals
 * - CRUD operations (ready for API integration)
 * 
 * Receives initial data from Server Component via props
 */
export default function SectorsClient({ initialSectors = [] }) {
    // State Management
    const [sectors, setSectors] = useState(initialSectors);
    const [selectedSector, setSelectedSector] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const [trashSectors, setTrashSectors] = useState([]);
    const [showTrashModal, setShowTrashModal] = useState(false);

    /* ======================================================================
       CRUD Handlers (Ready for API Integration)
       ====================================================================== */

    const handleSave = async (data) => {
        /*
        try {
          if (selectedSector) {
            // Update existing
            const res = await api.put(`/sectors/${selectedSector.id}`, data);
            const updatedSector = res.data;
    
            setSectors((prev) =>
              prev.map((sector) => (sector.id === updatedSector.id ? updatedSector : sector))
            );
          } else {
            // Create new
            const res = await api.post('/sectors', data);
            const newSector = res.data;
    
            setSectors((prev) => [newSector, ...prev]);
          }
          setShowModal(false);
          setSelectedSector(null);
        } catch (error) {
          console.error("Failed to save sector:", error);
          // Handle error (e.g., show toast)
        }
        */

        // 👇 TEMP: Local State Logic (Remove when API is ready)
        if (selectedSector) {
            // Update existing
            setSectors((prev) =>
                prev.map((sector) =>
                    sector.id === selectedSector.id
                        ? { ...sector, ...data }
                        : sector
                )
            );
        } else {
            // Create new
            const newSector = {
                id: Date.now(),
                title: data.title,
                description: data.description,
                created_at: new Date().toISOString().split("T")[0],
            };
            setSectors((prev) => [newSector, ...prev]);
        }
        setShowModal(false);
        setSelectedSector(null);
    };

    /**
     * Open edit modal with selected sector
     */
    const handleEdit = (id) => {
        const sector = sectors.find((s) => s.id === id);
        if (sector) {
            setSelectedSector(sector);
            setShowModal(true);
        }
    };

    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "This sector will be moved to the recycle bin.",
            confirmLabel: "Yes, Move it",
            onConfirm: async () => {
                /*
                try {
                   await api.delete(`/sectors/${id}`); // Assuming delete moves to trash
                   
                   // If backend returns the deleted item or we need to refetch:
                   // const sectorToDelete = sectors.find((s) => s.id === id);
                   // setTrashSectors((prev) => [sectorToDelete, ...prev]); // optimistic update if needed
                   
                   setSectors((prev) => prev.filter((s) => s.id !== id));
                } catch (error) {
                   console.error("Failed to delete sector:", error);
                }
                */

                // 👇 TEMP: Local State Logic
                const sectorToDelete = sectors.find((s) => s.id === id);
                if (sectorToDelete) {
                    setTrashSectors((prev) => [sectorToDelete, ...prev]);
                    setSectors((prev) => prev.filter((s) => s.id !== id));
                }
            }
        });
    };

    const handleRestore = async (id) => {
        /*
        try {
          await api.patch(`/sectors/${id}/restore`); 
          
          const sectorToRestore = trashSectors.find((s) => s.id === id);
          if (sectorToRestore) {
            setSectors((prev) => [sectorToRestore, ...prev]);
            setTrashSectors((prev) => prev.filter((s) => s.id !== id));
          }
        } catch (error) {
          console.error("Failed to restore sector:", error);
        }
        */

        // 👇 TEMP: Local State Logic
        const sectorToRestore = trashSectors.find((s) => s.id === id);
        if (sectorToRestore) {
            setSectors((prev) => [sectorToRestore, ...prev]);
            setTrashSectors((prev) => prev.filter((s) => s.id !== id));
        }
    };

    const handlePermanentDelete = async (id) => {
        /*
        try {
          await api.delete(`/sectors/${id}/permanent`);
          setTrashSectors((prev) => prev.filter((s) => s.id !== id));
        } catch (error) {
           console.error("Failed to permanently delete sector:", error);
        }
        */

        // 👇 TEMP: Local State Logic
        setTrashSectors((prev) => prev.filter((s) => s.id !== id));
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
                  await api.post('/sectors/bulk-delete', { ids: selectedIds });
                  
                  const itemsToDelete = sectors.filter(s => selectedIds.includes(s.id));
                  setTrashSectors(prev => [...itemsToDelete, ...prev]);
                  setSectors(prev => prev.filter(s => !selectedIds.includes(s.id)));
                  setSelectedIds([]);
                } catch (error) {
                  console.error("Failed to bulk delete:", error);
                }
                */

                // 👇 TEMP: Local State Logic
                const itemsToDelete = sectors.filter(s => selectedIds.includes(s.id));
                setTrashSectors(prev => [...itemsToDelete, ...prev]);
                setSectors(prev => prev.filter(s => !selectedIds.includes(s.id)));
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
                title="Sectors"
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
                        setSelectedSector(null);
                        setShowModal(true);
                    }}
                >
                    <i className="fal fa-plus"></i>
                    <span className="txt ms-2">Add Sector</span>
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
                    <span className="txt ms-2">View Trash ({trashSectors.length})</span>
                </button>
            </PageHeader>

            {/* Page Content */}
            <div className="table-content">
                <SectorsTable
                    data={sectors}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* Add/Edit Modal */}
            <SectorModal
                show={showModal}
                sector={selectedSector}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
            />

            {/* Trash Modal */}
            <TrashModal
                show={showTrashModal}
                trashSectors={trashSectors}
                onClose={() => setShowTrashModal(false)}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
            />
        </>
    );
}
