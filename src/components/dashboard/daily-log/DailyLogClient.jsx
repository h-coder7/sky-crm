"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/layout/PageHeader";
import DailyLogTable from "@/components/dashboard/daily-log/DailyLogTable";
import DailyLogModal from "@/components/dashboard/daily-log/DailyLogModal";
import TrashModal from "@/components/dashboard/daily-log/TrashModal";
import { confirmAction } from "@/utils/confirm";
import { toast } from "react-hot-toast";

import {
    useDailyLog,
    useTrashDailyLogs,
    useAddDailyLog,
    useUpdateDailyLog,
    useDeleteDailyLog,
    useRestoreDailyLog,
    usePermanentDeleteDailyLog,
    useBulkDeleteDailyLogs
} from "@/hooks/useDailyLog";

export default function DailyLogClient() {
    const { data: dailyLogs = [], isLoading } = useDailyLog();
    const { data: trashLogs = [] } = useTrashDailyLogs();

    const addLogMutation = useAddDailyLog();
    const updateLogMutation = useUpdateDailyLog();
    const deleteLogMutation = useDeleteDailyLog();
    const restoreLogMutation = useRestoreDailyLog();
    const permanentDeleteMutation = usePermanentDeleteDailyLog();
    const bulkDeleteMutation = useBulkDeleteDailyLogs();

    const [selectedLog, setSelectedLog] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showTrashModal, setShowTrashModal] = useState(false);

    const handleSave = async (data) => {
        if (selectedLog) {
            await updateLogMutation.mutateAsync({ ...selectedLog, ...data });
        } else {
            await addLogMutation.mutateAsync(data);
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
            onConfirm: async () => {
                await deleteLogMutation.mutateAsync(id);
            },
        });
    };

    const handleRestore = async (id) => {
        await restoreLogMutation.mutateAsync(id);
    };

    const handlePermanentDelete = async (id) => {
        await permanentDeleteMutation.mutateAsync(id);
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        confirmAction({
            title: "Move Selected to Trash?",
            message: `Are you sure you want to move ${selectedIds.length} entries to the recycle bin?`,
            confirmLabel: "Yes, Move to Trash",
            onConfirm: async () => {
                await bulkDeleteMutation.mutateAsync(selectedIds);
                setSelectedIds([]);
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
                {isLoading ? (
                    <div className="text-center py-5 text-muted">Loading daily logs...</div>
                ) : (
                    <DailyLogTable
                        data={dailyLogs}
                        selectedIds={selectedIds}
                        onSelectionChange={setSelectedIds}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
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
