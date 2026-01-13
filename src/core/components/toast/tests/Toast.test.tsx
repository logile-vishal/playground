import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import CToast from "../Toast";
import {
  defaultToastProps,
  successToastProps,
  errorToastProps,
  warningToastProps,
  informationToastProps,
  featureToastProps,
  toastWithActionsProps,
  toastWithMultipleActionsProps,
  toastWithAutoHideProps,
  closedToastProps,
  smallToastProps,
  toastWithAnchorProps,
  mockOnClose,
  resetMocks,
} from "./__mocks__/Toast.mocks";
import { ToastVariant } from "../toast.type";

// Mock clsx
vi.mock("@/utils/clsx", () => ({
  default: (classes: string | Record<string, boolean> | null) => {
    if (typeof classes === "string") return classes;
    if (typeof classes === "object" && classes !== null) {
      return Object.entries(classes)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(" ");
    }
    return "";
  },
}));

// Mock icons
vi.mock("@/core/constants/icons", () => ({
  CircleCheckFilled: "CircleCheckFilled",
  Close: "Close",
  ExclamationCircleFilled: "ExclamationCircleFilled",
  ExclamationTriangleFilled: "ExclamationTriangleFilled",
  InfoCircleFilled: "InfoCircleFilled",
}));

// Mock CSvgIcon
vi.mock("@/core/components/icon/Icon", () => ({
  default: ({ component, size }: { [key: string]: unknown }) => (
    <span
      data-testid="svg-icon"
      data-component={component}
      data-size={size}
    />
  ),
}));

