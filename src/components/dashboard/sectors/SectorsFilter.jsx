"use client";

import { useState } from "react";

export default function SectorsFilter({ table, dateRangeValue, onOpenModal, onReset, columnOrder = [] }) {
    // Local states for inputs to ensure they are always responsive/writable
    const [titleSearch, setTitleSearch] = useState(table.getColumn("title")?.getFilterValue() || "");
    const [descriptionSearch, setDescriptionSearch] = useState(table.getColumn("description")?.getFilterValue() || "");

    const handleTitleChange = (val) => {
        setTitleSearch(val);
        table.getColumn("title")?.setFilterValue(val);
    };

    const handleDescriptionChange = (val) => {
        setDescriptionSearch(val);
        table.getColumn("description")?.setFilterValue(val);
    };

    const handleReset = () => {
        setTitleSearch("");
        setDescriptionSearch("");
        onReset?.();
    };

    const filterCells = {
        title: (
            <td key="title" className="sticky-col">
                <input
                    className="form-control"
                    placeholder="Title"
                    value={titleSearch}
                    onChange={(e) => handleTitleChange(e.target.value)}
                />
            </td>
        ),
        description: (
            <td key="description">
                <input
                    className="form-control"
                    placeholder="Description"
                    value={descriptionSearch}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
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
        <tr className="search-tr">
            {columnOrder
                .filter(id => table.getColumn(id)?.getIsVisible() !== false)
                .map((id) => filterCells[id])
            }
        </tr>
    );
}
