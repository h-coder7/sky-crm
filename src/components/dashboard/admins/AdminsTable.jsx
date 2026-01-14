"use client";

import { useMemo, useState } from "react";
import { DateRange } from "react-date-range";

export default function AdminsTable({ data = [], selectedIds = [], onSelectionChange, onEdit, onDelete }) {
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
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

    /* ================= Filtering ================= */
    const filteredAdmins = useMemo(() => {
        let result = data.filter((admin) => {
            const name = admin.name || "";
            const email = admin.email || "";
            const phone = admin.phone || "";
            const role = admin.role || "";
            const createdAt = new Date(admin.created_at);

            const start = dateRange[0].startDate;
            const end = dateRange[0].endDate;
            const dateMatch =
                !start || !end ? true : createdAt >= start && createdAt <= end;

            return (
                name.toLowerCase().includes(filters.name.toLowerCase()) &&
                email.toLowerCase().includes(filters.email.toLowerCase()) &&
                phone.includes(filters.phone) &&
                (filters.role === "" || role.toLowerCase() === filters.role.toLowerCase()) &&
                dateMatch
            );
        });

        // Sorting Logic
        if (sortConfig.key) {
           result.sort((a, b) => {
             let aValue = a[sortConfig.key];
             let bValue = b[sortConfig.key];

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
        filteredAdmins.length > 0 &&
        filteredAdmins.every((c) => selectedIds.includes(c.id));

    const toggleSelectAll = () => {
        if (isAllSelected) {
            const visibleIds = filteredAdmins.map((c) => c.id);
            onSelectionChange(selectedIds.filter((id) => !visibleIds.includes(id)));
        } else {
            const visibleIds = filteredAdmins.map((c) => c.id);
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

            <table className="table table-hover align-middle">
                <thead>
                    <tr>
                        <th>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="form-check">
                                    <input className="form-check-input" id="select-all" type="checkbox" checked={isAllSelected} onChange={toggleSelectAll}/>
                                    <label className="form-check-label" htmlFor="select-all">
                                        Name
                                    </label>
                                </div>
                                <div className="dropdown">
                                    <button className="btn bg-transparent border-0 p-0 dropdown-toggle" data-bs-toggle="dropdown">
                                        <i className="fat fa-sort"></i>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <button className="dropdown-item" onClick={() => handleSort('name', 'asc')}>
                                            <i className="fal fa-sort-alpha-up me-2"></i> Ascending (A → Z)
                                        </button>
                                        <button className="dropdown-item" onClick={() => handleSort('name', 'desc')}>
                                            <i className="fal fa-sort-alpha-down me-2"></i> Descending (Z → A)
                                        </button>
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
                                        <button className="dropdown-item" onClick={() => handleSort('email', 'asc')}>
                                            <i className="fal fa-sort-alpha-up me-2"></i> Ascending (A → Z)
                                        </button>
                                        <button className="dropdown-item" onClick={() => handleSort('email', 'desc')}>
                                            <i className="fal fa-sort-alpha-down me-2"></i> Descending (Z → A)
                                        </button>
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
                                        <button className="dropdown-item" onClick={() => handleSort('phone', 'asc')}>
                                            <i className="fal fa-sort-numeric-up me-2"></i> Ascending
                                        </button>
                                        <button className="dropdown-item" onClick={() => handleSort('phone', 'desc')}>
                                            <i className="fal fa-sort-numeric-down me-2"></i> Descending
                                        </button>
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
                                        <button className="dropdown-item" onClick={() => handleSort('role', 'asc')}>
                                            <i className="fal fa-sort-alpha-up me-2"></i> A → Z
                                        </button>
                                        <button className="dropdown-item" onClick={() => handleSort('role', 'desc')}>
                                            <i className="fal fa-sort-alpha-down me-2"></i> Z → A
                                        </button>
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
                                placeholder="Name"
                                value={filters.name}
                                onChange={(e) =>
                                    handleFilterChange("name", e.target.value)
                                }
                            />
                        </td>
                        <td>
                            <input
                                className="form-control"
                                placeholder="Email"
                                value={filters.email}
                                onChange={(e) =>
                                    handleFilterChange("email", e.target.value)
                                }
                            />
                        </td>
                        <td>
                            <input
                                className="form-control"
                                placeholder="Phone"
                                value={filters.phone}
                                onChange={(e) =>
                                    handleFilterChange("phone", e.target.value)
                                }
                            />
                        </td>
                        <td>
                            <select
                                className="form-control form-select"
                                value={filters.role}
                                onChange={(e) => handleFilterChange("role", e.target.value)}
                            >
                                <option value="">All Roles</option>
                                <option value="Admin">Admin</option>
                                <option value="Super Admin">Super Admin</option>
                                <option value="Sub Admin">Sub Admin</option>
                            </select>
                        </td>
                        <td colSpan={2}>
                            <input
                                className="form-control"
                                placeholder="Select Date Range"
                                readOnly
                                value={formatDateRange()}
                                onClick={() => setShowModal(true)}
                            />
                        </td>
                    </tr>
                </thead>

                <tbody>
                    {!filteredAdmins.length && (
                        <tr>
                            <td colSpan={6} className="text-center text-muted py-4">
                                No admins found
                            </td>
                        </tr>
                    )}

                    {filteredAdmins.map((admin) => (
                        <tr key={admin.id}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <div className="form-check me-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={selectedIds.includes(admin.id)}
                                            onChange={() => toggleSelectRow(admin.id)}
                                            id={admin.id}
                                        />
                                    </div>
                                    <img 
                                        src={admin.image || "https://placehold.co/40x40"} 
                                        alt={admin.name}
                                        className="rounded-circle me-2"
                                        style={{ width: "35px", height: "35px", objectFit: "cover" }}
                                    />
                                    <label className="form-check-label mb-0 cursor-pointer" htmlFor={admin.id}>
                                        {admin.name}
                                    </label>
                                </div>
                            </td>
                            <td>{admin.email}</td>
                            <td>{admin.phone}</td>
                            <td>
                                <span className={`alert rounded-pill py-1 px-3 fsz-12 ms-2 border-0 mb-0 ${
                                    admin.role === 'Super Admin' ? 'alert-danger' : 
                                    admin.role === 'Admin' ? 'alert-primary' : 'alert-info'
                                }`}>
                                    {admin.role}
                                </span>
                            </td>
                            <td>{admin.created_at}</td>
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
                                            onClick={() => handleEdit(admin.id)}
                                        >
                                            <i className="fal fa-pen me-2"></i> Edit
                                        </button>
                                        <button
                                            className="dropdown-item text-danger"
                                            onClick={() => handleDelete(admin.id)}
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