"use client";

import { useState, useEffect } from "react";

export default function TargetFilter({ table, onReset, columnOrder = [] }) {
    // Local states
    const [employeeSearch, setEmployeeSearch] = useState(table.getColumn("employee")?.getFilterValue() || "");
    const [yearSearch, setYearSearch] = useState(table.getColumn("year")?.getFilterValue() || "");
    const [productSearch, setProductSearch] = useState(table.getColumn("product")?.getFilterValue() || "");
    const [targetSearch, setTargetSearch] = useState(table.getColumn("target")?.getFilterValue() || "");

    useEffect(() => {
        setEmployeeSearch(table.getColumn("employee")?.getFilterValue() || "");
        setYearSearch(table.getColumn("year")?.getFilterValue() || "");
        setProductSearch(table.getColumn("product")?.getFilterValue() || "");
        setTargetSearch(table.getColumn("target")?.getFilterValue() || "");
    }, [table.getState().columnFilters]);

    const handleReset = () => {
        setEmployeeSearch("");
        setYearSearch("");
        setProductSearch("");
        setTargetSearch("");
        onReset?.();
    };

    const filterCells = {
        employee: (
            <td key="employee" className="sticky-col">
                <input
                    className="form-control"
                    placeholder="Search..."
                    value={employeeSearch}
                    onChange={(e) => {
                        setEmployeeSearch(e.target.value);
                        table.getColumn("employee")?.setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        year: (
            <td key="year">
                <input
                    className="form-control"
                    placeholder="Search..."
                    value={yearSearch}
                    onChange={(e) => {
                        setYearSearch(e.target.value);
                        table.getColumn("year")?.setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        product: (
            <td key="product">
                <input
                    className="form-control"
                    placeholder="Search..."
                    value={productSearch}
                    onChange={(e) => {
                        setProductSearch(e.target.value);
                        table.getColumn("product")?.setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        target: (
            <td key="target">
                <input
                    className="form-control"
                    placeholder="Search..."
                    value={targetSearch}
                    onChange={(e) => {
                        setTargetSearch(e.target.value);
                        table.getColumn("target")?.setFilterValue(e.target.value);
                    }}
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
