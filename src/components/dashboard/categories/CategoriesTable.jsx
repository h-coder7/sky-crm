"use client";

import { useMemo, useState, useEffect } from "react";
import { DateRange } from "react-date-range";
// import api from "@/app/api/api"; // 🔌 API READY (enable when backend is ready)

// 🔌 API READY (enable when backend is ready)


export default function CategoriesTable({ data = [], selectedIds = [], onSelectionChange, onEdit, onDelete }) {
    const [filters, setFilters] = useState({
        title: "",
        start_price: "",
    });
    
    // Sort State
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });


    /* ================= Date Range ================= */
    const [dateRange, setDateRange] = useState([
        { startDate: null, endDate: null, key: "selection" },
    ]);
    const [tempRange, setTempRange] = useState([
        { startDate: null, endDate: null, key: "selection" },
    ]);
    const [showModal, setShowModal] = useState(false);

    /* ================= Select ================= */


    /* ================= Filtering ================= */
    const filteredCategories = useMemo(() => {
        let result = data.filter((cat) => {
            const title = cat.title || "";
            const startPrice = cat.start_price?.toString() || "";
            const createdAt = new Date(cat.created_at);

            const start = dateRange[0].startDate;
            const end = dateRange[0].endDate;
            const dateMatch =
                !start || !end ? true : createdAt >= start && createdAt <= end;

            return (
                title.toLowerCase().includes(filters.title.toLowerCase()) &&
                startPrice.includes(filters.start_price) &&
                dateMatch
            );
        });

        // Sorting Logic
        if (sortConfig.key) {
           result.sort((a, b) => {
             let aValue = a[sortConfig.key];
             let bValue = b[sortConfig.key];

             // Handle numeric values
             if (sortConfig.key === 'start_price') {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
             }
             
             // Handle dates
             if (sortConfig.key === 'created_at') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
             }
             
             // Handle strings (case insensitive)
             if (typeof aValue === 'string') {
                 aValue = aValue.toLowerCase();
                 bValue = bValue.toLowerCase();
             }

             if (aValue < bValue) {
               return sortConfig.direction === 'asc' ? -1 : 1;
             }
             if (aValue > bValue) {
               return sortConfig.direction === 'asc' ? 1 : -1;
             }
             return 0;
           });
        }
        
        return result;
    }, [data, filters, dateRange, sortConfig]);

    const handleSort = (key, direction) => {
      setSortConfig({ key, direction });
    };

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    /* ================= Select ================= */
    const isAllSelected =
        filteredCategories.length > 0 &&
        filteredCategories.every((c) => selectedIds.includes(c.id));

    const toggleSelectAll = () => {
        if (isAllSelected) {
            const visibleIds = filteredCategories.map((c) => c.id);
            onSelectionChange(selectedIds.filter((id) => !visibleIds.includes(id)));
        } else {
            const visibleIds = filteredCategories.map((c) => c.id);
            onSelectionChange([...new Set([...selectedIds, ...visibleIds])]);
        }
    };

    const toggleSelectRow = (id) => {
        onSelectionChange(
            selectedIds.includes(id)
                ? selectedIds.filter((x) => x !== id)
                : [...selectedIds, id]
        );
    };

    /* ================= Date Helpers ================= */
    const formatDateRange = () => {
        const { startDate, endDate } = dateRange[0];
        if (!startDate || !endDate) return "";
        return `${startDate.toISOString().split("T")[0]} to ${endDate
            .toISOString()
            .split("T")[0]}`;
    };

    const confirmDateRange = () => {
        setDateRange(tempRange);
        setShowModal(false);
    };

    /* ================= Actions ================= */
    const handleEdit = (id) => onEdit?.(id);

    const handleDelete = (id) => {
        onDelete?.(id);
    };

    return (
        <div className="table-responsive position-relative">

            <table className="table align-middle">
                <thead>
                    <tr>
                        <th>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="form-check">
                                    <input className="form-check-input" id="select-all" type="checkbox" checked={isAllSelected} onChange={toggleSelectAll}/>
                                    <label className="form-check-label" for="select-all">
                                        Title
                                    </label>
                                </div>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0 dropdown-toggle" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <button className="dropdown-item" onClick={() => handleSort('title', 'asc')}>
                                            <i className="fal fa-sort-alpha-up me-2"></i> Ascending (A → Z)
                                        </button>
                                        <button className="dropdown-item" onClick={() => handleSort('title', 'desc')}>
                                            <i className="fal fa-sort-alpha-down me-2"></i> Descending (Z → A)
                                        </button>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="txt"> Start Price </div>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0 dropdown-toggle" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <button className="dropdown-item" onClick={() => handleSort('start_price', 'asc')}>
                                            <i className="fal fa-sort-numeric-up me-2"></i> Lowest Price
                                        </button>
                                        <button className="dropdown-item" onClick={() => handleSort('start_price', 'desc')}>
                                            <i className="fal fa-sort-numeric-down me-2"></i> Highest Price
                                        </button>
                                    </ul>
                                </div>
                            </div>
                        </th>
                        <th colSpan={3}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="txt"> Added On </div>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0 dropdown-toggle" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <button className="dropdown-item" onClick={() => handleSort('created_at', 'asc')}>
                                            <i className="fal fa-sort-amount-up me-2"></i> Oldest First
                                        </button>
                                        <button className="dropdown-item" onClick={() => handleSort('created_at', 'desc')}>
                                            <i className="fal fa-sort-amount-down me-2"></i> Newest First
                                        </button>
                                    </ul>
                                </div>
                            </div>
                        </th>
                    </tr>

                    {/* Search Row */}
                    <tr className="search-tr">
                        <td>
                            <input
                                className="form-control"
                                placeholder="Title"
                                value={filters.title}
                                onChange={(e) =>
                                    handleFilterChange("title", e.target.value)
                                }
                            />
                        </td>
                        <td>
                            <input
                                className="form-control"
                                placeholder="Start Price"
                                value={filters.start_price}
                                onChange={(e) =>
                                    handleFilterChange("start_price", e.target.value)
                                }
                            />
                        </td>
                        <td colSpan={3}>
                            <input
                                className="form-control"
                                placeholder="Select Date Range"
                                readOnly
                                value={formatDateRange()}
                                onClick={() => setShowModal(true)}
                            />
                        </td>
                        {/* <td></td> */}
                    </tr>
                </thead>

                <tbody>
                    {!filteredCategories.length && (
                        <tr>
                            <td colSpan={5} className="text-center text-muted py-4">
                                No categories found
                            </td>
                        </tr>
                    )}

                    {filteredCategories.map((cat) => (
                        <tr key={cat.id}>
                            <td>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={selectedIds.includes(cat.id)}
                                        onChange={() => toggleSelectRow(cat.id)}
                                        id={cat.id}
                                    />
                                    <label className="form-check-label" for={cat.id}>
                                        {cat.title}
                                    </label>
                                </div>
                            </td>
                            <td>{cat.start_price}</td>
                            <td colSpan={2}>{cat.created_at}</td>
                            <td>
                                <div className="dropdown">
                                    <button
                                        className="btn bg-transparent border-0 p-0 dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                    >
                                        <i className="fas fa-ellipsis"></i>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <button
                                            className="dropdown-item"
                                            onClick={() => handleEdit(cat.id)}
                                        >
                                            <i className="fal fa-pen me-2"></i> Edit
                                        </button>
                                        <button
                                            className="dropdown-item text-danger"
                                            onClick={() => handleDelete(cat.id)}
                                        >
                                            <i className="fal fa-trash me-2"></i> Delete
                                        </button>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Backdrop */}
            {showModal && <div className="modal-backdrop fade show"></div>}

            {/* Date Range Modal */}
            <div className={`modal fade ${showModal ? "show d-block" : ""}`}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Select Date Range</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowModal(false)}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <DateRange
                                ranges={tempRange}
                                onChange={(ranges) =>
                                    setTempRange([ranges.selection])
                                }
                                editableDateInputs
                                moveRangeOnFirstSelection={false}
                            />
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={confirmDateRange}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
