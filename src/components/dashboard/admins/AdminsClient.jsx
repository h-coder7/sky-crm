"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import AdminsTable from "@/components/dashboard/admins/AdminsTable";
import api from "@/app/api/api";
import AdminModal from "@/components/dashboard/admins/AdminModal";
import TrashModal from "@/components/dashboard/admins/TrashModal";
import AdminDetailsOffcanvas from "@/components/dashboard/admins/AdminDetailsOffcanvas";
import { confirmAction } from "@/utils/confirm";
import { toast } from "react-hot-toast";

import { 
    useAdmins, 
    useTrashAdmins, 
    useAddAdmin, 
    useUpdateAdmin, 
    useDeleteAdmin, 
    useRestoreAdmin, 
    usePermanentDeleteAdmin, 
    useBulkDeleteAdmins 
} from "@/hooks/useAdmins";

export default function AdminsClient() {
    const { data: admins = [], isLoading } = useAdmins();
    const { data: trashAdmins = [] } = useTrashAdmins();

    const addAdminMutation = useAddAdmin();
    const updateAdminMutation = useUpdateAdmin();
    const deleteAdminMutation = useDeleteAdmin();
    const restoreAdminMutation = useRestoreAdmin();
    const permanentDeleteMutation = usePermanentDeleteAdmin();
    const bulkDeleteMutation = useBulkDeleteAdmins();

    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showTrashModal, setShowTrashModal] = useState(false);
    const [viewAdmin, setViewAdmin] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (searchParams.get("action") === "add") {
            setSelectedAdmin(null);
            setShowModal(true);

            const params = new URLSearchParams(searchParams);
            params.delete("action");
            const newUrl = params.toString()
                ? `${pathname}?${params.toString()}`
                : pathname;

            router.replace(newUrl, { scroll: false });
        }
    }, [searchParams, pathname, router]);

    const handleSave = async (data) => {
        if (selectedAdmin) {
            await updateAdminMutation.mutateAsync({ ...selectedAdmin, ...data });
        } else {
            await addAdminMutation.mutateAsync(data);
        }
        setShowModal(false);
        setSelectedAdmin(null);
    };

    const handleEdit = (id) => {
        const admin = admins.find(a => a.id === id);
        if (!admin) return;

        setSelectedAdmin(admin);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "This admin will be moved to the recycle bin.",
            confirmLabel: "Yes, Move it",
            onConfirm: async () => {
                await deleteAdminMutation.mutateAsync(id);
            }
        });
    };

    const handleRestore = async (id) => {
        await restoreAdminMutation.mutateAsync(id);
    };

    const handlePermanentDelete = async (id) => {
        await permanentDeleteMutation.mutateAsync(id);
    };

    const handleBulkDelete = () => {
        if (!selectedIds.length) return;

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
                title="Admins"
                icon="fal fa-user-tie"
                titleCol="col-lg-4"
                actionCol="col-lg-8"
                onFilterChange={(field, checked) =>
                    console.log("Filter:", field, checked)
                }
            >
                <button
                    type="button"
                    className="alert alert-success rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
                    onClick={() => {
                        setSelectedAdmin(null);
                        setShowModal(true);
                    }}
                >
                    <i className="fal fa-plus"></i>
                    <span className="txt ms-2">Add Admin</span>
                </button>

                <button
                    type="button"
                    className="alert alert-danger rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
                    onClick={handleBulkDelete}
                >
                    <i className="fal fa-trash"></i>
                    <span className="txt ms-2">
                        Delete ({selectedIds.length})
                    </span>
                </button>

                <button
                    type="button"
                    className="alert alert-secondary rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
                    onClick={() => setShowTrashModal(true)}
                >
                    <i className="fal fa-trash-undo"></i>
                    <span className="txt ms-2">
                        View Trash ({trashAdmins.length})
                    </span>
                </button>
            </PageHeader>

            <div className="mt-4">
                {isLoading ? (
                    <div className="text-center py-5 text-muted">Loading admins...</div>
                ) : (
                    <AdminsTable
                        data={admins}
                        selectedIds={selectedIds}
                        onSelectionChange={setSelectedIds}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={(admin) => {
                            setViewAdmin(admin);
                            setShowOffcanvas(true);
                        }}
                    />
                )}
            </div>

            <AdminModal
                show={showModal}
                admin={selectedAdmin}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
            />

            <TrashModal
                show={showTrashModal}
                trashAdmins={trashAdmins}
                onClose={() => setShowTrashModal(false)}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
            />

            <AdminDetailsOffcanvas
                show={showOffcanvas}
                admin={viewAdmin}
                onClose={() => {
                    setShowOffcanvas(false);
                    setViewAdmin(null);
                }}
            />
        </>
    );
}
