export type StepOption = {
  label: string;
  value: string;
  error?: boolean;
  disabled?: boolean;
  checkValidity?: () => Promise<boolean> | boolean | undefined;
  component?: React.ReactNode;
};

export type StepperProps = {
  currentStep?: number;
  options: StepOption[];
  componentClassName?: string;
  onChange?: (event: { activeStep: number; data: StepOption }) => void;
};
