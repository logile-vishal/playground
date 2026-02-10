import React, { useContext, useRef, useCallback } from "react";

import type {
  DropPositionContextValue,
  DropPositionInfo,
  DropPosition,
} from "../types/DragAndDrop.type";

/**
 * Context for sharing drop position between DraggableItem and DragAndDrop provider.
 * Uses ref-based storage for synchronous access during drag end.
 */
export const DropPositionContext =
  React.createContext<DropPositionContextValue | null>(null);

/**
 * @method useDropPositionProvider
 * @description Hook to create drop position context value. Used ONLY in CDragAndDrop provider.
 * Uses refs for synchronous access - critical for drag end handler.
 * @returns DropPositionContextValue with ref and setter/getter functions
 */
export const useDropPositionProvider = (): DropPositionContextValue => {
  const dropPositionRef = useRef<DropPositionInfo>({
    overId: null,
    position: null,
  });

  const setDropPosition = useCallback(
    (overId: string | null, position: DropPosition): void => {
      dropPositionRef.current = { overId, position };
    },
    []
  );

  const getDropPosition = useCallback((): DropPositionInfo => {
    return dropPositionRef.current;
  }, []);

  return {
    dropPositionRef,
    setDropPosition,
    getDropPosition,
  };
};

/**
 * @method useDropPosition
 * @description Hook to access and update drop position from DraggableItem components.
 * Must be used within a CDragAndDrop provider.
 * @returns Object with setDropPosition and getDropPosition functions
 */
export const useDropPosition = (): DropPositionContextValue => {
  const context = useContext(DropPositionContext);
  if (!context) {
    throw new Error(
      "useDropPosition must be used within a CDragAndDrop provider"
    );
  }
  return context;
};
