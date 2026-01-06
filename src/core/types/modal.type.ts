import type { MODAL_SIZE } from "@/core/constants/modal-constants";

import type { ButtonSeverity } from "@/core/types/button.type";

export type ModalSizeType = (typeof MODAL_SIZE)[keyof typeof MODAL_SIZE];

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showActions?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  className?: string;
  width?: string;
  size?: ModalSizeType;
  severity?: ButtonSeverity;
  containerClassName?: string;
  disableBackdropClick?: boolean;
  disablePrimaryAction?: boolean;
  walkMeIdPrefix?: string[];
};

export type ModalHeaderProps = {
  headerClassName?: string;
  children: React.ReactNode;
};

export type ModalBodyProps = {
  containerClassName?: string;
  children: React.ReactNode;
};

export type ModalActionProps = {
  footerClassName?: string;
  children: React.ReactNode;
};
