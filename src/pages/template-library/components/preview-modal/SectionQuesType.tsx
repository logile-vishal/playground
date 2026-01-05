import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import CSvgIcon from "@/core/components/icon/Icon";
import { ChevronDown, ChevronDownUp, ChevronUp } from "@/core/constants/icons";
import clsx from "@/utils/clsx";

import type { QuestionType } from "../../types/template-questions.type";
import type { RenderSectionProps } from "../../types/template-preview.type";
import "./SectionQuesType.scss";

const MuiAccordionSummary = styled(AccordionSummary)(() => ({
  "& .MuiAccordionSummary-expandIconWrapper": {
    transform: "none",
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "none",
  },
}));

const RenderSection: React.FC<RenderSectionProps> = ({
  question,
  parentIndex,
  isDesktopPreview,
  renderChecklistComponent,
  templateBaseType,
}) => {
  const [expanded, setExpanded] = useState(true);
  const expandIcon = isDesktopPreview
    ? expanded
      ? ChevronDownUp
      : ChevronDown
    : expanded
      ? ChevronUp
      : ChevronDown;
  return (
    <div
      className={clsx({
        "question-accordion": true,
        "question-accordion--mobile": !isDesktopPreview,
      })}
    >
      <Accordion
        expanded={expanded}
        className="question-accordion__wrapper"
      >
        <MuiAccordionSummary
          expandIcon={
            <Box className="question-accordion__header-wrapper">
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
                  component={expandIcon}
                  size={24}
                />
              </Box>
            </Box>
          }
          className={clsx({
            "question-accordion__summary": true,
            "question-accordion__summary--mobile": !isDesktopPreview,
          })}
        >
          <Chip
            label={question?.qcontent}
            className={clsx({
              "question-accordion__chip": true,
              "question-accordion__chip-mobile": !isDesktopPreview,
            })}
          />
        </MuiAccordionSummary>

        <AccordionDetails
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
              templateBaseType
            )
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default RenderSection;
