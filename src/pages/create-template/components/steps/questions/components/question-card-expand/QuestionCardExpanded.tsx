import React, { useEffect, useState } from "react";
import { Box, FormControlLabel, Tab, Typography } from "@mui/material";
import { Controller, type FieldValues, type Control } from "react-hook-form";

import { isNonEmptyValue } from "@/utils";
import { QUESTION_TYPE } from "@/pages/create-template/constants/questions";
import { DraggableDots, InputType } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import { AddIcon, Copy, Delete, ChevronUpLarge } from "@/core/constants/icons";
import CIconButton from "@/core/components/button/IconButton";
import CTextfield from "@/core/components/form/textfield/Textfield";
import CSwitch from "@/core/components/form/switch/Switch";
import type {
  AnswerOptionSettingProps,
  QuestionCardProps,
  QuestionProps,
  QuestionTypeKey,
  SectionTypeProps,
} from "@/pages/create-template/types/questions.type";
import CTabs from "@/core/components/tabs/Tabs";
import { CButton } from "@/core/components/button/button";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
import CDivider from "@/core/components/divider/Divider";
import CRichTextEditor from "@/core/components/form/rich-text-editor/RichTextEditor";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import useQuestionListManager from "@/pages/create-template/hooks/useQuestionListManager";
import CSelect from "@/core/components/form/select";
import TriggerModal from "@/pages/create-template/components/trigger-modal/TriggerModal";
import { TRIGGER_TYPE } from "@/pages/create-template/constants/constant";
import {
  followupSampleData,
  notificationSampleData,
} from "@/pages/create-template/constants/sampleData";
import { CSortableItem } from "@/core/components/drag-drop";
import type { DragHandleProps } from "@/core/components/drag-drop/types/DragAndDrop.type";
import CModal, { ModalBody } from "@/core/components/modal/Modal";
import { BUTTON_SEVERITY } from "@/core/constants/button-constant";
import clsx from "@/utils/clsx";
import { useFormFieldError } from "@/pages/create-template/hooks/useCreateTemplateFormError";
import { RenderQuestion } from "../../Questions";
import InputTypeModal from "../input-type-modal/InputTypeModal";
import { QuestionBadge } from "../question-card-collapsed/QuestionBadges";
import QuestionCardOptionsComponent from "../question-card-options/QuestionCardOptions";
import AnswerOptionSettingModal from "../answer-options-setting-modal/AnswerOptionSettingModal";
import AdvanceTab from "./advance-tab/AdvanceTab";
import "./QuestionCardExpanded.scss";

function TabPanel(props) {
  const { children, value } = props;
  return <div>{value && <Box>{children}</Box>}</div>;
}

