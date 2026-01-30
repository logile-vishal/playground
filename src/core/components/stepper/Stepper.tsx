import { useEffect, useState } from "react";
import { Box, Step, StepLabel, Stepper } from "@mui/material";

import type { StepOption, StepperProps } from "@/core/types/stepper.type";
import { ChevronRightIconFilled } from "@/core/constants/icons";
import { useIsDesktopViewport } from "@/utils/get-viewport-size";
import clsx from "@/utils/clsx";

import CSvgIcon from "../icon/Icon";
import "./Stepper.scss";

/**
 * @method runStepValidator
 * @description Executes a validation function if provided and returns its result
 * @param {Function} [validateFn] - Optional validation function to execute
 * @returns {boolean} Validation result, defaults to true if no function provided
 */
const runStepValidator = async (
  validateFn?: () => boolean | Promise<boolean>
): Promise<boolean> => {
  if (typeof validateFn === "function") {
    const isStepValid = await validateFn();
    if (isStepValid != undefined && typeof isStepValid === "boolean")
      return isStepValid;
  }
  return true;
};

/**
 * @component CStepper
 * @description A stepper component that allows navigation between steps with validation
 * @param {StepperProps} props - Component props
 * @param {Array} props.options - Array of step configuration objects
 * @param {Function} [props.onChange] - Callback fired when active step changes
 * @returns {JSX.Element} Rendered stepper component
 */
const CStepper = ({
  options = [],
  onChange,
  currentStep = 0,
  componentClassName,
}: StepperProps) => {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [largestSelectedStep, setLargestSelectedStep] = useState(0);
  const isDesktop = useIsDesktopViewport();

  /**
   * @method isNavigateAllowed
   * @description Checks if navigation from current step to target step is allowed
   * @param {number} current - Current active step index
   * @param {number} target - Target step index to navigate to
   * @returns {boolean} True if navigation is allowed, false otherwise
   */
  const isNavigateAllowed = async (
    current: number,
    target: number
  ): Promise<boolean> => {
    if (target === current) return false;

    // Always allow backward navigation
    if (target < current) return true;

    // Forward navigation - validate in between step
    for (let i = current; i < target; i++) {
      const isStepValid = await runStepValidator(options[i]?.checkValidity);
      if (!isStepValid) {
        return false;
      }
    }

    return true;
  };

  /**
   * @method handleStepClick
   * @description Handles step click event and updates active step if navigation is allowed
   * @param {number} targetIndex - Index of the step that was clicked
   * @returns {void}
   */
  const handleStepClick = async (targetIndex: number, item: StepOption) => {
    if (!(await isNavigateAllowed(activeStep, targetIndex))) return;

    setActiveStep(targetIndex);
    setLargestSelectedStep((prev) => Math.max(prev, targetIndex));
    onChange?.({ activeStep: targetIndex, data: item });
  };

  useEffect(() => {
    setActiveStep(currentStep);
    setLargestSelectedStep((prev) => Math.max(prev, currentStep));
  }, [currentStep]);

  const renderComponent = () => {
    const component = options[activeStep]?.component as React.ElementType;
    if (component == undefined) return <></>;
    return <>{component}</>;
  };

  return (
    <div
      className={clsx({
        stepper: true,
        [componentClassName]: !!componentClassName,
      })}
    >
      <Stepper
        className={clsx({
          stepper__steps: true,
          "stepper__steps--top-border": !isDesktop,
        })}
        connector={<></>}
        activeStep={activeStep}
      >
        {options.map((item, index) => {
          const isCompleted = largestSelectedStep > index;
          const isActive = activeStep === index;
          const isDisabled = item?.disabled ?? false;
          const isError = item?.error;
          const isLastStep = options?.length - 1 === index;
          const isFirstStep = index == 0;
          return (
            <Step
              key={item.label}
              onClick={() => handleStepClick(index, item)}
              className={clsx({
                "stepper__steps-item": true,
                "stepper__first-step": isFirstStep,
              })}
              disabled={isDisabled}
            >
              <StepLabel
                className={clsx({
                  stepper__label: true,
                  "stepper__label--completed": isCompleted,
                  "stepper__label--error": isError,
                  "stepper__label--active": isActive,
                })}
                icon={
                  !isLastStep ? (
                    <CSvgIcon
                      component={ChevronRightIconFilled}
                      size={16}
                    />
                  ) : (
                    <></>
                  )
                }
              >
                {item.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box className="stepper__content">{renderComponent()}</Box>
    </div>
  );
};

export default CStepper;
