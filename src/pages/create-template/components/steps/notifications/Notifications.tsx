import type React from "react";
import { useState } from "react";
import { Box } from "@mui/material";

import CSvgIcon from "@/core/components/icon/Icon";
import { CButton } from "@/core/components/button/button";
import { AddIcon, ChevronDown, ChevronRight } from "@/core/constants/icons";
import CNoData from "@/core/components/no-data/NoData";

import "./Notifications.scss";
import { notificationTriggerByAnswersSampleData } from "../../../constants/sampleData";
import TriggerCard from "../../trigger-card/TriggerCard";
import { useCreateTemplateTranslations } from "../../../translation/useCreateTemplateTranslations";
import { TRIGGER_TYPE } from "../../../constants/constant";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";

const Notifications: React.FC = () => {
  const { NOTIFICATIONS } = useCreateTemplateTranslations();
  const { getFormValues } = useCreateTemplateForm();
  const notificationStepData = getFormValues().notifications;
  const [isGroupedNotificationOpen, setIsGroupedNotificationOpen] =
    useState<boolean>(true);

  return (
    <Box className="ct-notifications">
      {notificationStepData?.length === 0 ? (
        <CNoData
          title={NOTIFICATIONS.NO_DATA}
          variant="box"
        />
      ) : (
        <Box className="ct-notifications__list">
          {/* TODO: Remove sample data after api integration */}
          {notificationStepData?.map((item, index) => (
            <TriggerCard
              key={index}
              item={{
                ...item,
                id: index,
                messageTemplates: {
                  id: item.messageTemplates?.id,
                  subject: item.messageTemplates?.subject,
                  body: item.messageTemplates?.body,
                },
              }}
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
                  component={
                    isGroupedNotificationOpen ? ChevronDown : ChevronRight
                  }
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
                  item={{
                    ...item,
                    triggerTaskName: item.conditionQuestion,
                    messageTemplates: {
                      id: item.messageTemplate.id,
                      subject: item.messageTemplate.subject,
                      body: "",
                    },
                  }}
                  triggeredByAnswers={true}
                  type={TRIGGER_TYPE.notification}
                />
              ))}
          </Box>
        </Box>
      )}
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
