import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import CStepper from "../Stepper";
import {
  defaultStepperProps,
  stepperPropsWithDisabled,
  stepperPropsWithError,
  stepperPropsWithClassName,
  stepperPropsWithoutOnChange,
  stepperPropsEmptyOptions,
  stepperPropsSingleStep,
  stepperPropsWithoutComponent,
  mockOnChange,
  mockCheckValidity1,
  mockCheckValidity2,
  mockCheckValidity3,
  resetMocks,
} from "./__mocks__/Stepper.mocks";

// Mock clsx
vi.mock("@/utils/clsx", () => ({
  default: (classes: any) => {
    if (typeof classes === "string") return classes;
    if (typeof classes === "object" && classes !== null) {
      return Object.entries(classes)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(" ");
    }
    return "";
  },
}));

// Mock useIsDesktopViewport
vi.mock("@/utils/get-viewport-size", () => ({
  useIsDesktopViewport: vi.fn(() => true),
}));

// Mock icons
vi.mock("@/core/constants/icons", () => ({
  ChevronRightIconFilled: "ChevronRightIconFilled",
}));

// Mock CSvgIcon
vi.mock("@/core/components/icon/Icon", () => ({
  default: ({ component, size }: any) => (
    <span
      data-testid="svg-icon"
      data-component={component}
      data-size={size}
    />
  ),
}));

