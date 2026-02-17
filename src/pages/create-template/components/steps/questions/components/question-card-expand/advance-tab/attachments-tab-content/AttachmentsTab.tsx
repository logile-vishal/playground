import React, { useMemo, useCallback } from "react";
import {
  Controller,
  useWatch,
  type FieldValues,
  type ControllerRenderProps,
} from "react-hook-form";
import { Box } from "@mui/material";

import CSwitch from "@/core/components/form/switch/Switch";
import CSelect from "@/core/components/form/select/Select";
import CDivider from "@/core/components/divider/Divider";
import CSvgIcon from "@/core/components/icon/Icon";
import { Attachment, Photo } from "@/core/constants/icons";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import type {
  AttachmentsTabProps,
  QuestionOption,
} from "@/pages/create-template/types/questions.type";
import { ATTACHMENTS_DEFAULT } from "@/pages/create-template/constants/question-type-default";
import { QUESTION_TYPES_WITH_OPTIONS } from "@/pages/create-template/constants/constant";
import type { CreateTemplateFormType } from "@/pages/create-template/form-schema/create-template-form-schema";

import "../AdvanceTab.scss";
import { QUESTION_TYPE } from "@/pages/create-template/constants/questions";

const AttachmentsTab: React.FC<AttachmentsTabProps> = ({
  questionFormPath,
  control,
  question,
}) => {
  const { setFormValue } = useCreateTemplateForm();
  const {
    ADVANCED_TAB_OPTIONS,
    ADVANCED_TAB_FILE_TYPES,
    ADVANCED_TAB_FILE_REQUIRED_FOR_OPTIONS,
    ADVANCED_TAB_FILE_REQUIRED_FOR_OPTIONS_MULTISELECT,
  } = useCreateTemplateTranslations();

  const isFileAttachmentEnabled = useWatch({
    control,
    name: `${questionFormPath}.questionAdvancedSettings.fileAttachments.isApplicable` as keyof FieldValues,
  });

  const specificRequiredAnswerValue = useWatch({
    control,
    name: `${questionFormPath}.questionAdvancedSettings.fileAttachments.attachments.requiredType` as keyof FieldValues,
  });

  const currentQuestionOptions = useMemo((): QuestionOption[] => {
    if (!question.questionBasicData) {
      return [];
    }

    const questionType = question.questionBasicData.questionType;

    const hasOptions = QUESTION_TYPES_WITH_OPTIONS.includes(
      questionType as (typeof QUESTION_TYPES_WITH_OPTIONS)[number]
    );

    if (!hasOptions) {
      return [];
    }

    const responseArray = question.questionBasicData.response || [];

    if (Array.isArray(responseArray)) {
      return responseArray.map(
        (item: Record<string, unknown>, idx: number) => ({
          label:
            (item.title as string) ||
            (item.label as string) ||
            `Option ${idx + 1}`,
          value:
            (item.optionId as string) ||
            (item.value as string) ||
            (item.title as string) ||
            `option-${idx}`,
          optionId: item.optionId as string | undefined,
          title: item.title as string | undefined,
        })
      );
    }

    return [];
  }, [question.questionBasicData]);

  const fileTypeOptions = useMemo(
    () => [
      {
        label: ADVANCED_TAB_FILE_TYPES[0].label,
        value: ADVANCED_TAB_FILE_TYPES[0].value,
        labelStartIcon: <CSvgIcon component={Photo} />,
      },
      {
        label: ADVANCED_TAB_FILE_TYPES[1].label,
        value: ADVANCED_TAB_FILE_TYPES[1].value,
        labelStartIcon: <CSvgIcon component={Attachment} />,
      },
    ],
    [ADVANCED_TAB_FILE_TYPES]
  );

  const handleFileAttachmentToggle = useCallback(
    (
      checked: boolean,
      field: ControllerRenderProps<FieldValues, string>
    ): void => {
      field.onChange(checked);
      if (!checked) {
        setFormValue(
          `${questionFormPath}.questionAdvancedSettings.fileAttachments.attachments` as keyof CreateTemplateFormType,
          {
            attachmentType: null,
            requiredType: null,
            selectedOption: null,
          } as CreateTemplateFormType
        );
      } else {
        setFormValue(
          `${questionFormPath}.questionAdvancedSettings.fileAttachments.attachments` as keyof CreateTemplateFormType,
          ATTACHMENTS_DEFAULT as CreateTemplateFormType
        );
      }
    },
    [questionFormPath, setFormValue]
  );

  return (
    <Box className="advance-tab__section">
      <Box className="advance-tab__field-group">
        <Box className="advance-tab__section-wrapper">
          <Controller
            name={`${questionFormPath}.questionAdvancedSettings.fileAttachments.isApplicable`}
            control={control}
            render={({ field }) => (
              <CSwitch
                label={
                  ADVANCED_TAB_OPTIONS.FILE_ATTACHMENT.fileAttachmentToggleLabel
                }
                className="advance-tab__toggle-field"
                checked={field.value || false}
                onChange={(e): void => {
                  handleFileAttachmentToggle(Boolean(e.target.value), field);
                }}
              />
            )}
          />
        </Box>
        <CDivider orientation="horizontal" />
        <Box className="advance-tab__attachment-content">
          {isFileAttachmentEnabled && (
            <>
              <Controller
                name={`${questionFormPath}.questionAdvancedSettings.fileAttachments.attachments.attachmentType`}
                control={control}
                render={({ field }) => (
                  <CSelect
                    {...field}
                    value={field.value || ADVANCED_TAB_FILE_TYPES[0].value}
                    onChange={(e): void => {
                      field.onChange(e);
                    }}
                    label={
                      ADVANCED_TAB_OPTIONS.FILE_ATTACHMENT
                        .fileAttachmentTypeLabel
                    }
                    optionValueKey="value"
                    optionLabelKey="label"
                    options={fileTypeOptions}
                  />
                )}
              />

              <Controller
                name={`${questionFormPath}.questionAdvancedSettings.fileAttachments.attachments.requiredType`}
                control={control}
                render={({ field }) => (
                  <CSelect
                    {...field}
                    value={
                      field.value ||
                      (question.questionBasicData.questionType ===
                        QUESTION_TYPE.RADIO ||
                      question.questionBasicData.questionType ===
                        QUESTION_TYPE.DROPDOWN ||
                      question.questionBasicData.questionType ===
                        QUESTION_TYPE.CHECKBOX ||
                      question.questionBasicData.questionType ===
                        QUESTION_TYPE.DYNAMIC_DROPDOWN
                        ? ADVANCED_TAB_FILE_REQUIRED_FOR_OPTIONS_MULTISELECT[0]
                            .value
                        : ADVANCED_TAB_FILE_REQUIRED_FOR_OPTIONS[0].value)
                    }
                    onChange={(e): void => {
                      field.onChange(e);
                    }}
                    label={
                      ADVANCED_TAB_OPTIONS.FILE_ATTACHMENT
                        .fileAttachmentRequiredForLabel
                    }
                    optionValueKey="value"
                    optionLabelKey="label"
                    options={
                      question.questionBasicData.questionType ===
                        QUESTION_TYPE.RADIO ||
                      question.questionBasicData.questionType ===
                        QUESTION_TYPE.DROPDOWN ||
                      question.questionBasicData.questionType ===
                        QUESTION_TYPE.CHECKBOX ||
                      question.questionBasicData.questionType ===
                        QUESTION_TYPE.DYNAMIC_DROPDOWN
                        ? ADVANCED_TAB_FILE_REQUIRED_FOR_OPTIONS_MULTISELECT
                        : ADVANCED_TAB_FILE_REQUIRED_FOR_OPTIONS
                    }
                  />
                )}
              />
            </>
          )}
          {specificRequiredAnswerValue &&
            specificRequiredAnswerValue ===
              ADVANCED_TAB_FILE_REQUIRED_FOR_OPTIONS_MULTISELECT[4].value && (
              <Controller
                name={`${questionFormPath}.questionAdvancedSettings.fileAttachments.attachments.selectedOption.title`}
                control={control}
                render={({ field }) => (
                  <CSelect
                    {...field}
                    onChange={(e): void => {
                      field.onChange(e);
                    }}
                    value={field.value || ""}
                    label={
                      ADVANCED_TAB_OPTIONS.FILE_ATTACHMENT
                        .fileAttachmentAnswerLabel
                    }
                    placeholder={
                      ADVANCED_TAB_OPTIONS.FILE_ATTACHMENT
                        .fileAttachmentAnswerPlaceholder
                    }
                    optionValueKey="value"
                    optionLabelKey="label"
                    options={currentQuestionOptions}
                  />
                )}
              />
            )}
        </Box>
      </Box>
    </Box>
  );
};
export default AttachmentsTab;
