import { EmptyState } from "@/core/constants/icons";
import type { SvgIconComponent } from "@/core/components/icon/Icon";
import type { NoDataProps } from "@/core/types/no-data.type";
import { vi } from "vitest";

import React from "react";

export const MockIconComponent: SvgIconComponent = (() => {
  const Component: React.FC<React.SVGProps<SVGSVGElement>> = () =>
    React.createElement(
      "svg",
      { "data-testid": "mock-icon" },
      React.createElement("path", { d: "M0 0h24v24H0z" })
    );

  return Component as SvgIconComponent;
})();

export const mockNoDataProps: NoDataProps = {
  imageSrcName: EmptyState,
  title: "Test Title",
  description: "Test Description",
  imageWidth: 60,
};

export const mockNoDataPropsWithoutOptionals: NoDataProps = {
  imageSrcName: EmptyState,
};

export const mockNoDataPropsCustomIcon: NoDataProps = {
  imageSrcName: MockIconComponent,
  title: "Custom Icon Title",
  description: "Custom Icon Description",
  imageWidth: 80,
};

export const mockNoDataPropsLargeImage: NoDataProps = {
  imageSrcName: EmptyState,
  title: "Large Image",
  description: "This has a large image",
  imageWidth: 200,
};

export const mockNoDataPropsSmallImage: NoDataProps = {
  imageSrcName: EmptyState,
  title: "Small Image",
  imageWidth: 20,
};

export const mockNoDataPropsOnlyTitle: NoDataProps = {
  imageSrcName: EmptyState,
  title: "Only Title Here",
};

export const mockNoDataPropsOnlyDescription: NoDataProps = {
  imageSrcName: EmptyState,
  description: "Only Description Here",
};

export const mockNoDataPropsEmptyStrings: NoDataProps = {
  imageSrcName: EmptyState,
  title: "",
  description: "",
};

export const mockNoDataPropsLongText: NoDataProps = {
  imageSrcName: EmptyState,
  title:
    "This is a very long title that should still render properly without breaking the layout",
  description:
    "This is a very long description that should also render properly and maintain proper formatting across multiple lines without causing any layout issues",
  imageWidth: 100,
};

export const resetMocks = () => {
  vi.clearAllMocks();
};
