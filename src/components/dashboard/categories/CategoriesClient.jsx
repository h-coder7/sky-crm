"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import CategoriesTable from "@/components/dashboard/categories/CategoriesTable";
import api from "@/app/api/api"; // 🔌 Import axios instance
import CategoryModal from "@/components/dashboard/categories/CategoryModal";
import TrashModal from "@/components/dashboard/categories/TrashModal";
import { confirmAction } from "@/utils/confirm";

/**
 * 🎯 Client Component for Categories Page
 * 
 * Handles all interactive logic:
 * - State management
 * - Event handlers
 * - Modals
 * - CRUD operations (ready for API integration)
 * 
 * Receives initial data from Server Component via props
 */
export default function CategoriesClient({ initialCategories = [] }) {
  // State Management
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [trashCategories, setTrashCategories] = useState([]);
  const [showTrashModal, setShowTrashModal] = useState(false);

  /* ======================================================================
     CRUD Handlers (Ready for API Integration)
     ====================================================================== */

  /**
   * 🔌 API READY: Replace with POST/PUT request
   */
  /**
   * 🔌 API READY: Replace with POST/PUT request
   */
  const handleSave = async (data) => {
    /*
    try {
      if (selectedCategory) {
        // Update existing
        const res = await api.put(`/categories/${selectedCategory.id}`, data);
        const updatedCategory = res.data;

        setCategories((prev) =>
          prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
        );
      } else {
        // Create new
        const res = await api.post('/categories', data);
        const newCategory = res.data;

        setCategories((prev) => [newCategory, ...prev]);
      }
      setShowModal(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Failed to save category:", error);
      // Handle error (e.g., show toast)
    }
    */
    
    // 👇 TEMP: Local State Logic (Remove when API is ready)
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

  /**
   * Open edit modal with selected category
   */
  const handleEdit = (id) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setSelectedCategory(category);
      setShowModal(true);
    }
  };

  /**
   * 🔌 API READY: Replace with DELETE request (soft delete)
   */
  /**
   * 🔌 API READY: Replace with DELETE request (soft delete)
   */
  const handleDelete = (id) => {
    confirmAction({
      title: "Move to Trash?",
      message: "This category will be moved to the recycle bin.",
      confirmLabel: "Yes, Move it",
      onConfirm: async () => {
        /*
        try {
           await api.delete(`/categories/${id}`); // Assuming delete moves to trash
           
           // If backend returns the deleted item or we need to refetch:
           // const categoryToDelete = categories.find((c) => c.id === id);
           // setTrashCategories((prev) => [categoryToDelete, ...prev]); // optimistic update if needed
           
           setCategories((prev) => prev.filter((c) => c.id !== id));
        } catch (error) {
           console.error("Failed to delete category:", error);
        }
        */

        // 👇 TEMP: Local State Logic
        const categoryToDelete = categories.find((c) => c.id === id);
        if (categoryToDelete) {
          setTrashCategories((prev) => [categoryToDelete, ...prev]);
          setCategories((prev) => prev.filter((c) => c.id !== id));
        }
      }
    });
  };

  /**
   * 🔌 API READY: Replace with PATCH/PUT request (restore)
   */
  /**
   * 🔌 API READY: Replace with PATCH/PUT request (restore)
   */
  const handleRestore = async (id) => {
    /*
    try {
      await api.patch(`/categories/${id}/restore`); 
      
      const categoryToRestore = trashCategories.find((c) => c.id === id);
      if (categoryToRestore) {
        setCategories((prev) => [categoryToRestore, ...prev]);
        setTrashCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to restore category:", error);
    }
    */
    
    // 👇 TEMP: Local State Logic
    const categoryToRestore = trashCategories.find((c) => c.id === id);
    if (categoryToRestore) {
      setCategories((prev) => [categoryToRestore, ...prev]);
      setTrashCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  /**
   * 🔌 API READY: Replace with DELETE request (permanent delete)
   */
  /**
   * 🔌 API READY: Replace with DELETE request (permanent delete)
   */
  const handlePermanentDelete = async (id) => {
    /*
    try {
      await api.delete(`/categories/${id}/permanent`);
      setTrashCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
       console.error("Failed to permanently delete category:", error);
    }
    */

    // 👇 TEMP: Local State Logic
    setTrashCategories((prev) => prev.filter((c) => c.id !== id));
  };

  /**
   * 🔌 API READY: Replace with bulk DELETE request
   */
  /**
   * 🔌 API READY: Replace with bulk DELETE request
   */
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    
    confirmAction({
      title: "Delete Selected Items?",
      message: `Are you sure you want to move ${selectedIds.length} items to trash?`,
      confirmLabel: "Yes, Delete",
      onConfirm: async () => {
        /*
        try {
          await api.post('/categories/bulk-delete', { ids: selectedIds });
          
          const itemsToDelete = categories.filter(c => selectedIds.includes(c.id));
          setTrashCategories(prev => [...itemsToDelete, ...prev]);
          setCategories(prev => prev.filter(c => !selectedIds.includes(c.id)));
          setSelectedIds([]);
        } catch (error) {
          console.error("Failed to bulk delete:", error);
        }
        */
        
        // 👇 TEMP: Local State Logic
        const itemsToDelete = categories.filter(c => selectedIds.includes(c.id));
        setTrashCategories(prev => [...itemsToDelete, ...prev]);
        setCategories(prev => prev.filter(c => !selectedIds.includes(c.id)));
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
