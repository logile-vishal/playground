import { vi } from "vitest";
import type { CSwitchProps, CSwitchSize } from "../../Switch";

export const mockOnChange = vi.fn();

export const defaultSwitchProps: CSwitchProps = {
  defaultChecked: false,
  disabled: false,
  onChange: mockOnChange,
};

export const smallSwitchProps: CSwitchProps = {
  size: "small",
  defaultChecked: true,
  onChange: mockOnChange,
};

export const mediumSwitchProps: CSwitchProps = {
  size: "medium",
  defaultChecked: false,
  onChange: mockOnChange,
};

export const largeSwitchProps: CSwitchProps = {
  size: "large",
  defaultChecked: true,
  onChange: mockOnChange,
};

export const disabledSwitchProps: CSwitchProps = {
  disabled: true,
  defaultChecked: false,
  onChange: mockOnChange,
};

export const checkedSwitchProps: CSwitchProps = {
  checked: true,
  onChange: mockOnChange,
};

export const uncheckedSwitchProps: CSwitchProps = {
  checked: false,
  onChange: mockOnChange,
};

export const customClassSwitchProps: CSwitchProps = {
  className: "custom-switch-class",
  size: "medium",
  onChange: mockOnChange,
};

export const allSizes: CSwitchSize[] = ["small", "medium", "large"];

export const resetMocks = () => {
  mockOnChange.mockClear();
};
