"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import DealsTable from "@/components/dashboard/deals/DealsTable";
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

  const [trashDeals, setTrashDeals] = useState([]);
  const [showTrashModal, setShowTrashModal] = useState(false);

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

  return (
    <>
      <PageHeader title="Deals" icon="fal fa-check-circle">
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

        <button
          type="button"
          className="alert alert-danger rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
          onClick={handleBulkDelete}
        >
          <i className="fal fa-trash"></i>
          <span className="txt ms-2">Delete ({selectedIds.length})</span>
        </button>

        <button
          type="button"
          className="alert alert-secondary rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
          onClick={() => setShowTrashModal(true)}
        >
          <i className="fal fa-trash-undo"></i>
          <span className="txt ms-2">View Trash ({trashDeals.length})</span>
        </button>
      </PageHeader>

      <DealsTable
        data={deals}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
