import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

import {
  NOTIFICATIONS_ACTION_TYPE,
  TRIGGER_RECIPIENTS,
} from "@/pages/create-template/constants/triggers";
import clsx from "@/utils/clsx";
import { isNonEmptyValue } from "@/utils";
import { AddIcon, Delete, Edit } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import CSelect from "@/core/components/form/select";
import { CButton } from "@/core/components/button/button";
import CCheckbox from "@/core/components/form/checkbox/Checkbox";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { FOLLOW_UP_TASK_SHARING_OPTIONS } from "@/pages/create-template/constants/follow-up";
import CIconButton from "@/core/components/button/IconButton";
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
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";

import CustomRecipientModal from "../../../../notifications/CustomRecipientModal/CustomRecipientModal";
import "./FollowUpRecipients.scss";

const FollowUpRecipients = ({
  control,
  watchFollowUp,
  getValues,
  setValue,
  customRecipientModal,
  setCustomRecipientModal,
  errors,
}) => {
  const [orgLevelOptions, setOrgLevelOptions] = useState([]);
  const [orgPositionsOptions, setOrgPositionsOptions] = useState([]);
  const [orgListOptions, setOrgListOptions] = useState([]);
  const [orgTypeOptions, setOrgTypeOptions] = useState([]);
  const { NOTIFICATIONS, FOLLOWUP_TASKS } = useCreateTemplateTranslations();
  const { EDITOR_ERROR } = useCommonTranslation();
  const { data: orgLevelsData } = useGetOrgLevels();
  const { data: orgPositionsData, mutateAsync: getOrgPositions } =
    useGetOrgPositions();
  const { data: orgListData, mutateAsync: getOrgsList } = useGetOrgsList();
  const { data: orgTypeData, mutateAsync: getOrgTypes } = useGetOrgTypes();

  const toogleRecipient = (e, recipientValue) => {
    const currentFollowUp = getValues("followUp") || {};
    const isChecked = e.target.checked;
    let updatedRecipients = [];
    if (isChecked) {
      updatedRecipients = [...currentFollowUp.recipients, recipientValue];
    } else {
      updatedRecipients = currentFollowUp.recipients.filter(
        (recipient) => recipient !== recipientValue
      );
    }
    currentFollowUp.recipients = updatedRecipients;
    setValue("followUp.recipients", updatedRecipients, {
      shouldValidate: true,
    });
  };

  const isRecipientSelected = (recipient: string) => {
    const currentFollowUp = getValues("followUp") || {};
    return currentFollowUp.recipients.includes(recipient) ?? false;
  };

  const handleAddCustomRecipient = () => {
    setCustomRecipientModal({
      status: true,
      type: NOTIFICATIONS_ACTION_TYPE.ADD,
    });
  };

  const handleEditCustomRecipient = () => {
    setCustomRecipientModal({
      status: true,
      type: NOTIFICATIONS_ACTION_TYPE.EDIT,
    });
  };

  const handleDeleteCustomRecipient = () => {
    const currentFollowUp = getValues("followUp") || {};
    currentFollowUp.customRecipients = {};
    currentFollowUp.isRelative = false;
    currentFollowUp.isOrgTypeRelative = false;
    setValue("followUp", currentFollowUp, { shouldValidate: true });
  };

  const handleRecipientSubmit = (recipientData) => {
    const currentFollowUp = getValues("followUp") || {};
    const updatedFollowUp = { ...currentFollowUp };
    updatedFollowUp.customRecipients = recipientData.customRecipients;
    updatedFollowUp.isRelative = recipientData.isRelative;
    updatedFollowUp.isOrgTypeRelative = recipientData.isOrgTypeRelative;
    setValue("followUp", updatedFollowUp, { shouldValidate: true });
  };

  const handleTaskSharingChange = (e) => {
    const value = e.target.value;
    const currentFollowUp = getValues("followUp") || {};
    let isShareTrigger = false;
    if (value === FOLLOW_UP_TASK_SHARING_OPTIONS.YES) {
      isShareTrigger = true;
    }
    currentFollowUp.shareTaskByTrigger = isShareTrigger;
    setValue("followUp", currentFollowUp);
  };

  const getPrimaryOrgLevelPosValue = () => {
    const currentFollowUp = getValues("followUp") || {};
    const primaryOrgLevelPos = currentFollowUp.primaryOrgLevelPos;
    return (
      FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.PRIMARY_POSITION_OPTIONS.find(
        (option) => option.value === primaryOrgLevelPos
      ) || null
    );
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
    if (isNonEmptyValue(watchFollowUp.customRecipients?.orgLevel)) {
      fetchOrgData(watchFollowUp.customRecipients.orgLevel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchFollowUp.customRecipients?.orgLevel]);

  return (
    <Box className="ct-follow-up-recipients">
      <Box>
        <Box
          className={clsx({
            "ct-follow-up-recipients__form-label": true,
          })}
        >
          {NOTIFICATIONS.ADD_NOTIFICATION_MODAL.labels.to}
        </Box>
        <Box className="ct-follow-up-recipients__send-to-wrapper">
          <CCheckbox
            label={
              NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.RECIPIENT_OPTIONS.assignee
            }
            onChange={(e) => toogleRecipient(e, TRIGGER_RECIPIENTS.ASSIGNEE)}
            checked={isRecipientSelected(TRIGGER_RECIPIENTS.ASSIGNEE)}
          />
          <CCheckbox
            label={
              NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.RECIPIENT_OPTIONS.supervisor
            }
            onChange={(e) => toogleRecipient(e, TRIGGER_RECIPIENTS.SUPERVISOR)}
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
            checked={isRecipientSelected(TRIGGER_RECIPIENTS.EXECUTION_MANAGER)}
          />
          {!isNonEmptyValue(watchFollowUp?.customRecipients) && (
            <CButton
              variant="outline"
              severity="primary"
              size="small"
              className="ct-follow-up-recipients__custom-recipient-button"
              onClick={handleAddCustomRecipient}
              walkMeId={[
                "create-template",
                "notifications step",
                "add-custom-recipient-button",
              ]}
            >
              <CSvgIcon
                size={16}
                component={AddIcon}
              />
              {NOTIFICATIONS.ADD_NOTIFICATION_MODAL.labels.customRecipient}
            </CButton>
          )}
        </Box>
        {errors?.followUp?.recipients && (
          <Box className="ct-follow-up-recipients__recipients-count-error">
            {EDITOR_ERROR.REQUIRED_FIELD}
          </Box>
        )}
      </Box>

      {isNonEmptyValue(watchFollowUp?.customRecipients) && (
        <Box className="ct-add-follow-up-modal__custom-recipient-section">
          <Box
            className="ct-add-follow-up-modal__custom-recipient-section-list"
            key={watchFollowUp?.customRecipients?.recipientId}
          >
            {!watchFollowUp.isRelative && (
              <Box className="ct-add-follow-up-modal__custom-recipient-section-list-item">
                <Box className="ct-add-follow-up-modal__text-label">
                  {FOLLOWUP_TASKS.TRIGGER_MODAL.orgLabel}
                </Box>
                <Box>
                  {getSelectedLabel(
                    orgListOptions,
                    watchFollowUp?.customRecipients?.orgs
                  )}
                </Box>
              </Box>
            )}
            {!watchFollowUp.isOrgTypeRelative && (
              <Box className="ct-add-follow-up-modal__custom-recipient-section-list-item">
                <Box className="ct-add-follow-up-modal__text-label">
                  {FOLLOWUP_TASKS.TRIGGER_MODAL.orgTypeLabel}
                </Box>
                <Box>
                  {getSelectedLabel(
                    orgTypeOptions,
                    watchFollowUp?.customRecipients?.orgTypes
                  )}
                </Box>
              </Box>
            )}

            <Box className="ct-add-follow-up-modal__custom-recipient-section-list-item">
              <Box className="ct-add-follow-up-modal__text-label">
                {FOLLOWUP_TASKS.TRIGGER_MODAL.orgPositionLabel}
              </Box>
              <Box>
                {getSelectedLabel(
                  orgPositionsOptions,
                  watchFollowUp?.customRecipients?.positions
                )}
              </Box>
            </Box>
            <Box className="ct-add-follow-up-modal__custom-recipient-section-actions">
              <CIconButton
                size="medium"
                onClick={handleEditCustomRecipient}
              >
                <CSvgIcon component={Edit} />
              </CIconButton>
              <CIconButton
                size="medium"
                severity="destructive"
                onClick={handleDeleteCustomRecipient}
              >
                <CSvgIcon component={Delete} />
              </CIconButton>
            </Box>
          </Box>
        </Box>
      )}
      {isNonEmptyValue(watchFollowUp?.customRecipients) && (
        <Box className="ct-follow-up-recipients__custom-recipients-extra-list">
          <CSelect
            label={FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.taskSharingLabel}
            options={
              FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.TASK_SHARING_OPTIONS
            }
            optionLabelKey="label"
            optionValueKey="value"
            onChange={handleTaskSharingChange}
            value={
              !watchFollowUp.shareTaskByTrigger
                ? FOLLOW_UP_TASK_SHARING_OPTIONS.NO
                : FOLLOW_UP_TASK_SHARING_OPTIONS.YES
            }
          />
          <Controller
            control={control}
            name="followUp.primaryOrgLevelPos"
            render={({ field }) => (
              <CSelect
                {...field}
                label={
                  FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.primaryPositionLabel
                }
                options={
                  FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL
                    .PRIMARY_POSITION_OPTIONS
                }
                value={getPrimaryOrgLevelPosValue()}
                optionLabelKey="label"
                optionValueKey="value"
                placeholder={
                  FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL
                    .primaryPositionPlaceholder
                }
              />
            )}
          />
        </Box>
      )}

      <CustomRecipientModal
        watchTrigger={watchFollowUp}
        customRecipientModal={customRecipientModal}
        setCustomRecipientModal={setCustomRecipientModal}
        walkMeIdPrefix={["add followup step", "add-custom-recipient-button"]}
        handleRecipientSubmit={handleRecipientSubmit}
        orgLevelOptions={orgLevelOptions}
        orgPositionsOptions={orgPositionsOptions}
        orgListOptions={orgListOptions}
        orgTypeOptions={orgTypeOptions}
        fetchOrgData={fetchOrgData}
      />
    </Box>
  );
};

export default FollowUpRecipients;
