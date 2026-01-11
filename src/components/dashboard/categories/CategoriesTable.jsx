"use client";

import { useMemo, useState, useEffect } from "react";
import api from "@/app/api/api";

/* ================= Mock Fallback ================= */
const MOCK_USERS = [
  {
    id: 1,
    name: "Leanne Graham",
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
    company: { name: "Romaguera-Crona" },
  },
  {
    id: 2,
    name: "Ervin Howell",
    phone: "010-692-6593 x09125",
    website: "anastasia.net",
    company: { name: "Deckow-Crist" },
  },
];

export default function CategoriesTable({ onEdit, onDelete }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({ name: "", phone: "", company: "" });

  /* ================= Fetch Users ================= */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // JSON Placeholder
      const res = await api.get("/users");

      if (res.data) setUsers(res.data);
      else setUsers(MOCK_USERS);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers(MOCK_USERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= Select All ================= */
  const isAllSelected = users.length > 0 && selected.length === users.length;
  const toggleSelectAll = () => {
    if (isAllSelected) setSelected([]);
    else setSelected(users.map((u) => u.id));
  };
  const toggleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ================= Filtering ================= */
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        (!filters.phone || user.phone.includes(filters.phone)) &&
        (!filters.company ||
          (user.company?.name || "").toLowerCase().includes(filters.company.toLowerCase()))
      );
    });
  }, [filters, users]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  /* ================= Add / Edit / Delete ================= */
  const handleEdit = (id) => onEdit?.(id);
  const handleDelete = (id) => {
    onDelete?.(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="table-responsive position-relative">
      {loading && <p className="text-center">Loading...</p>}

      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th>
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
            <th>Phone</th>
            <th>Website</th>
            <th>Company</th>
            <th>Actions</th>
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
                placeholder="Phone"
                value={filters.phone}
                onChange={(e) => handleFilterChange("phone", e.target.value)}
              />
            </td>
            <td></td>
            <td>
              <input
                className="form-control"
                placeholder="Company"
                value={filters.company}
                onChange={(e) => handleFilterChange("company", e.target.value)}
              />
            </td>
            <td></td>
          </tr>
        </thead>

        <tbody>
          {!filteredUsers.length && (
            <tr>
              <td colSpan={5} className="text-center text-muted py-4">
                No users found
              </td>
            </tr>
          )}

          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>{user.website}</td>
              <td>{user.company?.name}</td>
              <td>
                <div className="dropdown">
                  <button
                    className="btn bg-transparent border-0 p-0 dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-ellipsis"></i>
                  </button>
                  <ul className="dropdown-menu">
                    <button className="dropdown-item" onClick={() => handleEdit(user.id)}>
                      <i className="fal fa-pen me-2"></i> Edit
                    </button>
                    <button className="dropdown-item text-danger" onClick={() => handleDelete(user.id)}>
                      <i className="fal fa-trash me-2"></i> Delete
                    </button>
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
