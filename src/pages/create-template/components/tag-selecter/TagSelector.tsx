import React, { useMemo } from "react";

import CMultiSelectWithChip from "@/core/components/multi-select-chip/MultiSelectWithChip";
import { isNonEmptyValue } from "@/utils";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";
import type {
  ExtendedTagOption,
  TemplateTagsProps,
} from "@/pages/create-template/types/questions.type";
import type { TagSelectorProps } from "@/pages/create-template/types/tagSelector.type";
import { useGetTaskTagsOptions } from "@/pages/template-library/services/template-library-api-hooks";

/**
 * @method findTagPath
 * @description Finds the complete path (breadcrumb) of a tag or attribute by ID with filterPath
 * @param {number | string} searchId - The tagId or attributeId to search for
 * @param {Array} tagOptions - Array of tag options to search through
 * @return {Object | null} Object containing parent tag, attribute info and filterPath, or null if not found
 */
const findTagPath = (
  searchId: number | string,
  tagOptions: ExtendedTagOption[]
): ExtendedTagOption | NestedMenuItem | null => {
  for (const tag of tagOptions) {
    // Check if searchId matches tagId
    if (
      tag.tagId === Number(searchId) ||
      String(tag.tagId) === String(searchId)
    ) {
      return tag;
    }

    // Check if searchId matches any attributeId
    if (tag.subMenu?.items) {
      const foundAttribute = tag.subMenu.items.find(
        (attr) =>
          attr.value === String(searchId) ||
          Number(attr.value) === Number(searchId)
      );

      if (foundAttribute) return foundAttribute;
    }
  }
  return null;
};

/**
 * @method getTagsValueForMultiSelect
 * @description Transforms the tags from form values into the format required for the multi-select component, including filterPath for display
 * @param {Array} tags - Array of tags from form values
 * @param {Array} tagOptions - Array of tag options to search through
 * @return {Array} Transformed array of tags with label, value, and filterPath for multi-select options
 */
const getTagsValueForMultiSelect = (
  tags: TemplateTagsProps[],
  tagOptions: ExtendedTagOption[]
): NestedMenuItem[] => {
  if (!isNonEmptyValue(tags)) return [];
  return tags.map((tag): NestedMenuItem => {
    const tagPath = findTagPath(tag?.attributeId || tag?.tagId, tagOptions);
    return {
      label: tag?.tagName || "",
      value: String(tag?.tagId),
      filterPath: tagPath?.filterPath || tag?.tagName || "",
      ...tag,
    };
  });
};

const TagSelector: React.FC<TagSelectorProps> = React.memo(
  ({
    label,
    placeholder,
    value,
    onChange,
    onDelete,
    className,
    anchorOrigin,
    transformOrigin,
    menuWidth,
    menuHeight,
  }) => {
    const { data: taskTagsOptions } = useGetTaskTagsOptions();

    // Transform tag options with useMemo to avoid recalculation on every render
    const tagOptions = useMemo((): ExtendedTagOption[] => {
      if (!taskTagsOptions?.data?.length) {
        return [];
      }

      return taskTagsOptions.data.map((item) => ({
        ...item,
        label: item?.tagValue || "",
        value: String(item?.tagId),
        filterPath: item?.tagValue || "",
        subMenu: {
          items:
            (item?.attributes?.map((attr) => ({
              label: attr?.attributeValue || "",
              value: String(attr?.attributeId),
              filterPath: `${item?.tagValue || ""} > ${attr?.attributeValue || ""}`,
              tagId: item?.tagId,
              tagValue: item?.tagValue,
              ...attr,
            })) as NestedMenuItem[]) || [],
        },
      }));
    }, [taskTagsOptions?.data]);

    // Memoize transformed values to avoid recalculation
    const transformedValue = useMemo(
      () => getTagsValueForMultiSelect(value || [], tagOptions),
      [value, tagOptions]
    );

    return (
      <CMultiSelectWithChip
        label={label}
        name="tags"
        options={tagOptions}
        value={transformedValue}
        placeholder={placeholder}
        onDelete={onDelete}
        onChange={onChange}
        className={className}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        menuWidth={menuWidth}
        menuHeight={menuHeight}
      />
    );
  }
);

export default TagSelector;
