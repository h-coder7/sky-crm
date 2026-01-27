import { useState, useEffect, useMemo } from "react";
import SearchableSelect from "../../shared/SearchableSelect";

export default function ContactListsFilter({ table, employees = [], dateRangeValue, onOpenModal }) {
    // ... (rest of states remain the same)
    const [nameSearch, setNameSearch] = useState(table.getColumn("name")?.getFilterValue() || "");
    const [addressSearch, setAddressSearch] = useState(table.getColumn("address")?.getFilterValue() || "");
    const [phoneSearch, setPhoneSearch] = useState(table.getColumn("phone")?.getFilterValue() || "");
    const [emailSearch, setEmailSearch] = useState(table.getColumn("email")?.getFilterValue() || "");
    const [countrySearch, setCountrySearch] = useState(table.getColumn("country")?.getFilterValue() || "");
    const [companySearch, setCompanySearch] = useState(table.getColumn("company")?.getFilterValue() || "");
    const [jobTitleSearch, setJobTitleSearch] = useState(table.getColumn("job_title")?.getFilterValue() || "");
    const [sectorSearch, setSectorSearch] = useState(table.getColumn("sector")?.getFilterValue() || "");
    const [budgetSearch, setBudgetSearch] = useState(table.getColumn("budget")?.getFilterValue() || "");
    const [avgStandsSearch, setAvgStandsSearch] = useState(table.getColumn("avg_stands_year")?.getFilterValue() || "");
    const [avgEventsSearch, setAvgEventsSearch] = useState(table.getColumn("avg_events_year")?.getFilterValue() || "");
    const [websiteSearch, setWebsiteSearch] = useState(table.getColumn("company_website_url")?.getFilterValue() || "");
    const [notesSearch, setNotesSearch] = useState(table.getColumn("notes")?.getFilterValue() || "");

    // 🔄 Local state for selects to ensure immediate UI updates
    const [topCustomerSearch, setTopCustomerSearch] = useState(table.getColumn("top_customer")?.getFilterValue()?.toString() || "");
    const [dmStatusSearch, setDmStatusSearch] = useState(table.getColumn("decision_maker_status")?.getFilterValue() || "");
    const [statusSearch, setStatusSearch] = useState(table.getColumn("status")?.getFilterValue() || "");
    const [employeeSearch, setEmployeeSearch] = useState(table.getColumn("employee")?.getFilterValue() || "");

    // Status options for react-select
    const statusOptions = useMemo(() => [
        { value: "New Lead", label: "New Lead" },
        { value: "1st Contact Done", label: "1st Contact Done" },
        { value: "2nd Contact Done", label: "2nd Contact Done" },
        { value: "Follow - Up", label: "Follow - Up" },
        { value: "Meeting Scheduled", label: "Meeting Scheduled" },
        { value: "Brief Received", label: "Brief Received" },
        { value: "Proposal Submitted", label: "Proposal Submitted" },
        { value: "Comments Received", label: "Comments Received" },
        { value: "Quotation Submitted", label: "Quotation Submitted" },
        { value: "Revising Quotation", label: "Revising Quotation" },
        { value: "Final Proposal & Quotation Submitted", label: "Final Proposal & Quotation Submitted" },
        { value: "Project Won", label: "Project Won" },
        { value: "Project Lost", label: "Project Lost" },
    ], []);

    // 🔄 Sync local state with table filters
    useEffect(() => {
        setNameSearch(table.getColumn("name")?.getFilterValue() || "");
        setAddressSearch(table.getColumn("address")?.getFilterValue() || "");
        setPhoneSearch(table.getColumn("phone")?.getFilterValue() || "");
        setEmailSearch(table.getColumn("email")?.getFilterValue() || "");
        setCountrySearch(table.getColumn("country")?.getFilterValue() || "");
        setCompanySearch(table.getColumn("company")?.getFilterValue() || "");
        setJobTitleSearch(table.getColumn("job_title")?.getFilterValue() || "");
        setSectorSearch(table.getColumn("sector")?.getFilterValue() || "");
        setBudgetSearch(table.getColumn("budget")?.getFilterValue() || "");
        setAvgStandsSearch(table.getColumn("avg_stands_year")?.getFilterValue() || "");
        setAvgEventsSearch(table.getColumn("avg_events_year")?.getFilterValue() || "");
        setWebsiteSearch(table.getColumn("company_website_url")?.getFilterValue() || "");
        setNotesSearch(table.getColumn("notes")?.getFilterValue() || "");

        // Sync selects
        setTopCustomerSearch(table.getColumn("top_customer")?.getFilterValue()?.toString() || "");
        setDmStatusSearch(table.getColumn("decision_maker_status")?.getFilterValue() || "");
        setStatusSearch(table.getColumn("status")?.getFilterValue() || "");
        setEmployeeSearch(table.getColumn("employee")?.getFilterValue() || "");
    }, [table.getState().columnFilters]);

    return (
        <tr className="search-tr fsz-12">
            {/* Name */}
            <td>
                <input
                    className="form-control form-control-sm"
                    placeholder="Search name..."
                    value={nameSearch}
                    onChange={(e) => {
                        setNameSearch(e.target.value);
                        table.getColumn("name")?.setFilterValue(e.target.value);
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

            {/* Phone */}
            <td>
                <input
                    className="form-control form-control-sm"
                    placeholder="Search phone..."
                    value={phoneSearch}
                    onChange={(e) => {
                        setPhoneSearch(e.target.value);
                        table.getColumn("phone")?.setFilterValue(e.target.value);
                    }}
                />
            </td>

            {/* Email */}
            <td>
                <input
                    className="form-control form-control-sm"
                    placeholder="Search email..."
                    value={emailSearch}
                    onChange={(e) => {
                        setEmailSearch(e.target.value);
                        table.getColumn("email")?.setFilterValue(e.target.value);
                    }}
                />
            </td>

            {/* Top Customer */}
            <td>
                <select
                    className="form-control form-select form-select-sm"
                    value={topCustomerSearch}
                    onChange={(e) => {
                        const val = e.target.value;
                        setTopCustomerSearch(val);
                        table.getColumn("top_customer")?.setFilterValue(val === "" ? undefined : val === "true");
                    }}
                >
                    <option value="">All</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </td>

            {/* Decision Maker Status */}
            <td>
                <select
                    className="form-control form-select form-select-sm"
                    value={dmStatusSearch}
                    onChange={(e) => {
                        const val = e.target.value;
                        setDmStatusSearch(val);
                        table.getColumn("decision_maker_status")?.setFilterValue(val === "" ? undefined : val);
                    }}
                >
                    <option value="">All</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </td>

            {/* Status */}
            <td>
                <SearchableSelect
                    options={statusOptions}
                    value={statusSearch}
                    onChange={(val) => {
                        setStatusSearch(val);
                        table.getColumn("status")?.setFilterValue(val || undefined);
                    }}
                    placeholder="Status"
                />
            </td>

            {/* Employee */}
            <td>
                <SearchableSelect
                    options={employees}
                    value={employeeSearch}
                    onChange={(val) => {
                        setEmployeeSearch(val);
                        table.getColumn("employee")?.setFilterValue(val || undefined);
                    }}
                    placeholder="Employee"
                />
            </td>

            {/* Country */}
            <td>
                <input
                    className="form-control form-control-sm"
                    placeholder="Search country..."
                    value={countrySearch}
                    onChange={(e) => {
                        setCountrySearch(e.target.value);
                        table.getColumn("country")?.setFilterValue(e.target.value);
                    }}
                />
            </td>

            {/* Company */}
            <td>
                <input
                    className="form-control form-control-sm"
                    placeholder="Search company..."
                    value={companySearch}
                    onChange={(e) => {
                        setCompanySearch(e.target.value);
                        table.getColumn("company")?.setFilterValue(e.target.value);
                    }}
                />
            </td>

            {/* Budget */}
            <td>
                <input
                    className="form-control form-control-sm"
                    placeholder="Budget"
                    value={budgetSearch}
                    onChange={(e) => {
                        setBudgetSearch(e.target.value);
                        table.getColumn("budget")?.setFilterValue(e.target.value);
                    }}
                />
            </td>

            {/* Avg Stands/Yr */}
            <td>
                <input
                    className="form-control form-control-sm"
                    placeholder="Stands/Yr"
                    value={avgStandsSearch}
                    onChange={(e) => {
                        setAvgStandsSearch(e.target.value);
                        table.getColumn("avg_stands_year")?.setFilterValue(e.target.value);
                    }}
                />
            </td>

            {/* Avg Events/Yr */}
            <td>
                <input
                    className="form-control form-control-sm"
                    placeholder="Events/Yr"
                    value={avgEventsSearch}
                    onChange={(e) => {
                        setAvgEventsSearch(e.target.value);
                        table.getColumn("avg_events_year")?.setFilterValue(e.target.value);
                    }}
                />
            </td>

            {/* Website */}
            <td>
                <input
                    className="form-control form-control-sm"
                    placeholder="Website"
                    value={websiteSearch}
                    onChange={(e) => {
                        setWebsiteSearch(e.target.value);
                        table.getColumn("company_website_url")?.setFilterValue(e.target.value);
                    }}
                />
            </td>

            {/* Job Title */}
            <td>
                <input
                    className="form-control form-control-sm"
                    placeholder="Job Title"
                    value={jobTitleSearch}
                    onChange={(e) => {
                        setJobTitleSearch(e.target.value);
                        table.getColumn("job_title")?.setFilterValue(e.target.value);
                    }}
                />
            </td>

            {/* Sector */}
            <td>
                <input
                    className="form-control form-control-sm"
                    placeholder="Sector"
                    value={sectorSearch}
                    onChange={(e) => {
                        setSectorSearch(e.target.value);
                        table.getColumn("sector")?.setFilterValue(e.target.value);
                    }}
                />
            </td>

            {/* Notes */}
            <td>
                <input
                    className="form-control form-control-sm"
                    placeholder="Notes"
                    value={notesSearch}
                    onChange={(e) => {
                        setNotesSearch(e.target.value);
                        table.getColumn("notes")?.setFilterValue(e.target.value);
                    }}
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