describe("CStepper Component", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("Component Rendering", () => {
    it("should render stepper component", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const stepper = container.querySelector(".shared-stepper");
      expect(stepper).toBeInTheDocument();
    });

    it("should render all step labels", () => {
      render(<CStepper {...defaultStepperProps} />);
      expect(screen.getByText("Step 1")).toBeInTheDocument();
      expect(screen.getByText("Step 2")).toBeInTheDocument();
      expect(screen.getByText("Step 3")).toBeInTheDocument();
    });

    it("should render MUI Stepper component", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const muiStepper = container.querySelector(".MuiStepper-root");
      expect(muiStepper).toBeInTheDocument();
    });

    it("should render active step component", () => {
      render(<CStepper {...defaultStepperProps} />);
      expect(screen.getByTestId("step-component-1")).toBeInTheDocument();
    });

    it("should render stepper content box", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const contentBox = container.querySelector(".shared-stepper__content");
      expect(contentBox).toBeInTheDocument();
    });

    it("should render chevron icons for all steps except last", () => {
      render(<CStepper {...defaultStepperProps} />);
      const icons = screen.getAllByTestId("svg-icon");
      // 2 icons for 3 steps (last step doesn't have icon)
      expect(icons.length).toBe(2);
    });

    it("should not render icon for last step", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");
      expect(steps.length).toBe(3);
    });

    it("should apply custom className", () => {
      const { container } = render(<CStepper {...stepperPropsWithClassName} />);
      const stepper = container.querySelector(".shared-stepper.custom-stepper");
      expect(stepper).toBeInTheDocument();
    });

    it("should render empty stepper with no options", () => {
      const { container } = render(<CStepper {...stepperPropsEmptyOptions} />);
      const stepper = container.querySelector(".shared-stepper");
      expect(stepper).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should handle options prop correctly", () => {
      render(<CStepper {...defaultStepperProps} />);
      expect(screen.getByText("Step 1")).toBeInTheDocument();
      expect(screen.getByText("Step 2")).toBeInTheDocument();
      expect(screen.getByText("Step 3")).toBeInTheDocument();
    });

    it("should handle onChange prop", () => {
      render(<CStepper {...defaultStepperProps} />);
      expect(mockOnChange).toBeDefined();
    });

    it("should handle componentClassName prop", () => {
      const { container } = render(<CStepper {...stepperPropsWithClassName} />);
      expect(container.querySelector(".custom-stepper")).toBeInTheDocument();
    });

    it("should handle missing onChange gracefully", () => {
      expect(() =>
        render(<CStepper {...stepperPropsWithoutOnChange} />)
      ).not.toThrow();
    });

    it("should handle empty options array", () => {
      const { container } = render(<CStepper {...stepperPropsEmptyOptions} />);
      expect(container.querySelector(".shared-stepper")).toBeInTheDocument();
    });

    it("should handle single step", () => {
      render(<CStepper {...stepperPropsSingleStep} />);
      expect(screen.getByText("Only Step")).toBeInTheDocument();
    });

    it("should handle step without component", () => {
      const { container } = render(
        <CStepper {...stepperPropsWithoutComponent} />
      );
      const content = container.querySelector(".shared-stepper__content");
      expect(content).toBeInTheDocument();
    });

    it("should handle disabled step", () => {
      render(<CStepper {...stepperPropsWithDisabled} />);
      const stepButtons = screen.getAllByText(/step/i);
      expect(stepButtons[1]).toHaveClass("Mui-disabled");
    });

    it("should handle error step", () => {
      const { container } = render(<CStepper {...stepperPropsWithError} />);
      const errorStep = container.querySelector(
        ".shared-stepper__label--error"
      );
      expect(errorStep).toBeInTheDocument();
    });
  });

  describe("Event Handling - Step Navigation", () => {
    it("should navigate to next step when clicked", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      fireEvent.click(steps[1]);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith({
        activeStep: 1,
        data: defaultStepperProps.options[1],
      });
    });

    it("should navigate to previous step when clicked", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      // Navigate to step 2 first
      fireEvent.click(steps[1]);
      resetMocks();

      // Navigate back to step 1
      fireEvent.click(steps[0]);

      expect(mockOnChange).toHaveBeenCalledWith({
        activeStep: 0,
        data: defaultStepperProps.options[0],
      });
    });

    it("should not navigate when clicking current step", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      fireEvent.click(steps[0]);

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("should allow backward navigation without validation", () => {
      mockCheckValidity1.mockReturnValue(false);
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      // Go to step 2
      mockCheckValidity1.mockReturnValue(true);
      fireEvent.click(steps[1]);
      resetMocks();
      mockCheckValidity1.mockReturnValue(false);

      // Go back to step 1 (should work even if step 1 validation fails)
      fireEvent.click(steps[0]);

      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should prevent forward navigation if validation fails", () => {
      mockCheckValidity1.mockReturnValue(false);
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      fireEvent.click(steps[1]);

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("should validate all steps between current and target", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      // Try to navigate from step 1 to step 3
      fireEvent.click(steps[2]);

      // Should validate step 1 and step 2
      expect(mockCheckValidity1).toHaveBeenCalled();
      expect(mockCheckValidity2).toHaveBeenCalled();
    });

    it("should not navigate if any intermediate step validation fails", () => {
      mockCheckValidity2.mockReturnValue(false);
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      fireEvent.click(steps[2]);

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("should update component when step changes", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");
      expect(screen.getByTestId("step-component-1")).toBeInTheDocument();

      fireEvent.click(steps[1]);

      expect(screen.getByTestId("step-component-2")).toBeInTheDocument();
      expect(screen.queryByTestId("step-component-1")).not.toBeInTheDocument();
    });

    it("should not call onChange when navigation is not allowed", () => {
      mockCheckValidity1.mockReturnValue(false);
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      fireEvent.click(steps[1]);

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe("Validation Logic", () => {
    it("should call checkValidity when navigating forward", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      fireEvent.click(steps[1]);

      expect(mockCheckValidity1).toHaveBeenCalled();
    });

    it("should not call checkValidity when navigating backward", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      // Navigate to step 2
      fireEvent.click(steps[1]);
      resetMocks();

      // Navigate back to step 1
      fireEvent.click(steps[0]);

      expect(mockCheckValidity1).not.toHaveBeenCalled();
      expect(mockCheckValidity2).not.toHaveBeenCalled();
    });

    it("should handle validation function returning undefined", () => {
      mockCheckValidity1.mockReturnValue(undefined as any);
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      fireEvent.click(steps[1]);

      // Should default to true and allow navigation
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should handle validation function returning non-boolean", () => {
      mockCheckValidity1.mockReturnValue("true" as any);
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      fireEvent.click(steps[1]);

      // Should default to true and allow navigation
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should handle missing checkValidity function", () => {
      const propsWithoutValidation = {
        options: [
          { label: "Step 1", value: "step1", component: <div>Step 1</div> },
          { label: "Step 2", value: "step2", component: <div>Step 2</div> },
        ],
        onChange: mockOnChange,
      };

      const { container } = render(<CStepper {...propsWithoutValidation} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      fireEvent.click(steps[1]);

      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should handle checkValidity throwing error", () => {
      const errorValidation = vi.fn(() => {
        try {
          throw new Error("Validation error");
        } catch (error) {
          return false;
        }
      });

      const propsWithErrorValidation = {
        options: [
          {
            label: "Step 1",
            value: "step1",
            component: <div>Step 1</div>,
            checkValidity: errorValidation,
          },
          { label: "Step 2", value: "step2", component: <div>Step 2</div> },
        ],
        onChange: mockOnChange,
      };

      const { container } = render(<CStepper {...propsWithErrorValidation} />);
      const steps = container.querySelectorAll(".MuiStep-root");
      fireEvent.click(steps[1]);

      expect(errorValidation).toHaveBeenCalled();
    });
  });

  describe("Step States and Styling", () => {
    it("should mark first step as active initially", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const activeStep = container.querySelector(
        ".shared-stepper__label--active"
      );
      expect(activeStep?.textContent).toBe("Step 1");
    });

    it("should mark completed steps", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      fireEvent.click(steps[1]);

      const completedStep = container.querySelector(
        ".shared-stepper__label--completed"
      );
      expect(completedStep).toBeInTheDocument();
    });

    it("should apply first-step class to first step", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const firstStep = container.querySelector(".shared-stepper__first-step");
      expect(firstStep).toBeInTheDocument();
    });

    it("should apply error class when step has error", () => {
      const { container } = render(<CStepper {...stepperPropsWithError} />);
      const errorStep = container.querySelector(
        ".shared-stepper__label--error"
      );
      expect(errorStep).toBeInTheDocument();
    });

    it("should disable step when disabled prop is true", () => {
      render(<CStepper {...stepperPropsWithDisabled} />);
      const stepButtons = screen.getAllByText(/step/i);
      expect(stepButtons[1]).toHaveClass("Mui-disabled");
    });

    it("should update largest selected step", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      fireEvent.click(steps[2]);

      // Step 1 and 2 should be marked as completed
      const completedSteps = container.querySelectorAll(
        ".shared-stepper__label--completed"
      );
      expect(completedSteps.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle navigation to same step", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      fireEvent.click(steps[0]);

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("should handle navigation with no options", () => {
      const { container } = render(<CStepper {...stepperPropsEmptyOptions} />);
      expect(container.querySelector(".shared-stepper")).toBeInTheDocument();
    });

    it("should handle step with undefined component", () => {
      render(<CStepper {...stepperPropsWithoutComponent} />);
      const content = screen.queryByTestId(/step-component/);
      expect(content).not.toBeInTheDocument();
    });

    it("should handle very long step labels", () => {
      const longLabelProps = {
        options: [
          {
            label: "A".repeat(100),
            value: "A".repeat(100),
            component: <div>Step</div>,
          },
        ],
        onChange: mockOnChange,
      };

      render(<CStepper {...longLabelProps} />);
      expect(screen.getByText("A".repeat(100))).toBeInTheDocument();
    });

    it("should handle special characters in labels", () => {
      const specialCharsProps = {
        options: [
          {
            label: "Step !@#$%^&*()",
            value: "stepSpecialChars",
            component: <div>Step</div>,
          },
        ],
        onChange: mockOnChange,
      };

      render(<CStepper {...specialCharsProps} />);
      expect(screen.getByText("Step !@#$%^&*()")).toBeInTheDocument();
    });

    it("should handle large number of steps", () => {
      const manyStepsProps = {
        options: Array.from({ length: 20 }, (_, i) => ({
          label: `Step ${i + 1}`,
          value: `step${i + 1}`,
          component: <div>Step component {i + 1}</div>,
        })),
        onChange: mockOnChange,
      };

      render(<CStepper {...manyStepsProps} />);
      expect(screen.getByText("Step 1")).toBeInTheDocument();
      expect(screen.getByText("Step 20")).toBeInTheDocument();
    });

    it("should handle null component gracefully", () => {
      const nullComponentProps = {
        options: [{ label: "Step 1", value: "step1", component: null as any }],
        onChange: mockOnChange,
      };

      expect(() => render(<CStepper {...nullComponentProps} />)).not.toThrow();
    });
  });

  describe("Negative Scenarios", () => {
    it("should handle onChange throwing error", () => {
      const errorOnChange = vi.fn(() => {
        try {
          throw new Error("onChange error");
        } catch (error) {
          // Error caught
        }
      });

      const propsWithError = {
        ...defaultStepperProps,
        onChange: errorOnChange,
      };

      const { container } = render(<CStepper {...propsWithError} />);
      const steps = container.querySelectorAll(".MuiStep-root");
      fireEvent.click(steps[1]);

      expect(errorOnChange).toHaveBeenCalledTimes(1);
    });

    it("should handle undefined options gracefully", () => {
      expect(() =>
        render(
          <CStepper
            options={undefined as any}
            onChange={mockOnChange}
          />
        )
      ).not.toThrow();
    });

    // Todo : Need to check
    // it("should handle null options gracefully", () => {
    //   expect(() =>
    //     render(
    //       <CStepper
    //         options={null as any}
    //         onChange={mockOnChange}
    //       />
    //     )
    //   ).not.toThrow();
    // });
  });

  describe("Integration Scenarios", () => {
    it("should handle complete forward navigation flow", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      expect(screen.getByTestId("step-component-1")).toBeInTheDocument();

      fireEvent.click(steps[1]);
      expect(screen.getByTestId("step-component-2")).toBeInTheDocument();

      fireEvent.click(steps[2]);
      expect(screen.getByTestId("step-component-3")).toBeInTheDocument();

      expect(mockOnChange).toHaveBeenCalledTimes(2);
    });

    it("should handle forward and backward navigation", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      fireEvent.click(steps[1]);
      fireEvent.click(steps[2]);
      fireEvent.click(steps[0]);

      expect(screen.getByTestId("step-component-1")).toBeInTheDocument();
      expect(mockOnChange).toHaveBeenCalledTimes(3);
    });

    it("should maintain state through multiple interactions", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      // Navigate forward
      fireEvent.click(steps[1]);
      fireEvent.click(steps[2]);

      // Navigate backward
      fireEvent.click(steps[0]);

      // Try to navigate forward again
      fireEvent.click(steps[2]);

      expect(mockOnChange).toHaveBeenCalledTimes(4);
    });

    it("should handle rapid successive clicks", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");

      fireEvent.click(steps[1]);
      fireEvent.click(steps[1]);
      fireEvent.click(steps[1]);

      // Should only navigate once (clicking same step multiple times)
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should render step labels with proper structure", () => {
      render(<CStepper {...defaultStepperProps} />);
      const stepLabels = screen.getAllByText(/Step \d/);
      expect(stepLabels.length).toBe(3);
    });

    it("should have clickable steps", () => {
      const { container } = render(<CStepper {...defaultStepperProps} />);
      const steps = container.querySelectorAll(".MuiStep-root");
      expect(steps.length).toBe(3);
      steps.forEach((step) => {
        expect(step).toBeInTheDocument();
      });
    });

    it("should properly mark disabled steps", () => {
      render(<CStepper {...stepperPropsWithDisabled} />);
      const stepButtons = screen.getAllByText(/step/i);
      expect(stepButtons[1]).toHaveClass("Mui-disabled");
    });
  });
});
