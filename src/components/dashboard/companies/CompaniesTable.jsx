"use client";

import { useMemo, useState, useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import CompaniesFilter from "./CompaniesFilter";
import TableColumnDnd from "../../shared/table/TableColumnDnd";
import SortableTh from "../../shared/table/SortableTh";
import SortableRow from "../../shared/table/SortableRow";
import DateRangeModal from "../../shared/DateRangeModal";

export default function CompaniesTable({
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
    const [columnVisibility, setColumnVisibility] = useState({});
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Date Range State
    const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: "selection" }]);
    const [tempRange, setTempRange] = useState([{ startDate: null, endDate: null, key: "selection" }]);
    const [showModal, setShowModal] = useState(false);

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
            header: "Title",
            enableSorting: true,
            draggable: false,
        },
        {
            id: "address",
            accessorKey: "address",
            header: "Address",
            enableSorting: true,
            draggable: true,
        },
        {
            id: "description",
            accessorKey: "description",
            header: "Description",
            enableSorting: true,
            draggable: true,
        },
        {
            id: "domain",
            accessorKey: "domain",
            header: "Domain",
            enableSorting: true,
            draggable: true,
        },
        {
            id: "sector",
            accessorKey: "sector",
            header: "Sector",
            enableSorting: true,
            draggable: true,
            filterFn: (row, columnId, filterValue) => {
                if (!filterValue) return true;
                return row.getValue(columnId) === filterValue;
            },
        },
        {
            id: "country",
            accessorKey: "country",
            header: "Country",
            enableSorting: true,
            draggable: true,
            filterFn: (row, columnId, filterValue) => {
                if (!filterValue) return true;
                return row.getValue(columnId) === filterValue;
            },
        },
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
        {
            id: "columnActions",
            header: "Actions",
            enableSorting: false,
            draggable: false,
        },
    ], []);

    const [columnOrder, setColumnOrder] = useState(columns.map(c => c.id));

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
    const confirmDateRange = (newRange) => {
        const selectedRange = newRange[0];
        setDateRange(newRange);
        setTempRange(newRange);
        setShowModal(false);

        if (selectedRange.startDate && selectedRange.endDate) {
            table.getColumn("created_at")?.setFilterValue([
                selectedRange.startDate,
                selectedRange.endDate,
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
        setDateRange([{ startDate: null, endDate: null, key: "selection" }]);
        setTempRange([{ startDate: null, endDate: null, key: "selection" }]);
    };

    const visibleColumnOrder = useMemo(() => {
        return columnOrder.filter(id => table.getColumn(id)?.getIsVisible());
    }, [columnOrder, columnVisibility, table]);

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
                                    {/* Title Column */}
                                    {table.getColumn("title").getIsVisible() && (
                                        <SortableTh id="title" key="title" disabled className="sticky-col">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    id="select-all-companies"
                                                    type="checkbox"
                                                    checked={table.getIsAllPageRowsSelected()}
                                                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                                                />
                                                <label className="form-check-label ms-2" htmlFor="select-all-companies">
                                                    Title
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

                                    {/* Regular Sortable Columns */}
                                    {visibleColumnOrder
                                        .filter(id => !['title', 'columnActions'].includes(id))
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
                                                            <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => column.toggleSorting(false)}>
                                                                <i className="fal fa-sort-alpha-up me-2 text-muted"></i> (A → Z)
                                                            </li>
                                                            <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => column.toggleSorting(true)}>
                                                                <i className="fal fa-sort-alpha-down me-2 text-muted"></i> (Z → A)
                                                            </li>
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
                                                                        onChange={(e) => {
                                                                            column.getToggleVisibilityHandler()(e);
                                                                        }}
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

                                <CompaniesFilter
                                    table={table}
                                    dateRangeValue={formatDateRangeDisplay()}
                                    onOpenModal={() => setShowModal(true)}
                                    onReset={resetAllFilters}
                                    columnOrder={columnOrder}
                                />
                            </thead>

                            <tbody>
                                {table.getRowModel().rows.length === 0 ? (
                                    <tr><td colSpan={visibleColumnOrder.length} className="text-center py-4 text-muted fsz-12">No companies found</td></tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => {
                                        const item = row.original;
                                        return (
                                            <SortableRow key={row.id} items={visibleColumnOrder}>
                                                {visibleColumnOrder.map(colId => {
                                                    const column = table.getColumn(colId);
                                                    if (!column || !column.getIsVisible()) return null;

                                                    if (colId === 'title') {
                                                        return (
                                                            <td key={colId} id={colId} className="sticky-col">
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={`company-${item.id}`}
                                                                        checked={row.getIsSelected()}
                                                                        onChange={row.getToggleSelectedHandler()}
                                                                    />
                                                                    <label className="form-check-label ms-2 mb-0" htmlFor={`company-${item.id}`}>
                                                                        {item.title}
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        );
                                                    }

                                                    if (colId === 'description') {
                                                        return (
                                                            <td key={colId} id={colId}>
                                                                <div className="text-pop fsz-12">
                                                                    {item.description?.length > 30 ? item.description.slice(0, 30) + "..." : item.description}
                                                                    <span className="tooltip-text">{item.description}</span>
                                                                </div>
                                                            </td>
                                                        );
                                                    }

                                                    if (colId === 'domain') {
                                                        return (
                                                            <td key={colId} id={colId}>
                                                                {item.domain ? (
                                                                    <a href={item.domain} target="_blank" rel="noopener noreferrer" className="text-primary fsz-13">
                                                                        {item.domain.replace(/^https?:\/\//, '').split('/')[0]}
                                                                    </a>
                                                                ) : "-"}
                                                            </td>
                                                        );
                                                    }

                                                    if (colId === 'created_at') {
                                                        return (
                                                            <td key={colId} id={colId} className="fsz-13 text-muted">
                                                                {isMounted ? new Date(item.created_at).toLocaleDateString() : "-"}
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
                                                        );
                                                    }

                                                    // Default cell
                                                    return (
                                                        <td key={colId} id={colId} className="fsz-13 text-muted text-nowrap">
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
            {/* --- PAGINATION CONTROLS --- */}
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
                    <span className="d-flex align-items-center px-3 fsz-12">
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
            {/* --- DATE MODAL (New Component) --- */}
            <DateRangeModal
                show={showModal}
                initialRange={tempRange}
                onClose={() => setShowModal(false)}
                onApply={confirmDateRange}
            />

        </>

    );
}
