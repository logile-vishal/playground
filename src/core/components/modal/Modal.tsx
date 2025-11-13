import React, { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import SvgIcon from "@/core/components/icon/Icon";
import IconButton from '@/core/components/button/IconButton';
import type { CommonModalActionProps, CommonModalBodyProps, CommonModalHeaderProps, CommonModalProps } from "@/core/types/modal.type";
import { modalDefaultBtnConstants } from "@/core/constants/modal-constants";
import clsx from "@/utils/clsx";

import { CommonButton } from "../button/button";
import "./Modal.scss";

/**
 * @component ModalHeader
 * @description Modal header component.
 * @param {object} props
 * @param {string} props.title - Header title.
 * @param {Function} props.onClose - Close handler.
 * @param {string} [props.headerClass] - Custom class.
 * @returns {ReactNode} returns wrapper component for modal header.
 */
export const ModalHeader: React.FC<CommonModalHeaderProps> = ({headerClass, children}) => {
  return <Box className={clsx({"common-modal__content-header": true, [headerClass]:true})}>{children}</Box>
}

/**
 * @component ModalBody
 * @description Modal body component.
 * @param {object} props
 * @param {string} [props.title] - Applies alternate style.
 * @param {string} [props.containerClassName] - Custom class.
 * @param {React.ReactNode} props.children - Body content.
 * @returns {ReactNode} return wrapper component for modal body.
 */
export const ModalBody: React.FC<CommonModalBodyProps> = ({containerClassName, children}) => {
  return <Box className={clsx({"common-modal__content-body": true, [containerClassName]: true})}>{children}</Box>
}

/**
 * @component ModalFooter
 * @description Modal footer component.
 * @param {object} props
 * @param {string} [props.cancelText] - Cancel button text.
 * @param {Function} [props.onClose] - Cancel handler.
 * @param {string} [props.confirmText] - Confirm button text.
 * @param {Function} [props.onConfirm] - Confirm handler.
 * @param {string} [props.actionClass] - Applies action button class.
 * @returns {ReactNode} return wrapper component for modal footer.
 */
export const ModalFooter: React.FC<CommonModalActionProps> = ({cancelText, onClose, confirmText, onConfirm, actionClass="common-modal__content-footer-confirm", severity}) => {
  return <Box className="common-modal__content-footer">
            {cancelText && <CommonButton variant="outline" size="large" className="common-modal__content-footer-cancel" onClick={onClose} severity="secondary">
              {cancelText}</CommonButton>}
            {confirmText && <CommonButton onClick={onConfirm} className={clsx({ [actionClass] : true })} 
            severity={severity}>{confirmText}</CommonButton>}
          </Box>
}

/**
 * Determines if a modal has a custom footer provided as a child component.
 * @param {ReactNode} children - Modal inner content.
 * @returns {boolean} True if a ModalHeader component exists in children.
 */
const hasCustomHeader = (children: ReactNode): boolean => {
  const arr = React.Children.toArray(children);
  return arr.some(
    (child) =>
      React.isValidElement(child) &&
      child.type === ModalHeader
  );
};

/**
 * Determines if a modal has a custom footer provided as a child component.
 * @param {ReactNode} children - Modal inner content.
 * @returns {boolean} True if a ModalFooter component exists in children.
 */
const hasCustomFooter = (children: ReactNode): boolean => {
  const arr = React.Children.toArray(children);
  return arr.some(
    (child) =>
      React.isValidElement(child) &&
      child.type === ModalFooter
  );
};

const CommonModal: React.FC<CommonModalProps> = ({
  open,
  onClose,
  title,
  children,
  showActions = true,
  onConfirm,
  size,
  confirmText = modalDefaultBtnConstants.confirm,
  cancelText = modalDefaultBtnConstants.cancel,
  className="",
  severity="primary",
  containerClassName = "",
  disableBackdropClick = false,
  ...props
}) => {

  return (
    <Modal
      open={open}
      onClose={disableBackdropClick ? undefined : onClose}
      className={clsx({"common-modal": true, [className]:true})}
     >
      <Box 
        className={clsx({
          "common-modal__content": true, 
          "common-modal__content--small": size === "small",
          "common-modal__content--medium": size === "medium",
          "common-modal__content--large": size === "large",
          [containerClassName]: true,
        })} 
        {...props}
      >

        {title && !hasCustomHeader(children) && <Box className={clsx({"common-modal__content-header": true})}>
          <Box className="common-modal__content-header-title">{title}</Box>
          <IconButton disableHover={true} onClick={onClose}>
            <SvgIcon component="close" size={32} fill="var(--icon-secondary)" />
          </IconButton>
        </Box>}
          
        {children}

        {showActions && !hasCustomFooter(children) && <Box className="common-modal__content-footer">
          {cancelText && <CommonButton variant="outline" size="large" onClick={onClose} severity="secondary">
            {cancelText}</CommonButton>}
          {confirmText && <CommonButton onClick={onConfirm} className="common-modal__content-footer-confirm" severity={severity}>
            {confirmText}</CommonButton>}
        </Box>}
      </Box>
    </Modal>
  );
};

export default CommonModal;