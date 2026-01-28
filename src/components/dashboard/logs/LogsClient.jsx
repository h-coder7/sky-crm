"use client";

import { useState, useMemo, useEffect } from "react";
import PageHeader from "@/components/layout/PageHeader";
import LogItem from "./LogItem";

export default function LogsClient({ initialLogs = [] }) {
    const [logs, setLogs] = useState(initialLogs);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // TODO: Connect to API
    /*
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get('/api/logs');
                setLogs(response.data);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };
        fetchLogs();
    }, []);
    */

    // Filter logs based on search term
    const filteredLogs = useMemo(() => {
        return logs.filter(log =>
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.module.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [logs, searchTerm]);

    // Reset to page 1 when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedLogs = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredLogs, currentPage]);

    const handleExportExcel = () => {
        const headers = ["Timestamp", "User", "Action", "Item", "Module"];
        const csvContent = [
            headers.join(","),
            ...filteredLogs.map(log => [
                log.timestamp,
                `"${log.user}"`,
                log.action,
                `"${log.item}"`,
                log.module
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `logs_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <PageHeader
                title="Activity Logs"
                icon="fal fa-history"
                titleCol="col-lg-4"
                actionCol="col-lg-8"
            >
                <div className="d-flex align-items-center">
                    <div className="search-wrapper me-3">
                        <div className="form-group mb-0">
                            <input
                                type="text"
                                className="form-control fsz-12 rounded-pill border"
                                placeholder="Search logs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ minWidth: '200px', minHeight: '35px' }}
                            />
                        </div>
                    </div>
                    <button
                        className="alert alert-success rounded-pill py-2 px-3 fsz-12 border-0 mb-0 d-flex align-items-center"
                        onClick={handleExportExcel}
                    >
                        <i className="fal fa-file-excel me-2"></i>
                        Export Excel
                    </button>
                </div>
            </PageHeader>

            <div className="logs-feed mt-4">
                <div className="row">
                    {paginatedLogs.length > 0 ? (
                        paginatedLogs.map(log => (
                            <LogItem key={log.id} log={log} />
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <div className="icon-60 bg-f1 rounded-circle df-center mx-auto mb-3 cr-999">
                                <i className="fal fa-search fsz-24"></i>
                            </div>
                            <h6 className="cr-999">No logs found matching your search</h6>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-4 react-pagination">
                        <div className="text-muted fsz-12">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                            {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                            >
                                <i className="fal fa-angle-double-left"></i>
                            </button>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <i className="fal fa-angle-left"></i>
                            </button>
                            <span className="d-flex align-items-center px-3 fsz-12">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <i className="fal fa-angle-right"></i>
                            </button>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                            >
                                <i className="fal fa-angle-double-right"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
