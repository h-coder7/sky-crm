"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import ContactListsTable from "@/components/dashboard/contact-lists/ContactListsTable";
import api from "@/app/api/api"; // 🔌 Import axios instance
import ContactListModal from "@/components/dashboard/contact-lists/ContactListModal";
import TrashModal from "@/components/dashboard/contact-lists/TrashModal";
import { confirmAction } from "@/utils/confirm";

/**
 * 🎯 Client Component for Contact Lists Page
 * 
 * Handles all interactive logic for comprehensive contact management
 */
export default function ContactListsClient({ initialContacts = [] }) {
    // State Management
    const [contacts, setContacts] = useState(initialContacts);
    const [selectedContact, setSelectedContact] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const [trashContacts, setTrashContacts] = useState([]);
    const [showTrashModal, setShowTrashModal] = useState(false);

    /* ======================================================================
       CRUD Handlers (Ready for API Integration)
       ====================================================================== */

    const handleSave = async (data) => {
        /*
        try {
          if (selectedContact) {
            const res = await api.put(`/contact-lists/${selectedContact.id}`, data);
            const updated = res.data;
            setContacts((prev) =>
              prev.map((contact) => (contact.id === updated.id ? updated : contact))
            );
          } else {
            const res = await api.post('/contact-lists', data);
            const newContact = res.data;
            setContacts((prev) => [newContact, ...prev]);
          }
          setShowModal(false);
          setSelectedContact(null);
        } catch (error) {
          console.error("Failed to save contact:", error);
        }
        */

        // 👇 TEMP: Local State Logic
        if (selectedContact) {
            setContacts((prev) =>
                prev.map((contact) =>
                    contact.id === selectedContact.id
                        ? { ...contact, ...data }
                        : contact
                )
            );
        } else {
            const newContact = {
                id: Date.now(),
                ...data,
                created_at: new Date().toISOString().split("T")[0],
            };
            setContacts((prev) => [newContact, ...prev]);
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

    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "This contact will be moved to the recycle bin.",
            confirmLabel: "Yes, Move it",
            onConfirm: async () => {
                /*
                try {
                   await api.delete(`/contact-lists/${id}`);
                   setContacts((prev) => prev.filter((c) => c.id !== id));
                } catch (error) {
                   console.error("Failed to delete contact:", error);
                }
                */

                const contactToDelete = contacts.find((c) => c.id === id);
                if (contactToDelete) {
                    setTrashContacts((prev) => [contactToDelete, ...prev]);
                    setContacts((prev) => prev.filter((c) => c.id !== id));
                }
            }
        });
    };

    const handleRestore = async (id) => {
        /*
        try {
          await api.patch(`/contact-lists/${id}/restore`);
          const contactToRestore = trashContacts.find((c) => c.id === id);
          if (contactToRestore) {
            setContacts((prev) => [contactToRestore, ...prev]);
            setTrashContacts((prev) => prev.filter((c) => c.id !== id));
          }
        } catch (error) {
          console.error("Failed to restore contact:", error);
        }
        */

        const contactToRestore = trashContacts.find((c) => c.id === id);
        if (contactToRestore) {
            setContacts((prev) => [contactToRestore, ...prev]);
            setTrashContacts((prev) => prev.filter((c) => c.id !== id));
        }
    };

    const handlePermanentDelete = async (id) => {
        /*
        try {
          await api.delete(`/contact-lists/${id}/permanent`);
          setTrashContacts((prev) => prev.filter((c) => c.id !== id));
        } catch (error) {
           console.error("Failed to permanently delete contact:", error);
        }
        */

        setTrashContacts((prev) => prev.filter((c) => c.id !== id));
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
                  await api.post('/contact-lists/bulk-delete', { ids: selectedIds });
                  const itemsToDelete = contacts.filter(c => selectedIds.includes(c.id));
                  setTrashContacts(prev => [...itemsToDelete, ...prev]);
                  setContacts(prev => prev.filter(c => !selectedIds.includes(c.id)));
                  setSelectedIds([]);
                } catch (error) {
                  console.error("Failed to bulk delete:", error);
                }
                */

                const itemsToDelete = contacts.filter(c => selectedIds.includes(c.id));
                setTrashContacts(prev => [...itemsToDelete, ...prev]);
                setContacts(prev => prev.filter(c => !selectedIds.includes(c.id)));
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
            <ContactListsTable
                data={contacts}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

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
        </>
    );
}
