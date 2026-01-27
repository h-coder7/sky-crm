"use client";

import { useMemo, useState, useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import TargetFilter from "./TargetFilter";

export default function TargetTable({
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
            id: "employee",
            accessorKey: "employee",
            header: "Employee",
        },
        {
            id: "year",
            accessorKey: "year",
            header: "Year",
        },
        {
            id: "product",
            accessorKey: "product",
            header: "Product",
        },
        {
            id: "target",
            accessorKey: "target",
            header: "Target",
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
       5. JSX
       ====================================================================== */
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
                                                id="select-all-targets"
                                                type="checkbox"
                                                checked={table.getIsAllPageRowsSelected()}
                                                onChange={table.getToggleAllPageRowsSelectedHandler()}
                                            />
                                            <label className="form-check-label ms-2" htmlFor="select-all-targets">
                                                Employee
                                            </label>
                                        </div>

                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li
                                                    className="dropdown-item cursor-pointer"
                                                    onClick={() => table.getColumn("employee").toggleSorting(false)}
                                                >
                                                    <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                                </li>
                                                <li
                                                    className="dropdown-item cursor-pointer"
                                                    onClick={() => table.getColumn("employee").toggleSorting(true)}
                                                >
                                                    <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>

                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Year</span>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li
                                                    className="dropdown-item cursor-pointer"
                                                    onClick={() => table.getColumn("year").toggleSorting(false)}
                                                >
                                                    <i className="fal fa-sort-numeric-up me-2"></i> Ascending
                                                </li>
                                                <li
                                                    className="dropdown-item cursor-pointer"
                                                    onClick={() => table.getColumn("year").toggleSorting(true)}
                                                >
                                                    <i className="fal fa-sort-numeric-down me-2"></i> Descending
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
                                            <ul className="dropdown-menu">
                                                <li
                                                    className="dropdown-item cursor-pointer"
                                                    onClick={() => table.getColumn("product").toggleSorting(false)}
                                                >
                                                    <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                                </li>
                                                <li
                                                    className="dropdown-item cursor-pointer"
                                                    onClick={() => table.getColumn("product").toggleSorting(true)}
                                                >
                                                    <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>

                                <th colSpan={2}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Target</span>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li
                                                    className="dropdown-item cursor-pointer"
                                                    onClick={() => table.getColumn("target").toggleSorting(false)}
                                                >
                                                    <i className="fal fa-sort-numeric-up me-2"></i> Lowest First
                                                </li>
                                                <li
                                                    className="dropdown-item cursor-pointer"
                                                    onClick={() => table.getColumn("target").toggleSorting(true)}
                                                >
                                                    <i className="fal fa-sort-numeric-down me-2"></i> Highest First
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>

                            </tr>

                            {/* Integrated TargetFilter */}
                            <TargetFilter table={table} />
                        </thead>

                        <tbody>
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">
                                        No targets found
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
                                                        id={`target-${item.id}`}
                                                        checked={row.getIsSelected()}
                                                        onChange={row.getToggleSelectedHandler()}
                                                    />
                                                    <label
                                                        className="form-check-label ms-2"
                                                        htmlFor={`target-${item.id}`}
                                                    >
                                                        {item.employee}
                                                    </label>
                                                </div>
                                            </td>
                                            <td>{item.year}</td>
                                            <td>{item.product}</td>
                                            <td>{item.target}</td>
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

        </>

    );
}
