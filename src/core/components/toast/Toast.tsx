import { Typography } from '@mui/material';
import React from 'react';

import SvgIcon from '@/core/components/icon/Icon';
import clsx from '@/utils/clsx';
import { Severity, type SeverityType } from '@/core/types/severity.type';
import { CircleCheckFilled, Close, ExclamationCircleFilled, ExclamationTriangleFilled, InfoCircleFilled } from '@/core/constants/icons';

import type { ToastVariantType } from './toast.type';
import { ToastVariant } from './toast.type';
import './ToastStyle.scss';

type ToastProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  severity: SeverityType;
  variant: ToastVariantType;
  actions?: React.ReactNode[];
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  isSizeLarge?: boolean;
  autoHideDuration?: number;
};

const Toast = ({
  open,
  onClose,
  title,
  severity: toastSeverity = Severity.SUCCESS,
  variant = ToastVariant.Filled,
  isSizeLarge,
  description,
  actions,
  autoHideDuration,
}: ToastProps) => {

  const severityIcons = {
    [Severity.SUCCESS]: <SvgIcon component={CircleCheckFilled} size={16} />,
    [Severity.ERROR]: <SvgIcon component={ExclamationCircleFilled} size={16} />,
    [Severity.WARNING]: <SvgIcon component={ExclamationTriangleFilled} size={16} />,
    [Severity.INFORMATION]: <SvgIcon component={InfoCircleFilled} size={16} />,
    [Severity.FEATURE]: <SvgIcon component={InfoCircleFilled} size={16} />,
  };
  const severityIcon = severityIcons[toastSeverity];

  React.useEffect(() => {
    if (open && autoHideDuration) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  if (!open) return null;

  return (
    <div
      className={clsx({
        [`toast toast--${toastSeverity} toast--${variant}`]: true,
        'toast--large': isSizeLarge
      })}
    >
      <div className='toast__severity-icon'>{severityIcon}</div>
      <div className='toast__body'>
        <div className='toast__body-text'>
          <Typography className='toast__body-title'>{title}</Typography>
          {description && isSizeLarge && (
            <Typography className='toast__body-desc'>
              {description}
            </Typography>
          )}
        </div>
        <div className='toast__body-action'>{actions?.map((action, index) => {
          return [ index > 0 ? <div className='toast__body-action-separator'> <span>∙</span> </div> : null,action ]
          } )}</div>
      </div>
      <div className='toast__close-btn' onClick={onClose}>
          <SvgIcon component={Close} size={20} />
      </div>
    </div>
  );
};

export default Toast;
