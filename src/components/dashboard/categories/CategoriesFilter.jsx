"use client";

import { useState } from "react";

export default function CategoriesFilter({ table, dateRangeValue, onOpenModal }) {
    // Local states for inputs to ensure they are always responsive/writable
    const [titleSearch, setTitleSearch] = useState(table.getColumn("title")?.getFilterValue() || "");
    const [priceSearch, setPriceSearch] = useState(table.getColumn("start_price")?.getFilterValue() || "");
    
    /* ======================================================================
       Helpers
       ====================================================================== */
    const handleTitleChange = (val) => {
        setTitleSearch(val);
        table.getColumn("title")?.setFilterValue(val);
    };

    const handlePriceChange = (val) => {
        setPriceSearch(val);
        table.getColumn("start_price")?.setFilterValue(val);
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
                    placeholder="Search price..."
                    value={priceSearch}
                    onChange={(e) => handlePriceChange(e.target.value)}
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
