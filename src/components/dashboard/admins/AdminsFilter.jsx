"use client";

import { useState } from "react";

export default function AdminsFilter({ table, dateRangeValue, onOpenModal, onReset, columnOrder = [] }) {
    const [nameSearch, setNameSearch] = useState("");
    const [emailSearch, setEmailSearch] = useState("");
    const [phoneSearch, setPhoneSearch] = useState("");
    const [roleSearch, setRoleSearch] = useState("");

    const handleNameChange = (val) => {
        setNameSearch(val);
        table.getColumn("name")?.setFilterValue(val || undefined);
    };

    const handleEmailChange = (val) => {
        setEmailSearch(val);
        table.getColumn("email")?.setFilterValue(val || undefined);
    };

    const handlePhoneChange = (val) => {
        setPhoneSearch(val);
        table.getColumn("phone")?.setFilterValue(val || undefined);
    };

    const handleRoleChange = (val) => {
        setRoleSearch(val);
        table.getColumn("role")?.setFilterValue(val || undefined);
    };

    const handleReset = () => {
        setNameSearch("");
        setEmailSearch("");
        setPhoneSearch("");
        setRoleSearch("");
        onReset?.();
    };

    const filterCells = {
        name: (
            <td key="name">
                <input
                    className="form-control"
                    placeholder="Name"
                    value={nameSearch}
                    onChange={(e) => handleNameChange(e.target.value)}
                />
            </td>
        ),
        email: (
            <td key="email">
                <input
                    className="form-control"
                    placeholder="Email"
                    value={emailSearch}
                    onChange={(e) => handleEmailChange(e.target.value)}
                />
            </td>
        ),
        phone: (
            <td key="phone">
                <input
                    className="form-control"
                    placeholder="Phone"
                    value={phoneSearch}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                />
            </td>
        ),
        role: (
            <td key="role">
                <select
                    className="form-control form-select"
                    value={roleSearch}
                    onChange={(e) => handleRoleChange(e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Sub Admin">Sub Admin</option>
                </select>
            </td>
        ),
        created_at: (
            <td key="created_at">
                <input
                    className="form-control cursor-pointer"
                    placeholder="Select Date Range"
                    readOnly
                    value={dateRangeValue}
                    onClick={onOpenModal}
                />
            </td>
        ),
        columnActions: (
            <td key="columnActions" className="text-end">
                <button
                    className="btn btn-white icon-30 p-0 shadow-sm border-0 me-15"
                    title="Clear All Filters"
                    onClick={handleReset}
                    type="button"
                >
                    <i className="fal fa-filter-slash fsz-12 text-danger"></i>
                </button>
            </td>
        ),
    };

    return (
        <tr className="search-tr">
            {columnOrder
                .filter(id => table.getColumn(id)?.getIsVisible() !== false)
                .map((id) => filterCells[id])
            }
        </tr>
    );
}
