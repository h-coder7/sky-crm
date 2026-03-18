"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ContactListsTable from "@/components/dashboard/contact-lists/ContactListsTable";
import api from "@/app/api/api"; // 🔌 Import axios instance
import ContactListModal from "@/components/dashboard/contact-lists/ContactListModal";
import TrashModal from "@/components/dashboard/contact-lists/TrashModal";
import { confirmAction } from "@/utils/confirm";
import { toast } from "react-hot-toast";
import ContactDetailsOffcanvas from "@/components/dashboard/contact-lists/ContactDetailsOffcanvas";
import {
    useContactLists,
    useTrashContacts,
    useAddContact,
    useUpdateContact,
    useDeleteContact,
    useRestoreContact,
    usePermanentDeleteContact,
    useBulkDeleteContacts
} from "@/hooks/useContactLists";

/**
 * 🎯 Client Component for Contact Lists Page
 * 
 * Handles all interactive logic for comprehensive contact management
 */
export default function ContactListsClient() {
    // React Query Hooks
    const { data: contacts = [], isLoading } = useContactLists();
    const { data: trashContacts = [] } = useTrashContacts();

    const addMutation = useAddContact();
    const updateMutation = useUpdateContact();
    const deleteMutation = useDeleteContact();
    const restoreMutation = useRestoreContact();
    const permanentDeleteMutation = usePermanentDeleteContact();
    const bulkDeleteMutation = useBulkDeleteContacts();

    // Local UI State
    const [selectedContact, setSelectedContact] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const [showTrashModal, setShowTrashModal] = useState(false);

    const [viewContact, setViewContact] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (searchParams.get("action") === "add") {
            setSelectedContact(null);
            setShowModal(true);
            // Clean URL
            const params = new URLSearchParams(searchParams);
            params.delete("action");
            const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
            router.replace(newUrl, { scroll: false });
        }
    }, [searchParams, pathname, router]);

    /* ======================================================================
       CRUD Handlers (Ready for API Integration)
       ====================================================================== */

    const handleSave = async (data) => {
        if (selectedContact) {
            await updateMutation.mutateAsync({ ...selectedContact, ...data });
        } else {
            await addMutation.mutateAsync(data);
        }
        setShowModal(false);
        setSelectedContact(null);
    };

    const handleEdit = (id) => {
        const contact = contacts.find((c) => c.id === id);
        if (contact) {
            setSelectedContact(contact);
            setShowModal(true);
        }
    };

    const handleView = (contact) => {
        setViewContact(contact);
        setShowOffcanvas(true);
    };

    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "This contact will be moved to the recycle bin.",
            confirmLabel: "Yes, Move it",
            onConfirm: async () => {
                await deleteMutation.mutateAsync(id);
                setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
            }
        });
    };

    const handleRestore = async (id) => {
        await restoreMutation.mutateAsync(id);
    };

    const handlePermanentDelete = async (id) => {
        await permanentDeleteMutation.mutateAsync(id);
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

    /* ======================================================================
       Render
       ====================================================================== */

    return (
        <>
            <PageHeader
                title="Contact Lists"
                icon="fal fa-list"
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
                    onClick={() => {
                        setSelectedContact(null);
                        setShowModal(true);
                    }}
                >
                    <i className="fal fa-plus"></i>
                    <span className="txt ms-2">Add Contact</span>
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
                    <span className="txt ms-2">View Trash ({trashContacts.length})</span>
                </button>
            </PageHeader>

            {/* Page Content */}
            {isLoading ? (
                <div className="text-center py-5 text-muted">Loading contacts...</div>
            ) : (
                <ContactListsTable
                    data={contacts}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                />
            )}

            {/* Add/Edit Modal */}
            <ContactListModal
                show={showModal}
                contact={selectedContact}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
            />

            {/* Trash Modal */}
            <TrashModal
                show={showTrashModal}
                trashContacts={trashContacts}
                onClose={() => setShowTrashModal(false)}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
            />

            {/* Details Offcanvas */}
            <ContactDetailsOffcanvas
                show={showOffcanvas}
                contact={viewContact}
                onClose={() => {
                    setShowOffcanvas(false);
                    setViewContact(null);
                }}
            />
        </>
    );
}
