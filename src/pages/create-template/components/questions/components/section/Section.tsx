import { useState } from "react";
import { Box } from "@mui/material";

import {
  ChevronCollapse,
  ChevronDown,
  DraggableDots,
  Setting,
} from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import type { QuestionSectionProps } from "@/pages/create-template/types/questions.type";
import { QUESTION_TYPES } from "@/pages/template-library/constants/constant";
import clsx from "@/utils/clsx";

import "./Section.scss";
import QuestionCardCollapsed from "../question-card-collapsed/QuestionCardCollapsed";

const QuestionSection = (props: QuestionSectionProps) => {
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);

  const toggleSectionCollapse = () => {
    setIsSectionCollapsed(!isSectionCollapsed);
  };

  const sectionCollapsed = () => {
    return (
      <>
        <Box
          className={clsx({
            "question-section__collapsed": true,
            "question-section__collapsed--error": props.hasError,
          })}
        >
          <Box className="question-section__collapsed-content">
            <Box className="question-section__collapsed-content-dnd">
              <CSvgIcon
                size={24}
                component={DraggableDots}
              />
            </Box>
            <Box className="question-section__collapsed-content-title">
              {props.title}
            </Box>
          </Box>

          <Box
            className={clsx({
              "question-section__collapsed-content": true,
              "question-section__collapsed-content--right": true,
            })}
          >
            <Box className="question-section__collapsed-content-label">
              2 Questions
            </Box>
            <Box
              className="question-section__collapsed-content-icon"
              onClick={toggleSectionCollapse}
            >
              <CSvgIcon
                component={ChevronDown}
                color="secondary"
              />
            </Box>
          </Box>
        </Box>
      </>
    );
  };

  const sectionExpanded = () => {
    return (
      <>
        <Box className="question-section__header">
          <Box className="question-section__header-title">
            <Box className="question-section__header-title-text">
              {props.title}
            </Box>
            <Box className="question-section__header-title-icon">
              <CSvgIcon
                size={18}
                component={Setting}
              />
            </Box>
          </Box>
          <Box
            className="question-section__header-icon"
            onClick={toggleSectionCollapse}
          >
            <CSvgIcon
              size={16}
              component={ChevronCollapse}
              color="secondary"
            />
          </Box>
        </Box>
        <Box className="question-section__questions-wrapper">
          {/* TODO: Replace question data after API data */}
          {/* {props.data.map((question) => (
            <Box
              className="question-section__questions-item"
              key={question.id}
            >
              <QuestionCardCollapsed
                label={question.label}
                isRequired={question.isRequired}
                orderIndex={question.orderIndex}
                optiontypeLabel={QUESTION_TYPES.RADIO_BUTTON.label} 
                />
            </Box>
          ))} */}
          {/* TODO: Replace hardcoded data with mapped questions fetched from the API */}
          <Box className="question-section__questions-item">
            <QuestionCardCollapsed
              label="Which areas in the department require attention?"
              isRequired={true}
              orderIndex={"3.1"}
              optiontypeLabel={QUESTION_TYPES.RADIO_BUTTON.label}
              isPhotoBadgeVisible={true}
              isTagBadgeVisible={true}
              isFileBadgeVisible={true}
            />
          </Box>
          <Box className="question-section__questions-item">
            <QuestionCardCollapsed
              label="Describe any issues found during inspection."
              isRequired={true}
              orderIndex={"3.2"}
              optiontypeLabel={QUESTION_TYPES.USER_INPUT.label}
              isAnswerBadgeVisible={true}
              isPreviousBadgeVisible={true}
            />
          </Box>
        </Box>
      </>
    );
  };

  return (
    <Box className="question-section">
      {isSectionCollapsed ? sectionCollapsed() : sectionExpanded()}
    </Box>
  );
};
export default QuestionSection;
