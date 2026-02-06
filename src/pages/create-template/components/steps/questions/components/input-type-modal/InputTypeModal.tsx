import { Controller, type Control, type FieldValues } from "react-hook-form";
import { Box } from "@mui/material";

import CTextfield from "@/core/components/form/textfield/Textfield";
import CSelect from "@/core/components/form/select/Select";
import { CButton } from "@/core/components/button/button";
import CModal, { ModalBody, ModalFooter } from "@/core/components/modal/Modal";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import { INPUT_TYPE } from "@/pages/create-template/constants/questions";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";

import "./InputTypeModal.scss";
import type {
  InputTypeContentProps,
  InputTypeModalProps,
} from "@/pages/create-template/types/questions.type";

/**
 * @method InputTypeContent
 * @description Renders input type configuration form with conditional fields based on input type
 * @params {InputTypeContentProps} props - Component props
 * @params {string} props.questionFormPath - Base path to question form field
 * @params {Control<FieldValues>} props.control - React Hook Form control instance
 * @returns {JSX.Element} - Input type configuration form
 */
export const InputTypeContent: React.FC<InputTypeContentProps> = ({
  questionFormPath,
  control,
}) => {
  const { QUESTIONS } = useCreateTemplateTranslations();

  /**
   * @method getSelectedInputType
   * @description Retrieves the label of the selected input type
   * @params {string} value - The value of the selected input type
   * @returns {string} - Label corresponding to the input type
   */
  const getSelectedInputType = (value: string) => {
    const selectedOption = QUESTIONS.INPUT_TYPE_OPTIONS.find(
      (option) => option.value === value
    );
    return selectedOption
      ? selectedOption.label
      : QUESTIONS.INPUT_TYPE_OPTIONS[0].label;
  };

  /**
   * @method getSelectedDateView
   * @description Retrieves the label of the selected date view option
   * @params {string} value - The value of the selected date view option
   * @returns {string} - Label corresponding to the date view option
   */
  const getSelectedDateView = (value: string) => {
    const selectedOption = QUESTIONS.DATE_VIEW_OPTIONS.find(
      (option) => option.value === value
    );
    return selectedOption
      ? selectedOption.label
      : QUESTIONS.DATE_VIEW_OPTIONS[0].label;
  };

  /**
   * @method renderAnyCharacter
   * @description Renders min and max length input fields
   * @returns {JSX.Element} - Min and max length inputs
   */
  const renderAnyCharacter = () => {
    return (
      <>
        <Controller
          name={`${questionFormPath}.minLength`}
          control={control as unknown as Control<FieldValues>}
          render={({ field }) => (
            <CTextfield
              type="number"
              label={QUESTIONS.QUESTION_TYPE_LABELS.minLengthPlaceholder}
              width="var(--input-field-width)"
              min={0}
              {...field}
            />
          )}
        />
        <Controller
          name={`${questionFormPath}.maxLength`}
          control={control as unknown as Control<FieldValues>}
          render={({ field }) => (
            <CTextfield
              type="number"
              label={QUESTIONS.QUESTION_TYPE_LABELS.maxLengthPlaceholder}
              width="var(--input-field-width)"
              min={0}
              {...field}
            />
          )}
        />
      </>
    );
  };

  /**
   * @method renderNumber
   * @description Renders min and max value input fields
   * @returns {JSX.Element} - Min and max value inputs
   */
  const renderNumber = () => {
    return (
      <>
        <Controller
          name={`${questionFormPath}.minValue`}
          control={control as unknown as Control<FieldValues>}
          render={({ field }) => (
            <CTextfield
              type="number"
              label={QUESTIONS.QUESTION_TYPE_LABELS.minValuePlaceholder}
              width="var(--input-field-width)"
              min={0}
              {...field}
            />
          )}
        />
        <Controller
          name={`${questionFormPath}.maxValue`}
          control={control as unknown as Control<FieldValues>}
          render={({ field }) => (
            <CTextfield
              type="number"
              label={QUESTIONS.QUESTION_TYPE_LABELS.maxValuePlaceholder}
              width="var(--input-field-width)"
              min={0}
              {...field}
            />
          )}
        />
      </>
    );
  };

  /**
   * @method renderDate
   * @description Renders date view options select field
   * @returns {JSX.Element} - Date view select field
   */
  const renderDate = () => {
    return (
      <>
        <Controller
          name={`${questionFormPath}.dateValue`}
          control={control as unknown as Control<FieldValues>}
          render={({ field }) => {
            return (
              <CSelect
                label={QUESTIONS.QUESTION_TYPE_LABELS.optionsLabel}
                options={QUESTIONS.DATE_VIEW_OPTIONS}
                className="ct-input-type-modal__date-view-select-field"
                optionLabelKey="label"
                optionValueKey="value"
                templates={{
                  inputValueTemplate: () => getSelectedDateView(field?.value),
                }}
                {...field}
              />
            );
          }}
        />
      </>
    );
  };

  return (
    <>
      <Controller
        name={`${questionFormPath}.inputType`}
        control={control as unknown as Control<FieldValues>}
        render={({ field }) => {
          return (
            <>
              <CSelect
                label={QUESTIONS.QUESTION_TYPE_LABELS.inputTypeLabel}
                options={QUESTIONS.INPUT_TYPE_OPTIONS}
                className="ct-input-type-modal__input-type-select-field"
                optionLabelKey="label"
                optionValueKey="value"
                templates={{
                  inputValueTemplate: () => getSelectedInputType(field?.value),
                }}
                {...field}
              />
              <Box className="ct-input-type-modal__length-fields">
                {field?.value === INPUT_TYPE.NUMBER_ONLY
                  ? renderNumber()
                  : field?.value === INPUT_TYPE.DATE_TIME
                    ? renderDate()
                    : renderAnyCharacter()}
              </Box>
            </>
          );
        }}
      />
    </>
  );
};

