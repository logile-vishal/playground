import type React from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";

import CIconButton from "@/core/components/button/IconButton";
import { CButton } from "@/core/components/button/button";
import CSvgIcon from "@/core/components/icon/Icon";
import { ChevronLeft } from "@/core/constants/icons";
import CStepper from "@/core/components/stepper/Stepper";
import type { StepOption } from "@/core/types/stepper.type";
import PageTemplate from "@/layouts/page-template/PageTemplate";

import BasicInfo from "./components/basic-info/BasicInfo";
import Questions from "./components/questions/Questions";
import Notifications from "./components/notifications/Notifications";
import FollowUp from "./components/follow-up/FollowUp";
import AdvancedOptions from "./components/advanced-options/AdvancedOptions";
import CreateTemplateFormProvider from "./providers/CreateTemplateFormProvider";
import {
  CREATE_TEMPLATE_HEADING,
  CREATE_TEMPLATE_STEPS,
} from "./constants/constant";
import "./CreateTemplate.scss";

const CreateTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { basicInfo, questions, advancedOption, notification, followUp } =
    CREATE_TEMPLATE_STEPS;

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
      console.log("activeStep", event.activeStep, event.data);
    },
    []
  );
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
              <CButton
                severity="secondary"
                variant="outline"
                disabled={true}
              >
                Preview
              </CButton>
              <CButton
                severity="secondary"
                disabled={true}
              >
                Next
              </CButton>
              <CButton
                severity="primary"
                disabled={true}
              >
                Save
              </CButton>
              <CButton
                severity="primary"
                disabled={true}
              >
                Submit
              </CButton>
            </Box>
          </Stack>
        </PageTemplate.Header>
        <PageTemplate.Content>
          <CStepper
            onChange={handleStepChange}
            options={stepperOptions}
          />
        </PageTemplate.Content>
      </PageTemplate>
    </CreateTemplateFormProvider>
  );
};

export default CreateTemplate;
