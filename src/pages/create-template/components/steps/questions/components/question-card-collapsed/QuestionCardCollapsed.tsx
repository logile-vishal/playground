import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";

import clsx from "@/utils/clsx";
import CSvgIcon from "@/core/components/icon/Icon";
import { ChevronDown, DraggableDots } from "@/core/constants/icons";
import WildcardLabel from "@/core/components/wildcard-label/WildcardLabel";
import type { QuestionCardProps } from "@/pages/create-template/types/questions.type";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import CDivider from "@/core/components/divider/Divider";
import { CSortableItem } from "@/core/components/drag-drop";
import type { DragHandleProps } from "@/core/components/drag-drop/types/DragAndDrop.type";

import { QuestionBadge } from "./QuestionBadges";
import { RenderQuestion } from "../../Questions";
import "./QuestionCardCollapsed.scss";

const QuestionCardCollapsed: React.FC<QuestionCardProps> = ({
  index,
  question,
  questionFormPath,
  expandedList,
  toggleExpand,
  handleQuestionAdd,
  isAddQuestionAllowed,
  hasError,
}) => {
  const { QUESTIONS } = useCreateTemplateTranslations();
  const { QUESTION_BADGE_CONFIG } = useCreateTemplateTranslations();

  /**
   * @method isDividerVisible
   * @description Checks if any badge visibility flag is enabled to show divider
   * @return {boolean} True if any badge is visible, false otherwise
   */
  // Todo Demo: remove hardcoded count and add logic later
  const isDividerVisible = () => {
    return !!(
      question?.isTagBadgeVisible ||
      question?.isPhotoBadgeVisible ||
      question?.isFileBadgeVisible ||
      question?.isRandomBadgeVisible ||
      question?.isClusterBadgeVisible ||
      question?.isAnswerBadgeVisible ||
      question?.isPreviousBadgeVisible ||
      question?.isNumberBadgeVisible ||
      question?.isTemperatureBadgeVisible
    );
  };

  const questionTypeMap = useMemo(() => {
    return QUESTIONS.QUESTION_OPTION_TYPES_DROPDOWN.reduce(
      (acc, curr) => {
        acc[curr.value] = curr.label;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [QUESTIONS]);

  return (
    <CSortableItem
      id={String(question?.qId)}
      enableCustomDragHandle={true}
    >
      {(dragHandleContext: DragHandleProps) => (
        <>
          <Box
            className={clsx({
              "ques-card-collapsed": true,
              "ques-card-collapsed--error": hasError,
            })}
          >
            <Box
              className="ques-card-collapsed__dnd"
              {...dragHandleContext.attributes}
              {...dragHandleContext.listeners}
            >
              <CSvgIcon
                size={24}
                component={DraggableDots}
              />
            </Box>
            <Box
              className={`ques-card-collapsed__order-index ${
                question?.isRequired ? "required" : ""
              }`}
            >
              <Typography>{`${index}.`}</Typography>
            </Box>

            <Box className="ques-card-collapsed__label">
              <WildcardLabel label={question?.questionBasicData?.title} />
            </Box>

            <Box className="ques-card-collapsed__badges">
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
                    question?.questionAdvancedSettings.tags.length === 1
                      ? QUESTION_BADGE_CONFIG.tag.value
                      : QUESTION_BADGE_CONFIG.tags.value
                  }
                  count={question?.questionAdvancedSettings.tags.length}
                />
              )}
              {question?.questionAdvancedSettings.fileAttachments
                .isApplicable &&
                question?.questionAdvancedSettings.fileAttachments.attachments
                  .attachmentType === "Photo" && (
                  <QuestionBadge type={QUESTION_BADGE_CONFIG.photo.value} />
                )}
              {question?.questionAdvancedSettings.fileAttachments
                .isApplicable &&
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
                  <QuestionBadge
                    type={QUESTION_BADGE_CONFIG.temperature.value}
                  />
                )}
            </Box>

            {isDividerVisible() && <CDivider orientation="vertical" />}
            <Box className="ques-card-collapsed__type-label">
              <span>
                {questionTypeMap?.[question.questionBasicData.questionType]}
              </span>
            </Box>
            <Box
              onClick={() => toggleExpand(question?.qId)}
              className="ques-card-collapsed__chevron-down"
            >
              <CSvgIcon
                component={ChevronDown}
                color="secondary"
              />
            </Box>
          </Box>
          {question.subQuestions && question.subQuestions.length > 0
            ? question.subQuestions?.map((question, index) => {
                return (
                  <RenderQuestion
                    key={question?.qId + "_subQuestion_" + index}
                    index={index}
                    question={question}
                    expandedList={expandedList}
                    toggleExpand={toggleExpand}
                    questionFormPath={`${questionFormPath}.subQuestions[${index}]`}
                    handleQuestionAdd={handleQuestionAdd}
                    isAddQuestionAllowed={isAddQuestionAllowed}
                  />
                );
              })
            : ""}
        </>
      )}
    </CSortableItem>
  );
};
export default QuestionCardCollapsed;
