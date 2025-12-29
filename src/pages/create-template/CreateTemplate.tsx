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

import BasicInfo from "./components/basic-info/BasicInfo";
import Questions from "./components/questions/Questions";
import Notifications from "./components/notifications/Notifications";
import FollowUp from "./components/follow-up/FollowUp";
import AdvancedOptions from "./components/advanced-options/AdvancedOptions";
import CreateTemplateFormProvider from "./providers/CreateTemplateFormProvider";
import { useCreateTemplateTranslations } from "./translation/useCreateTemplateTranslations";
import "./CreateTemplate.scss";
import { useGetPreviewByTemplateId } from "../template-library/services/template-library-api-hooks";
import PreviewModal from "../template-library/components/preview-modal/PreviewModal";
import type { TemplatePreviewModalProps } from "../template-library/types/template-library.type";

const CreateTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { generateId } = useWalkmeId();
  const {
    CREATE_TEMPLATE_STEPS,
    CREATE_TEMPLATE_HEADING,
    CREATE_TEMPLATE_HEADER_ACTIONS,
  } = useCreateTemplateTranslations();
  const { basicInfo, questions, advancedOption, notification, followUp } =
    CREATE_TEMPLATE_STEPS;
  const [currentStep, setCurrentStep] = useState({
    activeStep: 0,
    data: CREATE_TEMPLATE_STEPS.basicInfo,
  });
  /** TODO Demo start */
  const [previewModal, setPreviewModal] = useState<TemplatePreviewModalProps>({
    status: false,
    data: null,
  });

  const {
    data: templatePreviewData,
    isPending: isPreviewLoading,
    mutateAsync: getPreviewByTemplateId,
    error: hasTemplatePreviewError,
  } = useGetPreviewByTemplateId();

  /** TODO Demo end */

  const handleNavigateBack = () => {
    navigate("/templates");
  };

  const stepperOptions: StepOption[] = [
    {
      label: basicInfo.label,
      value: basicInfo.value,
      component: <BasicInfo />,
      checkValidity: useCallback(() => true, []),
    },
    {
      label: questions.label,
      value: questions.value,
      component: <Questions />,
      checkValidity: useCallback(() => true, []),
    },
    {
      label: advancedOption.label,
      value: advancedOption.value,
      component: <AdvancedOptions />,
    },
    {
      label: notification.label,
      value: notification.value,
      component: <Notifications />,
    },
    { label: followUp.label, value: followUp.value, component: <FollowUp /> },
  ];

  /**
   * @method handleStepChange
   * @description Handles step change event in the stepper component
   * @param {Object} event - Step change event object
   * @param {number} event.activeStep - Index of the newly active step
   * @param {StepOption} event.data - Data of the newly active step
   * @returns {void}
   */
  const handleStepChange = useCallback(
    (event: { activeStep: number; data: StepOption }) => {
      /* TODO: Conditions to be added later */
      setCurrentStep((prev) => ({
        ...prev,
        activeStep: event.activeStep,
        data: event.data,
      }));
    },
    []
  );

  const handleNextStep = () => {
    if (currentStep.activeStep < stepperOptions.length - 1) {
      setCurrentStep((prev) => ({
        ...prev,
        activeStep: prev.activeStep + 1,
        data: stepperOptions[prev.activeStep + 1],
      }));
    }
  };

  /** TODO Demo start */
  const handlePreviewModalOpen = () => {
    getPreviewByTemplateId(1829);
    setPreviewModal((prev) => ({ ...prev, status: true }));
  };

  useEffect(() => {
    if (templatePreviewData?.data) {
      setPreviewModal((prev) => ({ ...prev, data: templatePreviewData?.data }));
    }
  }, [templatePreviewData]);
  /** TODO Demo end */

  return (
    <CreateTemplateFormProvider>
      <PageTemplate>
        <PageTemplate.Header>
          <Stack
            direction={"row"}
            className="create-template-page-header"
          >
            <Box className="create-template-page-header__section">
              <CIconButton
                variant="outline"
                disableHover={true}
                disableTouchRipple
                onClick={handleNavigateBack}
                className="create-template-page-header__back-icon"
              >
                <CSvgIcon
                  component={ChevronLeft}
                  fill="var(--logile-icon-secondary)"
                  size={18}
                />
              </CIconButton>
              <Typography
                color="var(--logile-text-primary)"
                variant="h2"
              >
                {CREATE_TEMPLATE_HEADING.createTaskTemplate}
              </Typography>

              {/* TODO: to be done later when create template demo video available */}
              {/* <Box className={clsx({ "create-template-page-header__cursor-pointer": true })}>
                        <CSvgIcon component={QuestionCircle} fill='var(--logile-icon-secondary)' size={16} />
                    </Box> */}
            </Box>
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
                >
                  {CREATE_TEMPLATE_HEADER_ACTIONS.next}
                </CButton>
              )}

              {currentStep.activeStep < 2 && (
                <CButton
                  severity="primary"
                  data-walkme-id={generateId(["header actions", "save button"])}
                >
                  {CREATE_TEMPLATE_HEADER_ACTIONS.save}
                </CButton>
              )}
              {currentStep.activeStep >= 2 && (
                <CButton
                  severity="primary"
                  data-walkme-id={generateId([
                    "header actions",
                    "submit button",
                  ])}
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
      </PageTemplate>
    </CreateTemplateFormProvider>
  );
};

export default CreateTemplate;
