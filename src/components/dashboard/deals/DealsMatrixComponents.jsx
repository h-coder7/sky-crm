"use client";

import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

// Map status IDs to Column Indexes or Keys
// Map status IDs to Column Indexes or Keys
// Export STATUS_COLUMNS so it can be used in DealsMatrix
// Map status IDs to Column Groups
export const STATUS_COLUMNS = [
    { id: "1", ids: ["1", "2", "3", "4", "5", "6"], name: "Briefing Phase", color: "bg-primary-subtle" },
    { id: "7", ids: ["7", "8", "9"], name: "Proposal Phase", color: "bg-info-subtle text-info" },
    { id: "10", ids: ["10"], name: "Quotation", color: "bg-warning-subtle text-warning" },
    { id: "11", ids: ["11"], name: "Confirmed", color: "bg-success-subtle text-success" },
    { id: "12", ids: ["12"], name: "Rejected", color: "bg-danger-subtle text-danger" },
    { id: "13", ids: ["13"], name: "Task Done", color: "bg-secondary-subtle text-secondary" }
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
            <div className="fw-bold fsz-12 text-truncate">{deal.title}</div>
            <div className="fsz-11 mt-1"><i className="fas fa-dollar-sign fsz-10 me-1"></i>{deal.amount?.toLocaleString()}</div>
            <div className="fsz-10 text-muted mt-1"><i className="fas fa-user fsz-10 me-1"></i>{deal.employee}</div>
            <div className="fsz-10 text-muted"><i className="fas fa-building fsz-10 me-1"></i>{deal.company}</div>
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
                <div className="ms-auto fw-bold text-dark">${quarterTotal.toLocaleString()}</div>
            </div>

            {expanded && (
                <div className="quarter-body">
                    {quarter.months.map((month, index) => (
                        <MonthRow key={month} monthName={month} monthIndex={index} quarterId={quarter.id} deals={deals} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function MonthRow({ monthName, quarterId, deals }) {
    // Filter deals for this month
    const monthDeals = deals.filter(d => getDealMonthName(d) === monthName);

    return (
        <div className="month-row d-flex">
            <div className="period-col">
                <span className="txt"> {monthName} </span>
            </div>

            {STATUS_COLUMNS.map(status => (
                <DroppableCell
                    key={status.id}
                    statusId={status.id}
                    monthName={monthName}
                    deals={monthDeals.filter(d => status.ids.includes(d.status))}
                    color={status.color}
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
            {deals.map(deal => (
                <DealBubble key={deal.id} deal={deal} color={color} />
            ))}
            {/* <div className="d-flex flex-column gap-2 w-100 h-100">
            </div> */}
        </div>
    );
}





