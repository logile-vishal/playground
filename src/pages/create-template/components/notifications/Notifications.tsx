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
} from "../../constants/sampleData";
import NotificationCard from "./components/NotificationCard/NotificationCard";
import { NOTIFICATION_HEADING, TRIGGER_ANSWER } from "../../constants/constant";

const Notifications: React.FC = () => {
  const [isGroupedNotificationOpen, setIsGroupedNotificationOpen] =
    useState<boolean>(false);

  return (
    <Box className="ct-notifications">
      {notificationSampleData?.map((item) => (
        <NotificationCard
          key={item.id}
          item={item}
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
            {TRIGGER_ANSWER.notification}
          </Box>
        </Box>
        {isGroupedNotificationOpen &&
          notificationTriggerByAnswersSampleData.map((item) => (
            <NotificationCard
              key={item.id}
              item={item}
              triggeredByAnswers={true}
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
        />{" "}
        {NOTIFICATION_HEADING.notification}
      </CButton>
    </Box>
  );
};

export default Notifications;
