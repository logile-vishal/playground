import React from "react";
import { Box } from "@mui/material";

import clsx from "@/utils/clsx";
import { CButton } from "@/core/components/button/button";
import type { IconButtonProps } from "@/core/types/button.type";

const CIconButton: React.FC<IconButtonProps> = ({
  severity = "secondary",
  variant = "ghost",
  size = "large",
  disabled = false,
  className,
  children,
  title,
  id,
  walkMeId,
  onClick,
}) => {
  return (
    <Box className="icon-button-wrapper">
      <CButton
        disabled={disabled}
        severity={severity}
        variant={variant}
        size={size}
        className={clsx({
          "icon-button": true,
          [`icon-button--${size}`]: !!size,
          [`icon-button--${variant}`]: variant === "ghost",
          [className]: !!className,
        })}
        id={id}
        title={title}
        walkMeId={walkMeId}
        onClick={onClick}
      >
        {children}
      </CButton>
    </Box>
  );
};

export default CIconButton;
