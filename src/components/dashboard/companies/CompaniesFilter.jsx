"use client";

import { useState, useEffect, useMemo } from "react";
import SearchableSelect from "../../shared/SearchableSelect";

export default function CompaniesFilter({ table, dateRangeValue, onOpenModal }) {
    // Search states
    const [titleSearch, setTitleSearch] = useState(table.getColumn("title")?.getFilterValue() || "");
    const [addressSearch, setAddressSearch] = useState(table.getColumn("address")?.getFilterValue() || "");
    const [descriptionSearch, setDescriptionSearch] = useState(table.getColumn("description")?.getFilterValue() || "");
    const [domainSearch, setDomainSearch] = useState(table.getColumn("domain")?.getFilterValue() || "");
    const [sectorSearch, setSectorSearch] = useState(table.getColumn("sector")?.getFilterValue() || "");
    const [countrySearch, setCountrySearch] = useState(table.getColumn("country")?.getFilterValue() || "");

    // Sector options
    const sectorOptions = useMemo(() => [
        { value: "Manufacturing", label: "Manufacturing" },
        { value: "Banking, Insurance & FinTech", label: "Banking, Insurance & FinTech" },
        { value: "Telecomm, Media & Entertainment", label: "Telecomm, Media & Entertainment" },
        { value: "Beauty, Cosmetics & BeautyTech", label: "Beauty, Cosmetics & BeautyTech" },
        { value: "Defense & Security", label: "Defense & Security" },
        { value: "FMCGs, F&B, Foodtech & Aggregators", label: "FMCGs, F&B, Foodtech & Aggregators" },
        { value: "Aviation, Hospitality & TravelTech", label: "Aviation, Hospitality & TravelTech" },
        { value: "Real estate & Proptech", label: "Real estate & Proptech" },
        { value: "Luxury, Fashion & RetailTech", label: "Luxury, Fashion & RetailTech" },
        { value: "Renewable Energy, Oil & Gas", label: "Renewable Energy, Oil & Gas" },
        { value: "Business Services, Auditing & Consultancy", label: "Business Services, Auditing & Consultancy" },
        { value: "Government", label: "Government" },
        { value: "Automotive & Autotech", label: "Automotive & Autotech" },
        { value: "Tech & Cybersecurity", label: "Tech & Cybersecurity" },
        { value: "Pharmaceutical, Medical & MedTech", label: "Pharmaceutical, Medical & MedTech" },
    ], []);

    // Country options (Mocked from countries module)
    const countryOptions = useMemo(() => [
        { value: "United Arab Emirates", label: "United Arab Emirates" },
        { value: "saudia arabia", label: "saudia arabia" },
        { value: "Afghanistan", label: "Afghanistan" },
        { value: "Aland Islands", label: "Aland Islands" },
        { value: "Albania", label: "Albania" },
        { value: "Algeria", label: "Algeria" },
        { value: "American Samoa", label: "American Samoa" },
        { value: "Andorra", label: "Andorra" },
        { value: "Angola", label: "Angola" },
        { value: "Anguilla", label: "Anguilla" },
        { value: "Antarctica", label: "Antarctica" },
        { value: "Antigua and Barbuda", label: "Antigua and Barbuda" },
        { value: "Argentina", label: "Argentina" },
        { value: "Armenia", label: "Armenia" },
        { value: "Aruba", label: "Aruba" },
        { value: "Australia", label: "Australia" },
        { value: "Austria", label: "Austria" },
        { value: "Azerbaijan", label: "Azerbaijan" },
    ], []);

    // 🔄 Sync local state with table filters
    useEffect(() => {
        setTitleSearch(table.getColumn("title")?.getFilterValue() || "");
        setAddressSearch(table.getColumn("address")?.getFilterValue() || "");
        setDescriptionSearch(table.getColumn("description")?.getFilterValue() || "");
        setDomainSearch(table.getColumn("domain")?.getFilterValue() || "");
        setSectorSearch(table.getColumn("sector")?.getFilterValue() || "");
        setCountrySearch(table.getColumn("country")?.getFilterValue() || "");
    }, [table.getState().columnFilters]);

    return (
        <tr className="search-tr fsz-12">
            {/* Title */}
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

            {/* Address */}
            <td>
                <input
                    className="form-control form-control-sm"
                    placeholder="Search address..."
                    value={addressSearch}
                    onChange={(e) => {
                        setAddressSearch(e.target.value);
                        table.getColumn("address")?.setFilterValue(e.target.value);
                    }}
                />
            </td>

            {/* Description */}
            <td>
                <input
                    className="form-control form-control-sm"
                    placeholder="Search description..."
                    value={descriptionSearch}
                    onChange={(e) => {
                        setDescriptionSearch(e.target.value);
                        table.getColumn("description")?.setFilterValue(e.target.value);
                    }}
                />
            </td>

            {/* Domain */}
            <td>
                <input
                    className="form-control form-control-sm"
                    placeholder="Search domain..."
                    value={domainSearch}
                    onChange={(e) => {
                        setDomainSearch(e.target.value);
                        table.getColumn("domain")?.setFilterValue(e.target.value);
                    }}
                />
            </td>

            {/* Sector */}
            <td>
                <SearchableSelect
                    options={sectorOptions}
                    value={sectorSearch}
                    onChange={(val) => {
                        setSectorSearch(val);
                        table.getColumn("sector")?.setFilterValue(val || undefined);
                    }}
                    placeholder="Sector"
                />
            </td>

            {/* Country */}
            <td>
                <SearchableSelect
                    options={countryOptions}
                    value={countrySearch}
                    onChange={(val) => {
                        setCountrySearch(val);
                        table.getColumn("country")?.setFilterValue(val || undefined);
                    }}
                    placeholder="Country"
                />
            </td>

            {/* Added On */}
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
