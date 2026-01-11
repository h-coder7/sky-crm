"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

/* ================= Mock Data ================= */
const MOCK_ADMINS = [
  { id: 1, name: "Super Admin", email: "super@admin.com", phone: "9655585448", role: "super", created_at: "2025/08/12", avatar: "/images/sky-logo.png" },
  { id: 2, name: "Ahmed Ali", email: "ahmed@test.com", phone: "01012345678", role: "admin", created_at: "2025/07/20", avatar: "/images/sky-logo.png" },
  { id: 3, name: "Sara Mohamed", email: "sara@test.com", phone: "01198765432", role: "sub", created_at: "2025/06/05", avatar: "/images/sky-logo.png" },
];

export default function AdminsTable({ data = [], onEdit, onDelete }) {
  const sourceData = data.length ? data : MOCK_ADMINS;

  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", phone: "", role: "", created_at: null });

  // DateRange Modal state
  const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: "selection" }]);
  const [tempRange, setTempRange] = useState([{ startDate: null, endDate: null, key: "selection" }]);
  const [showModal, setShowModal] = useState(false);

  /* ================= Select All ================= */
  const isAllSelected = sourceData.length > 0 && selected.length === sourceData.length;
  const toggleSelectAll = () => {
    if (isAllSelected) setSelected([]);
    else setSelected(sourceData.map((a) => a.id));
  };
  const toggleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ================= Filtering ================= */
  const filteredAdmins = useMemo(() => {
    return sourceData.filter((admin) => {
      const name = admin.name || "";
      const email = admin.email || "";
      const phone = admin.phone || "";
      const role = admin.role || "";
      const createdAt = new Date(admin.created_at);

      const start = dateRange[0].startDate;
      const end = dateRange[0].endDate;
      const dateMatch = !start || !end ? true : createdAt >= start && createdAt <= end;

      return (
        name.toLowerCase().includes(filters.name.toLowerCase()) &&
        email.toLowerCase().includes(filters.email.toLowerCase()) &&
        (!filters.phone || phone.includes(filters.phone)) &&
        (!filters.role || role === filters.role) &&
        dateMatch
      );
    });
  }, [filters, sourceData, dateRange]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const formatDateRange = () => {
    const { startDate, endDate } = dateRange[0];
    if (!startDate || !endDate) return "";
    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];
    return `${start} to ${end}`;
  };

  const confirmDateRange = () => {
    setDateRange(tempRange);
    setShowModal(false);
  };

  return (
    <div className="table-responsive position-relative">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th className="column_name">
              <div className="d-flex align-items-center gap-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
                <span>Name</span>
              </div>
            </th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th colSpan={2}>Added On</th>
            <th></th>
          </tr>

          {/* Search Row */}
          <tr className="search-tr">
            <td>
              <input
                className="form-control"
                placeholder="Name"
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
              />
            </td>
            <td>
              <input
                className="form-control"
                placeholder="E-Mail"
                value={filters.email}
                onChange={(e) => handleFilterChange("email", e.target.value)}
              />
            </td>
            <td>
              <input
                className="form-control"
                placeholder="Phone"
                value={filters.phone}
                onChange={(e) => handleFilterChange("phone", e.target.value)}
              />
            </td>
            <td>
              <select
                className="form-control form-select"
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
              >
                <option value="">All</option>
                <option value="super">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="sub">Sub Admin</option>
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
            <td></td>
          </tr>
        </thead>

        <tbody>
          {!filteredAdmins.length && (
            <tr>
              <td colSpan={7} className="text-center text-muted py-4">
                No admins found
              </td>
            </tr>
          )}

          {filteredAdmins.map((admin) => (
            <tr key={admin.id}>
              <td className="column_name">
                <div className="d-flex align-items-center">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    checked={selected.includes(admin.id)}
                    onChange={() => toggleSelectRow(admin.id)}
                  />
                  <Image
                    src={admin.avatar || "/images/sky-logo.png"}
                    alt={admin.name || "Admin"}
                    width={32}
                    height={32}
                    className="rounded-circle me-2 object-fit-cover"
                  />
                  <span>{admin.name}</span>
                </div>
              </td>
              <td>{admin.email}</td>
              <td>
                <a href={`tel:${admin.phone || "0000000000"}`}>
                  {admin.phone || "0000000000"}
                </a>
              </td>
              <td className="text-capitalize">
                {admin.role === "super"
                  ? "Super Admin"
                  : admin.role === "admin"
                  ? "Admin"
                  : "Sub Admin"}
              </td>
              <td colSpan={2}>{admin.created_at}</td>
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
                      onClick={() => onEdit?.(admin.id)}
                    >
                      <i className="fal fa-pen me-2"></i> Edit
                    </button>
                    <button className="dropdown-item">
                      <i className="fal fa-lock me-2"></i> Lock
                    </button>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => onDelete?.(admin.id)}
                    >
                      <i className="fal fa-trash me-2"></i> Trash
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

      {/* Bootstrap Modal for DateRange */}
      <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex="-1">
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
                onChange={(ranges) => setTempRange([ranges.selection])}
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
              <button className="btn btn-primary" onClick={confirmDateRange}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
