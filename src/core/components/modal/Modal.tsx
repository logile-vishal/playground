import React, { type ReactElement } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SvgIcon from "@/core/components/icon/Icon";
import IconButton from '@/core/components/button/IconButton';
import { Button } from "@mui/material";
import "./Modal.scss";
 
type CommonModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactElement;
  children: React.ReactNode;
  showActions?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  width?: string;
  className?: string;
}
 

const cancelStyle = {
  color: "var(--text-primary)",
  fontSize: "var(--size-body)",
  border: "1px solid var(--border-secondary)",
}

const confirmStyle = {
  color: "var(--text-white)",
  fontSize: "var(--size-body)",
  backgroundColor: "var(--bg-primary)",
}

const defaultWidth = "600px";
 
const CommonModal: React.FC<CommonModalProps> = ({
  open,
  onClose,
  title,
  children,
  showActions = false,
  onConfirm,
  width,
  confirmText = "Confirm",
  cancelText = "Cancel",
  className
}) => {

  const modalClassName = className ? `common-modal ${className}` : "common-modal";
  return (
    <Modal open={open} onClose={onClose} className={modalClassName} >
      <div className="common-modal__main"  style={{width: width || defaultWidth}}>
        {/* Title */}
        {title && (
          <Box className="common-modal__header">
            <Box className="common-modal__header-title">{title}</Box>
            <IconButton disableHover={true} onClick={onClose}>
              <SvgIcon component="close" size={32} fill="var(--icon-secondary)" />
            </IconButton>
          </Box>
        )}
 
        {/* Body */}
        <div className="common-modal__content">{children}</div>
 
        {/* Actions */}
        {showActions && (
          <Box className="common-modal__actions">
            {cancelText && <Button className="common-modal__actions-btn-cancel " variant="outlined" onClick={onClose} sx={cancelStyle}>{cancelText}</Button>}
            {confirmText && <Button className="common-modal__actions-btn-confirm" variant="contained" onClick={onConfirm} sx={confirmStyle}>{confirmText}</Button>}
          </Box>
        )}
      </div>
    </Modal>
  );
};
 
export default CommonModal;