"use client";

import { useState, useEffect } from "react";

export default function ProductsFilter({ table, dateRangeValue, onOpenModal }) {
    const [titleSearch, setTitleSearch] = useState(table.getColumn("title")?.getFilterValue() || "");

    useEffect(() => {
        setTitleSearch(table.getColumn("title")?.getFilterValue() || "");
    }, [table.getState().columnFilters]);

    return (
        <tr className="search-tr fsz-12">
            <td>
                <input
                    className="form-control form-control-sm"
                    placeholder="Search title..."
                    value={titleSearch}
                    onChange={(e) => {
                        setTitleSearch(e.target.value);
                        table.getColumn("title")?.setFilterValue(e.target.value);
                    }}
                />
            </td>

            <td colSpan={2}>
                <input
                    className="form-control form-control-sm cursor-pointer"
                    placeholder="Select range..."
                    readOnly
                    value={dateRangeValue}
                    onClick={onOpenModal}
                />
            </td>
        </tr>
    );
}
