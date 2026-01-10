import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";

import CNoData from "../NoData";
import type { NoDataProps } from "@/core/types/no-data.type";
import {
  mockNoDataProps,
  mockNoDataPropsWithoutOptionals,
  mockNoDataPropsCustomIcon,
  mockNoDataPropsLargeImage,
  mockNoDataPropsSmallImage,
  mockNoDataPropsOnlyTitle,
  mockNoDataPropsOnlyDescription,
  mockNoDataPropsEmptyStrings,
  mockNoDataPropsLongText,
  MockIconComponent,
  resetMocks,
} from "./__mocks__/NoData.mocks";

describe("CNoData", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("Component Rendering", () => {
    it("should render the component with all props", () => {
      const { container } = render(<CNoData {...mockNoDataProps} />);

      const containerElement = container.querySelector(
        ".no-data__list-container"
      );
      expect(containerElement).toBeInTheDocument();
    });

    it("should render with default props when only imageSrcName is provided", () => {
      render(<CNoData {...mockNoDataPropsWithoutOptionals} />);

      const defaultTitle = screen.getByText("NO_DATA.TITLE");
      expect(defaultTitle).toBeInTheDocument();
      expect(defaultTitle).toHaveClass("no-data__list-container-heading");
    });

    it("should render the icon component", () => {
      const { container } = render(<CNoData {...mockNoDataProps} />);

      const svgIcon = container.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();
    });

    it("should render custom icon component", () => {
      render(<CNoData {...mockNoDataPropsCustomIcon} />);

      const mockIcon = screen.getByTestId("mock-icon");
      expect(mockIcon).toBeInTheDocument();
    });

    it("should render with correct container class", () => {
      const { container } = render(<CNoData {...mockNoDataProps} />);

      const containerElement = container.querySelector(
        ".no-data__list-container"
      );
      expect(containerElement).toBeInTheDocument();
      expect(containerElement?.tagName).toBe("DIV");
    });
  });

  describe("Props Handling - Title", () => {
    it("should render title when provided", () => {
      render(<CNoData {...mockNoDataProps} />);

      const title = screen.getByText("Test Title");
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass("no-data__list-container-heading");
    });

    it("should render default title when title prop is not provided", () => {
      const propsWithoutTitle: NoDataProps = {
        imageSrcName: mockNoDataProps.imageSrcName,
        description: "Some description",
      };

      render(<CNoData {...propsWithoutTitle} />);

      const defaultTitle = screen.getByText("NO_DATA.TITLE");
      expect(defaultTitle).toBeInTheDocument();
    });

    it("should not render title element when title is empty string", () => {
      render(<CNoData {...mockNoDataPropsEmptyStrings} />);

      const titleElements = document.querySelectorAll(
        ".no-data__list-container-heading"
      );
      expect(titleElements).toHaveLength(0);
    });

    it("should render title with correct styling classes", () => {
      render(<CNoData {...mockNoDataPropsOnlyTitle} />);

      const title = screen.getByText("Only Title Here");
      expect(title).toHaveClass("no-data__list-container-heading");
    });

    it("should handle very long title text", () => {
      render(<CNoData {...mockNoDataPropsLongText} />);

      const longTitle = screen.getByText(/This is a very long title/);
      expect(longTitle).toBeInTheDocument();
      expect(longTitle).toHaveClass("no-data__list-container-heading");
    });

    it("should render title as undefined when explicitly passed", () => {
      const propsWithUndefinedTitle: NoDataProps = {
        imageSrcName: mockNoDataProps.imageSrcName,
        title: undefined,
        description: "Some description",
      };

      render(<CNoData {...propsWithUndefinedTitle} />);

      const defaultTitle = screen.getByText("NO_DATA.TITLE");
      expect(defaultTitle).toBeInTheDocument();
    });
  });

  describe("Props Handling - Description", () => {
    it("should render description when provided", () => {
      render(<CNoData {...mockNoDataProps} />);

      const description = screen.getByText("Test Description");
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass("no-data__list-container-body");
    });

    it("should not render description when not provided", () => {
      render(<CNoData {...mockNoDataPropsOnlyTitle} />);

      const descriptions = document.querySelectorAll(
        ".no-data__list-container-body"
      );
      expect(descriptions).toHaveLength(0);
    });

    it("should not render description element when description is empty string", () => {
      render(<CNoData {...mockNoDataPropsEmptyStrings} />);

      const descriptions = document.querySelectorAll(
        ".no-data__list-container-body"
      );
      expect(descriptions).toHaveLength(0);
    });

    it("should render description with correct styling class", () => {
      render(<CNoData {...mockNoDataPropsOnlyDescription} />);

      const description = screen.getByText("Only Description Here");
      expect(description).toHaveClass("no-data__list-container-body");
    });

    it("should handle very long description text", () => {
      render(<CNoData {...mockNoDataPropsLongText} />);

      const longDescription = screen.getByText(
        /This is a very long description/
      );
      expect(longDescription).toBeInTheDocument();
      expect(longDescription).toHaveClass("no-data__list-container-body");
    });

    it("should render without description when undefined", () => {
      const propsWithoutDescription: NoDataProps = {
        imageSrcName: mockNoDataProps.imageSrcName,
        title: "Test Title",
        description: undefined,
      };

      render(<CNoData {...propsWithoutDescription} />);

      const descriptions = document.querySelectorAll(
        ".no-data__list-container-body"
      );
      expect(descriptions).toHaveLength(0);
    });
  });

  describe("Props Handling - ImageWidth", () => {
    it("should render with default imageWidth when not provided", () => {
      const { container } = render(
        <CNoData {...mockNoDataPropsWithoutOptionals} />
      );

      const svgIcon = container.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();
    });

    it("should render with custom imageWidth", () => {
      const { container } = render(<CNoData {...mockNoDataPropsLargeImage} />);

      const svgIcon = container.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();
    });

    it("should handle small imageWidth values", () => {
      const { container } = render(<CNoData {...mockNoDataPropsSmallImage} />);

      const svgIcon = container.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();
    });

    it("should handle zero imageWidth", () => {
      const propsWithZeroWidth: NoDataProps = {
        imageSrcName: mockNoDataProps.imageSrcName,
        imageWidth: 0,
      };

      const { container } = render(<CNoData {...propsWithZeroWidth} />);

      const svgIcon = container.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();
    });

    it("should handle very large imageWidth values", () => {
      const propsWithLargeWidth: NoDataProps = {
        imageSrcName: mockNoDataProps.imageSrcName,
        imageWidth: 1000,
      };

      const { container } = render(<CNoData {...propsWithLargeWidth} />);

      const svgIcon = container.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();
    });
  });

  describe("Props Handling - ImageSrcName", () => {
    it("should render with provided icon component", () => {
      const { container } = render(<CNoData {...mockNoDataProps} />);

      const svgIcon = container.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();
    });

    it("should render custom icon component correctly", () => {
      render(<CNoData imageSrcName={MockIconComponent} />);

      const mockIcon = screen.getByTestId("mock-icon");
      expect(mockIcon).toBeInTheDocument();
    });

    it("should change icon when imageSrcName prop changes", () => {
      const { rerender, container } = render(<CNoData {...mockNoDataProps} />);

      const initialIcon = container.querySelector("svg");
      expect(initialIcon).toBeInTheDocument();

      rerender(<CNoData imageSrcName={MockIconComponent} />);

      const updatedIcon = screen.getByTestId("mock-icon");
      expect(updatedIcon).toBeInTheDocument();
    });
  });

  describe("Conditional Rendering Logic", () => {
    it("should render only icon when title and description are not provided", () => {
      const { container } = render(
        <CNoData {...mockNoDataPropsWithoutOptionals} />
      );

      const svgIcon = container.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();

      const titles = document.querySelectorAll(
        ".no-data__list-container-heading"
      );
      const descriptions = document.querySelectorAll(
        ".no-data__list-container-body"
      );

      expect(titles.length).toBeGreaterThan(0);
      expect(descriptions).toHaveLength(0);
    });

    it("should render icon and title but not description", () => {
      render(<CNoData {...mockNoDataPropsOnlyTitle} />);

      const title = screen.getByText("Only Title Here");
      expect(title).toBeInTheDocument();

      const descriptions = document.querySelectorAll(
        ".no-data__list-container-body"
      );
      expect(descriptions).toHaveLength(0);
    });

    it("should render icon, default title and description", () => {
      render(<CNoData {...mockNoDataPropsOnlyDescription} />);

      const defaultTitle = screen.getByText("NO_DATA.TITLE");
      expect(defaultTitle).toBeInTheDocument();

      const description = screen.getByText("Only Description Here");
      expect(description).toBeInTheDocument();
    });

    it("should render all elements when all props are provided", () => {
      const { container } = render(<CNoData {...mockNoDataProps} />);

      const svgIcon = container.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();

      const title = screen.getByText("Test Title");
      expect(title).toBeInTheDocument();

      const description = screen.getByText("Test Description");
      expect(description).toBeInTheDocument();
    });

    it("should not render title when empty string is provided", () => {
      const propsWithEmptyTitle: NoDataProps = {
        imageSrcName: mockNoDataProps.imageSrcName,
        title: "",
        description: "Description",
      };

      render(<CNoData {...propsWithEmptyTitle} />);

      const titles = document.querySelectorAll(
        ".no-data__list-container-heading"
      );
      expect(titles).toHaveLength(0);

      const description = screen.getByText("Description");
      expect(description).toBeInTheDocument();
    });

    it("should not render description when empty string is provided", () => {
      const propsWithEmptyDescription: NoDataProps = {
        imageSrcName: mockNoDataProps.imageSrcName,
        title: "Title",
        description: "",
      };

      render(<CNoData {...propsWithEmptyDescription} />);

      const title = screen.getByText("Title");
      expect(title).toBeInTheDocument();

      const descriptions = document.querySelectorAll(
        ".no-data__list-container-body"
      );
      expect(descriptions).toHaveLength(0);
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle null values gracefully", () => {
      const propsWithNull = {
        imageSrcName: mockNoDataProps.imageSrcName,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        title: null as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        description: null as any,
      };

      expect(() => {
        render(<CNoData {...propsWithNull} />);
      }).not.toThrow();
    });

    it("should handle special characters in title", () => {
      const propsWithSpecialChars: NoDataProps = {
        imageSrcName: mockNoDataProps.imageSrcName,
        title: "Title with special chars: @#$%^&*()",
      };

      render(<CNoData {...propsWithSpecialChars} />);

      const title = screen.getByText(/Title with special chars/);
      expect(title).toBeInTheDocument();
    });

    it("should handle special characters in description", () => {
      const propsWithSpecialChars: NoDataProps = {
        imageSrcName: mockNoDataProps.imageSrcName,
        description: "Description with <html> & special chars",
      };

      render(<CNoData {...propsWithSpecialChars} />);

      const description = screen.getByText(/Description with/);
      expect(description).toBeInTheDocument();
    });

    it("should handle unicode characters in title", () => {
      const propsWithUnicode: NoDataProps = {
        imageSrcName: mockNoDataProps.imageSrcName,
        title: "Title with emoji 😀 and unicode ñ",
      };

      render(<CNoData {...propsWithUnicode} />);

      const title = screen.getByText(/Title with emoji/);
      expect(title).toBeInTheDocument();
    });

    it("should handle negative imageWidth gracefully", () => {
      const propsWithNegativeWidth: NoDataProps = {
        imageSrcName: mockNoDataProps.imageSrcName,
        imageWidth: -50,
      };

      const { container } = render(<CNoData {...propsWithNegativeWidth} />);

      const svgIcon = container.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();
    });

    it("should handle fractional imageWidth values", () => {
      const propsWithFractionalWidth: NoDataProps = {
        imageSrcName: mockNoDataProps.imageSrcName,
        imageWidth: 50.5,
      };

      const { container } = render(<CNoData {...propsWithFractionalWidth} />);

      const svgIcon = container.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();
    });

    it("should render correctly when props are updated", () => {
      const { rerender } = render(<CNoData {...mockNoDataPropsOnlyTitle} />);

      let title = screen.getByText("Only Title Here");
      expect(title).toBeInTheDocument();

      rerender(<CNoData {...mockNoDataProps} />);

      title = screen.getByText("Test Title");
      expect(title).toBeInTheDocument();

      const description = screen.getByText("Test Description");
      expect(description).toBeInTheDocument();
    });

    it("should handle whitespace-only title", () => {
      const propsWithWhitespace: NoDataProps = {
        imageSrcName: mockNoDataProps.imageSrcName,
        title: "   ",
      };

      const { container } = render(<CNoData {...propsWithWhitespace} />);

      const title = container.querySelector(".no-data__list-container-heading");
      expect(title).toBeInTheDocument();
      expect(title?.textContent?.trim()).toBe("");
    });

    it("should handle whitespace-only description", () => {
      const propsWithWhitespace: NoDataProps = {
        imageSrcName: mockNoDataProps.imageSrcName,
        description: "   ",
      };

      const { container } = render(<CNoData {...propsWithWhitespace} />);

      const description = container.querySelector(
        ".no-data__list-container-body"
      );
      expect(description).toBeInTheDocument();
      expect(description?.textContent?.trim()).toBe("");
    });
  });

  describe("Component Structure", () => {
    it("should have correct DOM structure", () => {
      const { container } = render(<CNoData {...mockNoDataProps} />);

      const containerElement = container.querySelector(
        ".no-data__list-container"
      );
      expect(containerElement).toBeInTheDocument();
      expect(containerElement?.children.length).toBeGreaterThanOrEqual(1);
    });

    it("should render elements in correct order", () => {
      const { container } = render(<CNoData {...mockNoDataProps} />);

      const containerElement = container.querySelector(
        ".no-data__list-container"
      );
      const children = containerElement?.children;

      expect(children?.[0].tagName).toBe("svg");
    });

    it("should apply correct classes to title element", () => {
      render(<CNoData {...mockNoDataProps} />);

      const title = screen.getByText("Test Title");
      const classes = title.className.split(" ");

      expect(classes).toContain("no-data__list-container-heading");
    });

    it("should apply correct class to description element", () => {
      const { container } = render(<CNoData {...mockNoDataProps} />);

      const description = container.querySelector(
        ".no-data__list-container-body"
      );
      expect(description?.className).toContain("no-data__list-container-body");
    });
  });

  describe("Component Rerendering", () => {
    it("should update when title prop changes", () => {
      const { rerender } = render(<CNoData {...mockNoDataProps} />);

      let title = screen.getByText("Test Title");
      expect(title).toBeInTheDocument();

      const updatedProps: NoDataProps = {
        ...mockNoDataProps,
        title: "Updated Title",
      };

      rerender(<CNoData {...updatedProps} />);

      title = screen.getByText("Updated Title");
      expect(title).toBeInTheDocument();
    });

    it("should update when description prop changes", () => {
      const { rerender } = render(<CNoData {...mockNoDataProps} />);

      let description = screen.getByText("Test Description");
      expect(description).toBeInTheDocument();

      const updatedProps: NoDataProps = {
        ...mockNoDataProps,
        description: "Updated Description",
      };

      rerender(<CNoData {...updatedProps} />);

      description = screen.getByText("Updated Description");
      expect(description).toBeInTheDocument();
    });

    it("should update when imageWidth prop changes", () => {
      const { container, rerender } = render(
        <CNoData {...mockNoDataPropsSmallImage} />
      );

      let svgIcon = container.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();

      rerender(<CNoData {...mockNoDataPropsLargeImage} />);

      svgIcon = container.querySelector("svg");
      expect(svgIcon).toBeInTheDocument();
    });

    it("should update when all props change", () => {
      const { rerender } = render(<CNoData {...mockNoDataProps} />);

      let title = screen.getByText("Test Title");
      expect(title).toBeInTheDocument();

      rerender(<CNoData {...mockNoDataPropsCustomIcon} />);

      title = screen.getByText("Custom Icon Title");
      expect(title).toBeInTheDocument();

      const description = screen.getByText("Custom Icon Description");
      expect(description).toBeInTheDocument();

      const mockIcon = screen.getByTestId("mock-icon");
      expect(mockIcon).toBeInTheDocument();
    });
  });
});
