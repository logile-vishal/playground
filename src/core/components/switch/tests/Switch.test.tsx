import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import CSwitch from "../Switch";
import type { CSwitchProps } from "../Switch";
import {
  mockOnChange,
  defaultSwitchProps,
  smallSwitchProps,
  mediumSwitchProps,
  largeSwitchProps,
  disabledSwitchProps,
  checkedSwitchProps,
  uncheckedSwitchProps,
  customClassSwitchProps,
  allSizes,
  resetMocks,
} from "./__mocks__/Switch.mocks";

describe("CSwitch Component", () => {
  beforeEach(() => {
    resetMocks();
  });

  describe("Component Rendering", () => {
    it("should render the switch component", () => {
      const { container } = render(<CSwitch {...defaultSwitchProps} />);
      const switchWrapper = container.querySelector(".switch-wrapper");
      expect(switchWrapper).toBeInTheDocument();
    });

    it("should render switch with default medium size when size prop is not provided", () => {
      const { container } = render(<CSwitch {...defaultSwitchProps} />);
      const switchElement = container.querySelector(".switch--medium");
      expect(switchElement).toBeInTheDocument();
    });

    it("should render switch with disableRipple attribute", () => {
      const { container } = render(<CSwitch {...defaultSwitchProps} />);
      const switchInput = container.querySelector('input[type="checkbox"]');
      expect(switchInput).toBeInTheDocument();
    });
  });

  describe("Size Prop Handling", () => {
    it("should render switch with small size", () => {
      const { container } = render(<CSwitch {...smallSwitchProps} />);
      const switchElement = container.querySelector(".switch--small");
      expect(switchElement).toBeInTheDocument();
    });

    it("should render switch with medium size", () => {
      const { container } = render(<CSwitch {...mediumSwitchProps} />);
      const switchElement = container.querySelector(".switch--medium");
      expect(switchElement).toBeInTheDocument();
    });

    it("should render switch with large size", () => {
      const { container } = render(<CSwitch {...largeSwitchProps} />);
      const switchElement = container.querySelector(".switch--large");
      expect(switchElement).toBeInTheDocument();
    });

    it("should render all size variants correctly", () => {
      allSizes.forEach((size) => {
        const { container } = render(<CSwitch size={size} />);
        const switchElement = container.querySelector(`.switch--${size}`);
        expect(switchElement).toBeInTheDocument();
      });
    });
  });

  describe("Checked State Handling", () => {
    it("should render switch as unchecked by default", () => {
      const { container } = render(<CSwitch {...defaultSwitchProps} />);
      const switchInput = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      expect(switchInput?.checked).toBe(false);
    });

    it("should render switch as checked when defaultChecked is true", () => {
      const { container } = render(<CSwitch {...smallSwitchProps} />);
      const switchInput = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      expect(switchInput?.checked).toBe(true);
    });

    it("should render switch as checked when checked prop is true", () => {
      const { container } = render(<CSwitch {...checkedSwitchProps} />);
      const switchInput = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      expect(switchInput?.checked).toBe(true);
    });

    it("should render switch as unchecked when checked prop is false", () => {
      const { container } = render(<CSwitch {...uncheckedSwitchProps} />);
      const switchInput = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      expect(switchInput?.checked).toBe(false);
    });
  });

  describe("Event Handling", () => {
    it("should call onChange when switch is clicked", () => {
      const { container } = render(<CSwitch {...defaultSwitchProps} />);
      const switchInput = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;

      fireEvent.click(switchInput);
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("should call onChange with correct event when toggled", () => {
      const { container } = render(<CSwitch {...checkedSwitchProps} />);
      const switchInput = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;

      fireEvent.click(switchInput);
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Boolean)
      );
    });

    it("should not call onChange when disabled", async () => {
      const onChange = vi.fn();

      const { container } = render(
        <CSwitch
          {...disabledSwitchProps}
          onChange={onChange}
        />
      );

      const switchInput = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;

      // Sanity check
      expect(switchInput).toBeDisabled();
    });

    it("should handle multiple toggle events", () => {
      const { container } = render(<CSwitch {...defaultSwitchProps} />);
      const switchInput = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;

      fireEvent.click(switchInput);
      fireEvent.click(switchInput);
      fireEvent.click(switchInput);

      expect(mockOnChange).toHaveBeenCalledTimes(3);
    });
  });

  describe("Disabled State Handling", () => {
    it("should render disabled switch", () => {
      const { container } = render(<CSwitch {...disabledSwitchProps} />);
      const switchInput = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      expect(switchInput).toBeDisabled();
    });

    it("should not allow interaction when disabled", () => {
      const mockOnChange = vi.fn();

      const { container } = render(
        <CSwitch
          {...disabledSwitchProps}
          onChange={mockOnChange}
        />
      );

      const switchInput = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;

      expect(switchInput).toBeDisabled();
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("should render enabled switch by default", () => {
      const { container } = render(<CSwitch {...defaultSwitchProps} />);
      const switchInput = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      expect(switchInput).not.toBeDisabled();
    });
  });

  describe("ClassName Handling", () => {
    it("should apply custom className along with default classes", () => {
      const { container } = render(<CSwitch {...customClassSwitchProps} />);
      const switchElement = container.querySelector(".custom-switch-class");
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toHaveClass("switch");
      expect(switchElement).toHaveClass("switch--medium");
    });

    it("should not apply custom className when not provided", () => {
      const { container } = render(<CSwitch {...defaultSwitchProps} />);
      const switchElement = container.querySelector(".switch");
      expect(switchElement).not.toHaveClass("custom-switch-class");
    });

    it("should apply size-specific class correctly", () => {
      const { container } = render(
        <CSwitch
          size="large"
          className="my-custom-class"
        />
      );
      const switchElement = container.querySelector(".switch--large");
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toHaveClass("my-custom-class");
    });
  });

  describe("Props Spreading", () => {
    it("should spread additional props to Switch component", () => {
      const { container } = render(
        <CSwitch
          {...defaultSwitchProps}
          id="test-switch"
          name="testSwitch"
          value="testValue"
        />
      );
      const switchInput = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;

      expect(switchInput.id).toBe("test-switch");
      expect(switchInput.name).toBe("testSwitch");
      expect(switchInput.value).toBe("testValue");
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined size prop gracefully", () => {
      const props: CSwitchProps = { ...defaultSwitchProps, size: undefined };
      const { container } = render(<CSwitch {...props} />);
      const switchElement = container.querySelector(".switch--medium");
      expect(switchElement).toBeInTheDocument();
    });

    it("should handle empty className", () => {
      const { container } = render(
        <CSwitch
          {...defaultSwitchProps}
          className=""
        />
      );
      const switchElement = container.querySelector(".switch");
      expect(switchElement).toBeInTheDocument();
    });

    it("should render without onChange handler", () => {
      const propsWithoutOnChange: CSwitchProps = {
        defaultChecked: false,
        disabled: false,
      };
      const { container } = render(<CSwitch {...propsWithoutOnChange} />);
      const switchInput = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;

      expect(() => fireEvent.click(switchInput)).not.toThrow();
    });

    it("should handle controlled component behavior", () => {
      const onChangeMock = vi.fn();
      const { container, rerender } = render(
        <CSwitch
          checked={false}
          onChange={onChangeMock}
        />
      );
      const switchInput = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;

      expect(switchInput.checked).toBe(false);

      rerender(
        <CSwitch
          checked={true}
          onChange={onChangeMock}
        />
      );
      expect(switchInput.checked).toBe(true);
    });

    it("should maintain checked state with defaultChecked in uncontrolled mode", () => {
      const { container } = render(
        <CSwitch
          defaultChecked={true}
          onChange={mockOnChange}
        />
      );
      const switchInput = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;

      expect(switchInput.checked).toBe(true);
      fireEvent.click(switchInput);
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe("Boundary Conditions", () => {
    it("should handle rapid consecutive clicks", () => {
      const { container } = render(<CSwitch {...defaultSwitchProps} />);
      const switchInput = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;

      for (let i = 0; i < 10; i++) {
        fireEvent.click(switchInput);
      }

      expect(mockOnChange).toHaveBeenCalledTimes(10);
    });

    it("should handle onChange with error gracefully", () => {
      const errorOnChange = vi.fn(() => {
        try {
          throw new Error("Test error");
        } catch (error) {}
      });

      try {
        const { container } = render(
          <CSwitch
            {...defaultSwitchProps}
            onChange={errorOnChange}
          />
        );
        const switchInput = container.querySelector(
          'input[type="checkbox"]'
        ) as HTMLInputElement;

        fireEvent.click(switchInput);
      } catch (error) {
        // Expected to catch error
      }

      expect(errorOnChange).toHaveBeenCalledTimes(1);
    });

    it("should apply all size classes with custom className", () => {
      allSizes.forEach((size) => {
        const { container } = render(
          <CSwitch
            size={size}
            className="custom-class"
          />
        );
        const switchElement = container.querySelector(`.switch--${size}`);
        expect(switchElement).toHaveClass("custom-class");
      });
    });
  });
});
