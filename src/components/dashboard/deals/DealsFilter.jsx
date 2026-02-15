"use client";

import { useState, useEffect, useMemo } from "react";
import Select from "react-select";

const STATUS_OPTIONS = [
    { value: "1", label: "Brief Submitted" },
    { value: "2", label: "Amending Brief" },
    { value: "3", label: "Moodboard Requested" },
    { value: "4", label: "Moodboard Submitted" },
    { value: "5", label: "Amending Moodboard" },
    { value: "6", label: "3D Render Requested" },
    { value: "7", label: "Proposal Submitted" },
    { value: "8", label: "Amending Proposal" },
    { value: "9", label: "Quotation Requested" },
    { value: "10", label: "Quotation Submitted" },
    { value: "11", label: "Confirmed" },
    { value: "12", label: "Rejected" },
    { value: "13", label: "Payment Received" },
];

const SECTOR_OPTIONS = [
    { value: "Real Estate", label: "Real Estate" },
    { value: "Technology", label: "Technology" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Education", label: "Education" },
    { value: "Finance", label: "Finance" },
];

const PAYMENT_STATUS_OPTIONS = [
    { value: "Pending", label: "Pending" },
    { value: "Partial", label: "Partial" },
    { value: "Paid", label: "Paid" },
];

export default function DealsFilter({ table, dateRangeValue, onOpenModal, onReset, columnOrder }) {
    const [titleSearch, setTitleSearch] = useState("");
    const [descSearch, setDescSearch] = useState("");
    const [empSearch, setEmpSearch] = useState("");
    const [prodSearch, setProdSearch] = useState("");
    const [contactSearch, setContactSearch] = useState("");
    const [compSearch, setCompSearch] = useState("");
    const [statusSearch, setStatusSearch] = useState("");
    const [sectorSearch, setSectorSearch] = useState("");
    const [paymentStatusSearch, setPaymentStatusSearch] = useState("");
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
        setSectorSearch("");
        setPaymentStatusSearch("");
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
            setSectorSearch("");
            setPaymentStatusSearch("");
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
        sector: (
            <td key="sector">
                <Select
                    options={SECTOR_OPTIONS}
                    classNamePrefix="custom-select"
                    isClearable
                    placeholder="Sector"
                    value={SECTOR_OPTIONS.find(o => o.value === sectorSearch)}
                    onChange={(o) => handleFilter("sector", o ? o.value : "", setSectorSearch)}
                />
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
                <Select
                    options={STATUS_OPTIONS}
                    classNamePrefix="custom-select"
                    isClearable
                    placeholder="Status"
                    value={STATUS_OPTIONS.find(o => o.value === statusSearch)}
                    onChange={(o) => handleFilter("status", o ? o.value : "", setStatusSearch)}
                />
            </td>
        ),
        payment_status: (
            <td key="payment_status">
                <Select
                    options={PAYMENT_STATUS_OPTIONS}
                    classNamePrefix="custom-select"
                    isClearable
                    placeholder="Payment"
                    value={PAYMENT_STATUS_OPTIONS.find(o => o.value === paymentStatusSearch)}
                    onChange={(o) => handleFilter("payment_status", o ? o.value : "", setPaymentStatusSearch)}
                />
            </td>
        ),
        amount: (
            <td key="amount">
                <input className="form-control" placeholder="Amount" value={amountSearch} onChange={(e) => handleFilter("amount", e.target.value, setAmountSearch)} />
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

