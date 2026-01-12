import React, { useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  TextField,
  FormControlLabel,
  Radio,
  InputAdornment,
  Tooltip,
} from "@mui/material";
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
  ChevronDown,
  InfoCircle,
} from "@/core/constants/icons";
import CCheckbox from "@/core/components/form/checkbox/Checkbox";
import clsx from "@/utils/clsx";
import type {
  DatePickerProps,
  RenderButtonContainerProps,
  RenderCheckboxProps,
  RenderAttachmentProps,
  RenderDropdownProps,
  RenderRadioProps,
  RenderTextFieldProps,
} from "../../types/template-preview.type";
import {
  getQuestionAttachment,
  getQuestionTypes,
  getPreviewButtonConfig,
  getUserInputTypes,
  TEMPLATE_TYPE,
  QUESTION_ATTACHMENT_TYPE,
} from "../../constants/constant";
import type {
  AnswerType,
  AttachmentType,
} from "../../types/template-questions.type";
import { useTemplateLibraryTranslations } from "../../translation/useTemplateLibraryTranslations";

/**
 * @description Renders a read-only Material UI TextField used for preview mode.
 * @param {object} props - Component props.
 * @param {boolean} [props.multiline=false] - Whether the text field is multiline.
 * @param {number} [props.rows=1] - Number of rows when multiline.
 * @param {string} [props.width] - Width of the text field.
 * @returns {ReactNode} return disabled text field placeholder.
 */
export const RenderTextField: React.FC<RenderTextFieldProps> = ({
  multiline = false,
  rows = 1,
  width,
  ...props
}) => {
  const { PLACEHOLDER_TEXT } = useTemplateLibraryTranslations();
  return (
    <TextField
      size="small"
      disabled
      value=""
      fullWidth
      className="template-preview-modal__common-textfield"
      placeholder={
        multiline ? PLACEHOLDER_TEXT.enterDetails : PLACEHOLDER_TEXT.enterValue
      }
      multiline={multiline}
      sx={{ width: width || "200px" }}
      rows={rows}
      {...props}
    />
  );
};

/**
 * @component RenderDropdown
 * @description Renders a read-only dropdown preview.
 * @param {object} props - Component props.
 * @param {string} [props.placeholder="Select Option"] - Placeholder value to display.
 * @param {boolean} [props.isDesktopPreview=true] - Controls mobile vs desktop styling.
 * @param {React.ReactNode} props.children - Dropdown options.
 * @returns {ReactNode} return disabled dropdown preview component.
 */
export const RenderDropdown: React.FC<RenderDropdownProps> = ({
  placeholder,
  isDesktopPreview = true,
  children,
}) => {
  const { PLACEHOLDER_TEXT } = useTemplateLibraryTranslations();
  return (
    <Select
      size="small"
      value={placeholder || PLACEHOLDER_TEXT.selectOption}
      className={clsx({
        "template-preview-modal__common-dropdown": true,
        "template-preview-modal__common-dropdown--mobile": !isDesktopPreview,
      })}
      IconComponent={() => (
        <CSvgIcon
          component={ChevronDown}
          className="template-preview-modal__common-dropdown-icon"
        />
      )}
      MenuProps={{ classes: { paper: "template-preview-modal__paper" } }}
      renderValue={() => (
        <Box className="template-preview__dropdown">
          {placeholder || PLACEHOLDER_TEXT.selectOption}
        </Box>
      )}
    >
      {children}
    </Select>
  );
};

/**
 * @component RenderCheckbox
 * @description Renders a read-only checkbox preview.
 * @param {object} props - Component props.
 * @param {boolean} [props.isChecked=false] - Whether the checkbox is checked.
 * @returns {ReactNode} return disabled checkbox preview.
 */
export const RenderCheckbox: React.FC<RenderCheckboxProps> = ({
  isChecked = false,
}) => {
  return (
    <CCheckbox
      className="template-preview-modal__common-checkbox"
      label=""
      checked={isChecked}
    />
  );
};

/**
 * @component RenderRadio
 * @description Renders a read-only radio button preview.
 * @param {object} props - Component props.
 * @param {string} props.label - Label displayed next to radio.
 * @param {string|number} props.value - Value of the radio option.
 * @returns {ReactNode} return disabled radio preview.
 */
export const RenderRadio: React.FC<RenderRadioProps> = ({ label, value }) => {
  return (
    <FormControlLabel
      value={value}
      className="template-preview-modal__common-radio"
      control={<Radio disabled />}
      label={label}
    />
  );
};

