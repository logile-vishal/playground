import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, Tooltip } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

import CSelect from "@/core/components/form/select";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import CCheckbox from "@/core/components/form/checkbox/Checkbox";
import { CButton } from "@/core/components/button/button";
import CSvgIcon from "@/core/components/icon/Icon";
import { AddIcon, Delete, Edit, InfoCircle } from "@/core/constants/icons";
import CRichTextEditor from "@/core/components/form/rich-text-editor/RichTextEditor";
import CModal, { ModalBody } from "@/core/components/modal/Modal";
import CIconButton from "@/core/components/button/IconButton";
import {
  notificationStepSchema,
  type NotificationSchema,
} from "@/pages/create-template/form-schema/steps/notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DEFAULT_NOTIFICATION,
  DEFAULT_RECIPIENT,
  TRIGGER_CONDITIONS,
  TRIGGER_RECIPIENTS,
} from "@/pages/create-template/constants/notifications";
import clsx from "@/utils/clsx";
import {
  orgDropdownOptions,
  orgTypeDropdownOptions,
  positionsOptions,
} from "@/pages/create-template/constants/sampleData";
import { isNonEmptyValue } from "@/utils/index";
import { NOTIFICATIONS_ACTION_TYPE } from "@/pages/create-template/constants/notifications";
import WildcardLabel from "@/core/components/wildcard-label/WildcardLabel";
import type { QuestionProps } from "@/pages/create-template/types/questions.type";
import { QUESTION_TYPE } from "@/pages/create-template/constants/questions";

import "./AddEditNotificationModal.scss";
import CustomRecipientModal from "../CustomRecipientModal/CustomRecipientModal";

