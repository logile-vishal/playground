import type React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import CSvgIcon from "@/core/components/icon/Icon";
import CIconButton from "@/core/components/button/IconButton";
import {
  AddIcon,
  Copy,
  Delete,
  Edit,
  QuickShift,
  TeamLine,
} from "@/core/constants/icons";
import {
  TRIGGER_ANSWER,
  TRIGGER_TYPE,
} from "@/pages/create-template/constants/constant";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import CModal, { ModalBody } from "@/core/components/modal/Modal";
import WildcardLabel from "@/core/components/wildcard-label/WildcardLabel";
import { CButton } from "@/core/components/button/button";
import CNoData from "@/core/components/no-data/NoData";
import { useWalkmeId } from "@/core/hooks/useWalkmeId";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
import { convertToTitleCase } from "@/utils/convert-to-title-case";
import clsx from "@/utils/clsx";
import { isNonEmptyValue } from "@/utils";
import { flattenQuestions } from "@/utils/flatten-questions";

import "./TriggerModal.scss";
import type {
  QuestionProps,
  TriggerModalProps,
} from "../../types/questions.type";
import AddEditNotificationModal from "../steps/notifications/add-edit-notification-modal/AddEditNotificationModal";
import { CUSTOM_RECIPIENT_LABEL } from "../../constants/triggers";
import AddEditFollowUpModal from "../steps/follow-up/add-edit-follow-up-modal/AddEditFollowUpModal";
import useCreateTemplateForm from "../../hooks/useCreateTemplateForm";

