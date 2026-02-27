import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useFollowUpTaskStepSchema,
  type FollowUpTaskSchema,
} from "@/pages/create-template/form-schema/steps/followup-tasks";
import {
  DEFAULT_FOLLOW_UP_TASK,
  NOTIFICATIONS_ACTION_TYPE,
  TRIGGER_CONDITIONS,
} from "@/pages/create-template/constants/triggers";
import CModal, { ModalBody, ModalFooter } from "@/core/components/modal/Modal";
import CStepper from "@/core/components/stepper/Stepper";
import type { StepOption } from "@/core/types/stepper.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
import { QUESTION_TYPE } from "@/pages/create-template/constants/questions";
import { CButton } from "@/core/components/button/button";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import { isNonEmptyValue } from "@/utils";

import FollowUpCondition from "./components/follow-up-condition/FollowUpCondition";
import FollowUpTemplate from "./components/follow-up-template/FollowUpTemplate";
import FollowUpRecipients from "./components/follow-up-recipients/FollowUpRecipients";
import FollowUpSettings from "./components/follow-up-settings/FollowUpSettings";
import "./AddEditFollowUpModal.scss";

const getDefaultFollowUp = (): FollowUpTaskSchema => {
  return { ...DEFAULT_FOLLOW_UP_TASK, triggerId: uuidv4() };
};

