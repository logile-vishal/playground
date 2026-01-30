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

type InputTypeModalProps = {
  questionFormPath?: string;
  inputTypeModal: {
    status: boolean;
    data: null;
  };
  onClose: () => void;
};

const InputTypeModal: React.FC<InputTypeModalProps> = ({
  questionFormPath,
  inputTypeModal,
  onClose,
}) => {
  const { QUESTIONS } = useCreateTemplateTranslations();
  const { control } = useCreateTemplateForm();

  /**
   * @method getSelectedInputType
   * @description Retrieves the label of the selected input type based on its value
   * @param {string} value - The value of the selected input type
   * @return {string} The label corresponding to the selected input type
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
   * @description Retrieves the label of the selected date view option based on its value
   * @param {string} value - The value of the selected date view option
   * @return {string} The label corresponding to the selected date view option
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
   * @description Renders input fields for minimum and maximum length constraints
   * @return {React.ReactNode} Min and max length input fields JSX element
   */
  const renderAnyCharacter = () => {
    return (
      <>
        <Controller
          name={`${questionFormPath}.questionBasicData.minLength`}
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
          name={`${questionFormPath}.questionBasicData.maxLength`}
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
   * @description Renders input fields for minimum and maximum value constraints
   * @return {React.ReactNode} Min and max value input fields JSX element
   */
  const renderNumber = () => {
    return (
      <>
        <Controller
          name={`${questionFormPath}.questionBasicData.minValue`}
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
          name={`${questionFormPath}.questionBasicData.maxValue`}
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
   * @description Renders select dropdown for date view options
   * @return {React.ReactNode} Date view options select JSX element
   */
  const renderDate = () => {
    return (
      <>
        <Controller
          name={`${questionFormPath}.questionBasicData.value`}
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
    <CModal
      title={QUESTIONS.QUESTION_TYPE_LABELS.setInputTypeLabel}
      open={inputTypeModal.status}
      onClose={onClose}
      size="medium"
      confirmText={QUESTIONS.QUESTION_TYPE_LABELS.submitButton}
      className="ct-input-type-modal"
    >
      <ModalBody containerClassName="ct-input-type-modal__body">
        <Controller
          name={`${questionFormPath}.questionBasicData.inputType`}
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
                    inputValueTemplate: () =>
                      getSelectedInputType(field?.value),
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
