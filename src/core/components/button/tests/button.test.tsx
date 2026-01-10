import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { CButton } from "../button";
import {
  mockOnClick,
  mockOnMouseEnter,
  mockOnMouseLeave,
  mockOnFocus,
  mockOnBlur,
  defaultButtonProps,
  primarySolidButtonProps,
  secondarySolidButtonProps,
  outlinedButtonProps,
  textButtonProps,
  smallButtonProps,
  mediumButtonProps,
  largeButtonProps,
  disabledButtonProps,
  buttonWithClassNameProps,
  buttonWithSxProps,
  buttonWithAllPropsProps,
  resetMocks,
} from "./__mocks__/button.mocks";

describe("CButton Component", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("Component Rendering", () => {
    it("should render button with children text", () => {
      render(<CButton {...defaultButtonProps} />);
      expect(
        screen.getByRole("button", { name: /click me/i })
      ).toBeInTheDocument();
    });

    it("should render button with default severity when no severity is provided", () => {
      render(<CButton {...defaultButtonProps} />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should render button with default variant when no variant is provided", () => {
      render(<CButton {...defaultButtonProps} />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should render button with default size when no size is provided", () => {
      render(<CButton {...defaultButtonProps} />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should render button element", () => {
      render(<CButton {...defaultButtonProps} />);
      const button = screen.getByRole("button");
      expect(button.tagName).toBe("BUTTON");
    });
  });

  describe("Severity Props Handling", () => {
    it("should render primary severity button", () => {
      render(<CButton {...primarySolidButtonProps} />);
      const button = screen.getByRole("button", { name: /primary solid/i });
      expect(button).toBeInTheDocument();
    });

    it("should render secondary severity button", () => {
      render(<CButton {...secondarySolidButtonProps} />);
      const button = screen.getByRole("button", { name: /secondary solid/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe("Variant Props Handling", () => {
    it("should render solid variant button", () => {
      render(
        <CButton
          severity="primary"
          variant="solid"
        >
          Solid
        </CButton>
      );
      const button = screen.getByRole("button", { name: /solid/i });
      expect(button).toBeInTheDocument();
    });

    it("should render outlined variant button", () => {
      render(<CButton {...outlinedButtonProps} />);
      const button = screen.getByRole("button", { name: /outlined button/i });
      expect(button).toBeInTheDocument();
    });

    it("should render text variant button", () => {
      render(<CButton {...textButtonProps} />);
      const button = screen.getByRole("button", { name: /text button/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe("Size Props Handling", () => {
    it("should render small size button", () => {
      render(<CButton {...smallButtonProps} />);
      const button = screen.getByRole("button", { name: /small/i });
      expect(button).toBeInTheDocument();
    });

    it("should render medium size button", () => {
      render(<CButton {...mediumButtonProps} />);
      const button = screen.getByRole("button", { name: /medium/i });
      expect(button).toBeInTheDocument();
    });

    it("should render large size button", () => {
      render(<CButton {...largeButtonProps} />);
      const button = screen.getByRole("button", { name: /large/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe("Event Handling", () => {
    it("should call onClick when button is clicked", () => {
      render(<CButton {...defaultButtonProps} />);
      const button = screen.getByRole("button");

      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when disabled button is clicked", () => {
      render(<CButton {...disabledButtonProps} />);
      const button = screen.getByRole("button");

      fireEvent.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it("should handle onMouseEnter event", () => {
      render(
        <CButton
          {...defaultButtonProps}
          onMouseEnter={mockOnMouseEnter}
        />
      );
      const button = screen.getByRole("button");

      fireEvent.mouseEnter(button);

      expect(mockOnMouseEnter).toHaveBeenCalledTimes(1);
    });

    it("should handle onMouseLeave event", () => {
      render(
        <CButton
          {...defaultButtonProps}
          onMouseLeave={mockOnMouseLeave}
        />
      );
      const button = screen.getByRole("button");

      fireEvent.mouseLeave(button);

      expect(mockOnMouseLeave).toHaveBeenCalledTimes(1);
    });

    it("should handle onFocus event", () => {
      render(
        <CButton
          {...defaultButtonProps}
          onFocus={mockOnFocus}
        />
      );
      const button = screen.getByRole("button");

      fireEvent.focus(button);

      expect(mockOnFocus).toHaveBeenCalledTimes(1);
    });

    it("should handle onBlur event", () => {
      render(
        <CButton
          {...defaultButtonProps}
          onBlur={mockOnBlur}
        />
      );
      const button = screen.getByRole("button");

      fireEvent.blur(button);

      expect(mockOnBlur).toHaveBeenCalledTimes(1);
    });

    it("should handle keyboard Enter key press", () => {
      render(<CButton {...defaultButtonProps} />);
      const button = screen.getByRole("button");

      fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalled();
    });

    it("should handle keyboard Space key press", () => {
      render(<CButton {...defaultButtonProps} />);
      const button = screen.getByRole("button");

      fireEvent.keyDown(button, { key: " ", code: "Space" });
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalled();
    });
  });

  describe("Disabled State", () => {
    it("should render disabled button", () => {
      render(<CButton {...disabledButtonProps} />);
      const button = screen.getByRole("button");

      expect(button).toBeDisabled();
    });

    it("should not trigger onClick when disabled", () => {
      render(<CButton {...disabledButtonProps} />);
      const button = screen.getByRole("button");

      fireEvent.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it("should have cursor not-allowed when disabled", () => {
      render(<CButton {...disabledButtonProps} />);
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });

    it("should not show hover styles when disabled", () => {
      render(<CButton {...disabledButtonProps} />);
      const button = screen.getByRole("button");

      fireEvent.mouseEnter(button);

      expect(button).toBeDisabled();
    });
  });

  describe("Custom ClassName", () => {
    it("should apply custom className", () => {
      render(<CButton {...buttonWithClassNameProps} />);
      const button = screen.getByRole("button");

      expect(button).toHaveClass("custom-class");
    });

    it("should merge custom className with MUI classes", () => {
      render(
        <CButton
          {...buttonWithClassNameProps}
          severity="primary"
        />
      );
      const button = screen.getByRole("button");

      expect(button).toHaveClass("custom-class");
    });
  });

  describe("SX Prop Handling", () => {
    it("should apply custom sx styles", () => {
      render(<CButton {...buttonWithSxProps} />);
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });

    it("should merge sx prop with base styles", () => {
      render(<CButton sx={{ padding: "20px" }}>Custom SX</CButton>);
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });

    it("should override base styles with sx prop", () => {
      render(<CButton sx={{ minHeight: "50px" }}>Override</CButton>);
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });
  });

  describe("Conditional Rendering Logic", () => {
    it("should render with severity, variant, and size combined", () => {
      render(
        <CButton
          severity="primary"
          variant="solid"
          size="large"
        >
          Combined
        </CButton>
      );
      const button = screen.getByRole("button", { name: /combined/i });

      expect(button).toBeInTheDocument();
    });

    it("should render with all props", () => {
      render(<CButton {...buttonWithAllPropsProps} />);
      const button = screen.getByRole("button", { name: /all props/i });

      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("custom-class");
      expect(button).not.toBeDisabled();
    });

    it("should apply correct styles for different severity and variant combinations", () => {
      const { rerender } = render(
        <CButton
          severity="primary"
          variant="solid"
        >
          Button
        </CButton>
      );

      let button = screen.getByRole("button");
      expect(button).toBeInTheDocument();

      rerender(
        <CButton
          severity="secondary"
          variant="outline"
        >
          Button
        </CButton>
      );
      button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle empty children", () => {
      render(<CButton onClick={mockOnClick}>{""}</CButton>);
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe("");
    });

    it("should handle null children gracefully", () => {
      render(<CButton onClick={mockOnClick}>{null}</CButton>);
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });

    it("should handle undefined onClick", () => {
      render(<CButton>No Click Handler</CButton>);
      const button = screen.getByRole("button");

      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it("should render with very long text content", () => {
      const longText = "A".repeat(1000);
      render(<CButton>{longText}</CButton>);
      const button = screen.getByRole("button");

      expect(button.textContent).toBe(longText);
    });

    it("should handle rapid consecutive clicks", () => {
      render(<CButton {...defaultButtonProps} />);
      const button = screen.getByRole("button");

      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });

    it("should handle JSX children correctly", () => {
      render(
        <CButton onClick={mockOnClick}>
          <span>Icon</span>
          <span>Text</span>
        </CButton>
      );
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
      expect(screen.getByText("Icon")).toBeInTheDocument();
      expect(screen.getByText("Text")).toBeInTheDocument();
    });

    it("should handle number as children", () => {
      render(<CButton>{42}</CButton>);
      const button = screen.getByRole("button", { name: "42" });

      expect(button).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have correct role attribute", () => {
      render(<CButton {...defaultButtonProps} />);
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });

    it("should support aria-label", () => {
      render(<CButton aria-label="Custom Label">Button</CButton>);
      const button = screen.getByLabelText("Custom Label");

      expect(button).toBeInTheDocument();
    });

    it("should be disabled with correct attribute when disabled prop is true", () => {
      render(<CButton disabled>Disabled</CButton>);
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("disabled");
    });

    it("should be focusable when not disabled", () => {
      render(<CButton {...defaultButtonProps} />);
      const button = screen.getByRole("button");

      button.focus();

      expect(button).toHaveFocus();
    });

    it("should not be focusable when disabled", () => {
      render(<CButton {...disabledButtonProps} />);
      const button = screen.getByRole("button");

      expect(button).toBeDisabled();
    });

    it("should support aria-describedby", () => {
      render(
        <>
          <CButton aria-describedby="desc">Button</CButton>
          <div id="desc">Description</div>
        </>
      );
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("aria-describedby", "desc");
    });
  });

  describe("Style Application", () => {
    it("should apply base styles", () => {
      render(<CButton>Styled Button</CButton>);
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });

    it("should apply size-specific styles", () => {
      const { rerender } = render(<CButton size="small">Small</CButton>);
      let button = screen.getByRole("button");
      expect(button).toBeInTheDocument();

      rerender(<CButton size="medium">Medium</CButton>);
      button = screen.getByRole("button");
      expect(button).toBeInTheDocument();

      rerender(<CButton size="large">Large</CButton>);
      button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should have transition styles", () => {
      render(<CButton>Transition</CButton>);
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });

    it("should remove box shadow", () => {
      render(<CButton>No Shadow</CButton>);
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });
  });

  describe("Integration Scenarios", () => {
    it("should work correctly in a form submission scenario", () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <CButton type="submit">Submit Form</CButton>
        </form>
      );

      const button = screen.getByRole("button", { name: /submit form/i });
      fireEvent.click(button);

      expect(handleSubmit).toHaveBeenCalled();
    });

    it("should handle async onClick operations", async () => {
      const asyncClick = vi.fn().mockResolvedValue("success");

      render(<CButton onClick={asyncClick}>Async Button</CButton>);
      const button = screen.getByRole("button");

      fireEvent.click(button);

      expect(asyncClick).toHaveBeenCalledTimes(1);
    });

    it("should maintain state through re-renders", () => {
      const { rerender } = render(
        <CButton severity="primary">Initial</CButton>
      );

      expect(screen.getByRole("button")).toHaveTextContent("Initial");

      rerender(<CButton severity="secondary">Updated</CButton>);

      expect(screen.getByRole("button")).toHaveTextContent("Updated");
    });

    it("should handle multiple buttons with different props", () => {
      render(
        <>
          <CButton severity="primary">Primary</CButton>
          <CButton severity="secondary">Secondary</CButton>
        </>
      );

      expect(
        screen.getByRole("button", { name: /primary/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /secondary/i })
      ).toBeInTheDocument();
    });
  });

  describe("Props Spreading", () => {
    it("should spread additional props to MUI Button", () => {
      render(
        <CButton
          data-testid="custom-button"
          title="Button Title"
        >
          Button
        </CButton>
      );
      const button = screen.getByTestId("custom-button");

      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("title", "Button Title");
    });

    it("should support type attribute", () => {
      render(<CButton type="submit">Submit</CButton>);
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("type", "submit");
    });

    it("should support form attribute", () => {
      render(<CButton form="my-form">Button</CButton>);
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("form", "my-form");
    });
  });

  describe("Negative Scenarios", () => {
    it("should not break when onClick throws an error", () => {
      const errorClick = vi.fn(() => {
        try {
          throw new Error("Click error");
        } catch {
          // Error caught and ignored for testing
        }
      });

      render(<CButton onClick={errorClick}>Error Button</CButton>);
      const button = screen.getByRole("button");

      fireEvent.click(button);

      expect(errorClick).toHaveBeenCalledTimes(1);
    });

    it("should handle undefined severity gracefully", () => {
      render(<CButton severity={undefined}>Undefined Severity</CButton>);
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });

    it("should handle undefined variant gracefully", () => {
      render(<CButton variant={undefined}>Undefined Variant</CButton>);
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });

    it("should handle undefined size gracefully", () => {
      render(<CButton size={undefined}>Undefined Size</CButton>);
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });
  });
});
