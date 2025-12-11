import React from "react";
import { Box } from "@mui/material";

import { CDropdown, CTextField } from "@/core/components/form/FormElements";
import { ChevronRight } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
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
          <CTextField
            label={BASIC_INFO.templateName}
            isRequired={true}
            placeholder={BASIC_INFO.templateNamePlaceholder}
          />
        </Box>
        <Box className="create-template-basic-info__row-item">
          <CTextField
            label={BASIC_INFO.description}
            placeholder={BASIC_INFO.descriptionPlaceholder}
          />
        </Box>
      </Box>

      <Box className="create-template-basic-info__row">
        <Box className="create-template-basic-info__row-item create-template-basic-info__row-first-item">
          <CDropdown
            label={BASIC_INFO.type}
            isRequired={true}
            width="200"
            placeholder={BASIC_INFO.typePlaceholder}
            options={typeDropdownOptions}
            menuClassName="create-template-basic-info__dropdown-menu"
          />
        </Box>
        <Box className="create-template-basic-info__row-item">
          <CDropdown
            label={BASIC_INFO.tags}
            placeholder={BASIC_INFO.tagsPlaceholder}
            options={tagsDropdownOptions}
          />
        </Box>
      </Box>

      <Box className="create-template-basic-info__row">
        <Box className="create-template-basic-info__row-item create-template-basic-info__dropdown-container">
          {/* TODO: CDropdown component from FormElement will replaced when shared Select file added */}
          <Box
            className={clsx({
              "create-template-basic-info__label": true,
              "required-icon": true,
            })}
          >
            {BASIC_INFO.directory}
          </Box>
          <Box className="create-template-basic-info__dropdown-row">
            <CDropdown
              options={directoryDropdownOptions}
              placeholder={BASIC_INFO.directoryPlaceholder}
              width="200"
              menuClassName="create-template-basic-info__dropdown-menu"
            />
            <CSvgIcon
              component={ChevronRight}
              color="secondary"
              size={24}
            />
            <CDropdown
              options={directoryDropdownOptions}
              placeholder={BASIC_INFO.subDirectoryPlaceholder}
              width="200"
              menuClassName="create-template-basic-info__dropdown-menu"
            />
            <CSvgIcon
              component={ChevronRight}
              color="secondary"
              size={24}
            />
            <CDropdown
              options={directoryDropdownOptions}
              placeholder={BASIC_INFO.subDirectoryPlaceholder}
              width="200"
              menuClassName="create-template-basic-info__dropdown-menu"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BasicInfo;
