"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { DateRange } from "react-date-range";
import SearchableSelect from "@/components/shared/SearchableSelect";

export default function DashboardFilters() {
    const [employeeFilter, setEmployeeFilter] = useState(null);
    const [industryFilter, setIndustryFilter] = useState(null);
    const [periodFilter, setPeriodFilter] = useState("");
    const [dateRange, setDateRange] = useState([
        { startDate: null, endDate: null, key: "selection" },
    ]);
    const [tempRange, setTempRange] = useState([
        { startDate: null, endDate: null, key: "selection" },
    ]);
    const [showDateModal, setShowDateModal] = useState(false);

    // Mock Options
    const employeeOptions = [
        { value: "emp1", label: "John Doe" },
        { value: "emp2", label: "Jane Smith" },
        { value: "emp3", label: "Mike Johnson" },
    ];

    const industryOptions = [
        { value: "ind1", label: "Tech Industry" },
        { value: "ind2", label: "Real Estate" },
        { value: "ind3", label: "Finance" },
    ];

    const handlePeriodChange = (e) => {
        setPeriodFilter(e.target.value);
        console.log("Period changed:", e.target.value);
    };

    const formatDateRangeDisplay = () => {
        const { startDate, endDate } = dateRange[0];
        if (!startDate || !endDate) return "Select Date Range";
        return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    };

    const confirmDateRange = () => {
        setDateRange(tempRange);
        setShowDateModal(false);
        console.log("Date range confirmed:", tempRange);
    };

    return (
        <>
            <div className="d-flex align-items-center gap-2 flex-wrap">
                {/* Employee Search */}
                <div style={{ minWidth: "200px" }}>
                    <SearchableSelect
                        options={employeeOptions}
                        value={employeeFilter}
                        onChange={(val) => {
                            setEmployeeFilter(val);
                            console.log("Employee filter:", val);
                        }}
                        placeholder="Search Employee..."
                    />
                </div>

                {/* Industry Search */}
                <div style={{ minWidth: "200px" }}>
                    <SearchableSelect
                        options={industryOptions}
                        value={industryFilter}
                        onChange={(val) => {
                            setIndustryFilter(val);
                            console.log("Industry filter:", val);
                        }}
                        placeholder="Search Industry..."
                    />
                </div>

                {/* Time Period Select */}
                <div>
                    <select
                        className="form-select fsz-13"
                        style={{ minHeight: '38px', cursor: "pointer" }}
                        value={periodFilter}
                        onChange={handlePeriodChange}
                        id="period"
                        name="period"
                    >
                        <option value="">Time Period</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                        <option value="quarter">Quarter</option>
                        <option value="year">Year</option>
                    </select>
                </div>

                {/* Date Range Picker Button */}
                <div>
                    <button
                        className="butn-st2 line-butn py-2 px-3 d-flex align-items-center"
                        style={{ height: '38px', whiteSpace: "nowrap" }}
                        onClick={() => setShowDateModal(true)}
                    >
                        <i className="fal fa-calendar-alt me-2"></i>
                        <span className="fsz-13">{formatDateRangeDisplay()}</span>
                    </button>
                </div>
            </div>

            {/* Date Range Modal (Portaled) */}
            {showDateModal &&
                createPortal(
                    <>
                        <div
                            className="modal-backdrop fade show"
                            onClick={() => setShowDateModal(false)}
                        ></div>
                        <div
                            className="modal fade show d-block"
                            tabIndex="-1"
                            onClick={(e) =>
                                e.target === e.currentTarget && setShowDateModal(false)
                            }
                        >
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content border-0">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Select Date Range</h5>
                                        <button
                                            className="btn-close"
                                            onClick={() => setShowDateModal(false)}
                                        />
                                    </div>
                                    <div className="modal-body bg-light d-flex justify-content-center">
                                        <DateRange
                                            ranges={tempRange}
                                            onChange={(ranges) => setTempRange([ranges.selection])}
                                            editableDateInputs={true}
                                            moveRangeOnFirstSelection={false}
                                            rangeColors={['#0d6efd']}
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            className="alert alert-light rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
                                            onClick={() => setShowDateModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="alert alert-success rounded-pill py-2 px-3 fsz-12 ms-2 border-0 mb-0"
                                            onClick={confirmDateRange}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>,
                    document.body
                )}
        </>
    );
}
