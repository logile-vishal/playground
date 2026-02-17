import { Chip, styled } from "@mui/material";

import CSvgIcon from "@/core/components/icon/Icon";
import { isNonEmptyValue } from "@/utils/index";
import type {
  ButtonConfigProps,
  QuestionBadgeProps,
} from "@/pages/create-template/types/questions.type";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";

import { questionBadgePalette } from "./QuestionBadgePalette";

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
  "& .MuiChip-label::first-letter": {
    textTransform: "uppercase",
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
  const { QUESTION_BADGE_CONFIG } = useCreateTemplateTranslations();
  const palette = questionBadgePalette[type];
  const config: ButtonConfigProps = QUESTION_BADGE_CONFIG[type];
  let label = config?.label;
  const icon = config?.icon;
  if (!label || !icon) return <></>;

  if (isNonEmptyValue(count)) {
    label = `${count} ${config.label}`;
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
