"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import CountriesTable from "@/components/dashboard/countries/CountriesTable";
import api from "@/app/api/api"; // 🔌 Import axios instance
import CountryModal from "@/components/dashboard/countries/CountryModal";
import TrashModal from "@/components/dashboard/countries/TrashModal";
import { confirmAction } from "@/utils/confirm";

/**
 * 🎯 Client Component for Countries Page
 * 
 * Handles all interactive logic:
 * - State management
 * - Event handlers
 * - Modals
 * - CRUD operations (ready for API integration)
 * 
 * Receives initial data from Server Component via props
 */
export default function CountriesClient({ initialCountries = [] }) {
    // State Management
    const [countries, setCountries] = useState(initialCountries);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const [trashCountries, setTrashCountries] = useState([]);
    const [showTrashModal, setShowTrashModal] = useState(false);

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
        /*
        try {
          if (selectedCountry) {
            // Update existing
            const res = await api.put(`/countries/${selectedCountry.id}`, data);
            const updatedCountry = res.data;
    
            setCountries((prev) =>
              prev.map((country) => (country.id === updatedCountry.id ? updatedCountry : country))
            );
          } else {
            // Create new
            const res = await api.post('/countries', data);
            const newCountry = res.data;
    
            setCountries((prev) => [newCountry, ...prev]);
          }
          setShowModal(false);
          setSelectedCountry(null);
        } catch (error) {
          console.error("Failed to save country:", error);
          // Handle error (e.g., show toast)
        }
        */

        // 👇 TEMP: Local State Logic (Remove when API is ready)
        if (selectedCountry) {
            // Update existing
            setCountries((prev) =>
                prev.map((country) =>
                    country.id === selectedCountry.id
                        ? { ...country, ...data }
                        : country
                )
            );
        } else {
            // Create new
            const newCountry = {
                id: Date.now(),
                title: data.title,
                created_at: new Date().toISOString().split("T")[0],
            };
            setCountries((prev) => [newCountry, ...prev]);
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

    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "This country will be moved to the recycle bin.",
            confirmLabel: "Yes, Move it",
            onConfirm: async () => {
                /*
                try {
                   await api.delete(`/countries/${id}`); // Assuming delete moves to trash
                   
                   setCountries((prev) => prev.filter((c) => c.id !== id));
                } catch (error) {
                   console.error("Failed to delete country:", error);
                }
                */

                // 👇 TEMP: Local State Logic
                const countryToDelete = countries.find((c) => c.id === id);
                if (countryToDelete) {
                    setTrashCountries((prev) => [countryToDelete, ...prev]);
                    setCountries((prev) => prev.filter((c) => c.id !== id));
                }
            }
        });
    };

    const handleRestore = async (id) => {
        /*
        try {
          await api.patch(`/countries/${id}/restore`); 
          
          const countryToRestore = trashCountries.find((c) => c.id === id);
          if (countryToRestore) {
            setCountries((prev) => [countryToRestore, ...prev]);
            setTrashCountries((prev) => prev.filter((c) => c.id !== id));
          }
        } catch (error) {
          console.error("Failed to restore country:", error);
        }
        */

        // 👇 TEMP: Local State Logic
        const countryToRestore = trashCountries.find((c) => c.id === id);
        if (countryToRestore) {
            setCountries((prev) => [countryToRestore, ...prev]);
            setTrashCountries((prev) => prev.filter((c) => c.id !== id));
        }
    };

    const handlePermanentDelete = async (id) => {
        /*
        try {
          await api.delete(`/countries/${id}/permanent`);
          setTrashCountries((prev) => prev.filter((c) => c.id !== id));
        } catch (error) {
           console.error("Failed to permanently delete country:", error);
        }
        */

        // 👇 TEMP: Local State Logic
        setTrashCountries((prev) => prev.filter((c) => c.id !== id));
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
                  await api.post('/countries/bulk-delete', { ids: selectedIds });
                  
                  const itemsToDelete = countries.filter(c => selectedIds.includes(c.id));
                  setTrashCountries(prev => [...itemsToDelete, ...prev]);
                  setCountries(prev => prev.filter(c => !selectedIds.includes(c.id)));
                  setSelectedIds([]);
                } catch (error) {
                  console.error("Failed to bulk delete:", error);
                }
                */

                // 👇 TEMP: Local State Logic
                const itemsToDelete = countries.filter(c => selectedIds.includes(c.id));
                setTrashCountries(prev => [...itemsToDelete, ...prev]);
                setCountries(prev => prev.filter(c => !selectedIds.includes(c.id)));
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
                <CountriesTable
                    data={countries}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
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
        </>
    );
}
