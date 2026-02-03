"use client";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

/**
 * 🧱 TableColumnDnd: Provides the DndContext for the table.
 */
export default function TableColumnDnd({ onDragEnd, children }) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: (e) => null }) // Keyboard disabled for simplicity in this specific structure
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        // Guard: If the 'over' item is marked as disabled in its dnd data, prevent reordering
        if (over?.data?.current?.disabled) {
            return;
        }

        if (active.id !== over?.id && onDragEnd) {
            onDragEnd(active.id, over.id);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToHorizontalAxis]}
        >
            {children}
        </DndContext>
    );
}
