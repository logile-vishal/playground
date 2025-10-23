import {  Snackbar, Typography } from '@mui/material';
import React from 'react';

import SvgIcon from '@/core/components/icon/Icon';
import clsx from '@/utils/clsx';
import { Severity, type SeverityType } from '@/core/types/severity.type';

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
  anchorOrigin,
  isSizeLarge,
  description,
  actions,
  autoHideDuration,
}: ToastProps) => {

  const severityIcons = {
    [Severity.SUCCESS]: <SvgIcon component='circleCheckFilled' size={16} />,
    [Severity.ERROR]: <SvgIcon component='exclamationCircleFilled' size={16} />,
    [Severity.WARNING]: <SvgIcon component='exclamationTriangleFilled' size={16} />,
    [Severity.INFORMATION]: <SvgIcon component='infoCircleFilled' size={16} />,
    [Severity.FEATURE]: <SvgIcon component='infoCircleFilled' size={16} />,
  };
  const severityIcon = severityIcons[toastSeverity];

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration ?? 6000}
      onClose={onClose}
      anchorOrigin={
        anchorOrigin ?? { vertical: 'bottom', horizontal: 'left' }
      }
    >
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
        <div className='toast__close-btn'>
        
            <SvgIcon component='close' size={20} />
   
        </div>
      </div>
    </Snackbar>
  );
};

export default Toast;
