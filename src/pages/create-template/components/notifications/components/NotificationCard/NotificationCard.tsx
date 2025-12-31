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
import type { NotificationCardProps } from "@/pages/create-template/types/notification.type";
import WildcardLabel from "@/core/components/wildcard-label/WildcardLabel";
import { TRIGGER_ANSWER } from "@/pages/create-template/constants/constant";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";

import "./NotificationCard.scss";
import NotificationColumn from "./NotificationColumn";

const NotificationCard: React.FC<NotificationCardProps> = ({
  item,
  triggeredByAnswers,
}) => {
  const { NOTIFICATIONS } = useCreateTemplateTranslations();
  return (
    <Box className="notifications-card">
      {triggeredByAnswers ? (
        <>
          <NotificationColumn
            title={NOTIFICATIONS.CARD_COLUMN_HEADINGS.conditionQuestion}
            value={`${item.index}. ${item.conditionQuestion}`}
            className="notifications-card__content-question"
            enableSeeMore
          />
          <NotificationColumn
            title={NOTIFICATIONS.CARD_COLUMN_HEADINGS.conditionAnswer}
            value={item.conditionAnswer}
            className="notifications-card__content-answer"
          />
        </>
      ) : (
        <>
          <NotificationColumn
            title={NOTIFICATIONS.CARD_COLUMN_HEADINGS.condition}
            value={item.condition}
            className="notifications-card__content-condition"
          />
        </>
      )}
      <NotificationColumn
        title={NOTIFICATIONS.CARD_COLUMN_HEADINGS.messageSubject}
        value={
          <WildcardLabel
            label={item.messageSubject}
            truncate={false}
          />
        }
        isWildcardText={true}
        className="notifications-card__content-message"
      />
      <NotificationColumn
        title={NOTIFICATIONS.CARD_COLUMN_HEADINGS.recipients}
        value={item.recipients.join(", ")}
        className="notifications-card__content-recipients"
        iconVisible={item.recipients.length > 0}
        icon={
          item.recipients.length > 1
            ? TeamLine
            : item.recipients[0] === TRIGGER_ANSWER.assigneeRecipient
              ? QuickShift
              : null
        }
      />
      <Box className="notifications-card__actions">
        <CIconButton disableHover>
          <CSvgIcon
            component={Copy}
            size={20}
            color={"secondary"}
          />
        </CIconButton>
        <CIconButton disableHover>
          <CSvgIcon
            component={Edit}
            size={20}
            color={"secondary"}
          />
        </CIconButton>
        <CIconButton
          disableHover
          onClick={() => {}}
        >
          <CSvgIcon
            component={Delete}
            size={20}
            color={"violation"}
          />
        </CIconButton>
      </Box>
    </Box>
  );
};

export default NotificationCard;
