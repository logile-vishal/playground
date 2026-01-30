import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";

import CIconButton from "@/core/components/button/IconButton";
import { CButton } from "@/core/components/button/button";
import CSvgIcon from "@/core/components/icon/Icon";
import { ChevronLeft } from "@/core/constants/icons";
import CStepper from "@/core/components/stepper/Stepper";
import type { StepOption } from "@/core/types/stepper.type";
import PageTemplate from "@/layouts/page-template/PageTemplate";
import { useWalkmeId } from "@/core/hooks/useWalkmeId";
import { useNotification } from "@/core/services/notification.service";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import { Severity } from "@/core/types/severity.type";

import BasicInfo from "./components/steps/basic-info/BasicInfo";
import Questions from "./components/steps/questions/Questions";
import Notifications from "./components/steps/notifications/Notifications";
import FollowUp from "./components/steps/follow-up/FollowUp";
import AdvancedOptions from "./components/steps/advanced-options/AdvancedOptions";
import { CreateTemplateFormProvider } from "./providers/CreateTemplateFormProvider";
import { useCreateTemplateTranslations } from "./translation/useCreateTemplateTranslations";
import "./CreateTemplate.scss";
import { useGetPreviewByTemplateId } from "../template-library/services/template-library-api-hooks";
import PreviewModal from "../template-library/components/preview-modal/PreviewModal";
import type { TemplatePreviewModalProps } from "../template-library/types/template-library.type";
import type { QuestionProps } from "./types/questions.type";