/**
 * @component RenderButtonContainer
 * @description Renders a read-only action button style preview.
 * @param {object} props - Component props.
 * @param {string} [props.label] - Text shown inside the button.
 * @param {IconName} [props.icon] - Icon to display inside the button.
 * @returns {ReactNode} return stylized read-only button preview.
 */
export const RenderButtonContainer: React.FC<RenderButtonContainerProps> = ({
  label,
  icon,
}) => {
  return (
    <div>
      <label className="template-preview-modal__action-button">
        {icon && (
          <CSvgIcon
            component={icon}
            size={16}
            fill="var(--logile-text-white-dark-mode)"
          />
        )}
        {label && <span>{label}</span>}
      </label>
    </div>
  );
};

/**
 * @component RenderPicUpload
 * @description Renders a read-only photo upload UI preview.
 * @param {object} props - Component props.
 * @param {boolean} props.isDesktopPreview - Controls mobile vs desktop layout.
 * @returns {ReactNode} return disabled photo upload placeholder.
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
 * @param {object} props - Component props.
 * @param {object} props.question - Question containing attachment list.
 * @param {boolean} props.isDesktopPreview - Layout control for responsiveness.
 * @param {string} props.type - Question type used to determine photo upload behavior.
 * @returns {ReactNode} return list of read-only attachment buttons.
 */
const RenderAttachement: React.FC<RenderAttachmentProps> = ({
  question,
  isDesktopPreview,
  type,
  QUESTION_TYPES,
  ATTACHMENT_BUTTON_CONFIG,
}) => {
  // to avoid unused styling if attachments are not present
  if (!question?.attachments || question?.attachments?.length == 0)
    return <></>;

  return (
    <Box
      className={clsx({ "template-preview-modal__attachment-wrapper": true })}
    >
      {question?.attachments?.map((item) => {
        const itemLabel = getPreviewButtonConfig(ATTACHMENT_BUTTON_CONFIG)[
          item?.attachmentType
        ]?.label;
        const itemIcon: SvgIconComponent = getPreviewButtonConfig(
          ATTACHMENT_BUTTON_CONFIG
        )[item?.attachmentType]?.icon;
        const showPicUpload =
          item.attachmentType === QUESTION_ATTACHMENT_TYPE.photo &&
          type === getQuestionTypes(QUESTION_TYPES).RADIO_BUTTON.value;
        if (itemLabel && itemIcon)
          return (
            <Box width={showPicUpload ? "100%" : "fit-content"}>
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
      })}
    </Box>
  );
};

/**
 * @method isIconRequired
 * @description Determines whether an icon should be required based on question attachments,
 * the selected option, and attachment type rules.
 * Rules:
 *  - If the attachment's requiredType is "Always", return true.
 *  - If requiredType is "In compliance only", return true only when option.isCompliant is true.
 *  - Otherwise return false.
 * @param {Object} question - The question object which may contain attachments.
 * @param {Object} option - The option selected for the question.
 * @param {boolean} option.isCompliant - Indicates whether the option is compliant.
 * @param {string} type - The attachment type to evaluate from the question.
 * @returns {boolean} - True if icon should be required, otherwise false.
 */
const isIconRequired = (question, option, type) => {
  const RequiredType = question?.attachments?.filter(
    (item) => item?.attachmentType == type
  )?.[0]?.requiredType;
  const isCompaliantType = RequiredType === "In compliance only";
  if (RequiredType === "Always") return true;
  else if (option?.isCompliant === isCompaliantType) return true;
  else return false;
};

/**
 * @component RenderDropdownQues
 * @description Renders dropdown answer UI with icons and attachment preview in template preview mode.
 * @param {object} props - Component props.
 * @param {QuestionType} props.question - Question data containing answers & attachment rules.
 * @param {boolean} [props.isDesktopPreview=false] - Indicates desktop mode UI layout.
 * @param {string} props.templateBaseType - Preview mode type (default or grid layout).
 * @returns {ReactNode} return dropdown UI with attachment requirement icons.
 */
export const RenderDropdownQues: React.FC<RenderAttachmentProps> = ({
  question,
  isDesktopPreview,
  templateBaseType,
  QUESTION_TYPES,
  QUESTION_ATTACHMENT,
  ATTACHMENT_BUTTON_CONFIG,
}) => {
  const showCameraIcon =
    question?.attachments?.length > 0
      ? question?.attachments?.filter(
          (item: AttachmentType) =>
            item?.attachmentType === QUESTION_ATTACHMENT_TYPE.photo
        )?.length > 0
      : false;

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
        type={getQuestionTypes(QUESTION_TYPES).DROPDOWN.value}
        QUESTION_TYPES={QUESTION_TYPES}
        ATTACHMENT_BUTTON_CONFIG={ATTACHMENT_BUTTON_CONFIG}
      />
      <RenderDropdown isDesktopPreview={isDesktopPreview}>
        {question?.answers?.map((option: AnswerType) => {
          const cameraIcon = isIconRequired(
            question,
            option,
            getQuestionAttachment(QUESTION_ATTACHMENT).PHOTO.value
          )
            ? CameraRequired
            : Camera;
          return (
            <MenuItem
              className="template-preview-modal__dropdown-menu-item template-preview-modal__space-between"
              key={option?.value}
              value={option?.value}
            >
              <Box className="template-preview-modal__dropdown-menu-item">
                {question?.questionType ===
                  getQuestionTypes(QUESTION_TYPES).CHECKBOX.value && (
                  <RenderCheckbox label={option?.value} />
                )}
                <Box>{option?.value}</Box>
              </Box>
              <Box className="template-preview-modal__dropdown-menu-item">
                {/* TODO: To removed static additional info */}
                {option?.additionalInfo?.required && (
                  <Tooltip
                    title={
                      <Box className="template-preview-modal__dropdown-menu-item-tooltip">
                        Required Info
                      </Box>
                    }
                  >
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
                      size={
                        isIconRequired(
                          question,
                          option,
                          getQuestionAttachment(QUESTION_ATTACHMENT).PHOTO.value
                        )
                          ? 19
                          : 16
                      }
                    />
                  </Box>
                )}
              </Box>
            </MenuItem>
          );
        })}
      </RenderDropdown>
    </Box>
  );
};

