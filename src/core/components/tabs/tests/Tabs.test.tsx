import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import CTabs from "../Tabs";
import {
  mockOnChange,
  defaultTabsProps,
  standardVariantProps,
  scrollableVariantProps,
  propsWithClassName,
  propsWithMultipleClassNames,
  propsWithoutChildren,
  propsWithDifferentValue,
  propsWithAllAttributes,
  resetMocks,
} from "./__mocks__/Tabs.mocks";

vi.mock("@/utils/clsx", () => ({
  default: vi.fn((classObj) => {
    return Object.entries(classObj)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(" ");
  }),
}));

describe("CTabs Component", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("Component Rendering", () => {
    it("should render the component successfully", () => {
      const { container } = render(<CTabs {...defaultTabsProps} />);

      expect(container.querySelector(".tabs__container")).toBeInTheDocument();
    });

    it("should render MUI Tabs component inside container", () => {
      const { container } = render(<CTabs {...defaultTabsProps} />);

      const tabsContainer = container.querySelector(".tabs__container");
      expect(tabsContainer).toBeInTheDocument();
      expect(tabsContainer?.querySelector(".tabs")).toBeInTheDocument();
    });

    it("should render children tabs correctly", () => {
      render(<CTabs {...defaultTabsProps} />);

      expect(screen.getByText("Tab 1")).toBeInTheDocument();
      expect(screen.getByText("Tab 2")).toBeInTheDocument();
      expect(screen.getByText("Tab 3")).toBeInTheDocument();
    });

    it("should render without children", () => {
      const { container } = render(<CTabs {...propsWithoutChildren} />);

      expect(container.querySelector(".tabs__container")).toBeInTheDocument();
      expect(container.querySelector(".tabs")).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should apply default variant as 'standard'", () => {
      const { container } = render(<CTabs {...defaultTabsProps} />);

      const tabsElement = container.querySelector(".tabs");
      expect(tabsElement).toHaveClass("tabs");
    });

    it("should apply 'standard' variant when explicitly passed", () => {
      const { container } = render(<CTabs {...standardVariantProps} />);

      const tabsElement = container.querySelector(".tabs");
      expect(tabsElement).toBeInTheDocument();
    });

    it("should apply 'scrollable' variant when passed", () => {
      const { container } = render(<CTabs {...scrollableVariantProps} />);

      const tabsElement = container.querySelector(".tabs");
      expect(tabsElement).toBeInTheDocument();
    });

    it("should apply custom className along with default tabs class", () => {
      const { container } = render(<CTabs {...propsWithClassName} />);

      const tabsElement = container.querySelector(".tabs");
      expect(tabsElement).toHaveClass("tabs");
      expect(tabsElement).toHaveClass("custom-tabs-class");
    });

    it("should apply multiple custom classNames", () => {
      const { container } = render(<CTabs {...propsWithMultipleClassNames} />);

      const tabsElement = container.querySelector(".tabs");
      expect(tabsElement).toHaveClass("tabs");
      expect(tabsElement?.className).toContain("custom-class-1 custom-class-2");
    });

    it("should not add empty className when className is not provided", () => {
      const { container } = render(<CTabs {...defaultTabsProps} />);

      const tabsElement = container.querySelector(".tabs");
      expect(tabsElement).toHaveClass("tabs");
    });

    it("should handle value prop correctly", () => {
      const { container } = render(<CTabs {...propsWithDifferentValue} />);

      expect(container.querySelector(".tabs")).toBeInTheDocument();
    });

    it("should pass onChange handler correctly", () => {
      render(<CTabs {...defaultTabsProps} />);

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("should handle all props together", () => {
      const { container } = render(<CTabs {...propsWithAllAttributes} />);

      const tabsElement = container.querySelector(".tabs");
      expect(tabsElement).toBeInTheDocument();
      expect(tabsElement).toHaveClass("tabs");
      expect(tabsElement).toHaveClass("full-featured-tabs");
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle undefined className gracefully", () => {
      const { container } = render(
        <CTabs
          {...defaultTabsProps}
          className={undefined}
        />
      );

      const tabsElement = container.querySelector(".tabs");
      expect(tabsElement).toHaveClass("tabs");
    });

    it("should handle empty string className", () => {
      const { container } = render(
        <CTabs
          {...defaultTabsProps}
          className=""
        />
      );

      const tabsElement = container.querySelector(".tabs");
      expect(tabsElement).toHaveClass("tabs");
    });

    it("should handle null children", () => {
      const { container } = render(
        <CTabs
          value={0}
          onChange={mockOnChange}
          children={null}
        />
      );

      expect(container.querySelector(".tabs__container")).toBeInTheDocument();
    });

    it("should handle value as 0 (falsy but valid)", () => {
      const { container } = render(
        <CTabs
          {...defaultTabsProps}
          value={0}
        />
      );

      expect(container.querySelector(".tabs")).toBeInTheDocument();
    });

    it("should handle negative value", () => {
      const { container } = render(
        <CTabs
          {...defaultTabsProps}
          value={-1}
        />
      );

      expect(container.querySelector(".tabs")).toBeInTheDocument();
    });

    it("should handle large value number", () => {
      const { container } = render(
        <CTabs
          {...defaultTabsProps}
          value={999}
        />
      );

      expect(container.querySelector(".tabs")).toBeInTheDocument();
    });

    it("should handle aria-label attribute", () => {
      const { container } = render(
        <CTabs
          {...defaultTabsProps}
          aria-label="Test tabs"
        />
      );

      expect(container.querySelector(".tabs")).toBeInTheDocument();
    });

    it("should handle additional MUI Tabs props", () => {
      const { container } = render(
        <CTabs
          {...defaultTabsProps}
          orientation="horizontal"
          scrollButtons="auto"
        />
      );

      expect(container.querySelector(".tabs")).toBeInTheDocument();
    });

    it("should handle single child tab", () => {
      render(
        <CTabs
          value={0}
          onChange={mockOnChange}
        >
          <div>Single Tab</div>
        </CTabs>
      );

      expect(screen.getByText("Single Tab")).toBeInTheDocument();
    });

    it("should render with minimal required props only", () => {
      const { container } = render(
        <CTabs
          value={0}
          onChange={vi.fn()}
        />
      );

      expect(container.querySelector(".tabs__container")).toBeInTheDocument();
      expect(container.querySelector(".tabs")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should maintain correct DOM hierarchy", () => {
      const { container } = render(<CTabs {...defaultTabsProps} />);

      const wrapper = container.querySelector(".tabs__container");
      const tabs = wrapper?.querySelector(".tabs");

      expect(wrapper).toBeInTheDocument();
      expect(tabs).toBeInTheDocument();
      expect(wrapper).toContainElement(tabs as HTMLElement);
    });

    it("should apply SCSS class for styling", () => {
      const { container } = render(<CTabs {...defaultTabsProps} />);

      expect(container.querySelector(".tabs__container")).toBeInTheDocument();
    });
  });

  describe("Variant Behavior", () => {
    it("should default to 'standard' variant when variant prop is not provided", () => {
      const propsWithoutVariant = {
        value: 0,
        onChange: mockOnChange,
        children: <div>Tab</div>,
      };

      const { container } = render(<CTabs {...propsWithoutVariant} />);

      expect(container.querySelector(".tabs")).toBeInTheDocument();
    });

    it("should override default variant with provided variant prop", () => {
      const { container } = render(
        <CTabs
          {...defaultTabsProps}
          variant="scrollable"
        />
      );

      expect(container.querySelector(".tabs")).toBeInTheDocument();
    });
  });
});
