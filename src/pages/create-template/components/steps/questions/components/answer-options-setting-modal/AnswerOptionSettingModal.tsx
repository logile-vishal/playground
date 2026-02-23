import React, { useEffect, useState } from "react";
import {
  useForm,
  Controller,
  type FieldValues,
  type Control,
} from "react-hook-form";
import { Badge } from "@mui/material";

import {
  answerOptionSettingModalSchema,
  type AnswerSettingSchemaType,
} from "@/pages/create-template/form-schema/answer-option-setting-modal";
import type {
  AnswerOptionSettingModalProps,
  TriggerCardMenuProps,
} from "@/pages/create-template/types/questions.type";
// TODO: Replace sample data with actual data when API is ready
import clsx from "@/utils/clsx";
import { isNonEmptyValue } from "@/utils/index";
import { zodResolver } from "@hookform/resolvers/zod";
import CModal, { ModalBody } from "@/core/components/modal/Modal";
import { CButton } from "@/core/components/button/button";
import CSvgIcon from "@/core/components/icon/Icon";
import { AddIcon, AttachmentLink, DraggableDots } from "@/core/constants/icons";
import { renderMacTruncate } from "@/utils/mac-truncate";
import CTextfield from "@/core/components/form/textfield/Textfield";
import CSwitch from "@/core/components/form/switch/Switch";
import CSelect from "@/core/components/form/select";
import CIconButton from "@/core/components/button/IconButton";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { OPTIONS_DEFAULT } from "@/pages/create-template/constants/question-type-default";
import { useCreateTemplateForm } from "@/pages/create-template/services/create-template-form.service";
import { TRIGGER_TYPE } from "@/pages/create-template/constants/constant";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
import { useDirtyFormGuard } from "@/core/hooks/useDirtyFormGuard";
import { OPTION_TRIGGER_MENU_KEY } from "@/pages/create-template/constants/questions";
import CDivider from "@/core/components/divider/Divider";

import TriggerMenu from "../trigger-menu/TriggerMenu";
import "./AnswerOptionSettingModal.scss";
import { InputTypeContent } from "../input-type-modal/InputTypeModal";

