import type { ReactNode } from "react";

import type { IdentifierProps } from "@/core/types/IdentifierProps.type";
import type { SvgIconComponent } from "@/core/components/icon/Icon";

import type { MandatoryFormElementProps } from "./form-element.type";

export type SelectOption = {
  value: string | number | null;
  label: string;
  labelStartIcon?: React.ReactNode;
  labelEndIcon?: React.ReactNode;
  disabled?: boolean;
};

// Template context for customizing select menu item
type MenuItemTemplateContext = {
  option: SelectOption;
  isSelected: boolean;
  isDisabled: boolean;
  hasMultiSelect: boolean;
  hasLeftIcon: boolean;
  hasRightIcon: boolean;
};
type inputValueTemplateContext = {
  selectedItems: selectValueType;
  options: SelectOption[];
  isAllSelected: boolean;
  hasMultiSelect: boolean;
};

export type SelectMenuItemTemplates = {
  menuItemTemplate?: (context: MenuItemTemplateContext) => ReactNode;
  inputValueTemplate?: (context: inputValueTemplateContext) => ReactNode;
};
export type selectValueType = string | number | SelectOption | SelectOption[];

export type SelectProps = MandatoryFormElementProps &
  IdentifierProps & {
    options: SelectOption[];
    allowMultiSelect?: boolean;
    allowFilter?: boolean;
    allowSort?: boolean;
    value?: selectValueType;
    placeholder?: string;
    walkMeIdPrefix?: string[];
    helperText?: string;
    error?: boolean;
    IconComponent?: SvgIconComponent;
    onChange?: (
      event:
        | React.ChangeEvent<HTMLInputElement>
        | (Event & { target: { value: unknown; name: string } }),
      child: React.ReactNode
    ) => void;
    width?: string;
    isInlineLabel?: boolean;
    menuHeight?: string;
    menuWidth?: string;
    templates?: SelectMenuItemTemplates;
    optionValueKey?: string;
    optionLabelKey?: string;
    disabled?: boolean;
  };
export type SelectMenuItemContentProps = {
  option: SelectOption;
  isOptionSelected: boolean;
  allowMultiSelect: boolean;
  getOptionLabel: (option: SelectOption) => string;
};
export type CFilterSortToolbarProps = {
  allowFilter?: boolean;
  allowSort?: boolean;
  setOptions?: React.Dispatch<React.SetStateAction<SelectOption[]>>;
  options: SelectOption[];
  optionFilterLabelKey: string | null;
  allowSelectAll?: boolean;
  handleSelectAll?: (event: React.MouseEvent<HTMLDivElement>) => void;
  isAllOptionsSelected?: boolean;
};
