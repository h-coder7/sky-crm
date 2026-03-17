"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import SectorsTable from "@/components/dashboard/sectors/SectorsTable";
import api from "@/app/api/api"; // 🔌 Import axios instance
import SectorModal from "@/components/dashboard/sectors/SectorModal";
import TrashModal from "@/components/dashboard/sectors/TrashModal";
import { confirmAction } from "@/utils/confirm";
import { toast } from "react-hot-toast";
import SectorDetailsOffcanvas from "@/components/dashboard/sectors/SectorDetailsOffcanvas";

import {
    useSectors,
    useAddSector,
    useUpdateSector,
    useDeleteSector,
    useBulkDeleteSectors
} from "@/hooks/useSectors";

/**
 * 🎯 Client Component for Sectors Page
 * 
 * Handles all interactive logic:
 * - State management (via SectorsContext)
 * - Event handlers
 * - Modals
 * - CRUD operations (ready for API integration)
 */
export default function SectorsClient() {
    const { data: sectors = [], isLoading } = useSectors();
    const addSector = useAddSector();
    const updateSector = useUpdateSector();
    const deleteSector = useDeleteSector();
    const bulkDeleteSectors = useBulkDeleteSectors();

    const [selectedSector, setSelectedSector] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    // Offcanvas State for View Details
    const [viewSector, setViewSector] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const [trashSectors, setTrashSectors] = useState([]);
    const [showTrashModal, setShowTrashModal] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (searchParams.get("action") === "add") {
            setSelectedSector(null);
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
        if (selectedSector) {
            updateSector.mutate({ ...selectedSector, ...data }, {
                onSuccess: () => {
                    setShowModal(false);
                    setSelectedSector(null);
                }
            });
        } else {
            addSector.mutate(data, {
                onSuccess: () => {
                    setShowModal(false);
                    setSelectedSector(null);
                }
            });
        }
    };

    const handleEdit = (id) => {
        const sector = sectors.find((s) => s.id === id);
        if (sector) {
            setSelectedSector(sector);
            setShowModal(true);
        }
    };

    /**
     * Open details offcanvas
     */
    const handleView = (sector) => {
        setViewSector(sector);
        setShowOffcanvas(true);
    };

    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "This sector will be moved to the recycle bin.",
            confirmLabel: "Yes, Move it",
            onConfirm: async () => {
                const sectorToDelete = sectors.find((s) => s.id === id);
                if (sectorToDelete) {
                    deleteSector.mutate(id, {
                        onSuccess: () => {
                            setTrashSectors((prev) => [sectorToDelete, ...prev]);
                        }
                    });
                }
            }
        });
    };

    const handleRestore = async (id) => {
        const sectorToRestore = trashSectors.find((s) => s.id === id);
        if (sectorToRestore) {
            addSector.mutate(sectorToRestore, {
                onSuccess: () => {
                    setTrashSectors((prev) => prev.filter((s) => s.id !== id));
                    toast.success("Sector restored successfully!");
                }
            });
        }
    };

    const handlePermanentDelete = async (id) => {
        setTrashSectors((prev) => prev.filter((s) => s.id !== id));
        toast.success("Sector permanently deleted!");
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;

        confirmAction({
            title: "Delete Selected Items?",
            message: `Are you sure you want to move ${selectedIds.length} items to trash?`,
            confirmLabel: "Yes, Delete",
            onConfirm: async () => {
                const itemsToDelete = sectors.filter(s => selectedIds.includes(s.id));
                bulkDeleteSectors.mutate(selectedIds, {
                    onSuccess: () => {
                        setTrashSectors(prev => [...itemsToDelete, ...prev]);
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
                title="Sectors"
                icon="fal fa-layer-group"
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
            <SectorsTable
                data={sectors}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
            />

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

            {/* Details Offcanvas */}
            <SectorDetailsOffcanvas
                show={showOffcanvas}
                sector={viewSector}
                onClose={() => {
                    setShowOffcanvas(false);
                    setViewSector(null);
                }}
            />
        </>
    );
}