const CreateTemplateContent: React.FC = () => {
  const navigate = useNavigate();
  const { triggerValidation, formErrors, watch } = useCreateTemplateForm();
  const watchQuestionList = watch("questions") as QuestionProps[];
  const { generateId } = useWalkmeId();
  const {
    CREATE_TEMPLATE_STEPS,
    CREATE_TEMPLATE_HEADING,
    CREATE_TEMPLATE_HEADER_ACTIONS,
    QUESTIONS,
  } = useCreateTemplateTranslations();
  const { notify } = useNotification();
  const { basicInfo, questions, advancedOption, notification, followUp } =
    CREATE_TEMPLATE_STEPS;
  const [currentStep, setCurrentStep] = useState({
    activeStep: 0,
    data: CREATE_TEMPLATE_STEPS.basicInfo,
  });
  const [previewModal, setPreviewModal] = useState<TemplatePreviewModalProps>({
    status: false,
    data: null,
  });

  const handleQuestionError = () => {
    if (watchQuestionList.length < 1)
      notify({
        title: QUESTIONS.oneQuestionRequiredError,
        config: {
          severity: Severity.ERROR,
        },
      });
  };

  const {
    data: templatePreviewData,
    isPending: isPreviewLoading,
    mutateAsync: getPreviewByTemplateId,
    error: hasTemplatePreviewError,
  } = useGetPreviewByTemplateId();

  const handleNavigateBack = (): void => {
    navigate("/templates");
  };

  const stepperOptions: StepOption[] = [
    {
      label: basicInfo.label,
      value: basicInfo.value,
      error: !!formErrors.basicData,
      component: <BasicInfo />,
      checkValidity: useCallback(
        async () => await triggerValidation("basicData"),
        [triggerValidation]
      ),
    },
    {
      label: questions.label,
      value: questions.value,
      error: !!(formErrors as { questions?: unknown }).questions,
      component: <Questions />,
      checkValidity: useCallback(async () => {
        handleQuestionError();
        return await triggerValidation("questions");
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [triggerValidation, notify, watchQuestionList]),
    },
    {
      label: advancedOption.label,
      value: advancedOption.value,
      error: !!formErrors.advancedOptions,
      component: <AdvancedOptions />,
      checkValidity: useCallback(
        async () => await triggerValidation("advancedOptions"),
        [triggerValidation]
      ),
    },
    {
      label: notification.label,
      value: notification.value,
      error: !!formErrors.notifications,
      component: <Notifications />,
      checkValidity: useCallback(
        async () => await triggerValidation("notifications"),
        [triggerValidation]
      ),
    },
    {
      label: followUp.label,
      value: followUp.value,
      component: <FollowUp />,
      checkValidity: useCallback(
        async () => await triggerValidation("followUpTask"),
        [triggerValidation]
      ),
    },
  ];

  /**
   * @method handleValidation
   * @description Validates the current step's form fields
   * @param {number} stepIndex - Index of the step to validate
   * @returns {Promise<boolean>} True if validation passes, false otherwise
   */
  const handleValidation = async (stepIndex: number): Promise<boolean> => {
    let isValid = true;
    if (stepIndex === 0) {
      isValid = await triggerValidation("basicData");
    } else if (stepIndex === 1) {
      isValid = await triggerValidation("questions");
    } else if (stepIndex === 2) {
      isValid = await triggerValidation("advancedOptions");
    } else if (stepIndex === 3) {
      isValid = await triggerValidation("notifications");
    } else if (stepIndex === 4) {
      isValid = await triggerValidation("followUpTask");
    }
    return isValid;
  };

  const handleStepChange = useCallback(
    (event: { activeStep: number; data: StepOption }): void => {
      setCurrentStep((prev) => ({
        ...prev,
        activeStep: event.activeStep,
        data: event.data,
      }));
    },
    []
  );

  const handleNextStep = async (): Promise<void> => {
    const isValid = await handleValidation(currentStep.activeStep);
    handleQuestionError();
    if (isValid && currentStep.activeStep < stepperOptions.length - 1) {
      setCurrentStep((prev) => ({
        ...prev,
        activeStep: prev.activeStep + 1,
        data: stepperOptions[prev.activeStep + 1],
      }));
    }
  };

  const handleSaveStep = async (): Promise<void> => {
    const isValid = await handleValidation(currentStep.activeStep);
    if (isValid) {
      // TODO: Implement save logic here
    }
  };

  const handlePreviewModalOpen = (): void => {
    getPreviewByTemplateId(1829);
    setPreviewModal((prev) => ({ ...prev, status: true }));
  };

  useEffect(() => {
    if (templatePreviewData?.data) {
      setPreviewModal((prev) => ({ ...prev, data: templatePreviewData?.data }));
    }
  }, [templatePreviewData]);

  return (
    <>
      <PageTemplate.Header>
        <Stack
          direction={"row"}
          className="create-template-page-header"
        >
          <Box className="create-template-page-header__section">
            <CIconButton
              variant="outline"
              disableTouchRipple
              onClick={handleNavigateBack}
              className="create-template-page-header__back-icon"
              walkMeId={["create-template", "navigate-back"]}
            >
              <CSvgIcon component={ChevronLeft} />
            </CIconButton>
            <Typography
              color="var(--logile-text-primary)"
              variant="h2"
            >
              {CREATE_TEMPLATE_HEADING.createTaskTemplate}
            </Typography>
          </Box>
          {/* TODO: This code will be refactor according to question type */}
          <Box className="create-template-page-header__section">
            {currentStep.activeStep >= 2 && (
              <CButton
                severity="secondary"
                variant="outline"
                onClick={handlePreviewModalOpen}
                data-walkme-id={generateId([
                  "header actions",
                  "preview button",
                ])}
              >
                {CREATE_TEMPLATE_HEADER_ACTIONS.preview}
              </CButton>
            )}
            {currentStep.activeStep < stepperOptions.length - 1 && (
              <CButton
                severity="secondary"
                onClick={handleNextStep}
                data-walkme-id={generateId(["header actions", "next button"])}
                disabled={Object.keys(formErrors).length > 0}
              >
                {CREATE_TEMPLATE_HEADER_ACTIONS.next}
              </CButton>
            )}

            {currentStep.activeStep < 2 && (
              <CButton
                severity="primary"
                onClick={handleSaveStep}
                data-walkme-id={generateId(["header actions", "save button"])}
                disabled={Object.keys(formErrors).length > 0}
              >
                {CREATE_TEMPLATE_HEADER_ACTIONS.save}
              </CButton>
            )}
            {currentStep.activeStep >= 2 && (
              <CButton
                severity="primary"
                data-walkme-id={generateId(["header actions", "submit button"])}
              >
                {CREATE_TEMPLATE_HEADER_ACTIONS.submit}
              </CButton>
            )}
          </Box>
        </Stack>
      </PageTemplate.Header>
      <PageTemplate.Content>
        <CStepper
          currentStep={currentStep.activeStep}
          onChange={handleStepChange}
          options={stepperOptions}
        />
      </PageTemplate.Content>
      <PreviewModal
        previewModal={previewModal}
        onClose={() => setPreviewModal({ status: false, data: null })}
        isPreviewLoading={isPreviewLoading}
        hasTemplatePreviewError={hasTemplatePreviewError}
      />
    </>
  );
};

export const CreateTemplate: React.FC = () => {
  return (
    <CreateTemplateFormProvider>
      <PageTemplate>
        <CreateTemplateContent />
      </PageTemplate>
    </CreateTemplateFormProvider>
  );
};

export default CreateTemplate;
