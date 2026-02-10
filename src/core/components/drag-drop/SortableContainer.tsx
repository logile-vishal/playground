import React from "react";
import { SortableContext } from "@dnd-kit/sortable";

import type { SortableContainerProps } from "./types/DragAndDrop.type";

/**
 * @method SortableContainer
 * @description A droppable container that can accept dragged items.
 * Uses dnd-kit's useDroppable and useDndContext hooks directly.
 * @param props SortableContainerProps with container configuration
 */
export const CSortableContainer: React.FC<SortableContainerProps> = ({
  children,
  sortableIds,
}) => {
  return (
    <SortableContext items={sortableIds ?? []}>{children}</SortableContext>
  );
};
