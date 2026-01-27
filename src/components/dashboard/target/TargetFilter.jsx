"use client";

import { useState, useEffect } from "react";

export default function TargetFilter({ table }) {
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

    return (
        <tr className="search-tr fsz-12">
            <td>
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
            <td>
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
            <td>
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
            <td colSpan={2}>
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
        </tr>
    );
}
