"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import CompaniesTable from "./CompaniesTable";
import CompanyModal from "./CompanyModal";
import TrashModal from "./TrashModal";
import { confirmAction } from "@/utils/confirm";

export default function CompaniesClient({ initialCompanies = [] }) {
    const [companies, setCompanies] = useState(initialCompanies);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    // Trash State
    const [trashCompanies, setTrashCompanies] = useState([]);
    const [showTrashModal, setShowTrashModal] = useState(false);

    /* ======================================================================
       1. Handlers
       ====================================================================== */
    const handleSave = (companyData) => {
        // 🔌 API READY: Integrate your POST/PUT request here.
        if (selectedCompany) {
            setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? { ...c, ...companyData } : c));
        } else {
            const newCompany = {
                ...companyData,
                id: Math.max(0, ...companies.map(c => c.id)) + 1,
                created_at: new Date().toISOString().split('T')[0]
            };
            setCompanies(prev => [newCompany, ...prev]);
        }
        setIsModalOpen(false);
        setSelectedCompany(null);
    };

    const handleEdit = (id) => {
        const company = companies.find(c => c.id === id);
        if (company) {
            setSelectedCompany(company);
            setIsModalOpen(true);
        }
    };

    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "This company will be moved to the recycle bin.",
            confirmLabel: "Yes, Move it",
            onConfirm: () => {
                const companyToDelete = companies.find((c) => c.id === id);
                if (companyToDelete) {
                    setTrashCompanies((prev) => [companyToDelete, ...prev]);
                    setCompanies((prev) => prev.filter((c) => c.id !== id));
                }
            }
        });
    };

    const handleRestore = (id) => {
        const companyToRestore = trashCompanies.find((c) => c.id === id);
        if (companyToRestore) {
            setCompanies((prev) => [companyToRestore, ...prev]);
            setTrashCompanies((prev) => prev.filter((c) => c.id !== id));
        }
    };

    const handlePermanentDelete = (id) => {
        setTrashCompanies((prev) => prev.filter((c) => c.id !== id));
    };


    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;

        confirmAction({
            title: "Delete Selected Items?",
            message: `Are you sure you want to move ${selectedIds.length} items to trash?`,
            confirmLabel: "Yes, Delete",
            onConfirm: () => {
                const itemsToDelete = companies.filter(c => selectedIds.includes(c.id));
                setTrashCompanies(prev => [...itemsToDelete, ...prev]);
                setCompanies(prev => prev.filter(c => !selectedIds.includes(c.id)));
                setSelectedIds([]);
            }
        });
    };

    /* ======================================================================
       2. JSX
       ====================================================================== */
    return (
        <>
            <PageHeader
                title="Companies"
                icon="fal fa-building"
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
                        setSelectedCompany(null);
                        setIsModalOpen(true);
                    }}
                >
                    <i className="fal fa-plus"></i>
                    <span className="txt ms-2">Add Company</span>
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
                    <span className="txt ms-2">View Trash ({trashCompanies.length})</span>
                </button>
            </PageHeader>

            <CompaniesTable
                data={companies}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Modals */}
            <CompanyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                company={selectedCompany}
            />

            <TrashModal
                isOpen={showTrashModal}
                onClose={() => setShowTrashModal(false)}
                trashCompanies={trashCompanies}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
            />
        </>
    );
}
