import { useMemo, useState } from "react";
import { Box } from "@mui/material";

import CSvgIcon from "@/core/components/icon/Icon";
import type { FollowupColumnProps } from "@/pages/create-template/types/followup.type";
import { TEXT_CONTENT } from "@/pages/create-template/constants/constant";
import { truncateLabel } from "@/utils/truncate-label";
import clsx from "@/utils/clsx";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";

import "./FollowUpCard.scss";

const FollowupColumn: React.FC<FollowupColumnProps> = ({
  title,
  value,
  className,
  iconVisible,
  icon,
  enableSeeMore,
}) => {
  const { FOLLOWUP_TASKS } = useCreateTemplateTranslations();
  const [isLabelExpanded, setIsLabelExpanded] = useState(false);

  /**
   * @function truncatedValue
   * @description generates truncated text if the value is a string and if isLabelExpanded is false.
   * @returns {string | any} truncatedValue - Truncated string or original value.
   */
  const truncatedValue = useMemo(() => {
    if (typeof value === "string") {
      return truncateLabel(value, TEXT_CONTENT.textLength, !isLabelExpanded);
    }
    return value;
  }, [value, isLabelExpanded]);

  /**
   * @function isTextTruncated
   * @description Checks whether the text exceeds the truncation limit.
   * @returns {boolean} True if text is longer than the limit.
   */
  const isTextTruncated = useMemo(() => {
    if (typeof value === "string") {
      return value.length > TEXT_CONTENT.textLength;
    }
    return false;
  }, [value]);

  return (
    <Box className={clsx({ [className]: true })}>
      <Box className="followup-card__title">
        {title}
        {iconVisible && (
          <CSvgIcon
            component={icon}
            size={16}
            color="secondary"
          />
        )}
      </Box>
      <Box
        className={clsx({
          "followup-card__content": true,
        })}
      >
        {truncatedValue}
        {enableSeeMore && !isLabelExpanded && isTextTruncated && (
          <span
            onClick={() => setIsLabelExpanded(true)}
            className="followup-card__content-label-truncate-btn"
          >
            {FOLLOWUP_TASKS.seeMoreButtonLabel}
          </span>
        )}
        {enableSeeMore && isLabelExpanded && (
          <span
            onClick={() => setIsLabelExpanded(false)}
            className="followup-card__content-label-truncate-btn"
          >
            {FOLLOWUP_TASKS.seeLessButtonLabel}
          </span>
        )}
      </Box>
    </Box>
  );
};

export default FollowupColumn;
