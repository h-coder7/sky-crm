"use client";

import { useState } from "react";

export default function CategoriesFilter({ table, dateRangeValue, onOpenModal, onReset, columnOrder = [] }) {
    const [titleSearch, setTitleSearch] = useState("");
    const [startPriceSearch, setStartPriceSearch] = useState("");
    const [endPriceSearch, setEndPriceSearch] = useState("");

    const handleTitleChange = (val) => {
        setTitleSearch(val);
        table.getColumn("title")?.setFilterValue(val || undefined);
    };

    const handleStartPriceChange = (val) => {
        setStartPriceSearch(val);
        table.getColumn("start_price")?.setFilterValue(val || undefined);
    };

    const handleEndPriceChange = (val) => {
        setEndPriceSearch(val);
        table.getColumn("end_price")?.setFilterValue(val || undefined);
    };

    const handleReset = () => {
        setTitleSearch("");
        setStartPriceSearch("");
        setEndPriceSearch("");
        onReset?.();
    };

    const filterCells = {
        title: (
            <td key="title">
                <input
                    className="form-control"
                    placeholder="Title"
                    value={titleSearch}
                    onChange={(e) => handleTitleChange(e.target.value)}
                />
            </td>
        ),
        start_price: (
            <td key="start_price">
                <input
                    className="form-control"
                    placeholder="Start Price"
                    value={startPriceSearch}
                    onChange={(e) => handleStartPriceChange(e.target.value)}
                />
            </td>
        ),
        end_price: (
            <td key="end_price">
                <input
                    className="form-control"
                    placeholder="End Price"
                    value={endPriceSearch}
                    onChange={(e) => handleEndPriceChange(e.target.value)}
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
