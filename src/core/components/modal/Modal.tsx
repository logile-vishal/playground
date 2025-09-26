import React, { type ReactElement } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SvgIcon from "@/core/components/icon/Icon";
import IconButton from '@/core/components/button/IconButton';
 
interface CommonModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactElement;
  children: React.ReactNode;
  showActions?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}
 
const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
  p: 2,
  color: "var(--text-primary)",
  width: "750px",
  maxHeight: "80vh",
  overflowY: "auto",
};
 
const CommonModal: React.FC<CommonModalProps> = ({
  open,
  onClose,
  title,
  children,
  showActions = false,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  return (
    <Modal open={open} onClose={onClose} className="common-modal">
      <Box sx={style}>
        {/* Title */}
        {title && (
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} gap="2px">
            <Box width="95%">{title}</Box>
            <IconButton disableHover={true} onClick={onClose}>
              <SvgIcon component="close" size={32} fill="var(--icon-secondary)" />
            </IconButton>
          </Box>
        )}
 
        {/* Body */}
        <Box sx={{ fontSize: "var(--size-body)" }}>{children}</Box>
 
        {/* Actions */}
        {showActions && (
          <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
            <IconButton onClick={onClose}>{cancelText}</IconButton>
            {onConfirm && (
              <IconButton onClick={onConfirm} color="primary">
                {confirmText}
              </IconButton>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
};
 
export default CommonModal;