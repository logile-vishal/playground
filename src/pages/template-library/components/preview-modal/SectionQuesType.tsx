import React, { useState } from "react";
import { Chip, Box } from "@mui/material";

import CSvgIcon from "@/core/components/icon/Icon";
import { ChevronDown, ChevronDownUp } from "@/core/constants/icons";
import clsx from "@/utils/clsx";

import type { QuestionType } from "../../types/template-questions.type";
import type { RenderSectionProps } from "../../types/template-preview.type";
import "./SectionQuesType.scss";

const RenderSection: React.FC<RenderSectionProps> = ({
  question,
  parentIndex,
  isDesktopPreview,
  renderChecklistComponent,
  templateBaseType,
  QUESTION_TYPES,
  DATE_INPUT_TYPE,
  QUESTION_ATTACHMENT,
  ATTACHMENT_BUTTON_CONFIG,
}) => {
  const [expanded, setExpanded] = useState(true);
  const renderSectionBody = () => {
    return (
      <Box
        className={clsx({
          "question-accordion__details": true,
          "question-accordion__details-mobile": !isDesktopPreview,
        })}
      >
        {question?.subQuestions?.map((item: QuestionType, index: number) =>
          renderChecklistComponent(
            item,
            `${parentIndex}${index + 1}`,
            isDesktopPreview,
            templateBaseType,
            QUESTION_TYPES,
            DATE_INPUT_TYPE,
            QUESTION_ATTACHMENT,
            ATTACHMENT_BUTTON_CONFIG
          )
        )}
      </Box>
    );
  };
  const renderSectionHeader = () => {
    return (
      <Box className="question-accordion__header-wrapper">
        <Chip
          label={question?.qcontent}
          className={clsx({
            "question-accordion__chip": true,
            "question-accordion__chip-mobile": !isDesktopPreview,
          })}
        />
        <Box className="question-accordion__header-right">
          {!expanded &&
            isDesktopPreview &&
            question?.subQuestions?.length > 0 && (
              <Box className="question-accordion__count">
                {question?.subQuestions?.length} Questions
              </Box>
            )}
          <Box
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }}
            className={clsx({
              "question-accordion__icon": true,
              "question-accordion__icon--mobile": !isDesktopPreview,
            })}
          >
            <CSvgIcon
              component={expanded ? ChevronDownUp : ChevronDown}
              size={24}
            />
          </Box>
        </Box>
      </Box>
    );
  };
  return (
    <div
      className={clsx({
        "question-accordion": true,
        "question-accordion--mobile": !isDesktopPreview,
      })}
    >
      {renderSectionHeader()}
      {expanded && renderSectionBody()}
    </div>
  );
};

export default RenderSection;
