"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import TargetTable from "./TargetTable";
import TargetModal from "./TargetModal";
import TrashModal from "./TrashModal";
import { confirmAction } from "@/utils/confirm";
import { toast } from "react-hot-toast";

import {
    useTarget,
    useAddTarget,
    useUpdateTarget,
    useDeleteTarget,
    useBulkDeleteTargets
} from "@/hooks/useTarget";

export default function TargetClient() {
    const { data: targets = [], isLoading } = useTarget();
    const addTarget = useAddTarget();
    const updateTarget = useUpdateTarget();
    const deleteTarget = useDeleteTarget();
    const bulkDeleteTargets = useBulkDeleteTargets();

    const [selectedIds, setSelectedIds] = useState([]);

    // Modals state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTrashOpen, setIsTrashOpen] = useState(false);
    const [editingTarget, setEditingTarget] = useState(null);

    // Trash State
    const [trashTargets, setTrashTargets] = useState([]);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (searchParams.get("action") === "add") {
            setEditingTarget(null);
            setIsModalOpen(true);
            // Clean URL
            const params = new URLSearchParams(searchParams);
            params.delete("action");
            const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
            router.replace(newUrl, { scroll: false });
        }
    }, [searchParams, pathname, router]);

    /* ======================================================================
       1. Handlers
       ====================================================================== */
    const handleAddModal = () => {
        setEditingTarget(null);
        setIsModalOpen(true);
    };

    const handleEditModal = (id) => {
        const target = targets.find(t => t.id === id);
        if (target) {
            setEditingTarget(target);
            setIsModalOpen(true);
        }
    };

    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "This target will be moved to the recycle bin.",
            confirmLabel: "Yes, Move it",
            onConfirm: () => {
                const targetToDelete = targets.find((t) => t.id === id);
                if (targetToDelete) {
                    deleteTarget.mutate(id, {
                        onSuccess: () => {
                            setTrashTargets((prev) => [targetToDelete, ...prev]);
                            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
                        }
                    });
                }
            }
        });
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;

        confirmAction({
            title: "Delete Selected Items?",
            message: `Are you sure you want to move ${selectedIds.length} items to trash?`,
            confirmLabel: "Yes, Delete",
            onConfirm: () => {
                const itemsToDelete = targets.filter(t => selectedIds.includes(t.id));
                bulkDeleteTargets.mutate(selectedIds, {
                    onSuccess: () => {
                        setTrashTargets(prev => [...itemsToDelete, ...prev]);
                        setSelectedIds([]);
                    }
                });
            }
        });
    };

    const handleSave = (targetData) => {
        if (editingTarget) {
            updateTarget.mutate({ ...editingTarget, ...targetData }, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingTarget(null);
                }
            });
        } else {
            addTarget.mutate(targetData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingTarget(null);
                }
            });
        }
    };

    const handleRestore = (id) => {
        const targetToRestore = trashTargets.find((t) => t.id === id);
        if (targetToRestore) {
            addTarget.mutate(targetToRestore, {
                onSuccess: () => {
                    setTrashTargets((prev) => prev.filter((t) => t.id !== id));
                    toast.success("Target restored successfully!");
                }
            });
        }
    };

    const handlePermanentDelete = (id) => {
        setTrashTargets((prev) => prev.filter((t) => t.id !== id));
        toast.success("Target permanently deleted!");
    };

    /* ======================================================================
       2. JSX
       ====================================================================== */
    return (
        <>
            <PageHeader
                title="Target"
                icon="fal fa-bullseye-arrow"
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
                    onClick={handleAddModal}
                >
                    <i className="fal fa-plus"></i>
                    <span className="txt ms-2">Add Target</span>
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
                    onClick={() => setIsTrashOpen(true)}
                >
                    <i className="fal fa-trash-undo"></i>
                    <span className="txt ms-2">View Trash ({trashTargets.length})</span>
                </button>
            </PageHeader>

            <TargetTable
                data={targets}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onEdit={handleEditModal}
                onDelete={handleDelete}
            />

            {/* Modals */}
            <TargetModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                target={editingTarget}
            />

            <TrashModal
                show={isTrashOpen}
                onClose={() => setIsTrashOpen(false)}
                trashTargets={trashTargets}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
            />
        </>
    );
}
