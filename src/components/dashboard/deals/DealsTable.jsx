"use client";

import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { DateRange } from "react-date-range";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import DealsFilter from "./DealsFilter";

export default function DealsTable({ 
    data = [], 
    selectedIds = [], 
    onSelectionChange, 
    onEdit, 
    onDelete 
}) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: "selection" }]);
    const [tempRange, setTempRange] = useState([{ startDate: null, endDate: null, key: "selection" }]);
    const [showModal, setShowModal] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const newSelection = {};
        selectedIds.forEach((id) => {
            const index = data.findIndex((item) => item.id === id);
            if (index !== -1) newSelection[index] = true;
        });
        setRowSelection(newSelection);
    }, [selectedIds, data]);

    const columns = useMemo(() => [
        { id: "title", accessorKey: "title" },
        { id: "description", accessorKey: "description" },
        { id: "start_date", accessorKey: "start_date" },
        { id: "end_date", accessorKey: "end_date" },
        { id: "employee", accessorKey: "employee" },
        { id: "product", accessorKey: "product" },
        { id: "contact_list", accessorKey: "contact_list" },
        { id: "company", accessorKey: "company" },
        { 
            id: "status", 
            accessorKey: "status",
            filterFn: (row, columnId, filterValue) => {
                if (!filterValue) return true;
                return String(row.getValue(columnId)) === String(filterValue);
            },
            sortingFn: (rowA, rowB, columnId) => {
                const a = parseInt(rowA.getValue(columnId)) || 0;
                const b = parseInt(rowB.getValue(columnId)) || 0;
                return a - b;
            }
        },
        { 
            id: "amount", 
            accessorKey: "amount",
            sortingFn: "basic"
        },
        { 
            id: "month", 
            accessorKey: "month",
            filterFn: (row, columnId, filterValue) => {
                if (!filterValue) return true;
                return String(row.getValue(columnId)) === String(filterValue);
            },
            sortingFn: (rowA, rowB, columnId) => {
                const a = parseInt(rowA.getValue(columnId)) || 0;
                const b = parseInt(rowB.getValue(columnId)) || 0;
                return a - b;
            }
        },
        {
            id: "created_at",
            accessorKey: "created_at",
            filterFn: (row, columnId, filterValue) => {
                if (!filterValue || !filterValue[0] || !filterValue[1]) return true;
                const rowDate = new Date(row.getValue(columnId));
                const [start, end] = filterValue;
                return rowDate >= start && rowDate <= end;
            },
            sortingFn: (rowA, rowB, columnId) => {
                const a = new Date(rowA.getValue(columnId));
                const b = new Date(rowB.getValue(columnId));
                return a.getTime() - b.getTime();
            }
        },
    ], []);

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

    const confirmDateRange = () => {
        setDateRange(tempRange);
        setShowModal(false);
        if (tempRange[0].startDate && tempRange[0].endDate) {
            table.getColumn("created_at")?.setFilterValue([tempRange[0].startDate, tempRange[0].endDate]);
        } else {
            table.getColumn("created_at")?.setFilterValue(undefined);
        }
    };

    const formatDateRangeDisplay = () => {
        const { startDate, endDate } = dateRange[0];
        if (!startDate || !endDate) return "";
        return `${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]}`;
    };

    const handleSort = (columnId, desc) => {
        table.getColumn(columnId).toggleSorting(desc);
    };

    return (
        <>
            <div className="table-content">
                <div className="table-responsive position-relative">
                    <table className="table align-middle">
                <thead>
                    <tr>
                        <th>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        id="select-all"
                                        type="checkbox"
                                        checked={table.getIsAllPageRowsSelected()}
                                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="select-all">Title</label>
                                </div>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu fsz-12">
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("title", false)}>
                                            <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                        </li>
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("title", true)}>
                                            <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Description</span>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu fsz-12">
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("description", false)}>
                                            <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                        </li>
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("description", true)}>
                                            <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Start Date</span>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu fsz-12">
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("start_date", false)}>
                                            <i className="fal fa-sort-amount-up me-2"></i> Oldest First
                                        </li>
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("start_date", true)}>
                                            <i className="fal fa-sort-amount-down me-2"></i> Newest First
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>End Date</span>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu fsz-12">
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("end_date", false)}>
                                            <i className="fal fa-sort-amount-up me-2"></i> Oldest First
                                        </li>
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("end_date", true)}>
                                            <i className="fal fa-sort-amount-down me-2"></i> Newest First
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Employee</span>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu fsz-12">
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("employee", false)}>
                                            <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                        </li>
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("employee", true)}>
                                            <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Product</span>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu fsz-12">
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("product", false)}>
                                            <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                        </li>
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("product", true)}>
                                            <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Contact List</span>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu fsz-12">
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("contact_list", false)}>
                                            <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                        </li>
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("contact_list", true)}>
                                            <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Company</span>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu fsz-12">
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("company", false)}>
                                            <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                        </li>
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("company", true)}>
                                            <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Status</span>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu fsz-12">
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("status", false)}>
                                            <i className="fal fa-sort-numeric-up me-2"></i> Ascending
                                        </li>
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("status", true)}>
                                            <i className="fal fa-sort-numeric-down me-2"></i> Descending
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Amount</span>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu fsz-12">
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("amount", false)}>
                                            <i className="fal fa-sort-numeric-up me-2"></i> Lowest
                                        </li>
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("amount", true)}>
                                            <i className="fal fa-sort-numeric-down me-2"></i> Highest
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Month</span>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu fsz-12">
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("month", false)}>
                                            <i className="fal fa-sort-numeric-up me-2"></i> Ascending
                                        </li>
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("month", true)}>
                                            <i className="fal fa-sort-numeric-down me-2"></i> Descending
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th colSpan={2}>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>Added ON</span>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu fsz-12">
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("created_at", false)}>
                                            <i className="fal fa-sort-amount-up me-2"></i> Oldest First
                                        </li>
                                        <li className="dropdown-item cursor-pointer" onClick={() => handleSort("created_at", true)}>
                                            <i className="fal fa-sort-amount-down me-2"></i> Newest First
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </th>
                    </tr>
                    <DealsFilter 
                        table={table} 
                        dateRangeValue={formatDateRangeDisplay()}
                        onOpenModal={() => setShowModal(true)}
                    />
                </thead>
                <tbody>
                    {table.getRowModel().rows.length === 0 ? (
                        <tr><td colSpan={13} className="text-center py-4">No deals found</td></tr>
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
                                                id={`deal-${item.id}`}
                                                checked={row.getIsSelected()}
                                                onChange={row.getToggleSelectedHandler()}
                                            />
                                            <label className="form-check-label ms-2 fsz-12" htmlFor={`deal-${item.id}`}>
                                                {item.title}
                                            </label>
                                        </div>
                                    </td>
                                    <td className="fsz-12">{item.description}</td>
                                    <td className="fsz-12">{item.start_date}</td>
                                    <td className="fsz-12">{item.end_date}</td>
                                    <td className="fsz-12">{item.employee}</td>
                                    <td className="fsz-12">{item.product}</td>
                                    <td className="fsz-12">{item.contact_list}</td>
                                    <td className="fsz-12">{item.company}</td>
                                    <td className="fsz-12">{item.status}</td>
                                    <td className="fsz-12">{item.amount}</td>
                                    <td className="fsz-12">{item.month}</td>
                                    <td className="fsz-12">{item.created_at}</td>
                                    <td>
                                        <div className="dropdown fsz-12">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fas fa-ellipsis fsz-12"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer fsz-12" onClick={() => onEdit?.(item.id)}>Edit</li>
                                                <li className="dropdown-item cursor-pointer text-danger fsz-12" onClick={() => onDelete?.(item.id)}>Delete</li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
                </div>
            </div>

            {/* --- PAGINATION CONTROLS --- */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted fsz-12">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}{" "}
                    of {table.getFilteredRowModel().rows.length} entries
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <i className="fal fa-angle-double-left"></i>
                    </button>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <i className="fal fa-angle-left"></i>
                    </button>
                    <span className="d-flex align-items-center px-3 fsz-12">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <i className="fal fa-angle-right"></i>
                    </button>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <i className="fal fa-angle-double-right"></i>
                    </button>
                </div>
            </div>

            {isMounted && showModal && createPortal(
                <>
                    <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>
                    <div className="modal fade show d-block" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content border-0">
                                <div className="modal-header">
                                    <h5 className="modal-title">Select Date Range</h5>
                                    <button className="btn-close" onClick={() => setShowModal(false)} />
                                </div>
                                <div className="modal-body bg-light">
                                    <DateRange ranges={tempRange} onChange={(ranges) => setTempRange([ranges.selection])} editableDateInputs moveRangeOnFirstSelection={false} />
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
        </>
    );
}
