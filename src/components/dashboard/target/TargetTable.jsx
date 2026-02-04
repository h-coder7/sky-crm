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
import TableColumnDnd from "../../../components/shared/table/TableColumnDnd";
import SortableTh from "../../../components/shared/table/SortableTh";
import SortableRow from "../../../components/shared/table/SortableRow";

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
            enableSorting: true,
            draggable: false,
        },
        {
            id: "year",
            accessorKey: "year",
            header: "Year",
            enableSorting: true,
            draggable: true,
        },
        {
            id: "product",
            accessorKey: "product",
            header: "Product",
            enableSorting: true,
            draggable: true,
        },
        {
            id: "target",
            accessorKey: "target",
            header: "Target",
            enableSorting: true,
            draggable: true,
        },
        {
            id: "columnActions",
            header: "Actions",
            enableSorting: false,
            draggable: false,
        },
    ], []);

    const [columnOrder, setColumnOrder] = useState(columns.map(c => c.id));
    const [columnVisibility, setColumnVisibility] = useState({
        employee: true,
        year: true,
        product: true,
        target: true,
        columnActions: true,
    });

    const visibleColumnOrder = useMemo(() =>
        columnOrder.filter(id => columnVisibility[id] !== false),
        [columnOrder, columnVisibility]
    );

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

    const resetAllFilters = () => {
        setColumnFilters([]);
        setSorting([]);
    };

    /* ======================================================================
       5. JSX
       ====================================================================== */
    return (

        <>

            <div className="table-content">
                <div className="table-responsive position-relative">
                    <TableColumnDnd onDragEnd={handleColumnDragEnd}>
                        <table className="table align-middle">
                            <thead>
                                <SortableRow items={visibleColumnOrder}>
                                    {/* Employee Column */}
                                    {table.getColumn("employee").getIsVisible() && (
                                        <SortableTh id="employee" key="employee" disabled className="sticky-col">
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

                                            <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="fat fa-sort fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => table.getColumn("employee").toggleSorting(false)}>
                                                        <i className="fal fa-sort-alpha-up me-2 text-muted"></i> (A → Z)
                                                    </li>
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => table.getColumn("employee").toggleSorting(true)}>
                                                        <i className="fal fa-sort-alpha-down me-2 text-muted"></i> (Z → A)
                                                    </li>
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}

                                    {/* Regular Sortable Columns */}
                                    {visibleColumnOrder
                                        .filter(id => !['employee', 'columnActions'].includes(id))
                                        .map(id => {
                                            const column = table.getColumn(id);
                                            return (
                                                <SortableTh id={id} key={id}>
                                                    <span>{column.columnDef.header || id.charAt(0).toUpperCase() + id.slice(1)}</span>
                                                    <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                        <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                            <i className="fat fa-sort fsz-12"></i>
                                                        </button>
                                                        <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                            {id === 'year' || id === 'target' ? (
                                                                <>
                                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => column.toggleSorting(false)}>
                                                                        <i className="fal fa-sort-numeric-up me-2 text-muted"></i> {id === 'year' ? 'Ascending' : 'Lowest First'}
                                                                    </li>
                                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => column.toggleSorting(true)}>
                                                                        <i className="fal fa-sort-numeric-down me-2 text-muted"></i> {id === 'year' ? 'Descending' : 'Highest First'}
                                                                    </li>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => column.toggleSorting(false)}>
                                                                        <i className="fal fa-sort-alpha-up me-2 text-muted"></i> (A → Z)
                                                                    </li>
                                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => column.toggleSorting(true)}>
                                                                        <i className="fal fa-sort-alpha-down me-2 text-muted"></i> (Z → A)
                                                                    </li>
                                                                </>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </SortableTh>
                                            );
                                        })
                                    }

                                    {/* Actions Header (Visibility Toggle) */}
                                    {table.getColumn("columnActions").getIsVisible() && (
                                        <SortableTh id="columnActions" key="columnActions" disabled>
                                            <div className="dropdown icon-30 ms-auto">
                                                <button className="btn bg-white border-0 p-0 icon-30" data-bs-toggle="dropdown" type="button" data-bs-auto-close="outside">
                                                    <i className="fas fa-ellipsis-v fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    {table.getAllColumns()
                                                        .filter(column => column.getCanHide())
                                                        .map(column => (
                                                            <li key={column.id} className="dropdown-item fsz-12 py-2">
                                                                <div className="form-check border-0 p-0 mb-0 min-vh-0">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input float-none me-2"
                                                                        checked={column.getIsVisible()}
                                                                        onChange={column.getToggleVisibilityHandler()}
                                                                        id={`col-vis-${column.id}`}
                                                                    />
                                                                    <label className="form-check-label" htmlFor={`col-vis-${column.id}`}>
                                                                        {column.columnDef.header}
                                                                    </label>
                                                                </div>
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}
                                </SortableRow>

                                {/* Integrated TargetFilter */}
                                <TargetFilter
                                    table={table}
                                    onReset={resetAllFilters}
                                    columnOrder={columnOrder}
                                />
                            </thead>

                            <tbody>
                                {table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={visibleColumnOrder.length} className="text-center text-muted py-4 fsz-12">
                                            No targets found
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => {
                                        const item = row.original;

                                        return (
                                            <SortableRow key={row.id} items={visibleColumnOrder}>
                                                {visibleColumnOrder.map(colId => {
                                                    const column = table.getColumn(colId);
                                                    if (!column || !column.getIsVisible()) return null;

                                                    if (colId === 'employee') {
                                                        return (
                                                            <td key={colId} id={colId} className="sticky-col">
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={`target-${item.id}`}
                                                                        checked={row.getIsSelected()}
                                                                        onChange={row.getToggleSelectedHandler()}
                                                                    />
                                                                    <label
                                                                        className="form-check-label ms-2 mb-0"
                                                                        htmlFor={`target-${item.id}`}
                                                                    >
                                                                        {item.employee}
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        );
                                                    }

                                                    if (colId === 'columnActions') {
                                                        return (
                                                            <td key={colId} id={colId}>
                                                                <div className="dropdown">
                                                                    <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                                        <i className="fas fa-ellipsis fsz-14 text-muted"></i>
                                                                    </button>
                                                                    <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                                        <li
                                                                            className="dropdown-item cursor-pointer fsz-12 py-2"
                                                                            onClick={() => onEdit?.(item.id)}
                                                                        >
                                                                            <i className="fal fa-pen me-2 text-muted"></i> Edit
                                                                        </li>
                                                                        <li
                                                                            className="dropdown-item cursor-pointer text-danger fsz-12 py-2"
                                                                            onClick={() => onDelete?.(item.id)}
                                                                        >
                                                                            <i className="fal fa-trash me-2 text-muted"></i> Delete
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                        );
                                                    }

                                                    return (
                                                        <td key={colId} id={colId} className="fsz-13 text-muted">
                                                            {item[column.columnDef.accessorKey] || "-"}
                                                        </td>
                                                    );
                                                })}
                                            </SortableRow>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </TableColumnDnd>
                </div>
            </div>

            {/* --- PAGINATION CONTROLS --- */}
            <div className="d-flex justify-content-between align-items-center mt-3 react-pagination">
                <div className="text-muted fsz-12 fw-500">
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
                    <span className="d-flex align-items-center px-3 fsz-12 fw-500">
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
