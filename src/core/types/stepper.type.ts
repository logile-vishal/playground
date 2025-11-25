
export type StepOption = {
  label: string;
  value: string;
  error?: boolean;
  disabled?: boolean;
  checkValidity?: () => boolean | undefined;
  component?: React.ReactNode;
}

export type SharedStepperProps = {
  options: StepOption[];
  onChange?: (event: { activeStep: number; data: StepOption }) => void;
}
