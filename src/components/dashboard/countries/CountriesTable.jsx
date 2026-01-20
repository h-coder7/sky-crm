"use client";

import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DateRange } from "react-date-range";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import CountriesFilter from "./CountriesFilter";

/**
 * 🔌 API READY: To connect to backend, replace the `data` prop with fetched data.
 */

export default function CountriesTable({ 
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

    // Date Range State (Moved here to be outside the table DOM)
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
        {
            id: "title",
            accessorKey: "title",
        },
        {
            id: "created_at",
            accessorKey: "created_at",
            header: "Added On",
            filterFn: (row, columnId, filterValue) => {
                if (!filterValue || !filterValue[0] || !filterValue[1]) return true;
                const rowDate = new Date(row.getValue(columnId));
                const [start, end] = filterValue;
                return rowDate >= start && rowDate <= end;
            },
            sortingFn: (rowA, rowB, columnId) => {
                const a = new Date(rowA.getValue(columnId));
                const b = new Date(rowB.getValue(columnId));
                return a > b ? 1 : a < b ? -1 : 0;
            },
        },
    ], []);

    /* ======================================================================
       4. Table Instance
       ====================================================================== */
    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnFilters, rowSelection },
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
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    /* ======================================================================
       5. Helpers
       ====================================================================== */
    const confirmDateRange = () => {
        setDateRange(tempRange);
        setShowModal(false);

        if (tempRange[0].startDate && tempRange[0].endDate) {
            table.getColumn("created_at")?.setFilterValue([
                tempRange[0].startDate,
                tempRange[0].endDate,
            ]);
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
                                        id="select-all-countries"
                                        type="checkbox"
                                        checked={table.getIsAllPageRowsSelected()}
                                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="select-all-countries">
                                        Name
                                    </label>
                                </div>

                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li
                                            className="dropdown-item cursor-pointer"
                                            onClick={() => table.getColumn("title").toggleSorting(false)}
                                        >
                                            <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                        </li>
                                        <li
                                            className="dropdown-item cursor-pointer"
                                            onClick={() => table.getColumn("title").toggleSorting(true)}
                                        >
                                            <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>

                        <th colSpan={3}>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Added On</span>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li
                                            className="dropdown-item cursor-pointer"
                                            onClick={() => table.getColumn("created_at").toggleSorting(false)}
                                        >
                                            <i className="fal fa-sort-amount-up me-2"></i> Oldest First
                                        </li>
                                        <li
                                            className="dropdown-item cursor-pointer"
                                            onClick={() => table.getColumn("created_at").toggleSorting(true)}
                                        >
                                            <i className="fal fa-sort-amount-down me-2"></i> Newest First
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                    </tr>

                    {/* Integrated CountriesFilter */}
                    <CountriesFilter 
                        table={table} 
                        dateRangeValue={formatDateRangeDisplay()}
                        onOpenModal={() => setShowModal(true)}
                    />
                </thead>

                <tbody>
                    {table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center text-muted py-4">
                                No countries found
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
                                                id={`country-${item.id}`}
                                                checked={row.getIsSelected()}
                                                onChange={row.getToggleSelectedHandler()}
                                            />
                                            <label
                                                className="form-check-label ms-2"
                                                htmlFor={`country-${item.id}`}
                                            >
                                                {item.title}
                                            </label>
                                        </div>
                                    </td>

                                    <td colSpan={2}>
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </td>

                                    <td>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fas fa-ellipsis"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li
                                                    className="dropdown-item cursor-pointer"
                                                    onClick={() => onEdit?.(item.id)}
                                                >
                                                    <i className="fal fa-pen me-2"></i> Edit
                                                </li>
                                                <li
                                                    className="dropdown-item cursor-pointer text-danger"
                                                    onClick={() => onDelete?.(item.id)}
                                                >
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

            {/* --- DATE MODAL (Portaled to body) --- */}
            {isMounted && showModal && createPortal(
                <>
                    <div 
                        className="modal-backdrop fade show" 
                        style={{ zIndex: 1060 }}
                        onClick={() => setShowModal(false)}
                    ></div>
                    <div 
                        className="modal fade show d-block" 
                        tabIndex="-1" 
                        style={{ zIndex: 1061 }}
                        onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0" style={{ borderRadius: "15px" }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Select Date Range</h5>
                                    <button className="btn-close" onClick={() => setShowModal(false)} />
                                </div>
                                <div className="modal-body bg-light">
                                    <DateRange
                                        ranges={tempRange}
                                        onChange={(ranges) => setTempRange([ranges.selection])}
                                        editableDateInputs
                                        moveRangeOnFirstSelection={false}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button className="alert alert-light rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button className="alert alert-success rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0" onClick={confirmDateRange}>
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
}
