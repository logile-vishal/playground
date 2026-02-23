import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box } from "@mui/material";

import {
  triggerNewCustomRecipientStepSchema,
  type TriggerRecipient,
} from "@/pages/create-template/form-schema/steps/trigger-task";
import clsx from "@/utils/clsx";
import CSelect from "@/core/components/form/select";
import { zodResolver } from "@hookform/resolvers/zod";
import CCheckbox from "@/core/components/form/checkbox/Checkbox";
import CModal, { ModalBody } from "@/core/components/modal/Modal";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
import {
  getNewCustomRecipient,
  NOTIFICATIONS_ACTION_TYPE,
} from "@/pages/create-template/constants/triggers";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { isNonEmptyValue } from "@/utils";

import "../AddEditNotificationModal/AddEditNotificationModal.scss";

const CustomRecipientModal = ({
  watchTrigger,
  customRecipientModal,
  setCustomRecipientModal,
  walkMeIdPrefix,
  handleRecipientSubmit,
  orgLevelOptions,
  orgPositionsOptions,
  orgListOptions,
  orgTypeOptions,
  fetchOrgData,
}) => {
  const { NOTIFICATIONS } = useCreateTemplateTranslations();
  const { GENERAL } = useCommonTranslation();
  const {
    control,
    watch,
    setValue,
    handleSubmit: handleFormSubmit,
  } = useForm<{
    recipient: TriggerRecipient;
  }>({
    resolver: zodResolver(triggerNewCustomRecipientStepSchema),
    defaultValues: { recipient: getNewCustomRecipient() },
    mode: "onChange",
  });
  const [shouldShowErrors, setShouldShowErrors] = useState(false);
  const watchRecipient = watch("recipient");

  const handleCloseModal = () => {
    setCustomRecipientModal({ status: false, type: null, recipientId: null });
  };

  const handleSubmit = async () => {
    setShouldShowErrors(true);
    handleFormSubmit(() => {
      handleRecipientSubmit(watchRecipient);
      handleCloseModal();
    })();
  };

  const getUniqueValues = (arr: number[]): number[] => {
    const uniqueSet = new Set(arr);
    return Array.from(uniqueSet);
  };

  const handleOrgLevel = (e) => {
    const value = e.target.value;
    const currentRecipient = { ...watchRecipient };
    currentRecipient.customRecipients.orgLevel = value;
    setValue("recipient", currentRecipient, {});
    setShouldShowErrors(false);
  };

  const handlePositionsChange = (e) => {
    const value = e.target.value;
    const newArr = watchRecipient.customRecipients.positions || [];
    newArr.push(...value);
    const copyPositions = getUniqueValues(newArr);
    const currentRecipient = { ...watchRecipient };
    currentRecipient.customRecipients.positions = copyPositions;
    setValue("recipient", currentRecipient, {});
    setShouldShowErrors(false);
  };

  const handleOrgsChange = (e) => {
    const value = e.target.value;
    const newArr = watchRecipient.customRecipients.orgs || [];
    newArr.push(value);
    const copyOrgs = getUniqueValues(newArr);
    const currentRecipient = { ...watchRecipient };
    currentRecipient.customRecipients.orgs = copyOrgs;
    setValue("recipient", currentRecipient, {});
    setShouldShowErrors(false);
  };

  const handleOrgTypesChange = (e) => {
    const value = e.target.value;
    const newArr = watchRecipient.customRecipients.orgTypes || [];
    newArr.push(...value);
    const copyOrgTypes = getUniqueValues(newArr);
    const currentRecipient = { ...watchRecipient };
    currentRecipient.customRecipients.orgTypes = copyOrgTypes;
    setValue("recipient", currentRecipient, {});
    setShouldShowErrors(false);
  };

  const getSelectedLabel = (options, value) => {
    const selectedOption = options.find((option) => option.value === value);
    return selectedOption ? selectedOption.label : null;
  };

  const getSelectedValues = (options, values) => {
    const selectedOptions = options.filter((option) =>
      values?.includes(option.value)
    );
    return selectedOptions;
  };

  const handleIsRelative = (e) => {
    const value = e.target.checked;
    const currentRecipient = { ...watchRecipient };
    currentRecipient.isRelative = value;
    currentRecipient.customRecipients.orgs = [];
    setValue("recipient", currentRecipient, {
      shouldDirty: false,
      shouldValidate: false,
    });
  };

  const handleIsOrgTypeRelative = (e) => {
    const value = e.target.checked;
    const currentRecipient = { ...watchRecipient };
    currentRecipient.isOrgTypeRelative = value;
    currentRecipient.customRecipients.orgTypes = [];
    setValue("recipient", currentRecipient, {
      shouldDirty: false,
      shouldValidate: false,
    });
  };

  useEffect(() => {
    if (customRecipientModal.status) {
      if (customRecipientModal.type === NOTIFICATIONS_ACTION_TYPE.EDIT) {
        const existingRecipient = watchTrigger.customRecipients;
        setValue("recipient", {
          customRecipients: existingRecipient,
          isRelative: watchTrigger.isRelative,
          isOrgTypeRelative: watchTrigger.isOrgTypeRelative,
        });
      } else {
        const newCustomRecipient = getNewCustomRecipient();
        setValue("recipient", newCustomRecipient);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customRecipientModal, watchTrigger]);

  useEffect(() => {
    if (isNonEmptyValue(watchRecipient.customRecipients.orgLevel)) {
      fetchOrgData(watchRecipient.customRecipients.orgLevel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchRecipient.customRecipients.orgLevel]);

  return (
    <CModal
      open={customRecipientModal?.status}
      onClose={handleCloseModal}
      title={NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.title}
      size="medium"
      walkMeIdPrefix={[...walkMeIdPrefix, "custom recipient submit button"]}
      confirmText={GENERAL.submitButtonLabel}
      onConfirm={handleSubmit}
    >
      <ModalBody>
        <Box
          className={clsx({
            "ct-add-notification-modal": true,
            "ct-custom-recipient-modal": true,
          })}
        >
          <Box className="ct-add-notification-modal__select">
            <Controller
              name="recipient.customRecipients.orgLevel"
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <CSelect
                    {...field}
                    error={shouldShowErrors && !!error}
                    required={true}
                    options={orgLevelOptions}
                    optionValueKey="value"
                    optionLabelKey="label"
                    className="ct-add-notification-modal__select-condition"
                    onChange={handleOrgLevel}
                    templates={{
                      inputValueTemplate: (select) =>
                        getSelectedLabel(
                          orgLevelOptions,
                          select.selectedItems as number
                        ),
                    }}
                    label={NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.orgLevel}
                    placeholder={
                      NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.orgLevelPlaceholder
                    }
                  />
                );
              }}
            />
          </Box>
          <Box className="ct-add-notification-modal__select">
            <Controller
              name="recipient.customRecipients.positions"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CSelect
                  {...field}
                  error={shouldShowErrors && !!error}
                  required={true}
                  options={orgPositionsOptions}
                  optionValueKey="value"
                  optionLabelKey="label"
                  disabled={!watchRecipient.customRecipients.orgLevel}
                  value={getSelectedValues(
                    orgPositionsOptions,
                    watchRecipient.customRecipients.positions
                  )}
                  allowMultiSelect={true}
                  className="ct-add-notification-modal__select-condition"
                  onChange={handlePositionsChange}
                  label={NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.positions}
                  placeholder={
                    NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.positionsPlaceholder
                  }
                />
              )}
            />
          </Box>
          <Box
            className={clsx({
              "ct-add-notification-modal__select": true,
              "ct-add-notification-modal__select-wrapper": true,
            })}
          >
            {!watchRecipient.isRelative && (
              <Controller
                name="recipient.customRecipients.orgs"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CSelect
                    {...field}
                    error={shouldShowErrors && !!error}
                    options={orgListOptions}
                    required={true}
                    optionValueKey="value"
                    optionLabelKey="label"
                    disabled={!watchRecipient.customRecipients.orgLevel}
                    value={
                      getSelectedValues(
                        orgListOptions,
                        watchRecipient.customRecipients.orgs
                      )?.[0]
                    }
                    className="ct-add-notification-modal__select-condition"
                    onChange={handleOrgsChange}
                    label={NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.org}
                    placeholder={
                      NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.orgPlaceholder
                    }
                  />
                )}
              />
            )}
            <div className="ct-add-notification-modal__relative-wrapper">
              {watchRecipient.isRelative && (
                <div className="ct-add-notification-modal__relative-wrapper--label">
                  {NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.org}
                </div>
              )}
              <Controller
                name="recipient.isRelative"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CCheckbox
                    {...field}
                    error={shouldShowErrors && !!error}
                    onChange={handleIsRelative}
                    className={clsx({ "mt-24": !watchRecipient.isRelative })}
                    label={NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.relative}
                  />
                )}
              />
            </div>
          </Box>
          <Box
            className={clsx({
              "ct-add-notification-modal__select": true,
              "ct-add-notification-modal__select-wrapper": true,
            })}
          >
            {!watchRecipient.isOrgTypeRelative && (
              <Controller
                name="recipient.customRecipients.orgTypes"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CSelect
                    {...field}
                    options={orgTypeOptions}
                    required={true}
                    optionValueKey="value"
                    optionLabelKey="label"
                    allowMultiSelect={true}
                    disabled={!watchRecipient.customRecipients.orgLevel}
                    value={getSelectedValues(
                      orgTypeOptions,
                      watchRecipient.customRecipients.orgTypes
                    )}
                    className="ct-add-notification-modal__select-condition"
                    label={NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.orgType}
                    onChange={handleOrgTypesChange}
                    error={shouldShowErrors && !!error}
                    placeholder={
                      NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.orgTypePlaceholder
                    }
                  />
                )}
              />
            )}
            <div className="ct-add-notification-modal__relative-wrapper">
              {watchRecipient.isOrgTypeRelative && (
                <div className="ct-add-notification-modal__relative-wrapper--label">
                  {NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.orgType}
                </div>
              )}
              <Controller
                name="recipient.isOrgTypeRelative"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CCheckbox
                    {...field}
                    error={shouldShowErrors && !!error}
                    onChange={handleIsOrgTypeRelative}
                    className={clsx({
                      "mt-24": !watchRecipient.isOrgTypeRelative,
                    })}
                    label={NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.relative}
                  />
                )}
              />
            </div>
          </Box>
        </Box>
      </ModalBody>
    </CModal>
  );
};

export default CustomRecipientModal;
