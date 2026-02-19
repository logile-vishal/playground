import React from "react";
import { Box, Button as MUIButton } from "@mui/material";

import type { ButtonProps } from "@/core/types/button.type";
import { useWalkmeId } from "@/core/hooks/useWalkmeId";
import clsx from "@/utils/clsx";

import "./button.scss";

export const CButton: React.FC<ButtonProps> = ({
  severity = "primary",
  variant = "solid",
  size = "large",
  disabled = false,
  className,
  children,
  title,
  id,
  walkMeId,
  onClick,
}) => {
  const { generateId } = useWalkmeId();
  return (
    <Box className="button-wrapper">
      <MUIButton
        disabled={disabled}
        className={clsx({
          button: true,
          [`button--${severity}`]: true,
          [`button--${variant}`]: true,
          [`button--${size}`]: true,
          [`button--disabled`]: disabled,
          [className]: !!className,
        })}
        id={id}
        title={title}
        data-walkme-id={generateId(walkMeId)}
        onClick={onClick}
      >
        {children}
      </MUIButton>
    </Box>
  );
};
