import React from "react";
import { Box, Typography } from "@mui/material";

import clsx from "@/utils/clsx";
import CSvgIcon from "@/core/components/icon/Icon";
import { ChevronDown, DraggableDots } from "@/core/constants/icons";
import WildcardLabel from "@/core/components/wildcard-label/WildcardLabel";
import type { QuestionCardProps } from "@/pages/create-template/types/questions.type";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import CDivider from "@/core/components/divider/Divider";

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
}) => {
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

  return (
    <>
      <Box
        className={clsx({
          "ques-card-collapsed": true,
          "ques-card-collapsed--error": question?.hasError,
        })}
      >
        <Box className="ques-card-collapsed__dnd">
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
          {question?.isClusterBadgeVisible && (
            <QuestionBadge type={QUESTION_BADGE_CONFIG.cluster.value} />
          )}
          {question?.isAnswerBadgeVisible && (
            <QuestionBadge type={QUESTION_BADGE_CONFIG.answer.value} />
          )}
          {question?.isRandomBadgeVisible && (
            <QuestionBadge type={QUESTION_BADGE_CONFIG.random.value} />
          )}
          {question?.isPreviousBadgeVisible && (
            <QuestionBadge type={QUESTION_BADGE_CONFIG.previous.value} />
          )}
          {question?.isPhotoBadgeVisible && (
            <QuestionBadge type={QUESTION_BADGE_CONFIG.photo.value} />
          )}
          {question?.isTagBadgeVisible && (
            <QuestionBadge
              type={QUESTION_BADGE_CONFIG.tag.value}
              count={3} // TODO: replace with actual tag count when available
            />
          )}
          {question?.isFileBadgeVisible && (
            <QuestionBadge type={QUESTION_BADGE_CONFIG.file.value} />
          )}
          {question?.isNumberBadgeVisible && (
            <QuestionBadge type={QUESTION_BADGE_CONFIG.number.value} />
          )}
          {question?.isTemperatureBadgeVisible && (
            <QuestionBadge type={QUESTION_BADGE_CONFIG.temperature.value} />
          )}
        </Box>

        {isDividerVisible() && <CDivider orientation="vertical" />}
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
  );
};
export default QuestionCardCollapsed;
