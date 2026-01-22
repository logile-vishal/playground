import type React from "react";
import { Box } from "@mui/material";

import CTextfield from "@/core/components/form/textfield/Textfield";
import CSwitch from "@/core/components/form/switch/Switch";
import CSelect from "@/core/components/select/Select";
import CSvgIcon from "@/core/components/icon/Icon";
import { Percentage } from "@/core/constants/icons";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";

import "./AdvancedOptions.scss";

const AdvancedOptions: React.FC = () => {
  const { ADVANCED_OPTIONS, LABOUR_HOUR_OPTIONS, TEMPLATE_ACCESS_OPTIONS } =
    useCreateTemplateTranslations();

  return (
    <Box className="ct-advanced-options">
      <Box className="ct-advanced-options__row">
        <Box className="ct-advanced-options__row-item">
          <CTextfield
            label={ADVANCED_OPTIONS.compilanceThreshold}
            type="number"
            endIcon={<CSvgIcon component={Percentage} />}
            width="var(--size-40)"
            placeholder={ADVANCED_OPTIONS.compilanceThresholdPlaceholder}
          />
        </Box>
        <Box className="ct-advanced-options__row-item">
          <Box className="ct-advanced-options__row-item-container">
            <CTextfield
              label={ADVANCED_OPTIONS.labourHours}
              type="number"
              width="var(--size-18)"
            />
            <CSelect
              options={LABOUR_HOUR_OPTIONS}
              optionValueKey="value"
              optionLabelKey="label"
              placeholder={ADVANCED_OPTIONS.labourHoursPlaceholder}
              className="ct-advanced-options__row-item-container-select"
            />
          </Box>
        </Box>
      </Box>

      <Box className="ct-advanced-options__row">
        <Box className="ct-advanced-options__row-item ">
          <CSelect
            label={ADVANCED_OPTIONS.templateAccess}
            options={TEMPLATE_ACCESS_OPTIONS}
            optionValueKey="value"
            optionLabelKey="label"
            placeholder={ADVANCED_OPTIONS.templateAccessPlaceholder}
            sx={{ width: "90%" }}
          />
        </Box>
        <Box className="ct-advanced-options__row-item-signature">
          <Box>{ADVANCED_OPTIONS.signature}</Box>
          <CSwitch />
        </Box>
      </Box>
    </Box>
  );
};

export default AdvancedOptions;
