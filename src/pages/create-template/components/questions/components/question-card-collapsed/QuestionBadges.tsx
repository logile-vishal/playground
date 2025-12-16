import { Chip, styled } from "@mui/material";
import CSvgIcon from "@/core/components/icon/Icon";
import {
  BADGE_CONFIG,
  FEATURE_ACTION_CHIP_LABELS,
} from "@/pages/create-template/constants/questions";
import { isNonEmptyValue } from "@/utils/index";

import { questionBadgePalette } from "./QuestionBadgePalette";
import type {
  ButtonConfigProps,
  QuestionBadgeProps,
} from "@/pages/create-template/types/questions.type";

export const StyledChip = styled(Chip)(() => ({
  "--chip-height": "18px",
  borderRadius: "var(--radius-full)",
  padding: "var(--space-none) var(--space-m)",
  height: "var(--chip-height)",

  "& .MuiChip-label": {
    textAlign: "center",
    fontFamily: "var(--logile-family-body-family)",
    fontSize: "var(--logile-size-secondary-text)",
    fontStyle: "normal",
    fontWeight: "var(--logile-weight-400)",
    lineHeight: "var(--line-height-secondary-text)",
    textTransform: "capitalize",
  },
}));

/**
 * @component QuestionBadge
 * @description Renders a styled badge based on the given badge type and optional count.
 * @param {QuestionBadgeProps} props - Component props.
 * @param {QuestionBadgeVariant} props.type - The badge variant to render.
 * @param {number} [props.count] - Optional count used for tag labels.
 * @returns {JSX.Element} The rendered badge component.
 */
export const QuestionBadge = ({ type, count }: QuestionBadgeProps) => {
  const palette = questionBadgePalette[type];
  const config: ButtonConfigProps = BADGE_CONFIG[type];
  let label = config.label;
  const icon = config.icon;
  if (!label || !icon) return <></>;

  if (isNonEmptyValue(count)) {
    // TODO: replace with proper pluralization utility with translation support
    label = `${count} ${FEATURE_ACTION_CHIP_LABELS.TAGS}${count && count > 1 ? "s" : ""}`;
  }

  return (
    <StyledChip
      label={label}
      sx={palette}
      icon={
        <CSvgIcon
          component={icon}
          size={12}
          color={palette.iconColor}
        />
      }
    />
  );
};
