import React from "react";
import { Box, Typography } from "@mui/material";

import clsx from "@/utils/clsx";
import CSvgIcon from "@/core/components/icon/Icon";
import { ChevronDown, DraggableDots } from "@/core/constants/icons";
import WildcardLabel from "@/core/components/wildcard-label/WildcardLabel";
import { FEATURE_ACTION_CHIP_LABELS } from "@/pages/create-template/constants/questions";
import type { QuestionCardProps } from "@/pages/create-template/types/questions.type";

import { QuestionBadge } from "./QuestionBadges";
import "./QuestionCardCollapsed.scss";

const QuestionCardCollapsed: React.FC<QuestionCardProps> = ({
  question,
  toggleExpand,
}) => {
  const {
    CLUSTER,
    ANSWER,
    RANDOM,
    PREVIOUS,
    PHOTO,
    TAGS,
    FILE,
    NUMBER,
    TEMPERATURE,
  } = FEATURE_ACTION_CHIP_LABELS;

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
        <Typography>{`${question?.orderIndex}.`}</Typography>
      </Box>

      <Box className="ques-card-collapsed__label">
        <WildcardLabel label={question?.label} />
      </Box>

      <Box className="ques-card-collapsed__badges">
        {question?.isClusterBadgeVisible && <QuestionBadge type={CLUSTER} />}
        {question?.isAnswerBadgeVisible && <QuestionBadge type={ANSWER} />}
        {question?.isRandomBadgeVisible && <QuestionBadge type={RANDOM} />}
        {question?.isPreviousBadgeVisible && <QuestionBadge type={PREVIOUS} />}
        {question?.isPhotoBadgeVisible && <QuestionBadge type={PHOTO} />}
        {question?.isTagBadgeVisible && (
          <QuestionBadge
            type={TAGS}
            count={3} // TODO: replace with actual tag count when available
          />
        )}
        {question?.isFileBadgeVisible && <QuestionBadge type={FILE} />}
        {question?.isNumberBadgeVisible && <QuestionBadge type={NUMBER} />}
        {question?.isTemperatureBadgeVisible && (
          <QuestionBadge type={TEMPERATURE} />
        )}
      </Box>

      {isDividerVisible() && (
        <Box className="ques-card-collapsed__divider">
          <span></span>
        </Box>
      )}
      <Box
        onClick={() => toggleExpand(question?.id)}
        className="ques-card-collapsed__chevron-down"
      >
        <CSvgIcon
          component={ChevronDown}
          color="secondary"
        />
      </Box>
    </Box>
  );
};
export default QuestionCardCollapsed;
