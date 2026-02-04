"use client";

import { useState, useEffect } from "react";

export default function ProductsFilter({ table, dateRangeValue, onOpenModal, onReset, columnOrder = [] }) {
    const [titleSearch, setTitleSearch] = useState(table.getColumn("title")?.getFilterValue() || "");

    useEffect(() => {
        setTitleSearch(table.getColumn("title")?.getFilterValue() || "");
    }, [table.getState().columnFilters]);

    const handleReset = () => {
        setTitleSearch("");
        onReset?.();
    };

    const filterCells = {
        title: (
            <td key="title" className="sticky-col">
                <input
                    className="form-control"
                    placeholder="Search title..."
                    value={titleSearch}
                    onChange={(e) => {
                        setTitleSearch(e.target.value);
                        table.getColumn("title")?.setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        created_at: (
            <td key="created_at">
                <input
                    className="form-control cursor-pointer"
                    placeholder="Select range..."
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
