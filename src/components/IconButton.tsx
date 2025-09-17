import React from "react";
import styled from "@emotion/styled";
import { alpha } from "@mui/material";
import ButtonBase, {type ButtonBaseProps } from "@mui/material/ButtonBase";
import type { Theme } from "@mui/material/styles";

type Variant = "primary" | "secondary" | "outline";

interface IconButtonProps extends ButtonBaseProps {
  variant?: Variant;
  disableHover?: boolean;
  disabled?: boolean;
}

const IconButtonStyled = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "variant" && prop !== "disableHover",
})(({ theme, variant = "primary", disableHover, disabled }: { theme?: Theme } & IconButtonProps) => {
  const baseStyles = {
    borderRadius: theme?.shape.borderRadius,
    border: "1px solid transparent",
    padding: "0.5rem",
    transition: "all 0.2s ease-in-out",
    color: disabled ? "var(--gray-300)" : "#5C5C5C"
  };

  const hoverStyles: Record<Variant, object> = {
    primary: {
          color: theme?.palette.primary.main,
          backgroundColor: alpha(theme?.palette.primary.main??"", 0.1),

    },
    secondary: {
      color: theme?.palette.secondary.main,
      backgroundColor: alpha(theme?.palette.secondary.main??"", 0.1),
    },
    outline: {
      border: `1px solid var(--border-color-secondary)`,
      ...(disableHover
        ? {}
        : {
            border: `1px solid var(--border-color-brand-primary_subtle)`,
            backgroundColor: alpha(theme?.palette.primary.main??"", 0.1),
            color: theme?.palette.primary.main,
          }),
    },
  };

  return {
    ...baseStyles,
    ...(variant === "outline" && { border: `1px solid var(--border-color-secondary)` }),
    "&:hover": {
      cursor: "pointer",

      ...(!disableHover ? hoverStyles[variant] : {}),
    },
  };
});

const IconButton: React.FC<IconButtonProps> = ({ children, ...props }) => {
  return <IconButtonStyled {...props}>{children}</IconButtonStyled>;
};

export default IconButton;
