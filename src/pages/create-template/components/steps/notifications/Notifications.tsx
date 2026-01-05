import type React from "react";
import { useState } from "react";
import { Box } from "@mui/material";

import CSvgIcon from "@/core/components/icon/Icon";
import { CButton } from "@/core/components/button/button";
import { AddIcon, ChevronDown, ChevronRight } from "@/core/constants/icons";

import "./Notifications.scss";
import {
  notificationSampleData,
  notificationTriggerByAnswersSampleData,
} from "../../../constants/sampleData";
import TriggerCard from "../../trigger-card/TriggerCard";
import { useCreateTemplateTranslations } from "../../../translation/useCreateTemplateTranslations";
import { TRIGGER_TYPE } from "../../../constants/constant";

const Notifications: React.FC = () => {
  const { NOTIFICATIONS } = useCreateTemplateTranslations();
  const [isGroupedNotificationOpen, setIsGroupedNotificationOpen] =
    useState<boolean>(true);

  return (
    <Box className="ct-notifications">
      {/* TODO: Remove sample data after api integration */}
      {notificationSampleData?.map((item) => (
        <TriggerCard
          key={item.id}
          item={item}
          type={TRIGGER_TYPE.notification}
        />
      ))}
      <Box className="ct-notifications__answer-trigger-group">
        <Box
          className="ct-notifications__answer-trigger-group-header"
          onClick={() =>
            setIsGroupedNotificationOpen(!isGroupedNotificationOpen)
          }
        >
          <Box className="ct-notifications__answer-trigger-group-header-icon">
            <CSvgIcon
              component={isGroupedNotificationOpen ? ChevronDown : ChevronRight}
              size={20}
              color={"secondary"}
            />
          </Box>
          <Box className="ct-notifications__answer-trigger-group-header-title">
            {NOTIFICATIONS.TRIGGER_BY_ANSWER_GROUP.notification}
          </Box>
        </Box>
        {/* TODO: Remove sample data after api integration */}
        {isGroupedNotificationOpen &&
          notificationTriggerByAnswersSampleData?.map((item) => (
            <TriggerCard
              key={item.id}
              item={item}
              triggeredByAnswers={true}
              type={TRIGGER_TYPE.notification}
            />
          ))}
      </Box>
      <CButton
        className="ct-notifications__action-btn"
        variant="outline"
        severity="primary"
        size="small"
      >
        <CSvgIcon
          size={15}
          component={AddIcon}
        />
        {NOTIFICATIONS.addNotificationButtonLabel}
      </CButton>
    </Box>
  );
};

export default Notifications;