const AddEditFollowUpModal = ({
  showFollowUpModal,
  handleCloseFollowUpModal,
  watchQuestionList,
  getQuestionLabel,
  getAnswerLabel,
  questionId = null,
  answerIndex = null,
  optionLevelTrigger = false,
}) => {
  const { followUpTaskStepSchema } = useFollowUpTaskStepSchema();
  const {
    trigger: triggerValidation,
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<{
    followUp: FollowUpTaskSchema;
  }>({
    resolver: zodResolver(followUpTaskStepSchema),
    defaultValues: { followUp: getDefaultFollowUp() },
    mode: "onChange",
  });
  const [currentStep, setCurrentStep] = useState<{
    activeStep: number;
    data: StepOption;
  }>({
    activeStep: 0,
    data: null,
  });
  const [customRecipientModal, setCustomRecipientModal] = useState({
    status: false,
    type: null,
    recipientId: null,
  });
  const [shouldShowErrors, setShouldShowErrors] = useState(false);
  const watchFollowUp = watch("followUp");
  const { getFormValues, setFormValue } = useCreateTemplateForm();
  const { FOLLOWUP_TASKS } = useCreateTemplateTranslations();
  const { GENERAL } = useCommonTranslation();

  const closeCustomRecipientModal = () => {
    setCustomRecipientModal({
      status: false,
      type: null,
      recipientId: null,
    });
  };

  const handleCloseModal = (): void => {
    reset({ followUp: getDefaultFollowUp() });
    setShouldShowErrors(false);
    setCurrentStep({
      activeStep: 0,
      data: null,
    });
    closeCustomRecipientModal();
    handleCloseFollowUpModal();
  };

  const isAllStepValid = async () => {
    let isValid = true;
    if ((await checkConditionValidity()) === false) isValid = false;
    if ((await checkRecipientsValidity()) === false) isValid = false;
    if ((await checkTemplateValidity()) === false) isValid = false;
    if ((await checkSettingValidity()) === false) isValid = false;
    return isValid;
  };

  const checkConditionValidity = async (): Promise<boolean> => {
    const isConditionValid = await triggerValidation("followUp.condition");
    if (watchFollowUp.condition === TRIGGER_CONDITIONS.ANSWER) {
      const isQuestionValid = await triggerValidation("followUp.questionId");
      const isAnswerValid = await triggerValidation("followUp.answerIndex");
      return isConditionValid && isQuestionValid && isAnswerValid;
    }
    return isConditionValid;
  };

  const checkRecipientsValidity = async (): Promise<boolean> => {
    const isValid = await triggerValidation("followUp.recipients");
    return isValid;
  };

  const checkTemplateValidity = async (): Promise<boolean> => {
    const isTemplateNameValid = await triggerValidation(
      "followUp.triggerTaskName"
    );
    const isTemplateIdValid = await triggerValidation("followUp.templateId");
    let isValid = isTemplateNameValid && isTemplateIdValid;
    if (!isNonEmptyValue(watchFollowUp.triggerTaskName)) isValid = false;
    if (!isNonEmptyValue(watchFollowUp.templateId)) isValid = false;
    setShouldShowErrors(!isValid);
    return isValid;
  };

  const checkSettingValidity = async (): Promise<boolean> => {
    let isValid = true;
    if (
      !watchFollowUp.originalTaskEndTime &&
      (!isNonEmptyValue(watchFollowUp.durationValue) ||
        !isNonEmptyValue(watchFollowUp.durationType))
    ) {
      isValid = false;
    }
    setShouldShowErrors(!isValid);
    return isValid;
  };

  const handleFollowUpSubmit = async () => {
    if ((await isAllStepValid()) === false) return;
    handleSubmit(async () => {
      const followUpList = getFormValues("followUpTasks");
      if (showFollowUpModal.type === NOTIFICATIONS_ACTION_TYPE.EDIT) {
        followUpList[
          followUpList.findIndex(
            (item) => item?.triggerId === watchFollowUp.triggerId
          )
        ] = watchFollowUp;
      } else {
        followUpList.push(watchFollowUp);
      }

      setFormValue("followUpTasks", followUpList);
      handleCloseModal();
    })();
  };

  /**
   * @method getNextStep
   * @description Get the next step index and data based on the type
   * @returns {Object} nextIndex and data for the next step
   */
  const getNextStep = (type) => {
    let nextIndex = 0;
    let data = null;
    if (isNonEmptyValue(type)) {
      stepperOptions.forEach((option, index) => {
        if (option.value === type) {
          nextIndex = index;
          data = option;
        }
      });
    }
    return { nextIndex, data };
  };

  /**
   * @method handleValidateAndNext
   * @description Validate the current step and move to the next step if valid
   * @returns {Promise<void>}
   */
  const handleValidateAndNext = async (): Promise<void> => {
    if (
      currentStep?.data?.value ===
      FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.condition.value
    ) {
      checkConditionValidity().then((isValid) => {
        if (isValid) {
          const nextStep = getNextStep(
            FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.recipients.value
          );
          setCurrentStep((prev) => ({
            ...prev,
            activeStep: nextStep.nextIndex,
            data: nextStep.data,
          }));
        }
      });
    } else if (
      currentStep?.data?.value ===
      FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.recipients.value
    ) {
      checkRecipientsValidity().then((isValid) => {
        if (isValid) {
          const nextStep = getNextStep(
            FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.template.value
          );
          setCurrentStep((prev) => ({
            ...prev,
            activeStep: nextStep.nextIndex,
            data: nextStep.data,
          }));
        }
      });
    } else if (
      currentStep?.data?.value ===
      FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.template.value
    ) {
      checkTemplateValidity().then((isValid) => {
        if (isValid) {
          const nextStep = getNextStep(
            FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.settings.value
          );
          setCurrentStep((prev) => ({
            ...prev,
            activeStep: nextStep.nextIndex,
            data: nextStep.data,
          }));
        }
      });
    } else if (
      currentStep?.data?.value ===
      FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.settings.value
    ) {
      checkSettingValidity().then((isValid) => {
        if (isValid) {
          handleFollowUpSubmit();
        }
      });
    }
  };

  const handleStepChange = (event: {
    activeStep: number;
    data: StepOption;
  }): void => {
    setCurrentStep({
      activeStep: event.activeStep,
      data: event.data,
    });
  };

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

  useEffect(() => {
    if (showFollowUpModal?.type === NOTIFICATIONS_ACTION_TYPE.EDIT) {
      setValue("followUp", showFollowUpModal.data as FollowUpTaskSchema, {
        shouldValidate: false,
        shouldDirty: false,
      });
    } else if (showFollowUpModal?.type === NOTIFICATIONS_ACTION_TYPE.CLONE) {
      const clonedData: FollowUpTaskSchema = {
        ...showFollowUpModal.data,
        triggerId: uuidv4(),
      };
      setValue("followUp", clonedData, {
        shouldValidate: false,
        shouldDirty: false,
      });
    } else {
      setValue("followUp", getDefaultFollowUp(), {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [showFollowUpModal, setValue]);

  const conditionStepperData = {
    label: FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.condition.label,
    value: FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.condition.value,
    error: false,
    disabled: false,
    checkValidity: () => checkConditionValidity(),
    component: (
      <FollowUpCondition
        control={control}
        watchFollowUp={watchFollowUp}
        watchQuestionList={watchQuestionList}
        getQuestionsList={getQuestionsList}
        getQuestionLabel={getQuestionLabel}
        getAnswerLabel={getAnswerLabel}
      />
    ),
  };
  let stepperOptions: StepOption[] = !optionLevelTrigger
    ? [conditionStepperData]
    : [];

  stepperOptions = [
    ...stepperOptions,
    {
      label: FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.recipients.label,
      value: FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.recipients.value,
      error: false,
      disabled: false,
      checkValidity: () => checkRecipientsValidity(),
      component: (
        <FollowUpRecipients
          control={control}
          watchFollowUp={watchFollowUp}
          getValues={getValues}
          setValue={setValue}
          customRecipientModal={customRecipientModal}
          setCustomRecipientModal={setCustomRecipientModal}
          errors={errors}
        />
      ),
    },
    {
      label: FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.template.label,
      value: FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.template.value,
      error: false,
      disabled: false,
      checkValidity: () => checkTemplateValidity(),
      component: (
        <FollowUpTemplate
          control={control}
          setValue={setValue}
          watchFollowUp={watchFollowUp}
          shouldShowErrors={shouldShowErrors}
          setShouldShowErrors={setShouldShowErrors}
        />
      ),
    },
    {
      label: FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.settings.label,
      value: FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.settings.value,
      error: false,
      disabled: false,
      checkValidity: () => checkSettingValidity(),
      component: (
        <FollowUpSettings
          control={control}
          watchFollowUp={watchFollowUp}
          setValue={setValue}
          shouldShowErrors={shouldShowErrors}
        />
      ),
    },
  ];

  const renderStepper = () => {
    return (
      <CStepper
        currentStep={currentStep.activeStep}
        onChange={handleStepChange}
        options={stepperOptions}
      />
    );
  };

  const handleCancel = () => {
    handleCloseModal();
  };

  useEffect(() => {
    if (showFollowUpModal?.type === NOTIFICATIONS_ACTION_TYPE.EDIT) {
      setValue("followUp", showFollowUpModal.data, {
        shouldDirty: false,
        shouldValidate: false,
      });
    } else if (showFollowUpModal?.type === NOTIFICATIONS_ACTION_TYPE.CLONE) {
      const clonedData = {
        ...showFollowUpModal.data,
        triggerId: uuidv4(),
      };
      setValue("followUp", clonedData, {
        shouldDirty: false,
        shouldValidate: false,
      });
    } else {
      const defaultFollowUp = getDefaultFollowUp();
      if (optionLevelTrigger) {
        defaultFollowUp.condition = "ANSWER";
        defaultFollowUp.questionId = questionId;
        defaultFollowUp.answerIndex = String(answerIndex);
      }
      setValue("followUp", defaultFollowUp, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [
    showFollowUpModal,
    setValue,
    optionLevelTrigger,
    questionId,
    answerIndex,
  ]);

  useEffect(() => {
    if (showFollowUpModal.status) {
      setCurrentStep({
        activeStep: 0,
        data: stepperOptions[0],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFollowUpModal.status]);

  const getModalTitle = (): string => {
    if (showFollowUpModal?.type === NOTIFICATIONS_ACTION_TYPE.EDIT) {
      return FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.MODAL_TITLE.edit;
    }
    if (showFollowUpModal?.type === NOTIFICATIONS_ACTION_TYPE.CLONE) {
      return FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.MODAL_TITLE.clone;
    }
    return FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.MODAL_TITLE.add;
  };

  return (
    <CModal
      title={getModalTitle()}
      open={showFollowUpModal.status}
      size="xlarge"
      onClose={handleCloseModal}
      containerClassName="ct-add-edit-follow-up-modal"
    >
      <ModalBody>
        <div className="ct-add-edit-follow-up-modal-body">
          {renderStepper()}
        </div>
      </ModalBody>
      <ModalFooter>
        <CButton
          variant="outline"
          severity="secondary"
          onClick={handleCancel}
        >
          {GENERAL.cancelButtonLabel}
        </CButton>
        {currentStep?.data?.value !==
          FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.settings.value && (
          <CButton
            variant="solid"
            severity="secondary"
            onClick={handleValidateAndNext}
          >
            {GENERAL.nextButtonLabel}
          </CButton>
        )}
        {currentStep?.data?.value ===
          FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.STEPPER.settings.value && (
          <CButton
            variant="solid"
            severity="primary"
            onClick={handleFollowUpSubmit}
          >
            {GENERAL.submitButtonLabel}
          </CButton>
        )}
      </ModalFooter>
    </CModal>
  );
};

export default AddEditFollowUpModal;
