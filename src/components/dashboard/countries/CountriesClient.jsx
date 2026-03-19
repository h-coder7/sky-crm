"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import CountriesTable from "@/components/dashboard/countries/CountriesTable";
import api from "@/app/api/api"; // 🔌 Import axios instance
import CountryModal from "@/components/dashboard/countries/CountryModal";
import TrashModal from "@/components/dashboard/countries/TrashModal";
import { confirmAction } from "@/utils/confirm";
import { toast } from "react-hot-toast";
import CountryDetailsOffcanvas from "@/components/dashboard/countries/CountryDetailsOffcanvas";
import {
    useCountries,
    useTrashCountries,
    useAddCountry,
    useUpdateCountry,
    useDeleteCountry,
    useRestoreCountry,
    usePermanentDeleteCountry,
    useBulkDeleteCountries
} from "@/hooks/useCountries";

/**
 * 🎯 Client Component for Countries Page
 */
export default function CountriesClient() {
    const { data: countries = [], isLoading } = useCountries();
    const { data: trashCountries = [] } = useTrashCountries();

    const addCountryMutation = useAddCountry();
    const updateCountryMutation = useUpdateCountry();
    const deleteCountryMutation = useDeleteCountry();
    const restoreCountryMutation = useRestoreCountry();
    const permanentDeleteMutation = usePermanentDeleteCountry();
    const bulkDeleteMutation = useBulkDeleteCountries();

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showTrashModal, setShowTrashModal] = useState(false);

    // Offcanvas State for View Details
    const [viewCountry, setViewCountry] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (searchParams.get("action") === "add") {
            setSelectedCountry(null);
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
        if (selectedCountry) {
            await updateCountryMutation.mutateAsync({ ...selectedCountry, ...data });
        } else {
            await addCountryMutation.mutateAsync(data);
        }
        setShowModal(false);
        setSelectedCountry(null);
    };

    /**
     * Open edit modal with selected country
     */
    const handleEdit = (id) => {
        const country = countries.find((c) => c.id === id);
        if (country) {
            setSelectedCountry(country);
            setShowModal(true);
        }
    };

    /**
     * Open details offcanvas
     */
    const handleView = (country) => {
        setViewCountry(country);
        setShowOffcanvas(true);
    };


    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "This country will be moved to the recycle bin.",
            confirmLabel: "Yes, Move it",
            onConfirm: async () => {
                await deleteCountryMutation.mutateAsync(id);
                setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
            }
        });
    };

    const handleRestore = async (id) => {
        await restoreCountryMutation.mutateAsync(id);
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
                title="Countries"
                icon="fal fa-globe"
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
                        setSelectedCountry(null);
                        setShowModal(true);
                    }}
                >
                    <i className="fal fa-plus"></i>
                    <span className="txt ms-2">Add Country</span>
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
                    <span className="txt ms-2">View Trash ({trashCountries.length})</span>
                </button>
            </PageHeader>

            {/* Page Content */}
            <div className="mt-4">
                {isLoading ? (
                    <div className="text-center py-5 text-muted">Loading countries...</div>
                ) : (
                    <CountriesTable
                        data={countries}
                        selectedIds={selectedIds}
                        onSelectionChange={setSelectedIds}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                    />
                )}
            </div>

            {/* Add/Edit Modal */}
            <CountryModal
                show={showModal}
                country={selectedCountry}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
            />

            {/* Trash Modal */}
            <TrashModal
                show={showTrashModal}
                trashCountries={trashCountries}
                onClose={() => setShowTrashModal(false)}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
            />

            {/* Details Offcanvas */}
            <CountryDetailsOffcanvas
                show={showOffcanvas}
                country={viewCountry}
                onClose={() => {
                    setShowOffcanvas(false);
                    setViewCountry(null);
                }}
            />
        </>
    );
}