const QuestionCardExpanded: React.FC<QuestionCardProps> = ({
  index,
  question,
  expandedList,
  toggleExpand,
  questionFormPath,
  handleQuestionAdd,
  isAddQuestionAllowed,
  walkMeIdPrefix,
}) => {
  const { QUESTIONS, QUESTION_BADGE_CONFIG } = useCreateTemplateTranslations();
  const { DELETE_CONFIRMATION } = useCommonTranslation();
  const [currentTab, setCurrentTab] = useState(
    QUESTIONS.EXPANDED_QUESTION_CARD_TAB_LABELS.BASIC.value
  );
  const [answerOptionSettingModal, setAnswerOptionSettingModal] =
    useState<AnswerOptionSettingProps>({
      status: false,
      data: null,
      activeIndex: null,
    });
  const [questionType, setQuestionType] = useState<QuestionTypeKey>(
    QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN[0].value
  );
  const [attachments, setAttachments] = useState<File[]>([]);
  const { control, watch, formErrors } = useCreateTemplateForm();
  const { hasError } = useFormFieldError(questionFormPath);
  const {
    modifyQuestionType,
    cloneExistingQuestion,
    deleteQuestion,
    modifyOptions,
  } = useQuestionListManager();
  const watchQuestionList = watch("questions") as QuestionProps[];
  const [inputTypeModal, setInputTypeModal] = useState({
    status: false,
    data: null,
  });
  const [triggerCardModal, setTriggerCardModal] = useState({
    status: false,
    data: null,
    type: null,
  });
  const [shouldProceedAllowed, setShouldProceedAllowed] = useState(false);
  const [deleteQuestionConfirmationModal, setDeleteQuestionConfirmationModal] =
    useState<boolean>(false);
  const onAnswerOptionSettingsOpen = (activeIndex: number) => {
    setAnswerOptionSettingModal({ status: true, data: question, activeIndex });
  };

  const closeAnswerOptionSettingModal = () => {
    setAnswerOptionSettingModal({
      status: false,
      data: null,
      activeIndex: null,
    });
  };

  /**
   * @method closeTriggerCardModal
   * @description Closes the trigger card modal
   */
  const closeTriggerCardModal = () => {
    setTriggerCardModal({
      status: false,
      data: null,
      type: null,
    });
    setShouldProceedAllowed(false);
  };

  /**
   * @method handleOptionsSubmit
   * @description Handles submission of answer options from the settings modal and updates the question options
   * @param {unknown} options - The updated options for the question
   * @return {void}
   */
  const handleOptionsSubmit = (options) => {
    modifyOptions(question.qId, options);
    closeAnswerOptionSettingModal();
  };

  /**
   * @method handleDeleteQuestionClick
   * @description Opens the delete confirmation modal
   * @return {void}
   */
  const handleDeleteQuestionClick = (): void => {
    setDeleteQuestionConfirmationModal(true);
  };

  /**
   * @method handleCloseDeleteModal
   * @description Closes the delete confirmation modal
   * @return {void}
   */
  const handleCloseQuestionDeleteModal = (): void => {
    setDeleteQuestionConfirmationModal(false);
  };

  /**
   * @method handleConfirmDelete
   * @description Confirms and executes the question deletion
   * @return {void}
   */
  const handleConfirmQuestionDelete = (): void => {
    deleteQuestion(question.qId);
    setDeleteQuestionConfirmationModal(false);
  };

  /**
   * @method onUpdateAttachments
   * @description Updates the attachments state with new files
   * @param {File[]} files - Array of new attachment files
   * @return {void}
   */
  const onUpdateAttachments = (files: File[]) => {
    setAttachments(files);
  };
  /**
   * @method handleTabChange
   * @description Handles tab selection change event
   * @param {any} _ - Event object (unused)
   * @param {string} newValue - The new tab value
   * @return {void}
   */
  const handleTabChange = (_, newValue) => {
    setCurrentTab(newValue);
  };

  /**
   * @method handleQuestionTypeChange
   * @description Handles question type change event and updates the form state
   * @param {unknown} event - The Select component change event
   * @return {void}
   */
  const handleQuestionTypeChange = (event: unknown) => {
    const target = (event as { target: { value: unknown } })
      .target as SectionTypeProps;
    const newType = target.value;
    const newQuestionId = modifyQuestionType(
      questionType,
      newType,
      question.qId
    );
    setQuestionType(newType);
    if (newQuestionId) toggleExpand(newQuestionId);
  };

  /**
   * @method handleInputTypeModalOpen
   * @description Opens the input type modal dialog
   * @return {void}
   */
  const handleInputTypeModalOpen = () => {
    setInputTypeModal({ status: true, data: null });
  };

  /**
   * @method handleInputTypeModalClose
   * @description Closes the input type modal dialog
   * @return {void}
   */
  const handleInputTypeModalClose = () => {
    setInputTypeModal({ status: false, data: null });
  };

  /**
   * @method getSelectedResponseTemplate
   * @description Retrieves the label of the selected response template option
   * @param {string} value - The value of the selected response template
   * @return {string} The label of the selected response template option
   */
  const getSelectedResponseTemplate = (value: string) => {
    const selectedOption = QUESTIONS.RESPONSE_TEMPLATE_OPTIONS.find(
      (option) => option.label === value
    );
    return selectedOption
      ? selectedOption.label
      : QUESTIONS.RESPONSE_TEMPLATE_OPTIONS[0].label;
  };

  /**
   * @method renderOptionsBasedOnType
   * @description Renders question options component based on selected question type
   * @return {React.ReactNode|undefined} Options component or undefined
   */
  const renderOptionsBasedOnType = () => {
    switch (questionType) {
      case QUESTION_TYPE.RADIO:
      case QUESTION_TYPE.CHECKBOX:
      case QUESTION_TYPE.DYNAMIC_DROPDOWN:
      case QUESTION_TYPE.DROPDOWN:
      case QUESTION_TYPE.BARCODE_SCAN:
        return (
          <QuestionCardOptionsComponent
            key={question.qId}
            question={question}
            questionFormPath={`${questionFormPath}.questionBasicData.response`}
            isVisible={true}
            onAnswerOptionSettingsOpen={onAnswerOptionSettingsOpen}
            walkMeIdPrefix={[...walkMeIdPrefix, "options"]}
          />
        );
    }
  };

  /**
   * @method renderLongInputType
   * @description Renders input fields for long input question type
   * @return {React.ReactNode} Long input fields JSX element
   */
  const renderLongInputType = () => {
    return (
      <Box className="ct-question-card-expanded__long-input-fields">
        <CTextfield
          type="number"
          label={QUESTIONS.EXPANDED_QUESTION_CARD.minLengthPlaceholder}
          className="ct-question-card-expanded__long-input"
          min={0}
        />
        <CTextfield
          type="number"
          label={QUESTIONS.EXPANDED_QUESTION_CARD.maxLengthPlaceholder}
          className="ct-question-card-expanded__long-input"
          min={0}
        />
      </Box>
    );
  };

  /**
   * @method renderSortInputType
   * @description Renders button to open input type modal for sort input question
   * @return {React.ReactNode} Sort input button JSX element
   */
  const renderSortInputType = () => {
    return (
      <Box className="ct-question-card-expanded__sort-input-field">
        <CButton
          severity="secondary"
          variant="outline"
          className="ct-question-card-expanded__sort-input-field-button"
          onClick={handleInputTypeModalOpen}
        >
          <Box className="ct-question-card-expanded__sort-input-field-button-content">
            <CSvgIcon component={InputType} />
            <Box>
              {QUESTIONS.EXPANDED_QUESTION_CARD.setInputTypePlaceholder}
            </Box>
          </Box>
        </CButton>
      </Box>
    );
  };

  /**
   * @method renderDynamicDropdownType
   * @description Renders button showing count of extra answers from tags for dynamic dropdown
   * @return {React.ReactNode} Dynamic dropdown button JSX element
   */
  const renderDynamicDropdownType = () => {
    return (
      <Box className="ct-question-card-expanded__dynamic-dropdown-field">
        <Controller
          name={`${questionFormPath}.advancedSettings.tags`}
          control={control as unknown as Control<FieldValues>}
          render={({ field }) => (
            <CButton
              severity="primary"
              variant="outline"
              className="ct-question-card-expanded__dynamic-dropdown-field-button"
            >
              <Box className="ct-question-card-expanded__dynamic-dropdown-field-button-content">
                <Box>{field?.value?.length || 0}</Box>
                <Box>
                  {
                    QUESTIONS.EXPANDED_QUESTION_CARD
                      .dynamicDropdownAnswersFromTags
                  }
                </Box>
              </Box>
            </CButton>
          )}
        />
      </Box>
    );
  };

  /**
   * @method renderResponseTemplateType
   * @description Renders select dropdown for response template options
   * @return {React.ReactNode} Response template select JSX element
   */
  const renderResponseTemplateType = () => {
    return (
      <Box className="ct-question-card-expanded__response-template">
        <Controller
          name={`${questionFormPath}.questionBasicData.value`}
          control={control as unknown as Control<FieldValues>}
          render={({ field }) => (
            <CSelect
              options={QUESTIONS.RESPONSE_TEMPLATE_OPTIONS}
              optionLabelKey="label"
              optionValueKey="label"
              className="ct-question-card-expanded__response-template-select"
              templates={{
                inputValueTemplate: () =>
                  getSelectedResponseTemplate(field?.value),
              }}
              {...field}
            />
          )}
        />
      </Box>
    );
  };

  /**
   * @method renderConditionsBasedOnType
   * @description Renders conditional fields based on selected question type
   * @return {React.ReactNode|null} Conditional fields or null
   */
  const renderConditionsBasedOnType = () => {
    switch (questionType) {
      case QUESTION_TYPE.LONG_INPUT:
        return renderLongInputType();
      case QUESTION_TYPE.SORT_INPUT:
        return renderSortInputType();
      case QUESTION_TYPE.DYNAMIC_DROPDOWN:
        return renderDynamicDropdownType();
      case QUESTION_TYPE.RESPONSE_TEMPLATE:
        return renderResponseTemplateType();
      default:
        return null;
    }
  };

  const handleCloneQuestion = async () => {
    const qId = cloneExistingQuestion(question.qId);
    toggleExpand(qId);
  };

  useEffect(() => {
    if (isNonEmptyValue(question?.questionBasicData.questionType)) {
      const selectedType = question?.questionBasicData.questionType;
      let questionTypeData = QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN.find(
        (option) => option.value === selectedType
      );

      if (!questionTypeData?.value) {
        questionTypeData = QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN[0];
      }
      setQuestionType(questionTypeData.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  /**
   * @method renderHeader
   * @description Renders the expanded question card header with controls and badges
   * @return {React.ReactNode} Header JSX element
   */
  const renderHeader = (dragHandleContext: DragHandleProps) => {
    return (
      <Box className="ct-question-card-expanded__header">
        <Box className="ct-question-card-expanded__header-left-content">
          <Box
            className="ct-question-card-expanded__dnd"
            {...dragHandleContext.attributes}
            {...dragHandleContext.listeners}
          >
            <CSvgIcon
              size={24}
              component={DraggableDots}
            />
          </Box>
          <Box
            className={`ct-question-card-expanded__order-index ${
              question?.isRequired ? "required" : ""
            }`}
          >
            <Typography>{`${index}.`}</Typography>
          </Box>
          <CDivider orientation="vertical" />
          <Controller
            name={`${questionFormPath}.isRequired`}
            control={control as unknown as Control<FieldValues>}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <CSwitch
                    size="medium"
                    checked={question?.isRequired}
                    defaultChecked
                    className="ct-question-card-expanded__required-switch-control"
                    {...field}
                  />
                }
                {...field}
                labelPlacement="start"
                label={QUESTIONS.EXPANDED_QUESTION_CARD.requiredPlaceholder}
                className="ct-question-card-expanded__required-switch"
              />
            )}
          />
        </Box>
        <Box className="ct-question-card-expanded__header-right-content">
          <Box className="ct-question-card-expanded__badges">
            {question?.questionAdvancedSettings.visibilityRule.storeClusters
              .isApplicable && (
              <QuestionBadge type={QUESTION_BADGE_CONFIG.cluster.value} />
            )}
            {question?.questionAdvancedSettings.visibilityRule
              .basedOnPreviousAnswers.isApplicable && (
              <QuestionBadge type={QUESTION_BADGE_CONFIG.answer.value} />
            )}
            {question?.questionAdvancedSettings.visibilityRule.isRandom && (
              <QuestionBadge type={QUESTION_BADGE_CONFIG.random.value} />
            )}
            {question?.questionAdvancedSettings.visibilityRule
              .previousExecutionStatus.isApplicable && (
              <QuestionBadge type={QUESTION_BADGE_CONFIG.previous.value} />
            )}
            {question?.questionAdvancedSettings.tags.length > 0 && (
              <QuestionBadge
                type={
                  question?.questionAdvancedSettings.tags.length > 1
                    ? QUESTION_BADGE_CONFIG.tags.value
                    : QUESTION_BADGE_CONFIG.tag.value
                }
                count={question?.questionAdvancedSettings.tags.length}
              />
            )}
            {question?.questionAdvancedSettings.fileAttachments.isApplicable &&
              question?.questionAdvancedSettings.fileAttachments.attachments
                .attachmentType === "Photo" && (
                <QuestionBadge type={QUESTION_BADGE_CONFIG.photo.value} />
              )}
            {question?.questionAdvancedSettings.fileAttachments.isApplicable &&
              question?.questionAdvancedSettings.fileAttachments.attachments
                .attachmentType === "File" && (
                <QuestionBadge type={QUESTION_BADGE_CONFIG.file.value} />
              )}
            {question?.questionAdvancedSettings.numericValue.isApplicable &&
              question?.questionAdvancedSettings.numericValue.type ===
                "manual_input" && (
                <QuestionBadge type={QUESTION_BADGE_CONFIG.number.value} />
              )}
            {question?.questionAdvancedSettings.numericValue.isApplicable &&
              question?.questionAdvancedSettings.numericValue.type ===
                "temperature_reading" && (
                <QuestionBadge type={QUESTION_BADGE_CONFIG.temperature.value} />
              )}
          </Box>
          <CDivider orientation="vertical" />
          <Box className="ct-question-card-expanded__actions-icons">
            <CIconButton
              disabled={!isAddQuestionAllowed}
              onClick={() => handleQuestionAdd(question.qId)}
              size="medium"
              walkMeId={[...walkMeIdPrefix, "card-expanded", "add"]}
            >
              <CSvgIcon component={AddIcon} />
            </CIconButton>
            <CIconButton
              onClick={handleCloneQuestion}
              disabled={!isAddQuestionAllowed}
              size="medium"
              walkMeId={[...walkMeIdPrefix, "card-expanded", "clone"]}
            >
              <CSvgIcon component={Copy} />
            </CIconButton>
            {watchQuestionList.length > 1 && (
              <CIconButton
                onClick={handleDeleteQuestionClick}
                severity="destructive"
                disabled={
                  (formErrors as { questions?: unknown }).questions &&
                  !(formErrors as { questions?: unknown }).questions?.[
                    Number(index) - 1
                  ]
                }
                size="medium"
                walkMeId={[...walkMeIdPrefix, "card-expanded", "delete"]}
              >
                <CSvgIcon component={Delete} />
              </CIconButton>
            )}
            <CIconButton
              onClick={() => toggleExpand(question?.qId)}
              size="medium"
              walkMeId={[...walkMeIdPrefix, "card-expanded", "collapse"]}
            >
              <CSvgIcon component={ChevronUpLarge} />
            </CIconButton>
          </Box>
        </Box>
      </Box>
    );
  };
  /**
   * @method renderBasicTab
   * @description Renders the basic tab content with question label and type selection
   * @return {React.ReactNode} Basic tab JSX element
   */
  const renderBasicTab = () => {
    return (
      <Box className="ct-question-card-expanded__basic-tab-content">
        <Box className="ct-question-card-expanded__question-header">
          <Controller
            name={`${questionFormPath}.questionBasicData.title`}
            control={control as unknown as Control<FieldValues>}
            render={({ field, fieldState: { error } }) => {
              return (
                <CRichTextEditor
                  placeholder={
                    QUESTIONS.QUESTION_CARD.QUESTION_TITLE_PLACEHOLDER
                  }
                  {...field}
                  error={!!error}
                  attachments={attachments}
                  onUpdateAttachments={onUpdateAttachments}
                  walkMeIdPrefix={[...walkMeIdPrefix, "question-title"]}
                />
              );
            }}
          />
          <Box className="ct-question-card-expanded__question-type-selection-container">
            <CSelect
              options={QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN}
              optionLabelKey="label"
              optionValueKey="value"
              className="ct-question-card-expanded__question-type-selection"
              value={questionType}
              onChange={handleQuestionTypeChange}
            />

            {renderConditionsBasedOnType()}
          </Box>
        </Box>
        <Box>{renderOptionsBasedOnType()}</Box>
      </Box>
    );
  };

  /**
   * @method renderAdvanceTab
   * @description Renders the advance tab content
   * @return {React.ReactNode} Advance tab JSX element
   */
  const renderAdvanceTab = () => {
    return (
      <Box className="ct-question-card-expanded__advance-tab-content">
        <AdvanceTab
          questionFormPath={questionFormPath}
          question={question}
          questionIndex={index}
        />
      </Box>
    );
  };
  /**
   * @method renderBody
   * @description Renders the tab container with basic and advance tabs
   * @return {React.ReactNode} Body JSX element with tabs
   */
  const renderBody = () => {
    return (
      <Box className="ct-question-card-expanded__tab-container">
        <CTabs
          onChange={handleTabChange}
          value={currentTab}
        >
          <Tab
            label={QUESTIONS.EXPANDED_QUESTION_CARD_TAB_LABELS.BASIC.label}
            value={QUESTIONS.EXPANDED_QUESTION_CARD_TAB_LABELS.BASIC.value}
          />
          <Tab
            label={QUESTIONS.EXPANDED_QUESTION_CARD_TAB_LABELS.ADVANCED.label}
            value={QUESTIONS.EXPANDED_QUESTION_CARD_TAB_LABELS.ADVANCED.value}
          />
        </CTabs>
        <TabPanel
          value={
            currentTab ===
            QUESTIONS.EXPANDED_QUESTION_CARD_TAB_LABELS.BASIC.value
          }
        >
          {renderBasicTab()}
        </TabPanel>
        <TabPanel
          value={
            currentTab ===
            QUESTIONS.EXPANDED_QUESTION_CARD_TAB_LABELS.ADVANCED.value
          }
        >
          {renderAdvanceTab()}
        </TabPanel>
      </Box>
    );
  };
  return (
    <CSortableItem
      id={String(question?.qId)}
      enableCustomDragHandle={true}
    >
      {(dragHandleContext: DragHandleProps) => (
        <>
          <Box
            className={clsx({
              "ct-question-card-expanded": true,
              "ct-question-card-expanded--error":
                currentTab ===
                  QUESTIONS.EXPANDED_QUESTION_CARD_TAB_LABELS.ADVANCED.value &&
                hasError,
            })}
          >
            {renderHeader(dragHandleContext)}
            {renderBody()}
          </Box>
          <InputTypeModal
            questionFormPath={questionFormPath}
            inputTypeModal={inputTypeModal}
            onClose={handleInputTypeModalClose}
          />
          <AnswerOptionSettingModal
            answerOptionSettingModal={answerOptionSettingModal}
            onClose={closeAnswerOptionSettingModal}
            onSubmit={handleOptionsSubmit}
            triggerCardModal={triggerCardModal}
            setTriggerCardModal={setTriggerCardModal}
            shouldProceedAllowed={shouldProceedAllowed}
            setShouldProceedAllowed={setShouldProceedAllowed}
          />
          <TriggerModal
            type={triggerCardModal.type}
            data={
              triggerCardModal.type === TRIGGER_TYPE.followup
                ? followupSampleData
                : notificationSampleData
            }
            showModal={triggerCardModal.status}
            handleCloseModal={closeTriggerCardModal}
            walkMeIdPrefix={[
              ...walkMeIdPrefix,
              "delete",
              "question",
              "confirmation-modal",
            ]}
          />
          <CModal
            open={deleteQuestionConfirmationModal}
            onConfirm={handleConfirmQuestionDelete}
            onClose={handleCloseQuestionDeleteModal}
            title={DELETE_CONFIRMATION.QUESTION.title + "  " + index}
            showActions={true}
            size="small"
            severity={BUTTON_SEVERITY.destructive}
            confirmText={DELETE_CONFIRMATION.QUESTION.confirmLabel}
            className="template-delete__modal-body"
            walkMeIdPrefix={[
              ...walkMeIdPrefix,
              "delete",
              "question",
              "confirmation-modal",
            ]}
          >
            <ModalBody>
              <Box className="template-delete__modal-body">
                <Typography>
                  {DELETE_CONFIRMATION.QUESTION.messageFirstPart +
                    " " +
                    index +
                    "?"}
                </Typography>
                <Typography>
                  {DELETE_CONFIRMATION.QUESTION.messageSecondPart}
                </Typography>
              </Box>
            </ModalBody>
          </CModal>

          {question.subQuestions && question.subQuestions.length > 0
            ? question.subQuestions?.map((question, index) => {
                return (
                  <RenderQuestion
                    key={question.qId + "_subQuestion_" + index}
                    index={index}
                    question={question}
                    expandedList={expandedList}
                    toggleExpand={toggleExpand}
                    questionFormPath={`${questionFormPath}.subQuestions[${index}]`}
                    handleQuestionAdd={handleQuestionAdd}
                    isAddQuestionAllowed={isAddQuestionAllowed}
                    walkMeIdPrefix={[...walkMeIdPrefix, "sub-question"]}
                  />
                );
              })
            : ""}
        </>
      )}
    </CSortableItem>
  );
};

export default QuestionCardExpanded;
