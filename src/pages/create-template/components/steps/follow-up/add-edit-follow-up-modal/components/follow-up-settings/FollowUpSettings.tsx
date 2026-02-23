import { Controller } from "react-hook-form";

import CTextfield from "@/core/components/form/textfield/Textfield";
import CSelect from "@/core/components/form/select";
import CCheckbox from "@/core/components/form/checkbox/Checkbox";
import CSwitch from "@/core/components/form/switch/Switch";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { isNonEmptyValue } from "@/utils";

import "./FollowUpSettings.scss";

const FollowUpSettings = ({
  control,
  watchFollowUp,
  setValue,
  shouldShowErrors,
}) => {
  const { FOLLOWUP_TASKS } = useCreateTemplateTranslations();
  const handleDurationType = (e) => {
    const value = e.target.value;
    const currentFollowUp = JSON.parse(JSON.stringify(watchFollowUp)) || {};
    currentFollowUp.durationType = value;
    currentFollowUp.messageDefinition.conditionUnit = value;
    setValue("followUp", currentFollowUp, { shouldValidate: true });
  };

  const getDurationTypeLabel = () => {
    const value = watchFollowUp.durationType;
    const option = FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.DURATION_OPTIONS.find(
      (option) => option.value === value
    );
    return option ? option : "";
  };

  const handleOriginalTaskEndTime = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setValue("followUp.durationValue", null);
      setValue("followUp.durationType", null);
    }
    const currentFollowUp = JSON.parse(JSON.stringify(watchFollowUp)) || {};
    currentFollowUp.originalTaskEndTime = checked;
    setValue("followUp", currentFollowUp);
  };

  return (
    <div className="ct-follow-up-settings">
      <div className="ct-follow-up-settings__form-group">
        {!watchFollowUp.originalTaskEndTime && (
          <div className="ct-follow-up-settings__form-group-left-label-wrapper">
            <div className="ct-follow-up-settings__form-group-left-label">
              <span className="required">
                {FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.durationLabel}
              </span>
            </div>
            <div className="ct-follow-up-settings__form-group-left">
              <Controller
                control={control}
                name="followUp.durationValue"
                render={({ field, fieldState: { error } }) => (
                  <CTextfield
                    {...field}
                    type="number"
                    min={0}
                    error={!!error}
                    helperText={error ? error.message : ""}
                    required={true}
                  />
                )}
              />
              <div className="ct-follow-up-settings__form-group-left-select">
                <Controller
                  control={control}
                  name="followUp.durationType"
                  render={({ field, fieldState: { error } }) => (
                    <CSelect
                      {...field}
                      optionValueKey="value"
                      optionLabelKey="label"
                      onChange={handleDurationType}
                      value={getDurationTypeLabel()}
                      options={
                        FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.DURATION_OPTIONS
                      }
                      placeholder={
                        FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS
                          .durationPlaceholder
                      }
                      error={!!error}
                      helperText={error ? error.message : ""}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )}

        <div className="ct-follow-up-settings__form-group-right">
          <Controller
            control={control}
            name="followUp.originalTaskEndTime"
            render={({ field }) => (
              <CCheckbox
                {...field}
                onChange={handleOriginalTaskEndTime}
                label={FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.taskEndTimeLabel}
              />
            )}
          />
        </div>
      </div>
      {shouldShowErrors &&
      !watchFollowUp.originalTaskEndTime &&
      (!isNonEmptyValue(watchFollowUp.durationValue) ||
        !isNonEmptyValue(watchFollowUp.durationType)) ? (
        <div className="error">
          {FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.durationErrorLabel}
        </div>
      ) : (
        ""
      )}

      <div className="ct-follow-up-settings__form-group">
        <div className="ct-follow-up-settings__form-group-left">
          <Controller
            control={control}
            name="followUp.priority"
            render={({ field }) => (
              <CSelect
                {...field}
                optionValueKey="value"
                optionLabelKey="label"
                label={FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.priorityLabel}
                options={
                  FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.PRIORITY_OPTIONS
                }
                placeholder={
                  FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.priorityPlaceholder
                }
              />
            )}
          />
        </div>
        <div className="ct-follow-up-settings__form-group-right">
          <Controller
            control={control}
            name="followUp.userRetainVisibility"
            render={({ field }) => (
              <CSwitch
                {...field}
                label={
                  FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS.retainVisibilityLabel
                }
              />
            )}
          />
        </div>
      </div>

      <div className="ct-follow-up-settings__form-group">
        <div className="ct-follow-up-settings__form-group-left">
          <Controller
            control={control}
            name="followUp.reminderNotificationType"
            render={({ field }) => (
              <CSelect
                {...field}
                label={
                  FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS
                    .reminderNotificationLabel
                }
                optionValueKey="value"
                optionLabelKey="label"
                options={
                  FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS
                    .REMINDER_NOTIFICATION_OPTIONS
                }
                placeholder={
                  FOLLOWUP_TASKS.FOLLOWUP_TASKS_SETTINGS
                    .reminderNotificationPlaceholder
                }
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default FollowUpSettings;
