"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import DailyLogTable from "@/components/dashboard/daily-log/DailyLogTable";
import DailyLogModal from "@/components/dashboard/daily-log/DailyLogModal";
import TrashModal from "@/components/dashboard/daily-log/TrashModal";
import { confirmAction } from "@/utils/confirm";

export default function DailyLogClient({ initialLogs = [] }) {
    const [logs, setLogs] = useState(initialLogs);
    const [selectedIds, setSelectedIds] = useState([]);

    // Modals state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTrashOpen, setIsTrashOpen] = useState(false);
    const [editingLog, setEditingLog] = useState(null);

    // Trash State
    const [trashLogs, setTrashLogs] = useState([]);

    /* ======================================================================
       1. Handlers
       ====================================================================== */
    const handleAddModal = () => {
        setEditingLog(null);
        setIsModalOpen(true);
    };

    const handleEditModal = (id) => {
        const log = logs.find(l => l.id === id);
        if (log) {
            setEditingLog(log);
            setIsModalOpen(true);
        }
    };

    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "This log will be moved to the recycle bin.",
            confirmLabel: "Yes, Move it",
            onConfirm: () => {
                const logToDelete = logs.find((l) => l.id === id);
                if (logToDelete) {
                    setTrashLogs((prev) => [logToDelete, ...prev]);
                    setLogs((prev) => prev.filter((l) => l.id !== id));
                    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
                }
            }
        });
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;

        confirmAction({
            title: "Delete Selected Items?",
            message: `Are you sure you want to move ${selectedIds.length} items to trash?`,
            confirmLabel: "Yes, Delete",
            onConfirm: () => {
                const itemsToDelete = logs.filter(l => selectedIds.includes(l.id));
                setTrashLogs(prev => [...itemsToDelete, ...prev]);
                setLogs(prev => prev.filter(l => !selectedIds.includes(l.id)));
                setSelectedIds([]);
            }
        });
    };

    const handleSave = (logData) => {
        if (editingLog) {
            setLogs(prev => prev.map(l => l.id === editingLog.id ? { ...l, ...logData } : l));
        } else {
            const newLog = {
                ...logData,
                id: Math.max(0, ...logs.map(l => l.id)) + 1,
                created_at: new Date().toISOString().split('T')[0]
            };
            setLogs(prev => [newLog, ...prev]);
        }
        setIsModalOpen(false);
    };

    const handleRestore = (id) => {
        const logToRestore = trashLogs.find((l) => l.id === id);
        if (logToRestore) {
            setLogs((prev) => [logToRestore, ...prev]);
            setTrashLogs((prev) => prev.filter((l) => l.id !== id));
        }
    };

    const handlePermanentDelete = (id) => {
        setTrashLogs((prev) => prev.filter((l) => l.id !== id));
    };

    /* ======================================================================
       2. JSX
       ====================================================================== */
    return (
        <>
            <PageHeader
                title="Daily Logs"
                icon="fal fa-clipboard-list"
                titleCol="col-lg-4"
                actionCol="col-lg-8"
            >
                {/* Add Button */}
                <button
                    type="button"
                    className="alert alert-success rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
                    onClick={handleAddModal}
                >
                    <i className="fal fa-plus"></i>
                    <span className="txt ms-2">Add Log</span>
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
                    <span className="txt ms-2">View Trash ({trashLogs.length})</span>
                </button>
            </PageHeader>

            <div className="table-content">
                <DailyLogTable
                    data={logs}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onEdit={handleEditModal}
                    onDelete={handleDelete}
                />
            </div>

            {/* Modals */}
            <DailyLogModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                log={editingLog}
            />

            <TrashModal
                show={isTrashOpen}
                onClose={() => setIsTrashOpen(false)}
                trashLogs={trashLogs}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
            />
        </>
    );
}
