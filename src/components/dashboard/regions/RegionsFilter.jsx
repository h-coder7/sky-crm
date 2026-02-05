"use client";

import { useState } from "react";
import SearchableSelect from "../../shared/SearchableSelect";

export default function RegionsFilter({ table, countries = [], dateRangeValue, onOpenModal, onReset, columnOrder = [] }) {
    const [titleSearch, setTitleSearch] = useState("");
    const [countrySearch, setCountrySearch] = useState("");

    const handleTitleChange = (val) => {
        setTitleSearch(val);
        table.getColumn("title")?.setFilterValue(val || undefined);
    };

    const handleCountryChange = (val) => {
        setCountrySearch(val);
        table.getColumn("country")?.setFilterValue(val || undefined);
    };

    const handleReset = () => {
        setTitleSearch("");
        setCountrySearch("");
        onReset?.();
    };

    const filterCells = {
        title: (
            <td key="title">
                <input
                    className="form-control"
                    placeholder="Search title..."
                    value={titleSearch}
                    onChange={(e) => handleTitleChange(e.target.value)}
                />
            </td>
        ),
        country: (
            <td key="country">
                <SearchableSelect
                    options={countries}
                    value={countrySearch}
                    onChange={handleCountryChange}
                    placeholder="Country"
                    instanceId="country-filter"
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
