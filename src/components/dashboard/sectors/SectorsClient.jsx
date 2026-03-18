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
    useTrashSectors,
    useAddSector,
    useUpdateSector,
    useDeleteSector,
    useRestoreSector,
    usePermanentDeleteSector,
    useBulkDeleteSectors
} from "@/hooks/useSectors";

/**
 * 🎯 Client Component for Sectors Page
 */
export default function SectorsClient() {
    const { data: sectors = [], isLoading } = useSectors();
    const { data: trashSectors = [] } = useTrashSectors();

    const addSectorMutation = useAddSector();
    const updateSectorMutation = useUpdateSector();
    const deleteSectorMutation = useDeleteSector();
    const restoreSectorMutation = useRestoreSector();
    const permanentDeleteMutation = usePermanentDeleteSector();
    const bulkDeleteMutation = useBulkDeleteSectors();

    const [selectedSector, setSelectedSector] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    // Offcanvas State for View Details
    const [viewSector, setViewSector] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

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
            await updateSectorMutation.mutateAsync({ ...selectedSector, ...data });
        } else {
            await addSectorMutation.mutateAsync(data);
        }
        setShowModal(false);
        setSelectedSector(null);
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
                await deleteSectorMutation.mutateAsync(id);
                setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
            }
        });
    };

    const handleRestore = async (id) => {
        await restoreSectorMutation.mutateAsync(id);
    };

    const handlePermanentDelete = async (id) => {
        await permanentDeleteMutation.mutateAsync(id);
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;

        confirmAction({
            title: "Delete Selected Items?",
            message: `Are you sure you want to move ${selectedIds.length} items to trash?`,
            confirmLabel: "Yes, Delete",
            onConfirm: async () => {
                await bulkDeleteMutation.mutateAsync(selectedIds);
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
            {isLoading ? (
                <div className="text-center py-5 text-muted">Loading sectors...</div>
            ) : (
                <SectorsTable
                    data={sectors}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                />
            )}

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
