import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { isNonEmptyValue } from "@/utils";

import { Box, Tooltip } from "@mui/material";
import { InfoCircle } from "@/core/constants/icons";
import CSelect from "@/core/components/form/select";
import CSvgIcon from "@/core/components/icon/Icon";
import CIconButton from "@/core/components/button/IconButton";
import WildcardLabel from "@/core/components/wildcard-label/WildcardLabel";
import { TRIGGER_CONDITIONS } from "@/pages/create-template/constants/triggers";
import type { QuestionProps } from "@/pages/create-template/types/questions.type";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";

import "./FollowUpCondition.scss";

const FollowUpCondition = ({
  control,
  watchFollowUp,
  watchQuestionList,
  getQuestionsList,
  getQuestionLabel = (id: string) => id,
  getAnswerLabel = (_: string, id: string) => id,
}) => {
  const { NOTIFICATIONS, FOLLOWUP_TASKS } = useCreateTemplateTranslations();
  const [answerOptions, setAnswerOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const getConditionValue = () => {
    return (
      NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.CONDITION_OPTIONS.find(
        (option) => option.value === watchFollowUp.condition
      ) || null
    );
  };

  useEffect(() => {
    const list = watchQuestionList?.find(
      (question: QuestionProps) => question.qId === watchFollowUp.questionId
    );
    const answerList = list?.questionBasicData?.response.map(
      (answer, index) => ({
        label: answer.title,
        value: index.toString(),
        ...answer,
      })
    );
    setAnswerOptions(answerList);
  }, [watchFollowUp.questionId, watchQuestionList]);

  return (
    <div className="ct-follow-up-condition">
      <div className="ct-follow-up-condition-item-wrapper">
        <Controller
          name="followUp.condition"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <CSelect
              {...field}
              error={!!error}
              helperText={error ? error.message : ""}
              options={NOTIFICATIONS.CUSTOM_RECIPIENT_MODAL.CONDITION_OPTIONS}
              optionValueKey="value"
              optionLabelKey="label"
              required={true}
              value={getConditionValue()}
              className="ct-follow-up-condition-select-condition"
              label={
                FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.condition.label
              }
              placeholder={
                FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.PLACEHOLDER
                  .chooseCondition
              }
            />
          )}
        />
        <div>
          {watchFollowUp.condition === TRIGGER_CONDITIONS.TASK_COMPLIANCE ? (
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
        </div>
      </div>

      {watchFollowUp.condition === TRIGGER_CONDITIONS.ANSWER ? (
        <>
          <Box>
            <Controller
              name="followUp.questionId"
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
          {isNonEmptyValue(watchFollowUp.questionId) && (
            <Box>
              <Controller
                name="followUp.answerIndex"
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
                            watchFollowUp.questionId,
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
    </div>
  );
};
export default FollowUpCondition;
