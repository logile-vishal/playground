import React, { useState, useCallback } from "react";
import type { FieldValues, Control } from "react-hook-form";
import { Box, Tab } from "@mui/material";

import CTabs from "@/core/components/tabs/Tabs";
import CDivider from "@/core/components/divider/Divider";
import CSvgIcon from "@/core/components/icon/Icon";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import {
  Attachment,
  EyeOff,
  Tag,
  TemperatureLine,
} from "@/core/constants/icons";
import type { AdvanceTabProps } from "@/pages/create-template/types/questions.type";
import { QUESTIONS_ADVANCED_TABS } from "@/pages/create-template/constants/constant";

import VisibilityTab from "./visibility-tab-content/VisibilityTab";
import TagsTab from "./tags-tab-content/TagsTab";
import AttachmentsTab from "./attachments-tab-content/AttachmentsTab";
import NumericTab from "./numeric-tab-content/NumericTab";
import "./AdvanceTab.scss";

const AdvanceTab: React.FC<AdvanceTabProps> = ({
  questionFormPath,
  question,
  questionIndex,
}) => {
  const [currentTab, setCurrentTab] = useState<string>(
    QUESTIONS_ADVANCED_TABS.visibility
  );
  const { control } = useCreateTemplateForm();
  const { ADVANCED_TAB_OPTIONS } = useCreateTemplateTranslations();

  const handleTabChange = useCallback((_: unknown, newValue: string): void => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Box className="advance-tab">
      <Box className="advance-tab__sidebar">
        <CTabs
          orientation="vertical"
          onChange={handleTabChange}
          value={currentTab}
          className="advance-tab__tabs"
        >
          <Tab
            label={ADVANCED_TAB_OPTIONS.VISIBILITY.label}
            value={QUESTIONS_ADVANCED_TABS.visibility}
            icon={<CSvgIcon component={EyeOff} />}
            iconPosition="start"
            className="advance-tab__tab"
          />
          <Tab
            label={ADVANCED_TAB_OPTIONS.TAGS.label}
            value={QUESTIONS_ADVANCED_TABS.tags}
            icon={<CSvgIcon component={Tag} />}
            iconPosition="start"
            className="advance-tab__tab"
          />
          <Tab
            label={ADVANCED_TAB_OPTIONS.FILE_ATTACHMENT.label}
            value={QUESTIONS_ADVANCED_TABS.attachments}
            icon={<CSvgIcon component={Attachment} />}
            iconPosition="start"
            className="advance-tab__tab"
          />
          <Tab
            label={ADVANCED_TAB_OPTIONS.NUMERIC_VALUE.label}
            value={QUESTIONS_ADVANCED_TABS.numeric}
            icon={<CSvgIcon component={TemperatureLine} />}
            iconPosition="start"
            className="advance-tab__tab"
          />
        </CTabs>
      </Box>
      <CDivider orientation="vertical" />
      <Box className="advance-tab__content">
        {currentTab === QUESTIONS_ADVANCED_TABS.visibility && (
          <VisibilityTab
            questionFormPath={questionFormPath}
            control={control as unknown as Control<FieldValues>}
            questionIndex={questionIndex}
            question={question}
          />
        )}
        {currentTab === QUESTIONS_ADVANCED_TABS.tags && (
          <TagsTab
            questionFormPath={questionFormPath}
            control={control as unknown as Control<FieldValues>}
          />
        )}
        {currentTab === QUESTIONS_ADVANCED_TABS.attachments && (
          <AttachmentsTab
            questionFormPath={questionFormPath}
            control={control as unknown as Control<FieldValues>}
            question={question}
          />
        )}
        {currentTab === QUESTIONS_ADVANCED_TABS.numeric && (
          <NumericTab
            questionFormPath={questionFormPath}
            control={control as unknown as Control<FieldValues>}
          />
        )}
      </Box>
    </Box>
  );
};

export default AdvanceTab;
