"use client";

import { useState, useMemo } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { QuarterRow, DealCard, STATUS_COLUMNS } from "./DealsMatrixComponents";

export default function DealsMatrix({ deals, onUpdateDeal }) {
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Group deals by Quarter -> Month
    // Quarters: Q1 (Jan, Feb, Mar), Q2 (Apr, May, Jun), Q3 (Jul, Aug, Sep), Q4 (Oct, Nov, Dec)
    const quarters = useMemo(() => {
        return [
            { id: "q1", name: "Q1", months: ["January", "February", "March"] },
            { id: "q2", name: "Q2", months: ["April", "May", "June"] },
            { id: "q3", name: "Q3", months: ["July", "August", "September"] },
            { id: "q4", name: "Q4", months: ["October", "November", "December"] },
        ];
    }, []);

    // Month Name to ID Mapping (Assumed based on mock)
    const MONTH_MAP = {
        "January": "1", "February": "2", "March": "3",
        "April": "4", "May": "5", "June": "6",
        "July": "7", "August": "8", "September": "9",
        "October": "10", "November": "11", "December": "12"
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeDealId = active.id;
        const overId = over.id; // Format: "MonthName-StatusId"

        // Parse overId
        const [monthName, ...statusParts] = overId.split("-");
        const statusId = statusParts.join("-"); // Join back in case status has hyphens

        const newMonthOnly = MONTH_MAP[monthName];

        if (newMonthOnly && statusId) {
            // Find the deal
            const deal = deals.find(d => d.id === activeDealId);
            if (deal) {
                // Create updated deal object
                const updatedDeal = {
                    ...deal,
                    month: newMonthOnly,
                    status: statusId
                };
                // Call parent update
                onUpdateDeal(updatedDeal);
            }
        }
    };

    // Calculate Total Value
    const totalValue = deals.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalConfirmedValue = deals
        .filter(d => ["11", "13"].includes(String(d.status))) // "11" is Confirmed, "13" is Payment Received
        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={({ active }) => setActiveId(active.id)}
            onDragEnd={handleDragEnd}
        >
            <div className="deals-matrix-container">
                {/* Header Row */}
                <div className="d-flex justify-content-between align-items-center mb-3 px-3">
                    <h5 className="m-0">Deals Matrix</h5>
                    <div className="d-flex gap-4">
                        <div className="text-end">
                            <div className="fsz-11 text-muted text-uppercase">Total Year Value</div>
                            <div className="fw-bold text-dark">${totalValue.toLocaleString()}</div>
                        </div>
                        <div className="text-end">
                            <div className="fsz-11 text-muted text-uppercase">Confirmed Value</div>
                            <div className="fw-bold text-success">${totalConfirmedValue.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                <div className="matrix-header d-flex text-capitalize fw-500 fsz-12">
                    {/* <div className="period-col p-3">Period</div> */}
                    <div className="period-col bg-transparent p-3"></div>
                    <div className="status-col flex-fill text-center p-2" style={{ backgroundColor: '#cfe2ff', color: '#0d6efd' }}>Briefing Phase</div>
                    <div className="status-col flex-fill text-center p-2" style={{ backgroundColor: '#cff4fc', color: '#0DCAF0' }}>Proposal Phase</div>
                    <div className="status-col flex-fill text-center p-2" style={{ backgroundColor: '#FFF3CD', color: '#FFC20A' }}>Quotation</div>
                    <div className="status-col flex-fill text-center p-2" style={{ backgroundColor: '#D1E7DD', color: '#198754' }}>Confirmed</div>
                    <div className="status-col flex-fill text-center p-2" style={{ backgroundColor: '#F8D7DA', color: '#DC3545' }}>Rejected</div>
                    <div className="status-col flex-fill text-center p-2" style={{ backgroundColor: '#E2E3E5', color: '#6C757D' }}>Task Done</div>
                </div>

                <div className="matrix-body">
                    {quarters.map(q => (
                        <QuarterRow key={q.id} quarter={q} deals={deals} />
                    ))}
                </div>
            </div>
            <DragOverlay>
                {activeId ? (
                    (() => {
                        const activeDeal = deals.find(d => d.id === activeId);
                        if (!activeDeal) return null;

                        const statusCol = STATUS_COLUMNS.find(c => c.id === activeDeal.status);
                        const color = statusCol ? statusCol.color : "";

                        return (
                            <div>
                                <DealCard deal={activeDeal} color={color} className={`deal-bubble ${color || ''} drag-overlay`} />
                            </div>
                        );
                    })()
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
