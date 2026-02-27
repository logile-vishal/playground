import React, { useState, useCallback } from "react";
import { Box, InputAdornment, Tooltip } from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  DateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import CSvgIcon, { type SvgIconComponent } from "@/core/components/icon/Icon";
import {
  Attachment,
  AttachmentRequired,
  CalendarBlank,
  Camera,
  CameraRequired,
  InfoCircle,
} from "@/core/constants/icons";
import CCheckbox from "@/core/components/form/checkbox/Checkbox";
import clsx from "@/utils/clsx";
import type {
  DatePickerProps,
  RenderButtonContainerProps,
  RenderCheckboxProps,
  RenderAttachmentProps,
  RenderTextFieldProps,
} from "../../types/template-preview.type";
import {
  TEMPLATE_TYPE,
  QUESTION_ATTACHMENT_TYPE,
} from "../../constants/constant";
import type {
  AnswerType,
  AttachmentType,
  QuestionType,
} from "../../types/template-questions.type";
import { useTemplateLibraryTranslations } from "../../translation/useTemplateLibraryTranslations";
import {
  getPreviewButtonConfig,
  getQuestionAttachment,
  getQuestionTypes,
  getUserInputTypes,
} from "../template-libarary-config/TemplatePreviewConfig";
import CTextarea from "@/core/components/form/textarea/Textarea";
import CTextfield from "@/core/components/form/textfield/Textfield";
import CSelect from "@/core/components/form/select";
import CRadio from "@/core/components/form/radio/Radio";

// Utility: Get placeholder text for dropdowns
const getDropdownPlaceholder = (
  placeholder: string | undefined,
  PLACEHOLDER_TEXT: Record<string, string>
): string => placeholder || PLACEHOLDER_TEXT.selectOption;

// Utility: Get icon for attachment requirement
const getAttachmentIcon = (
  question: unknown,
  option: { isCompliant?: boolean },
  type: string,
  requiredIcon: SvgIconComponent,
  defaultIcon: SvgIconComponent
): SvgIconComponent =>
  isIconRequired(question, option, type) ? requiredIcon : defaultIcon;

// Utility: Get icon size for camera
const getCameraIconSize = (
  question: unknown,
  option: { isCompliant?: boolean },
  type: string
): number => (isIconRequired(question, option, type) ? 19 : 16);

// Utility: Get showCameraIcon flag
const getShowCameraIcon = (
  question: { attachments?: AttachmentType[] },
  type: string
): boolean =>
  !!question?.attachments?.some(
    (item: AttachmentType) => item?.attachmentType === type
  );

// Utility: Get showAttachmentIcon flag
const getShowAttachmentIcon = (
  question: { attachments?: AttachmentType[] },
  type: string
): boolean =>
  !!question?.attachments?.some(
    (item: AttachmentType) => item?.attachmentType === type
  );

// Utility: Get translated tooltip for required info
const getRequiredInfoTooltip = (PLACEHOLDER_TEXT: Record<string, string>) => (
  <Box className="template-preview-modal__dropdown-menu-item-tooltip">
    {PLACEHOLDER_TEXT.requiredInfo || "Required Info"}
  </Box>
);

/**
 * @description Renders a read-only text field or textarea used for preview mode.
 */
export const RenderTextField: React.FC<RenderTextFieldProps> = ({
  multiline = false,
  rows = 1,
  width,
  ...props
}): React.ReactNode => {
  const { PLACEHOLDER_TEXT } = useTemplateLibraryTranslations();
  if (multiline) {
    return (
      <CTextarea
        disabled
        value=""
        className="template-preview-modal__common-textfield"
        placeholder={PLACEHOLDER_TEXT.enterDetails}
        minRows={rows}
        maxRows={rows}
        onChange={() => {}}
        {...props}
      />
    );
  }
  return (
    <CTextfield
      disabled
      value=""
      className="template-preview-modal__common-textfield"
      placeholder={PLACEHOLDER_TEXT.enterValue}
      onChange={() => {}}
      width={width}
      {...props}
    />
  );
};

/**
 * @component RenderDropdown
 * @description Renders a read-only dropdown preview.
 */
