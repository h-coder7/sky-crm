"use client";

import { useState } from "react";

export default function CountriesFilter({ table, dateRangeValue, onOpenModal }) {
    // Local states for inputs to ensure they are always responsive/writable
    const [titleSearch, setTitleSearch] = useState(table.getColumn("title")?.getFilterValue() || "");
    
    /* ======================================================================
       Helpers
       ====================================================================== */
    const handleTitleChange = (val) => {
        setTitleSearch(val);
        table.getColumn("title")?.setFilterValue(val);
    };

    return (
        <tr className="search-tr">
            <td>
                <input
                    className="form-control"
                    placeholder="Search name..."
                    value={titleSearch}
                    onChange={(e) => handleTitleChange(e.target.value)}
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
