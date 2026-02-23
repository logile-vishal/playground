import React, { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import CSvgIcon from "@/core/components/icon/Icon";
import CIconButton from "@/core/components/button/IconButton";
import type {
  ModalActionProps,
  ModalBodyProps,
  ModalHeaderProps,
  ModalProps,
} from "@/core/types/modal.type";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
import clsx from "@/utils/clsx";
import { Close } from "@/core/constants/icons";
import { CButton } from "@/core/components/button/button";
import { useWalkmeId } from "@/core/hooks/useWalkmeId";

import "./Modal.scss";

/**
 * @component ModalHeader
 * @description Modal header component for displaying title and custom header content
 * @param {object} props - Component props
 * @param {string} [props.headerClassName] - Custom CSS class name for header styling
 * @param {React.ReactNode} props.children - Header content
 * @return {React.ReactNode} Modal header wrapper component
 */
export const ModalHeader: React.FC<ModalHeaderProps> = ({
  headerClassName,
  children,
}) => {
  return (
    <Box
      className={clsx({
        "common-modal__content-header": true,
        [headerClassName]: !!headerClassName,
      })}
    >
      {children}
    </Box>
  );
};

/**
 * @component ModalBody
 * @description Modal body component for displaying main content
 * @param {object} props - Component props
 * @param {string} [props.containerClassName] - Custom CSS class name for body styling
 * @param {React.ReactNode} props.children - Body content
 * @return {React.ReactNode} Modal body wrapper component
 */
export const ModalBody: React.FC<ModalBodyProps> = ({
  containerClassName,
  children,
}) => {
  return (
    <Box
      className={clsx({
        "common-modal__content-body": true,
        [containerClassName]: !!containerClassName,
      })}
    >
      {children}
    </Box>
  );
};

/**
 * @component ModalFooter
 * @description Modal footer component for displaying action buttons and custom content
 * @param {object} props - Component props
 * @param {string} [props.footerClassName] - Custom CSS class name for footer styling
 * @param {React.ReactNode} props.children - Footer content and buttons
 * @return {React.ReactNode} Modal footer wrapper component
 */
export const ModalFooter: React.FC<ModalActionProps> = ({
  footerClassName,
  children,
}) => {
  return (
    <Box
      className={clsx({
        "common-modal__content-footer": true,
        [footerClassName]: !!footerClassName,
      })}
    >
      {children}
    </Box>
  );
};

/**
 * Determines if a modal has a custom footer provided as a child component.
 * @param {ReactNode} children - Modal inner content.
 * @returns {boolean} True if a ModalHeader component exists in children.
 */
const hasCustomHeader = (children: ReactNode): boolean => {
  const arr = React.Children.toArray(children);
  return arr.some(
    (child) => React.isValidElement(child) && child.type === ModalHeader
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
    (child) => React.isValidElement(child) && child.type === ModalFooter
  );
};

const CModal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  showActions = true,
  onConfirm,
  size,
  confirmText,
  cancelText,
  className = "",
  severity = "primary",
  containerClassName = "",
  disableBackdropClick = false,
  disablePrimaryAction = false,
  walkMeIdPrefix = [],
  ...props
}) => {
  const { GENERAL } = useCommonTranslation();
  const { generateId } = useWalkmeId();
  return (
    <Modal
      open={open}
      onClose={disableBackdropClick ? undefined : onClose}
      className={clsx({ "common-modal": true, [className]: true })}
    >
      <Box
        className={clsx({
          "common-modal__content": true,
          "common-modal__content--small": size === "small",
          "common-modal__content--medium": size === "medium",
          "common-modal__content--large": size === "large",
          "common-modal__content--xlarge": size === "xlarge",
          [containerClassName]: true,
        })}
        {...props}
      >
        {title && !hasCustomHeader(children) && (
          <Box className={clsx({ "common-modal__content-header": true })}>
            <Box className="common-modal__content-header-title">{title}</Box>
            <CIconButton
              size="medium"
              onClick={onClose}
              walkMeId={[...walkMeIdPrefix, "close button"]}
            >
              <CSvgIcon
                component={Close}
                data-walkme-id={generateId([
                  ...walkMeIdPrefix,
                  "close button",
                  "icon",
                ])}
              />
            </CIconButton>
          </Box>
        )}

        {children}

        {showActions && !hasCustomFooter(children) && (
          <Box className="common-modal__content-footer">
            <CButton
              variant="outline"
              size="large"
              onClick={onClose}
              severity="secondary"
              data-walkme-id={generateId([
                ...walkMeIdPrefix,
                "modal",
                "cancel button",
              ])}
            >
              {cancelText || GENERAL.cancelButtonLabel}
            </CButton>

            <CButton
              onClick={onConfirm}
              className="common-modal__content-footer-confirm"
              severity={severity}
              disabled={disablePrimaryAction}
              data-walkme-id={generateId([
                ...walkMeIdPrefix,
                "modal",
                "confirm button",
              ])}
            >
              {confirmText || GENERAL.confirmButtonLabel}
            </CButton>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default CModal;
