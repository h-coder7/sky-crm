"use client";

import { useMemo, useState, useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import TableColumnDnd from "../../../components/shared/table/TableColumnDnd";
import SortableTh from "../../../components/shared/table/SortableTh";
import SortableRow from "../../../components/shared/table/SortableRow";
import DateRangeModal from "../../../components/shared/DateRangeModal";
import DailyLogFilter from "./DailyLogFilter";

export default function DailyLogTable({
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
    const [columnVisibility, setColumnVisibility] = useState({});

    // Date Range State
    const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: "selection" }]);
    const [tempRange, setTempRange] = useState([{ startDate: null, endDate: null, key: "selection" }]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const newSelection = {};
        selectedIds.forEach((id) => {
            const index = data.findIndex((item) => item.id === id);
            if (index !== -1) newSelection[index] = true;
        });
        setRowSelection(newSelection);
    }, [selectedIds, data]);

    const columns = useMemo(() => [
        { id: "employee", accessorKey: "employee", header: "Employee", enableSorting: true, draggable: false },
        { id: "contact_list", accessorKey: "contact_list", header: "Contact List", enableSorting: true, draggable: true },
        { id: "job_title", accessorKey: "job_title", header: "Job Title", enableSorting: true, draggable: true },
        { id: "company", accessorKey: "company", header: "Company", enableSorting: true, draggable: true },
        { id: "date", accessorKey: "date", header: "Date", enableSorting: true, draggable: true },
        { id: "type", accessorKey: "type", header: "Type", enableSorting: true, draggable: true },
        { id: "objective", accessorKey: "objective", header: "Objective", enableSorting: true, draggable: true },
        { id: "estimated_sale", accessorKey: "estimated_sale", header: "Estimated Sale", enableSorting: true, draggable: true },
        { id: "contact_status", accessorKey: "contact_status", header: "Contact Status", enableSorting: true, draggable: true },
        { id: "next_action", accessorKey: "next_action", header: "Next Action", enableSorting: true, draggable: true },
        { id: "next_contact", accessorKey: "next_contact", header: "Next Contact", enableSorting: true, draggable: true },
        { id: "created_at", accessorKey: "created_at", header: "Added ON", enableSorting: true, draggable: true },
        { id: "columnActions", header: "Actions", enableSorting: false, draggable: false },
    ], []);

    const [columnOrder, setColumnOrder] = useState(columns.map(c => c.id));

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
                    <TableColumnDnd id="daily-log-table" onDragEnd={handleColumnDragEnd}>
                        <table className="table align-middle">
                            <thead>
                                <SortableRow items={visibleColumnOrder}>
                                    {table.getColumn("employee").getIsVisible() && (
                                        <SortableTh id="employee" key="employee" disabled className="sticky-col">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    id="select-all-daily-logs"
                                                    type="checkbox"
                                                    checked={table.getIsAllPageRowsSelected()}
                                                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                                                />
                                                <label className="form-check-label ms-2" htmlFor="select-all-daily-logs">
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

                                    {visibleColumnOrder
                                        .filter(id => !['employee', 'columnActions'].includes(id))
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

                                    {table.getColumn("columnActions").getIsVisible() && (
                                        <SortableTh id="columnActions" key="columnActions" disabled>
                                            <div className="dropdown icon-30 ms-auto">
                                                <button className="btn bg-white border-0 p-0 icon-30" data-bs-toggle="dropdown" type="button" data-bs-auto-close="outside">
                                                    <i className="fas fa-ellipsis-v fsz-12"></i>
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 p-3" onClick={(e) => e.stopPropagation()}>
                                                    <h6 className="fsz-11 text-uppercase fw-600 text-muted mb-3 border-bottom pb-2">Toggle Columns</h6>
                                                    {table.getAllLeafColumns().map(column => {
                                                        if (column.id === 'columnActions' || column.id === 'employee') return null;
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

                                <DailyLogFilter
                                    table={table}
                                    onReset={resetAllFilters}
                                    columnOrder={columnOrder}
                                    dateRangeValue={formatDateRangeDisplay()}
                                    onOpenModal={() => setShowModal(true)}
                                />
                            </thead>

                            <tbody>
                                {table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={visibleColumnOrder.length} className="text-center py-4 text-muted fsz-12">
                                            No daily logs found
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
                                                                        id={`daily-log-${item.id}`}
                                                                        checked={row.getIsSelected()}
                                                                        onChange={row.getToggleSelectedHandler()}
                                                                    />
                                                                    <label className="form-check-label ms-2 mb-0" htmlFor={`daily-log-${item.id}`}>
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
                                                                        <li className="dropdown-item cursor-pointer fsz-12 py-2" onClick={() => onEdit?.(item.id)}>
                                                                            <i className="fal fa-pen me-2 text-muted"></i> Edit
                                                                        </li>
                                                                        <li className="dropdown-item cursor-pointer text-danger fsz-12 py-2" onClick={() => onDelete?.(item.id)}>
                                                                            <i className="fal fa-trash me-2 text-muted"></i> Delete
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                        );
                                                    }

                                                    return (
                                                        <td key={colId} id={colId}>
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

            <div className="d-flex justify-content-between align-items-center mt-3 react-pagination">
                <div className="text-muted fsz-12 fw-500">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                    {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of {table.getFilteredRowModel().rows.length} entries
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        <i className="fal fa-angle-left"></i>
                    </button>
                    <span className="d-flex align-items-center px-3 fsz-12 fw-500">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        <i className="fal fa-angle-right"></i>
                    </button>
                </div>
            </div>

            <DateRangeModal
                show={showModal}
                initialRange={tempRange}
                onClose={() => setShowModal(false)}
                onApply={confirmDateRange}
            />
        </>
    );
}
