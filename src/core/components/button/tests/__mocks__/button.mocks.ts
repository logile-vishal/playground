import { vi } from "vitest";
import type { ButtonProps } from "@/core/types/button.type";

export const mockOnClick = vi.fn();
export const mockOnMouseEnter = vi.fn();
export const mockOnMouseLeave = vi.fn();
export const mockOnFocus = vi.fn();
export const mockOnBlur = vi.fn();

export const defaultButtonProps: ButtonProps = {
  children: "Click Me",
  onClick: mockOnClick,
};

export const primarySolidButtonProps: ButtonProps = {
  children: "Primary Solid",
  severity: "primary",
  variant: "solid",
  onClick: mockOnClick,
};

export const secondarySolidButtonProps: ButtonProps = {
  children: "Secondary Solid",
  severity: "secondary",
  variant: "solid",
  onClick: mockOnClick,
};

export const outlinedButtonProps: ButtonProps = {
  children: "Outlined Button",
  severity: "primary",
  variant: "outline",
  onClick: mockOnClick,
};

export const textButtonProps: ButtonProps = {
  children: "Text Button",
  severity: "primary",
  variant: "text",
  onClick: mockOnClick,
};

export const smallButtonProps: ButtonProps = {
  children: "Small",
  size: "small",
  onClick: mockOnClick,
};

export const mediumButtonProps: ButtonProps = {
  children: "Medium",
  size: "medium",
  onClick: mockOnClick,
};

export const largeButtonProps: ButtonProps = {
  children: "Large",
  size: "large",
  onClick: mockOnClick,
};

export const disabledButtonProps: ButtonProps = {
  children: "Disabled Button",
  disabled: true,
  onClick: mockOnClick,
};

export const buttonWithClassNameProps: ButtonProps = {
  children: "Custom Class",
  className: "custom-class",
  onClick: mockOnClick,
};

export const buttonWithSxProps: ButtonProps = {
  children: "Custom SX",
  sx: { margin: "10px" },
  onClick: mockOnClick,
};

export const buttonWithAllPropsProps: ButtonProps = {
  children: "All Props",
  severity: "primary",
  variant: "solid",
  size: "large",
  disabled: false,
  className: "custom-class",
  onClick: mockOnClick,
};

export const resetMocks = () => {
  mockOnClick.mockReset();
  mockOnMouseEnter.mockReset();
  mockOnMouseLeave.mockReset();
  mockOnFocus.mockReset();
  mockOnBlur.mockReset();
};
