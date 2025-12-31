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
import type { FollowUpCardProps } from "@/pages/create-template/types/followup.type";
import WildcardLabel from "@/core/components/wildcard-label/WildcardLabel";
import { TRIGGER_ANSWER } from "@/pages/create-template/constants/constant";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";

import "./FollowUpCard.scss";
import FollowupColumn from "./FollowupColumn";

const FollowUpCard: React.FC<FollowUpCardProps> = ({
  item,
  triggeredByAnswers,
}) => {
  const { FOLLOWUP_TASKS } = useCreateTemplateTranslations();

  return (
    <Box className="followup-card">
      {triggeredByAnswers ? (
        <>
          <FollowupColumn
            title={FOLLOWUP_TASKS.CARD_COLUMN_HEADINGS.conditionQuestion}
            value={`${item.index}. ${item.conditionQuestion}`}
            className="followup-card__content-question"
            enableSeeMore
          />
          <FollowupColumn
            title={FOLLOWUP_TASKS.CARD_COLUMN_HEADINGS.conditionAnswer}
            value={item.conditionAnswer}
            className="followup-card__content-answer"
          />
        </>
      ) : (
        <>
          <FollowupColumn
            title={FOLLOWUP_TASKS.CARD_COLUMN_HEADINGS.condition}
            value={item.condition}
            className="followup-card__content-condition"
          />
        </>
      )}
      <FollowupColumn
        title={FOLLOWUP_TASKS.CARD_COLUMN_HEADINGS.taskName}
        value={
          <WildcardLabel
            label={item.taskName}
            truncate={false}
          />
        }
        isWildcardText={true}
        className="followup-card__content-message"
      />
      <FollowupColumn
        title={FOLLOWUP_TASKS.CARD_COLUMN_HEADINGS.recipients}
        value={item.recipients.join(", ")}
        className="followup-card__content-recipients"
        iconVisible={item.recipients.length > 0}
        icon={
          item.recipients.length > 1
            ? TeamLine
            : item.recipients[0] === TRIGGER_ANSWER.assigneeRecipient
              ? QuickShift
              : null
        }
      />
      <Box className="followup-card__actions">
        <CIconButton disableHover>
          <CSvgIcon
            component={Copy}
            size={20}
            color="secondary"
          />
        </CIconButton>
        <CIconButton disableHover>
          <CSvgIcon
            component={Edit}
            size={20}
            color="secondary"
          />
        </CIconButton>
        <CIconButton disableHover>
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

export default FollowUpCard;
