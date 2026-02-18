import React, { useRef, useState, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { useDndContext, useDndMonitor } from "@dnd-kit/core";

import type {
  DraggableItemProps,
  DropPosition,
  DragHandleProps,
} from "./types/DragAndDrop.type";
import { useDropPosition } from "./hooks/useDropPosition";
import { DRAG_DROP } from "./constants/dragAndDrop";

import "./SortableItem.scss";

export const CSortableItem: React.FC<DraggableItemProps> = ({
  id,
  children,
  disabled = false,
  className = "",
  enableCustomDragHandle = false,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [dropPosition, setDropPosition] = useState<DropPosition | null>(null);
  const { setDropPosition: setGlobalDropPosition } = useDropPosition();

  const { attributes, listeners, setNodeRef, isDragging, isOver } = useSortable(
    {
      id,
      disabled,
    }
  );

  const { over } = useDndContext();
  const isCurrentlyOver = isOver || over?.id === id;

  /**
   * @description Calculates drop position (above/below) based on pointer coordinates.
   * Works for both mouse and touch input.
   */
  const calculateDropPosition = useCallback(
    (pointerY: number) => {
      if (!elementRef.current || !isCurrentlyOver) return;

      const rect = elementRef.current.getBoundingClientRect();
      const midPoint = rect.top + rect.height / 2;
      const position: DropPosition =
        pointerY < midPoint
          ? DRAG_DROP.DROP_POSITION.above
          : DRAG_DROP.DROP_POSITION.below;

      setDropPosition(position);
      setGlobalDropPosition(id, position);
    },
    [id, isCurrentlyOver, setGlobalDropPosition]
  );

  /**
   * @description Uses dnd-kit's drag lifecycle to detect drop position.
   * Works for both mouse and touch/pointer input (unlike mousemove events).
   */
  useDndMonitor({
    onDragMove: (event) => {
      // Only calculate if this element is being hovered over
      if (event?.over?.id == event?.active?.id || !elementRef.current) return;
      // Get pointer coordinates from the drag event
      const { activatorEvent, delta } = event;

      // Calculate current pointer Y position
      let pointerY: number;
      if (activatorEvent instanceof MouseEvent) {
        pointerY = activatorEvent.clientY + delta.y;
      } else if (activatorEvent instanceof TouchEvent) {
        pointerY = activatorEvent.touches[0]?.clientY + delta.y;
      } else if (
        activatorEvent instanceof PointerEvent ||
        (activatorEvent && "clientY" in activatorEvent)
      ) {
        pointerY = (activatorEvent as PointerEvent).clientY + delta.y;
      } else {
        return;
      }
      calculateDropPosition(pointerY);
    },
    onDragEnd: () => {
      setDropPosition(null);
    },
    onDragCancel: () => {
      setDropPosition(null);
    },
  });

  const itemStyle: React.CSSProperties = {
    cursor: disabled ? "default" : enableCustomDragHandle ? "default" : "grab",
    opacity: isDragging ? 0.5 : 1,
    transition: "transform .1s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
  };

  const finalClassName =
    `sortable-item ${className} ${isDragging ? "dragging" : ""} ${isCurrentlyOver ? "is-over" : ""}`.trim();

  const dragProps = enableCustomDragHandle
    ? {}
    : { ...listeners, ...attributes };
  const dragHandleProps: DragHandleProps = {
    listeners,
    attributes,
  };

  /**
   * @method setRefs
   * @description Combines sortable ref with our element ref.
   */
  const setRefs = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    (elementRef as React.MutableRefObject<HTMLDivElement | null>).current =
      node;
  };

  /**
   * @method renderChildren
   * @description Renders children - supports both React nodes and render function pattern.
   */
  const renderChildren = () => {
    if (typeof children === "function") {
      return children(dragHandleProps);
    }
    return children;
  };

  return (
    <div
      ref={setRefs}
      className={finalClassName}
      style={itemStyle}
      data-draggable-id={id}
      {...dragProps}
    >
      {/* Placement Indicator - Above */}
      {isCurrentlyOver &&
        dropPosition === DRAG_DROP.DROP_POSITION.above &&
        !isDragging && <div className="drop-indicator drop-indicator--above" />}
      {renderChildren()}

      {/* Placement Indicator - Below */}
      {isCurrentlyOver &&
        dropPosition === DRAG_DROP.DROP_POSITION.below &&
        !isDragging && <div className="drop-indicator drop-indicator--below" />}
    </div>
  );
};
