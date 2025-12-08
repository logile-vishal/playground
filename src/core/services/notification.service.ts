// NotificationProvider.ts
import { createContext, useContext } from "react";
import type { SeverityType } from "@/core/types/severity.type";
import type { ToastVariantType } from "@/core/components/toast/toast.type";

export type Notification = {
  id?: string;
  content?: React.ReactNode | null;
  title?: string;
  description?: string;
  config?: {
    severity?: SeverityType;
    variant?: ToastVariantType;
    duration?: number;
    isSizeLarge?: boolean;
    actions?: React.ReactNode[];
    anchorOrigin?: {
      vertical: "top" | "bottom";
      horizontal: "left" | "center" | "right";
    };
  };
};

export type NotificationContextType = {
  notify: (notification: Notification) => void;
};

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotification must be used within NotificationContextProvider"
    );
  return context;
};
