"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/layout/PageHeader";
import DailyLogTable from "@/components/dashboard/daily-log/DailyLogTable";
import DailyLogModal from "@/components/dashboard/daily-log/DailyLogModal";
import TrashModal from "@/components/dashboard/daily-log/TrashModal";
import { confirmAction } from "@/utils/confirm";
import { toast } from "react-hot-toast";

export default function DailyLogClient({ initialDailyLogs = [] }) {
    const [dailyLogs, setDailyLogs] = useState(initialDailyLogs);
    const [selectedLog, setSelectedLog] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const [trashLogs, setTrashLogs] = useState([]);
    const [showTrashModal, setShowTrashModal] = useState(false);
    const handleSave = (data) => {
        if (selectedLog) {
            setDailyLogs((prev) =>
                prev.map((log) => (log.id === selectedLog.id ? { ...log, ...data } : log))
            );
            toast.success("Daily log updated successfully!");
        } else {
            const newLog = {
                id: Date.now(),
                ...data,
                date: data.date || new Date().toISOString().split("T")[0],
                created_at: new Date().toISOString().split("T")[0],
            };
            setDailyLogs((prev) => [newLog, ...prev]);
            toast.success("Daily log added successfully!");
        }
        setShowModal(false);
        setSelectedLog(null);
    };

    const handleEdit = (id) => {
        const log = dailyLogs.find((l) => l.id === id);
        if (log) {
            setSelectedLog(log);
            setShowModal(true);
        }
    };

    const handleDelete = (id) => {
        confirmAction({
            title: "Move to Trash?",
            message: "Are you sure you want to move this log entry to the recycle bin?",
            confirmLabel: "Yes, Move to Trash",
            onConfirm: () => {
                const logToDelete = dailyLogs.find((l) => l.id === id);
                if (logToDelete) {
                    setTrashLogs((prev) => [logToDelete, ...prev]);
                    setDailyLogs((prev) => prev.filter((l) => l.id !== id));
                    toast.success("Log entry moved to trash!");
                }
            },
        });
    };

    const handleRestore = (id) => {
        const logToRestore = trashLogs.find((l) => l.id === id);
        if (logToRestore) {
            setDailyLogs((prev) => [logToRestore, ...prev]);
            setTrashLogs((prev) => prev.filter((l) => l.id !== id));
            toast.success("Log entry restored successfully!");
        }
    };

    const handlePermanentDelete = (id) => {
        setTrashLogs((prev) => prev.filter((l) => l.id !== id));
        toast.success("Log entry permanently deleted!");
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        confirmAction({
            title: "Move Selected to Trash?",
            message: `Are you sure you want to move ${selectedIds.length} entries to the recycle bin?`,
            confirmLabel: "Yes, Move to Trash",
            onConfirm: () => {
                const logsToDelete = dailyLogs.filter((l) => selectedIds.includes(l.id));
                setTrashLogs((prev) => [...logsToDelete, ...prev]);
                setDailyLogs((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
                setSelectedIds([]);
                toast.success(`${logsToDelete.length} logs moved to trash!`);
            },
        });
    };

    return (
        <>
            <PageHeader
                title="Daily Log"
                icon="fal fa-calendar-alt"
                titleCol="col-lg-4"
                actionCol="col-lg-8"
            >
                <button
                    type="button"
                    className="alert alert-success rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
                    onClick={() => {
                        setSelectedLog(null);
                        setShowModal(true);
                    }}
                >
                    <i className="fal fa-plus"></i>
                    <span className="txt ms-2">Add Daily Log</span>
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
                    <span className="txt ms-2">View Trash ({trashLogs.length})</span>
                </button>
            </PageHeader>

            <div className="mt-4">
                <DailyLogTable
                    data={dailyLogs}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <DailyLogModal
                show={showModal}
                log={selectedLog}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
            />

            <TrashModal
                show={showTrashModal}
                trashLogs={trashLogs}
                onClose={() => setShowTrashModal(false)}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
            />
        </>
    );
}
