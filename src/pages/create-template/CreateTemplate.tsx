import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useGetPreviewByTemplateId } from "../template-library/services/template-library-api-hooks";
import PreviewModal from "../template-library/components/preview-modal/PreviewModal";
import type { TemplatePreviewModalProps } from "../template-library/types/template-library.type";
import type { QuestionProps } from "./types/questions.type";
import type { ColumnProps } from "./types/columns.type";
import Columns from "./components/steps/columns/Columns";
import Rows from "./components/steps/rows/Rows";
import "./CreateTemplate.scss";
import { TEMPLATE_TYPE } from "../template-library/constants/constant";
import {
  PREVIEW_BUTTON_THRESHOLD,
  SAVE_BUTTON_THRESHOLD,
  SUBMIT_BUTTON_THRESHOLD,
} from "./constants/questions";
import { TEMPLATE_TYPE_STEPS } from "./constants/constant";

const CreateTemplateContent: React.FC = () => {
  const navigate = useNavigate();
  const { triggerValidation, formErrors, watch, getFormValues } =
    useCreateTemplateForm();
  const templateType = getFormValues("templateType");
  const watchQuestionList = watch("questions") as QuestionProps[];
  const watchColumnList = watch("columns") as ColumnProps[];
  const { generateId } = useWalkmeId();
  const {
    CREATE_TEMPLATE_STEPS,
    CREATE_TEMPLATE_HEADING,
    CREATE_TEMPLATE_HEADER_ACTIONS,
    QUESTIONS,
    COLUMNS,
    ROWS,
  } = useCreateTemplateTranslations();
  const { notify } = useNotification();
  const {
    basicInfo,
    questions,
    advancedOption,
    notification,
    followUp,
    columns,
    rows,
  } = CREATE_TEMPLATE_STEPS;
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

  const handleColumnError = (): void => {
    if (watchColumnList.length < 1)
      notify({
        title: COLUMNS.oneColumnRequiredError,
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

  const defaultStepperOptions: StepOption[] = [
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
      component: (
        <Questions walkMeIdPrefix={["create-template", "questions-step"]} />
      ),
      checkValidity: useCallback(async () => {
        handleQuestionError();
        return (
          watchQuestionList.length > 0 && (await triggerValidation("questions"))
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [triggerValidation, notify, watchQuestionList]),
    },
    {
      label: advancedOption.label,
      value: advancedOption.value,
      error: !!formErrors.advancedOptions,
      component: <AdvancedOptions />,
      checkValidity: useCallback(
        async () =>
          watchQuestionList.length > 0 &&
          (await triggerValidation("advancedOptions")),
        [triggerValidation, watchQuestionList]
      ),
    },
    {
      label: notification.label,
      value: notification.value,
      component: (
        <Notifications
          walkMeIdPrefix={["create-template", "notification-step"]}
        />
      ),
    },
    {
      label: followUp.label,
      value: followUp.value,
      component: <FollowUp />,
    },
  ];

  const gridStepperOptions: StepOption[] = [
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
      label: columns.label,
      value: columns.value,
      error: !!(formErrors as { columns?: unknown }).columns,
      component: (
        <Columns walkMeIdPrefix={["create-template", "columns-step"]} />
      ),
      checkValidity: useCallback(async () => {
        handleColumnError();
        return (
          watchColumnList.length > 0 && (await triggerValidation("columns"))
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [triggerValidation, notify, watchColumnList]),
    },
    {
      label: rows.label,
      value: rows.value,
      error: !!(formErrors as { rows?: unknown }).rows,
      component: <Rows walkMeIdPrefix={["create-template", "rows-step"]} />,
      checkValidity: useCallback(async () => {
        if (watchQuestionList.length < 1)
          notify({
            title: ROWS.oneRowRequiredError,
            config: {
              severity: Severity.ERROR,
            },
          });
        return (
          watchColumnList.length > 0 && (await triggerValidation("questions"))
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [triggerValidation, notify, watchQuestionList]),
    },
    {
      label: advancedOption.label,
      value: advancedOption.value,
      error: !!formErrors.advancedOptions,
      component: <AdvancedOptions />,
      checkValidity: useCallback(
        async () =>
          watchColumnList.length > 0 &&
          (await triggerValidation("advancedOptions")),
        [triggerValidation, watchColumnList]
      ),
    },
    {
      label: notification.label,
      value: notification.value,
      component: (
        <Notifications
          walkMeIdPrefix={["create-template", "notification-step"]}
        />
      ),
    },
    {
      label: followUp.label,
      value: followUp.value,
      component: <FollowUp />,
    },
  ];

  const formStepperOptions: StepOption[] = [
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
      component: <Notifications walkMeIdPrefix={["create-template"]} />,
      checkValidity: useCallback(
        async () => await triggerValidation("notifications"),
        [triggerValidation]
      ),
    },
    {
      label: followUp.label,
      value: followUp.value,
      component: <FollowUp />,
    },
  ];

  let stepperOptions: StepOption[];

  switch (templateType?.toUpperCase()) {
    case TEMPLATE_TYPE.GRID:
      stepperOptions = gridStepperOptions;
      break;
    case TEMPLATE_TYPE.FORM:
    case TEMPLATE_TYPE.SPREADSHEET:
      stepperOptions = formStepperOptions;
      break;
    default:
      stepperOptions = defaultStepperOptions;
  }

  const isPreviewBtnEnabled = useMemo((): boolean => {
    return (
      currentStep.activeStep >=
      PREVIEW_BUTTON_THRESHOLD[templateType?.toUpperCase()]
    );
  }, [currentStep.activeStep, templateType]);

  const isSaveBtnEnabled = useMemo((): boolean => {
    return (
      currentStep.activeStep <=
      SAVE_BUTTON_THRESHOLD[templateType?.toUpperCase()]
    );
  }, [currentStep.activeStep, templateType]);

  const isSubmitBtnEnabled = useMemo((): boolean => {
    return (
      currentStep.activeStep >=
      SUBMIT_BUTTON_THRESHOLD[templateType?.toUpperCase()]
    );
  }, [currentStep.activeStep, templateType]);

  /**
   * @method handleValidation
   * @description Validates the current step's form fields based on template type and step index
   * @param {string} templateType - Template type (checklist, grid, form, spreadsheet)
   * @param {number} stepIndex - Index of the step to validate
   * @returns {Promise<boolean>} True if validation passes, false otherwise
   */
  const handleValidation = async (
    templateType: string,
    stepIndex: number
  ): Promise<boolean> => {
    const validationMap = TEMPLATE_TYPE_STEPS[templateType.toUpperCase()];
    if (!validationMap) {
      return false;
    }
    const fieldName = validationMap[stepIndex];
    if (!fieldName) {
      return false;
    }
    return await triggerValidation(fieldName);
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
    const isValid = await handleValidation(
      templateType,
      currentStep.activeStep
    );
    if (isValid && currentStep.activeStep < stepperOptions.length - 1) {
      setCurrentStep((prev) => ({
        ...prev,
        activeStep: prev.activeStep + 1,
        data: stepperOptions[prev.activeStep + 1],
      }));
    } else if (!isValid) {
      handleQuestionError();
    }
  };

  const handleSaveStep = async (): Promise<void> => {
    const isValid = await handleValidation(
      templateType,
      currentStep.activeStep
    );
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
          <Box className="create-template-page-header__section">
            {isPreviewBtnEnabled && (
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

            {isSaveBtnEnabled && (
              <CButton
                severity="primary"
                onClick={handleSaveStep}
                data-walkme-id={generateId(["header actions", "save button"])}
                disabled={Object.keys(formErrors).length > 0}
              >
                {CREATE_TEMPLATE_HEADER_ACTIONS.save}
              </CButton>
            )}
            {isSubmitBtnEnabled && (
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
