"use client";

import { useState } from "react";

export default function SectorsFilter({ table, dateRangeValue, onOpenModal }) {
    // Local states for inputs to ensure they are always responsive/writable
    const [titleSearch, setTitleSearch] = useState(table.getColumn("title")?.getFilterValue() || "");
    const [descriptionSearch, setDescriptionSearch] = useState(table.getColumn("description")?.getFilterValue() || "");
    
    /* ======================================================================
       Helpers
       ====================================================================== */
    const handleTitleChange = (val) => {
        setTitleSearch(val);
        table.getColumn("title")?.setFilterValue(val);
    };

    const handleDescriptionChange = (val) => {
        setDescriptionSearch(val);
        table.getColumn("description")?.setFilterValue(val);
    };

    return (
        <tr className="search-tr">
            <td>
                <input
                    className="form-control"
                    placeholder="Search title..."
                    value={titleSearch}
                    onChange={(e) => handleTitleChange(e.target.value)}
                />
            </td>

            <td>
                <input
                    className="form-control"
                    placeholder="Search description..."
                    value={descriptionSearch}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                />
            </td>

            <td colSpan={3}>
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
