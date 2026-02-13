import { useCallback, useRef } from "react";

type LongPressOptions = {
  onLongPress: (event: React.MouseEvent | React.TouchEvent) => void;
  onClick?: (event: React.MouseEvent | React.TouchEvent) => void;
  delay?: number;
  shouldPreventDefault?: boolean;
};

type LongPressHandlers = {
  onMouseDown: (event: React.MouseEvent) => void;
  onMouseUp: (event: React.MouseEvent) => void;
  onMouseLeave: (event: React.MouseEvent) => void;
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchEnd: (event: React.TouchEvent) => void;
};

const DEFAULT_DELAY = 500;

export const useLongPress = ({
  onLongPress,
  onClick,
  delay = DEFAULT_DELAY,
  shouldPreventDefault = true,
}: LongPressOptions): LongPressHandlers => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = useRef(false);
  const eventRef = useRef<React.MouseEvent | React.TouchEvent | null>(null);

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent): void => {
      if (shouldPreventDefault) {
        event.preventDefault();
      }

      eventRef.current = event;
      isLongPressRef.current = false;

      timeoutRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        if (eventRef.current) {
          onLongPress(eventRef.current);
        }
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (event: React.MouseEvent | React.TouchEvent): void => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (!isLongPressRef.current && onClick) {
        onClick(event);
      }

      isLongPressRef.current = false;
      eventRef.current = null;
    },
    [onClick]
  );

  const cancel = useCallback((): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isLongPressRef.current = false;
    eventRef.current = null;
  }, []);

  return {
    onMouseDown: (event: React.MouseEvent): void => start(event),
    onMouseUp: (event: React.MouseEvent): void => clear(event),
    onMouseLeave: (): void => cancel(),
    onTouchStart: (event: React.TouchEvent): void => start(event),
    onTouchEnd: (event: React.TouchEvent): void => clear(event),
  };
};
