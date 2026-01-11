"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import CategoriesTable from "@/components/dashboard/categories/CategoriesTable";
import CategoryModal from "@/components/dashboard/categories/CategoryModal";
import TrashModal from "@/components/dashboard/categories/TrashModal";
import { confirmAction } from "@/utils/confirm";

const MOCK_CATEGORIES = [
  { id: 1, title: "Electronics", start_price: 100, created_at: "2025-08-12" },
  { id: 2, title: "Clothing", start_price: 50, created_at: "2025-07-20" },
  { id: 3, title: "Books", start_price: 20, created_at: "2025-06-05" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [trashCategories, setTrashCategories] = useState([]);
  const [showTrashModal, setShowTrashModal] = useState(false);

  const handleSave = (data) => {
    if (selectedCategory) {
      // Update existing
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory.id
            ? { ...cat, ...data, start_price: Number(data.start_price) }
            : cat
        )
      );
    } else {
      // Create new
      const newCategory = {
        id: Date.now(),
        title: data.title,
        start_price: Number(data.start_price),
        created_at: new Date().toISOString().split("T")[0],
      };
      setCategories((prev) => [newCategory, ...prev]);
    }
    setShowModal(false);
    setSelectedCategory(null);
  };

  const handleEdit = (id) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setSelectedCategory(category);
      setShowModal(true);
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
        }
      }
    });
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

  return (
    <>
      <PageHeader
        title="Categories"
        onFilterChange={(field, checked) =>
          console.log("Filter:", field, checked)
        }
      >
        {/* Add Button */}
        <button
          type="button"
          className="alert alert-success rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
          onClick={() => {
            setSelectedCategory(null);
            setShowModal(true);
          }}
        >
          <i className="fal fa-plus"></i>
          <span className="txt ms-2">Add Category</span>
        </button>

        {/* Delete Button */}
        <button
          type="button"
          className="alert alert-danger rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
          onClick={() => {
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
          }}
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
          <span className="txt ms-2">View Trash ({trashCategories.length})</span>
        </button>
      </PageHeader>

      {/* Page Content */}
      <div className="mt-4">
        <CategoriesTable
          data={categories}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add/Edit Modal */}
      <CategoryModal
        show={showModal}
        category={selectedCategory}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />

      {/* Trash Modal */}
      <TrashModal
        show={showTrashModal}
        trashCategories={trashCategories}
        onClose={() => setShowTrashModal(false)}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
      />
    </>
  );
}