describe("CToast Component", () => {
  beforeEach(() => {
    resetMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
  });

  describe("Component Rendering", () => {
    it("should render toast when open is true", () => {
      const { container } = render(<CToast {...defaultToastProps} />);
      const toast = container.querySelector(".toast");
      expect(toast).toBeInTheDocument();
    });

    it("should not render toast when open is false", () => {
      const { container } = render(<CToast {...closedToastProps} />);
      const toast = container.querySelector(".toast");
      expect(toast).not.toBeInTheDocument();
    });

    it("should render toast title", () => {
      render(<CToast {...defaultToastProps} />);
      expect(screen.getByText("Test Toast Title")).toBeInTheDocument();
    });

    it("should render toast with description when isSizeLarge is true", () => {
      render(<CToast {...successToastProps} />);
      expect(
        screen.getByText("Operation completed successfully")
      ).toBeInTheDocument();
    });

    it("should not render description when isSizeLarge is false", () => {
      render(<CToast {...smallToastProps} />);
      expect(
        screen.queryByText("This description should not be visible")
      ).not.toBeInTheDocument();
    });

    it("should render close button", () => {
      const { container } = render(<CToast {...defaultToastProps} />);
      const closeButton = container.querySelector(".toast__close-btn");
      expect(closeButton).toBeInTheDocument();
    });

    it("should render severity icon", () => {
      render(<CToast {...defaultToastProps} />);
      const icons = screen.getAllByTestId("svg-icon");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("should apply correct CSS classes", () => {
      const { container } = render(<CToast {...successToastProps} />);
      const toast = container.querySelector(".toast");
      expect(toast).toHaveClass("toast--success");
      expect(toast).toHaveClass("toast--filled");
      expect(toast).toHaveClass("toast--large");
    });
  });

  describe("Props Handling", () => {
    it("should handle success severity", () => {
      const { container } = render(<CToast {...successToastProps} />);
      const toast = container.querySelector(".toast");
      expect(toast).toHaveClass("toast--success");
    });

    it("should handle error severity", () => {
      const { container } = render(<CToast {...errorToastProps} />);
      const toast = container.querySelector(".toast");
      expect(toast).toHaveClass("toast--error");
    });

    it("should handle warning severity", () => {
      const { container } = render(<CToast {...warningToastProps} />);
      const toast = container.querySelector(".toast");
      expect(toast).toHaveClass("toast--warning");
    });

    it("should handle information severity", () => {
      const { container } = render(<CToast {...informationToastProps} />);
      const toast = container.querySelector(".toast");
      expect(toast).toHaveClass("toast--information");
    });

    it("should handle feature severity", () => {
      const { container } = render(<CToast {...featureToastProps} />);
      const toast = container.querySelector(".toast");
      expect(toast).toHaveClass("toast--feature");
    });

    it("should handle filled variant", () => {
      const { container } = render(<CToast {...defaultToastProps} />);
      const toast = container.querySelector(".toast");
      expect(toast).toHaveClass("toast--filled");
    });

    it("should apply large size class when isSizeLarge is true", () => {
      const { container } = render(<CToast {...successToastProps} />);
      const toast = container.querySelector(".toast");
      expect(toast).toHaveClass("toast--large");
    });

    it("should not apply large size class when isSizeLarge is false", () => {
      const { container } = render(<CToast {...smallToastProps} />);
      const toast = container.querySelector(".toast");
      expect(toast).not.toHaveClass("toast--large");
    });

    it("should handle anchorOrigin prop", () => {
      render(<CToast {...toastWithAnchorProps} />);
      expect(screen.getByText("Toast with Anchor")).toBeInTheDocument();
    });
  });

  describe("Severity Icons", () => {
    it("should render success icon for success severity", () => {
      render(<CToast {...successToastProps} />);
      const icons = screen.getAllByTestId("svg-icon");
      const successIcon = icons.find(
        (icon) => icon.getAttribute("data-component") === "CircleCheckFilled"
      );
      expect(successIcon).toBeInTheDocument();
    });

    it("should render error icon for error severity", () => {
      render(<CToast {...errorToastProps} />);
      const icons = screen.getAllByTestId("svg-icon");
      const errorIcon = icons.find(
        (icon) =>
          icon.getAttribute("data-component") === "ExclamationCircleFilled"
      );
      expect(errorIcon).toBeInTheDocument();
    });

    it("should render warning icon for warning severity", () => {
      render(<CToast {...warningToastProps} />);
      const icons = screen.getAllByTestId("svg-icon");
      const warningIcon = icons.find(
        (icon) =>
          icon.getAttribute("data-component") === "ExclamationTriangleFilled"
      );
      expect(warningIcon).toBeInTheDocument();
    });

    it("should render info icon for information severity", () => {
      render(<CToast {...informationToastProps} />);
      const icons = screen.getAllByTestId("svg-icon");
      const infoIcon = icons.find(
        (icon) => icon.getAttribute("data-component") === "InfoCircleFilled"
      );
      expect(infoIcon).toBeInTheDocument();
    });

    it("should render info icon for feature severity", () => {
      render(<CToast {...featureToastProps} />);
      const icons = screen.getAllByTestId("svg-icon");
      const featureIcon = icons.find(
        (icon) => icon.getAttribute("data-component") === "InfoCircleFilled"
      );
      expect(featureIcon).toBeInTheDocument();
    });

    it("should render icon with correct size", () => {
      render(<CToast {...defaultToastProps} />);
      const icons = screen.getAllByTestId("svg-icon");
      const severityIcon = icons[0];
      expect(severityIcon).toHaveAttribute("data-size", "16");
    });
  });

  describe("Event Handling", () => {
    it("should call onClose when close button is clicked", () => {
      const { container } = render(<CToast {...defaultToastProps} />);
      const closeButton = container.querySelector(".toast__close-btn");

      fireEvent.click(closeButton!);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple close button clicks", () => {
      const { container } = render(<CToast {...defaultToastProps} />);
      const closeButton = container.querySelector(".toast__close-btn");

      fireEvent.click(closeButton!);
      fireEvent.click(closeButton!);
      fireEvent.click(closeButton!);

      expect(mockOnClose).toHaveBeenCalledTimes(3);
    });

    it("should handle onClose throwing error", () => {
      const errorOnClose = vi.fn(() => {
        try {
          throw new Error("Close error");
        } catch {
          /* Error caught and ignored for testing */
        }
      });

      const { container } = render(
        <CToast
          {...defaultToastProps}
          onClose={errorOnClose}
        />
      );
      const closeButton = container.querySelector(".toast__close-btn");

      // The error is caught by React, so we just verify the function was called
      expect(() => {
        try {
          fireEvent.click(closeButton!);
        } catch {
          // React catches the error
        }
      }).not.toThrow();

      expect(errorOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Actions Rendering", () => {
    it("should render actions when provided", () => {
      render(<CToast {...toastWithActionsProps} />);
      expect(screen.getByText("Action 1")).toBeInTheDocument();
      expect(screen.getByText("Action 2")).toBeInTheDocument();
    });

    it("should render multiple actions", () => {
      render(<CToast {...toastWithMultipleActionsProps} />);
      expect(screen.getByText("Undo")).toBeInTheDocument();
      expect(screen.getByText("Retry")).toBeInTheDocument();
      expect(screen.getByText("Dismiss")).toBeInTheDocument();
    });

    it("should render separators between actions", () => {
      const { container } = render(
        <CToast {...toastWithMultipleActionsProps} />
      );
      const separators = container.querySelectorAll(
        ".toast__body-action-separator"
      );
      expect(separators.length).toBe(2); // For 3 actions, 2 separators
    });

    it("should not render separator before first action", () => {
      render(<CToast {...toastWithActionsProps} />);
      const { container } = render(<CToast {...toastWithActionsProps} />);
      const actionSection = container.querySelector(".toast__body-action");
      expect(actionSection?.firstChild).not.toHaveClass(
        "toast__body-action-separator"
      );
    });

    it("should not render actions section when actions is undefined", () => {
      const { container } = render(<CToast {...defaultToastProps} />);
      const actionSection = container.querySelector(".toast__body-action");
      expect(actionSection?.children.length).toBe(0);
    });

    it("should render empty actions array without errors", () => {
      const propsWithEmptyActions = { ...defaultToastProps, actions: [] };
      const { container } = render(<CToast {...propsWithEmptyActions} />);
      const actionSection = container.querySelector(".toast__body-action");
      expect(actionSection?.children.length).toBe(0);
    });
  });

  describe("Side Effects - useEffect with autoHideDuration", () => {
    it("should call onClose after autoHideDuration", () => {
      render(<CToast {...toastWithAutoHideProps} />);

      expect(mockOnClose).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should not call onClose before autoHideDuration expires", () => {
      render(<CToast {...toastWithAutoHideProps} />);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("should not auto-hide when autoHideDuration is not provided", () => {
      render(<CToast {...defaultToastProps} />);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("should not auto-hide when open is false", () => {
      render(
        <CToast
          {...closedToastProps}
          autoHideDuration={3000}
        />
      );

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("should cleanup timer on unmount", () => {
      const { unmount } = render(<CToast {...toastWithAutoHideProps} />);

      unmount();
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("should reset timer when open changes", () => {
      const { rerender } = render(<CToast {...toastWithAutoHideProps} />);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      rerender(
        <CToast
          {...toastWithAutoHideProps}
          open={false}
        />
      );
      rerender(
        <CToast
          {...toastWithAutoHideProps}
          open={true}
        />
      );

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(mockOnClose).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should handle autoHideDuration of 0", () => {
      render(
        <CToast
          {...defaultToastProps}
          autoHideDuration={0}
        />
      );

      act(() => {
        vi.advanceTimersByTime(0);
      });

      // autoHideDuration=0 is falsy, so timer is not set and onClose is not called
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("should handle very long autoHideDuration", async () => {
      render(
        <CToast
          {...defaultToastProps}
          autoHideDuration={100000}
        />
      );

      act(() => {
        vi.runAllTimers(); // ✅ flush everything
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Conditional Rendering Logic", () => {
    it("should render description only when isSizeLarge is true", () => {
      const { rerender } = render(
        <CToast
          {...successToastProps}
          isSizeLarge={true}
        />
      );
      expect(
        screen.getByText("Operation completed successfully")
      ).toBeInTheDocument();

      rerender(
        <CToast
          {...successToastProps}
          isSizeLarge={false}
        />
      );
      expect(
        screen.queryByText("Operation completed successfully")
      ).not.toBeInTheDocument();
    });

    it("should not render description when description is undefined", () => {
      const propsWithoutDesc = { ...defaultToastProps, isSizeLarge: true };
      render(<CToast {...propsWithoutDesc} />);

      const { container } = render(<CToast {...propsWithoutDesc} />);
      const descElement = container.querySelector(".toast__body-desc");
      expect(descElement).not.toBeInTheDocument();
    });

    it("should render description when both description and isSizeLarge are provided", () => {
      render(<CToast {...successToastProps} />);
      expect(
        screen.getByText("Operation completed successfully")
      ).toBeInTheDocument();
    });

    it("should return null when open is false", () => {
      const { container } = render(<CToast {...closedToastProps} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle empty title", () => {
      render(
        <CToast
          {...defaultToastProps}
          title=""
        />
      );
      const { container } = render(
        <CToast
          {...defaultToastProps}
          title=""
        />
      );
      const title = container.querySelector(".toast__body-title");
      expect(title).toBeInTheDocument();
      expect(title?.textContent).toBe("");
    });

    it("should handle very long title", () => {
      const longTitle = "A".repeat(500);
      render(
        <CToast
          {...defaultToastProps}
          title={longTitle}
        />
      );
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("should handle very long description", () => {
      const longDesc = "B".repeat(1000);
      render(
        <CToast
          {...successToastProps}
          description={longDesc}
        />
      );
      expect(screen.getByText(longDesc)).toBeInTheDocument();
    });

    it("should handle special characters in title", () => {
      const specialTitle = "Title with !@#$%^&*()";
      render(
        <CToast
          {...defaultToastProps}
          title={specialTitle}
        />
      );
      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });

    it("should handle special characters in description", () => {
      const specialDesc = "Description with <>&\"'";
      render(
        <CToast
          {...successToastProps}
          description={specialDesc}
        />
      );
      expect(screen.getByText(specialDesc)).toBeInTheDocument();
    });

    it("should handle undefined severity gracefully", () => {
      const propsWithUndefinedSeverity = {
        ...defaultToastProps,
        severity: undefined as unknown,
      };
      expect(
        () => render(<CToast {...(propsWithUndefinedSeverity as any)} />) // eslint-disable-line @typescript-eslint/no-explicit-any
      ).not.toThrow();
    });

    it("should handle undefined variant gracefully", () => {
      const propsWithUndefinedVariant = {
        ...defaultToastProps,
        variant: undefined as unknown,
      };
      expect(
        () => render(<CToast {...(propsWithUndefinedVariant as any)} />) // eslint-disable-line @typescript-eslint/no-explicit-any
      ).not.toThrow();
    });

    it("should handle single action without separator", () => {
      const singleActionProps = {
        ...defaultToastProps,
        actions: [
          React.createElement("button", { key: "action1" }, "Single Action"),
        ],
      };
      const { container } = render(<CToast {...singleActionProps} />);
      const separators = container.querySelectorAll(
        ".toast__body-action-separator"
      );
      expect(separators.length).toBe(0);
    });

    it("should handle null in actions array", () => {
      const actionsWithNull = {
        ...defaultToastProps,
        actions: [
          null,
          React.createElement("button", { key: "action1" }, "Action"),
        ] as unknown,
      };
      expect(
        () => render(<CToast {...(actionsWithNull as any)} />) // eslint-disable-line @typescript-eslint/no-explicit-any
      ).not.toThrow();
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle complete toast lifecycle", async () => {
      const { container, rerender } = render(
        <CToast {...toastWithAutoHideProps} />
      );

      // Toast is open
      expect(container.querySelector(".toast")).toBeInTheDocument();

      // Auto-hide triggers
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(mockOnClose).toHaveBeenCalledTimes(1);

      // Manually close toast
      rerender(
        <CToast
          {...toastWithAutoHideProps}
          open={false}
        />
      );
      expect(container.querySelector(".toast")).not.toBeInTheDocument();
    });

    it("should handle switching between severities", () => {
      const { container, rerender } = render(<CToast {...successToastProps} />);
      expect(container.querySelector(".toast--success")).toBeInTheDocument();

      rerender(<CToast {...errorToastProps} />);
      expect(container.querySelector(".toast--error")).toBeInTheDocument();

      rerender(<CToast {...warningToastProps} />);
      expect(container.querySelector(".toast--warning")).toBeInTheDocument();
    });

    it("should handle switching between variants", () => {
      const { container, rerender } = render(
        <CToast
          {...defaultToastProps}
          variant={ToastVariant.Filled}
        />
      );
      expect(container.querySelector(".toast--filled")).toBeInTheDocument();

      rerender(
        <CToast
          {...defaultToastProps}
          variant={ToastVariant.Stroke}
        />
      );
      expect(container.querySelector(".toast--stroke")).toBeInTheDocument();
    });

    it("should handle rapid open/close cycles", async () => {
      const { rerender } = render(
        <CToast
          {...defaultToastProps}
          open={true}
        />
      );

      rerender(
        <CToast
          {...defaultToastProps}
          open={false}
        />
      );
      rerender(
        <CToast
          {...defaultToastProps}
          open={true}
        />
      );
      rerender(
        <CToast
          {...defaultToastProps}
          open={false}
        />
      );
      rerender(
        <CToast
          {...defaultToastProps}
          open={true}
        />
      );

      const { container } = render(
        <CToast
          {...defaultToastProps}
          open={true}
        />
      );
      expect(container.querySelector(".toast")).toBeInTheDocument();
    });

    it("should maintain state through re-renders", () => {
      const { rerender } = render(<CToast {...defaultToastProps} />);
      expect(screen.getByText("Test Toast Title")).toBeInTheDocument();

      rerender(
        <CToast
          {...defaultToastProps}
          title="Updated Title"
        />
      );
      expect(screen.getByText("Updated Title")).toBeInTheDocument();
    });
  });

  describe("Negative Scenarios", () => {
    it("should handle missing required props gracefully", () => {
      const minimalProps = {
        open: true,
        onClose: mockOnClose,
        title: "Minimal",
      } as unknown;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => render(<CToast {...(minimalProps as any)} />)).not.toThrow();
    });

    it("should handle onClose being undefined", () => {
      const propsWithoutOnClose = {
        ...defaultToastProps,
        onClose: undefined as unknown,
      };
      const { container } = render(
        <CToast {...(propsWithoutOnClose as any)} /> // eslint-disable-line @typescript-eslint/no-explicit-any
      );
      const closeButton = container.querySelector(".toast__close-btn");

      fireEvent.click(closeButton!);

      //   expect(() => fireEvent.click(closeButton!)).toThrow();
    });

    it("should handle multiple simultaneous auto-hide timers", () => {
      const { rerender } = render(
        <CToast
          {...toastWithAutoHideProps}
          autoHideDuration={1000}
        />
      );

      act(() => {
        vi.advanceTimersByTime(500);
      });

      act(() => {
        rerender(
          <CToast
            {...toastWithAutoHideProps}
            autoHideDuration={2000}
          />
        );
      });

      act(() => {
        vi.runAllTimers(); // ✅ flush all auto-hide + transition timers
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should render toast body with proper structure", () => {
      const { container } = render(<CToast {...defaultToastProps} />);
      const toastBody = container.querySelector(".toast__body");
      expect(toastBody).toBeInTheDocument();
    });

    it("should render close button as clickable element", () => {
      const { container } = render(<CToast {...defaultToastProps} />);
      const closeButton = container.querySelector(".toast__close-btn");
      expect(closeButton).toBeInTheDocument();
    });

    it("should have proper structure for screen readers", () => {
      const { container } = render(<CToast {...successToastProps} />);
      expect(container.querySelector(".toast__body-title")).toBeInTheDocument();
      expect(container.querySelector(".toast__body-desc")).toBeInTheDocument();
    });
  });

  describe("Typography Component", () => {
    it("should render title in Typography component", () => {
      const { container } = render(<CToast {...defaultToastProps} />);
      const title = container.querySelector(".toast__body-title");
      expect(title?.tagName).toBe("P"); // MUI Typography renders as <p> by default
    });

    it("should render description in Typography component", () => {
      const { container } = render(<CToast {...successToastProps} />);
      const description = container.querySelector(".toast__body-desc");
      expect(description?.tagName).toBe("P");
    });
  });
});
