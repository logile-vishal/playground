import type React from "react";
import { Box } from "@mui/material";

import CSvgIcon from "@/core/components/icon/Icon";
import CIconButton from "@/core/components/button/IconButton";
import {
  Copy,
  Delete,
  Edit,
  QuickShift,
  TeamLine,
} from "@/core/constants/icons";
import type {
  FollowUpCardProps,
  NotificationCardProps,
} from "@/pages/create-template/types/triggers.type";
import WildcardLabel from "@/core/components/wildcard-label/WildcardLabel";
import {
  TRIGGER_TYPE,
  TRIGGER_ANSWER,
} from "@/pages/create-template/constants/constant";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { TruncateTextWithSeeMore } from "@/utils/truncate-label";
import clsx from "@/utils/clsx";
import { convertToTitleCase } from "@/utils/convert-to-title-case";

import "./TriggerCard.scss";
import { CUSTOM_RECIPIENT_LABEL } from "../../constants/notifications";

const TriggerCard: React.FC<NotificationCardProps | FollowUpCardProps> = ({
  item,
  triggeredByAnswers,
  type,
  handleEdit,
  handleDelete,
  handleClone,
  index,
  getQuestionLabelById,
  getAnswerLabelById,
  walkMeIdPrefix,
}) => {
  const { NOTIFICATIONS, FOLLOWUP_TASKS } = useCreateTemplateTranslations();
  const dataConstant =
    type === TRIGGER_TYPE.notification ? NOTIFICATIONS : FOLLOWUP_TASKS;

  /**
   * @function renderListColumn
   * @description Renders a list column with title and content
   * @param {string} title - Column title
   * @param {React.ReactNode} value - Column content value
   * @param {string} className - CSS class name
   * @param {boolean} iconVisible - Whether to show icon
   * @param {React.ReactNode} icon - Icon component
   * @return {React.ReactNode} List column JSX
   */
  const renderListColumn = ({
    title,
    value,
    className,
    iconVisible,
    icon,
    index,
  }: {
    title: string;
    value: React.ReactNode;
    className: string;
    index?: number;
    iconVisible?: boolean;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  }): React.ReactNode => {
    return (
      <Box className={clsx({ [className]: true })}>
        <Box className="trigger-card__title">
          {title}
          {iconVisible ? (
            <CSvgIcon
              component={icon}
              size={16}
              color={"secondary"}
            />
          ) : null}
        </Box>
        <Box className="trigger-card__content">
          <TruncateTextWithSeeMore
            text={value}
            lines={2}
            index={index}
          />
        </Box>
      </Box>
    );
  };

  return (
    <Box className="trigger-card">
      <Box className="trigger-card__content">
        {triggeredByAnswers ? (
          <>
            {renderListColumn({
              title: dataConstant.CARD_COLUMN_HEADINGS.conditionQuestion,
              value: `${getQuestionLabelById(item.questionId)}`,
              index,
              className: "trigger-card__content-question",
            })}
            {renderListColumn({
              title: dataConstant.CARD_COLUMN_HEADINGS.conditionAnswer,
              value: getAnswerLabelById(item.questionId, item.answerIndex),
              className: "trigger-card__content-answer",
            })}
          </>
        ) : (
          <>
            {renderListColumn({
              title: dataConstant.CARD_COLUMN_HEADINGS.condition,
              value: convertToTitleCase(item.condition),
              className: "trigger-card__content-condition",
            })}
          </>
        )}
        {renderListColumn({
          title:
            type === TRIGGER_TYPE.notification
              ? NOTIFICATIONS.CARD_COLUMN_HEADINGS.messageSubject
              : FOLLOWUP_TASKS.CARD_COLUMN_HEADINGS.taskName,
          value: (
            <WildcardLabel
              label={
                type === TRIGGER_TYPE.notification
                  ? ((item as NotificationCardProps["item"])?.messageTemplates
                      ?.subject ?? "")
                  : (item as FollowUpCardProps["item"]).triggerTaskName
              }
              truncate={false}
            />
          ),
          className: "trigger-card__content-message",
        })}
        {renderListColumn({
          title: dataConstant.CARD_COLUMN_HEADINGS.recipients,
          value: (() => {
            const recipientsList = convertToTitleCase(
              item.recipients.join(", ")
            );
            const hasCustomRecipients =
              item.recipientOrgs?.length > 0 &&
              item.recipientOrgTypes?.length > 0 &&
              item.recipientPositions?.length > 0;

            // Add "Ad Hoc" label if there are custom recipients along with regular recipients
            return hasCustomRecipients
              ? `${recipientsList}${recipientsList ? ", " : ""}${CUSTOM_RECIPIENT_LABEL}`
              : recipientsList;
          })(),
          className: "trigger-card__content-recipients",
          iconVisible: item.recipients.length > 0,
          icon:
            item.recipients.length > 1
              ? TeamLine
              : item.recipients[0]?.toUpperCase() ===
                  TRIGGER_ANSWER.assigneeRecipient.toUpperCase()
                ? QuickShift
                : null,
        })}
      </Box>
      <Box className="trigger-card__actions">
        {/* TODO: Add action handler for below buttons */}
        <CIconButton
          size="medium"
          walkMeId={[...walkMeIdPrefix, "copy-button"]}
          onClick={handleClone}
        >
          <CSvgIcon component={Copy} />
        </CIconButton>
        <CIconButton
          size="medium"
          walkMeId={[...walkMeIdPrefix, "edit-button"]}
          onClick={handleEdit}
        >
          <CSvgIcon component={Edit} />
        </CIconButton>
        <CIconButton
          size="medium"
          severity="destructive"
          walkMeId={[...walkMeIdPrefix, "delete-button"]}
          onClick={handleDelete}
        >
          <CSvgIcon component={Delete} />
        </CIconButton>
      </Box>
    </Box>
  );
};

export default TriggerCard;
