import type React from "react";
import { Box } from "@mui/material";
import { Controller } from "react-hook-form";

import CTextfield from "@/core/components/form/textfield/Textfield";
import CSelect from "@/core/components/form/select/Select";
import CSwitch from "@/core/components/form/switch/Switch";
import CSvgIcon from "@/core/components/icon/Icon";
import { Percentage } from "@/core/constants/icons";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { useCreateTemplateForm } from "@/pages/create-template/services/create-template-form.service";

import "./AdvancedOptions.scss";

const AdvancedOptions: React.FC = () => {
  const { ADVANCED_OPTIONS, LABOUR_HOUR_OPTIONS, TEMPLATE_ACCESS_OPTIONS } =
    useCreateTemplateTranslations();
  const { control, formErrors } = useCreateTemplateForm();

  return (
    <Box className="ct-advanced-options">
      <Box className="ct-advanced-options__row">
        <Box className="ct-advanced-options__row-item">
          <Controller
            name="advancedOptions.complianceThreshold"
            control={control}
            render={({ field }) => (
              <CTextfield
                {...field}
                error={!!formErrors.advancedOptions?.complianceThreshold}
                helperText={
                  formErrors.advancedOptions?.complianceThreshold
                    ?.message as string
                }
                label={ADVANCED_OPTIONS.compilanceThreshold}
                type="number"
                endIcon={<CSvgIcon component={Percentage} />}
                width="var(--size-40)"
                placeholder={ADVANCED_OPTIONS.compilanceThresholdPlaceholder}
              />
            )}
          />
        </Box>
        <Box className="ct-advanced-options__row-item">
          <Box className="ct-advanced-options__row-item-container">
            <Controller
              name="advancedOptions.labourHours"
              control={control}
              render={({ field }) => (
                <CTextfield
                  {...field}
                  label={ADVANCED_OPTIONS.labourHours}
                  type="number"
                  width="var(--size-18)"
                  className="ct-advanced-options__row-item-container-text"
                />
              )}
            />
            <Controller
              name="advancedOptions.labourHoursUnit"
              control={control}
              render={({ field }) => (
                <CSelect
                  {...field}
                  options={LABOUR_HOUR_OPTIONS}
                  optionValueKey="value"
                  optionLabelKey="label"
                  placeholder={ADVANCED_OPTIONS.labourHoursPlaceholder}
                  className="ct-advanced-options__row-item-container-select"
                />
              )}
            />
          </Box>
        </Box>
      </Box>

      <Box className="ct-advanced-options__row">
        <Box className="ct-advanced-options__row-item">
          <Controller
            name="advancedOptions.templateAccess"
            control={control}
            render={({ field }) => (
              <CSelect
                {...field}
                label={ADVANCED_OPTIONS.templateAccess}
                options={TEMPLATE_ACCESS_OPTIONS}
                optionValueKey="value"
                optionLabelKey="label"
                placeholder={ADVANCED_OPTIONS.templateAccessPlaceholder}
                width="90%"
              />
            )}
          />
        </Box>
        <Box className="ct-advanced-options__row-item-signature">
          <Box>{ADVANCED_OPTIONS.signature}</Box>
          <Controller
            name="advancedOptions.signatureRequired"
            control={control}
            render={({ field }) => <CSwitch {...field} />}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AdvancedOptions;