const AddEditNotificationModal = ({
  showNotificationModal,
  walkMeIdPrefix,
  handleCloseNotificationModal,
  watchQuestionList,
  getQuestionLabel,
  getAnswerLabel,
}) => {
  const { NOTIFICATIONS } = useCreateTemplateTranslations();
  const { GENERAL } = useCommonTranslation();
  const {
    control,
    watch,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors: formErrors },
  } = useForm<{
    notification: NotificationSchema;
  }>({
    resolver: zodResolver(notificationStepSchema),
    defaultValues: { notification: DEFAULT_NOTIFICATION },
    mode: "onBlur",
  });
  const { getFormValues, setFormValue } = useCreateTemplateForm();
  const watchNotification = watch("notification");

  const [customRecipientModal, setCustomRecipientModal] = useState({
    status: false,
    type: null,
    recipientId: null,
  });
  const [customRecipientList, setCustomRecipientList] = useState([]);
  const [answerOptions, setAnswerOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const closeCustomRecipientModal = () => {
    setCustomRecipientModal({
      status: false,
      type: null,
      recipientId: null,
    });
  };

  const handleAddCustomRecipient = () => {
    setCustomRecipientModal({
      status: true,
      type: NOTIFICATIONS_ACTION_TYPE.ADD,
      recipientId: null,
    });
  };

  const handleNotificationSubmit = async () => {
    handleSubmit(() => {
      const notificationsList = getFormValues("notifications");
      if (showNotificationModal.type === NOTIFICATIONS_ACTION_TYPE.EDIT) {
        notificationsList[
          notificationsList.findIndex(
            (item) => item?.triggerId === watchNotification.triggerId
          )
        ] = watchNotification;
      } else {
        notificationsList.push(watchNotification);
      }
      setFormValue("notifications", notificationsList);
      closeCustomRecipientModal();
      handleCloseNotificationModal();
    })();
  };

  const toogleRecipient = (e, recipientValue) => {
    const currentNotification = getValues("notification") || {};
    const isChecked = e.target.checked;
    let updatedRecipients = [];
    if (isChecked) {
      updatedRecipients = [...currentNotification.recipients, recipientValue];
    } else {
      updatedRecipients = currentNotification.recipients.filter(
        (recipient) => recipient !== recipientValue
      );
    }
    currentNotification.recipients = updatedRecipients;
    setValue("notification.recipients", updatedRecipients);
  };

  const isRecipientSelected = (recipient: string) => {
    const currentNotification = getValues("notification") || {};
    return currentNotification.recipients.includes(recipient) ?? false;
  };

  const handleEditCustomRecipient = (recipientId: number | null) => {
    setCustomRecipientModal({
      status: true,
      type: NOTIFICATIONS_ACTION_TYPE.EDIT,
      recipientId,
    });
  };

  const handleDeleteCustomRecipient = (recipientId: string | null) => {
    const currentNotification = getValues("notification") || {};

    const updatedRecipientOrgs =
      currentNotification.recipientOrgs.filter(
        (item) => item.recipientId !== recipientId
      ) || [];
    const updatedRecipientOrgTypes =
      currentNotification.recipientOrgTypes.filter(
        (item) => item.recipientId !== recipientId
      ) || [];
    const updatedRecipientPositions =
      currentNotification.recipientPositions.filter(
        (item) => item.recipientId !== recipientId
      ) || [];
    currentNotification.recipientOrgs = updatedRecipientOrgs;
    currentNotification.recipientOrgTypes = updatedRecipientOrgTypes;
    currentNotification.recipientPositions = updatedRecipientPositions;
    setValue("notification", currentNotification);
  };

  const handleRecipientSubmit = (recipientData, type, recipientId) => {
    const currentNotification = getValues("notification") || {};
    const updatedNotification = { ...currentNotification };
    if (type === NOTIFICATIONS_ACTION_TYPE.EDIT) {
      const updatedRecipientOrgs = currentNotification.recipientOrgs.map(
        (item) =>
          item.recipientId === recipientId ? recipientData.recipientOrg : item
      );
      const updatedRecipientOrgTypes =
        currentNotification.recipientOrgTypes.map((item) =>
          item.recipientId === recipientId
            ? recipientData.recipientOrgType
            : item
        );
      const updatedRecipientPositions =
        currentNotification.recipientPositions.map((item) =>
          item.recipientId === recipientId
            ? recipientData.recipientPosition
            : item
        );
      updatedNotification.recipientOrgs = updatedRecipientOrgs;
      updatedNotification.recipientOrgTypes = updatedRecipientOrgTypes;
      updatedNotification.recipientPositions = updatedRecipientPositions;
    } else {
      updatedNotification.recipientOrgs = [
        ...(currentNotification.recipientOrgs || []),
        recipientData.recipientOrg,
      ];
      updatedNotification.recipientOrgTypes = [
        ...(currentNotification.recipientOrgTypes || []),
        recipientData.recipientOrgType,
      ];
      updatedNotification.recipientPositions = [
        ...(currentNotification.recipientPositions || []),
        recipientData.recipientPosition,
      ];
    }
    setValue("notification", updatedNotification);
  };

  const getSelectedLabel = (options, value) => {
    const selectedOption = options.find((option) => option.value === value);
    return selectedOption ? selectedOption.label : null;
  };

  const getRecipientsList = () => {
    const currentNotification = getValues("notification");
    const uniqueRecipientIds = new Set<string | number | null>();
    currentNotification.recipientOrgs?.forEach((item) => {
      if (isNonEmptyValue(item.recipientId))
        uniqueRecipientIds.add(item.recipientId);
    });
    currentNotification.recipientOrgTypes?.forEach((item) => {
      if (isNonEmptyValue(item.recipientId))
        uniqueRecipientIds.add(item.recipientId);
    });
    currentNotification.recipientPositions?.forEach((item) => {
      if (isNonEmptyValue(item.recipientId))
        uniqueRecipientIds.add(item.recipientId);
    });

    /** TODO: Structure will change later with respect to BE */
    const list = Array.from(uniqueRecipientIds).map((recipientId) => ({
      recipientOrg:
        currentNotification.recipientOrgs?.find(
          (item) => item.recipientId === recipientId
        ) || null,
      recipientOrgType:
        currentNotification.recipientOrgTypes?.find(
          (item) => item.recipientId === recipientId
        ) || null,
      recipientPosition:
        currentNotification.recipientPositions?.find(
          (item) => item.recipientId === recipientId
        ) || null,
    }));
    return list;
  };

  const getRecipientById = (recipientId) => {
    const list = getRecipientsList();
    const result = list.find(
      (recipient) => recipient.recipientOrg.recipientId === recipientId
    );
    return { ...DEFAULT_RECIPIENT, ...result };
  };

  useEffect(() => {
    const list = watchQuestionList?.find(
      (question: QuestionProps) => question.qId === watchNotification.questionId
    );
    const answerList = list?.questionBasicData?.response.map(
      (answer, index) => ({
        label: answer.title,
        value: index.toString(),
        ...answer,
      })
    );
    setAnswerOptions(answerList);
  }, [watchNotification.questionId, watchQuestionList]);

  useEffect(() => {
    const list = getRecipientsList();
    setCustomRecipientList(list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchNotification]);

  const getDefaultNotification = (): NotificationSchema => {
    return { triggerId: uuidv4(), ...DEFAULT_NOTIFICATION };
  };

  useEffect(() => {
    if (showNotificationModal?.type === NOTIFICATIONS_ACTION_TYPE.EDIT) {
      setValue("notification", showNotificationModal.data);
    } else if (
      showNotificationModal?.type === NOTIFICATIONS_ACTION_TYPE.CLONE
    ) {
      const clonedData = {
        ...showNotificationModal.data,
        triggerId: uuidv4(),
      };
      setValue("notification", clonedData);
    } else {
      setValue("notification", getDefaultNotification());
    }
  }, [showNotificationModal, setValue]);

  const getQuestionsList = (): Array<{ label: string; value: string }> => {
    return watchQuestionList
      .filter((question) => {
        const questionType = question?.questionBasicData?.questionType;
        return (
          questionType !== QUESTION_TYPE.LABEL &&
          questionType !== QUESTION_TYPE.SECTION &&
          questionType !== QUESTION_TYPE.SORT_INPUT &&
          questionType !== QUESTION_TYPE.LONG_INPUT
        );
      })
      .map((question) => ({
        label: question.questionBasicData.title,
        value: question.qId,
      }));
  };

  return (
    <CModal
      open={showNotificationModal?.status}
      onClose={handleCloseNotificationModal}
      title={
        showNotificationModal?.type === NOTIFICATIONS_ACTION_TYPE.EDIT
          ? NOTIFICATIONS.ADD_NOTIFICATION_MODAL.editNotification
          : showNotificationModal?.type === NOTIFICATIONS_ACTION_TYPE.CLONE
            ? NOTIFICATIONS.ADD_NOTIFICATION_MODAL.cloneNotification
            : NOTIFICATIONS.ADD_NOTIFICATION_MODAL.addNotification
      }
      size="large"
      confirmText={GENERAL.submitButtonLabel}
      onConfirm={handleNotificationSubmit}
    >
      <ModalBody>
        <Box className="ct-add-notification-modal">
          <Box className="ct-add-notification-modal__select">
            <Controller
              name="notification.condition"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CSelect
                  {...field}
                  error={!!error}
                  options={
                    NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.CONDITION_OPTIONS
                  }
                  optionValueKey="value"
                  optionLabelKey="label"
                  required={true}
                  className="ct-add-notification-modal__select-condition"
                  label={NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields.condition}
                  placeholder={
                    NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields
                      .conditionPlaceholder
                  }
                />
              )}
            />
            {watchNotification.condition ===
            TRIGGER_CONDITIONS.TASK_COMPLIANCE ? (
              <Tooltip
                title={
                  NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields.conditionTooltip
                }
                slotProps={{
                  tooltip: {
                    sx: {
                      fontSize: "var(--logile-size-secondary-text)",
                    },
                  },
                }}
                placement="top-start"
              >
                <Box className="mt-24">
                  <CIconButton
                    size="small"
                    severity="primary"
                    variant="text"
                  >
                    <CSvgIcon component={InfoCircle} />
                  </CIconButton>
                </Box>
              </Tooltip>
            ) : (
              ""
            )}
          </Box>
          {watchNotification.condition === TRIGGER_CONDITIONS.ANSWER ? (
            <>
              <Box>
                <Controller
                  name="notification.questionId"
                  control={control}
                  render={({ field }) => (
                    <CSelect
                      {...field}
                      options={getQuestionsList()}
                      optionValueKey="value"
                      optionLabelKey="label"
                      menuWidth="var(--size-80)"
                      label={
                        NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields
                          .conditionQuestion
                      }
                      templates={{
                        inputValueTemplate: (context) => (
                          <WildcardLabel
                            label={getQuestionLabel(
                              context?.selectedItems as string
                            )}
                            truncate={true}
                          />
                        ),
                        menuItemTemplate: (option) => {
                          return (
                            <WildcardLabel
                              label={option.option.label}
                              truncate={true}
                            />
                          );
                        },
                      }}
                      placeholder={
                        NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields
                          .conditionQuestionPlaceholder
                      }
                    />
                  )}
                />
              </Box>
              {isNonEmptyValue(watchNotification.questionId) && (
                <Box>
                  <Controller
                    name="notification.answerIndex"
                    control={control}
                    render={({ field }) => (
                      <CSelect
                        {...field}
                        options={answerOptions}
                        optionValueKey="value"
                        optionLabelKey="label"
                        menuWidth="var(--size-80)"
                        label={
                          NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields
                            .conditionAnswer
                        }
                        templates={{
                          inputValueTemplate: (context) => (
                            <WildcardLabel
                              label={getAnswerLabel(
                                watchNotification.questionId,
                                context?.selectedItems as string
                              )}
                              truncate={true}
                            />
                          ),
                          menuItemTemplate: (option) => {
                            return (
                              <WildcardLabel
                                label={option.option.label}
                                truncate={true}
                              />
                            );
                          },
                        }}
                        placeholder={
                          NOTIFICATIONS.ADD_NOTIFICATION_MODAL.fields
                            .conditionAnswerPlaceholder
                        }
                      />
                    )}
                  />
                </Box>
              )}
            </>
          ) : (
            ""
          )}
          <Box>
            <Box
              className={clsx({
                "ct-add-notification-modal__text-label": true,
                "ct-add-notification-modal__text-label-required": true,
              })}
            >
              {NOTIFICATIONS.ADD_NOTIFICATION_MODAL.labels.to}
            </Box>
            <Box className="ct-add-notification-modal__send-to-wrapper">
              <CCheckbox
                label={
                  NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.RECIPIENT_OPTIONS
                    .assignee
                }
                onChange={(e) =>
                  toogleRecipient(e, TRIGGER_RECIPIENTS.ASSIGNEE)
                }
                checked={isRecipientSelected(TRIGGER_RECIPIENTS.ASSIGNEE)}
              />
              <CCheckbox
                label={
                  NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.RECIPIENT_OPTIONS
                    .supervisor
                }
                onChange={(e) =>
                  toogleRecipient(e, TRIGGER_RECIPIENTS.SUPERVISOR)
                }
                checked={isRecipientSelected(TRIGGER_RECIPIENTS.SUPERVISOR)}
              />
              <CCheckbox
                label={
                  NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.RECIPIENT_OPTIONS
                    .executionManager
                }
                onChange={(e) =>
                  toogleRecipient(e, TRIGGER_RECIPIENTS.EXECUTION_MANAGER)
                }
                checked={isRecipientSelected(
                  TRIGGER_RECIPIENTS.EXECUTION_MANAGER
                )}
              />
              <CButton
                variant="outline"
                severity="primary"
                size="small"
                className="ct-add-notification-modal__custom-recipient-button"
                onClick={handleAddCustomRecipient}
                walkMeId={["notifications step", "add-custom-recipient-button"]}
              >
                <CSvgIcon
                  size={16}
                  component={AddIcon}
                />
                {NOTIFICATIONS.ADD_NOTIFICATION_MODAL.labels.customRecipient}
              </CButton>
            </Box>
            {watchNotification?.recipients?.length === 0 &&
              formErrors?.notification?.recipients &&
              !isNonEmptyValue(watchNotification?.recipientOrgs) && (
                <Box className="ct-add-notification-modal__recipients-count-error">
                  {formErrors?.notification?.recipients?.message}
                </Box>
              )}
          </Box>
          {customRecipientList && customRecipientList?.length > 0 && (
            <Box className="ct-add-notification-modal__custom-recipient-section">
              {customRecipientList?.map((recipient) => (
                <Box
                  className="ct-add-notification-modal__custom-recipient-section-list"
                  key={recipient.recipientId}
                >
                  <Box className="ct-add-notification-modal__custom-recipient-section-list-item">
                    <Box className="ct-add-notification-modal__text-label">
                      Org:
                    </Box>
                    <Box>
                      {getSelectedLabel(
                        orgDropdownOptions,
                        recipient.recipientOrg?.orgId
                      )}
                    </Box>
                  </Box>
                  <Box className="ct-add-notification-modal__custom-recipient-section-list-item">
                    <Box className="ct-add-notification-modal__text-label">
                      Org Type:
                    </Box>
                    <Box>
                      {getSelectedLabel(
                        orgTypeDropdownOptions,
                        recipient.recipientOrgType?.orgTypeId
                      )}
                    </Box>
                  </Box>
                  <Box className="ct-add-notification-modal__custom-recipient-section-list-item">
                    <Box className="ct-add-notification-modal__text-label">
                      Position:
                    </Box>
                    <Box>
                      {getSelectedLabel(
                        positionsOptions,
                        recipient.recipientPosition?.positionId
                      )}
                    </Box>
                  </Box>
                  <Box className="ct-add-notification-modal__custom-recipient-section-actions">
                    <CIconButton
                      size="medium"
                      onClick={() =>
                        handleEditCustomRecipient(
                          recipient.recipientOrg.recipientId
                        )
                      }
                    >
                      <CSvgIcon component={Edit} />
                    </CIconButton>
                    <CIconButton
                      size="medium"
                      severity="destructive"
                      onClick={() =>
                        handleDeleteCustomRecipient(
                          recipient.recipientOrg.recipientId
                        )
                      }
                    >
                      <CSvgIcon component={Delete} />
                    </CIconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          <Controller
            name="notification.messageTemplates.subject"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <CRichTextEditor
                {...field}
                error={!!error}
                helperText={error ? error.message : ""}
                label={NOTIFICATIONS.ADD_NOTIFICATION_MODAL.labels.subject}
                required={true}
                showOnlyWildcard={true}
                className="ct-add-notification-modal__subject-editor"
              />
            )}
          />
          <Controller
            name="notification.messageTemplates.message"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <CRichTextEditor
                {...field}
                error={!!error}
                helperText={error ? error.message : ""}
                label={NOTIFICATIONS.ADD_NOTIFICATION_MODAL.labels.message}
                required={true}
                className="ct-add-notification-modal__message-editor"
              />
            )}
          />
        </Box>
        <CustomRecipientModal
          watchNotification={watchNotification}
          customRecipientModal={customRecipientModal}
          setCustomRecipientModal={setCustomRecipientModal}
          walkMeIdPrefix={[...walkMeIdPrefix, "Add custom recipient"]}
          handleRecipientSubmit={handleRecipientSubmit}
          getRecipientById={getRecipientById}
        />
      </ModalBody>
    </CModal>
  );
};

export default AddEditNotificationModal;
