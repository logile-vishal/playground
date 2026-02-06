import { useMemo } from "react";

import { CButton } from "@/core/components/button/button";
import CTextfield from "@/core/components/form/textfield/Textfield";
import CSelect from "@/core/components/form/select/Select";
import { useIsDesktopViewport } from "@/utils/get-viewport-size";
import clsx from "@/utils/clsx";
import CMultiSelectWithChip from "@/core/components/multi-select-chip/MultiSelectWithChip";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";

import {
  useGetQuestionTagsOptions,
  useGetTaskTagsOptions,
  useGetTaskTypesOptions,
} from "../../services/template-library-api-hooks";
import type {
  TagOptionsType,
  TaskTypeOptions,
} from "../../types/template-library.type";
import { TEMPLATE_SEARCH_BAR as TEMPLATE_SEARCH_BAR_CONSTANTS } from "../../constants/constant";
import "./AdvanceFilterContent.scss";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
import { useTemplateLibraryTranslations } from "../../translation/useTemplateLibraryTranslations";
import type { AdvanceFilterContentProps } from "../../types/TemplateSearchbar.type";
import { checkObjectHaveValues } from "../../utils/checkObjectHaveValues";

const AdvanceFilterContent = (props: AdvanceFilterContentProps) => {
  const { GENERAL } = useCommonTranslation();
  const { TEMPLATE_SEARCH_BAR } = useTemplateLibraryTranslations();
  const {
    onFilterChange,
    onClearFilter,
    onFilterSubmit,
    filter,
    isFilterDataLoading,
  } = props;
  const isDesktop = useIsDesktopViewport();

  const { data: taskTypeOptions } = useGetTaskTypesOptions();
  const { data: taskTagsOptions } = useGetTaskTagsOptions();
  const { data: questionTagsOptions } = useGetQuestionTagsOptions();

  const taskTypeOptionsList = useMemo(() => {
    return taskTypeOptions?.data?.map((item: TaskTypeOptions) => ({
      label: item?.typeName,
      value: item?.typeId,
      name: item?.typeName,
    }));
  }, [taskTypeOptions]);

  const taskTagsOptionsList: NestedMenuItem[] = useMemo(() => {
    return taskTagsOptions?.data?.map((item: TagOptionsType) => ({
      label: item?.tagValue,
      value: String(item?.tagId),
      name: item?.tagValue,
    }));
  }, [taskTagsOptions]);

  const questionTagsOptionsList: NestedMenuItem[] = useMemo(() => {
    return questionTagsOptions?.data?.map(
      (item: TagOptionsType) =>
        ({
          label: item?.tagValue,
          value: String(item?.tagId),
          name: item?.tagValue,
        }) as NestedMenuItem
    );
  }, [questionTagsOptions]);

  return (
    <div
      className={clsx({
        "advance-filter-content": true,
        "advance-filter-content--mobile": !isDesktop,
      })}
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="advance-filter-content__fields-layout">
        <div className="advance-filter-content__group-1">
          <CTextfield
            isInlineLabel
            labelPlacement="row"
            label={TEMPLATE_SEARCH_BAR.FILTER_LABELS.questionText}
            placeholder={TEMPLATE_SEARCH_BAR.FILTER_PLACEHOLDERS.questionText}
            onChange={(event) =>
              onFilterChange(
                TEMPLATE_SEARCH_BAR_CONSTANTS.FILTER_NAMES.questionText,
                event.target.value
              )
            }
            onKeyDown={(e) => e.stopPropagation()}
            value={filter?.questionText}
          />
          <div className="advance-filter-content__modified-in-last">
            <CTextfield
              isInlineLabel
              label={TEMPLATE_SEARCH_BAR.FILTER_LABELS.modifiedInLast}
              fullWidth
              className="advance-filter-content__modified-in-last-input"
              type="number"
              placeholder={
                TEMPLATE_SEARCH_BAR.FILTER_PLACEHOLDERS.modifiedInLast
              }
              onChange={(event) =>
                onFilterChange(
                  TEMPLATE_SEARCH_BAR_CONSTANTS.FILTER_NAMES.modifiedInLastDays,
                  event.target.value
                )
              }
              value={filter?.modifiedInLastDays}
            />

            <div className="advance-filter-content__modified-in-last-days-label">
              {
                TEMPLATE_SEARCH_BAR.ADVANCED_FILTER
                  .modifiedInLastDaysAdditionalLabel
              }
            </div>
          </div>
        </div>
        <div className="advance-filter-content__group-2">
          <CSelect
            isInlineLabel
            className={"advance-filter-content__task-type-dropdown"}
            label={TEMPLATE_SEARCH_BAR.FILTER_LABELS.taskType}
            options={taskTypeOptionsList ?? []}
            placeholder={TEMPLATE_SEARCH_BAR.FILTER_PLACEHOLDERS.taskType}
            onChange={(event) =>
              onFilterChange(
                TEMPLATE_SEARCH_BAR_CONSTANTS.FILTER_NAMES.taskType,
                taskTypeOptionsList.find(
                  (option) => option.value === event.target.value
                )
              )
            }
            value={filter?.taskType}
            optionLabelKey={"label"}
            optionValueKey={"value"}
          ></CSelect>

          <CSelect
            isInlineLabel
            allowMultiSelect
            className={"advance-filter-content__status-dropdown"}
            label={TEMPLATE_SEARCH_BAR.FILTER_LABELS.statusList}
            options={TEMPLATE_SEARCH_BAR.FILTER_DROPDOWNS.TASK_STATUS}
            placeholder={TEMPLATE_SEARCH_BAR.FILTER_PLACEHOLDERS.statusList}
            onChange={(event) =>
              onFilterChange(
                TEMPLATE_SEARCH_BAR_CONSTANTS.FILTER_NAMES.statusList,
                event.target.value.map((item) =>
                  TEMPLATE_SEARCH_BAR.FILTER_DROPDOWNS.TASK_STATUS.find(
                    (status) => status.value === item
                  )
                )
              )
            }
            value={filter?.statusList ?? []}
            optionLabelKey="label"
            optionValueKey="value"
          ></CSelect>
        </div>
        <div className="advance-filter-content__group-3">
          <CMultiSelectWithChip
            isInLineLabel
            options={taskTagsOptionsList ?? []}
            placeholder={TEMPLATE_SEARCH_BAR.FILTER_PLACEHOLDERS.taskTagsList}
            label={TEMPLATE_SEARCH_BAR.FILTER_LABELS.taskTagsList}
            value={filter?.taskTagsList}
            onDelete={() => {}}
            onChange={(event) =>
              onFilterChange(
                TEMPLATE_SEARCH_BAR_CONSTANTS.FILTER_NAMES.taskTagsList,
                event.target.value
              )
            }
          />
          <CMultiSelectWithChip
            isInLineLabel
            value={filter?.questionTagsList}
            onDelete={() => {}}
            options={questionTagsOptionsList ?? []}
            placeholder={
              TEMPLATE_SEARCH_BAR.FILTER_PLACEHOLDERS.questionTagsList
            }
            label={TEMPLATE_SEARCH_BAR.FILTER_LABELS.questionTagsList}
            onChange={(event) =>
              onFilterChange(
                TEMPLATE_SEARCH_BAR_CONSTANTS.FILTER_NAMES.questionTagsList,
                event.target.value
              )
            }
          />
        </div>
      </div>
      <div className="advance-filter-content__action-btns">
        <CButton
          className={clsx({
            "advance-filter-content__action-btns-clearall": true,
            "advance-filter-content__action-btns-clearall--focus":
              checkObjectHaveValues(filter),
          })}
          severity="primary"
          variant="text"
          size="large"
          onClick={onClearFilter}
        >
          {GENERAL.clearAllButtonLabel}
        </CButton>
        <CButton
          className="advance-filter-content__action-btns-apply"
          severity="primary"
          variant="solid"
          size="large"
          onClick={onFilterSubmit}
          disabled={!checkObjectHaveValues(filter)}
        >
          {isFilterDataLoading
            ? GENERAL.loadingText
            : GENERAL.searchButtonLabel}
        </CButton>
      </div>
    </div>
  );
};

export default AdvanceFilterContent;
