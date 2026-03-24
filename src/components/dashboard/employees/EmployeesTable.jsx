"use client";

import { useMemo, useState, useEffect } from "react";
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
import DateRangeModal from "../../../components/shared/DateRangeModal";

import EmployeesFilter from "./EmployeesFilter";

export default function EmployeesTable({ data = [], selectedIds = [], onSelectionChange, onEdit, onDelete, onView }) {
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
            { id: "selection", header: "", enableSorting: false, draggable: false },
            { id: "name", accessorKey: "name", header: "Name", enableSorting: true, draggable: false },
            { id: "email", accessorKey: "email", header: "Email", enableSorting: true, draggable: true },
            { id: "phone", accessorKey: "phone", header: "Phone", enableSorting: true, draggable: true },
            { id: "role", accessorKey: "role", header: "Role", enableSorting: true, draggable: true, filterFn: "equals" },
            { id: "sector", accessorKey: "sector", header: "Sector", enableSorting: true, draggable: true },
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
            },
            { id: "columnActions", header: "Actions", enableSorting: false, draggable: false },
        ],
        []
    );

    const [columnOrder, setColumnOrder] = useState(columns.map(c => c.id));
    const [columnVisibility, setColumnVisibility] = useState({});

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

    const resetAllFilters = () => {
        setDateRange([{ startDate: null, endDate: null, key: "selection" }]);
        setTempRange([{ startDate: null, endDate: null, key: "selection" }]);
        table.resetColumnFilters();
    };

    const visibleColumnOrder = useMemo(() => {
        return columnOrder.filter(id => table.getColumn(id)?.getIsVisible());
    }, [columnOrder, columnVisibility, table]);

    return (

        <>

            <div className="table-content">
                <div className="table-responsive position-relative">
                    <TableColumnDnd id="employees-table" onDragEnd={handleColumnDragEnd}>
                        <table className="table align-middle">
                            <thead>
                                <SortableRow items={visibleColumnOrder}>
                                    {/* Name Column */}
                                    {table.getColumn("name").getIsVisible() && (
                                        <SortableTh id="name" key="name" disabled className="sticky-col position-relative ps-5">
                                            <div className="form-check position-absolute top-50 start-0 translate-middle ms-4">
                                                <input
                                                    className="form-check-input mt-0 cursor-pointer"
                                                    id="select-all-employees"
                                                    type="checkbox"
                                                    checked={table.getIsAllPageRowsSelected()}
                                                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                                                />
                                                <label className="form-check-label" htmlFor="select-all-employees"></label>
                                            </div>
                                            <span>Name</span>

                                            <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="fat fa-sort fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => table.getColumn("name").toggleSorting(false)}>
                                                        <i className="fal fa-sort-alpha-up me-2 text-muted"></i> (A → Z)
                                                    </li>
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => table.getColumn("name").toggleSorting(true)}>
                                                        <i className="fal fa-sort-alpha-down me-2 text-muted"></i> (Z → A)
                                                    </li>
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}

                                    {/* Filter out specific columns that already have custom Th or are handled separately */}
                                    {visibleColumnOrder
                                        .filter(id => !['name', 'columnActions', 'selection'].includes(id))
                                        .map(id => {
                                            const column = table.getColumn(id);
                                            return (
                                                <SortableTh id={id} key={id}>
                                                    <span>{column.columnDef.header}</span>
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
                                                        if (column.id === 'columnActions' || column.id === 'name' || column.id === 'selection') return null;
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

                                <EmployeesFilter
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
                                        <td colSpan={visibleColumnOrder.length} className="text-center py-4 text-muted fsz-12">
                                            No employees found
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => {
                                        const item = row.original;
                                        return (
                                            <SortableRow key={row.id} items={visibleColumnOrder}>
                                                {table.getColumn("name").getIsVisible() && (
                                                    <td className="position-relative ps-5" id="name" key="name">
                                                        <div className="form-check position-absolute top-50 start-0 translate-middle ms-4">
                                                            <input
                                                                className="form-check-input mt-0 cursor-pointer"
                                                                type="checkbox"
                                                                id={`employee-${item.id}`}
                                                                checked={row.getIsSelected()}
                                                                onChange={row.getToggleSelectedHandler()}
                                                            />
                                                            <label className="form-check-label" htmlFor={`employee-${item.id}`}></label>
                                                        </div>
                                                        <div
                                                            className="d-flex align-items-center hover-underline"
                                                            onClick={() => onView?.(item)}
                                                            title="View Details"
                                                            style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                                                        >
                                                            <span>{item.name}</span>
                                                        </div>
                                                    </td>
                                                )}

                                                {table.getColumn("email").getIsVisible() && (
                                                    <td id="email" key="email" className="">{item.email}</td>
                                                )}

                                                {table.getColumn("phone").getIsVisible() && (
                                                    <td id="phone" key="phone" className="">{item.phone}</td>
                                                )}

                                                {table.getColumn("role").getIsVisible() && (
                                                    <td id="role" key="role">
                                                        <span className={`alert rounded-pill py-1 px-3 fsz-10 border-0 mb-0 ${item.role === 'Head Department' ? 'alert-warning' : item.role === 'Senior Business Development Manager' ? 'alert-success' : item.role === 'Business Development Manager' ? 'alert-secondary' : item.role === 'Senior Business Development Executive' ? 'role-purple' : item.role === 'Business Development Executive' ? 'role-teal' : 'alert-primary'}`}>
                                                            {item.role}
                                                        </span>
                                                    </td>
                                                )}

                                                {table.getColumn("sector").getIsVisible() && (
                                                    <td id="sector" key="sector">
                                                        <div className="text-pop fsz-12">
                                                            {item.sector?.length > 20 ? item.sector.slice(0, 20) + "..." : item.sector}
                                                            <span className="tooltip-text">{item.sector}</span>
                                                        </div>
                                                    </td>
                                                )}

                                                {table.getColumn("created_at").getIsVisible() && (
                                                    <td id="created_at" key="created_at" className="">
                                                        {item.created_at}
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
