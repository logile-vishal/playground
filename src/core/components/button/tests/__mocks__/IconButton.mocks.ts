import React from "react";
import { vi } from "vitest";
import type { IconButtonProps } from "../../IconButton";

export const mockOnClick = vi.fn();
export const mockOnMouseEnter = vi.fn();
export const mockOnMouseLeave = vi.fn();
export const mockOnFocus = vi.fn();
export const mockOnBlur = vi.fn();
export const mockOnKeyDown = vi.fn();

export const defaultIconButtonProps: IconButtonProps = {
  children: React.createElement("span", null, "Icon"),
  onClick: mockOnClick,
};

export const primaryVariantProps: IconButtonProps = {
  children: React.createElement("span", null, "Primary Icon"),
  variant: "primary",
  onClick: mockOnClick,
};

export const secondaryVariantProps: IconButtonProps = {
  children: React.createElement("span", null, "Secondary Icon"),
  variant: "secondary",
  onClick: mockOnClick,
};

export const outlineVariantProps: IconButtonProps = {
  children: React.createElement("span", null, "Outline Icon"),
  variant: "outline",
  onClick: mockOnClick,
};

export const disabledIconButtonProps: IconButtonProps = {
  children: React.createElement("span", null, "Disabled Icon"),
  disabled: true,
  onClick: mockOnClick,
};

export const disableHoverProps: IconButtonProps = {
  children: React.createElement("span", null, "No Hover"),
  variant: "outline",
  disableHover: true,
  onClick: mockOnClick,
};

export const iconButtonWithAriaProps: IconButtonProps = {
  children: React.createElement("span", null, "Accessible Icon"),
  "aria-label": "Custom Icon Button",
  onClick: mockOnClick,
};

export const iconButtonWithDataTestId: IconButtonProps & {
  "data-testid"?: string;
} = {
  children: React.createElement("span", null, "Test Icon"),
  "data-testid": "custom-icon-button",
  onClick: mockOnClick,
};

export const resetMocks = () => {
  mockOnClick.mockReset();
  mockOnMouseEnter.mockReset();
  mockOnMouseLeave.mockReset();
  mockOnFocus.mockReset();
  mockOnBlur.mockReset();
  mockOnKeyDown.mockReset();
};
