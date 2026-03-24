"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ProductsTable from "./ProductsTable";
import ProductModal from "./ProductModal";
import TrashModal from "./TrashModal";
import { confirmAction } from "@/utils/confirm";
import { toast } from "react-hot-toast";
import ProductDetailsOffcanvas from "./ProductDetailsOffcanvas";

import {
    useProducts,
    useTrashProducts,
    useAddProduct,
    useUpdateProduct,
    useDeleteProduct,
    useRestoreProduct,
    usePermanentDeleteProduct,
    useBulkDeleteProducts
} from "@/hooks/useProducts";

export default function ProductsClient() {
    const { data: products = [], isLoading } = useProducts();
    const { data: trashProducts = [] } = useTrashProducts();

    const addProductMutation = useAddProduct();
    const updateProductMutation = useUpdateProduct();
    const deleteProductMutation = useDeleteProduct();
    const restoreProductMutation = useRestoreProduct();
    const permanentDeleteMutation = usePermanentDeleteProduct();
    const bulkDeleteMutation = useBulkDeleteProducts();

    const [selectedIds, setSelectedIds] = useState([]);

    // Modals state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTrashOpen, setIsTrashOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Offcanvas State for View Details
    const [viewProduct, setViewProduct] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (searchParams.get("action") === "add") {
            setEditingProduct(null);
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

    /**
     * Open details offcanvas
     */
    const handleView = (product) => {
        setViewProduct(product);
        setShowOffcanvas(true);
    };

    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "This product will be moved to the recycle bin.",
            confirmLabel: "Yes, Move it",
            onConfirm: async () => {
                await deleteProductMutation.mutateAsync(id);
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

    const handleSave = async (productData) => {
        if (editingProduct) {
            await updateProductMutation.mutateAsync({ ...editingProduct, ...productData });
        } else {
            await addProductMutation.mutateAsync(productData);
        }
        setIsModalOpen(false);
    };

    const handleRestore = async (id) => {
        await restoreProductMutation.mutateAsync(id);
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
                title="Products"
                icon="fal fa-box"
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

            {isLoading ? (
                <div className="text-center py-5 text-muted">Loading products...</div>
            ) : (
                <ProductsTable
                    data={products}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onEdit={handleEditModal}
                    onDelete={handleDelete}
                    onView={handleView}
                />
            )}

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

            {/* Details Offcanvas */}
            <ProductDetailsOffcanvas
                show={showOffcanvas}
                product={viewProduct}
                onClose={() => {
                    setShowOffcanvas(false);
                    setViewProduct(null);
                }}
            />
        </>
    );
}
