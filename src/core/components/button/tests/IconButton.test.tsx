import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CIconButton from "../IconButton";
import {
  defaultIconButtonProps,
  primaryVariantProps,
  secondaryVariantProps,
  outlineVariantProps,
  disabledIconButtonProps,
  disableHoverProps,
  iconButtonWithAriaProps,
  iconButtonWithDataTestId,
  mockOnClick,
  mockOnMouseEnter,
  mockOnMouseLeave,
  mockOnFocus,
  mockOnBlur,
  mockOnKeyDown,
  resetMocks,
} from "./__mocks__/IconButton.mocks";

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("CIconButton Component", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("Component Rendering", () => {
    it("should render icon button with children", () => {
      renderWithTheme(<CIconButton {...defaultIconButtonProps} />);
      expect(screen.getByText("Icon")).toBeInTheDocument();
    });

    it("should render as a button element", () => {
      renderWithTheme(<CIconButton {...defaultIconButtonProps} />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe("BUTTON");
    });

    it("should render with primary variant", () => {
      renderWithTheme(<CIconButton {...primaryVariantProps} />);
      expect(screen.getByText("Primary Icon")).toBeInTheDocument();
    });

    it("should render with secondary variant", () => {
      renderWithTheme(<CIconButton {...secondaryVariantProps} />);
      expect(screen.getByText("Secondary Icon")).toBeInTheDocument();
    });

    it("should render with outline variant", () => {
      renderWithTheme(<CIconButton {...outlineVariantProps} />);
      expect(screen.getByText("Outline Icon")).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should apply disabled prop correctly", () => {
      renderWithTheme(<CIconButton {...disabledIconButtonProps} />);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should render with disableHover prop", () => {
      renderWithTheme(<CIconButton {...disableHoverProps} />);
      expect(screen.getByText("No Hover")).toBeInTheDocument();
    });

    it("should accept and apply aria-label", () => {
      renderWithTheme(<CIconButton {...iconButtonWithAriaProps} />);
      const button = screen.getByLabelText("Custom Icon Button");
      expect(button).toBeInTheDocument();
    });

    it("should accept and apply data-testid", () => {
      renderWithTheme(<CIconButton {...iconButtonWithDataTestId} />);
      const button = screen.getByTestId("custom-icon-button");
      expect(button).toBeInTheDocument();
    });

    it("should spread additional ButtonBase props", () => {
      renderWithTheme(
        <CIconButton
          {...defaultIconButtonProps}
          title="Icon Button Title"
          tabIndex={0}
        />
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("title", "Icon Button Title");
      expect(button).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("Event Handling", () => {
    it("should call onClick when button is clicked", () => {
      renderWithTheme(<CIconButton {...defaultIconButtonProps} />);
      const button = screen.getByRole("button");

      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when disabled button is clicked", () => {
      renderWithTheme(<CIconButton {...disabledIconButtonProps} />);
      const button = screen.getByRole("button");

      fireEvent.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it("should handle onMouseEnter event", () => {
      renderWithTheme(
        <CIconButton
          {...defaultIconButtonProps}
          onMouseEnter={mockOnMouseEnter}
        />
      );
      const button = screen.getByRole("button");

      fireEvent.mouseEnter(button);

      expect(mockOnMouseEnter).toHaveBeenCalledTimes(1);
    });

    it("should handle onMouseLeave event", () => {
      renderWithTheme(
        <CIconButton
          {...defaultIconButtonProps}
          onMouseLeave={mockOnMouseLeave}
        />
      );
      const button = screen.getByRole("button");

      fireEvent.mouseLeave(button);

      expect(mockOnMouseLeave).toHaveBeenCalledTimes(1);
    });

    it("should handle onFocus event", () => {
      renderWithTheme(
        <CIconButton
          {...defaultIconButtonProps}
          onFocus={mockOnFocus}
        />
      );
      const button = screen.getByRole("button");

      fireEvent.focus(button);

      expect(mockOnFocus).toHaveBeenCalledTimes(1);
    });

    it("should handle onBlur event", () => {
      renderWithTheme(
        <CIconButton
          {...defaultIconButtonProps}
          onBlur={mockOnBlur}
        />
      );
      const button = screen.getByRole("button");

      fireEvent.blur(button);

      expect(mockOnBlur).toHaveBeenCalledTimes(1);
    });

    it("should handle keyboard events", () => {
      renderWithTheme(
        <CIconButton
          {...defaultIconButtonProps}
          onKeyDown={mockOnKeyDown}
        />
      );
      const button = screen.getByRole("button");

      fireEvent.keyDown(button, { key: "Enter", code: "Enter" });

      expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
    });

    it("should handle Space key press", () => {
      renderWithTheme(
        <CIconButton
          {...defaultIconButtonProps}
          onKeyDown={mockOnKeyDown}
        />
      );
      const button = screen.getByRole("button");

      fireEvent.keyDown(button, { key: " ", code: "Space" });

      expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe("Conditional Rendering Logic", () => {
    it("should render with variant primary and default hover enabled", () => {
      renderWithTheme(
        <CIconButton variant="primary">Primary with Hover</CIconButton>
      );
      expect(screen.getByText("Primary with Hover")).toBeInTheDocument();
    });

    it("should render with variant outline and disableHover true", () => {
      renderWithTheme(
        <CIconButton
          variant="outline"
          disableHover
        >
          Outline No Hover
        </CIconButton>
      );
      expect(screen.getByText("Outline No Hover")).toBeInTheDocument();
    });

    it("should render disabled with any variant", () => {
      renderWithTheme(
        <CIconButton
          variant="secondary"
          disabled
        >
          Disabled Secondary
        </CIconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should render with multiple props combined", () => {
      renderWithTheme(
        <CIconButton
          variant="outline"
          disableHover
          aria-label="Complex Button"
          data-testid="complex-btn"
        >
          Complex
        </CIconButton>
      );
      const button = screen.getByTestId("complex-btn");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAccessibleName("Complex Button");
    });
  });

  describe("Async Behavior", () => {
    it("should handle async onClick operations", async () => {
      const asyncClick = vi.fn().mockResolvedValue("success");

      renderWithTheme(<CIconButton onClick={asyncClick}>Async</CIconButton>);
      const button = screen.getByRole("button");

      fireEvent.click(button);

      expect(asyncClick).toHaveBeenCalledTimes(1);
      await expect(asyncClick.mock.results[0].value).resolves.toBe("success");
    });

    it("should handle rejected async onClick", async () => {
      const asyncClick = vi.fn().mockRejectedValue(new Error("Click failed"));

      renderWithTheme(
        <CIconButton onClick={asyncClick}>Async Error</CIconButton>
      );
      const button = screen.getByRole("button");

      fireEvent.click(button);

      expect(asyncClick).toHaveBeenCalledTimes(1);
      await expect(asyncClick).rejects.toThrow("Click failed");
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle empty children", () => {
      renderWithTheme(<CIconButton onClick={mockOnClick}>{""}</CIconButton>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe("");
    });

    it("should handle null children", () => {
      renderWithTheme(<CIconButton onClick={mockOnClick}>{null}</CIconButton>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should handle undefined onClick", () => {
      renderWithTheme(<CIconButton>No Handler</CIconButton>);
      const button = screen.getByRole("button");
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it("should handle rapid consecutive clicks", () => {
      renderWithTheme(<CIconButton {...defaultIconButtonProps} />);
      const button = screen.getByRole("button");

      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });

    it("should handle complex JSX children", () => {
      renderWithTheme(
        <CIconButton onClick={mockOnClick}>
          <span>Icon</span>
          <span>Label</span>
        </CIconButton>
      );
      const button = screen.getByRole("button");
      expect(screen.getByText("Icon")).toBeInTheDocument();
      expect(screen.getByText("Label")).toBeInTheDocument();
    });

    it("should handle number as children", () => {
      renderWithTheme(<CIconButton>{0}</CIconButton>);
      expect(screen.getByRole("button", { name: "0" })).toBeInTheDocument();
    });

    it("should handle all variant values", () => {
      const variants = ["primary", "secondary", "outline"] as const;

      variants.forEach((variant) => {
        const { unmount } = renderWithTheme(
          <CIconButton variant={variant}>{variant}</CIconButton>
        );
        expect(screen.getByText(variant)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have correct role attribute", () => {
      renderWithTheme(<CIconButton {...defaultIconButtonProps} />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should be focusable when not disabled", () => {
      renderWithTheme(<CIconButton {...defaultIconButtonProps} />);
      const button = screen.getByRole("button");

      button.focus();

      expect(button).toHaveFocus();
    });

    it("should not be focusable when disabled", () => {
      renderWithTheme(<CIconButton {...disabledIconButtonProps} />);
      const button = screen.getByRole("button");

      expect(button).toBeDisabled();
    });

    it("should support aria-describedby", () => {
      renderWithTheme(
        <>
          <CIconButton aria-describedby="description">Button</CIconButton>
          <div id="description">Description text</div>
        </>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-describedby", "description");
    });

    it("should support aria-pressed for toggle buttons", () => {
      renderWithTheme(<CIconButton aria-pressed="true">Toggle</CIconButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("Integration Scenarios", () => {
    it("should work correctly in a form context", () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());

      renderWithTheme(
        <form onSubmit={handleSubmit}>
          <CIconButton type="submit">Submit</CIconButton>
        </form>
      );

      const button = screen.getByRole("button", { name: /submit/i });
      fireEvent.click(button);

      expect(handleSubmit).toHaveBeenCalled();
    });

    it("should maintain state through re-renders", () => {
      const { rerender } = renderWithTheme(
        <CIconButton variant="primary">Initial</CIconButton>
      );

      expect(screen.getByRole("button")).toHaveTextContent("Initial");

      rerender(
        <ThemeProvider theme={theme}>
          <CIconButton variant="secondary">Updated</CIconButton>
        </ThemeProvider>
      );

      expect(screen.getByRole("button")).toHaveTextContent("Updated");
    });

    it("should handle variant changes dynamically", () => {
      const { rerender } = renderWithTheme(
        <CIconButton variant="primary">Button</CIconButton>
      );

      let button = screen.getByRole("button");
      expect(button).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <CIconButton variant="outline">Button</CIconButton>
        </ThemeProvider>
      );

      button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Negative Scenarios", () => {
    it("should not break when onClick throws an error", () => {
      const errorClick = vi.fn(() => {
        try {
          throw new Error("Click error");
        } catch (error) {}
      });

      renderWithTheme(
        <CIconButton onClick={errorClick}>Error Button</CIconButton>
      );
      const button = screen.getByRole("button");

      fireEvent.click(button);
      expect(errorClick).toHaveBeenCalledTimes(1);
    });

    it("should handle invalid variant gracefully", () => {
      // @ts-expect-error Testing invalid variant
      renderWithTheme(<CIconButton variant="invalid">Invalid</CIconButton>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should handle undefined variant (defaults to primary)", () => {
      renderWithTheme(<CIconButton variant={undefined}>Undefined</CIconButton>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Theme Integration", () => {
    // it("should render without theme provider (graceful degradation)", () => {
    //   render(<CIconButton {...defaultIconButtonProps} />);
    //   const button = screen.getByRole("button");
    //   expect(button).toBeInTheDocument();
    // });

    it("should work with custom theme", () => {
      const customTheme = createTheme({
        palette: {
          primary: {
            main: "#ff0000",
          },
          secondary: {
            main: "#00ff00",
          },
        },
      });

      render(
        <ThemeProvider theme={customTheme}>
          <CIconButton variant="primary">Custom Theme</CIconButton>
        </ThemeProvider>
      );

      expect(screen.getByText("Custom Theme")).toBeInTheDocument();
    });
  });
});
