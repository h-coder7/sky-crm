"use client";

import { useMemo, useState, useEffect } from "react";
import api from "@/app/api/api";
import { DateRange } from "react-date-range";

/* ================= Mock Fallback ================= */
const MOCK_CATEGORIES = [
  { id: 1, title: "Electronics", start_price: 100, created_at: "2025/08/12" },
  { id: 2, title: "Clothing", start_price: 50, created_at: "2025/07/20" },
  { id: 3, title: "Books", start_price: 20, created_at: "2025/06/05" },
];

export default function CategoriesTable({ onEdit, onDelete }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({ title: "", start_price: "", created_at: null });

  // DateRange Modal state
  const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: "selection" }]);
  const [tempRange, setTempRange] = useState([{ startDate: null, endDate: null, key: "selection" }]);
  const [showModal, setShowModal] = useState(false);

  /* ================= Fetch Categories ================= */
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories"); // Endpoint للكيتيجوريز
      if (res.data && res.data.data) {
        setCategories(res.data.data);
      } else {
        setCategories(MOCK_CATEGORIES);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (error.response?.status === 401) {
        console.warn("Unauthorized - Token may be invalid");
        // window.location.href = "/login"; // لو تحب تعمل redirect
      }
      setCategories(MOCK_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= Select All ================= */
  const isAllSelected = categories.length > 0 && selected.length === categories.length;
  const toggleSelectAll = () => {
    if (isAllSelected) setSelected([]);
    else setSelected(categories.map((a) => a.id));
  };
  const toggleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ================= Filtering ================= */
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const title = cat.title || "";
      const startPrice = cat.start_price || "";
      const createdAt = new Date(cat.created_at);

      const start = dateRange[0].startDate;
      const end = dateRange[0].endDate;
      const dateMatch = !start || !end ? true : createdAt >= start && createdAt <= end;

      return (
        title.toLowerCase().includes(filters.title.toLowerCase()) &&
        (!filters.start_price || startPrice.toString().includes(filters.start_price)) &&
        dateMatch
      );
    });
  }, [filters, categories, dateRange]);

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

  /* ================= Add / Edit / Delete ================= */
  const handleEdit = (id) => {
    onEdit?.(id);
  };

  const handleDelete = (id) => {
    onDelete?.(id);
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <div className="table-responsive position-relative">
      {loading && <p className="text-center">Loading...</p>}

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
                <span>Title</span>
              </div>
            </th>
            <th>Start Price</th>
            <th colSpan={2}>Added On</th>
            <th></th>
          </tr>

          {/* Search Row */}
          <tr className="search-tr">
            <td>
              <input
                className="form-control"
                placeholder="Title"
                value={filters.title}
                onChange={(e) => handleFilterChange("title", e.target.value)}
              />
            </td>
            <td>
              <input
                className="form-control"
                placeholder="Start Price"
                value={filters.start_price}
                onChange={(e) => handleFilterChange("start_price", e.target.value)}
              />
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
          {!filteredCategories.length && (
            <tr>
              <td colSpan={5} className="text-center text-muted py-4">
                No categories found
              </td>
            </tr>
          )}

          {filteredCategories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.title}</td>
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
