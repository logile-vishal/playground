import type { InputProps } from "@mui/material";
import type { Dayjs } from "dayjs";

import type { SvgIconComponent } from "@/core/components/icon/Icon";

import type { QuestionType } from "./template-questions.type";

export type RenderTextFieldProps = {
  multiline?: boolean;
  rows?: number;
  width?: string;
  InputProps?: InputProps;
  placeholder?: string;
  value?: string;
  onClick?: () => void;
  size?: "small" | "medium";
  className?: string;
};

export type RenderLabelProps = {
  tagsVisible?: boolean;
};

export type IconConfigProp = {
  icon: SvgIconComponent;
  color: string;
};

type Option = {
  label: string;
  value: string;
};

export type RenderDropdownProps = {
  options?: Option[];
  placeholder?: string;
  isDesktopPreview?: boolean;
  children: React.ReactNode;
};

export type RenderCheckboxProps = {
  label?: string;
  isChecked?: boolean;
};

export type RenderRadioProps = {
  label: string;
  value: string;
};

export type RenderButtonContainerProps = {
  label: string;
  icon?: SvgIconComponent;
  type?: string;
};

export type DatePickerProps = {
  type?: "date" | "datetime";
  placeholder?: string;
  isDesktopPreview?: boolean;
  value?: Dayjs | null;
  onChange?: (val: Dayjs | null) => void;
};

export type RenderAttachmentProps = {
  question?: QuestionType;
  isDesktopPreview?: boolean;
  type?: string;
  templateBaseType?: string;
  QUESTION_TYPES?: Record<string, string>;
  QUESTION_ATTACHMENT?: Record<string, string>;
  ATTACHMENT_BUTTON_CONFIG?: Record<string, string>;
  DATE_INPUT_TYPE?: Record<string, string>;
};

type fieldProps = {
  QUESTION_TYPES?: Record<string, { label: string; value: string }>;
  DATE_INPUT_TYPE?: Record<string, { label: string; value: string }>;
  QUESTION_ATTACHMENT?: Record<string, { label: string; value: string }>;
  ATTACHMENT_BUTTON_CONFIG?: Record<string, string>;
};

export type RenderSectionProps = fieldProps & {
  question: QuestionType;
  parentIndex?: number;
  isDesktopPreview: boolean;
  templateBaseType?: string;
  renderChecklistComponent?: (
    item: QuestionType,
    index: string,
    isDesktopPreview?: boolean,
    templateBaseType?: string,
    ...fieldProps
  ) => React.ReactNode;
};

export type PreviewButtonConfigProp = {
  [key: string]: {
    label: string;
    icon: SvgIconComponent;
    type?: string;
  };
};

export type TemplateType = "CHECKLIST" | "FORM" | "GRID" | "SPREADSHEET";
