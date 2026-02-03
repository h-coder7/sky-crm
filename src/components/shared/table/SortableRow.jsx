"use client";

import React, { Children } from "react";
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

/**
 * 🗂️ SortableRow: A "Smart" row that reorders its children (td/th) 
 * dynamically based on the current column order.
 */
export default function SortableRow({ items, sortableItems, children, className = "" }) {
    // 1. Convert children to an array
    const childrenArray = Children.toArray(children);

    // 2. Reorder children based on the "items" (columnOrder) array
    const orderedChildren = items.map((id) => {
        return childrenArray.find((child) => child.props.id === id);
    }).filter(Boolean);

    // 3. Automatically determine which items are actually "sortable" 
    // based on the 'disabled' prop of the children (th/td)
    const effectiveSortableItems = sortableItems || items.filter(id => {
        const child = childrenArray.find(c => c.props.id === id);
        return !child?.props?.disabled;
    });

    return (
        <SortableContext items={effectiveSortableItems} strategy={horizontalListSortingStrategy}>
            <tr className={className}>
                {orderedChildren}
            </tr>
        </SortableContext>
    );
}
