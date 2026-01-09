import React, { useState } from "react";
import { Box } from "@mui/material";

import CTextfield from "@/core/components/form/textfield/Textfield";
import { ChevronRight } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import CSelect from "@/core/components/select/Select";
import CMultiSelectWithChip from "@/core/components/multi-select-chip/MultiSelectWithChip";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";
import { useIsDesktopViewport } from "@/utils/get-viewport-size";
import clsx from "@/utils/clsx";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { basicTagsSampleData } from "@/pages/create-template/constants/sampleData";

import "./BasicInfo.scss";

//TODO: To be removed static data when dropdown api response
const typeDropdownOptions = [
  { value: "Type 1", label: "Type 1" },
  { value: "Type 2", label: "Type 2" },
];
const directoryDropdownOptions = [
  { value: "Directory 1", label: "Directory 1" },
  { value: "Directory 2", label: "Directory 2" },
];

const BasicInfo: React.FC = () => {
  const { BASIC_INFO } = useCreateTemplateTranslations();
  const [selectedTags, setSelectedTags] = useState([]);
  const isDesktop = useIsDesktopViewport();

  const handleTagsDelete = (_: React.MouseEvent, data: NestedMenuItem) => {
    const updatedItems = selectedTags.filter(
      (item) => item?.value !== data?.value
    );
    setSelectedTags(updatedItems);
  };

  return (
    <Box className="ct-basic-info">
      <Box
        className={clsx({
          "ct-basic-info__row": true,
          "ct-basic-info__row--desktop": isDesktop,
        })}
      >
        <Box
          className={clsx({
            "ct-basic-info__row-item": true,
            "ct-basic-info__row-first-item": true,
            "ct-basic-info__row-first-item--desktop": isDesktop,
          })}
        >
          <CTextfield
            label={BASIC_INFO.templateName}
            required={true}
            placeholder={BASIC_INFO.templateNamePlaceholder}
          />
        </Box>
        <Box
          className={clsx({
            "ct-basic-info__row-item": true,
            "ct-basic-info__row-first-item--desktop": isDesktop,
          })}
        >
          <CTextfield
            label={BASIC_INFO.description}
            placeholder={BASIC_INFO.descriptionPlaceholder}
          />
        </Box>
      </Box>

      <Box
        className={clsx({
          "ct-basic-info__row": true,
          "ct-basic-info__row--desktop": isDesktop,
        })}
      >
        <Box className="ct-basic-info__row-item ct-basic-info__row-first-item">
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
        <Box
          className={clsx({
            "ct-basic-info__row-item": true,
            "ct-basic-info__row-item-tags--desktop": isDesktop,
          })}
        >
          <Box className="ct-basic-info__row-item-label">{BASIC_INFO.tags}</Box>
          <CMultiSelectWithChip
            name="tags"
            options={basicTagsSampleData}
            placeholder={BASIC_INFO.tagsPlaceholder}
            onDelete={handleTagsDelete}
            onChange={() => {}}
            isInputVisible={false}
            className={clsx({
              "ct-basic-info__row-item-tags-dropdown": true,
              "ct-basic-info__row-item-tags-dropdown--desktop": isDesktop,
            })}
            width="100%"
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: 200 }}
            menuWidth={"300px"}
          />
        </Box>
      </Box>

      <Box className="ct-basic-info__row">
        <Box className="ct-basic-info__row-item ct-basic-info__dropdown-container">
          <Box
            className={clsx({
              "ct-basic-info__label": true,
              "required-icon": true,
            })}
          >
            {BASIC_INFO.directory}
          </Box>
          <Box className="ct-basic-info__dropdown-row">
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
