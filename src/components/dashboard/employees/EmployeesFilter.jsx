"use client";

import { useState } from "react";

export default function EmployeesFilter({ table, dateRangeValue, onOpenModal }) {
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

    const handleRoleChange = (val) => {
        setRoleSearch(val);
        table.getColumn("role")?.setFilterValue(val || undefined);
    };

    const handleSectorChange = (val) => {
        setSectorSearch(val);
        table.getColumn("sector")?.setFilterValue(val || undefined);
    };

    return (
        <tr className="search-tr">
            <td>
                <input
                    className="form-control"
                    placeholder="Name"
                    value={nameSearch}
                    onChange={(e) => handleNameChange(e.target.value)}
                />
            </td>
            <td>
                <input
                    className="form-control"
                    placeholder="Email"
                    value={emailSearch}
                    onChange={(e) => handleEmailChange(e.target.value)}
                />
            </td>
            <td>
                <input
                    className="form-control"
                    placeholder="Phone"
                    value={phoneSearch}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                />
            </td>
            <td>
                <select
                    className="form-control form-select"
                    value={roleSearch}
                    onChange={(e) => handleRoleChange(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="Head Department">Head Department</option>
                    <option value="Senior Business Development Manager">Senior Business Development Manager</option>
                    <option value="Business Development Manager">Business Development Manager</option>
                    <option value="Senior Business Development Executive">Senior Business Development Executive</option>
                    <option value="Business Development Executive">Business Development Executive</option>
                </select>
            </td>
            <td>
                <input
                    className="form-control"
                    placeholder="Sector"
                    value={sectorSearch}
                    onChange={(e) => handleSectorChange(e.target.value)}
                />
            </td>
            <td colSpan={2}>
                <input
                    className="form-control cursor-pointer"
                    placeholder="Select Date Range"
                    readOnly
                    value={dateRangeValue}
                    onClick={onOpenModal}
                />
            </td>
        </tr>
    );
}
