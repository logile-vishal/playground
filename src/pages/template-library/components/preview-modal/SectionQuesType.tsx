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
import { ChevronDownUp, ChevronLeft } from "@/core/constants/icons";
import clsx from "@/utils/clsx";

import type { QuestionType } from "../../types/template-questions.type";
import type { RenderSectionProps } from "../../types/template-preview.type";
import "./SectionQuesType.scss";

const MuiAccordionSummary = styled(AccordionSummary)({
  "& .MuiAccordionSummary-expandIconWrapper": {
    transform: "none",
    transition: "none",
  },
});

const RenderSection: React.FC<RenderSectionProps> = ({
  question,
  parentIndex,
  isDesktopPreview,
  renderChecklistComponent,
  templateBaseType,
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="question-accordion">
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
                onClick={() => setExpanded(!expanded)}
                className={`question-accordion__icon ${
                  !expanded ? "question-accordion__icon--rotated" : ""
                }`}
              >
                <CSvgIcon
                  component={expanded ? ChevronDownUp : ChevronLeft}
                  size={24}
                />
              </Box>
            </Box>
          }
          className="question-accordion__summary"
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
