import React, { useCallback } from "react";
import {
  Controller,
  type FieldValues,
  type ControllerRenderProps,
} from "react-hook-form";
import { Box } from "@mui/material";

import type { NestedMenuItem } from "@/core/components/nested-menu/types";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import TagSelector from "@/pages/create-template/components/tag-selecter/TagSelector";
import type {
  TagsTabProps,
  TemplateTagsProps,
} from "@/pages/create-template/types/questions.type";

import "../AdvanceTab.scss";

export const TagsTab: React.FC<TagsTabProps> = ({
  questionFormPath,
  control,
}) => {
  const { ADVANCED_TAB_OPTIONS } = useCreateTemplateTranslations();

  const handleTagsDelete = useCallback(
    (
      field: ControllerRenderProps<FieldValues, string>,
      data: NestedMenuItem
    ): void => {
      const currentValue = (field.value as TemplateTagsProps[]) || [];
      const updatedValue = currentValue.filter(
        (item) => String(item?.tagId) !== data?.value
      );
      field.onChange(updatedValue);
    },
    []
  );

  const handleTagsChange = useCallback(
    (
      field: ControllerRenderProps<FieldValues, string>,
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const selectedItems = event.target.value as unknown as NestedMenuItem[];
      const arr: TemplateTagsProps[] = [];

      selectedItems.forEach((item) => {
        const itemAny = item as unknown as Record<string, unknown>;
        const tagId = (itemAny.tagId as number) || Number(item.value);
        const attributeId = itemAny.attributeId as number | null;

        arr.push({
          tagId: tagId,
          tagName: item.label || "",
          attributeId: attributeId || null,
          attributeName:
            (itemAny.attributeName as string) ||
            (itemAny.attributeValue as string) ||
            null,
        });
      });

      field.onChange(arr);
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
            <TagSelector
              label={ADVANCED_TAB_OPTIONS.TAGS.tagsLabel}
              placeholder={ADVANCED_TAB_OPTIONS.TAGS.tagsPlaceholder}
              value={(field.value as TemplateTagsProps[]) || []}
              onChange={(event): void => handleTagsChange(field, event)}
              onDelete={(_: React.MouseEvent, data: NestedMenuItem): void =>
                handleTagsDelete(field, data)
              }
              className=""
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
