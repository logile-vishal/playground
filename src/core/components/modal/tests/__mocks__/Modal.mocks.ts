import { vi } from "vitest";
import type { ModalProps } from "@/core/types/modal.type";

export const mockOnClose = vi.fn();
export const mockOnConfirm = vi.fn();

export const mockDefaultProps: ModalProps = {
  open: true,
  onClose: mockOnClose,
  title: "Test Modal Title",
  children: "Test Modal Content",
  showActions: true,
  onConfirm: mockOnConfirm,
  size: "medium",
  severity: "primary",
  disableBackdropClick: false,
  disablePrimaryAction: false,
  walkMeIdPrefix: ["test"],
};

export const mockSmallModalProps: ModalProps = {
  ...mockDefaultProps,
  size: "small",
};

export const mockLargeModalProps: ModalProps = {
  ...mockDefaultProps,
  size: "large",
};

export const mockModalWithCustomTexts: ModalProps = {
  ...mockDefaultProps,
  confirmText: "Custom Confirm",
  cancelText: "Custom Cancel",
};

export const mockModalWithoutActions: ModalProps = {
  ...mockDefaultProps,
  showActions: false,
};

export const mockModalWithDisabledPrimary: ModalProps = {
  ...mockDefaultProps,
  disablePrimaryAction: true,
};

export const mockModalWithBackdropDisabled: ModalProps = {
  ...mockDefaultProps,
  disableBackdropClick: true,
};

export const mockModalWithCustomClassName: ModalProps = {
  ...mockDefaultProps,
  className: "custom-modal-class",
  containerClassName: "custom-container-class",
};

export const mockModalWithSecondarySeverity: ModalProps = {
  ...mockDefaultProps,
  severity: "secondary",
};

export const mockTranslation = {
  GENERAL: {
    cancelButtonLabel: "Cancel",
    confirmButtonLabel: "Confirm",
  },
};

export const mockGenerateId = vi.fn((ids: string[]) => ids.join("-"));

export const mockUseCommonTranslation = vi.fn(() => mockTranslation);
export const mockUseWalkmeId = vi.fn(() => ({
  generateId: mockGenerateId,
}));

export const resetAllMocks = () => {
  mockOnClose.mockReset();
  mockOnConfirm.mockReset();
  mockGenerateId.mockClear();
  mockUseCommonTranslation.mockClear();
  mockUseWalkmeId.mockClear();
};
