"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import ProductsTable from "@/components/dashboard/products/ProductsTable";
import api from "@/app/api/api"; // 🔌 Import axios instance
import ProductModal from "@/components/dashboard/products/ProductModal";
import TrashModal from "@/components/dashboard/products/TrashModal";
import { confirmAction } from "@/utils/confirm";

/**
 * 🎯 Client Component for Products Page
 * 
 * Handles all interactive logic:
 * - State management
 * - Event handlers
 * - Modals
 * - CRUD operations (ready for API integration)
 * 
 * Receives initial data from Server Component via props
 */
export default function ProductsClient({ initialProducts = [] }) {
  // State Management
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [trashProducts, setTrashProducts] = useState([]);
  const [showTrashModal, setShowTrashModal] = useState(false);

  /* ======================================================================
     CRUD Handlers (Ready for API Integration)
     ====================================================================== */

  const handleSave = async (data) => {
    /*
    try {
      if (selectedProduct) {
        // Update existing
        const res = await api.put(`/products/${selectedProduct.id}`, data);
        const updatedProduct = res.data;

        setProducts((prev) =>
          prev.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
        );
      } else {
        // Create new
        const res = await api.post('/products', data);
        const newProduct = res.data;

        setProducts((prev) => [newProduct, ...prev]);
      }
      setShowModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Failed to save product:", error);
      // Handle error (e.g., show toast)
    }
    */
    
    // 👇 TEMP: Local State Logic (Remove when API is ready)
    if (selectedProduct) {
      // Update existing
      setProducts((prev) =>
        prev.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, ...data }
            : product
        )
      );
    } else {
      // Create new
      const newProduct = {
        id: Date.now(),
        title: data.title,
        created_at: new Date().toISOString().split("T")[0],
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    setShowModal(false);
    setSelectedProduct(null);
  };

  /**
   * Open edit modal with selected product
   */
  const handleEdit = (id) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setShowModal(true);
    }
  };

  const handleDelete = (id) => {
    confirmAction({
      title: "Move to Trash?",
      message: "This product will be moved to the recycle bin.",
      confirmLabel: "Yes, Move it",
      onConfirm: async () => {
        /*
        try {
           await api.delete(`/products/${id}`); // Assuming delete moves to trash
           
           setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
           console.error("Failed to delete product:", error);
        }
        */

        // 👇 TEMP: Local State Logic
        const productToDelete = products.find((p) => p.id === id);
        if (productToDelete) {
          setTrashProducts((prev) => [productToDelete, ...prev]);
          setProducts((prev) => prev.filter((p) => p.id !== id));
        }
      }
    });
  };

  const handleRestore = async (id) => {
    /*
    try {
      await api.patch(`/products/${id}/restore`); 
      
      const productToRestore = trashProducts.find((p) => p.id === id);
      if (productToRestore) {
        setProducts((prev) => [productToRestore, ...prev]);
        setTrashProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to restore product:", error);
    }
    */
    
    // 👇 TEMP: Local State Logic
    const productToRestore = trashProducts.find((p) => p.id === id);
    if (productToRestore) {
      setProducts((prev) => [productToRestore, ...prev]);
      setTrashProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handlePermanentDelete = async (id) => {
    /*
    try {
      await api.delete(`/products/${id}/permanent`);
      setTrashProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
       console.error("Failed to permanently delete product:", error);
    }
    */

    // 👇 TEMP: Local State Logic
    setTrashProducts((prev) => prev.filter((p) => p.id !== id));
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
          await api.post('/products/bulk-delete', { ids: selectedIds });
          
          const itemsToDelete = products.filter(p => selectedIds.includes(p.id));
          setTrashProducts(prev => [...itemsToDelete, ...prev]);
          setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
          setSelectedIds([]);
        } catch (error) {
          console.error("Failed to bulk delete:", error);
        }
        */
        
        // 👇 TEMP: Local State Logic
        const itemsToDelete = products.filter(p => selectedIds.includes(p.id));
        setTrashProducts(prev => [...itemsToDelete, ...prev]);
        setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
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
        title="Products"
        onFilterChange={(field, checked) =>
          console.log("Filter:", field, checked)
        }
      >
        {/* Add Button */}
        <button
          type="button"
          className="alert alert-success rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
          onClick={() => {
            setSelectedProduct(null);
            setShowModal(true);
          }}
        >
          <i className="fal fa-plus"></i>
          <span className="txt ms-2">Add Product</span>
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
          <span className="txt ms-2">View Trash ({trashProducts.length})</span>
        </button>
      </PageHeader>

      {/* Page Content */}
      <div className="table-content">
        <ProductsTable
          data={products}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add/Edit Modal */}
      <ProductModal
        show={showModal}
        product={selectedProduct}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />

      {/* Trash Modal */}
      <TrashModal
        show={showTrashModal}
        trashProducts={trashProducts}
        onClose={() => setShowTrashModal(false)}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
      />
    </>
  );
}
