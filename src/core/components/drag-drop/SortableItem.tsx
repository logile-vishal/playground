import React, { useRef, useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { useDndContext } from "@dnd-kit/core";

import type {
  DraggableItemProps,
  DropPosition,
  DragHandleProps,
} from "./types/DragAndDrop.type";
import { useDropPosition } from "./hooks/useDropPosition";
import "./SortableItem.scss";
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

  const { active, over } = useDndContext();
  const isDragActive = active !== null;
  const isCurrentlyOver = isOver || over?.id === id;

  /**
   * @description Determines if drop will be above or below based on cursor position.
   * Also updates the global drop position context for use in drag end handler.
   */
  useEffect(() => {
    if (!isDragActive || !isCurrentlyOver || !elementRef.current) {
      setDropPosition(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current || !isCurrentlyOver) return;

      const rect = elementRef.current.getBoundingClientRect();
      const midPoint = rect.top + rect.height / 2;
      const position: DropPosition =
        e.clientY < midPoint
          ? DRAG_DROP.DROP_POSITION.above
          : DRAG_DROP.DROP_POSITION.below;
      setDropPosition(position);

      // Update global context so DragAndDrop provider can access it on drag end
      setGlobalDropPosition(id, position);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragActive, isCurrentlyOver, id, setGlobalDropPosition]);

  // Reset drop position when not over this element
  useEffect(() => {
    if (!isCurrentlyOver) {
      setDropPosition(null);
    }
  }, [isCurrentlyOver]);

  const itemStyle: React.CSSProperties = {
    cursor: disabled ? "default" : enableCustomDragHandle ? "default" : "grab",
    opacity: isDragging ? 0.5 : 1,
    transition: "transform .1s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
  };

  const finalClassName =
    `draggable-item ${className} ${isDragging ? "dragging" : ""} ${isCurrentlyOver ? "is-over" : ""}`.trim();

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
