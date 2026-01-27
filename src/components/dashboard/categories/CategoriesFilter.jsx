"use client";

import { useState, useEffect } from "react";

export default function CategoriesFilter({ table, dateRangeValue, onOpenModal }) {
    const [titleSearch, setTitleSearch] = useState(table.getColumn("title")?.getFilterValue() || "");
    const [startPriceSearch, setStartPriceSearch] = useState(table.getColumn("start_price")?.getFilterValue() || "");
    const [endPriceSearch, setEndPriceSearch] = useState(table.getColumn("end_price")?.getFilterValue() || "");

    useEffect(() => {
        setTitleSearch(table.getColumn("title")?.getFilterValue() || "");
        setStartPriceSearch(table.getColumn("start_price")?.getFilterValue() || "");
        setEndPriceSearch(table.getColumn("end_price")?.getFilterValue() || "");
    }, [table.getState().columnFilters]);

    return (
        <tr className="search-tr fsz-12">
            <td>
                <input
                    className="form-control"
                    placeholder="Search Title..."
                    value={titleSearch}
                    onChange={(e) => {
                        setTitleSearch(e.target.value);
                        table.getColumn("title")?.setFilterValue(e.target.value);
                    }}
                />
            </td>

            <td>
                <input
                    className="form-control"
                    placeholder="Search Start Price..."
                    value={startPriceSearch}
                    onChange={(e) => {
                        setStartPriceSearch(e.target.value);
                        table.getColumn("start_price")?.setFilterValue(e.target.value);
                    }}
                />
            </td>

            <td>
                <input
                    className="form-control"
                    placeholder="Search End Price..."
                    value={endPriceSearch}
                    onChange={(e) => {
                        setEndPriceSearch(e.target.value);
                        table.getColumn("end_price")?.setFilterValue(e.target.value);
                    }}
                />
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