/**
 * @method InputTypeModal
 * @description Modal wrapper for input type configuration with form content
 * @params {InputTypeModalProps} props - Component props
 * @params {string} props.questionFormPath - Path to question form field
 * @params {Object} props.inputTypeModal - Modal state object
 * @params {boolean} props.inputTypeModal.status - Whether modal is open
 * @params {Function} props.onClose - Callback when modal closes
 * @returns {JSX.Element} - Modal with input type form
 */
const InputTypeModal: React.FC<InputTypeModalProps> = ({
  questionFormPath,
  inputTypeModal,
  onClose,
}) => {
  const { QUESTIONS } = useCreateTemplateTranslations();
  const { control } = useCreateTemplateForm();

  return (
    <CModal
      title={QUESTIONS.QUESTION_TYPE_LABELS.setInputTypeLabel}
      open={inputTypeModal.status}
      onClose={onClose}
      size="medium"
      confirmText={QUESTIONS.QUESTION_TYPE_LABELS.submitButton}
      className="ct-input-type-modal"
    >
      <ModalBody containerClassName="ct-input-type-modal__body">
        <InputTypeContent
          questionFormPath={`${questionFormPath}.questionBasicData`}
          control={control}
        />
      </ModalBody>
      <ModalFooter footerClassName="ct-input-type-modal__footer">
        <CButton
          severity="secondary"
          variant="text"
          onClick={onClose}
          walkMeId={["input type modal", "cancel button"]}
        >
          {QUESTIONS.QUESTION_TYPE_LABELS.cancelButton}
        </CButton>
        <CButton
          variant="solid"
          onClick={onClose}
          walkMeId={["input type modal", "submit button"]}
        >
          {QUESTIONS.QUESTION_TYPE_LABELS.submitButton}
        </CButton>
      </ModalFooter>
    </CModal>
  );
};

export default InputTypeModal;
