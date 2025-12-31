import type React from "react";
import { useState } from "react";
import { Box } from "@mui/material";

import CSvgIcon from "@/core/components/icon/Icon";
import { AddIcon, ChevronDown, ChevronRight } from "@/core/constants/icons";
import { CButton } from "@/core/components/button/button";

import "./FollowUp.scss";
import {
  followupSampleData,
  followupTriggerByAnswersSampleData,
} from "../../constants/sampleData";

import FollowUpCard from "./FollowUpCard/FollowUpCard";
import { useCreateTemplateTranslations } from "../../translation/useCreateTemplateTranslations";

const FollowUp: React.FC = () => {
  const { FOLLOWUP_TASKS } = useCreateTemplateTranslations();
  const [isGroupedFollowupOpen, setIsGroupedFollowupOpen] =
    useState<boolean>(false);

  return (
    <Box className="ct-follow-up">
      {followupSampleData?.map((item) => (
        <FollowUpCard
          key={item.id}
          item={item}
        />
      ))}
      <Box className="ct-follow-up__answer-trigger-group">
        <Box
          className="ct-follow-up__answer-trigger-group-header"
          onClick={() => setIsGroupedFollowupOpen(!isGroupedFollowupOpen)}
        >
          <Box className="ct-follow-up__answer-trigger-group-header-icon">
            <CSvgIcon
              component={isGroupedFollowupOpen ? ChevronDown : ChevronRight}
              size={16}
              color="secondary"
            />
          </Box>
          <Box className="ct-follow-up__answer-trigger-group-header-title">
            {FOLLOWUP_TASKS.TRIGGER_BY_ANSWER_GROUP.followUp}
          </Box>
        </Box>
        {isGroupedFollowupOpen &&
          followupTriggerByAnswersSampleData.map((item) => (
            <FollowUpCard
              key={item.id}
              item={item}
              triggeredByAnswers={true}
            />
          ))}
      </Box>
      <CButton
        className="ct-notifications__action-btn"
        variant="outline"
        severity="primary"
        size="small"
      >
        <CSvgIcon
          size={15}
          component={AddIcon}
        />
        {FOLLOWUP_TASKS.addFollowUpTaskButtonLabel}
      </CButton>
    </Box>
  );
};

export default FollowUp;
