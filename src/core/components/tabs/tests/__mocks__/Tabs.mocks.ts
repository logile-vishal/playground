import React, { type ReactElement } from "react";
import { vi } from "vitest";
import { type CTabsProps } from "../../Tabs";

export const mockOnChange = vi.fn();

export const defaultTabsProps: CTabsProps = {
  value: 0,
  onChange: mockOnChange,
  children: [
    React.createElement("div", { key: "tab1" }, "Tab 1"),
    React.createElement("div", { key: "tab2" }, "Tab 2"),
    React.createElement("div", { key: "tab3" }, "Tab 3"),
  ] as ReactElement[],
};

export const standardVariantProps: CTabsProps = {
  ...defaultTabsProps,
  variant: "standard",
};

export const scrollableVariantProps: CTabsProps = {
  ...defaultTabsProps,
  variant: "scrollable",
};

export const propsWithClassName: CTabsProps = {
  ...defaultTabsProps,
  className: "custom-tabs-class",
};

export const propsWithMultipleClassNames: CTabsProps = {
  ...defaultTabsProps,
  className: "custom-class-1 custom-class-2",
};

export const propsWithoutChildren: CTabsProps = {
  value: 0,
  onChange: mockOnChange,
};

export const propsWithDifferentValue: CTabsProps = {
  ...defaultTabsProps,
  value: 2,
};

export const propsWithAllAttributes: CTabsProps = {
  value: 1,
  onChange: mockOnChange,
  variant: "scrollable",
  className: "full-featured-tabs",
  "aria-label": "Navigation tabs",
  children: [
    React.createElement("div", { key: "tab1" }, "Tab 1"),
    React.createElement("div", { key: "tab2" }, "Tab 2"),
  ] as ReactElement[],
};

export const resetMocks = () => {
  mockOnChange.mockClear();
};
