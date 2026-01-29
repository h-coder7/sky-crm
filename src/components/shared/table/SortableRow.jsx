"use client";

import React, { Children } from "react";
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

/**
 * 🗂️ SortableRow: A "Smart" row that reorders its children (td/th) 
 * dynamically based on the current column order.
 */
export default function SortableRow({ items, children, className = "" }) {
    // 1. Convert children to an array
    const childrenArray = Children.toArray(children);

    // 2. Reorder children based on the "items" (columnOrder) array
    const orderedChildren = items.map((id) => {
        return childrenArray.find((child) => child.props.id === id);
    }).filter(Boolean);

    return (
        <SortableContext items={items} strategy={horizontalListSortingStrategy}>
            <tr className={className}>
                {orderedChildren}
            </tr>
        </SortableContext>
    );
}
