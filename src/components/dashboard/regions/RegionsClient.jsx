"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import RegionsTable from "@/components/dashboard/regions/RegionsTable";
import RegionModal from "@/components/dashboard/regions/RegionModal";
import RegionsTrashModal from "@/components/dashboard/regions/RegionsTrashModal";
import { confirmAction } from "@/utils/confirm";
import { toast } from "react-hot-toast";

import {
    useRegions,
    useTrashRegions,
    useAddRegion,
    useUpdateRegion,
    useDeleteRegion,
    useRestoreRegion,
    usePermanentDeleteRegion,
    useBulkDeleteRegions
} from "@/hooks/useRegions";

export default function RegionsClient() {
    const { data: regions = [], isLoading } = useRegions();
    const { data: trashRegions = [] } = useTrashRegions();

    const addRegionMutation = useAddRegion();
    const updateRegionMutation = useUpdateRegion();
    const deleteRegionMutation = useDeleteRegion();
    const restoreRegionMutation = useRestoreRegion();
    const permanentDeleteMutation = usePermanentDeleteRegion();
    const bulkDeleteMutation = useBulkDeleteRegions();

    const [selectedRegion, setSelectedRegion] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showTrashModal, setShowTrashModal] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (searchParams.get("action") === "add") {
            setSelectedRegion(null);
            setShowModal(true);
            // Clean URL
            const params = new URLSearchParams(searchParams);
            params.delete("action");
            const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
            router.replace(newUrl, { scroll: false });
        }
    }, [searchParams, pathname, router]);

    const handleSave = async (data) => {
        if (selectedRegion) {
            await updateRegionMutation.mutateAsync({ ...selectedRegion, ...data });
        } else {
            await addRegionMutation.mutateAsync(data);
        }
        setShowModal(false);
        setSelectedRegion(null);
    };

    const handleEdit = (id) => {
        const region = regions.find((r) => r.id === id);
        if (region) {
            setSelectedRegion(region);
            setShowModal(true);
        }
    };

    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "This region will be moved to the recycle bin.",
            confirmLabel: "Yes, Move it",
            onConfirm: async () => {
                await deleteRegionMutation.mutateAsync(id);
            }
        });
    };

    const handleRestore = async (id) => {
        await restoreRegionMutation.mutateAsync(id);
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

    return (
        <>
            <PageHeader
                title="Regions"
                icon="fal fa-map-location-dot"
                titleCol="col-lg-4"
                actionCol="col-lg-8"
            >
                <button
                    type="button"
                    className="alert alert-success rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
                    onClick={() => {
                        setSelectedRegion(null);
                        setShowModal(true);
                    }}
                >
                    <i className="fal fa-plus"></i>
                    <span className="txt ms-2">Add Region</span>
                </button>

                <button
                    type="button"
                    className="alert alert-danger rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
                    onClick={handleBulkDelete}
                >
                    <i className="fal fa-trash"></i>
                    <span className="txt ms-2">Delete ({selectedIds.length})</span>
                </button>

                <button
                    type="button"
                    className="alert alert-secondary rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
                    onClick={() => setShowTrashModal(true)}
                >
                    <i className="fal fa-trash-undo"></i>
                    <span className="txt ms-2">View Trash ({trashRegions.length})</span>
                </button>
            </PageHeader>

            {isLoading ? (
                <div className="text-center py-5 text-muted">Loading regions...</div>
            ) : (
                <RegionsTable
                    data={regions}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <RegionModal
                show={showModal}
                region={selectedRegion}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
            />

            <RegionsTrashModal
                show={showTrashModal}
                trashRegions={trashRegions}
                onClose={() => setShowTrashModal(false)}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
            />
        </>
    );
}
