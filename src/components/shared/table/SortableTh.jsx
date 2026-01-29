"use client";

import React from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * 🏷️ SortableTh: Represents a draggable table header cell.
 */
export default function SortableTh({ id, disabled, className = "", children, ...props }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id,
        disabled: !!disabled
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 1,
        opacity: isDragging ? 0.8 : 1,
        cursor: !disabled ? 'grab' : 'default',
        ...props.style // Allow style overrides
    };

    return (
        <th
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={className}
            {...props}
        >
            <div className="d-flex align-items-center gap-2">
                {/* Horizontal Grip Icon for Draggable Columns */}
                {!disabled && <i className="fal fa-grip-lines-vertical text-muted fsz-10"></i>}

                {/* Render Content */}
                {children}
            </div>
        </th>
    );
}
