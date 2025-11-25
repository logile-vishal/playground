import { useState } from "react";
import { Step, StepLabel, Stepper } from "@mui/material";

import type { SharedStepperProps } from "@/core/types/stepper.type";
import { ChevronRightIconFilled } from "@/core/constants/icons";
import clsx from "@/utils/clsx";

import SvgIcon from "../icon/Icon";
import "./Stepper.scss";

/**
 * @method runStepValidator
 * @description Executes a validation function if provided and returns its result
 * @param {Function} [validateFn] - Optional validation function to execute
 * @returns {boolean} Validation result, defaults to true if no function provided
 */
const runStepValidator = (validateFn?: () => boolean): boolean => {
  if (typeof validateFn === "function") {
    const isStepValid = validateFn();
    if(isStepValid != undefined && typeof isStepValid === "boolean") return validateFn()
  }
  return true;
};

/**
 * @component SharedStepper
 * @description A stepper component that allows navigation between steps with validation
 * @param {SharedStepperProps} props - Component props
 * @param {Array} props.options - Array of step configuration objects
 * @param {Function} [props.onChange] - Callback fired when active step changes
 * @returns {JSX.Element} Rendered stepper component
 */
const SharedStepper = ({ options = [], onChange }: SharedStepperProps) => {

  const [activeStep, setActiveStep] = useState(0);
  const [largestSelectedStep, setLargestSelectedStep] = useState(0);

  
  /**
   * @method isNavigateAllowed
   * @description Checks if navigation from current step to target step is allowed
   * @param {number} current - Current active step index
   * @param {number} target - Target step index to navigate to
   * @returns {boolean} True if navigation is allowed, false otherwise
   */
  const isNavigateAllowed = (current: number, target: number): boolean => {
      if (target === current) return false;

      // Always allow backward navigation
      if (target < current) return true;

      // Forward navigation - validate in between step
      for (let i = current; i < target; i++) {
        const isStepValid = runStepValidator(options[i]?.checkValidity);
        if (!isStepValid) {
            return false;
        }
      }

      return true;
    }

  
  /**
   * @method handleStepClick
   * @description Handles step click event and updates active step if navigation is allowed
   * @param {number} targetIndex - Index of the step that was clicked
   * @returns {void}
   */
  const handleStepClick =  (targetIndex: number) => {
      if (!isNavigateAllowed(activeStep, targetIndex)) return;

      setActiveStep(targetIndex);
      setLargestSelectedStep((prev) => Math.max(prev, targetIndex));

      onChange?.({
        activeStep: targetIndex,
        data: options[targetIndex],
      });
    }

    const renderComponent = () => {
        const component = options[activeStep]?.component as React.ElementType;
        if(component == undefined) return <></>
        return <>{component}</>
    }

  return (
    <div className="shared-template-stepper">
      <Stepper className="shared-template-stepper__main" connector={<></>} activeStep={activeStep}>
        {options.map((item, index) => {
          const isCompleted = largestSelectedStep > index;
          const isActive = activeStep === index;
          const isDisabled = item?.disabled ?? false;
          const isError = item?.error;
          const isLastStep = options?.length - 1 === index
          const isFirstStep = index == 0;
          return (
            <Step
              key={item.label}
              onClick={() => handleStepClick(index)}
              className={clsx({'shared-template-stepper__step': true, 'shared-template-stepper__first-step': isFirstStep})}
              disabled={isDisabled}
            >
              <StepLabel
                className={clsx({
                  "shared-template-stepper__label": true,
                  "shared-template-stepper__label--completed": isCompleted,
                  "shared-template-stepper__label--error": isError,
                  "shared-template-stepper__label--active": isActive,
                })}
                icon={ !isLastStep ? 
                  <SvgIcon
                    component={ChevronRightIconFilled}
                    size={16}
                  /> : <></>
                }
              >
                {item.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {renderComponent()}
      </div>
    </div>
  );
};

export default SharedStepper;
