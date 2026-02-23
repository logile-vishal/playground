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
  TRIGGER_CONDITIONS,
  TRIGGER_RECIPIENTS,
} from "@/pages/create-template/constants/triggers";
import clsx from "@/utils/clsx";
import { isNonEmptyValue } from "@/utils/index";
import { NOTIFICATIONS_ACTION_TYPE } from "@/pages/create-template/constants/triggers";
import WildcardLabel from "@/core/components/wildcard-label/WildcardLabel";
import type { QuestionProps } from "@/pages/create-template/types/questions.type";
import { QUESTION_TYPE } from "@/pages/create-template/constants/questions";

import "./AddEditNotificationModal.scss";
import CustomRecipientModal from "../CustomRecipientModal/CustomRecipientModal";
import {
  useGetOrgLevels,
  useGetOrgPositions,
  useGetOrgsList,
  useGetOrgTypes,
} from "@/pages/create-template/services/create-template-api-hooks";
import type {
  OrgLevelProps,
  OrgPositionsProps,
  OrgProps,
  OrgTypesProps,
} from "@/pages/create-template/types/triggers.type";
import { convertToTitleCase } from "@/utils/convert-to-title-case";

const AddEditNotificationModal = ({
  showNotificationModal,
  walkMeIdPrefix,
  handleCloseNotificationModal,
  watchQuestionList,
  getQuestionLabel,
  getAnswerLabel,
}) => {
  const { NOTIFICATIONS, FOLLOWUP_TASKS } = useCreateTemplateTranslations();
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
  });
  const [orgLevelOptions, setOrgLevelOptions] = useState([]);
  const [orgPositionsOptions, setOrgPositionsOptions] = useState([]);
  const [orgListOptions, setOrgListOptions] = useState([]);
  const [orgTypeOptions, setOrgTypeOptions] = useState([]);
  const { data: orgLevelsData } = useGetOrgLevels();
  const { data: orgPositionsData, mutateAsync: getOrgPositions } =
    useGetOrgPositions();
  const { data: orgListData, mutateAsync: getOrgsList } = useGetOrgsList();
  const { data: orgTypeData, mutateAsync: getOrgTypes } = useGetOrgTypes();
  const [answerOptions, setAnswerOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const closeCustomRecipientModal = () => {
    setCustomRecipientModal({
      status: false,
      type: null,
    });
  };

  const handleAddCustomRecipient = () => {
    setCustomRecipientModal({
      status: true,
      type: NOTIFICATIONS_ACTION_TYPE.ADD,
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

  const handleEditCustomRecipient = () => {
    setCustomRecipientModal({
      status: true,
      type: NOTIFICATIONS_ACTION_TYPE.EDIT,
    });
  };

  const handleDeleteCustomRecipient = () => {
    const currentNotification = getValues("notification") || {};
    currentNotification.customRecipients = {};
    currentNotification.isRelative = false;
    currentNotification.isOrgTypeRelative = false;
    setValue("notification", currentNotification);
  };

  const handleRecipientSubmit = (recipientData) => {
    const currentNotification = getValues("notification") || {};
    const updatedNotification = { ...currentNotification };
    updatedNotification.customRecipients = recipientData.customRecipients;
    updatedNotification.isRelative = recipientData.isRelative;
    updatedNotification.isOrgTypeRelative = recipientData.isOrgTypeRelative;
    setValue("notification", updatedNotification);
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

  const getSelectedLabel = (options, values) => {
    const selectedOption = options?.filter((option) =>
      values?.includes(option.value)
    );
    return selectedOption.length > 0
      ? selectedOption.map((option) => option.label).join(", ")
      : null;
  };

  useEffect(() => {
    if (orgLevelsData?.data?.length > 0) {
      const formattedOrgLevels = (
        orgLevelsData.data as unknown as OrgLevelProps[]
      ).map((level: OrgLevelProps) => ({
        label: convertToTitleCase(level.orgLevelName),
        value: level.orgLevelId,
        ...level,
      }));
      setOrgLevelOptions(formattedOrgLevels);
    }
  }, [orgLevelsData]);

  useEffect(() => {
    if (orgPositionsData?.data?.length > 0) {
      const formattedPositions = (
        orgPositionsData.data as unknown as OrgPositionsProps[]
      ).map((position: OrgPositionsProps) => ({
        label: convertToTitleCase(position.name),
        value: position.id,
        ...position,
      }));
      setOrgPositionsOptions(formattedPositions);
    }
  }, [orgPositionsData]);

  useEffect(() => {
    if (orgListData?.data?.length > 0) {
      const formattedOrgList = (orgListData.data as unknown as OrgProps[]).map(
        (org: OrgProps) => ({
          label: convertToTitleCase(org.name),
          value: org.orgId,
          ...org,
        })
      );
      setOrgListOptions(formattedOrgList);
    }
  }, [orgListData]);

  useEffect(() => {
    if (orgTypeData?.data?.length > 0) {
      const formattedOrgTypes = (
        orgTypeData.data as unknown as OrgTypesProps[]
      ).map((orgType: OrgTypesProps) => ({
        label: convertToTitleCase(orgType.type),
        value: orgType.orgTypeId,
        ...orgType,
      }));
      setOrgTypeOptions(formattedOrgTypes);
    }
  }, [orgTypeData]);

  const fetchOrgData = async (orgLevelId) => {
    getOrgPositions({ orgLevelId });
    getOrgsList({ orgLevelId });
    getOrgTypes({ orgLevelId });
  };

  useEffect(() => {
    if (isNonEmptyValue(watchNotification.customRecipients?.orgLevel)) {
      fetchOrgData(watchNotification.customRecipients.orgLevel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchNotification.customRecipients?.orgLevel]);

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
              !isNonEmptyValue(watchNotification?.customRecipients) && (
                <Box className="ct-add-notification-modal__recipients-count-error">
                  {formErrors?.notification?.recipients?.message}
                </Box>
              )}
          </Box>
          {isNonEmptyValue(watchNotification.customRecipients) && (
            <Box className="ct-add-notification-modal__custom-recipient-section">
              <Box className="ct-add-notification-modal__custom-recipient-section-list">
                {!watchNotification.isRelative && (
                  <Box className="ct-add-notification-modal__custom-recipient-section-list-item">
                    <Box className="ct-add-notification-modal__text-label">
                      {FOLLOWUP_TASKS.TRIGGER_MODAL.orgLabel}
                    </Box>
                    <Box>
                      {getSelectedLabel(
                        orgListOptions,
                        watchNotification.customRecipients?.orgs
                      )}
                    </Box>
                  </Box>
                )}
                {!watchNotification.isOrgTypeRelative && (
                  <Box className="ct-add-notification-modal__custom-recipient-section-list-item">
                    <Box className="ct-add-notification-modal__text-label">
                      {FOLLOWUP_TASKS.TRIGGER_MODAL.orgTypeLabel}
                    </Box>
                    <Box>
                      {getSelectedLabel(
                        orgTypeOptions,
                        watchNotification.customRecipients?.orgTypes
                      )}
                    </Box>
                  </Box>
                )}
                <Box className="ct-add-notification-modal__custom-recipient-section-list-item">
                  <Box className="ct-add-notification-modal__text-label">
                    {FOLLOWUP_TASKS.TRIGGER_MODAL.orgPositionLabel}
                  </Box>
                  <Box>
                    {getSelectedLabel(
                      orgPositionsOptions,
                      watchNotification.customRecipients?.positions
                    )}
                  </Box>
                </Box>
                <Box className="ct-add-notification-modal__custom-recipient-section-actions">
                  <CIconButton
                    size="medium"
                    onClick={() => handleEditCustomRecipient()}
                  >
                    <CSvgIcon component={Edit} />
                  </CIconButton>
                  <CIconButton
                    size="medium"
                    severity="destructive"
                    onClick={() => handleDeleteCustomRecipient()}
                  >
                    <CSvgIcon component={Delete} />
                  </CIconButton>
                </Box>
              </Box>
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
          watchTrigger={watchNotification}
          customRecipientModal={customRecipientModal}
          setCustomRecipientModal={setCustomRecipientModal}
          walkMeIdPrefix={[...walkMeIdPrefix, "Add custom recipient"]}
          handleRecipientSubmit={handleRecipientSubmit}
          orgLevelOptions={orgLevelOptions}
          orgPositionsOptions={orgPositionsOptions}
          orgListOptions={orgListOptions}
          orgTypeOptions={orgTypeOptions}
          fetchOrgData={fetchOrgData}
        />
      </ModalBody>
    </CModal>
  );
};

export default AddEditNotificationModal;
