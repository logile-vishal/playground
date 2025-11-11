import type { ButtonSeverity } from "./button.type";
 
export type CommonModalProps = {
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
  size?: 'small' | 'medium' | 'large';
  severity?: ButtonSeverity;
  containerClassName?: string;
  disableBackdropClick?: boolean;
}

export type CommonModalHeaderProps = {
  children: React.ReactNode;
  headerClass?: string;
}

export type CommonModalBodyProps = {
  containerClassName?: string;
  children: React.ReactNode;
}

export type CommonModalActionProps = {
  cancelText?: string;
  onClose: () => void;
  confirmText?: string;
  onConfirm?: () => void;
  actionClass?: string;
  severity?: ButtonSeverity;
}