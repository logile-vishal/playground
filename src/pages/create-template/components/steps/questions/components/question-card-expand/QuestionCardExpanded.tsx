import React, { useEffect, useState } from "react";
import { Box, FormControlLabel, Tab, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import type { FieldValues, Control } from "react-hook-form";

import { QUESTION_TYPE } from "@/pages/create-template/constants/questions";
import { DraggableDots } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import { AddIcon, Copy, Delete, ChevronUpLarge } from "@/core/constants/icons";
import CIconButton from "@/core/components/button/IconButton";
import CTextfield from "@/core/components/form/textfield/Textfield";
import CSwitch from "@/core/components/form/switch/Switch";
import type {
  QuestionCardProps,
  QuestionProps,
  SectionTypeProps,
} from "@/pages/create-template/types/questions.type";
import CTabs from "@/core/components/tabs/Tabs";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import CDivider from "@/core/components/divider/Divider";
import CRichTextEditor from "@/core/components/form/rich-text-editor/RichTextEditor";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import useQuestionListManager from "@/pages/create-template/hooks/useQuestionListManager";
import { isNonEmptyValue } from "@/utils";
import CSelect from "@/core/components/form/select";

import { QuestionBadge } from "../question-card-collapsed/QuestionBadges";
import QuestionCardOptionsComponent from "../question-card-options/QuestionCardOptions";
import "./QuestionCardExpanded.scss";
import { RenderQuestion } from "../../Questions";

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
}) => {
  const { QUESTIONS, QUESTION_BADGE_CONFIG } = useCreateTemplateTranslations();
  const [currentTab, setCurrentTab] = useState(
    QUESTIONS.EXPANDED_QUESTION_CARD_TAB_LABELS.BASIC.value
  );
  const [questionType, setQuestionType] = useState<SectionTypeProps>(
    QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN[0]
  );
  const [attachments, setAttachments] = useState<File[]>([]);
  const { control, watch } = useCreateTemplateForm();
  const {
    addNewQuestion,
    modifyQuestionType,
    cloneExistingQuestion,
    deleteQuestion,
  } = useQuestionListManager();
  const watchQuestionList = watch("questions") as QuestionProps[];

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

  const handleQuestionTypeChange = (event: unknown) => {
    const target = (event as { target: { value: unknown } }).target;
    const newType = target.value as SectionTypeProps;
    const newQuestionId = modifyQuestionType(
      questionType?.value,
      newType.value,
      question.qId
    );
    setQuestionType(newType);
    if (newQuestionId) toggleExpand(newQuestionId);
  };

  /**
   * @method renderOptionsBasedOnType
   * @description Renders question options component based on selected question type
   * @return {React.ReactNode|undefined} Options component or undefined
   */
  const renderOptionsBasedOnType = () => {
    switch (questionType.value) {
      case QUESTION_TYPE.RADIO:
      case QUESTION_TYPE.DROPDOWN:
      case QUESTION_TYPE.CHECKBOX:
      case QUESTION_TYPE.DYNAMIC_DROPDOWN:
        return (
          <QuestionCardOptionsComponent
            key={question.qId}
            question={question}
            questionFormPath={`${questionFormPath}.questionBasicData.response`}
            isVisible={true}
          />
        );
    }
  };

  /**
   * @method renderConditionsBasedOnType
   * @description Renders conditional fields based on selected question type
   * @return {React.ReactNode|null} Conditional fields or null
   */
  const renderConditionsBasedOnType = () => {
    switch (questionType?.value) {
      case QUESTION_TYPE.LONG_INPUT:
        return (
          <Box className="ct-question-card-expanded__long-input-fields">
            <CTextfield
              type="number"
              label={QUESTIONS.EXPANDED_QUESTION_CARD.minLengthPlaceholder}
              className="ct-question-card-expanded__long-input"
            />
            <CTextfield
              type="number"
              label={QUESTIONS.EXPANDED_QUESTION_CARD.maxLengthPlaceholder}
              className="ct-question-card-expanded__long-input"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  const handleAddQuestion = () => {
    const qId = addNewQuestion(question.qId);
    toggleExpand(qId);
  };

  const handleDeleteQuestion = () => {
    deleteQuestion(question.qId);
  };

  const handleCloneQuestion = () => {
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
      setQuestionType(questionTypeData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  /**
   * @method renderHeader
   * @description Renders the expanded question card header with controls and badges
   * @return {React.ReactNode} Header JSX element
   */
  const renderHeader = () => {
    return (
      <Box className="ct-question-card-expanded__header">
        <Box className="ct-question-card-expanded__header-left-content">
          <Box className="ct-question-card-expanded__dnd">
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
            {question?.isPhotoBadgeVisible && (
              <QuestionBadge type={QUESTION_BADGE_CONFIG.photo.value} />
            )}
            {question?.isFileBadgeVisible && (
              <QuestionBadge type={QUESTION_BADGE_CONFIG.file.value} />
            )}
            {question?.isNumberBadgeVisible && (
              <QuestionBadge type={QUESTION_BADGE_CONFIG.number.value} />
            )}
          </Box>
          <CDivider orientation="vertical" />
          <Box className="ct-question-card-expanded__actions-icons">
            <CIconButton
              onClick={handleAddQuestion}
              disableHover={true}
            >
              <CSvgIcon
                size={22}
                component={AddIcon}
                color="secondary"
              />
            </CIconButton>
            <CIconButton
              onClick={handleCloneQuestion}
              disableHover={true}
            >
              <CSvgIcon
                size={22}
                component={Copy}
                color="secondary"
              />
            </CIconButton>
            {watchQuestionList.length > 1 && (
              <CIconButton
                onClick={handleDeleteQuestion}
                disableHover={true}
              >
                <CSvgIcon
                  size={22}
                  component={Delete}
                  color="violation"
                />
              </CIconButton>
            )}
            <CIconButton
              onClick={() => toggleExpand(question?.qId)}
              disableHover={true}
            >
              <CSvgIcon
                size={22}
                component={ChevronUpLarge}
                color="secondary"
              />
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
                  walkMeIdPrefix={["create template", "question card expanded"]}
                />
              );
            }}
          />
          <Box className="ct-question-card-expanded__question-type-selection-container">
            <CSelect
              options={QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN}
              optionLabelKey="label"
              className="ct-question-card-expanded__question-type-selection"
              value={questionType?.label}
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
      <Box className="ct-question-card-expanded__advance-tab-content"></Box>
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
    <>
      <Box className="ct-question-card-expanded">
        {renderHeader()}
        {renderBody()}
      </Box>
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
              />
            );
          })
        : ""}
    </>
  );
};

export default QuestionCardExpanded;
