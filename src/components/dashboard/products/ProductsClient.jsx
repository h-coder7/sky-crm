"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import ProductsTable from "./ProductsTable";
import ProductModal from "./ProductModal";
import TrashModal from "./TrashModal";
import { confirmAction } from "@/utils/confirm";

export default function ProductsClient({ initialProducts = [] }) {
    const [products, setProducts] = useState(initialProducts);
    const [selectedIds, setSelectedIds] = useState([]);

    // Modals state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTrashOpen, setIsTrashOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Trash State
    const [trashProducts, setTrashProducts] = useState([]);

    /* ======================================================================
       1. Handlers
       ====================================================================== */
    const handleAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditModal = (id) => {
        const product = products.find(p => p.id === id);
        if (product) {
            setEditingProduct(product);
            setIsModalOpen(true);
        }
    };

    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "This product will be moved to the recycle bin.",
            confirmLabel: "Yes, Move it",
            onConfirm: () => {
                const productToDelete = products.find((p) => p.id === id);
                if (productToDelete) {
                    setTrashProducts((prev) => [productToDelete, ...prev]);
                    setProducts((prev) => prev.filter((p) => p.id !== id));
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
                const itemsToDelete = products.filter(p => selectedIds.includes(p.id));
                setTrashProducts(prev => [...itemsToDelete, ...prev]);
                setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
                setSelectedIds([]);
            }
        });
    };

    const handleSave = (productData) => {
        if (editingProduct) {
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p));
        } else {
            const newProduct = {
                ...productData,
                id: Math.max(0, ...products.map(p => p.id)) + 1,
                created_at: new Date().toISOString().split('T')[0]
            };
            setProducts(prev => [newProduct, ...prev]);
        }
        setIsModalOpen(false);
    };

    const handleRestore = (id) => {
        const productToRestore = trashProducts.find((p) => p.id === id);
        if (productToRestore) {
            setProducts((prev) => [productToRestore, ...prev]);
            setTrashProducts((prev) => prev.filter((p) => p.id !== id));
        }
    };

    const handlePermanentDelete = (id) => {
        setTrashProducts((prev) => prev.filter((p) => p.id !== id));
    };

    /* ======================================================================
       2. JSX
       ====================================================================== */
    return (
        <>
            <PageHeader
                title="Products"
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
                    onClick={() => setIsTrashOpen(true)}
                >
                    <i className="fal fa-trash-undo"></i>
                    <span className="txt ms-2">View Trash ({trashProducts.length})</span>
                </button>
            </PageHeader>

            <ProductsTable
                data={products}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onEdit={handleEditModal}
                onDelete={handleDelete}
            />

            {/* Modals */}
            <ProductModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                product={editingProduct}
            />

            <TrashModal
                show={isTrashOpen}
                onClose={() => setIsTrashOpen(false)}
                trashProducts={trashProducts}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
            />
        </>
    );
}
