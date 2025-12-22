import type React from "react";
import { Box, styled, Switch } from "@mui/material";

import CTextfield from "@/core/components/form/textfield/Textfield";
import CSelect from "@/core/components/select/Select";
import CSvgIcon from "@/core/components/icon/Icon";
import { Percentage } from "@/core/constants/icons";

import "./AdvancedOptions.scss";
import { useCreateTemplateTranslations } from "../../translation/useCreateTemplateTranslations";

const StyledSwitch = styled((props) => (
  <Switch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
  />
))(() => ({
  width: "var(--size-10)",
  height: "var(--size-5)",
  padding: 0,
  color: "var(--logile-bg-container-1)",
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: "var(--toggle-margin)",
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(var(--size-5))",
      color: "var(--logile-bg-container-1)",
      "& + .MuiSwitch-track": {
        backgroundColor: "var(--logile-bg-primary)",
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: "calc(var(--size-3) + var(--size-0-2))",
    height: "calc(var(--size-3) + var(--size-0-2))",
    boxShadow: "none",
  },
  "& .MuiSwitch-track": {
    borderRadius: "var(--radius-l)",
    // TODO: change variable for background color after dark mode colors are finalized
    backgroundColor: "var(--logile-bg-surface-subtle)",
    opacity: 1,
  },
}));

const AdvancedOptions: React.FC = () => {
  const { ADVANCED_OPTIONS, LABOUR_HOUR_OPTIONS, TEMPLATE_ACCESS_OPTIONS } =
    useCreateTemplateTranslations();

  return (
    <Box className="create-template-advanced-options">
      <Box className="create-template-advanced-options__row">
        <Box className="create-template-advanced-options__row-item">
          <CTextfield
            label={ADVANCED_OPTIONS.compilanceThreshold}
            type="number"
            endIcon={<CSvgIcon component={Percentage} />}
            sx={{ width: "var(--size-40)" }}
            placeholder={ADVANCED_OPTIONS.compilanceThresholdPlaceholder}
          />
        </Box>
        <Box className="create-template-advanced-options__row-item">
          <Box className="create-template-advanced-options__row-item-container">
            <CTextfield
              label={ADVANCED_OPTIONS.labourHours}
              type="number"
              sx={{ width: "var(--size-18)" }}
            />
            <CSelect
              options={LABOUR_HOUR_OPTIONS}
              optionValueKey="value"
              optionLabelKey="label"
              placeholder={ADVANCED_OPTIONS.labourHoursPlaceholder}
              className="create-template-advanced-options__row-item-container-select"
            />
          </Box>
        </Box>
      </Box>

      <Box className="create-template-advanced-options__row">
        <Box className="create-template-advanced-options__row-item ">
          <CSelect
            label={ADVANCED_OPTIONS.templateAccess}
            options={TEMPLATE_ACCESS_OPTIONS}
            optionValueKey="value"
            optionLabelKey="label"
            placeholder={ADVANCED_OPTIONS.templateAccessPlaceholder}
            sx={{ width: "90%" }}
          />
        </Box>
        <Box className="create-template-advanced-options__row-item-signature">
          <Box>{ADVANCED_OPTIONS.signature}</Box>
          <StyledSwitch />
        </Box>
      </Box>
    </Box>
  );
};

export default AdvancedOptions;
