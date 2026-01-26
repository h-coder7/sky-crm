"use client";

import { useMemo, useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import { createPortal } from "react-dom";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import EmployeesFilter from "./EmployeesFilter";

export default function EmployeesTable({ data = [], selectedIds = [], onSelectionChange, onEdit, onDelete }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const columns = useMemo(
        () => [
            {
                id: "name",
                accessorKey: "name",
            },
            {
                id: "email",
                accessorKey: "email",
            },
            {
                id: "phone",
                accessorKey: "phone",
            },
            {
                id: "role",
                accessorKey: "role",
                filterFn: "equals",
            },
            {
                id: "sector",
                accessorKey: "sector",
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
            },
        ],
        []
    );

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

    useEffect(() => {
        const newSelection = {};
        selectedIds.forEach((id) => {
            const index = data.findIndex((item) => item.id === id);
            if (index !== -1) newSelection[index] = true;
        });
        setRowSelection(newSelection);
    }, [selectedIds, data]);

    /* ================= Date Range ================= */
    const [dateRange, setDateRange] = useState([
        { startDate: null, endDate: null, key: "selection" },
    ]);
    const [tempRange, setTempRange] = useState([
        { startDate: null, endDate: null, key: "selection" },
    ]);
    const [showModal, setShowModal] = useState(false);

    const formatDateRangeDisplay = () => {
        const { startDate, endDate } = dateRange[0];
        if (!startDate || !endDate) return "";
        return `${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]}`;
    };

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
                                                id="select-all-employees"
                                                type="checkbox"
                                                checked={table.getIsAllPageRowsSelected()}
                                                onChange={table.getToggleAllPageRowsSelectedHandler()}
                                            />
                                            <label className="form-check-label ms-2" htmlFor="select-all-employees">
                                                Name
                                            </label>
                                        </div>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0 dropdown-toggle" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <button className="dropdown-item" onClick={() => table.getColumn("name")?.toggleSorting(false)}>
                                                        <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item" onClick={() => table.getColumn("name")?.toggleSorting(true)}>
                                                        <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="txt"> Email </div>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0 dropdown-toggle" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <button className="dropdown-item" onClick={() => table.getColumn("email")?.toggleSorting(false)}>
                                                        <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item" onClick={() => table.getColumn("email")?.toggleSorting(true)}>
                                                        <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="txt"> Phone </div>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0 dropdown-toggle" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <button className="dropdown-item" onClick={() => table.getColumn("phone")?.toggleSorting(false)}>
                                                        <i className="fal fa-sort-numeric-up me-2"></i> (1 → 9)
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item" onClick={() => table.getColumn("phone")?.toggleSorting(true)}>
                                                        <i className="fal fa-sort-numeric-down me-2"></i> (9 → 1)
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="txt"> Role </div>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0 dropdown-toggle" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <button className="dropdown-item" onClick={() => table.getColumn("role")?.toggleSorting(false)}>
                                                        <i className="fal fa-sort-alpha-up me-2"></i> A → Z
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item" onClick={() => table.getColumn("role")?.toggleSorting(true)}>
                                                        <i className="fal fa-sort-alpha-down me-2"></i> Z → A
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="txt"> Sector </div>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0 dropdown-toggle" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <button className="dropdown-item" onClick={() => table.getColumn("sector")?.toggleSorting(false)}>
                                                        <i className="fal fa-sort-alpha-up me-2"></i> A → Z
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item" onClick={() => table.getColumn("sector")?.toggleSorting(true)}>
                                                        <i className="fal fa-sort-alpha-down me-2"></i> Z → A
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th colSpan={2}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="txt"> Added On </div>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0 dropdown-toggle" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <button className="dropdown-item" onClick={() => table.getColumn("created_at")?.toggleSorting(false)}>
                                                        <i className="fal fa-sort-amount-up me-2"></i> Oldest First
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item" onClick={() => table.getColumn("created_at")?.toggleSorting(true)}>
                                                        <i className="fal fa-sort-amount-down me-2"></i> Newest First
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                            </tr>

                            <EmployeesFilter
                                table={table}
                                dateRangeValue={formatDateRangeDisplay()}
                                onOpenModal={() => setShowModal(true)}
                            />
                        </thead>

                        <tbody>
                            {!table.getRowModel().rows.length && (
                                <tr>
                                    <td colSpan={7} className="text-center text-muted py-4">
                                        No employees found
                                    </td>
                                </tr>
                            )}

                            {table.getRowModel().rows.map((row) => {
                                const employee = row.original;
                                return (
                                    <tr key={row.id}>
                                        <td>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={row.getIsSelected()}
                                                    onChange={row.getToggleSelectedHandler()}
                                                    id={`employee-${employee.id}`}
                                                />
                                                <label className="form-check-label ms-2 mb-0" htmlFor={`employee-${employee.id}`}>
                                                    {employee.name}
                                                </label>
                                            </div>
                                        </td>
                                        <td>{employee.email}</td>
                                        <td>{employee.phone}</td>
                                        <td>
                                            {(() => {
                                                const getRoleBadgeClass = (role) => {
                                                    switch (role) {
                                                        case "Head Department": return "alert-warning";
                                                        case "Senior Business Development Manager": return "alert-success";
                                                        case "Business Development Manager": return "alert-secondary";
                                                        case "Senior Business Development Executive": return "role-purple";
                                                        case "Business Development Executive": return "role-teal";
                                                        default: return "alert-primary";
                                                    }
                                                };
                                                return (
                                                    <span className={`alert rounded-pill py-1 px-3 fsz-10 border-0 mb-0 ${getRoleBadgeClass(employee.role)}`}>
                                                        {employee.role}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td>
                                            <div className="text-pop fsz-12">
                                                {employee.sector?.length > 20 ? employee.sector.slice(0, 20) + "..." : employee.sector}
                                                <span className="tooltip-text">{employee.sector}</span>
                                            </div>
                                        </td>
                                        <td>{employee.created_at}</td>
                                        <td>
                                            <div className="dropdown">
                                                <button
                                                    className="btn bg-transparent border-0 p-0 dropdown-toggle"
                                                    data-bs-toggle="dropdown"
                                                >
                                                    <i className="fas fa-ellipsis"></i>
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <li>
                                                        <button
                                                            className="dropdown-item"
                                                            onClick={() => onEdit?.(employee.id)}
                                                        >
                                                            <i className="fal fa-pen me-2"></i> Edit
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="dropdown-item text-danger"
                                                            onClick={() => onDelete?.(employee.id)}
                                                        >
                                                            <i className="fal fa-trash me-2"></i> Delete
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
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

            {/* --- DATE MODAL (Portaled to body) --- */}
            {isMounted && showModal && createPortal(
                <>
                    <div
                        className="modal-backdrop fade show"
                        onClick={() => setShowModal(false)}
                    ></div>
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0">
                                <div className="modal-header">
                                    <h5 className="modal-title">Select Date Range</h5>
                                    <button className="btn-close" onClick={() => setShowModal(false)} />
                                </div>
                                <div className="modal-body px-0">
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
        </>
    );
}
