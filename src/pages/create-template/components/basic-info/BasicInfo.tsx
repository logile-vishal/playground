import React from "react";
import { Box } from "@mui/material";

import CTextfield from "@/core/components/form/textfield/Textfield";
import { ChevronRight } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import CSelect from "@/core/components/select/Select";
import clsx from "@/utils/clsx";

import { BASIC_INFO } from "../../constants/constant";
import "./BasicInfo.scss";

//TODO: To be removed static data when dropdown api response
const typeDropdownOptions = [
  { value: "type1", label: "Type 1" },
  { value: "type2", label: "Type 2" },
];
const tagsDropdownOptions = [
  { value: "Tags1", label: "Tags 1" },
  { value: "Tags2", label: "Tags 2" },
];
const directoryDropdownOptions = [
  { value: "Directory1", label: "Directory 1" },
  { value: "Directory2", label: "Directory 2" },
];

const BasicInfo: React.FC = () => {
  return (
    <Box className="create-template-basic-info">
      <Box className="create-template-basic-info__row">
        <Box className="create-template-basic-info__row-item create-template-basic-info__row-first-item">
          <CTextfield
            label={BASIC_INFO.templateName}
            required={true}
            placeholder={BASIC_INFO.templateNamePlaceholder}
          />
        </Box>
        <Box className="create-template-basic-info__row-item">
          <CTextfield
            label={BASIC_INFO.description}
            placeholder={BASIC_INFO.descriptionPlaceholder}
          />
        </Box>
      </Box>

      <Box className="create-template-basic-info__row">
        <Box className="create-template-basic-info__row-item create-template-basic-info__row-first-item">
          <CSelect
            label={BASIC_INFO.type}
            required={true}
            optionValueKey="value"
            optionLabelKey="label"
            placeholder={BASIC_INFO.typePlaceholder}
            options={typeDropdownOptions}
            sx={{ width: "200px" }}
          />
        </Box>
        <Box className="create-template-basic-info__row-item">
          <CSelect
            label={BASIC_INFO.tags}
            placeholder={BASIC_INFO.tagsPlaceholder}
            options={tagsDropdownOptions}
            optionValueKey="value"
            optionLabelKey="label"
            sx={{ width: "100%" }}
          />
        </Box>
      </Box>

      <Box className="create-template-basic-info__row">
        <Box className="create-template-basic-info__row-item create-template-basic-info__dropdown-container">
          <Box
            className={clsx({
              "create-template-basic-info__label": true,
              "required-icon": true,
            })}
          >
            {BASIC_INFO.directory}
          </Box>
          <Box className="create-template-basic-info__dropdown-row">
            <CSelect
              options={directoryDropdownOptions}
              placeholder={BASIC_INFO.directoryPlaceholder}
              sx={{ width: "200px" }}
              optionValueKey="value"
              optionLabelKey="label"
            />
            <CSvgIcon
              component={ChevronRight}
              color="secondary"
              size={24}
            />
            <CSelect
              options={directoryDropdownOptions}
              placeholder={BASIC_INFO.subDirectoryPlaceholder}
              sx={{ width: "200px" }}
              optionValueKey="value"
              optionLabelKey="label"
            />
            <CSvgIcon
              component={ChevronRight}
              color="secondary"
              size={24}
            />
            <CSelect
              options={directoryDropdownOptions}
              placeholder={BASIC_INFO.subDirectoryPlaceholder}
              optionValueKey="value"
              optionLabelKey="label"
              sx={{ width: "200px" }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BasicInfo;
