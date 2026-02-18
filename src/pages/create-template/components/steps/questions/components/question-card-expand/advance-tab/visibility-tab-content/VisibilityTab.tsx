import React, { useMemo, useCallback } from "react";
import {
  Controller,
  useWatch,
  type FieldValues,
  type ControllerRenderProps,
  type Path,
} from "react-hook-form";
import { Box, Typography } from "@mui/material";

import CSwitch from "@/core/components/form/switch/Switch";
import CSelect from "@/core/components/form/select/Select";
import CSvgIcon from "@/core/components/icon/Icon";
import CMultiSelectWithChip from "@/core/components/multi-select-chip/MultiSelectWithChip";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { ExclamationTriangle } from "@/core/constants/icons";
import { QUESTION_TYPES_WITH_OPTIONS } from "@/pages/create-template/constants/constant";
import { useGetClustersOptions } from "@/pages/create-template/services/createTemplateFormApiHooks";
import type {
  ClusterItem,
  QuestionOption,
  QuestionProps,
  VisibilityTabProps,
} from "@/pages/create-template/types/questions.type";
import type { CreateTemplateFormType } from "@/pages/create-template/form-schema/create-template-form-schema";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";

import WildcardLabel from "@/core/components/wildcard-label/WildcardLabel";
import "../AdvanceTab.scss";

