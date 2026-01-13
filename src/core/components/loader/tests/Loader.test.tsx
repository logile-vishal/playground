import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import CLoader from "../Loader";
import {
  mockLoaderDefaultProps,
  mockLoaderCustomProps,
  mockLoaderEmptyText,
  mockLoaderLongText,
} from "./__mocks__/Loader.mocks";

describe("CLoader Component", () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    cleanup();
  });

  describe("Component Rendering", () => {
    it("should render the loader component with default props", () => {
      render(<CLoader />);

      const loaderWrapper = document.querySelector(".loader__wrapper");
      expect(loaderWrapper).toBeInTheDocument();

      const spinner = document.querySelector(".loader__spinner");
      expect(spinner).toBeInTheDocument();
    });

    it("should render with default text when no text prop is provided", () => {
      render(<CLoader />);

      const loaderText = screen.getByText(mockLoaderDefaultProps.text!);
      expect(loaderText).toBeInTheDocument();
    });

    it("should render the circular progress spinner", () => {
      render(<CLoader />);

      const spinner = document.querySelector(".loader__spinner");
      expect(spinner).toBeInTheDocument();
      expect(spinner?.tagName.toLowerCase()).toBe("span");
    });

    it("should render the loader text element", () => {
      render(<CLoader />);

      const textElement = document.querySelector(".loader__text");
      expect(textElement).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should render with custom text prop", () => {
      render(<CLoader text={mockLoaderCustomProps.text} />);

      const loaderText = screen.getByText(mockLoaderCustomProps.text!);
      expect(loaderText).toBeInTheDocument();
    });

    it("should handle empty text prop", () => {
      render(<CLoader text={mockLoaderEmptyText.text} />);

      const textElement = document.querySelector(".loader__text");
      expect(textElement).toBeInTheDocument();
      expect(textElement?.textContent).toBe("");
    });

    it("should handle long text prop", () => {
      render(<CLoader text={mockLoaderLongText.text} />);

      const loaderText = screen.getByText(mockLoaderLongText.text!);
      expect(loaderText).toBeInTheDocument();
      expect(loaderText.textContent).toBe(mockLoaderLongText.text);
    });

    it("should handle undefined text prop and use default", () => {
      render(<CLoader text={undefined} />);

      const loaderText = screen.getByText("Loading...");
      expect(loaderText).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should have correct wrapper class", () => {
      render(<CLoader />);

      const wrapper = document.querySelector(".loader__wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("should have correct spinner class", () => {
      render(<CLoader />);

      const spinner = document.querySelector(".loader__spinner");
      expect(spinner).toBeInTheDocument();
    });

    it("should have correct text class", () => {
      render(<CLoader />);

      const text = document.querySelector(".loader__text");
      expect(text).toBeInTheDocument();
    });

    it("should contain both spinner and text elements", () => {
      render(<CLoader />);

      const spinner = document.querySelector(".loader__spinner");
      const text = document.querySelector(".loader__text");

      expect(spinner).toBeInTheDocument();
      expect(text).toBeInTheDocument();
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle special characters in text prop", () => {
      const specialText = "Loading... <>&\"'";
      render(<CLoader text={specialText} />);

      const loaderText = screen.getByText(specialText);
      expect(loaderText).toBeInTheDocument();
    });

    it("should handle numeric string as text prop", () => {
      const numericText = "123456";
      render(<CLoader text={numericText} />);

      const loaderText = screen.getByText(numericText);
      expect(loaderText).toBeInTheDocument();
    });

    it("should handle text with line breaks", () => {
      const textWithBreaks = "Loading\nPlease wait";
      render(<CLoader text={textWithBreaks} />);

      const textElement = document.querySelector(".loader__text");
      expect(textElement?.textContent).toBe(textWithBreaks);
    });

    it("should handle text with multiple spaces", () => {
      const textWithSpaces = "Loading     data";
      render(<CLoader text={textWithSpaces} />);

      const loaderText = screen.getByText(/Loading/i);
      expect(loaderText).toBeInTheDocument();
    });

    it("should handle very short text", () => {
      const shortText = "L";
      render(<CLoader text={shortText} />);

      const loaderText = screen.getByText(shortText);
      expect(loaderText).toBeInTheDocument();
    });
  });

  describe("Component Re-rendering", () => {
    it("should update text when prop changes", () => {
      const { rerender } = render(<CLoader text="Initial text" />);

      expect(screen.getByText("Initial text")).toBeInTheDocument();

      rerender(<CLoader text="Updated text" />);

      expect(screen.queryByText("Initial text")).not.toBeInTheDocument();
      expect(screen.getByText("Updated text")).toBeInTheDocument();
    });

    it("should maintain spinner when text changes", () => {
      const { rerender } = render(<CLoader text="Text 1" />);

      const spinner1 = document.querySelector(".loader__spinner");
      expect(spinner1).toBeInTheDocument();

      rerender(<CLoader text="Text 2" />);

      const spinner2 = document.querySelector(".loader__spinner");
      expect(spinner2).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should render Box components from MUI", () => {
      render(<CLoader />);

      const boxes = document.querySelectorAll(".MuiBox-root");
      expect(boxes.length).toBeGreaterThan(0);
    });

    it("should have text content visible for screen readers", () => {
      render(<CLoader text="Loading content" />);

      const textElement = screen.getByText("Loading content");
      expect(textElement).toBeVisible();
    });
  });
});
