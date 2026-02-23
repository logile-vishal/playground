import type React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import CSvgIcon from "@/core/components/icon/Icon";
import { CButton } from "@/core/components/button/button";
import { AddIcon, ChevronDown, ChevronRight } from "@/core/constants/icons";
import CNoData from "@/core/components/no-data/NoData";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import type { QuestionProps } from "@/pages/create-template/types/questions.type";
import type { NotificationSchema } from "@/pages/create-template/form-schema/steps/notifications";
import {
  NOTIFICATIONS_ACTION_TYPE,
  NOTIFICATIONS_CONDITION,
} from "@/pages/create-template/constants/triggers";
import { flattenQuestions } from "@/utils/flatten-questions";

import "./Notifications.scss";
import TriggerCard from "../../trigger-card/TriggerCard";
import { useCreateTemplateTranslations } from "../../../translation/useCreateTemplateTranslations";
import { TRIGGER_TYPE } from "../../../constants/constant";
import AddEditNotificationModal from "./AddEditNotificationModal/AddEditNotificationModal";

export const Notifications: React.FC<{ walkMeIdPrefix: string[] }> = ({
  walkMeIdPrefix,
}) => {
  const { NOTIFICATIONS } = useCreateTemplateTranslations();
  const { getFormValues, setFormValue, watch } = useCreateTemplateForm();
  const [notificationsList, setNotificationsList] = useState({
    default: [],
    groupedByAnswer: [],
  });
  const notificationStepData = watch("notifications") as NotificationSchema[];
  const watchQuestionList = watch("questions") as QuestionProps[];
  const [questionList, setQuestionList] = useState<QuestionProps[]>([]);
  const [isGroupedNotificationOpen, setIsGroupedNotificationOpen] =
    useState<boolean>(true);
  const [showNotificationModal, setShowNotificationModal] = useState({
    status: false,
    type: NOTIFICATIONS_ACTION_TYPE.ADD,
    data: null,
  });

  const handleAddNotification = () => {
    setShowNotificationModal({
      status: true,
      type: NOTIFICATIONS_ACTION_TYPE.ADD,
      data: null,
    });
  };

  const handleEditNotification = (data) => {
    setShowNotificationModal({
      status: true,
      type: NOTIFICATIONS_ACTION_TYPE.EDIT,
      data,
    });
  };

  const handleDeleteNotification = (data) => {
    const notificationsList = getFormValues("notifications");
    const triggerId = data.triggerId;
    const updatedNotifications = notificationsList.filter(
      (notification) => notification.triggerId !== triggerId
    );
    setFormValue("notifications", updatedNotifications);
  };

  const handleCloneNotification = (data) => {
    setShowNotificationModal({
      status: true,
      type: NOTIFICATIONS_ACTION_TYPE.CLONE,
      data,
    });
  };

  const handleCloseNotificationModal = () => {
    setShowNotificationModal({
      status: false,
      type: NOTIFICATIONS_ACTION_TYPE.ADD,
      data: null,
    });
  };

  const getQuestionLabelById = (questionId: string) => {
    const question = questionList?.find(
      (question: QuestionProps) => question.qId === questionId
    );
    return question ? question.questionBasicData.title : "";
  };

  const getAnswerLabelById = (questionId: string, answerIndex: string) => {
    const question = questionList?.find(
      (question: QuestionProps) => question.qId === questionId
    );
    if (question) {
      const answer = question.questionBasicData.response[parseInt(answerIndex)];
      return answer ? answer.title : "";
    }
    return "";
  };

  useEffect(() => {
    const allQuestions = flattenQuestions(watchQuestionList || []);
    setQuestionList(allQuestions);
  }, [watchQuestionList]);

  useEffect(() => {
    const notifications = getFormValues("notifications") || [];
    const defaultNotifications = [];
    const groupedByAnswerNotifications = [];
    notifications.forEach((notification) => {
      if (notification.condition === NOTIFICATIONS_CONDITION.ANSWER) {
        groupedByAnswerNotifications.push(notification);
      } else {
        defaultNotifications.push(notification);
      }
    });
    setNotificationsList({
      default: defaultNotifications,
      groupedByAnswer: groupedByAnswerNotifications,
    });
  }, [notificationStepData, getFormValues]);

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
          {notificationsList?.default?.map((item, index) => (
            <TriggerCard
              key={index}
              item={{
                ...item,
                id: item.triggerId,
                messageTemplates: {
                  id: item.messageTemplates?.id,
                  subject: item.messageTemplates?.subject,
                  body: item.messageTemplates?.body,
                },
              }}
              index={index}
              handleEdit={() => handleEditNotification(item)}
              handleDelete={() => handleDeleteNotification(item)}
              handleClone={() => handleCloneNotification(item)}
              getQuestionLabelById={getQuestionLabelById}
              getAnswerLabelById={getAnswerLabelById}
              type={TRIGGER_TYPE.notification}
              walkMeIdPrefix={[...walkMeIdPrefix, "trigger-card"]}
            />
          ))}
          {notificationsList?.groupedByAnswer?.length > 0 && (
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
              {isGroupedNotificationOpen &&
                notificationsList.groupedByAnswer &&
                notificationsList.groupedByAnswer?.map((item, index) => (
                  <TriggerCard
                    key={item.triggerId}
                    item={{
                      ...item,
                      triggerTaskName: getQuestionLabelById(
                        item.questionId || ""
                      ),
                      messageTemplates: {
                        id: item?.messageTemplates?.id,
                        subject: item?.messageTemplates?.subject,
                        body: "",
                      },
                    }}
                    index={index}
                    triggeredByAnswers={true}
                    type={TRIGGER_TYPE.notification}
                    handleEdit={() => handleEditNotification(item)}
                    handleDelete={() => handleDeleteNotification(item)}
                    handleClone={() => handleCloneNotification(item)}
                    getQuestionLabelById={getQuestionLabelById}
                    getAnswerLabelById={getAnswerLabelById}
                    walkMeIdPrefix={[...walkMeIdPrefix, "trigger-card"]}
                  />
                ))}
            </Box>
          )}
        </Box>
      )}
      <CButton
        className="ct-notifications__action-btn"
        variant="outline"
        severity="primary"
        size="small"
        onClick={handleAddNotification}
        walkMeId={["notifications", "add notification button"]}
      >
        <CSvgIcon
          size={15}
          component={AddIcon}
        />
        {NOTIFICATIONS.addNotificationButtonLabel}
      </CButton>

      <AddEditNotificationModal
        showNotificationModal={showNotificationModal}
        handleCloseNotificationModal={handleCloseNotificationModal}
        walkMeIdPrefix={[
          ...walkMeIdPrefix,
          "notifications",
          "add notification modal",
        ]}
        watchQuestionList={questionList}
        getQuestionLabel={getQuestionLabelById}
        getAnswerLabel={getAnswerLabelById}
      />
    </Box>
  );
};

export default Notifications;
