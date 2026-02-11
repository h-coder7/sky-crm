"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import DealsTable from "@/components/dashboard/deals/DealsTable";
import DealsMatrix from "@/components/dashboard/deals/DealsMatrix";
import DealsModal from "@/components/dashboard/deals/DealsModal";
import TrashModal from "@/components/dashboard/deals/TrashModal";
import { confirmAction } from "@/utils/confirm";

/**
 * 🎯 Client Component for Deals Page
 */
export default function DealsClient({ initialDeals = [] }) {
  const [deals, setDeals] = useState(initialDeals);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'matrix'

  const [trashDeals, setTrashDeals] = useState([]);
  const [showTrashModal, setShowTrashModal] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setSelectedDeal(null);
      setShowModal(true);
      // Clean URL
      const params = new URLSearchParams(searchParams);
      params.delete("action");
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  const handleSave = async (data) => {
    if (selectedDeal) {
      // Update existing
      setDeals((prev) =>
        prev.map((deal) =>
          deal.id === selectedDeal.id ? { ...deal, ...data } : deal
        )
      );
    } else {
      // Create new
      const newDeal = {
        id: Date.now(),
        ...data,
        created_at: new Date().toISOString().split("T")[0],
      };
      setDeals((prev) => [newDeal, ...prev]);
    }
    setShowModal(false);
    setSelectedDeal(null);
  };

  const handleEdit = (id) => {
    const deal = deals.find((d) => d.id === id);
    if (deal) {
      setSelectedDeal(deal);
      setShowModal(true);
    }
  };

  const handleDelete = (id) => {
    confirmAction({
      title: "Move to Trash?",
      message: "This deal will be moved to the recycle bin.",
      confirmLabel: "Yes, Move it",
      onConfirm: () => {
        const dealToDelete = deals.find((d) => d.id === id);
        if (dealToDelete) {
          setTrashDeals((prev) => [dealToDelete, ...prev]);
          setDeals((prev) => prev.filter((d) => d.id !== id));
        }
      }
    });
  };

  const handleRestore = (id) => {
    const dealToRestore = trashDeals.find((d) => d.id === id);
    if (dealToRestore) {
      setDeals((prev) => [dealToRestore, ...prev]);
      setTrashDeals((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handlePermanentDelete = (id) => {
    setTrashDeals((prev) => prev.filter((d) => d.id !== id));
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    confirmAction({
      title: "Delete Selected Items?",
      message: `Are you sure you want to move ${selectedIds.length} items to trash?`,
      confirmLabel: "Yes, Delete",
      onConfirm: () => {
        const itemsToDelete = deals.filter(d => selectedIds.includes(d.id));
        setTrashDeals(prev => [...itemsToDelete, ...prev]);
        setDeals(prev => prev.filter(d => !selectedIds.includes(d.id)));
        setSelectedIds([]);
      }
    });
  };

  const handleUpdateDeal = (updatedDeal) => {
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));
  };

  return (
    <>
      <PageHeader title="Deals"
        icon="fal fa-check-circle"
        titleCol="col-lg-4"
        actionCol="col-lg-8">
        {/* View Switcher */}
        <div className="btn-group me-3 bg-white shadow-sm rounded-pill p-1">
          <button
            className={`btn btn-sm rounded-pill px-3 border-0 ${viewMode === 'list' ? 'bg-dark text-white' : 'text-muted'}`}
            onClick={() => setViewMode('list')}
          >
            <i className="fal fa-list me-2"></i> List
          </button>
          <button
            className={`btn btn-sm rounded-pill px-3 border-0 ${viewMode === 'matrix' ? 'bg-dark text-white' : 'text-muted'}`}
            onClick={() => setViewMode('matrix')}
          >
            <i className="fal fa-th me-2"></i> Calendar
          </button>
        </div>

        <button
          type="button"
          className="alert alert-success rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
          onClick={() => {
            setSelectedDeal(null);
            setShowModal(true);
          }}
        >
          <i className="fal fa-plus"></i>
          <span className="txt ms-2">Add Deal</span>
        </button>

        {viewMode === 'list' && (
          <button
            type="button"
            className="alert alert-danger rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
            onClick={handleBulkDelete}
          >
            <i className="fal fa-trash"></i>
            <span className="txt ms-2">Delete ({selectedIds.length})</span>
          </button>
        )}

        <button
          type="button"
          className="alert alert-secondary rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
          onClick={() => setShowTrashModal(true)}
        >
          <i className="fal fa-trash-undo"></i>
          <span className="txt ms-2">View Trash ({trashDeals.length})</span>
        </button>
      </PageHeader>

      {viewMode === 'list' ? (
        <DealsTable
          data={deals}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <DealsMatrix
          deals={deals}
          onUpdateDeal={handleUpdateDeal}
        />
      )}

      <DealsModal
        show={showModal}
        deal={selectedDeal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />

      <TrashModal
        show={showTrashModal}
        trashDeals={trashDeals}
        onClose={() => setShowTrashModal(false)}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
      />
    </>
  );
}
