import { useState, useEffect, useMemo } from "react";
import SearchableSelect from "../../shared/SearchableSelect";

export default function ContactListsFilter({
    table,
    employees = [],
    dateRangeValue,
    onOpenModal,
    onReset,
    columnOrder
}) {
    // Local searches
    const [nameSearch, setNameSearch] = useState(table.getColumn("name")?.getFilterValue() || "");
    const [addressSearch, setAddressSearch] = useState(table.getColumn("address")?.getFilterValue() || "");
    const [genderSearch, setGenderSearch] = useState(table.getColumn("gender")?.getFilterValue() || "");
    const [phonesSearch, setPhonesSearch] = useState(table.getColumn("phones")?.getFilterValue() || "");
    const [landlinesSearch, setLandlinesSearch] = useState(table.getColumn("landlines")?.getFilterValue() || "");
    const [socialLinksSearch, setSocialLinksSearch] = useState(table.getColumn("social_links")?.getFilterValue() || "");
    const [emailSearch, setEmailSearch] = useState(table.getColumn("email")?.getFilterValue() || "");
    const [countrySearch, setCountrySearch] = useState(table.getColumn("country")?.getFilterValue() || "");
    const [companySearch, setCompanySearch] = useState(table.getColumn("company")?.getFilterValue() || "");
    const [jobTitleSearch, setJobTitleSearch] = useState(table.getColumn("job_title")?.getFilterValue() || "");
    const [budgetSearch, setBudgetSearch] = useState(table.getColumn("budget")?.getFilterValue() || "");
    const [avgStandsSearch, setAvgStandsSearch] = useState(table.getColumn("avg_stands_year")?.getFilterValue() || "");
    const [avgEventsSearch, setAvgEventsSearch] = useState(table.getColumn("avg_events_year")?.getFilterValue() || "");
    const [websiteSearch, setWebsiteSearch] = useState(table.getColumn("company_website_url")?.getFilterValue() || "");
    const [notesSearch, setNotesSearch] = useState(table.getColumn("notes")?.getFilterValue() || "");

    // 🔄 Local state for selects to ensure immediate UI updates
    const [topCustomerSearch, setTopCustomerSearch] = useState(table.getColumn("top_customer")?.getFilterValue() || "");
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

    const genderOptions = useMemo(() => [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
    ], []);

    const yesNoOptions = useMemo(() => [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ], []);

    // 🔄 Sync local state with table filters
    useEffect(() => {
        setNameSearch(table.getColumn("name")?.getFilterValue() || "");
        setGenderSearch(table.getColumn("gender")?.getFilterValue() || "");
        setAddressSearch(table.getColumn("address")?.getFilterValue() || "");
        setPhonesSearch(table.getColumn("phones")?.getFilterValue() || "");
        setLandlinesSearch(table.getColumn("landlines")?.getFilterValue() || "");
        setSocialLinksSearch(table.getColumn("social_links")?.getFilterValue() || "");
        setEmailSearch(table.getColumn("email")?.getFilterValue() || "");
        setCountrySearch(table.getColumn("country")?.getFilterValue() || "");
        setCompanySearch(table.getColumn("company")?.getFilterValue() || "");
        setJobTitleSearch(table.getColumn("job_title")?.getFilterValue() || "");
        setBudgetSearch(table.getColumn("budget")?.getFilterValue() || "");
        setAvgStandsSearch(table.getColumn("avg_stands_year")?.getFilterValue() || "");
        setAvgEventsSearch(table.getColumn("avg_events_year")?.getFilterValue() || "");
        setWebsiteSearch(table.getColumn("company_website_url")?.getFilterValue() || "");
        setNotesSearch(table.getColumn("notes")?.getFilterValue() || "");

        // Sync selects
        setTopCustomerSearch(table.getColumn("top_customer")?.getFilterValue() || "");
        setDmStatusSearch(table.getColumn("decision_maker_status")?.getFilterValue() || "");
        setStatusSearch(table.getColumn("status")?.getFilterValue() || "");
        setEmployeeSearch(table.getColumn("employee")?.getFilterValue() || "");
    }, [table.getState().columnFilters]);

    const handleReset = () => {
        setNameSearch("");
        setGenderSearch("");
        setAddressSearch("");
        setPhonesSearch("");
        setLandlinesSearch("");
        setSocialLinksSearch("");
        setEmailSearch("");
        setCountrySearch("");
        setCompanySearch("");
        setJobTitleSearch("");
        setBudgetSearch("");
        setAvgStandsSearch("");
        setAvgEventsSearch("");
        setWebsiteSearch("");
        setNotesSearch("");
        setTopCustomerSearch("");
        setDmStatusSearch("");
        setStatusSearch("");
        setEmployeeSearch("");
        onReset?.();
    };

    const filterCells = {
        name: (
            <td key="name" className="">
                <input
                    className="form-control"
                    placeholder="Name"
                    value={nameSearch}
                    onChange={(e) => {
                        setNameSearch(e.target.value);
                        table.getColumn("name").setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        address: (
            <td key="address">
                <input
                    className="form-control"
                    placeholder="Address"
                    value={addressSearch}
                    onChange={(e) => {
                        setAddressSearch(e.target.value);
                        table.getColumn("address").setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        phones: (
            <td key="phones">
                <input
                    className="form-control"
                    placeholder="Phones"
                    value={phonesSearch}
                    onChange={(e) => {
                        setPhonesSearch(e.target.value);
                        table.getColumn("phones").setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        landlines: (
            <td key="landlines">
                <input
                    className="form-control"
                    placeholder="Landlines"
                    value={landlinesSearch}
                    onChange={(e) => {
                        setLandlinesSearch(e.target.value);
                        table.getColumn("landlines").setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        social_links: (
            <td key="social_links">
                <input
                    className="form-control"
                    placeholder="Social Links"
                    value={socialLinksSearch}
                    onChange={(e) => {
                        setSocialLinksSearch(e.target.value);
                        table.getColumn("social_links").setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        gender: (
            <td key="gender">
                <SearchableSelect
                    options={genderOptions}
                    value={genderSearch}
                    onChange={(val) => {
                        setGenderSearch(val);
                        table.getColumn("gender").setFilterValue(val || undefined);
                    }}
                    placeholder="Gender"
                    instanceId="gender-filter"
                />
            </td>
        ),
        email: (
            <td key="email">
                <input
                    className="form-control"
                    placeholder="Email"
                    value={emailSearch}
                    onChange={(e) => {
                        setEmailSearch(e.target.value);
                        table.getColumn("email").setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        top_customer: (
            <td key="top_customer">
                <SearchableSelect
                    options={yesNoOptions}
                    value={topCustomerSearch}
                    onChange={(val) => {
                        setTopCustomerSearch(val);
                        table.getColumn("top_customer").setFilterValue(val || undefined);
                    }}
                    placeholder="Top Cust."
                    instanceId="top-customer-filter"
                />
            </td>
        ),
        decision_maker_status: (
            <td key="decision_maker_status">
                <SearchableSelect
                    options={yesNoOptions}
                    value={dmStatusSearch}
                    onChange={(val) => {
                        setDmStatusSearch(val);
                        table.getColumn("decision_maker_status").setFilterValue(val || undefined);
                    }}
                    placeholder="D.M. Status"
                    instanceId="dm-status-filter"
                />
            </td>
        ),
        status: (
            <td key="status">
                <SearchableSelect
                    options={statusOptions}
                    value={statusSearch}
                    onChange={(val) => {
                        setStatusSearch(val);
                        table.getColumn("status").setFilterValue(val || undefined);
                    }}
                    placeholder="Status"
                    instanceId="status-filter"
                />
            </td>
        ),
        employee: (
            <td key="employee">
                <SearchableSelect
                    options={employees}
                    value={employeeSearch}
                    onChange={(val) => {
                        setEmployeeSearch(val);
                        table.getColumn("employee").setFilterValue(val || undefined);
                    }}
                    placeholder="Employee"
                    instanceId="employee-filter"
                />
            </td>
        ),
        country: (
            <td key="country">
                <input
                    className="form-control"
                    placeholder="Country"
                    value={countrySearch}
                    onChange={(e) => {
                        setCountrySearch(e.target.value);
                        table.getColumn("country").setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        company: (
            <td key="company">
                <input
                    className="form-control"
                    placeholder="Company"
                    value={companySearch}
                    onChange={(e) => {
                        setCompanySearch(e.target.value);
                        table.getColumn("company").setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        budget: (
            <td key="budget">
                <input
                    className="form-control"
                    placeholder="Budget"
                    value={budgetSearch}
                    onChange={(e) => {
                        setBudgetSearch(e.target.value);
                        table.getColumn("budget").setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        avg_stands_year: (
            <td key="avg_stands_year">
                <input
                    className="form-control"
                    placeholder="Stands/Yr"
                    value={avgStandsSearch}
                    onChange={(e) => {
                        setAvgStandsSearch(e.target.value);
                        table.getColumn("avg_stands_year").setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        avg_events_year: (
            <td key="avg_events_year">
                <input
                    className="form-control"
                    placeholder="Events/Yr"
                    value={avgEventsSearch}
                    onChange={(e) => {
                        setAvgEventsSearch(e.target.value);
                        table.getColumn("avg_events_year").setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        company_website_url: (
            <td key="company_website_url">
                <input
                    className="form-control"
                    placeholder="Website"
                    value={websiteSearch}
                    onChange={(e) => {
                        setWebsiteSearch(e.target.value);
                        table.getColumn("company_website_url").setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        job_title: (
            <td key="job_title">
                <input
                    className="form-control"
                    placeholder="Job Title"
                    value={jobTitleSearch}
                    onChange={(e) => {
                        setJobTitleSearch(e.target.value);
                        table.getColumn("job_title").setFilterValue(e.target.value);
                    }}
                />
            </td>
        ),
        notes: (
            <td key="notes">
                <input
                    className="form-control"
                    placeholder="Notes"
                    value={notesSearch}
                    onChange={(e) => {
                        setNotesSearch(e.target.value);
                        table.getColumn("notes").setFilterValue(e.target.value);
                    }}
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
        <tr className="search-tr fsz-12">
            {columnOrder
                .filter(id => table.getColumn(id)?.getIsVisible() !== false)
                .map((id) => filterCells[id])
            }
        </tr>
    );
}
