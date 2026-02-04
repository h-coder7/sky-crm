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

// Shared Reusable Table Components (Modular DnD)
import TableColumnDnd from "../../../components/shared/table/TableColumnDnd";
import SortableRow from "../../../components/shared/table/SortableRow";
import SortableTh from "../../../components/shared/table/SortableTh";

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
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

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
        { id: "title", accessorKey: "title", header: "Name", enableSorting: true, draggable: false },
        {
            id: "created_at",
            accessorKey: "created_at",
            header: "Added On",
            enableSorting: true,
            draggable: true,
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
        { id: "columnActions", header: "Actions", enableSorting: false, draggable: false },
    ], []);

    const [columnOrder, setColumnOrder] = useState(columns.map(c => c.id));
    const [columnVisibility, setColumnVisibility] = useState({});

    /* ======================================================================
       4. Table Instance
       ====================================================================== */
    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnFilters, rowSelection, pagination, columnOrder, columnVisibility },
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
        onColumnOrderChange: setColumnOrder,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    /* ======================================================================
       5. Helpers
       ====================================================================== */
    const handleColumnDragEnd = (activeId, overId) => {
        setColumnOrder((items) => {
            const oldIndex = items.indexOf(activeId);
            const newIndex = items.indexOf(overId);
            if (oldIndex !== -1 && newIndex !== -1) {
                const newItems = [...items];
                const [movedItem] = newItems.splice(oldIndex, 1);
                newItems.splice(newIndex, 0, movedItem);
                return newItems;
            }
            return items;
        });
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

    const resetAllFilters = () => {
        setDateRange([{ startDate: null, endDate: null, key: "selection" }]);
        setTempRange([{ startDate: null, endDate: null, key: "selection" }]);
        table.resetColumnFilters();
    };

    const visibleColumnOrder = useMemo(() => {
        return columnOrder.filter(id => table.getColumn(id)?.getIsVisible());
    }, [columnOrder, columnVisibility, table]);

    const formatDateRangeDisplay = () => {
        const { startDate, endDate } = dateRange[0];
        if (!startDate || !endDate) return "";
        return `${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]}`;
    };

    /* ======================================================================
       6. JSX
       ====================================================================== */
    return (

        <>

            <div className="table-content">
                <div className="table-responsive position-relative">
                    <TableColumnDnd onDragEnd={handleColumnDragEnd}>
                        <table className="table align-middle">
                            <thead>
                                <SortableRow items={visibleColumnOrder}>
                                    {/* Name Column */}
                                    {table.getColumn("title").getIsVisible() && (
                                        <SortableTh id="title" key="title" disabled className="sticky-col">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    id="select-all-countries"
                                                    type="checkbox"
                                                    checked={table.getIsAllPageRowsSelected()}
                                                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                                                />
                                                <label className="form-check-label ms-2 d-flex align-items-center mb-0" htmlFor="select-all-countries">
                                                    Name
                                                </label>
                                            </div>

                                            <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="fat fa-sort fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => table.getColumn("title").toggleSorting(false)}>
                                                        <i className="fal fa-sort-alpha-up me-2 text-muted"></i> (A → Z)
                                                    </li>
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => table.getColumn("title").toggleSorting(true)}>
                                                        <i className="fal fa-sort-alpha-down me-2 text-muted"></i> (Z → A)
                                                    </li>
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}

                                    {/* Added On Column */}
                                    {table.getColumn("created_at").getIsVisible() && (
                                        <SortableTh id="created_at" key="created_at">
                                            <span>Added On</span>
                                            <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="fat fa-sort fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    <li className="dropdown-item fsz-12 py-2 cursor-pointer" onClick={() => table.getColumn("created_at").toggleSorting(false)}>
                                                        <i className="fal fa-sort-amount-up me-2 text-muted"></i> Oldest First
                                                    </li>
                                                    <li className="dropdown-item fsz-12 py-2 cursor-pointer" onClick={() => table.getColumn("created_at").toggleSorting(true)}>
                                                        <i className="fal fa-sort-amount-down me-2 text-muted"></i> Newest First
                                                    </li>
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}

                                    {/* Actions Header (Visibility Toggle) */}
                                    {table.getColumn("columnActions").getIsVisible() && (
                                        <SortableTh id="columnActions" key="columnActions" disabled>
                                            <div className="dropdown icon-30 ms-auto">
                                                <button className="btn bg-white border-0 p-0 icon-30" data-bs-toggle="dropdown" type="button" data-bs-auto-close="outside">
                                                    <i className="fas fa-ellipsis-v fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 p-3" onClick={(e) => e.stopPropagation()}>
                                                    <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Toggle Columns</h6>
                                                    {table.getAllLeafColumns().map(column => {
                                                        if (column.id === 'columnActions' || column.id === 'title') return null;
                                                        return (
                                                            <li key={column.id} className="mb-2 last-0">
                                                                <div className="form-check fsz-12" onClick={(e) => e.stopPropagation()}>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        checked={column.getIsVisible()}
                                                                        onChange={(e) => column.getToggleVisibilityHandler()(e)}
                                                                        id={`toggle-${column.id}`}
                                                                    />
                                                                    <label className="form-check-label ms-2 cursor-pointer fw-500" htmlFor={`toggle-${column.id}`}>
                                                                        {column.columnDef.header || column.id}
                                                                    </label>
                                                                </div>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}
                                </SortableRow>

                                <CountriesFilter
                                    table={table}
                                    dateRangeValue={formatDateRangeDisplay()}
                                    onOpenModal={() => setShowModal(true)}
                                    onReset={resetAllFilters}
                                    columnOrder={columnOrder}
                                />
                            </thead>

                            <tbody>
                                {table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={visibleColumnOrder.length} className="text-center text-muted py-4">
                                            No countries found
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => {
                                        const item = row.original;
                                        return (
                                            <SortableRow key={row.id} items={visibleColumnOrder}>
                                                {table.getColumn("title").getIsVisible() && (
                                                    <td id="title" key="title" className="sticky-col">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`country-${item.id}`}
                                                                checked={row.getIsSelected()}
                                                                onChange={row.getToggleSelectedHandler()}
                                                            />
                                                            <label className="form-check-label ms-2 d-flex align-items-center mb-0" htmlFor={`country-${item.id}`}>
                                                                {item.title}
                                                            </label>
                                                        </div>
                                                    </td>
                                                )}

                                                {table.getColumn("created_at").getIsVisible() && (
                                                    <td id="created_at" key="created_at" className="fsz-13 text-muted">
                                                        {new Date(item.created_at).toLocaleDateString()}
                                                    </td>
                                                )}

                                                {table.getColumn("columnActions").getIsVisible() && (
                                                    <td id="columnActions" key="columnActions">
                                                        <div className="dropdown">
                                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                                <i className="fas fa-ellipsis fsz-14 text-muted"></i>
                                                            </button>
                                                            <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                                <li>
                                                                    <button className="dropdown-item fsz-12 py-2" onClick={() => onEdit?.(item.id)}>
                                                                        <i className="fal fa-pen me-2 text-muted"></i> Edit
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button className="dropdown-item text-danger fsz-12 py-2" onClick={() => onDelete?.(item.id)}>
                                                                        <i className="fal fa-trash me-2 text-muted"></i> Delete
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                )}
                                            </SortableRow>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </TableColumnDnd>
                </div>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3 react-pagination">
                <div className="text-muted fsz-12">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}{" "}
                    of {table.getFilteredRowModel().rows.length} entries
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                        <i className="fal fa-angle-double-left"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        <i className="fal fa-angle-left"></i>
                    </button>
                    <span className="d-flex align-items-center px-3 fsz-12 fw-500">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        <i className="fal fa-angle-right"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
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