export const RenderDropdown: React.FC<{
  placeholder?: string;
  isDesktopPreview?: boolean;
  question?: QuestionType;
  QUESTION_ATTACHMENT?: Record<string, string>;
  QUESTION_TYPES?: Record<string, string>;
}> = ({
  placeholder,
  isDesktopPreview = true,
  question,
  QUESTION_ATTACHMENT,
  QUESTION_TYPES,
}): React.ReactNode => {
  const { PLACEHOLDER_TEXT } = useTemplateLibraryTranslations();
  const displayValue = getDropdownPlaceholder(placeholder, PLACEHOLDER_TEXT);
  const questionAttachmentConfig = getQuestionAttachment(QUESTION_ATTACHMENT);
  const questionTypesConfig = getQuestionTypes(QUESTION_TYPES);
  const showCameraIcon = getShowCameraIcon(
    question,
    questionAttachmentConfig.PHOTO.value
  );
  const dropdownOptions = (option) => {
    const cameraIcon = getAttachmentIcon(
      question,
      { isCompliant: option?.isCompliant },
      questionAttachmentConfig.PHOTO.value,
      CameraRequired,
      Camera
    );
    const iconSize = getCameraIconSize(
      question,
      { isCompliant: option?.isCompliant },
      questionAttachmentConfig.PHOTO.value
    );
    return (
      <Box
        className="template-preview-modal__dropdown-menu-item template-preview-modal__space-between"
        key={option?.option?.value}
      >
        <Box className="template-preview-modal__dropdown-menu-item">
          {question?.questionType === questionTypesConfig.CHECKBOX.value && (
            <RenderCheckbox />
          )}
          <Box>{option?.option?.value}</Box>
        </Box>
        <Box className="template-preview-modal__dropdown-menu-item">
          {option?.additionalInfo?.required && (
            <Tooltip title={getRequiredInfoTooltip(PLACEHOLDER_TEXT)}>
              <Box height={16}>
                <CSvgIcon
                  size={18}
                  component={InfoCircle}
                />
              </Box>
            </Tooltip>
          )}
          {showCameraIcon && (
            <Box height={16}>
              <CSvgIcon
                component={cameraIcon}
                size={iconSize}
              />
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <CSelect
      options={question.answers.map((option: AnswerType) => ({
        value: option.value,
        label: option.value,
      }))}
      value={displayValue}
      onChange={() => {}}
      placeholder={displayValue}
      className={clsx({
        "template-preview-modal__common-dropdown": true,
        "template-preview-modal__common-dropdown--mobile": !isDesktopPreview,
      })}
      templates={{
        inputValueTemplate: () => (
          <Box className="select__placeholder-text">{displayValue}</Box>
        ),
        menuItemTemplate: (option) => dropdownOptions(option),
      }}
    />
  );
};

/**
 * @component RenderCheckbox
 * @description Renders a read-only checkbox preview.
 */
export const RenderCheckbox: React.FC<RenderCheckboxProps> = ({
  isChecked = false,
}): React.ReactNode => (
  <CCheckbox
    className="template-preview-modal__common-checkbox"
    label=""
    checked={isChecked}
  />
);

/**
 * @component RenderButtonContainer
 * @description Renders a read-only action button style preview.
 */
export const RenderButtonContainer: React.FC<RenderButtonContainerProps> = ({
  label,
  icon,
}): React.ReactNode => (
  <div className="template-preview-modal__action-button">
    {icon && (
      <CSvgIcon
        component={icon}
        size={16}
        fill="var(--logile-text-white-dark-mode)"
      />
    )}
    <div>{label}</div>
  </div>
);

/**
 * @component RenderPicUpload
 * @description Renders a read-only photo upload UI preview.
 */
const RenderPicUpload: React.FC<RenderAttachmentProps> = ({
  isDesktopPreview,
}) => {
  return (
    <Box className="template-preview-modal__file-upload-wrapper">
      <Box className="label">Add photo(s) if desired</Box>
      <Box
        className={clsx({
          "upload-box": true,
          "template-preview-modal__upload--mobile": !isDesktopPreview,
        })}
      >
        <Box height={20}>
          <CSvgIcon
            component={Camera}
            size={20}
            fill="var(--logile-icon-secondary)"
          />
        </Box>
        <Box className="label">Take a photo or upload</Box>
      </Box>
    </Box>
  );
};

/**
 * @component RenderAttachement
 * @description Renders attachment preview buttons (photo & file options).
 */
const RenderAttachement: React.FC<RenderAttachmentProps> = ({
  question,
  isDesktopPreview,
  type,
  QUESTION_TYPES,
  ATTACHMENT_BUTTON_CONFIG,
}): React.ReactNode => {
  if (!question?.attachments || question?.attachments?.length === 0)
    return null;

  const questionTypesConfig = getQuestionTypes(QUESTION_TYPES);
  const previewButtonConfig = getPreviewButtonConfig(ATTACHMENT_BUTTON_CONFIG);

  return (
    <Box
      className={clsx({ "template-preview-modal__attachment-wrapper": true })}
    >
      {question?.attachments?.map((item) => {
        const itemLabel = previewButtonConfig[item?.attachmentType]?.label;
        const itemIcon: SvgIconComponent =
          previewButtonConfig[item?.attachmentType]?.icon;
        const showPicUpload =
          item.attachmentType === QUESTION_ATTACHMENT_TYPE.photo &&
          type === questionTypesConfig.RADIO_BUTTON.value;
        if (itemLabel && itemIcon)
          return (
            <Box
              key={item?.attachmentType}
              width={showPicUpload ? "100%" : "fit-content"}
            >
              {showPicUpload ? (
                <RenderPicUpload
                  question={question}
                  isDesktopPreview={isDesktopPreview}
                />
              ) : (
                <RenderButtonContainer
                  label={itemLabel}
                  icon={itemIcon}
                />
              )}
            </Box>
          );
        return null;
      })}
    </Box>
  );
};

/**
 * @method isIconRequired
 * @description Determines whether an icon should be required based on question attachments,
 * the selected option, and attachment type rules.
 */
const isIconRequired = (
  question: unknown,
  option: { isCompliant?: boolean },
  type: string
): boolean => {
  const attachments = (
    question as {
      attachments?: Array<{ attachmentType?: string; requiredType?: string }>;
    }
  )?.attachments;
  const RequiredType = attachments?.find(
    (item) => item?.attachmentType === type
  )?.requiredType;
  const isCompaliantType = RequiredType === "In compliance only";
  if (RequiredType === "Always") return true;
  if (option?.isCompliant && isCompaliantType) return true;
  return false;
};

/**
 * @component RenderDropdownQues
 * @description Renders dropdown answer UI with icons and attachment preview in template preview mode.
 */
export const RenderDropdownQues: React.FC<RenderAttachmentProps> = ({
  question,
  isDesktopPreview,
  templateBaseType,
  QUESTION_TYPES,
  QUESTION_ATTACHMENT,
  ATTACHMENT_BUTTON_CONFIG,
}): React.ReactNode => {
  useTemplateLibraryTranslations();
  const questionTypesConfig = getQuestionTypes(QUESTION_TYPES);

  return (
    <Box
      className={clsx({
        "template-preview-modal__answer-wrapper": true,
        "template-preview-modal__answer-wrapper--desktop": isDesktopPreview,
        "template-preview-modal__mobile": !isDesktopPreview,
        "template-preview-modal__answer-wrapper-grid--desktop":
          templateBaseType === TEMPLATE_TYPE.GRID && isDesktopPreview,
        "template-preview-modal__answer-wrapper-grid--mobile":
          templateBaseType === TEMPLATE_TYPE.GRID && !isDesktopPreview,
      })}
    >
      <RenderAttachement
        question={question}
        isDesktopPreview={isDesktopPreview}
        type={questionTypesConfig.DROPDOWN.value}
        QUESTION_TYPES={QUESTION_TYPES}
        ATTACHMENT_BUTTON_CONFIG={ATTACHMENT_BUTTON_CONFIG}
      />
      <RenderDropdown
        isDesktopPreview={isDesktopPreview}
        question={question}
        QUESTION_ATTACHMENT={QUESTION_ATTACHMENT}
        QUESTION_TYPES={QUESTION_TYPES}
      />
    </Box>
  );
};

/**
 * @component RenderCheckboxQues
 * @description Renders checkbox dropdown preview with required info tooltip and camera icon.
 */
export const RenderCheckboxQues: React.FC<RenderAttachmentProps> = ({
  question,
  isDesktopPreview,
  QUESTION_TYPES,
  QUESTION_ATTACHMENT,
  ATTACHMENT_BUTTON_CONFIG,
}): React.ReactNode => {
  const { PLACEHOLDER_TEXT } = useTemplateLibraryTranslations();
  const questionTypesConfig = getQuestionTypes(QUESTION_TYPES);
  const questionAttachmentConfig = getQuestionAttachment(QUESTION_ATTACHMENT);

  const showCameraIcon = getShowCameraIcon(
    question,
    questionAttachmentConfig.PHOTO.value
  );

  return (
    <Box
      className={clsx({
        "template-preview-modal__answer-wrapper": true,
        "template-preview-modal__mobile": !isDesktopPreview,
      })}
    >
      <RenderAttachement
        question={question}
        isDesktopPreview={isDesktopPreview}
        type={questionTypesConfig.DROPDOWN.value}
        QUESTION_TYPES={QUESTION_TYPES}
        ATTACHMENT_BUTTON_CONFIG={ATTACHMENT_BUTTON_CONFIG}
      />
      <Box className="template-preview-modal__radio-group">
        {question?.answers?.map((option) => (
          <Box
            key={option?.value}
            className="template-preview-modal__dropdown-menu-item template-preview-modal__space-between"
          >
            <CRadio
              checked={true}
              value={option?.value}
              label={option?.value}
              className="template-preview-modal__common-radio"
              disabled={false}
            />
            <Box className="template-preview-modal__dropdown-menu-item">
              {option?.additionalInfo?.required && (
                <Tooltip title={getRequiredInfoTooltip(PLACEHOLDER_TEXT)}>
                  <Box height={16}>
                    <CSvgIcon
                      size={18}
                      component={InfoCircle}
                    />
                  </Box>
                </Tooltip>
              )}
              {showCameraIcon && (
                <Box height={16}>
                  <CSvgIcon
                    component={Camera}
                    size={16}
                  />
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

/**
 * @component RenderRadioQues
 * @description Renders radio-type question preview with attachment-required indication.
 */
export const RenderRadioQues: React.FC<RenderAttachmentProps> = ({
  question,
  isDesktopPreview,
  QUESTION_TYPES,
  QUESTION_ATTACHMENT,
  ATTACHMENT_BUTTON_CONFIG,
}): React.ReactNode => {
  const questionTypesConfig = getQuestionTypes(QUESTION_TYPES);
  const questionAttachmentConfig = getQuestionAttachment(QUESTION_ATTACHMENT);

  const showAttachmentIcon = getShowAttachmentIcon(
    question,
    questionAttachmentConfig.ATTACHMENT.value
  );
  return (
    <Box className="template-preview-modal__answer-wrapper template-preview-modal__column">
      <Box>
        {question?.answers?.map((option) => {
          const attachmentIcon = getAttachmentIcon(
            question,
            option,
            questionAttachmentConfig.ATTACHMENT.value,
            AttachmentRequired,
            Attachment
          );
          return (
            <React.Fragment key={option?.value}>
              <CRadio
                checked={false}
                value={option?.value}
                label={option?.value}
                disabled={false}
              />
              {showAttachmentIcon && (
                <Box height={20}>
                  <CSvgIcon
                    component={attachmentIcon}
                    size={20}
                  />
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </Box>
      <Box
        width="100%"
        className={clsx({
          "template-preview-modal__mobile": !isDesktopPreview,
        })}
      >
        <RenderAttachement
          question={question}
          isDesktopPreview={isDesktopPreview}
          type={questionTypesConfig.RADIO_BUTTON.value}
          QUESTION_TYPES={QUESTION_TYPES}
          ATTACHMENT_BUTTON_CONFIG={ATTACHMENT_BUTTON_CONFIG}
        />
      </Box>
    </Box>
  );
};

/**
 * @component RenderUserInputQues
 * @description Renders read-only input-based question previews — single-line, multiline, date, or date-time fields.
 */
export const RenderUserInputQues: React.FC<RenderAttachmentProps> = ({
  question,
  isDesktopPreview,
  templateBaseType,
  QUESTION_TYPES,
  ATTACHMENT_BUTTON_CONFIG,
  DATE_INPUT_TYPE,
}): React.ReactNode => {
  const questionTypesConfig = getQuestionTypes(QUESTION_TYPES);
  const userInputTypesConfig = getUserInputTypes(DATE_INPUT_TYPE);

  const isMultiLine =
    question?.questionType === questionTypesConfig.LONG_USER_INPUT.value;
  return (
    <Box
      className={clsx({
        "template-preview-modal__answer-wrapper": true,
        "template-preview-modal__answer-wrapper--desktop":
          isDesktopPreview && !isMultiLine,
        "template-preview-modal__mobile": !isDesktopPreview || isMultiLine,
        "template-preview-modal__answer-wrapper-grid--desktop":
          templateBaseType === TEMPLATE_TYPE.GRID && isDesktopPreview,
        "template-preview-modal__answer-wrapper-grid--mobile":
          templateBaseType === TEMPLATE_TYPE.GRID && !isDesktopPreview,
      })}
    >
      <RenderAttachement
        question={question}
        isDesktopPreview={isDesktopPreview}
        type={questionTypesConfig.USER_INPUT.value}
        QUESTION_TYPES={QUESTION_TYPES}
        ATTACHMENT_BUTTON_CONFIG={ATTACHMENT_BUTTON_CONFIG}
      />
      <Box
        className={clsx({
          "template-preview-modal__user-input-wrapper--mobile":
            !isDesktopPreview,
        })}
      >
        {question?.inputType === userInputTypesConfig.DATE_AND_TIME.value ? (
          <RenderDatePicker
            type="datetime"
            isDesktopPreview={isDesktopPreview}
          />
        ) : question?.inputType === userInputTypesConfig.DATE.value ? (
          <RenderDatePicker
            type="date"
            isDesktopPreview={isDesktopPreview}
          />
        ) : (
          <RenderTextField
            multiline={isMultiLine}
            rows={isMultiLine ? 3 : 1}
            width={isMultiLine || !isDesktopPreview ? "100%" : "200px"}
          />
        )}
      </Box>
    </Box>
  );
};

/**
 * @component RenderDatePicker
 * @description Renders a disabled date or date-time picker preview with a calendar icon.
 */
export const RenderDatePicker: React.FC<DatePickerProps> = ({
  type = "date",
  placeholder,
  isDesktopPreview = true,
  value,
  onChange,
}): React.ReactNode => {
  const { PLACEHOLDER_TEXT } = useTemplateLibraryTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const Picker = type === "datetime" ? DateTimePicker : DatePicker;

  // Custom text field with calendar icon
  const renderField = useCallback(
    (params: RenderTextFieldProps) => {
      const isMultiline = params.multiline ?? false;
      const placeholderText =
        placeholder ||
        (type === "date"
          ? PLACEHOLDER_TEXT.selectDate
          : PLACEHOLDER_TEXT.selectDateTime);

      const commonProps = {
        ...params,
        placeholder: placeholderText,
        value: value ? value.toString() : "",
        onClick: () => setIsOpen((prev) => !prev),
        size: "small",
        fullwidth: !isDesktopPreview,
        InputProps: {
          ...params.InputProps,
          endAdornment: (
            <InputAdornment position="end">
              <CSvgIcon
                component={CalendarBlank}
                size={16}
                className="common-date-picker__textfield-icon"
              />
            </InputAdornment>
          ),
        },
        className: clsx({
          "common-date-picker__textfield": true,
          "common-date-picker__textfield--mobile": !isDesktopPreview,
        }),
      };

      if (isMultiline) {
        return <CTextarea {...commonProps} />;
      }
      return <CTextfield {...commonProps} />;
    },
    [placeholder, type, PLACEHOLDER_TEXT, value, isDesktopPreview]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Picker
        format=""
        enableAccessibleFieldDOMStructure={false}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        value={value}
        onChange={onChange}
        slotProps={{
          field: { clearable: true },
          popper: { className: "template-preview-modal__date-picker-popper" },
        }}
        slots={{ textField: renderField }}
      />
    </LocalizationProvider>
  );
};
