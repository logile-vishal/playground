import React, { useEffect, useState } from "react";
import { Box, FormControlLabel, Tab, Typography } from "@mui/material";

import {
  QUESTION_OPTION_LABELS,
  QUESTION_TYPES_OPTIONS,
} from "@/pages/create-template/constants/questions";
import { DraggableDots } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import CSelect from "@/core/components/select/Select";
import { AddIcon, Copy, Delete, ChevronUpLarge } from "@/core/constants/icons";
import CIconButton from "@/core/components/button/IconButton";
import CTextfield from "@/core/components/form/textfield/Textfield";
import CSwitch from "@/core/components/switch/Switch";
import type { QuestionCardProps } from "@/pages/create-template/types/questions.type";
import CTabs from "@/core/components/tabs/Tabs";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import CRichTextEditor from "@/core/components/rich-text-editor/RichTextEditor";

import { QuestionBadge } from "../question-card-collapsed/QuestionBadges";
import QuestionCardOptionsComponent from "../question-card-options/QuestionCardOptions";
import "./QuestionCardExpanded.scss";

function TabPanel(props) {
  const { children, value } = props;
  return <div>{value && <Box>{children}</Box>}</div>;
}

/* TODO demo: A shared component for divider will be created later */
const Divider = () => (
  <Box className="ct-question-card-expanded__divider">
    <span></span>
  </Box>
);

const QuestionCardExpanded: React.FC<QuestionCardProps> = ({
  question,
  toggleExpand,
}) => {
  const { QUESTIONS, QUESTION_BADGE_CONFIG } = useCreateTemplateTranslations();
  const [currentTab, setCurrentTab] = useState(
    QUESTIONS.EXPANDED_QUESTION_CARD_TAB_LABELS.BASIC.value
  );
  const [questionType, setQuestionType] = useState(
    QUESTION_TYPES_OPTIONS[0].value
  );
  const [attachments, setAttachments] = useState<File[]>([]);

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
   * @method renderOptionsBasedOnType
   * @description Renders question options component based on selected question type
   * @return {React.ReactNode|undefined} Options component or undefined
   */
  const renderOptionsBasedOnType = () => {
    switch (questionType) {
      case QUESTION_OPTION_LABELS.RADIO:
      case QUESTION_OPTION_LABELS.DROPDOWN:
        return <QuestionCardOptionsComponent isVisible={true} />;
    }
  };

  /**
   * @method renderConditionsBasedOnType
   * @description Renders conditional fields based on selected question type
   * @return {React.ReactNode|null} Conditional fields or null
   */
  const renderConditionsBasedOnType = () => {
    switch (questionType) {
      case QUESTION_OPTION_LABELS.LONG_INPUT:
        return (
          <Box className="ct-question-card-expanded__long-input-fields">
            <CTextfield
              label={QUESTIONS.EXPANDED_QUESTION_CARD.minLengthPlaceholder}
              className="ct-question-card-expanded__long-input"
            />
            <CTextfield
              label={QUESTIONS.EXPANDED_QUESTION_CARD.maxLengthPlaceholder}
              className="ct-question-card-expanded__long-input"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    setQuestionType(question?.optiontypeLabel);
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
            <Typography>{`${question?.orderIndex}.`}</Typography>
          </Box>
          <Divider />
          <FormControlLabel
            control={
              <CSwitch
                size="medium"
                checked={question?.isRequired}
                defaultChecked
                disableRipple
                className="ct-question-card-expanded__required-switch-control"
              />
            }
            labelPlacement="start"
            label={QUESTIONS.EXPANDED_QUESTION_CARD.requiredPlaceholder}
            className="ct-question-card-expanded__required-switch"
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
          <Divider />
          <Box className="ct-question-card-expanded__actions-icons">
            <CIconButton disableHover={true}>
              <CSvgIcon
                size={22}
                component={AddIcon}
                color="secondary"
              />
            </CIconButton>
            <CIconButton disableHover={true}>
              <CSvgIcon
                size={22}
                component={Copy}
                color="secondary"
              />
            </CIconButton>
            <CIconButton disableHover={true}>
              <CSvgIcon
                size={22}
                component={Delete}
                color="violation"
              />
            </CIconButton>
            <CIconButton
              onClick={() => toggleExpand(question?.id)}
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
          <CRichTextEditor
            value={question?.label}
            onChange={question?.onLabelChange}
            placeholder={QUESTIONS.QUESTION_CARD.QUESTION_TITLE_PLACEHOLDER}
            error={!question?.label} // TODO: Change error condition and onChange after form integration done
            attachments={attachments}
            onUpdateAttachments={onUpdateAttachments}
            walkMeIdPrefix={["create template", "question card expanded"]}
          />
          <Box className="ct-question-card-expanded__question-type-selection-container">
            <CSelect
              options={QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN}
              optionLabelKey="label"
              optionValueKey="value"
              className="ct-question-card-expanded__question-type-selection"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as string)}
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
    <Box className="ct-question-card-expanded">
      {renderHeader()}
      {renderBody()}
    </Box>
  );
};

export default QuestionCardExpanded;
