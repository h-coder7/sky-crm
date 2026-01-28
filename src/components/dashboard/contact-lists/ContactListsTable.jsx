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
import ContactListsFilter from "./ContactListsFilter";

/**
 * 🔌 API READY: To connect to backend, replace the `data` prop with fetched data.
 */

export default function ContactListsTable({
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

    // Date Range State
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
            id: "name",
            accessorKey: "name",
        },
        {
            id: "address",
            accessorKey: "address",
        },
        {
            id: "phone",
            accessorKey: "phone",
        },
        {
            id: "email",
            accessorKey: "email",
        },
        {
            id: "top_customer",
            accessorKey: "top_customer",
            filterFn: (row, columnId, filterValue) => {
                if (filterValue === undefined || filterValue === "") return true;
                return row.getValue(columnId) === filterValue;
            },
        },
        {
            id: "decision_maker_status",
            accessorKey: "decision_maker_status",
            filterFn: (row, columnId, filterValue) => {
                if (!filterValue) return true;
                return row.getValue(columnId) === filterValue;
            },
        },
        {
            id: "status",
            accessorKey: "status",
            filterFn: (row, columnId, filterValue) => {
                if (!filterValue) return true;
                return row.getValue(columnId) === filterValue;
            },
        },
        {
            id: "employee",
            accessorKey: "employee",
            filterFn: (row, columnId, filterValue) => {
                if (!filterValue) return true;
                return row.getValue(columnId) === filterValue;
            },
        },
        {
            id: "country",
            accessorKey: "country",
        },
        {
            id: "company",
            accessorKey: "company",
        },
        {
            id: "budget",
            accessorKey: "budget",
        },
        {
            id: "avg_stands_year",
            accessorKey: "avg_stands_year",
        },
        {
            id: "avg_events_year",
            accessorKey: "avg_events_year",
        },
        {
            id: "company_website_url",
            accessorKey: "company_website_url",
        },
        {
            id: "job_title",
            accessorKey: "job_title",
        },
        {
            id: "sector",
            accessorKey: "sector",
        },
        {
            id: "notes",
            accessorKey: "notes",
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

    // Extract unique employees for the filter select
    const employees = useMemo(() => {
        const unique = [...new Set(data.map(item => item.employee).filter(Boolean))];
        return unique.sort().map(emp => ({ value: emp, label: emp }));
    }, [data]);

    /* ======================================================================
       6. JSX
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
                                                id="select-all-contacts"
                                                type="checkbox"
                                                checked={table.getIsAllPageRowsSelected()}
                                                onChange={table.getToggleAllPageRowsSelectedHandler()}
                                            />
                                            <label className="form-check-label ms-2" htmlFor="select-all-contacts">
                                                Name
                                            </label>
                                        </div>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("name").toggleSorting(false)}>
                                                    <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("name").toggleSorting(true)}>
                                                    <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Address</span>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("address").toggleSorting(false)}>
                                                    <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("address").toggleSorting(true)}>
                                                    <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Phone</span>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("phone").toggleSorting(false)}>
                                                    <i className="fal fa-sort-numeric-up me-2"></i> Ascending
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("phone").toggleSorting(true)}>
                                                    <i className="fal fa-sort-numeric-down me-2"></i> Descending
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Email</span>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("email").toggleSorting(false)}>
                                                    <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("email").toggleSorting(true)}>
                                                    <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Top Cust.</span>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("top_customer").toggleSorting(false)}>
                                                    <i className="fal fa-sort-amount-up me-2"></i> (No → Yes)
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("top_customer").toggleSorting(true)}>
                                                    <i className="fal fa-sort-amount-down me-2"></i> (Yes → No)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>D.M. Status</span>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("decision_maker_status").toggleSorting(false)}>
                                                    <i className="fal fa-sort-alpha-up me-2"></i> Ascending
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("decision_maker_status").toggleSorting(true)}>
                                                    <i className="fal fa-sort-alpha-down me-2"></i> Descending
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
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("status").toggleSorting(false)}>
                                                    <i className="fal fa-sort-alpha-up me-2"></i> Ascending
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("status").toggleSorting(true)}>
                                                    <i className="fal fa-sort-alpha-down me-2"></i> Descending
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
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("employee").toggleSorting(false)}>
                                                    <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("employee").toggleSorting(true)}>
                                                    <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Country</span>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("country").toggleSorting(false)}>
                                                    <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("country").toggleSorting(true)}>
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
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("company").toggleSorting(false)}>
                                                    <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("company").toggleSorting(true)}>
                                                    <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Budget</span>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("budget").toggleSorting(false)}>
                                                    <i className="fal fa-sort-numeric-up me-2"></i> Low → High
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("budget").toggleSorting(true)}>
                                                    <i className="fal fa-sort-numeric-down me-2"></i> High → Low
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Stands/Yr</span>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("avg_stands_year").toggleSorting(false)}>
                                                    <i className="fal fa-sort-numeric-up me-2"></i> Low → High
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("avg_stands_year").toggleSorting(true)}>
                                                    <i className="fal fa-sort-numeric-down me-2"></i> High → Low
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Events/Yr</span>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("avg_events_year").toggleSorting(false)}>
                                                    <i className="fal fa-sort-numeric-up me-2"></i> Low → High
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("avg_events_year").toggleSorting(true)}>
                                                    <i className="fal fa-sort-numeric-down me-2"></i> High → Low
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Website</span>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("company_website_url").toggleSorting(false)}>
                                                    <i className="fal fa-sort-alpha-up me-2"></i> Ascending
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("company_website_url").toggleSorting(true)}>
                                                    <i className="fal fa-sort-alpha-down me-2"></i> Descending
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Job Title</span>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("job_title").toggleSorting(false)}>
                                                    <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("job_title").toggleSorting(true)}>
                                                    <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Sector</span>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("sector").toggleSorting(false)}>
                                                    <i className="fal fa-sort-alpha-up me-2"></i> (A → Z)
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("sector").toggleSorting(true)}>
                                                    <i className="fal fa-sort-alpha-down me-2"></i> (Z → A)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Notes</span>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("notes").toggleSorting(false)}>
                                                    <i className="fal fa-sort-alpha-up me-2"></i> Ascending
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("notes").toggleSorting(true)}>
                                                    <i className="fal fa-sort-alpha-down me-2"></i> Descending
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Added On</span>
                                        <div className="dropdown">
                                            <button className="btn bg-transparent border-0 p-0" data-bs-toggle="dropdown">
                                                <i className="fat fa-sort"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("created_at").toggleSorting(false)}>
                                                    <i className="fal fa-sort-amount-up me-2"></i> Oldest First
                                                </li>
                                                <li className="dropdown-item cursor-pointer" onClick={() => table.getColumn("created_at").toggleSorting(true)}>
                                                    <i className="fal fa-sort-amount-down me-2"></i> Newest First
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </th>
                                <th></th>
                            </tr>

                            {/* Integrated ContactListsFilter */}
                            <ContactListsFilter
                                table={table}
                                employees={employees}
                                dateRangeValue={formatDateRangeDisplay()}
                                onOpenModal={() => setShowModal(true)}
                            />
                        </thead>

                        <tbody>
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={19} className="text-center text-muted py-4">
                                        No contacts found
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
                                                        id={`contact-${item.id}`}
                                                        checked={row.getIsSelected()}
                                                        onChange={row.getToggleSelectedHandler()}
                                                    />
                                                    <label
                                                        className="form-check-label ms-2"
                                                        htmlFor={`contact-${item.id}`}
                                                    >
                                                        {item.name}
                                                    </label>
                                                </div>
                                            </td>
                                            <td>{item.address}</td>
                                            <td>{item.phone}</td>
                                            <td>{item.email}</td>
                                            <td>{item.top_customer ? "Yes" : "No"}</td>
                                            <td>{item.decision_maker_status}</td>
                                            <td>{item.status}</td>
                                            <td>{item.employee}</td>
                                            <td>{item.country}</td>
                                            <td>{item.company}</td>
                                            <td>{item.budget}</td>
                                            <td>{item.avg_stands_year}</td>
                                            <td>{item.avg_events_year}</td>
                                            <td>{item.company_website_url}</td>
                                            <td>{item.job_title}</td>
                                            <td>{item.sector}</td>
                                            <td>
                                                <div className="text-pop fsz-12">
                                                    {item.notes?.length > 20 ? item.notes.slice(0, 20) + "..." : item.notes}
                                                    <span className="tooltip-text">{item.notes}</span>
                                                </div>
                                            </td>
                                            <td>
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
                </div>
            </div>

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
