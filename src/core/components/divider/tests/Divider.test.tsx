import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CDivider from "../Divider";
import { ORIENTATION } from "@/core/constants/divider";
import {
  mockHorizontalDividerProps,
  mockVerticalDividerProps,
} from "./__mocks__/Divider.mocks";

describe("CDivider", () => {
  describe("Component Rendering", () => {
    it("should render divider component successfully", () => {
      const { container } = render(
        <CDivider {...mockHorizontalDividerProps} />
      );
      const dividerElement = container.querySelector(".divider");
      expect(dividerElement).toBeInTheDocument();
    });

    it("should render as a span element", () => {
      const { container } = render(
        <CDivider {...mockHorizontalDividerProps} />
      );
      const spanElement = container.querySelector("span");
      expect(spanElement).toBeInTheDocument();
    });
  });

  describe("Props Handling - Orientation", () => {
    it("should apply horizontal orientation class when orientation is horizontal", () => {
      const { container } = render(
        <CDivider {...mockHorizontalDividerProps} />
      );
      const dividerElement = container.querySelector(".divider");
      expect(dividerElement).toHaveClass("divider--horizontal");
    });

    it("should apply vertical orientation class when orientation is vertical", () => {
      const { container } = render(<CDivider {...mockVerticalDividerProps} />);
      const dividerElement = container.querySelector(".divider");
      expect(dividerElement).toHaveClass("divider--vertical");
    });

    it("should apply base divider class for horizontal orientation", () => {
      const { container } = render(
        <CDivider orientation={ORIENTATION.HORIZONTAL} />
      );
      const dividerElement = container.querySelector(".divider");
      expect(dividerElement).toHaveClass("divider");
    });

    it("should apply base divider class for vertical orientation", () => {
      const { container } = render(
        <CDivider orientation={ORIENTATION.VERTICAL} />
      );
      const dividerElement = container.querySelector(".divider");
      expect(dividerElement).toHaveClass("divider");
    });
  });

  describe("CSS Classes", () => {
    it("should have both base and orientation classes applied together for horizontal", () => {
      const { container } = render(
        <CDivider {...mockHorizontalDividerProps} />
      );
      const dividerElement = container.querySelector(".divider");
      expect(dividerElement).toHaveClass("divider");
      expect(dividerElement).toHaveClass("divider--horizontal");
    });

    it("should have both base and orientation classes applied together for vertical", () => {
      const { container } = render(<CDivider {...mockVerticalDividerProps} />);
      const dividerElement = container.querySelector(".divider");
      expect(dividerElement).toHaveClass("divider");
      expect(dividerElement).toHaveClass("divider--vertical");
    });

    it("should not have incorrect orientation class when horizontal is provided", () => {
      const { container } = render(
        <CDivider {...mockHorizontalDividerProps} />
      );
      const dividerElement = container.querySelector(".divider");
      expect(dividerElement).not.toHaveClass("divider--vertical");
    });

    it("should not have incorrect orientation class when vertical is provided", () => {
      const { container } = render(<CDivider {...mockVerticalDividerProps} />);
      const dividerElement = container.querySelector(".divider");
      expect(dividerElement).not.toHaveClass("divider--horizontal");
    });
  });

  describe("Edge Cases", () => {
    it("should handle re-rendering with different orientation props", () => {
      const { container, rerender } = render(
        <CDivider {...mockHorizontalDividerProps} />
      );
      let dividerElement = container.querySelector(".divider");
      expect(dividerElement).toHaveClass("divider--horizontal");

      rerender(<CDivider {...mockVerticalDividerProps} />);
      dividerElement = container.querySelector(".divider");
      expect(dividerElement).toHaveClass("divider--vertical");
      expect(dividerElement).not.toHaveClass("divider--horizontal");
    });

    it("should render only one span element", () => {
      const { container } = render(
        <CDivider {...mockHorizontalDividerProps} />
      );
      const spanElements = container.querySelectorAll("span");
      expect(spanElements).toHaveLength(1);
    });

    it("should render span with correct base class regardless of orientation", () => {
      const { container: horizontalContainer } = render(
        <CDivider orientation={ORIENTATION.HORIZONTAL} />
      );
      const { container: verticalContainer } = render(
        <CDivider orientation={ORIENTATION.VERTICAL} />
      );

      const horizontalDivider = horizontalContainer.querySelector(".divider");
      const verticalDivider = verticalContainer.querySelector(".divider");

      expect(horizontalDivider).toHaveClass("divider");
      expect(verticalDivider).toHaveClass("divider");
    });
  });

  describe("Component Structure", () => {
    it("should render self-closing span element", () => {
      const { container } = render(
        <CDivider {...mockHorizontalDividerProps} />
      );
      const spanElement = container.querySelector("span");
      expect(spanElement).toBeEmptyDOMElement();
    });

    it("should not render any child elements inside divider", () => {
      const { container } = render(
        <CDivider {...mockHorizontalDividerProps} />
      );
      const dividerElement = container.querySelector(".divider");
      expect(dividerElement?.children).toHaveLength(0);
    });
  });
});
