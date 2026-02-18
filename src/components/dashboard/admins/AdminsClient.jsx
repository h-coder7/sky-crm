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

export default function AdminsClient({ initialAdmins = [] }) {
    const [admins, setAdmins] = useState(initialAdmins);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const [trashAdmins, setTrashAdmins] = useState([]);
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
        /*
        if (selectedAdmin) {
            const res = await api.put(`/admins/${selectedAdmin.id}`, data);
            setAdmins(prev =>
                prev.map(admin =>
                    admin.id === res.data.id ? res.data : admin
                )
            );
        } else {
            const res = await api.post("/admins", data);
            setAdmins(prev => [res.data, ...prev]);
        }
        */

        // TEMP: Local state until API is connected
        if (selectedAdmin) {
            setAdmins(prev =>
                prev.map(admin =>
                    admin.id === selectedAdmin.id
                        ? { ...admin, ...data }
                        : admin
                )
            );
            toast.success("Admin updated successfully!");
        } else {
            const newAdmin = {
                id: Date.now(),
                ...data,
                created_at: new Date().toISOString().split("T")[0],
            };
            setAdmins(prev => [newAdmin, ...prev]);
            toast.success("Admin added successfully!");
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
                /*
                await api.delete(`/admins/${id}`);
                */

                // TEMP: Local state
                const adminToDelete = admins.find(a => a.id === id);
                if (!adminToDelete) return;

                setTrashAdmins(prev => [adminToDelete, ...prev]);
                setAdmins(prev => prev.filter(a => a.id !== id));
                toast.success("Admin moved to trash!");
            }
        });
    };

    const handleRestore = async (id) => {
        /*
        await api.patch(`/admins/${id}/restore`);
        */

        const adminToRestore = trashAdmins.find(a => a.id === id);
        if (!adminToRestore) return;

        setAdmins(prev => [adminToRestore, ...prev]);
        setTrashAdmins(prev => prev.filter(a => a.id !== id));
        toast.success("Admin restored successfully!");
    };

    const handlePermanentDelete = async (id) => {
        /*
        await api.delete(`/admins/${id}/permanent`);
        */

        setTrashAdmins(prev => prev.filter(a => a.id !== id));
        toast.success("Admin permanently deleted!");
    };

    const handleBulkDelete = () => {
        if (!selectedIds.length) return;

        confirmAction({
            title: "Delete Selected Items?",
            message: `Are you sure you want to move ${selectedIds.length} items to trash?`,
            confirmLabel: "Yes, Delete",
            onConfirm: async () => {
                /*
                await api.post("/admins/bulk-delete", { ids: selectedIds });
                */

                const itemsToDelete = admins.filter(a =>
                    selectedIds.includes(a.id)
                );

                setTrashAdmins(prev => [...itemsToDelete, ...prev]);
                setAdmins(prev =>
                    prev.filter(a => !selectedIds.includes(a.id))
                );
                setSelectedIds([]);
                toast.success(`${itemsToDelete.length} admins moved to trash!`);
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
