import React from "react";
import { vi } from "vitest";
import { Severity } from "@/core/types/severity.type";
import { ToastVariant } from "../../toast.type";
import type { ToastProps } from "../../Toast";

export const mockOnClose = vi.fn();

export const defaultToastProps: ToastProps = {
  open: true,
  onClose: mockOnClose,
  title: "Test Toast Title",
  severity: Severity.SUCCESS,
  variant: ToastVariant.Filled,
};

export const successToastProps: ToastProps = {
  open: true,
  onClose: mockOnClose,
  title: "Success Message",
  description: "Operation completed successfully",
  severity: Severity.SUCCESS,
  variant: ToastVariant.Filled,
  isSizeLarge: true,
};

export const errorToastProps: ToastProps = {
  open: true,
  onClose: mockOnClose,
  title: "Error Message",
  description: "An error occurred",
  severity: Severity.ERROR,
  variant: ToastVariant.Filled,
  isSizeLarge: true,
};

export const warningToastProps: ToastProps = {
  open: true,
  onClose: mockOnClose,
  title: "Warning Message",
  description: "Please be cautious",
  severity: Severity.WARNING,
  variant: ToastVariant.Filled,
  isSizeLarge: true,
};

export const informationToastProps: ToastProps = {
  open: true,
  onClose: mockOnClose,
  title: "Information",
  description: "Here is some information",
  severity: Severity.INFORMATION,
  variant: ToastVariant.Filled,
  isSizeLarge: true,
};

export const featureToastProps: ToastProps = {
  open: true,
  onClose: mockOnClose,
  title: "New Feature",
  description: "Check out this new feature",
  severity: Severity.FEATURE,
  variant: ToastVariant.Filled,
  isSizeLarge: true,
};

export const toastWithActionsProps: ToastProps = {
  open: true,
  onClose: mockOnClose,
  title: "Toast with Actions",
  severity: Severity.SUCCESS,
  variant: ToastVariant.Filled,
  actions: [
    React.createElement("button", { key: "action1" }, "Action 1"),
    React.createElement("button", { key: "action2" }, "Action 2"),
  ],
};

export const toastWithMultipleActionsProps: ToastProps = {
  open: true,
  onClose: mockOnClose,
  title: "Multiple Actions",
  severity: Severity.SUCCESS,
  variant: ToastVariant.Filled,
  actions: [
    React.createElement("button", { key: "action1" }, "Undo"),
    React.createElement("button", { key: "action2" }, "Retry"),
    React.createElement("button", { key: "action3" }, "Dismiss"),
  ],
};

export const toastWithAutoHideProps: ToastProps = {
  open: true,
  onClose: mockOnClose,
  title: "Auto Hide Toast",
  severity: Severity.SUCCESS,
  variant: ToastVariant.Filled,
  autoHideDuration: 3000,
};

export const closedToastProps: ToastProps = {
  open: false,
  onClose: mockOnClose,
  title: "Closed Toast",
  severity: Severity.SUCCESS,
  variant: ToastVariant.Filled,
};

export const smallToastProps: ToastProps = {
  open: true,
  onClose: mockOnClose,
  title: "Small Toast",
  description: "This description should not be visible",
  severity: Severity.SUCCESS,
  variant: ToastVariant.Filled,
  isSizeLarge: false,
};

export const toastWithAnchorProps: ToastProps = {
  open: true,
  onClose: mockOnClose,
  title: "Toast with Anchor",
  severity: Severity.SUCCESS,
  variant: ToastVariant.Filled,
  anchorOrigin: {
    vertical: "top",
    horizontal: "right",
  },
};

export const resetMocks = () => {
  mockOnClose.mockReset();
};
