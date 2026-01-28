"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import CategoriesTable from "@/components/dashboard/categories/CategoriesTable";
import CategoryModal from "@/components/dashboard/categories/CategoryModal";
import TrashModal from "@/components/dashboard/categories/TrashModal";
import { confirmAction } from "@/utils/confirm";

export default function CategoriesClient({ initialCategories = [] }) {
    const [categories, setCategories] = useState(initialCategories);
    const [selectedIds, setSelectedIds] = useState([]);

    // Modals state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTrashOpen, setIsTrashOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Trash State
    const [trashCategories, setTrashCategories] = useState([]);

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

    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "This category will be moved to the recycle bin.",
            confirmLabel: "Yes, Move it",
            onConfirm: () => {
                const categoryToDelete = categories.find((c) => c.id === id);
                if (categoryToDelete) {
                    setTrashCategories((prev) => [categoryToDelete, ...prev]);
                    setCategories((prev) => prev.filter((c) => c.id !== id));
                    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
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
                const itemsToDelete = categories.filter(c => selectedIds.includes(c.id));
                setTrashCategories(prev => [...itemsToDelete, ...prev]);
                setCategories(prev => prev.filter(c => !selectedIds.includes(c.id)));
                setSelectedIds([]);
            }
        });
    };

    const handleSave = (categoryData) => {
        if (editingCategory) {
            setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...categoryData } : c));
        } else {
            const newCategory = {
                ...categoryData,
                id: Math.max(0, ...categories.map(c => c.id)) + 1,
                created_at: new Date().toISOString().split('T')[0]
            };
            setCategories(prev => [newCategory, ...prev]);
        }
        setIsModalOpen(false);
    };

    const handleRestore = (id) => {
        const categoryToRestore = trashCategories.find((c) => c.id === id);
        if (categoryToRestore) {
            setCategories((prev) => [categoryToRestore, ...prev]);
            setTrashCategories((prev) => prev.filter((c) => c.id !== id));
        }
    };

    const handlePermanentDelete = (id) => {
        setTrashCategories((prev) => prev.filter((c) => c.id !== id));
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

            <CategoriesTable
                data={categories}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onEdit={handleEditModal}
                onDelete={handleDelete}
            />

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
        </>
    );
}
