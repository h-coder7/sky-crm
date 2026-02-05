"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import DailyLogFilter from "./DailyLogFilter";
import DateRangeModal from "../../../components/shared/DateRangeModal";

export default function DailyLogTable({
    data = [],
    selectedIds = [],
    onSelectionChange,
    onEdit,
    onDelete
}) {

    /* ======================================================================
       1. Table State
       ====================================================================== */
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    // Date Range State for "Added ON"
    const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: "selection" }]);
    const [tempRange, setTempRange] = useState([{ startDate: null, endDate: null, key: "selection" }]);
    const [showModal, setShowModal] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    /* ======================================================================
       2. Selection Sync
       ====================================================================== */
    useEffect(() => {
        const newSelection = {};
        selectedIds.forEach((id) => {
            const index = data.findIndex((item) => item.id === id);
            if (index !== -1) newSelection[index] = true;
        });
        setRowSelection(newSelection);
    }, [selectedIds, data]);

    /* ======================================================================
       3. Columns
       ====================================================================== */
    const columns = useMemo(() => [
        { id: "contact_list", accessorKey: "contact_list", header: "Contact List" },
        { id: "date", accessorKey: "date", header: "Date" },
        { id: "employee", accessorKey: "employee", header: "Employee" },
        { id: "objective", accessorKey: "objective", header: "Objective" },
        { id: "type", accessorKey: "type", header: "Type" },
        { id: "estimated_sale", accessorKey: "estimated_sale", header: "Estimated Sale" },
        { id: "next_contact", accessorKey: "next_contact", header: "Next Contact" },
        { id: "next_action", accessorKey: "next_action", header: "Next Action" },
        {
            id: "created_at",
            accessorKey: "created_at",
            header: "Added ON",
            filterFn: (row, columnId, filterValue) => {
                if (!filterValue || !filterValue[0] || !filterValue[1]) return true;
                const rowDate = new Date(row.getValue(columnId));
                const [start, end] = filterValue;
                return rowDate >= start && rowDate <= end;
            }
        },
    ], []);

    /* ======================================================================
       4. Table Instance
       ====================================================================== */
    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnFilters, rowSelection, pagination },
        enableRowSelection: true,
        onRowSelectionChange: (updater) => {
            const nextSelection = typeof updater === "function" ? updater(rowSelection) : updater;
            setRowSelection(nextSelection);
            const selectedIdsList = Object.keys(nextSelection)
                .filter(key => nextSelection[key])
                .map(index => data[index]?.id)
                .filter(Boolean);
            onSelectionChange?.(selectedIdsList);
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    /* ======================================================================
       5. Helpers
       ====================================================================== */
    const confirmDateRange = (newRange) => {
        const selectedRange = newRange[0];
        setDateRange(newRange);
        setTempRange(newRange);
        setShowModal(false);
        if (selectedRange.startDate && selectedRange.endDate) {
            table.getColumn("created_at")?.setFilterValue([selectedRange.startDate, selectedRange.endDate]);
        } else {
            table.getColumn("created_at")?.setFilterValue(undefined);
        }
    };

    const formatDateRangeDisplay = () => {
        const { startDate, endDate } = dateRange[0];
        if (!startDate || !endDate) return "";
        return `${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]}`;
    };

    /* ======================================================================
       6. JSX
       ====================================================================== */
    return (
        <div className="table-responsive position-relative">
            <table className="table align-middle">
                <thead>
                    <tr>
                        <th>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        id="select-all-logs"
                                        type="checkbox"
                                        checked={table.getIsAllPageRowsSelected()}
                                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="select-all-logs">
                                        Contact List
                                    </label>
                                </div>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("contact_list").toggleSorting(false)}>
                                            <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                        </li>
                                        <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("contact_list").toggleSorting(true)}>
                                            <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th>Date</th>
                        <th>Employee</th>
                        <th>Objective</th>
                        <th>Type</th>
                        <th>Estimated Sale</th>
                        <th>Next Contact</th>
                        <th>Next action</th>
                        <th colSpan={2}>Added ON</th>
                    </tr>

                    {/* Filter Row */}
                    <DailyLogFilter
                        table={table}
                        dateRangeValue={formatDateRangeDisplay()}
                        onOpenModal={() => setShowModal(true)}
                    />
                </thead>

                <tbody>
                    {table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td colSpan={10} className="text-center text-muted py-4">
                                No logs found
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map((row) => {
                            const item = row.original;
                            return (
                                <tr key={row.id}>
                                    <td>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`log-${item.id}`}
                                                checked={row.getIsSelected()}
                                                onChange={row.getToggleSelectedHandler()}
                                            />
                                            <label className="form-check-label ms-2" htmlFor={`log-${item.id}`}>
                                                {item.contact_list}
                                            </label>
                                        </div>
                                    </td>
                                    <td>{item.date}</td>
                                    <td>{item.employee}</td>
                                    <td>{item.objective}</td>
                                    <td>{item.type}</td>
                                    <td>{item.estimated_sale}</td>
                                    <td>{item.next_contact}</td>
                                    <td>{item.next_action}</td>
                                    <td>{item.created_at}</td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fas fa-ellipsis"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer">
                                                    <Link href="/dashboard/contact-lists" className="text-decoration-none text-dark d-block w-100">
                                                        <i className="fal fa-link me-2"></i> Contact Lists
                                                    </Link>
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => onEdit?.(item.id)}>
                                                    <i className="fal fa-pen me-2"></i> Edit
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => console.log("Lock", item.id)}>
                                                    <i className="fal fa-lock me-2"></i> Lock
                                                </li>
                                                <li className="dropdown-item cursor-pointer text-danger" onClick={() => onDelete?.(item.id)}>
                                                    <i className="fal fa-trash me-2"></i> Delete
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3 react-pagination">
                <div className="text-muted fsz-12">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                    {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of {table.getFilteredRowModel().rows.length} entries
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                        <i className="fal fa-angle-double-left"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        <i className="fal fa-angle-left"></i>
                    </button>
                    <span className="d-flex align-items-center px-3 fsz-12">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        <i className="fal fa-angle-right"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                        <i className="fal fa-angle-double-right"></i>
                    </button>
                </div>
            </div>

            {/* Date Range Modal */}
            {/* --- DATE MODAL (New Component) --- */}
            <DateRangeModal
                show={showModal}
                initialRange={tempRange}
                onClose={() => setShowModal(false)}
                onApply={confirmDateRange}
            />
        </div>
    );
}
