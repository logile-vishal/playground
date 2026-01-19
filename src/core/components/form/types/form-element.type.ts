export type MandatoryFormElementProps = {
  label?: string;
  value?: unknown;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  name?: string;
  error?: boolean;
  required?: boolean;
};
