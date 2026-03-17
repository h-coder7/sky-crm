"use client";

import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

// Map status IDs to Column Indexes or Keys
// Map status IDs to Column Indexes or Keys
// Export STATUS_COLUMNS so it can be used in DealsMatrix
export const STATUS_COLUMNS = [
    {
        id: "1",
        name: "Briefing Phase",
        color: "bg-primary-subtle text-primary",
        statusIds: ["1", "2", "3", "4", "5", "6"]
    },
    {
        id: "7",
        name: "Proposal Phase",
        color: "bg-info-subtle text-info",
        statusIds: ["7", "8", "9"]
    },
    {
        id: "10",
        name: "Quotation",
        color: "bg-warning-subtle text-warning",
        statusIds: ["10"]
    },
    {
        id: "11",
        name: "Confirmed",
        color: "bg-success-subtle text-success",
        statusIds: ["11"]
    },
    {
        id: "12",
        name: "Rejected",
        color: "bg-danger-subtle text-danger",
        statusIds: ["12"]
    },
    {
        id: "13",
        name: "Task Done",
        color: "bg-secondary-subtle text-secondary",
        statusIds: ["13"]
    }
];

// ... (rest of imports and helper functions, keeping MONTH_NAMES and getDealMonthName as is but ensuring they don't break)

export function DealCard({ deal, color, style, innerRef, ...props }) {
    return (
        <div
            ref={innerRef}
            style={style}
            className={`deal-bubble ${color || ''}`}
            {...props}
        >
            <div className="fw-bold fsz-12 text-truncate" title={deal.title}>{deal.title}</div>
            <div className="fsz-11 mt-1"><i className="fas fa-dollar-sign fsz-10 me-1"></i>{Number(deal.amount || 0).toLocaleString()}</div>
            <div className="fsz-10 text-muted mt-1 text-truncate"><i className="fas fa-user fsz-10 me-1"></i>{deal.employee}</div>
            <div className="fsz-10 text-muted text-truncate"><i className="fas fa-building fsz-10 me-1"></i>{deal.company}</div>
        </div>
    );
}

export function DealBubble({ deal, color }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: deal.id,
        data: deal
    });

    const style = {
        transform: isDragging ? undefined : CSS.Transform.toString(transform),
        opacity: isDragging ? 0 : 1,
    };

    return (
        <DealCard
            deal={deal}
            color={color}
            innerRef={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
        />
    );
}

// Helper to get deal month name from ID
// Mock data: month: "1" -> January
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDealMonthName(deal) {
    if (!deal.month) return "";
    const mIndex = parseInt(deal.month) - 1;
    return MONTH_NAMES[mIndex] || "";
}

export function QuarterRow({ quarter, deals }) {
    const [expanded, setExpanded] = useState(true);

    const toggleExpand = () => setExpanded(!expanded);

    // Calculate total value for the quarter
    const quarterDeals = deals.filter(d =>
        quarter.months.includes(getDealMonthName(d))
    );

    const quarterTotal = quarterDeals.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    return (
        <div className="quarter-section">
            <div
                className="quarter-header"
                onClick={toggleExpand}
            >
                <i className={`fas fa-chevron-${expanded ? 'down' : 'right'} me-2`}></i>
                <h6 className="m-0 fw-bold">{quarter.name} <span className="text-muted fw-normal ms-2">({quarter.months[0]} - {quarter.months[2]})</span></h6>
                <div className="ms-auto fw-bold text-dark">${Number(quarterTotal).toLocaleString()}</div>
            </div>

            {expanded && (
                <div className="quarter-body">
                    {quarter.months.map((month) => (
                        <MonthRow key={month} monthName={month} quarterId={quarter.id} deals={deals} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function MonthRow({ monthName, deals }) {
    // Filter deals for this month
    const monthDeals = deals.filter(d => getDealMonthName(d) === monthName);

    return (
        <div className="month-row d-flex">
            <div className="period-col">
                <span className="txt"> {monthName} </span>
            </div>

            {STATUS_COLUMNS.map(column => (
                <DroppableCell
                    key={column.id}
                    statusId={column.id}
                    monthName={monthName}
                    deals={monthDeals.filter(d => column.statusIds.includes(String(d.status)))}
                    color={column.color}
                />
            ))}
        </div>
    );
}

export function DroppableCell({ statusId, monthName, deals, color }) {
    const { isOver, setNodeRef } = useDroppable({
        id: `${monthName}-${statusId}`, // Unique ID for drop zone
        data: { month: monthName, status: statusId }
    });

    return (
        <div
            ref={setNodeRef}
            className={`flex-fill ${isOver ? 'bg-light-subtle ring-2 ring-primary' : ''}`}
            style={{ minWidth: '150px' }}
        >
            <div className="d-flex flex-column gap-2 p-2 h-100 w-100">
                {deals.map(deal => (
                    <DealBubble key={deal.id} deal={deal} color={color} />
                ))}
            </div>
        </div>
    );
}





