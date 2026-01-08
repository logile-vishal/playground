import type React from "react";
import { useState } from "react";
import { Box } from "@mui/material";

import CSvgIcon from "@/core/components/icon/Icon";
import { AddIcon, ChevronDown, ChevronRight } from "@/core/constants/icons";
import { CButton } from "@/core/components/button/button";
import CNoData from "@/core/components/no-data/NoData";

import "./FollowUp.scss";
import {
  followupSampleData,
  followupTriggerByAnswersSampleData,
} from "../../../constants/sampleData";
import { useCreateTemplateTranslations } from "../../../translation/useCreateTemplateTranslations";
import TriggerCard from "../../trigger-card/TriggerCard";
import { TRIGGER_TYPE } from "../../../constants/constant";

const FollowUp: React.FC = () => {
  const { FOLLOWUP_TASKS } = useCreateTemplateTranslations();
  const [isGroupedFollowupOpen, setIsGroupedFollowupOpen] =
    useState<boolean>(true);

  return (
    <Box className="ct-follow-up">
      {followupSampleData?.length === 0 ? (
        <CNoData
          title={FOLLOWUP_TASKS.NO_DATA}
          variant="box"
        />
      ) : (
        <Box className="ct-follow-up__list">
          {/* TODO: Remove sample data after api integration */}
          {followupSampleData?.map((item) => (
            <TriggerCard
              key={item.id}
              item={item}
              type={TRIGGER_TYPE.followup}
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
            {/* TODO: Remove sample data after api integration */}
            {isGroupedFollowupOpen &&
              followupTriggerByAnswersSampleData?.map((item) => (
                <TriggerCard
                  key={item.id}
                  item={item}
                  triggeredByAnswers={true}
                  type={TRIGGER_TYPE.followup}
                />
              ))}
          </Box>
        </Box>
      )}
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
