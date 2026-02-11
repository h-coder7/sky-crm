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
import { QuarterRow } from "./DealsMatrixComponents";

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
        .filter(d => d.status === "11") // "11" is Confirmed
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

                <div className="matrix-header d-flex text-uppercase fsz-12">
                    <div className="period-col fw-bold p-3">PERIOD</div>
                    <div className="status-col flex-fill text-center p-2 fw-bold" style={{ backgroundColor: '#e6f7ff', color: '#0050b3' }}>BRIEFING PHASE</div>
                    <div className="status-col flex-fill text-center p-2 fw-bold" style={{ backgroundColor: '#f9f0ff', color: '#531dab' }}>PROPOSAL PHASE</div>
                    <div className="status-col flex-fill text-center p-2 fw-bold" style={{ backgroundColor: '#fff7e6', color: '#d46b08' }}>QUOTATION</div>
                    <div className="status-col flex-fill text-center p-2 fw-bold" style={{ backgroundColor: '#f6ffed', color: '#389e0d' }}>CONFIRMED</div>
                    <div className="status-col flex-fill text-center p-2 fw-bold" style={{ backgroundColor: '#fff1f0', color: '#cf1322' }}>REJECTED</div>
                    <div className="status-col flex-fill text-center p-2 fw-bold" style={{ backgroundColor: '#f0f5ff', color: '#1d39c4' }}>TASK DONE</div>
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
                        return activeDeal ? (
                            <div className="deal-bubble p-2 rounded shadow-lg border bg-white" style={{ width: '150px' }}>
                                <div className="fw-bold fsz-12 text-truncate">{activeDeal.title}</div>
                                <div className="fsz-11 mt-1"><i className="fas fa-dollar-sign fsz-10 me-1"></i>{activeDeal.amount?.toLocaleString()}</div>
                                <div className="fsz-10 text-muted mt-1"><i className="fas fa-user fsz-10 me-1"></i>{activeDeal.employee}</div>
                                <div className="fsz-10 text-muted"><i className="fas fa-building fsz-10 me-1"></i>{activeDeal.company}</div>
                            </div>
                        ) : null;
                    })()
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
