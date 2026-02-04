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
        { id: "title", accessorKey: "title", header: "Title", enableSorting: true, draggable: false },
        { id: "description", accessorKey: "description", header: "Description", enableSorting: true, draggable: true },
        { id: "start_date", accessorKey: "start_date", header: "Start Date", enableSorting: true, draggable: true },
        { id: "end_date", accessorKey: "end_date", header: "End Date", enableSorting: true, draggable: true },
        { id: "employee", accessorKey: "employee", header: "Employee", enableSorting: true, draggable: true },
        { id: "product", accessorKey: "product", header: "Product", enableSorting: true, draggable: true },
        { id: "contact_list", accessorKey: "contact_list", header: "Contact List", enableSorting: true, draggable: true },
        { id: "company", accessorKey: "company", header: "Company", enableSorting: true, draggable: true },
        {
            id: "status",
            accessorKey: "status",
            header: "Status",
            enableSorting: true,
            draggable: true,
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
            header: "Amount",
            enableSorting: true,
            draggable: true,
            sortingFn: "basic"
        },
        {
            id: "month",
            accessorKey: "month",
            header: "Month",
            enableSorting: true,
            draggable: true,
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
            header: "Added ON",
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
                return a.getTime() - b.getTime();
            }
        },
        { id: "columnActions", header: "Actions", enableSorting: false, draggable: false },
    ], []);

    const [columnOrder, setColumnOrder] = useState(columns.map(c => c.id));
    const [columnVisibility, setColumnVisibility] = useState({});

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnFilters, rowSelection, pagination, columnOrder, columnVisibility },
        enableRowSelection: true,
        onColumnOrderChange: setColumnOrder,
        onColumnVisibilityChange: setColumnVisibility,
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
                                                    id="select-all-deals"
                                                    type="checkbox"
                                                    checked={table.getIsAllPageRowsSelected()}
                                                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                                                />
                                                <label className="form-check-label ms-2" htmlFor="select-all-deals">
                                                    Title
                                                </label>
                                            </div>

                                            <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="fat fa-sort fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => handleSort("title", false)}>
                                                        <i className="fal fa-sort-alpha-up me-2 text-muted"></i> (A → Z)
                                                    </li>
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => handleSort("title", true)}>
                                                        <i className="fal fa-sort-alpha-down me-2 text-muted"></i> (Z → A)
                                                    </li>
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}

                                    {/* Description Column */}
                                    {table.getColumn("description").getIsVisible() && (
                                        <SortableTh id="description" key="description">
                                            <span>Description</span>
                                            <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="fat fa-sort fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => handleSort("description", false)}>
                                                        <i className="fal fa-sort-alpha-up me-2 text-muted"></i> (A → Z)
                                                    </li>
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => handleSort("description", true)}>
                                                        <i className="fal fa-sort-alpha-down me-2 text-muted"></i> (Z → A)
                                                    </li>
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}

                                    {/* Start Date Column */}
                                    {table.getColumn("start_date").getIsVisible() && (
                                        <SortableTh id="start_date" key="start_date">
                                            <span>Start Date</span>
                                            <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="fat fa-sort fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    <li className="dropdown-item fsz-12 py-2 cursor-pointer" onClick={() => handleSort("start_date", false)}>
                                                        <i className="fal fa-sort-amount-up me-2 text-muted"></i> Oldest First
                                                    </li>
                                                    <li className="dropdown-item fsz-12 py-2 cursor-pointer" onClick={() => handleSort("start_date", true)}>
                                                        <i className="fal fa-sort-amount-down me-2 text-muted"></i> Newest First
                                                    </li>
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}

                                    {/* End Date Column */}
                                    {table.getColumn("end_date").getIsVisible() && (
                                        <SortableTh id="end_date" key="end_date">
                                            <span>End Date</span>
                                            <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="fat fa-sort fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    <li className="dropdown-item fsz-12 py-2 cursor-pointer" onClick={() => handleSort("end_date", false)}>
                                                        <i className="fal fa-sort-amount-up me-2 text-muted"></i> Oldest First
                                                    </li>
                                                    <li className="dropdown-item fsz-12 py-2 cursor-pointer" onClick={() => handleSort("end_date", true)}>
                                                        <i className="fal fa-sort-amount-down me-2 text-muted"></i> Newest First
                                                    </li>
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}

                                    {/* Employee Column */}
                                    {table.getColumn("employee").getIsVisible() && (
                                        <SortableTh id="employee" key="employee">
                                            <span>Employee</span>
                                            <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="fat fa-sort fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => handleSort("employee", false)}>
                                                        <i className="fal fa-sort-alpha-up me-2 text-muted"></i> (A → Z)
                                                    </li>
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => handleSort("employee", true)}>
                                                        <i className="fal fa-sort-alpha-down me-2 text-muted"></i> (Z → A)
                                                    </li>
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}

                                    {/* Product Column */}
                                    {table.getColumn("product").getIsVisible() && (
                                        <SortableTh id="product" key="product">
                                            <span>Product</span>
                                            <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="fat fa-sort fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => handleSort("product", false)}>
                                                        <i className="fal fa-sort-alpha-up me-2 text-muted"></i> (A → Z)
                                                    </li>
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => handleSort("product", true)}>
                                                        <i className="fal fa-sort-alpha-down me-2 text-muted"></i> (Z → A)
                                                    </li>
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}

                                    {/* Contact List Column */}
                                    {table.getColumn("contact_list").getIsVisible() && (
                                        <SortableTh id="contact_list" key="contact_list">
                                            <span>Contact List</span>
                                            <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="fat fa-sort fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => handleSort("contact_list", false)}>
                                                        <i className="fal fa-sort-alpha-up me-2 text-muted"></i> (A → Z)
                                                    </li>
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => handleSort("contact_list", true)}>
                                                        <i className="fal fa-sort-alpha-down me-2 text-muted"></i> (Z → A)
                                                    </li>
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}

                                    {/* Company Column */}
                                    {table.getColumn("company").getIsVisible() && (
                                        <SortableTh id="company" key="company">
                                            <span>Company</span>
                                            <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="fat fa-sort fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => handleSort("company", false)}>
                                                        <i className="fal fa-sort-alpha-up me-2 text-muted"></i> (A → Z)
                                                    </li>
                                                    <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => handleSort("company", true)}>
                                                        <i className="fal fa-sort-alpha-down me-2 text-muted"></i> (Z → A)
                                                    </li>
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}

                                    {/* Status Column */}
                                    {table.getColumn("status").getIsVisible() && (
                                        <SortableTh id="status" key="status">
                                            <span>Status</span>
                                            <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="fat fa-sort fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    <li className="dropdown-item fsz-12 py-2 cursor-pointer" onClick={() => handleSort("status", false)}>
                                                        <i className="fal fa-sort-numeric-up me-2 text-muted"></i> Lowest
                                                    </li>
                                                    <li className="dropdown-item fsz-12 py-2 cursor-pointer" onClick={() => handleSort("status", true)}>
                                                        <i className="fal fa-sort-numeric-down me-2 text-muted"></i> Highest
                                                    </li>
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}

                                    {/* Amount Column */}
                                    {table.getColumn("amount").getIsVisible() && (
                                        <SortableTh id="amount" key="amount">
                                            <span>Amount</span>
                                            <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="fat fa-sort fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    <li className="dropdown-item fsz-12 py-2 cursor-pointer" onClick={() => handleSort("amount", false)}>
                                                        <i className="fal fa-sort-numeric-up me-2 text-muted"></i> Lowest
                                                    </li>
                                                    <li className="dropdown-item fsz-12 py-2 cursor-pointer" onClick={() => handleSort("amount", true)}>
                                                        <i className="fal fa-sort-numeric-down me-2 text-muted"></i> Highest
                                                    </li>
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}

                                    {/* Month Column */}
                                    {table.getColumn("month").getIsVisible() && (
                                        <SortableTh id="month" key="month">
                                            <span>Month</span>
                                            <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="fat fa-sort fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    <li className="dropdown-item fsz-12 py-2 cursor-pointer" onClick={() => handleSort("month", false)}>
                                                        <i className="fal fa-sort-numeric-up me-2 text-muted"></i> Lowest
                                                    </li>
                                                    <li className="dropdown-item fsz-12 py-2 cursor-pointer" onClick={() => handleSort("month", true)}>
                                                        <i className="fal fa-sort-numeric-down me-2 text-muted"></i> Highest
                                                    </li>
                                                </ul>
                                            </div>
                                        </SortableTh>
                                    )}

                                    {/* Created At Column */}
                                    {table.getColumn("created_at").getIsVisible() && (
                                        <SortableTh id="created_at" key="created_at">
                                            <span>Added ON</span>
                                            <div className="dropdown ms-auto" onClick={(e) => e.stopPropagation()}>
                                                <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                    <i className="fat fa-sort fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                                                    <li className="dropdown-item fsz-12 py-2 cursor-pointer" onClick={() => handleSort("created_at", false)}>
                                                        <i className="fal fa-sort-amount-up me-2 text-muted"></i> Oldest First
                                                    </li>
                                                    <li className="dropdown-item fsz-12 py-2 cursor-pointer" onClick={() => handleSort("created_at", true)}>
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
                                <DealsFilter
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
                                            No deals found
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
                                                                id={`deal-${item.id}`}
                                                                checked={row.getIsSelected()}
                                                                onChange={row.getToggleSelectedHandler()}
                                                            />
                                                            <label className="form-check-label ms-2 d-flex align-items-center mb-0" htmlFor={`deal-${item.id}`}>
                                                                {item.title}
                                                            </label>
                                                        </div>
                                                    </td>
                                                )}

                                                {table.getColumn("description").getIsVisible() && (
                                                    <td id="description" key="description" className="fsz-13 text-muted text-nowrap">{item.description}</td>
                                                )}

                                                {table.getColumn("start_date").getIsVisible() && (
                                                    <td id="start_date" key="start_date" className="fsz-13 text-muted text-nowrap">{item.start_date}</td>
                                                )}

                                                {table.getColumn("end_date").getIsVisible() && (
                                                    <td id="end_date" key="end_date" className="fsz-13 text-muted text-nowrap">{item.end_date}</td>
                                                )}

                                                {table.getColumn("employee").getIsVisible() && (
                                                    <td id="employee" key="employee" className="fsz-13 text-muted text-nowrap">{item.employee}</td>
                                                )}

                                                {table.getColumn("product").getIsVisible() && (
                                                    <td id="product" key="product" className="fsz-13 text-muted text-nowrap">{item.product}</td>
                                                )}

                                                {table.getColumn("contact_list").getIsVisible() && (
                                                    <td id="contact_list" key="contact_list" className="fsz-13 text-muted text-nowrap">{item.contact_list}</td>
                                                )}

                                                {table.getColumn("company").getIsVisible() && (
                                                    <td id="company" key="company" className="fsz-13 text-muted text-nowrap">{item.company}</td>
                                                )}

                                                {table.getColumn("status").getIsVisible() && (
                                                    <td id="status" key="status" className="fsz-13 text-muted text-nowrap">{item.status}</td>
                                                )}

                                                {table.getColumn("amount").getIsVisible() && (
                                                    <td id="amount" key="amount" className="fsz-13 text-muted text-nowrap">{item.amount}</td>
                                                )}

                                                {table.getColumn("month").getIsVisible() && (
                                                    <td id="month" key="month" className="fsz-13 text-muted text-nowrap">{item.month}</td>
                                                )}

                                                {table.getColumn("created_at").getIsVisible() && (
                                                    <td id="created_at" key="created_at" className="fsz-13 text-muted text-nowrap">
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

            {isMounted && showModal && createPortal(
                <>
                    <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>
                    <div className="modal fade show d-block" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0">
                                <div className="modal-header">
                                    <h5 className="modal-title">Select Date Range</h5>
                                    <button className="btn-close" onClick={() => setShowModal(false)} />
                                </div>
                                <div className="modal-body px-0">
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
