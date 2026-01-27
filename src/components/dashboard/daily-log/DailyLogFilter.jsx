"use client";

import { useState, useEffect } from "react";

export default function DailyLogFilter({ table, dateRangeValue, onOpenModal }) {
    const [filters, setFilters] = useState({
        contact_list: "",
        date: "",
        employee: "",
        objective: "",
        type: "",
        estimated_sale: "",
        next_contact: "",
        next_action: "",
    });

    useEffect(() => {
        const currentFilters = {};
        Object.keys(filters).forEach(key => {
            currentFilters[key] = table.getColumn(key)?.getFilterValue() || "";
        });
        setFilters(currentFilters);
    }, [table.getState().columnFilters]);

    const handleChange = (key, val) => {
        setFilters(prev => ({ ...prev, [key]: val }));
        table.getColumn(key)?.setFilterValue(val);
    };

    return (
        <tr className="search-tr fsz-12">
            <td>
                <input
                    className="form-control"
                    placeholder="Search List..."
                    value={filters.contact_list}
                    onChange={(e) => handleChange("contact_list", e.target.value)}
                />
            </td>
            <td>
                <input
                    type="date"
                    className="form-control"
                    value={filters.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                />
            </td>
            <td>
                <input
                    className="form-control"
                    placeholder="Search Employee..."
                    value={filters.employee}
                    onChange={(e) => handleChange("employee", e.target.value)}
                />
            </td>
            <td>
                <select
                    className="form-control form-select"
                    value={filters.objective}
                    onChange={(e) => handleChange("objective", e.target.value)}
                >
                    <option value="">All</option>
                    <option value="Conference/Seminar">Conference/Seminar</option>
                    <option value="Product launch">Product launch</option>
                    <option value="Corporate teambuilding">Corporate teambuilding</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Round table meeting">Round table meeting</option>
                    <option value="Celebration">Celebration</option>
                    <option value="Public Event">Public Event</option>
                    <option value="Other">Other</option>
                </select>
            </td>
            <td>
                <select
                    className="form-control form-select"
                    value={filters.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                >
                    <option value="">All</option>
                    <option value="Phone call">Phone call</option>
                    <option value="Zoom meeting">Zoom meeting</option>
                    <option value="Face to face">Face to face</option>
                    <option value="Email">Email</option>
                    <option value="Linkedin message">Linkedin message</option>
                    <option value="Acquaintance">Acquaintance</option>
                </select>
            </td>
            <td>
                <input
                    className="form-control"
                    placeholder="Sale..."
                    value={filters.estimated_sale}
                    onChange={(e) => handleChange("estimated_sale", e.target.value)}
                />
            </td>
            <td>
                <input
                    type="date"
                    className="form-control"
                    value={filters.next_contact}
                    onChange={(e) => handleChange("next_contact", e.target.value)}
                />
            </td>
            <td>
                <select
                    className="form-control form-select"
                    value={filters.next_action}
                    onChange={(e) => handleChange("next_action", e.target.value)}
                >
                    <option value="">All</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Pitch">Pitch</option>
                    <option value="Call">Call</option>
                    <option value="Follow-up">Follow-up</option>
                </select>
            </td>
            <td colSpan={2}>
                <input
                    className="form-control cursor-pointer"
                    placeholder="Select range..."
                    readOnly
                    value={dateRangeValue}
                    onClick={onOpenModal}
                />
            </td>
        </tr>
    );
}
