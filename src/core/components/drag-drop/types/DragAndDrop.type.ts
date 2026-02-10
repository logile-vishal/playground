import type {
  DragEndEvent,
  DragStartEvent,
  DraggableAttributes,
} from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

import type { DRAG_DROP } from "../constants/dragAndDrop";

/**
 * @description Extended drag end event that includes drop position information
 */
export type ExtendedDragEndEvent = DragEndEvent & {
  dropPosition: DropPosition;
};

export type SortableContainerProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sortableIds: string[];
};

/**
 * @description Props passed to drag handle render function
 */
export type DragHandleProps = {
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
};

export type DraggableItemProps = {
  id: string;
  children:
    | React.ReactNode
    | ((dragHandleProps: DragHandleProps) => React.ReactNode);
  disabled?: boolean;
  className?: string;
  /** When true, the entire item is NOT draggable - use dragHandleProps in children instead */
  enableCustomDragHandle?: boolean;
};

export type DragAndDropProps = {
  children: React.ReactNode;
  restrictToVertical?: boolean;
  disabled?: boolean;
  renderDragOverlay?: (activeId: unknown, qIndex: string) => React.ReactNode;
  callbacks?: {
    onDragStart?: (event: DragStartEvent) => void;
    onDragEnd?: (event: ExtendedDragEndEvent) => void;
  };
};

export type DropPosition =
  (typeof DRAG_DROP.DROP_POSITION)[keyof typeof DRAG_DROP.DROP_POSITION];
export type DropPositionInfo = {
  overId: string | null;
  position: DropPosition;
};
export type DropPositionContextValue = {
  dropPositionRef: React.MutableRefObject<DropPositionInfo>;
  setDropPosition: (overId: string | null, position: DropPosition) => void;
  getDropPosition: () => DropPositionInfo;
};
