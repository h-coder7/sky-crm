"use client";

import { useState, useEffect } from "react";
import Select from "react-select";

export default function DailyLogFilter({ table, onReset, columnOrder = [], dateRangeValue, onOpenModal }) {
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const currentFilters = {};
        columnOrder.forEach(id => {
            currentFilters[id] = table.getColumn(id)?.getFilterValue() || "";
        });
        setFilters(currentFilters);
    }, [table.getState().columnFilters, columnOrder, table]);

    const handleFilterChange = (id, value) => {
        setFilters(prev => ({ ...prev, [id]: value }));
        table.getColumn(id)?.setFilterValue(value);
    };

    const handleReset = () => {
        setFilters({});
        onReset?.();
    };

    const typeOptions = [
        { value: "Phone call", label: "Phone call" },
        { value: "Zoom meeting", label: "Zoom meeting" },
        { value: "Face to face", label: "Face to face" },
        { value: "Email", label: "Email" },
        { value: "Linkedin message", label: "Linkedin message" },
        { value: "Acquaintance", label: "Acquaintance" },
    ];

    const objectiveOptions = [
        { value: "Conference/Seminar", label: "Conference/Seminar" },
        { value: "Product launch", label: "Product launch" },
        { value: "Corporate teambuilding", label: "Corporate teambuilding" },
        { value: "Exhibition", label: "Exhibition" },
        { value: "Workshops", label: "Workshops" },
        { value: "Graduation", label: "Graduation" },
        { value: "Round table meeting", label: "Round table meeting" },
        { value: "Celebration", label: "Celebration" },
        { value: "Public Event", label: "Public Event" },
        { value: "Other", label: "Other" },
    ];

    const nextActionOptions = [
        { value: "Meeting", label: "Meeting" },
        { value: "Pitch", label: "Pitch" },
        { value: "Call", label: "Call" },
        { value: "Follow-up", label: "Follow-up" },
    ];

    const filterCells = {
        employee: (
            <td key="employee" className="sticky-col">
                <input
                    className="form-control"
                    placeholder="Search..."
                    value={filters.employee || ""}
                    onChange={(e) => handleFilterChange("employee", e.target.value)}
                />
            </td>
        ),
        type: (
            <td key="type">
                <Select
                    instanceId="daily-log-type-filter"
                    options={typeOptions}
                    value={typeOptions.find(opt => opt.value === filters.type) || null}
                    onChange={(opt) => handleFilterChange("type", opt ? opt.value : undefined)}
                    placeholder="All Types"
                    isClearable
                    classNamePrefix="react-select"
                />
            </td>
        ),
        objective: (
            <td key="objective">
                <Select
                    instanceId="daily-log-objective-filter"
                    options={objectiveOptions}
                    value={objectiveOptions.find(opt => opt.value === filters.objective) || null}
                    onChange={(opt) => handleFilterChange("objective", opt ? opt.value : undefined)}
                    placeholder="All Objectives"
                    isClearable
                    classNamePrefix="react-select"
                />
            </td>
        ),
        next_action: (
            <td key="next_action">
                <Select
                    instanceId="daily-log-next-action-filter"
                    options={nextActionOptions}
                    value={nextActionOptions.find(opt => opt.value === filters.next_action) || null}
                    onChange={(opt) => handleFilterChange("next_action", opt ? opt.value : undefined)}
                    placeholder="All Actions"
                    isClearable
                    classNamePrefix="react-select"
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

    // Generic cells for other columns
    columnOrder.forEach(id => {
        if (!filterCells[id]) {
            filterCells[id] = (
                <td key={id}>
                    <input
                        className="form-control"
                        placeholder="Search..."
                        value={filters[id] || ""}
                        onChange={(e) => handleFilterChange(id, e.target.value)}
                    />
                </td>
            );
        }
    });

    return (
        <tr className="search-tr fsz-12">
            {columnOrder
                .filter(id => table.getColumn(id)?.getIsVisible())
                .map((id) => filterCells[id])
            }
        </tr>
    );
}
