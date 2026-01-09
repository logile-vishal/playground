import { vi } from "vitest";
import type { StepOption, StepperProps } from "@/core/types/stepper.type";

export const mockOnChange = vi.fn();
export const mockCheckValidity1 = vi.fn(() => true);
export const mockCheckValidity2 = vi.fn(() => true);
export const mockCheckValidity3 = vi.fn(() => true);

const StepComponent1 = () => (
  <div data-testid="step-component-1">Step Content 1</div>
);
const StepComponent2 = () => (
  <div data-testid="step-component-2">Step Content 2</div>
);
const StepComponent3 = () => (
  <div data-testid="step-component-3">Step Content 3</div>
);

export const defaultStepperOptions: StepOption[] = [
  {
    label: "Step 1",
    value: "step1",
    component: <StepComponent1 />,
    checkValidity: mockCheckValidity1,
  },
  {
    label: "Step 2",
    value: "step2",
    component: <StepComponent2 />,
    checkValidity: mockCheckValidity2,
  },
  {
    label: "Step 3",
    value: "step3",
    component: <StepComponent3 />,
    checkValidity: mockCheckValidity3,
  },
];

export const defaultStepperProps: StepperProps = {
  options: defaultStepperOptions,
  onChange: mockOnChange,
};

export const stepperPropsWithDisabled: StepperProps = {
  options: [
    {
      label: "Step 1",
      value: "step1",
      component: <StepComponent1 />,
    },
    {
      label: "Step 2",
      value: "step2",
      component: <StepComponent2 />,
      disabled: true,
    },
    {
      label: "Step 3",
      value: "step3",
      component: <StepComponent3 />,
    },
  ],
  onChange: mockOnChange,
};

export const stepperPropsWithError: StepperProps = {
  options: [
    {
      label: "Step 1",
      value: "step1",
      component: <StepComponent1 />,
      error: true,
    },
    {
      label: "Step 2",
      value: "step2",
      component: <StepComponent2 />,
    },
    {
      label: "Step 3",
      value: "step3",
      component: <StepComponent3 />,
    },
  ],
  onChange: mockOnChange,
};

export const stepperPropsWithClassName: StepperProps = {
  options: defaultStepperOptions,
  onChange: mockOnChange,
  componentClassName: "custom-stepper",
};

export const stepperPropsWithoutOnChange: StepperProps = {
  options: defaultStepperOptions,
};

export const stepperPropsEmptyOptions: StepperProps = {
  options: [],
  onChange: mockOnChange,
};

export const stepperPropsSingleStep: StepperProps = {
  options: [
    {
      label: "Only Step",
      value: "onlyStep",
      component: <StepComponent1 />,
    },
  ],
  onChange: mockOnChange,
};

export const stepperPropsWithoutComponent: StepperProps = {
  options: [
    {
      label: "Step without component",
      value: "stepNoComponent",
    },
  ],
  onChange: mockOnChange,
};

export const resetMocks = () => {
  mockOnChange.mockReset();
  mockCheckValidity1.mockReset();
  mockCheckValidity1.mockReturnValue(true);
  mockCheckValidity2.mockReset();
  mockCheckValidity2.mockReturnValue(true);
  mockCheckValidity3.mockReset();
  mockCheckValidity3.mockReturnValue(true);
};
