import type React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import {
  NOTIFICATIONS_ACTION_TYPE,
  NOTIFICATIONS_CONDITION,
} from "@/pages/create-template/constants/triggers";
import type { QuestionProps } from "@/pages/create-template/types/questions.type";
import { flattenQuestions } from "@/utils/flatten-questions";
import CSvgIcon from "@/core/components/icon/Icon";
import { AddIcon, ChevronDown, ChevronRight } from "@/core/constants/icons";
import { CButton } from "@/core/components/button/button";
import CNoData from "@/core/components/no-data/NoData";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";

import { useCreateTemplateTranslations } from "../../../translation/useCreateTemplateTranslations";
import TriggerCard from "../../trigger-card/TriggerCard";
import { TRIGGER_TYPE } from "../../../constants/constant";
import AddEditFollowUpModal from "./add-edit-follow-up-modal/AddEditFollowUpModal";
import "./FollowUp.scss";

const FollowUp: React.FC<{ walkMeIdPrefix?: string[] }> = ({
  walkMeIdPrefix = [],
}) => {
  const [showFollowUpModal, setShowFollowUpModal] = useState({
    status: false,
    type: NOTIFICATIONS_ACTION_TYPE.ADD,
    data: null,
  });
  const { FOLLOWUP_TASKS, NOTIFICATIONS } = useCreateTemplateTranslations();
  const {
    getFormValues,
    watch: watchForm,
    setFormValue,
  } = useCreateTemplateForm();
  const watchQuestionList = watchForm("questions") as QuestionProps[];
  const [questionList, setQuestionList] = useState<QuestionProps[]>([]);
  const [followUpList, setFollowUpList] = useState({
    default: [],
    groupedByAnswer: [],
  });
  const followUpStepData = getFormValues().followUpTasks;
  const [isGroupedFollowupOpen, setIsGroupedFollowupOpen] =
    useState<boolean>(true);

  const handleAddFollowUp = () => {
    setShowFollowUpModal({
      status: true,
      type: NOTIFICATIONS_ACTION_TYPE.ADD,
      data: null,
    });
  };

  const handleEditFollowUp = (data) => {
    setShowFollowUpModal({
      status: true,
      type: NOTIFICATIONS_ACTION_TYPE.EDIT,
      data,
    });
  };

  const handleDeleteFollowUp = (data) => {
    const followUpList = getFormValues("followUpTasks") || [];
    const triggerId = data.triggerId;
    const updatedFollowUpList = followUpList.filter(
      (followUp) => followUp.triggerId !== triggerId
    );
    setFormValue("followUpTasks", updatedFollowUpList, {
      shouldDirty: false,
      shouldValidate: false,
    });
  };

  const handleCloneFollowUp = (data) => {
    setShowFollowUpModal({
      status: true,
      type: NOTIFICATIONS_ACTION_TYPE.CLONE,
      data,
    });
  };

  const handleCloseFollowUpModal = () => {
    setShowFollowUpModal({
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
    const followUpTasks = getFormValues("followUpTasks") || [];
    const defaultFollowUpTasks = [];
    const groupedByAnswerFollowUpTasks = [];
    followUpTasks.forEach((followUp) => {
      if (followUp.condition === NOTIFICATIONS_CONDITION.ANSWER) {
        groupedByAnswerFollowUpTasks.push(followUp);
      } else {
        defaultFollowUpTasks.push(followUp);
      }
    });
    setFollowUpList({
      default: defaultFollowUpTasks,
      groupedByAnswer: groupedByAnswerFollowUpTasks,
    });
  }, [followUpStepData, getFormValues]);

  return (
    <Box className="ct-follow-up">
      {followUpStepData?.length === 0 ? (
        <CNoData
          title={FOLLOWUP_TASKS.NO_DATA}
          variant="box"
        />
      ) : (
        <Box className="ct-follow-up__list">
          {/* TODO: Remove sample data after api integration */}
          {followUpList?.default?.map((item, index) => (
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
              handleEdit={() => handleEditFollowUp(item)}
              handleDelete={() => handleDeleteFollowUp(item)}
              handleClone={() => handleCloneFollowUp(item)}
              getQuestionLabelById={getQuestionLabelById}
              getAnswerLabelById={getAnswerLabelById}
              type={TRIGGER_TYPE.followup}
              walkMeIdPrefix={[...walkMeIdPrefix, "trigger-card"]}
            />
          ))}
          {followUpList?.groupedByAnswer?.length > 0 && (
            <Box className="ct-notifications__answer-trigger-group">
              <Box
                className="ct-notifications__answer-trigger-group-header"
                onClick={() => setIsGroupedFollowupOpen(!isGroupedFollowupOpen)}
              >
                <Box className="ct-notifications__answer-trigger-group-header-icon">
                  <CSvgIcon
                    component={
                      isGroupedFollowupOpen ? ChevronDown : ChevronRight
                    }
                    size={20}
                    color={"secondary"}
                  />
                </Box>
                <Box className="ct-notifications__answer-trigger-group-header-title">
                  {NOTIFICATIONS.TRIGGER_BY_ANSWER_GROUP.notification}
                </Box>
              </Box>
              {isGroupedFollowupOpen &&
                followUpList.groupedByAnswer &&
                followUpList.groupedByAnswer?.map((item, index) => (
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
                    type={TRIGGER_TYPE.followup}
                    handleEdit={() => handleEditFollowUp(item)}
                    handleDelete={() => handleDeleteFollowUp(item)}
                    handleClone={() => handleCloneFollowUp(item)}
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
        onClick={handleAddFollowUp}
      >
        <CSvgIcon
          size={15}
          component={AddIcon}
        />
        {FOLLOWUP_TASKS.addFollowUpTaskButtonLabel}
      </CButton>
      <AddEditFollowUpModal
        showFollowUpModal={showFollowUpModal}
        handleCloseFollowUpModal={handleCloseFollowUpModal}
        watchQuestionList={questionList}
        getQuestionLabel={getQuestionLabelById}
        getAnswerLabel={getAnswerLabelById}
      />
    </Box>
  );
};

export default FollowUp;
