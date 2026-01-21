"use client";

import { useState, useEffect } from "react";

export default function DealsFilter({ table, dateRangeValue, onOpenModal }) {
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

    return (
        <tr className="search-tr">
            <td>
                <input className="form-control form-control-sm fsz-12" placeholder="Title" value={titleSearch} onChange={(e) => handleFilter("title", e.target.value, setTitleSearch)} />
            </td>
            <td>
                <input className="form-control form-control-sm fsz-12" placeholder="Desc" value={descSearch} onChange={(e) => handleFilter("description", e.target.value, setDescSearch)} />
            </td>
            <td>
                <input className="form-control form-control-sm fsz-12" placeholder="Start Date" value={startDateSearch} onChange={(e) => handleFilter("start_date", e.target.value, setStartDateSearch)} />
            </td>
            <td>
                <input className="form-control form-control-sm fsz-12" placeholder="End Date" value={endDateSearch} onChange={(e) => handleFilter("end_date", e.target.value, setEndDateSearch)} />
            </td>
            <td>
                <input className="form-control form-control-sm fsz-12" placeholder="Employee" value={empSearch} onChange={(e) => handleFilter("employee", e.target.value, setEmpSearch)} />
            </td>
            <td>
                <input className="form-control form-control-sm fsz-12" placeholder="Product" value={prodSearch} onChange={(e) => handleFilter("product", e.target.value, setProdSearch)} />
            </td>
            <td>
                <input className="form-control form-control-sm fsz-12" placeholder="Contact" value={contactSearch} onChange={(e) => handleFilter("contact_list", e.target.value, setContactSearch)} />
            </td>
            <td>
                <input className="form-control form-control-sm fsz-12" placeholder="Company" value={compSearch} onChange={(e) => handleFilter("company", e.target.value, setCompSearch)} />
            </td>
            <td>
                <select className="form-control form-select form-select-sm fsz-12" value={statusSearch} onChange={(e) => handleFilter("status", e.target.value, setStatusSearch)}>
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
            <td>
                <input className="form-control form-control-sm fsz-12" placeholder="Amount" value={amountSearch} onChange={(e) => handleFilter("amount", e.target.value, setAmountSearch)} />
            </td>
            <td>
                <select className="form-control form-select form-select-sm fsz-12" value={monthSearch} onChange={(e) => handleFilter("month", e.target.value, setMonthSearch)}>
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
            <td colSpan={2}>
                <input className="form-control form-control-sm fsz-12 cursor-pointer" readOnly value={dateRangeValue} onClick={onOpenModal} placeholder="Date" />
            </td>
        </tr>
    );
}
