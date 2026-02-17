import React, { useCallback } from "react";
import {
  Controller,
  type FieldValues,
  type ControllerRenderProps,
} from "react-hook-form";
import { Box } from "@mui/material";

import CMultiSelectWithChip from "@/core/components/multi-select-chip/MultiSelectWithChip";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { basicTagsSampleData } from "@/pages/create-template/constants/sampleData";
import type { TagsTabProps } from "@/pages/create-template/types/questions.type";

import "../AdvanceTab.scss";

const TagsTab: React.FC<TagsTabProps> = ({ questionFormPath, control }) => {
  const { ADVANCED_TAB_OPTIONS } = useCreateTemplateTranslations();

  const handleTagsDelete = useCallback(
    (
      field: ControllerRenderProps<FieldValues, string>,
      data: NestedMenuItem
    ): void => {
      const currentValue = (field.value as NestedMenuItem[]) || [];
      const updatedValue = currentValue.filter(
        (item) => item?.value !== data?.value
      );
      field.onChange(updatedValue);
    },
    []
  );

  return (
    <Box className="advance-tab__section">
      <Box className="advance-tab__section-wrapper">
        <Controller
          name={`${questionFormPath}.questionAdvancedSettings.tags`}
          control={control}
          render={({ field }) => (
            <CMultiSelectWithChip
              value={(field.value as NestedMenuItem[]) || []}
              label={ADVANCED_TAB_OPTIONS.TAGS.tagsLabel}
              name="tags"
              options={basicTagsSampleData}
              placeholder={ADVANCED_TAB_OPTIONS.TAGS.tagsPlaceholder}
              onDelete={(_: React.MouseEvent, data: NestedMenuItem): void =>
                handleTagsDelete(field, data)
              }
              onChange={(event): void => {
                const selectedItems = event.target
                  .value as unknown as NestedMenuItem[];
                field.onChange(selectedItems);
              }}
              isInputVisible={false}
              width="100%"
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: 200 }}
              menuWidth="300px"
            />
          )}
        />
      </Box>
    </Box>
  );
};
export default TagsTab;