/**
 * @component RenderCheckboxQues
 * @description Renders checkbox dropdown preview with required info tooltip and camera icon.
 * @param {object} props - Component props.
 * @param {QuestionType} props.question - Main question containing options.
 * @param {boolean} [props.isDesktopPreview=false] - Applies desktop/mobile layout rules.
 * @returns {ReactNode} return checkbox answer preview UI.
 */
export const RenderCheckboxQues: React.FC<RenderAttachmentProps> = ({
  question,
  isDesktopPreview,
  QUESTION_TYPES,
  QUESTION_ATTACHMENT,
  ATTACHMENT_BUTTON_CONFIG,
}) => {
  const showCameraIcon =
    question?.attachments?.length > 0
      ? question?.attachments?.filter(
          (item: AttachmentType) =>
            item?.attachmentType ===
            getQuestionAttachment(QUESTION_ATTACHMENT).PHOTO.value
        )?.length > 0
      : false;
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
        type={getQuestionTypes(QUESTION_TYPES).DROPDOWN.value}
        QUESTION_TYPES={QUESTION_TYPES}
        ATTACHMENT_BUTTON_CONFIG={ATTACHMENT_BUTTON_CONFIG}
      />
      <RenderDropdown>
        {question?.answers?.map((option) => {
          return (
            <MenuItem
              className="template-preview-modal__dropdown-menu-item template-preview-modal__space-between"
              key={option?.value}
              value={option?.value}
            >
              <Box>
                <RenderCheckbox />
              </Box>
              <Box>{option?.value}</Box>
              <Box className="template-preview-modal__dropdown-menu-item">
                {option?.additionalInfo?.required && (
                  <Tooltip title="Required Info">
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
            </MenuItem>
          );
        })}
      </RenderDropdown>
    </Box>
  );
};

/**
 * @component RenderRadioQues
 * @description Renders radio-type question preview with attachment-required indication.
 * @param {object} props - Component props.
 * @param {QuestionType} props.question - Question object containing answers & attachment metadata.
 * @param {boolean} [props.isDesktopPreview=false] - Controls desktop/mobile layout.
 * @returns {ReactNode} return radio items with attachment icons.
 */
export const RenderRadioQues: React.FC<RenderAttachmentProps> = ({
  question,
  isDesktopPreview,
  QUESTION_TYPES,
  QUESTION_ATTACHMENT,
  ATTACHMENT_BUTTON_CONFIG,
}) => {
  const showAttachmentIcon =
    question?.attachments?.length > 0
      ? question?.attachments?.filter(
          (item: AttachmentType) =>
            item?.attachmentType === QUESTION_ATTACHMENT_TYPE.attachment
        )?.length > 0
      : false;
  return (
    <Box className="template-preview-modal__answer-wrapper template-preview-modal__column">
      <Box>
        {question?.answers?.map((option) => {
          const attachmentIcon = isIconRequired(
            question,
            option,
            getQuestionAttachment(QUESTION_ATTACHMENT).ATTACHMENT.value
          )
            ? AttachmentRequired
            : Attachment;
          return (
            <Box className="template-preview-modal__radio-item">
              <RenderRadio
                label={option?.value}
                value={option?.value}
              />
              {/* TODO: Attachment require or not required condition missing */}
              {showAttachmentIcon && (
                <Box height={20}>
                  <CSvgIcon
                    component={attachmentIcon}
                    size={20}
                  />
                </Box>
              )}
            </Box>
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
          type={getQuestionTypes(QUESTION_TYPES).RADIO_BUTTON.value}
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
 * @param {object} props - Component props.
 * @param {QuestionType} props.question - Contains input type and metadata.
 * @param {boolean} [props.isDesktopPreview=false] - Applies desktop/mobile spacing rules.
 * @param {string} props.templateBaseType - Controls grid or default preview layout.
 * @returns {ReactNode} return disabled input field with optional attachments.
 */
export const RenderUserInputQues: React.FC<RenderAttachmentProps> = ({
  question,
  isDesktopPreview,
  templateBaseType,
  QUESTION_TYPES,
  ATTACHMENT_BUTTON_CONFIG,
  DATE_INPUT_TYPE,
}) => {
  const isMultiLine =
    question?.questionType ===
    getQuestionTypes(QUESTION_TYPES).LONG_USER_INPUT.value;
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
        type={getQuestionTypes(QUESTION_TYPES).USER_INPUT.value}
        QUESTION_TYPES={QUESTION_TYPES}
        ATTACHMENT_BUTTON_CONFIG={ATTACHMENT_BUTTON_CONFIG}
      />
      <Box width="100%">
        {question?.inputType ===
        getUserInputTypes(DATE_INPUT_TYPE).DATE_AND_TIME.value ? (
          <RenderDatePicker
            type="datetime"
            isDesktopPreview={isDesktopPreview}
          />
        ) : question?.inputType ===
          getUserInputTypes(DATE_INPUT_TYPE).DATE.value ? (
          <RenderDatePicker
            type="date"
            isDesktopPreview={isDesktopPreview}
          />
        ) : (
          <RenderTextField
            multiline={isMultiLine ? true : false}
            rows={isMultiLine ? 3 : 1}
            width={isMultiLine || !isDesktopPreview ? "100%" : ""}
          />
        )}
      </Box>
    </Box>
  );
};

/**
 * @component RenderDatePicker
 * @description Renders a disabled date or date-time picker preview with a calendar icon.
 * @param {object} props - Component props.
 * @param {"date"|"datetime"} [props.type="date"] - Picker mode.
 * @param {string} [props.placeholder] - Placeholder label for the input field.
 * @param {boolean} [props.isDesktopPreview=true] - Applies desktop or mobile styling.
 * @param {Date|string|undefined} props.value - Selected preview value.
 * @param {Function} [props.onChange] - Change handler (not used in read-only preview mode).
 * @returns {ReactNode} return read-only date picker input field.
 */
export const RenderDatePicker: React.FC<DatePickerProps> = ({
  type = "date",
  placeholder,
  isDesktopPreview = true,
  value,
  onChange,
}) => {
  const { PLACEHOLDER_TEXT } = useTemplateLibraryTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const Picker = type === "datetime" ? DateTimePicker : DatePicker;

  /* Custom text field with calendar icon */
  const renderField = (params: RenderTextFieldProps) => (
    <RenderTextField
      multiline={false}
      rows={1}
      {...params}
      placeholder={
        placeholder ||
        (type === "date"
          ? PLACEHOLDER_TEXT.selectDate
          : PLACEHOLDER_TEXT.selectDateTime)
      }
      value={value ? value.toString() : ""}
      onClick={() => setIsOpen(!isOpen)}
      size="small"
      InputProps={{
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
      }}
      className={clsx({
        "common-date-picker__textfield": true,
        "common-date-picker__textfield--mobile": !isDesktopPreview,
      })}
    />
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
