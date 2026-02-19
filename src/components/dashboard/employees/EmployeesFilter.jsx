"use client";

import { useState } from "react";
import Select from "react-select";

const ROLE_OPTIONS = [
    { value: "", label: "Role" },
    { value: "Head Department", label: "Head Department" },
    { value: "Senior Business Development Manager", label: "Senior Business Development Manager" },
    { value: "Business Development Manager", label: "Business Development Manager" },
    { value: "Senior Business Development Executive", label: "Senior Business Development Executive" },
    { value: "Business Development Executive", label: "Business Development Executive" },
];

export default function EmployeesFilter({ table, dateRangeValue, onOpenModal, onReset, columnOrder = [] }) {
    const [nameSearch, setNameSearch] = useState("");
    const [emailSearch, setEmailSearch] = useState("");
    const [phoneSearch, setPhoneSearch] = useState("");
    const [roleSearch, setRoleSearch] = useState("");
    const [sectorSearch, setSectorSearch] = useState("");

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

    const handleRoleChange = (selectedOption) => {
        const val = selectedOption?.value || "";
        setRoleSearch(val);
        table.getColumn("role")?.setFilterValue(val || undefined);
    };

    const handleSectorChange = (val) => {
        setSectorSearch(val);
        table.getColumn("sector")?.setFilterValue(val || undefined);
    };

    const handleReset = () => {
        setNameSearch("");
        setEmailSearch("");
        setPhoneSearch("");
        setRoleSearch("");
        setSectorSearch("");
        onReset?.();
    };

    const filterCells = {
        name: (
            <td key="name" className="">
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
                <Select
                    instanceId="employee-role-filter"
                    options={ROLE_OPTIONS}
                    classNamePrefix="react-select"
                    value={ROLE_OPTIONS.find(opt => opt.value === roleSearch)}
                    onChange={handleRoleChange}
                    isSearchable={false}
                    placeholder="Role"
                />
            </td>
        ),
        sector: (
            <td key="sector">
                <input
                    className="form-control"
                    placeholder="Sector"
                    value={sectorSearch}
                    onChange={(e) => handleSectorChange(e.target.value)}
                />
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
                    className="btn btn-white icon-30 p-0 border-0 me-10"
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
        <tr className="search-tr fsz-12">
            {columnOrder
                .filter(id => table.getColumn(id)?.getIsVisible() !== false)
                .map((id) => filterCells[id])
            }
        </tr>
    );
}
