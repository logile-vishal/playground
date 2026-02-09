import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useForm, Controller } from "react-hook-form";
import { Box } from "@mui/material";

import CSelect from "@/core/components/form/select";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
import CCheckbox from "@/core/components/form/checkbox/Checkbox";
import CModal, { ModalBody } from "@/core/components/modal/Modal";
import clsx from "@/utils/clsx";
import {
  orgDropdownOptions,
  orgLevelDropdownOptions,
  orgTypeDropdownOptions,
  positionsOptions,
} from "@/pages/create-template/constants/sampleData";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  triggerNewCustomRecipientStepSchema,
  type TriggerNewCustomRecipient,
} from "@/pages/create-template/form-schema/steps/trigger-task";
import { DEFAULT_RECIPIENT } from "@/pages/create-template/constants/notifications";

const CustomRecipientModal = ({
  watchNotification,
  customRecipientModal,
  setCustomRecipientModal,
  walkMeIdPrefix,
  handleRecipientSubmit,
  getRecipientById,
}) => {
  const { NOTIFICATIONS } = useCreateTemplateTranslations();
  const { GENERAL } = useCommonTranslation();
  const {
    control,
    watch,
    setValue,
    handleSubmit: handleFormSubmit,
  } = useForm<{
    recipient: TriggerNewCustomRecipient;
  }>({
    resolver: zodResolver(triggerNewCustomRecipientStepSchema),
    /** TODO: Structure will change later with respect to BE */
    defaultValues: { recipient: DEFAULT_RECIPIENT },
    mode: "onChange",
  });

  const watchRecipient = watch("recipient");

  const handleCloseModal = () => {
    setCustomRecipientModal({ status: false, type: null, recipientId: null });
  };

  const handleSubmit = async () => {
    handleFormSubmit(() => {
      handleRecipientSubmit(
        watchRecipient,
        customRecipientModal.type,
        customRecipientModal.recipientId
      );
      handleCloseModal();
    })();
  };

  const getSelectedLabel = (options, value) => {
    const selectedOption = options.find((option) => option.value === value);
    return selectedOption ? selectedOption.label : null;
  };

  const getNewCustomRecipient = () => {
    const newRecipientId = uuidv4();
    const newCustomRecipient = {
      ...DEFAULT_RECIPIENT,
    };
    newCustomRecipient.recipientPosition.recipientId = newRecipientId;
    newCustomRecipient.recipientOrg.recipientId = newRecipientId;
    newCustomRecipient.recipientOrgType.recipientId = newRecipientId;
    return newCustomRecipient;
  };

  useEffect(() => {
    if (customRecipientModal.status) {
      if (customRecipientModal.type === "edit") {
        const existingRecipient = getRecipientById(
          customRecipientModal.recipientId
        ) as TriggerNewCustomRecipient;
        setValue("recipient", existingRecipient);
      } else {
        const newCustomRecipient = getNewCustomRecipient();
        setValue("recipient", newCustomRecipient);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customRecipientModal, watchNotification]);

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
              name="recipient.recipientOrgTypePosition.orgTypePositionId"
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <CSelect
                    {...field}
                    error={!!error}
                    options={orgLevelDropdownOptions}
                    optionValueKey="value"
                    optionLabelKey="label"
                    className="ct-add-notification-modal__select-condition"
                    templates={{
                      inputValueTemplate: (select) =>
                        getSelectedLabel(
                          orgLevelDropdownOptions,
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
              name="recipient.recipientPosition.positionId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CSelect
                  {...field}
                  error={!!error}
                  options={positionsOptions} // TODO: Remove sample dropdown options after API integration
                  optionValueKey="value"
                  optionLabelKey="label"
                  className="ct-add-notification-modal__select-condition"
                  label={NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.positions}
                  templates={{
                    inputValueTemplate: (context) =>
                      getSelectedLabel(
                        positionsOptions,
                        context?.selectedItems as number
                      ),
                  }}
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
            <Controller
              name="recipient.recipientOrg.orgId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CSelect
                  {...field}
                  error={!!error}
                  options={orgDropdownOptions} // TODO: Remove sample dropdown options after API integration
                  optionValueKey="value"
                  optionLabelKey="label"
                  className="ct-add-notification-modal__select-condition"
                  label={NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.org}
                  templates={{
                    inputValueTemplate: (context) =>
                      getSelectedLabel(
                        orgDropdownOptions,
                        context.selectedItems as number
                      ),
                  }}
                  placeholder={
                    NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.orgPlaceholder
                  }
                />
              )}
            />
            {/* TODO: isRelative structure will be changed later */}
            <Controller
              name="recipient.isRelative"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CCheckbox
                  {...field}
                  error={!!error}
                  className="mt-24"
                  label={NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.relative}
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
            <Controller
              name="recipient.recipientOrgType.orgTypeId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CSelect
                  {...field}
                  options={orgTypeDropdownOptions} // TODO: Remove sample dropdown options after API integration
                  optionValueKey="value"
                  optionLabelKey="label"
                  className="ct-add-notification-modal__select-condition"
                  label={NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.orgType}
                  error={!!error}
                  templates={{
                    inputValueTemplate: (context) =>
                      getSelectedLabel(
                        orgTypeDropdownOptions,
                        context.selectedItems as number
                      ),
                  }}
                  placeholder={
                    NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.orgTypePlaceholder
                  }
                />
              )}
            />

            {/* TODO: isOrgTypeRelative structure will be changed later */}
            <Controller
              name="recipient.isOrgTypeRelative"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CCheckbox
                  {...field}
                  error={!!error}
                  className="mt-24"
                  label={NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.relative}
                />
              )}
            />
          </Box>
        </Box>
      </ModalBody>
    </CModal>
  );
};

export default CustomRecipientModal;