const AnswerOptionSettingModal: React.FC<AnswerOptionSettingModalProps> = ({
  answerOptionSettingModal,
  onClose,
  onSubmit,
  setTriggerCardModal,
  shouldProceedAllowed,
  setShouldProceedAllowed,
}) => {
  const { GENERAL } = useCommonTranslation();
  const { QUESTION_OPTION } = useCreateTemplateTranslations();

  const CompliantOptions = Object.values(
    QUESTION_OPTION.COMPLIANT_DROPDOWN_OPTIONS
  );
  const AdditionalOptions = [
    QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.NO_ADDITIONAL_INFO,
    QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.OPTIONAL_INFO,
    QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.REQUIRED_INFO,
  ];

  const {
    control,
    handleSubmit,
    watch,
    getValues: getFormValues,
    setValue: setFormValue,
    formState: { isDirty },
  } = useForm<{ answerOptions: AnswerSettingSchemaType[] }>({
    resolver: zodResolver(answerOptionSettingModalSchema),
    defaultValues: { answerOptions: [OPTIONS_DEFAULT] },
    mode: "onChange",
  });

  const { watch: watchCreateForm } = useCreateTemplateForm();
  const watchOptions = watch("answerOptions");
  const watchNotificationForm = watchCreateForm("notifications");
  const watchFollowUpTaskForm = watchCreateForm("followUpTasks");
  useDirtyFormGuard("answerOptions", isDirty);

  const totalTriggerCount =
    (watchNotificationForm.length || 0) + (watchFollowUpTaskForm.length || 0) ||
    0;
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [triggerCardMenu, setTriggerCardMenu] = useState<TriggerCardMenuProps>({
    anchor: null,
    status: false,
  });
  const [unsavedChangesModal, setUnsavedChangesModal] = useState({
    status: false,
    type: null,
  });
  const defaultLabel =
    QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.settingAnswerValueLabel;
  const [isFormulaEnabled, setIsFormulaEnabled] = useState(
    isNonEmptyValue(watchOptions[activeIndex]?.formula) ?? false
  );
  /**
   * @method openTriggerCardMenu
   * @description Opens the trigger card menu at the anchor element
   * @params {React.MouseEvent<HTMLElement>} event - Mouse event from trigger card
   */
  const openTriggerCardMenu = (event: React.MouseEvent<HTMLElement>) => {
    setTriggerCardMenu({
      anchor: event.currentTarget,
      status: true,
    });
  };

  /**
   * @method closeTriggerCardMenu
   * @description Closes the trigger card menu
   */
  const closeTriggerCardMenu = () => {
    setTriggerCardMenu({
      anchor: null,
      status: false,
    });
  };

  /**
   * @method onTriggerCardOpen
   * @description Opens the trigger card modal for the selected trigger type
   * @params {string} type - Type of trigger (Notification or FollowUp)
   */
  const onTriggerCardOpen = (type: string) => {
    setTriggerCardModal({
      status: true,
      data: null,
      type:
        type === OPTION_TRIGGER_MENU_KEY.Notification
          ? TRIGGER_TYPE.notification
          : type === OPTION_TRIGGER_MENU_KEY.FollowUp
            ? TRIGGER_TYPE.followup
            : null,
    });
    setShouldProceedAllowed(true);
    closeUnSavedChangesModal();
    onClose();
  };

  /**
   * @method openUnSavedChangesModal
   * @description Opens the unsaved changes modal and resets its state
   *
   */
  const openUnSavedChangesModal = (type: string) => {
    if (isDirty) setUnsavedChangesModal({ status: true, type });
    else onTriggerCardOpen(type);
  };

  /**
   * @method closeUnSavedChangesModal
   * @description Closes the unsaved changes modal and resets its state
   *
   */
  const closeUnSavedChangesModal = () => {
    setUnsavedChangesModal({ status: false, type: null });
  };

  /**
   * @method handleUnSavedProceed
   * @description Handles proceeding to the next step after confirming unsaved changes
   */
  const handleUnSavedProceed = () => {
    onTriggerCardOpen(unsavedChangesModal.type);
  };

  /**
   * @method handleFormSubmit
   * @description Validates and submits all answer options
   * @returns {Promise<void>}
   */
  const handleFormSubmit = async () => {
    handleSubmit(() => {
      onSubmit(watchOptions);
    })();
  };

  /**
   * @method handleClose
   * @description Closes the modal
   */
  const handleClose = () => {
    onClose();
  };

  /**
   * @method handleOptionSelect
   * @description Selects an answer option from the list
   * @params {React.MouseEvent<HTMLDivElement>} e - Mouse event
   * @params {number} index - Index of selected option
   */
  const handleOptionSelect = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveIndex(index);
  };

  /**
   * @method handleAddOption
   * @description Adds a new answer option after validation
   * @returns {Promise<void>}
   */
  const handleAddOption = async () => {
    const currentOptions = getFormValues("answerOptions");
    handleSubmit(() => {
      currentOptions.push(OPTIONS_DEFAULT);
      const updatedOptions = JSON.parse(JSON.stringify(currentOptions));
      setFormValue("answerOptions", updatedOptions);
      setActiveIndex(updatedOptions.length - 1);
    })();
  };

  /**
   * @method handleDeleteOption
   * @description Deletes an answer option if multiple exist
   * @params {number} index - Index of option to delete
   */
  const handleDeleteOption = (index: number) => {
    const currentOptions = getFormValues("answerOptions");
    if (currentOptions.length <= 1) return;
    currentOptions.splice(index, 1);
    const updatedOptions = JSON.parse(JSON.stringify(currentOptions));
    setFormValue("answerOptions", updatedOptions);
    setActiveIndex(updatedOptions.length - 1);
  };

  /**
   * @method getIsCompliantValue
   * @description Maps compliance status to translated label
   * @params {boolean|null|undefined} isCompliant - Compliance status
   * @returns {string} - Label for compliance status
   */
  const getIsCompliantValue = (isCompliant) => {
    if (isCompliant === undefined || isCompliant === null) {
      return QUESTION_OPTION.COMPLIANT_DROPDOWN_OPTIONS.NA.label;
    } else if (isCompliant) {
      return QUESTION_OPTION.COMPLIANT_DROPDOWN_OPTIONS.COMPLIANT.label;
    }
    return QUESTION_OPTION.COMPLIANT_DROPDOWN_OPTIONS.NON_COMPLIANT.label;
  };

  /**
   * @method handleCompliantChange
   * @description Updates compliance status for active option
   * @params {React.ChangeEvent<HTMLInputElement>} e - Change event from dropdown
   */
  const handleCompliantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOption = e.target.value;
    const currentOptions = getFormValues("answerOptions");
    currentOptions[activeIndex].isCompliant =
      selectedOption !== null ? Boolean(selectedOption) : null;
    setFormValue("answerOptions", currentOptions);
  };

  /**
   * @method getAdditionalInfoValue
   * @description Maps additional info type to translated label
   * @params {string} requiredType - Additional info requirement type
   * @returns {string} - Label for info type
   */
  const getAdditionalInfoValue = (requiredType: string) => {
    switch (requiredType) {
      case QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.OPTIONAL_INFO.value:
        return QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.OPTIONAL_INFO.label;
      case QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.REQUIRED_INFO.value:
        return QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.REQUIRED_INFO.label;
      default:
        return QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.NO_ADDITIONAL_INFO
          .label;
    }
  };

  /**
   * @method handleAdditionalInfoChange
   * @description Updates additional info type for active option
   * @params {string} selectedOption - Selected additional info type
   */
  const handleAdditionalInfoChange = (selectedOption: string) => {
    const currentOptions = getFormValues("answerOptions");
    currentOptions[activeIndex].additionalInfo.requiredType = selectedOption;
    setFormValue("answerOptions", currentOptions);
  };

  /**
   * @method handleScoreChange
   * @description Updates score value for active option
   * @params {React.ChangeEvent<HTMLInputElement>} e - Change event from input
   */
  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const currentOptions = getFormValues("answerOptions");
    currentOptions[activeIndex].score = parseInt(inputValue);
    setFormValue("answerOptions", currentOptions);
  };

  const handleAppendSymbol = (symbol: string) => {
    const currentOptions = getFormValues("answerOptions");
    currentOptions[activeIndex].formula += `${symbol}`;
    setFormValue("answerOptions", currentOptions);
  };

  const handleIsFormulaRequired = (e) => {
    const isChecked = e.target.value;
    setIsFormulaEnabled(isChecked);
  };

  useEffect(() => {
    if (answerOptionSettingModal.activeIndex !== null) {
      setActiveIndex(answerOptionSettingModal.activeIndex);
      setFormValue(
        "answerOptions",
        answerOptionSettingModal.data.questionBasicData.response || []
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerOptionSettingModal]);

  /**
   * @method renderOptions
   * @description Renders the options list panel with selection and attachments
   * @returns {JSX.Element} - Options list panel
   */
  const renderOptions = () => {
    return (
      <div className="ct-answer-option-setting-modal__left">
        <div className="ct-answer-option-setting-modal__left-header">
          <div className="ct-answer-option-setting-modal__left-header-title">
            {QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.answerOptionsHeading}
          </div>
          <CButton
            severity="primary"
            variant="outline"
            size="small"
            walkMeId={["options modal", "add option button"]}
            onClick={handleAddOption}
          >
            <CSvgIcon
              component={AddIcon}
              size={16}
            />
            {GENERAL.addButtonLabel}
          </CButton>
        </div>
        <div className="ct-answer-option-setting-modal__left-content">
          {watchOptions &&
            watchOptions?.length > 0 &&
            watchOptions?.map((option, index) => (
              <div
                onClick={(e) => handleOptionSelect(e, index)}
                className={clsx({
                  "ct-answer-option-setting-modal__left-content-item": true,
                  "ct-answer-option-setting-modal__left-content-item--selected":
                    index === activeIndex,
                })}
                key={index}
              >
                <div className="ct-answer-option-setting-modal__left-content-item-draggable">
                  <CSvgIcon component={DraggableDots} />

                  {isNonEmptyValue(option?.title) ? (
                    renderMacTruncate(option?.title)
                  ) : (
                    <div className="ct-answer-option-setting-modal__left-content-item-default-label">
                      {defaultLabel}
                    </div>
                  )}
                </div>
                <CIconButton
                  size="small"
                  onClick={openTriggerCardMenu}
                >
                  <Badge
                    className="ct-answer-option-setting-modal__attachment-badge"
                    badgeContent={totalTriggerCount}
                  ></Badge>
                  <CSvgIcon
                    color={totalTriggerCount > 0 ? "brand-primary" : "disabled"}
                    component={AttachmentLink}
                  />
                </CIconButton>
              </div>
            ))}
        </div>
      </div>
    );
  };

  /**
   * @method renderSettings
   * @description Renders the settings form panel for active option
   * @params {number} index - Index of the option being configured
   * @returns {JSX.Element} - Settings form panel
   */
  const renderSettings = (index) => {
    return (
      <div className="ct-answer-option-setting-modal__right">
        <div className="ct-answer-option-setting-modal__right-header">
          <div className="ct-answer-option-setting-modal__right-header-title">
            {QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.settingsForLabel} "
            {watchOptions[index]?.title || defaultLabel}"
          </div>
          {watchOptions.length > 1 && (
            <CButton
              severity="destructive"
              variant="solid"
              size="small"
              onClick={() => handleDeleteOption(index)}
              walkMeId={["options modal", "delete option button"]}
            >
              {GENERAL.deleteButtonLabel}
            </CButton>
          )}
        </div>
        <div className="ct-answer-option-setting-modal__right-content">
          <div className="ct-answer-option-setting-modal__right-content-form-group">
            <div className="ct-answer-option-setting-modal__right-content-form-item">
              <Controller
                name={`answerOptions.${index}.title`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CTextfield
                    {...field}
                    label={
                      QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.labels.value
                    }
                    required={true}
                    error={!!error}
                    helperText={error ? error?.message : ""}
                    className="ct-answer-option-setting-modal__right-content-form-item-textfield"
                  />
                )}
              />
            </div>
            <div className="ct-answer-option-setting-modal__right-content-form-item">
              <Controller
                name={`answerOptions.${index}.isDefault`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CSwitch
                    {...field}
                    label={
                      QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.labels.default
                    }
                    className="ct-answer-option-setting-modal__right-content-form-item-switch"
                    error={!!error}
                  />
                )}
              />
            </div>
          </div>
          <div className="ct-answer-option-setting-modal__right-content-form-group">
            <div className="ct-answer-option-setting-modal__right-content-form-item">
              <Controller
                name={`answerOptions.${index}.isCompliant`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CSelect
                    options={(CompliantOptions as []) ?? []}
                    optionLabelKey="label"
                    optionValueKey="value"
                    {...field}
                    onChange={handleCompliantChange}
                    value={getIsCompliantValue(field?.value)}
                    templates={{
                      inputValueTemplate: () =>
                        getIsCompliantValue(field?.value),
                    }}
                    label={
                      QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.labels
                        .compliance
                    }
                    error={!!error}
                    className="ct-answer-option-setting-modal__right-content-form-item-select"
                  />
                )}
              />
            </div>
            <div className="ct-answer-option-setting-modal__right-content-form-item">
              <Controller
                name={`answerOptions.${index}.score`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CTextfield
                    {...field}
                    label={
                      QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.labels.score
                    }
                    onChange={handleScoreChange}
                    className="ct-answer-option-setting-modal__right-content-form-item-textfield"
                    placeholder={
                      QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.placeholder
                        .scoreInput
                    }
                    error={!!error}
                    type="number"
                  />
                )}
              />
            </div>
          </div>

          <div className="ct-answer-option-setting-modal__right-content-form-group">
            <div className="ct-answer-option-setting-modal__right-content-form-item">
              <Controller
                name={`answerOptions.${index}.additionalInfo.requiredType`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CSelect
                    options={AdditionalOptions}
                    optionLabelKey={"label"}
                    optionValueKey={"value"}
                    allowFilter={false}
                    {...field}
                    error={!!error}
                    templates={{
                      inputValueTemplate: () =>
                        getAdditionalInfoValue(field?.value),
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleAdditionalInfoChange(e.target.value as string);
                    }}
                    className="ct-answer-option-setting-modal__right-content-form-item-select"
                  />
                )}
              />
            </div>
          </div>
          {watchOptions[index]?.additionalInfo &&
          (watchOptions[index]?.additionalInfo?.requiredType ===
            QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.REQUIRED_INFO.value ||
            watchOptions[index]?.additionalInfo.requiredType ===
              QUESTION_OPTION.ADDITIONAL_INFO_DROPDOWN.OPTIONAL_INFO.value) ? (
            <div className="ct-answer-option-setting-modal__right-content-form-group">
              <div
                className={clsx({
                  "ct-answer-option-setting-modal__right-content-form-item": true,
                  "ct-answer-option-setting-modal__right-content-form-item-additional-info": true,
                })}
              >
                <InputTypeContent
                  questionFormPath={`answerOptions.${index}.additionalInfo`}
                  control={control as unknown as Control<FieldValues>}
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="ct-answer-option-setting-modal__right-content-form-group-2">
            <div
              className={clsx({
                "ct-answer-option-setting-modal__right-content-form-item": true,
              })}
            >
              <div className="ct-answer-option-setting-modal__right-content-form-item-label">
                {QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.labels.formula}
              </div>
              <CSwitch
                onChange={handleIsFormulaRequired}
                checked={isFormulaEnabled}
              />
            </div>
            {isFormulaEnabled && (
              <>
                <CDivider orientation="horizontal" />
                <div className="ct-answer-option-setting-modal__right-content-form-item">
                  <CIconButton
                    variant="outline"
                    severity="secondary"
                    size="small"
                    onClick={() => handleAppendSymbol("<")}
                    walkMeId={["options modal", "less than symbol"]}
                    className="ct-answer-option-setting-modal__right-content-form-item-formula-button"
                  >
                    &lt;
                  </CIconButton>
                  <CIconButton
                    variant="outline"
                    severity="secondary"
                    size="small"
                    onClick={() => handleAppendSymbol("<=")}
                    walkMeId={["options modal", "less than or equal to symbol"]}
                    className="ct-answer-option-setting-modal__right-content-form-item-formula-button"
                  >
                    &lt;&#61;
                  </CIconButton>
                  <CIconButton
                    variant="outline"
                    severity="secondary"
                    size="small"
                    onClick={() => handleAppendSymbol(">")}
                    walkMeId={["options modal", "greater than symbol"]}
                    className="ct-answer-option-setting-modal__right-content-form-item-formula-button"
                  >
                    &gt;
                  </CIconButton>
                  <CIconButton
                    variant="outline"
                    severity="secondary"
                    size="small"
                    onClick={() => handleAppendSymbol(">=")}
                    walkMeId={[
                      "options modal",
                      "greater than or equal to symbol",
                    ]}
                    className="ct-answer-option-setting-modal__right-content-form-item-formula-button"
                  >
                    &gt;&#61;
                  </CIconButton>
                  <CIconButton
                    variant="outline"
                    severity="secondary"
                    size="small"
                    onClick={() => handleAppendSymbol("==")}
                    walkMeId={["options modal", "equal to symbol"]}
                    className="ct-answer-option-setting-modal__right-content-form-item-formula-button"
                  >
                    &#61;&#61;
                  </CIconButton>
                  <CIconButton
                    variant="outline"
                    severity="secondary"
                    size="small"
                    onClick={() => handleAppendSymbol("<>")}
                    walkMeId={["options modal", "not equal to symbol"]}
                    className="ct-answer-option-setting-modal__right-content-form-item-formula-button"
                  >
                    &lt;&gt;
                  </CIconButton>
                  <CIconButton
                    variant="outline"
                    severity="secondary"
                    size="small"
                    onClick={() => handleAppendSymbol("AND")}
                    walkMeId={["options modal", "and symbol"]}
                    className="ct-answer-option-setting-modal__right-content-form-item-formula-button"
                  >
                    AND
                  </CIconButton>
                  <CIconButton
                    variant="outline"
                    severity="secondary"
                    size="small"
                    onClick={() => handleAppendSymbol("OR")}
                    walkMeId={["options modal", "or symbol"]}
                    className="ct-answer-option-setting-modal__right-content-form-item-formula-button"
                  >
                    OR
                  </CIconButton>
                </div>
                <div className="ct-answer-option-setting-modal__right-content-form-item">
                  <Controller
                    name={`answerOptions.${index}.formula`}
                    control={control}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <CTextfield
                          {...field}
                          placeholder={
                            QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL
                              .placeholder.formulaInput
                          }
                          error={!!error}
                          helperText={error ? error?.message : ""}
                        />
                      );
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <CModal
      open={answerOptionSettingModal?.status || false}
      onClose={handleClose}
      title={QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.title}
      confirmText="Submit"
      containerClassName="ct-answer-option-setting-modal__container"
      onConfirm={handleFormSubmit}
    >
      <ModalBody containerClassName="px-0">
        <form className="ct-answer-option-setting-modal">
          {renderOptions()}
          {watchOptions.map((_, index) => {
            if (index === activeIndex) {
              return renderSettings(index);
            }
          })}
        </form>
      </ModalBody>
      <TriggerMenu
        anchorEl={triggerCardMenu?.anchor}
        closeTriggerCardMenu={closeTriggerCardMenu}
        setTriggerCardModal={setTriggerCardModal}
        notificationCount={watchNotificationForm?.length}
        followUpCount={watchFollowUpTaskForm?.length}
        openUnSavedChangesModal={openUnSavedChangesModal}
        shouldProceedAllowed={shouldProceedAllowed}
      />

      <CModal
        open={unsavedChangesModal.status}
        title={
          QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.UNSAVED_CHANGES_MODAL
            .title
        }
        size="medium"
        onClose={closeUnSavedChangesModal}
        confirmText={
          QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.UNSAVED_CHANGES_MODAL
            .confirmText
        }
        onConfirm={handleUnSavedProceed}
      >
        <ModalBody>
          <div className="ct-answer-option-setting-modal__unsaved-changes-warning">
            {
              QUESTION_OPTION.ANSWER_OPTION_SETTING_MODAL.UNSAVED_CHANGES_MODAL
                .bodyText
            }
          </div>
        </ModalBody>
      </CModal>
    </CModal>
  );
};

export default AnswerOptionSettingModal;