const TriggerModal: React.FC<TriggerModalProps> = ({
  data,
  showModal,
  selectedQuestionInfo,
  handleCloseModal,
  type,
  handleAdd,
  handleClone,
  handleEdit,
  handleDelete,
  handleClose,
  showAddEditModal,
  walkMeIdPrefix,
}): React.ReactElement => {
  const { NOTIFICATIONS, FOLLOWUP_TASKS } = useCreateTemplateTranslations();
  const { GENERAL } = useCommonTranslation();
  const { generateId } = useWalkmeId();
  const { watch: watchForm } = useCreateTemplateForm();
  const watchQuestionList = watchForm("questions") as QuestionProps[];
  const [questionList, setQuestionList] = useState<QuestionProps[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState({
    status: false,
    data: null,
  });
  const dataConstant =
    type === TRIGGER_TYPE.notification ? NOTIFICATIONS : FOLLOWUP_TASKS;

  const handleCloseDeleteModal = (): void => {
    setShowDeleteModal({ status: false, data: null });
  };

  const handleConfirmDelete = (): void => {
    (handleDelete as (data: unknown) => void)?.(showDeleteModal.data);
    handleCloseDeleteModal();
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
  }: {
    title: string;
    value: React.ReactNode;
    className: string;
    iconVisible?: boolean;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  }): React.ReactNode => {
    return (
      <Box className={clsx({ [className]: true })}>
        <Box className="trigger-modal__list-title">
          {title}
          {iconVisible && icon ? (
            <CSvgIcon
              component={icon}
              size={16}
              color={"secondary"}
            />
          ) : null}
        </Box>
        <Box className="trigger-modal__list-content">{value}</Box>
      </Box>
    );
  };

  return (
    <CModal
      open={showModal}
      title={
        type === TRIGGER_TYPE.notification
          ? NOTIFICATIONS.heading
          : FOLLOWUP_TASKS.heading
      }
      onClose={handleCloseModal}
      size="large"
      showActions={false}
      containerClassName="trigger-modal"
    >
      <ModalBody>
        {!isNonEmptyValue(data) ? (
          <CNoData
            title={
              type === TRIGGER_TYPE.notification
                ? NOTIFICATIONS.noNotificationsPlaceholder
                : FOLLOWUP_TASKS.noFollowUpTasksPlaceholder
            }
            imageWidth={87}
          >
            <CButton
              variant="solid"
              severity="primary"
              size="small"
              onClick={handleAdd}
              data-walkme-id={generateId([
                ...walkMeIdPrefix,
                "trigger add button",
              ])}
            >
              <CSvgIcon
                size={15}
                component={AddIcon}
              />
              <Box ml="var(--space-xs)">
                {type === TRIGGER_TYPE.notification
                  ? NOTIFICATIONS.addNotificationButtonLabel
                  : FOLLOWUP_TASKS.addFollowUpTaskButtonLabel}
              </Box>
            </CButton>
          </CNoData>
        ) : (
          <Box>
            {data?.map((item) => {
              const recipientsList = convertToTitleCase(
                item.recipients.join(", ")
              );
              // TODO: revert custom recipient logic once it is updated from backend
              const hasCustomRecipients = isNonEmptyValue(
                item.customRecipients
              );

              const totalRecipientsCount =
                item.recipients.length + (hasCustomRecipients ? 1 : 0);

              return (
                <Box className="trigger-modal__list">
                  <Box className="trigger-modal__list-content">
                    {renderListColumn({
                      title: dataConstant.CARD_COLUMN_HEADINGS.recipients,
                      value: hasCustomRecipients
                        ? `${recipientsList}${recipientsList ? ", " : ""}${CUSTOM_RECIPIENT_LABEL}`
                        : recipientsList,
                      className: "trigger-modal__list-content-recipients",
                      iconVisible: totalRecipientsCount >= 1,
                      icon:
                        totalRecipientsCount > 1
                          ? TeamLine
                          : item.recipients[0]?.toUpperCase() ===
                              TRIGGER_ANSWER.assigneeRecipient.toUpperCase()
                            ? QuickShift
                            : null,
                    })}

                    {renderListColumn({
                      title:
                        type === TRIGGER_TYPE.notification
                          ? NOTIFICATIONS.CARD_COLUMN_HEADINGS.messageSubject
                          : FOLLOWUP_TASKS.CARD_COLUMN_HEADINGS.taskName,
                      value: (
                        <WildcardLabel
                          label={
                            type === TRIGGER_TYPE.notification
                              ? item?.messageTemplates?.subject
                              : item?.triggerTaskName
                          }
                          truncate={true}
                        />
                      ),
                      className: "trigger-modal__list-content-message",
                    })}
                  </Box>
                  <Box className="trigger-modal__list-actions">
                    <CIconButton
                      size="medium"
                      onClick={() => {
                        const cloneHandler = handleClone as (
                          data: unknown
                        ) => void;
                        cloneHandler?.(item);
                      }}
                      walkMeId={[...walkMeIdPrefix, "trigger clone button"]}
                    >
                      <CSvgIcon component={Copy} />
                    </CIconButton>
                    <CIconButton
                      size="medium"
                      onClick={() => {
                        const editHandler = handleEdit as (
                          data: unknown
                        ) => void;
                        editHandler?.(item);
                      }}
                      walkMeId={[...walkMeIdPrefix, "trigger edit button"]}
                    >
                      <CSvgIcon component={Edit} />
                    </CIconButton>
                    <CIconButton
                      size="medium"
                      severity="destructive"
                      onClick={() =>
                        setShowDeleteModal({ status: true, data: item })
                      }
                      walkMeId={[...walkMeIdPrefix, "trigger delete button"]}
                    >
                      <CSvgIcon component={Delete} />
                    </CIconButton>
                  </Box>
                </Box>
              );
            })}
            <Box className="trigger-modal__action-btn">
              <CButton
                variant="outline"
                severity="primary"
                size="small"
                onClick={handleAdd}
                data-walkme-id={generateId([
                  ...walkMeIdPrefix,
                  "trigger add button",
                ])}
              >
                <CSvgIcon
                  size={15}
                  component={AddIcon}
                />
                <Box ml="var(--space-xs)">
                  {type === TRIGGER_TYPE.notification
                    ? NOTIFICATIONS.addNotificationButtonLabel
                    : FOLLOWUP_TASKS.addFollowUpTaskButtonLabel}
                </Box>
              </CButton>
            </Box>
          </Box>
        )}
      </ModalBody>

      {type === TRIGGER_TYPE.notification && showAddEditModal && (
        <AddEditNotificationModal
          showNotificationModal={showAddEditModal}
          handleCloseNotificationModal={handleClose}
          walkMeIdPrefix={[
            ...walkMeIdPrefix,
            "notifications",
            "add notification modal",
          ]}
          questionId={selectedQuestionInfo?.questionId}
          answerIndex={selectedQuestionInfo?.answerIndex}
          optionLevelTrigger={true}
          watchQuestionList={questionList}
          getQuestionLabel={getQuestionLabelById}
          getAnswerLabel={getAnswerLabelById}
        />
      )}
      {type === TRIGGER_TYPE.followup && showAddEditModal && (
        <AddEditFollowUpModal
          showFollowUpModal={showAddEditModal}
          handleCloseFollowUpModal={handleClose}
          watchQuestionList={questionList}
          getQuestionLabel={getQuestionLabelById}
          getAnswerLabel={getAnswerLabelById}
          optionLevelTrigger={true}
          questionId={selectedQuestionInfo?.questionId}
          answerIndex={selectedQuestionInfo?.answerIndex}
        />
      )}
      {/* Delete confirmation modal */}
      <CModal
        open={showDeleteModal.status}
        onClose={handleCloseDeleteModal}
        title={
          type === TRIGGER_TYPE.notification
            ? NOTIFICATIONS.ADD_NOTIFICATION_MODAL.deleteNotification
            : FOLLOWUP_TASKS.deleteFollowUpTask
        }
        size="small"
        walkMeIdPrefix={[...walkMeIdPrefix, "trigger card", "delete modal"]}
        onConfirm={handleConfirmDelete}
        severity="destructive"
        confirmText={GENERAL.deleteButtonLabel}
      >
        <ModalBody>
          <Box>
            {type === TRIGGER_TYPE.notification
              ? NOTIFICATIONS.ADD_NOTIFICATION_MODAL
                  .deleteNotificationDescription
              : FOLLOWUP_TASKS.deleteFollowUpTaskDescription}
          </Box>
          <Box>
            {type === TRIGGER_TYPE.notification
              ? NOTIFICATIONS.ADD_NOTIFICATION_MODAL
                  .deleteNotificationSubDescription
              : FOLLOWUP_TASKS.deleteFollowUpTaskSubDescription}
          </Box>
        </ModalBody>
      </CModal>
    </CModal>
  );
};

export default TriggerModal;
