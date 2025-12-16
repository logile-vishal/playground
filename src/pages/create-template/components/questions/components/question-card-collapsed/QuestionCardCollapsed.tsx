import { Box, Typography } from "@mui/material";

import { ChevronDown, DraggableDots } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import clsx from "@/utils/clsx";
import WildcardLabel from "@/core/components/wildcard-label/WildcardLabel";
import { FEATURE_ACTION_CHIP_LABELS } from "@/pages/create-template/constants/questions";
import type { QuestionCardCollapsedProps } from "@/pages/create-template/types/questions.type";

import { QuestionBadge } from "./QuestionBadges";
import "./QuestionCardCollapsed.scss";

const QuestionCardCollapsed = (props: QuestionCardCollapsedProps) => {
  const isDividerVisible = () => {
    return !!(
      props.isTagBadgeVisible ||
      props.isPhotoBadgeVisible ||
      props.isFileBadgeVisible ||
      props.isRandomBadgeVisible ||
      props.isClusterBadgeVisible ||
      props.isAnswerBadgeVisible ||
      props.isPreviousBadgeVisible ||
      props.isNumberBadgeVisible ||
      props.isTemperatureBadgeVisible
    );
  };

  return (
    <Box
      className={clsx({
        "ques-card-collapsed": true,
        "ques-card-collapsed--error": props.hasError,
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
          props.isRequired ? "required" : ""
        }`}
      >
        <Typography>{`${props.orderIndex}.`}</Typography>
      </Box>

      <Box className="ques-card-collapsed__label">
        <WildcardLabel label={props.label} />
      </Box>

      <Box className="ques-card-collapsed__badges">
        {props.isClusterBadgeVisible && (
          <QuestionBadge type={FEATURE_ACTION_CHIP_LABELS.CLUSTER} />
        )}
        {props.isAnswerBadgeVisible && (
          <QuestionBadge type={FEATURE_ACTION_CHIP_LABELS.ANSWER} />
        )}
        {props.isRandomBadgeVisible && (
          <QuestionBadge type={FEATURE_ACTION_CHIP_LABELS.RANDOM} />
        )}
        {props.isPreviousBadgeVisible && (
          <QuestionBadge type={FEATURE_ACTION_CHIP_LABELS.PREVIOUS} />
        )}
        {props.isPhotoBadgeVisible && (
          <QuestionBadge type={FEATURE_ACTION_CHIP_LABELS.PHOTO} />
        )}
        {props.isTagBadgeVisible && (
          <QuestionBadge
            type={FEATURE_ACTION_CHIP_LABELS.TAGS}
            count={3} // TODO: replace with actual tag count when available
          />
        )}
        {props.isFileBadgeVisible && (
          <QuestionBadge type={FEATURE_ACTION_CHIP_LABELS.FILE} />
        )}
        {props.isNumberBadgeVisible && (
          <QuestionBadge type={FEATURE_ACTION_CHIP_LABELS.NUMBER} />
        )}
        {props.isTemperatureBadgeVisible && (
          <QuestionBadge type={FEATURE_ACTION_CHIP_LABELS.TEMPRATURE} />
        )}
      </Box>

      {isDividerVisible() && (
        <Box className="ques-card-collapsed__divider">
          <span></span>
        </Box>
      )}
      <Box className="ques-card-collapsed__chevron-down">
        <CSvgIcon
          component={ChevronDown}
          color="secondary"
        />
      </Box>
    </Box>
  );
};
export default QuestionCardCollapsed;
