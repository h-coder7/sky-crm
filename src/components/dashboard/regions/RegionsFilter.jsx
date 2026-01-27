import { useState, useEffect, useMemo } from "react";
import SearchableSelect from "../../shared/SearchableSelect";

export default function RegionsFilter({ table, countries = [], dateRangeValue, onOpenModal }) {
    const [titleSearch, setTitleSearch] = useState(table.getColumn("title")?.getFilterValue() || "");
    const [countrySearch, setCountrySearch] = useState(table.getColumn("country")?.getFilterValue() || "");

    useEffect(() => {
        setTitleSearch(table.getColumn("title")?.getFilterValue() || "");
        setCountrySearch(table.getColumn("country")?.getFilterValue() || "");
    }, [table.getState().columnFilters]);

    return (
        <tr className="search-tr fsz-12">
            <td>
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
            <td>
                <SearchableSelect
                    options={countries}
                    value={countrySearch}
                    onChange={(val) => {
                        setCountrySearch(val);
                        table.getColumn("country")?.setFilterValue(val || undefined);
                    }}
                    placeholder="Country"
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
