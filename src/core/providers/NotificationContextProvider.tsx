import { useState, useCallback, type ReactNode } from "react";

import {
  type Notification,
  NotificationContext,
} from "@/core/services/notification.service";
import CToast from "@/core/components/toast/Toast";
import { Severity } from "@/core/types/severity.type";
import { ToastVariant } from "@/core/components/toast/toast.type";

export const NotificationContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((notif: Notification) => {
    const id = notif.id ?? `toast-${Date.now()}-${Math.random()}`;
    setNotifications((prev) => [...prev, { ...notif, id }]);
  }, []);

  const handleClose = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      <div
        style={{
          position: "fixed",
          bottom: 16,
          left: 16,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {notifications.map((notification) => (
          <CToast
            key={notification.id}
            open={true}
            onClose={() => handleClose(notification.id!)}
            title={notification.title ?? ""}
            description={notification.description}
            severity={notification.config?.severity ?? Severity.SUCCESS}
            variant={notification.config?.variant ?? ToastVariant.Filled}
            isSizeLarge={notification.config?.isSizeLarge}
            actions={notification.config?.actions}
            anchorOrigin={notification.config?.anchorOrigin}
            autoHideDuration={notification.config?.duration || 3000}
          />
        ))}
      </div>
      {children}
    </NotificationContext.Provider>
  );
};
