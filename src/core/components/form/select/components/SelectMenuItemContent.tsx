import React from "react";

import CCheckbox from "@/core/components/form/checkbox/Checkbox";
import type { SelectMenuItemContentProps } from "@/core/components/form/types/select.type";

export const SelectMenuItemContent: React.FC<SelectMenuItemContentProps> = ({
  option,
  isOptionSelected,
  allowMultiSelect,
  getOptionLabel,
}) => {
  return (
    <div className="select__menu-item-content">
      {allowMultiSelect && (
        <CCheckbox
          checked={isOptionSelected}
          disabled={option.disabled}
        />
      )}
      {option.labelStartIcon && (
        <div className="select__menu-item-content-label-icon">
          {option.labelStartIcon}
        </div>
      )}
      <label className="select__menu-item-label">
        {getOptionLabel(option)}
      </label>
      {option.labelEndIcon && (
        <div className="select__menu-item-content-label-icon">
          {option.labelEndIcon}
        </div>
      )}
    </div>
  );
};
