import type React from "react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";

import CIconButton from "@/core/components/button/IconButton";
import { CButton } from "@/core/components/button/button";
import CSvgIcon from "@/core/components/icon/Icon";
import { ChevronLeft } from "@/core/constants/icons";
import CStepper from "@/core/components/stepper/Stepper";
import type { StepOption } from "@/core/types/stepper.type";
import PageTemplate from "@/layouts/page-template/PageTemplate";

import { AssignTemplateFormProvider } from "./providers/AssignTemplateFormProvider";
import { useAssignTemplateTranslations } from "./translation/useAssignTemplateTranslations";
import "./AssignTemplate.scss";
import BasicInfo from "./components/steps/basic-info/BasicInfo";
import Recipients from "./components/steps/recipients/Recipients";
import Schedule from "./components/steps/schedule/Schedule";
import Notifications from "./components/steps/notifications/Notifications";
import Settings from "./components/steps/settings/Settings";
import Attachments from "./components/steps/attachments/Attachments";
import { useAssignTemplateForm } from "./services/assign-template-form.service";

const AssignTemplateContent: React.FC = () => {
  const navigate = useNavigate();
  const { formErrors } = useAssignTemplateForm();
  const {
    ASSIGN_TEMPLATE_STEPS,
    ASSIGN_TEMPLATE_HEADING,
    ASSIGN_TEMPLATE_HEADER_ACTIONS,
  } = useAssignTemplateTranslations();
  const {
    basicInfo,
    recipients,
    schedule,
    notifications,
    settings,
    attachments,
  } = ASSIGN_TEMPLATE_STEPS;
  const [currentStep, setCurrentStep] = useState({
    activeStep: 0,
    data: ASSIGN_TEMPLATE_STEPS.basicInfo,
  });

  const handleNavigateBack = (): void => {
    navigate("/templates");
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

  const assignStepperOptions: StepOption[] = [
    {
      label: basicInfo.label,
      value: basicInfo.value,
      component: <BasicInfo />,
      // error: !!formErrors.basicData,
      // checkValidity: useCallback(
      //   async () => await triggerValidation("basicData"),
      //   [triggerValidation]
      // ),
    },
    {
      label: recipients.label,
      value: recipients.value,
      component: <Recipients />,
      // error: !!(formErrors.recipients,
      // checkValidity: useCallback(
      //async () => await triggerValidation("recipients"),
      // }, [triggerValidation]),
    },
    {
      label: schedule.label,
      value: schedule.value,
      component: <Schedule />,
      // error: !!formErrors.schedule,
      // checkValidity: useCallback(
      //  async () => await triggerValidation("schedule"),
      //   [triggerValidation]
      // ),
    },
    {
      label: notifications.label,
      value: notifications.value,
      component: <Notifications />,
    },
    {
      label: settings.label,
      value: settings.value,
      component: <Settings />,
    },
    {
      label: attachments.label,
      value: attachments.value,
      component: <Attachments />,
    },
  ];

  const handleNextStep = async (): Promise<void> => {
    //TODO: implement Next step validation before navigating to the next step

    // const isValid = await handleValidation(
    //   templateType,
    //   currentStep.activeStep
    // );
    // if (isValid && currentStep.activeStep < stepperOptions.length - 1) {
    setCurrentStep((prev) => ({
      ...prev,
      activeStep: prev.activeStep + 1,
      data: assignStepperOptions[prev.activeStep + 1],
    }));
    // } else if (!isValid) {
    //   handleValidationError();
    // }
  };

  return (
    <>
      <PageTemplate.Header>
        <Stack
          direction={"row"}
          className="assign-template-page-header"
        >
          <Box className="assign-template-page-header__section">
            <CIconButton
              variant="outline"
              disableTouchRipple
              onClick={handleNavigateBack}
              className="assign-template-page-header__back-icon"
              walkMeId={["navigate-back"]}
            >
              <CSvgIcon component={ChevronLeft} />
            </CIconButton>
            <Typography
              color="var(--logile-text-primary)"
              variant="h2"
            >
              {ASSIGN_TEMPLATE_HEADING.assignTaskTemplate}
            </Typography>
          </Box>
          <Box className="assign-template-page-header__section">
            {currentStep.activeStep < assignStepperOptions.length - 1 && (
              <CButton
                severity="secondary"
                onClick={handleNextStep}
                disabled={Object.keys(formErrors).length > 0}
                walkMeId={["header actions", "next button"]}
              >
                {ASSIGN_TEMPLATE_HEADER_ACTIONS.next}
              </CButton>
            )}
            {
              <CButton
                severity="primary"
                walkMeId={["header actions", "review and submit button"]}
                disabled={
                  currentStep.activeStep < assignStepperOptions.length - 3
                }
              >
                {ASSIGN_TEMPLATE_HEADER_ACTIONS.reviewAndSubmit}
              </CButton>
            }
          </Box>
        </Stack>
      </PageTemplate.Header>
      <PageTemplate.Content>
        <CStepper
          currentStep={currentStep.activeStep}
          onChange={handleStepChange}
          options={assignStepperOptions}
        />
      </PageTemplate.Content>
    </>
  );
};

export const AssignTemplate: React.FC = () => {
  return (
    <AssignTemplateFormProvider>
      <PageTemplate>
        <AssignTemplateContent />
      </PageTemplate>
    </AssignTemplateFormProvider>
  );
};

export default AssignTemplate;
