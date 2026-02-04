"use client";

import { useState, useEffect } from "react";

export default function DealsFilter({ table, dateRangeValue, onOpenModal, onReset, columnOrder }) {
    const [titleSearch, setTitleSearch] = useState("");
    const [descSearch, setDescSearch] = useState("");
    const [empSearch, setEmpSearch] = useState("");
    const [prodSearch, setProdSearch] = useState("");
    const [contactSearch, setContactSearch] = useState("");
    const [compSearch, setCompSearch] = useState("");
    const [statusSearch, setStatusSearch] = useState("");
    const [monthSearch, setMonthSearch] = useState("");
    const [amountSearch, setAmountSearch] = useState("");
    const [startDateSearch, setStartDateSearch] = useState("");
    const [endDateSearch, setEndDateSearch] = useState("");

    const handleFilter = (colId, val, setter) => {
        setter(val);
        table.getColumn(colId)?.setFilterValue(val);
    };

    const handleReset = () => {
        setTitleSearch("");
        setDescSearch("");
        setEmpSearch("");
        setProdSearch("");
        setContactSearch("");
        setCompSearch("");
        setStatusSearch("");
        setMonthSearch("");
        setAmountSearch("");
        setStartDateSearch("");
        setEndDateSearch("");
        onReset?.();
    };

    // Keep local search states in sync with table filters (especially for reset)
    useEffect(() => {
        const filters = table.getState().columnFilters;
        if (filters.length === 0) {
            setTitleSearch("");
            setDescSearch("");
            setEmpSearch("");
            setProdSearch("");
            setContactSearch("");
            setCompSearch("");
            setStatusSearch("");
            setMonthSearch("");
            setAmountSearch("");
            setStartDateSearch("");
            setEndDateSearch("");
        }
    }, [table.getState().columnFilters]);

    const filterCells = {
        title: (
            <td key="title" className="sticky-col">
                <input className="form-control" placeholder="Title" value={titleSearch} onChange={(e) => handleFilter("title", e.target.value, setTitleSearch)} />
            </td>
        ),
        description: (
            <td key="description">
                <input className="form-control" placeholder="Desc" value={descSearch} onChange={(e) => handleFilter("description", e.target.value, setDescSearch)} />
            </td>
        ),
        start_date: (
            <td key="start_date">
                <input className="form-control" placeholder="Start Date" value={startDateSearch} onChange={(e) => handleFilter("start_date", e.target.value, setStartDateSearch)} />
            </td>
        ),
        end_date: (
            <td key="end_date">
                <input className="form-control" placeholder="End Date" value={endDateSearch} onChange={(e) => handleFilter("end_date", e.target.value, setEndDateSearch)} />
            </td>
        ),
        employee: (
            <td key="employee">
                <input className="form-control" placeholder="Employee" value={empSearch} onChange={(e) => handleFilter("employee", e.target.value, setEmpSearch)} />
            </td>
        ),
        product: (
            <td key="product">
                <input className="form-control" placeholder="Product" value={prodSearch} onChange={(e) => handleFilter("product", e.target.value, setProdSearch)} />
            </td>
        ),
        contact_list: (
            <td key="contact_list">
                <input className="form-control" placeholder="Contact" value={contactSearch} onChange={(e) => handleFilter("contact_list", e.target.value, setContactSearch)} />
            </td>
        ),
        company: (
            <td key="company">
                <input className="form-control" placeholder="Company" value={compSearch} onChange={(e) => handleFilter("company", e.target.value, setCompSearch)} />
            </td>
        ),
        status: (
            <td key="status">
                <select className="form-control form-select form-select-sm" value={statusSearch} onChange={(e) => handleFilter("status", e.target.value, setStatusSearch)}>
                    <option value="">All</option>
                    <option value="1">Brief Submitted</option>
                    <option value="2">Amending Brief</option>
                    <option value="3">Moodboard Requested</option>
                    <option value="4">Moodboard Submitted</option>
                    <option value="5">Amending Moodboard</option>
                    <option value="6">3D Render Requested</option>
                    <option value="7">Proposal Submitted</option>
                    <option value="8">Amending Proposal</option>
                    <option value="9">Quotation Requested</option>
                    <option value="10">Quotation Submitted</option>
                    <option value="11">Confirmed</option>
                    <option value="12">Rejected</option>
                    <option value="13">Payment Received</option>
                </select>
            </td>
        ),
        amount: (
            <td key="amount">
                <input className="form-control" placeholder="Amount" value={amountSearch} onChange={(e) => handleFilter("amount", e.target.value, setAmountSearch)} />
            </td>
        ),
        month: (
            <td key="month">
                <select className="form-control form-select form-select-sm" value={monthSearch} onChange={(e) => handleFilter("month", e.target.value, setMonthSearch)}>
                    <option value="">All</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
            </td>
        ),
        created_at: (
            <td key="created_at">
                <input className="form-control cursor-pointer" readOnly value={dateRangeValue} onClick={onOpenModal} placeholder="Select Date Range" />
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
