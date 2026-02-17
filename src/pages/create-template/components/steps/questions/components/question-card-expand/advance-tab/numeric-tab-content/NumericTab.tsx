import React, { useCallback } from "react";
import {
  Controller,
  useWatch,
  type FieldValues,
  type ControllerRenderProps,
} from "react-hook-form";
import { Box } from "@mui/material";

import CSwitch from "@/core/components/form/switch/Switch";
import CSelect from "@/core/components/form/select/Select";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import type { NumericTabProps } from "@/pages/create-template/types/questions.type";
import type { CreateTemplateFormType } from "@/pages/create-template/form-schema/create-template-form-schema";

import "../AdvanceTab.scss";

const NumericTab: React.FC<NumericTabProps> = ({
  questionFormPath,
  control,
}) => {
  const { setFormValue } = useCreateTemplateForm();
  const { ADVANCED_TAB_OPTIONS, ADVANCED_TAB_NUMERIC_VALUE_TYPE_OPTIONS } =
    useCreateTemplateTranslations();

  const isNumericValueEnabled = useWatch({
    control,
    name: `${questionFormPath}.questionAdvancedSettings.numericValue.isApplicable` as keyof FieldValues,
  });

  const handleNumericValueToggle = useCallback(
    (
      checked: boolean,
      field: ControllerRenderProps<FieldValues, string>
    ): void => {
      field.onChange(checked);
      if (!checked) {
        setFormValue(
          `${questionFormPath}.questionAdvancedSettings.numericValue.type` as keyof CreateTemplateFormType,
          null as CreateTemplateFormType
        );
      } else {
        setFormValue(
          `${questionFormPath}.questionAdvancedSettings.numericValue.type` as keyof CreateTemplateFormType,
          ADVANCED_TAB_NUMERIC_VALUE_TYPE_OPTIONS[1]
            .value as CreateTemplateFormType
        );
      }
    },
    [questionFormPath, setFormValue]
  );

  return (
    <Box className="advance-tab__section">
      <Box className="advance-tab__field-group">
        <Box className="advance-tab__section-wrapper">
          <Controller
            name={`${questionFormPath}.questionAdvancedSettings.numericValue.isApplicable`}
            control={control}
            render={({ field }) => (
              <CSwitch
                label={
                  ADVANCED_TAB_OPTIONS.NUMERIC_VALUE.numericValueToggleLabel
                }
                className="advance-tab__toggle-field"
                checked={field.value || false}
                onChange={(e): void => {
                  handleNumericValueToggle(Boolean(e.target.value), field);
                }}
              />
            )}
          />
        </Box>
        <Box className="advance-tab__field-group-item">
          {isNumericValueEnabled && (
            <Controller
              name={`${questionFormPath}.questionAdvancedSettings.numericValue.type`}
              control={control}
              render={({ field }) => (
                <CSelect
                  {...field}
                  value={
                    field.value ||
                    ADVANCED_TAB_NUMERIC_VALUE_TYPE_OPTIONS[1].value
                  }
                  onChange={(e): void => {
                    field.onChange(e);
                  }}
                  label={
                    ADVANCED_TAB_OPTIONS.NUMERIC_VALUE.numericValueTypeLabel
                  }
                  optionValueKey="value"
                  optionLabelKey="label"
                  options={ADVANCED_TAB_NUMERIC_VALUE_TYPE_OPTIONS}
                />
              )}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default NumericTab;
