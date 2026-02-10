import React, { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import type {
  DragAndDropProps,
  ExtendedDragEndEvent,
} from "./types/DragAndDrop.type";
import {
  DropPositionContext,
  useDropPositionProvider,
} from "./hooks/useDropPosition";
import { DRAG_DROP } from "./constants";

/**
 * @component CDragAndDrop
 * @description Main drag-and-drop provider component that wraps dnd-kit's DndContext.
 * Handles drag events and provides drop position context to children.
 */
export const CDragAndDrop: React.FC<DragAndDropProps> = ({
  callbacks = {},
  children,
  restrictToVertical = true,
  disabled = false,
  renderDragOverlay = () => <></>,
}) => {
  const [activeId, setActiveId] = useState<unknown | null>(null);
  const modifiers = restrictToVertical ? [restrictToVerticalAxis] : [];
  const dropPositionContext = useDropPositionProvider();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: DRAG_DROP.CONFIG_SETTINGS.dragActivationDistance,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: DRAG_DROP.CONFIG_SETTINGS.touchSensorDelay,
        tolerance: DRAG_DROP.CONFIG_SETTINGS.touchSensorTolerance,
      },
    })
  );

  /**
   * @method handleDragStart
   * @description Handles drag start - uses dnd-kit's event directly.
   * @param event - DragStartEvent from dnd-kit
   */
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      setActiveId(active.id);

      // Call external callback if provided
      if (callbacks.onDragStart) {
        callbacks.onDragStart(event);
      }
    },
    [callbacks]
  );

  /**
   * @method handleDragEnd
   * @description Handles drag end - includes drop position (above/below) in the event.
   * @param event - DragEndEvent from dnd-kit
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { over } = event;

      setActiveId(null);

      if (!over) {
        // Reset drop position when drag ends without valid target
        dropPositionContext.setDropPosition(null, null);
        return;
      }

      // Get the current drop position (above or below)
      const { position: dropPosition } = dropPositionContext.getDropPosition();

      // Create extended event with drop position
      const extendedEvent: ExtendedDragEndEvent = {
        ...event,
        dropPosition,
      };

      if (callbacks.onDragEnd) {
        callbacks.onDragEnd(extendedEvent);
      }

      // Reset drop position after drag ends
      dropPositionContext.setDropPosition(null, null);
    },
    [callbacks, dropPositionContext]
  );

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <DropPositionContext.Provider value={dropPositionContext}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        modifiers={modifiers}
      >
        {children}
        <DragOverlay>
          {activeId ? <>{renderDragOverlay(activeId, "0")}</> : null}
        </DragOverlay>
      </DndContext>
    </DropPositionContext.Provider>
  );
};
