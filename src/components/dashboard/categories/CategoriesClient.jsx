"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import CategoriesTable from "@/components/dashboard/categories/CategoriesTable";
import CategoryModal from "@/components/dashboard/categories/CategoryModal";
import TrashModal from "@/components/dashboard/categories/TrashModal";
import { confirmAction } from "@/utils/confirm";
import { toast } from "react-hot-toast";
import CategoryDetailsOffcanvas from "./CategoryDetailsOffcanvas";

import {
    useCategories,
    useTrashCategories,
    useAddCategory,
    useUpdateCategory,
    useDeleteCategory,
    useRestoreCategory,
    usePermanentDeleteCategory,
    useBulkDeleteCategories
} from "@/hooks/useCategories";

export default function CategoriesClient() {
    const { data: categories = [], isLoading } = useCategories();
    const { data: trashCategories = [] } = useTrashCategories();

    const addCategoryMutation = useAddCategory();
    const updateCategoryMutation = useUpdateCategory();
    const deleteCategoryMutation = useDeleteCategory();
    const restoreCategoryMutation = useRestoreCategory();
    const permanentDeleteMutation = usePermanentDeleteCategory();
    const bulkDeleteMutation = useBulkDeleteCategories();

    const [selectedIds, setSelectedIds] = useState([]);

    // Modals state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTrashOpen, setIsTrashOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Offcanvas State for View Details
    const [viewCategory, setViewCategory] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (searchParams.get("action") === "add") {
            setEditingCategory(null);
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
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleEditModal = (id) => {
        const category = categories.find(c => c.id === id);
        if (category) {
            setEditingCategory(category);
            setIsModalOpen(true);
        }
    };

    /**
     * Open details offcanvas
     */
    const handleView = (category) => {
        setViewCategory(category);
        setShowOffcanvas(true);
    };

    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "This category will be moved to the recycle bin.",
            confirmLabel: "Yes, Move it",
            onConfirm: async () => {
                await deleteCategoryMutation.mutateAsync(id);
                setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
            }
        });
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

    const handleSave = async (categoryData) => {
        if (editingCategory) {
            await updateCategoryMutation.mutateAsync({ ...editingCategory, ...categoryData });
        } else {
            await addCategoryMutation.mutateAsync(categoryData);
        }
        setIsModalOpen(false);
    };

    const handleRestore = async (id) => {
        await restoreCategoryMutation.mutateAsync(id);
    };

    const handlePermanentDelete = async (id) => {
        await permanentDeleteMutation.mutateAsync(id);
    };

    /* ======================================================================
       2. JSX
       ====================================================================== */
    return (
        <>
            <PageHeader
                title="Categories"
                icon="fal fa-grid-2"
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
                    <span className="txt ms-2">Add Category</span>
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
                    <span className="txt ms-2">View Trash ({trashCategories.length})</span>
                </button>
            </PageHeader>

            {isLoading ? (
                <div className="text-center py-5 text-muted">Loading categories...</div>
            ) : (
                <CategoriesTable
                    data={categories}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onEdit={handleEditModal}
                    onDelete={handleDelete}
                    onView={handleView}
                />
            )}

            {/* Modals */}
            <CategoryModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                category={editingCategory}
            />

            <TrashModal
                show={isTrashOpen}
                onClose={() => setIsTrashOpen(false)}
                trashCategories={trashCategories}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
            />

            {/* Details Offcanvas */}
            <CategoryDetailsOffcanvas
                show={showOffcanvas}
                category={viewCategory}
                onClose={() => {
                    setShowOffcanvas(false);
                    setViewCategory(null);
                }}
            />
        </>
    );
}