const VisibilityTab: React.FC<VisibilityTabProps> = ({
  questionFormPath,
  control,
  questionIndex,
  question,
}) => {
  const { watch, setFormValue } = useCreateTemplateForm();
  const { ADVANCED_TAB_OPTIONS, ADVANCED_TAB_PREVIOUS_EXECUTION_STATUS } =
    useCreateTemplateTranslations();

  const watchQuestionList = watch("questions") as QuestionProps[];

  /* API */
  const { data: clusterDataOption } = useGetClustersOptions();

  const clusterDataOptionsList: NestedMenuItem[] = useMemo(() => {
    return (
      clusterDataOption?.data?.map(
        (item: ClusterItem) =>
          ({
            label: item?.clusterName,
            value: item?.clusterId,
            name: item?.clusterName,
            children:
              item?.clusterValues?.map((cv) => ({
                label: cv?.clusterValueName,
                value: cv?.clusterValueId,
                name: cv?.clusterValueName,
                parentValue: item?.clusterId,
                parentLabel: item?.clusterName,
              })) || [],
          }) as NestedMenuItem
      ) ?? []
    );
  }, [clusterDataOption]);

  const isStoreClusterEnabled = useWatch({
    control,
    name: `${questionFormPath}.questionAdvancedSettings.visibilityRule.storeClusters.isApplicable` as Path<FieldValues>,
  });

  const isPreviousAnswerEnabled = useWatch({
    control,
    name: `${questionFormPath}.questionAdvancedSettings.visibilityRule.basedOnPreviousAnswers.isApplicable` as keyof FieldValues,
  });

  const previousAnswerValue = useWatch({
    control,
    name: `${questionFormPath}.questionAdvancedSettings.visibilityRule.basedOnPreviousAnswers.previousAnswers.questionTitle` as keyof FieldValues,
  });

  const isRandomEnabled = useWatch({
    control,
    name: `${questionFormPath}.questionAdvancedSettings.visibilityRule.isRandom` as keyof FieldValues,
  });

  const isPreviousExecutionEnabled = useWatch({
    control,
    name: `${questionFormPath}.questionAdvancedSettings.visibilityRule.previousExecutionStatus.isApplicable` as keyof FieldValues,
  });

  const previousQuestionsListOptions = useMemo((): QuestionOption[] => {
    if (!watchQuestionList || watchQuestionList.length === 0) {
      return [];
    }

    return watchQuestionList
      .map((q, originalIndex) => ({
        q: q,
        originalIndex: originalIndex + 1, // Store the 1-based index
      }))
      .filter(({ q }) => q.qId !== question.qId)
      .filter(({ q }) =>
        QUESTION_TYPES_WITH_OPTIONS.includes(
          q.questionBasicData
            ?.questionType as (typeof QUESTION_TYPES_WITH_OPTIONS)[number]
        )
      )
      .map(({ q, originalIndex }) => ({
        label: `${originalIndex}. ${q.questionBasicData?.title || ""}`,
        value: q.qId,
      }))
      .filter((q) => q.label && q.value);
  }, [watchQuestionList, question.qId]);

  const selectedQuestionOptions = useMemo((): QuestionOption[] => {
    if (!previousAnswerValue || !watchQuestionList) {
      return [];
    }

    const selectedQuestion = watchQuestionList.find(
      (q) => q.qId === previousAnswerValue
    );

    if (!selectedQuestion) {
      return [];
    }

    const options = selectedQuestion?.questionBasicData?.response || [];

    return options.map((option: Record<string, unknown>) => ({
      label: (option.title as string) || "",
      value: (option.title as string) || "",
    }));
  }, [previousAnswerValue, watchQuestionList]);

  const handleStoreClusterToggle = useCallback(
    (
      checked: boolean,
      field: ControllerRenderProps<FieldValues, string>
    ): void => {
      field.onChange(checked);
      if (!checked) {
        setFormValue(
          `${questionFormPath}.questionAdvancedSettings.visibilityRule.storeClusters.clustersList` as keyof CreateTemplateFormType,
          []
        );
      }
    },
    [questionFormPath, setFormValue]
  );

  const handlePreviousAnswerToggle = useCallback(
    (
      checked: boolean,
      field: ControllerRenderProps<FieldValues, string>
    ): void => {
      field.onChange(checked);
      if (!checked) {
        setFormValue(
          `${questionFormPath}.questionAdvancedSettings.visibilityRule.basedOnPreviousAnswers.previousAnswers` as keyof CreateTemplateFormType,
          null
        );
        setFormValue(
          `${questionFormPath}.questionAdvancedSettings.visibilityRule.basedOnPreviousAnswers.answerOption` as keyof CreateTemplateFormType,
          null
        );
      }
    },
    [questionFormPath, setFormValue]
  );

  const handlePreviousExecutionToggle = useCallback(
    (
      checked: boolean,
      field: ControllerRenderProps<FieldValues, string>
    ): void => {
      field.onChange(checked);
      if (!checked) {
        setFormValue(
          `${questionFormPath}.questionAdvancedSettings.visibilityRule.previousExecutionStatus.status` as keyof CreateTemplateFormType,
          null
        );
      }
    },
    [questionFormPath, setFormValue]
  );

  const handleClusterDelete = useCallback(
    (
      field: ControllerRenderProps<FieldValues, string>,
      data: NestedMenuItem
    ): void => {
      const currentValue = (field.value as ClusterItem[]) || [];
      const updatedValue = currentValue.filter(
        (item) => item.clusterId !== data.value
      );
      field.onChange(updatedValue);
    },
    []
  );

  const isFirstQuestion = Number(questionIndex) === 1;

  return (
    <Box className="advance-tab__section">
      <Typography className="advance-tab__section-title">
        <CSvgIcon
          color="warning"
          component={ExclamationTriangle}
        />
        {ADVANCED_TAB_OPTIONS.VISIBILITY.visibilityNoteHeading}
        <span className="advance-tab__section-title-content">
          {ADVANCED_TAB_OPTIONS.VISIBILITY.visibilityNoteContent}
        </span>
      </Typography>

      <Box className="advance-tab__field-group">
        <Box className="advance-tab__field-group-item">
          <Controller
            name={`${questionFormPath}.questionAdvancedSettings.visibilityRule.storeClusters.isApplicable`}
            control={control}
            render={({ field }): React.ReactElement => (
              <CSwitch
                className="advance-tab__toggle-field"
                checked={field.value || false}
                label={ADVANCED_TAB_OPTIONS.VISIBILITY.storeClusterToggleLabel}
                onChange={(e): void =>
                  handleStoreClusterToggle(Boolean(e.target.value), field)
                }
              />
            )}
          />
          {isStoreClusterEnabled && (
            <Controller
              name={`${questionFormPath}.questionAdvancedSettings.visibilityRule.storeClusters.clustersList`}
              control={control}
              render={({ field }): React.ReactElement => {
                const displayValue: NestedMenuItem[] = Array.isArray(
                  field.value
                )
                  ? (field.value as ClusterItem[]).flatMap((item) => {
                      if (item.clusterValues && item.clusterValues.length > 0) {
                        return item.clusterValues.map((cv) => ({
                          label: cv.clusterValueName || "",
                          value: cv.clusterValueId || "",
                          name: cv.clusterValueName || "",
                          parentValue: cv.clusterId,
                          parentLabel: cv.clusterName || "",
                        }));
                      }
                      return [
                        {
                          label: item.clusterName || "",
                          value: item.clusterId || "",
                          name: item.clusterName || "",
                        },
                      ];
                    })
                  : [];

                return (
                  <CMultiSelectWithChip
                    value={displayValue}
                    label={ADVANCED_TAB_OPTIONS.VISIBILITY.storeClusterLabel}
                    name="clusters"
                    options={clusterDataOptionsList}
                    placeholder={
                      ADVANCED_TAB_OPTIONS.VISIBILITY.storeClusterPlaceholder
                    }
                    onChange={(event): void => {
                      const selectedValues = event.target
                        .value as unknown as Record<string, unknown>[];

                      const clusterMap = new Map<string, ClusterItem>();

                      selectedValues.forEach((item): void => {
                        const parentValue = item.parentValue as
                          | string
                          | undefined;
                        const parentLabel = item.parentLabel as
                          | string
                          | undefined;
                        const itemValue = item.value as string;
                        const itemLabel = item.label as string;

                        const isChildItem = Boolean(parentValue);
                        const parentClusterId = isChildItem
                          ? parentValue
                          : itemValue;
                        const parentClusterName = isChildItem
                          ? parentLabel
                          : itemLabel;

                        if (!parentClusterId) {
                          return;
                        }

                        if (!clusterMap.has(parentClusterId)) {
                          clusterMap.set(parentClusterId, {
                            clusterId: parentClusterId,
                            clusterName: parentClusterName ?? "",
                            clusterValues: [],
                          });
                        }

                        const cluster = clusterMap.get(parentClusterId);

                        if (!cluster) {
                          return;
                        }

                        // Only add to clusterValues if it's a child item
                        if (isChildItem && parentValue) {
                          const alreadyExists = cluster.clusterValues?.some(
                            (cv) => cv.clusterValueId === itemValue
                          );

                          if (!alreadyExists) {
                            cluster.clusterValues?.push({
                              clusterId: parentValue,
                              clusterName: parentLabel ?? "",
                              clusterValueId: itemValue,
                              clusterValueName: itemLabel,
                            });
                          }
                        }
                      });

                      const transformedItems: ClusterItem[] = Array.from(
                        clusterMap.values()
                      );

                      field.onChange(transformedItems);
                    }}
                    onDelete={(
                      _: React.MouseEvent,
                      data: NestedMenuItem
                    ): void => handleClusterDelete(field, data)}
                    width="100%"
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: 200 }}
                    menuWidth="300px"
                  />
                );
              }}
            />
          )}
        </Box>

        <Box className="advance-tab__field-group-item">
          <Controller
            name={`${questionFormPath}.questionAdvancedSettings.visibilityRule.basedOnPreviousAnswers.isApplicable`}
            control={control}
            render={({ field }): React.ReactElement => (
              <CSwitch
                className="advance-tab__toggle-field"
                checked={field.value || false}
                disabled={isFirstQuestion || Boolean(isRandomEnabled)}
                label={
                  ADVANCED_TAB_OPTIONS.VISIBILITY.previousAnswerToggleLabel
                }
                onChange={(e): void => {
                  handlePreviousAnswerToggle(Boolean(e.target.value), field);
                }}
              />
            )}
          />

          {isFirstQuestion && (
            <Typography className="advance-tab__warning">
              {
                ADVANCED_TAB_OPTIONS.VISIBILITY
                  .previousAnswerWarningOnPreviousAnswer
              }
            </Typography>
          )}

          {isPreviousAnswerEnabled && (
            <Controller
              name={`${questionFormPath}.questionAdvancedSettings.visibilityRule.basedOnPreviousAnswers.previousAnswers.questionTitle`}
              control={control}
              render={({ field }): React.ReactElement => (
                <CSelect
                  {...field}
                  onChange={(e): void => {
                    field.onChange(e);
                  }}
                  optionValueKey="value"
                  optionLabelKey="label"
                  templates={{
                    inputValueTemplate: (context) => {
                      return (
                        <WildcardLabel
                          label={context?.options[0]?.label || ""}
                          truncate={true}
                        />
                      );
                    },
                    menuItemTemplate: (option) => {
                      return (
                        <WildcardLabel
                          label={option.option.label}
                          truncate={true}
                        />
                      );
                    },
                  }}
                  placeholder={
                    ADVANCED_TAB_OPTIONS.VISIBILITY.previousQuestionPlaceholder
                  }
                  options={previousQuestionsListOptions}
                />
              )}
            />
          )}
          {previousAnswerValue && (
            <>
              <Typography className="advance-tab__warning">
                {
                  ADVANCED_TAB_OPTIONS.VISIBILITY
                    .previousAnswerWarningOnVisibility
                }
              </Typography>
              <Controller
                name={`${questionFormPath}.questionAdvancedSettings.visibilityRule.basedOnPreviousAnswers.answerOption`}
                control={control}
                render={({ field }): React.ReactElement => (
                  <CSelect
                    {...field}
                    value={field.value || ""}
                    onChange={(e): void => {
                      field.onChange(e);
                    }}
                    optionValueKey="value"
                    optionLabelKey="label"
                    placeholder={
                      ADVANCED_TAB_OPTIONS.VISIBILITY.previousAnswerPlaceholder
                    }
                    options={selectedQuestionOptions}
                  />
                )}
              />
            </>
          )}
        </Box>

        <Box className="advance-tab__field-group-item">
          <Controller
            name={`${questionFormPath}.questionAdvancedSettings.visibilityRule.isRandom`}
            control={control}
            render={({ field }): React.ReactElement => (
              <CSwitch
                className="advance-tab__toggle-field"
                label={
                  ADVANCED_TAB_OPTIONS.VISIBILITY.randomAppearanceToggleLabel
                }
                {...field}
                checked={field.value || false}
                disabled={Boolean(isPreviousAnswerEnabled)}
              />
            )}
          />

          {isPreviousAnswerEnabled && (
            <Typography className="advance-tab__warning">
              {ADVANCED_TAB_OPTIONS.VISIBILITY.randomAppearanceWarning}
            </Typography>
          )}
        </Box>

        <Box className="advance-tab__field-group-item">
          <Controller
            name={`${questionFormPath}.questionAdvancedSettings.visibilityRule.previousExecutionStatus.isApplicable`}
            control={control}
            render={({ field }): React.ReactElement => (
              <CSwitch
                className="advance-tab__toggle-field"
                label={
                  ADVANCED_TAB_OPTIONS.VISIBILITY.previousExecutionToggleLabel
                }
                checked={field.value || false}
                onChange={(e): void => {
                  handlePreviousExecutionToggle(Boolean(e.target.value), field);
                }}
              />
            )}
          />
          {isPreviousExecutionEnabled && (
            <Controller
              name={`${questionFormPath}.questionAdvancedSettings.visibilityRule.previousExecutionStatus.status`}
              control={control}
              render={({ field }): React.ReactElement => (
                <CSelect
                  {...field}
                  onChange={(e): void => {
                    field.onChange(e);
                  }}
                  label={ADVANCED_TAB_OPTIONS.VISIBILITY.previousExecutionLabel}
                  optionValueKey="value"
                  optionLabelKey="label"
                  placeholder={
                    ADVANCED_TAB_OPTIONS.VISIBILITY.previousExecutionPlaceholder
                  }
                  options={ADVANCED_TAB_PREVIOUS_EXECUTION_STATUS}
                />
              )}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default VisibilityTab;
