import type React from "react";
import { Box, Typography } from "@mui/material";

import CIconButton from "@/core/components/button/IconButton";
import CSvgIcon from "@/core/components/icon/Icon";
import {
  AddIcon,
  ChevronCollapse,
  ChevronExpanded,
} from "@/core/constants/icons";
import { CButton } from "@/core/components/button/button";
import clsx from "@/utils/clsx";

import "./Questions.scss";
import { QUESTION_SECTION } from "../../constants/constant";

const Questions: React.FC = () => {
  /**
   * @method renderQuestionHeader
   * @description Renders the header section with title and expand/collapse controls.
   * @returns {JSX.Element} Box element with header title and toggle buttons
   */
  const renderQuestionHeader = () => {
    return (
      <Box className="create-template-questions__header-wrapper">
        <Typography className="create-template-questions__header">
          {QUESTION_SECTION.HEADER}
        </Typography>
        <Box className="create-template-questions__all-ques-expand-container">
          <CIconButton
            className={clsx({
              "create-template-questions__expanded-btn": true,
              "create-template-questions__expanded-btn--active": true,
            })}
            variant="primary"
          >
            <CSvgIcon
              size={16}
              component={ChevronCollapse}
              fill="var(--logile-icon-secondary)"
            />
          </CIconButton>
          <CIconButton className="create-template-questions__expanded-btn">
            <CSvgIcon size={16} component={ChevronExpanded} />
          </CIconButton>
        </Box>
      </Box>
    );
  };
  /**
   * @method renderQuestionPlaceholder
   * @description Renders placeholder message when no questions are added.
   * @returns {JSX.Element} Box element with placeholder text
   */
  const renderQuestionPlaceholder = () => {
    return (
      <Box className="create-template-questions-cards-wrapper__placeholder">
        <Typography className="create-template-questions-cards-wrapper__placeholder-text">
          {QUESTION_SECTION.NO_QUESTION_PLACEHOLDER}
        </Typography>
      </Box>
    );
  };
  /**
   * @method renderQuestionAction
   * @description Renders action buttons for adding questions and sections.
   * @returns {JSX.Element} Box element with action buttons
   */
  const renderQuestionAction = () => {
    return (
      <Box className="create-template-questions-cards-wrapper__action">
        <CButton
          className="create-template-questions-cards-wrapper__action-item"
          variant="outline"
          severity="primary"
          size="small"
        >
          <CSvgIcon size={15} component={AddIcon} />{" "}
          {QUESTION_SECTION.ACTION_ADD_QUESTION}
        </CButton>
        <CButton
          className="create-template-questions-cards-wrapper__action-item"
          variant="outline"
          severity="primary"
          size="small"
        >
          <CSvgIcon size={15} component={AddIcon} />{" "}
          {QUESTION_SECTION.ACTION_ADD_SECTION}
        </CButton>
      </Box>
    );
  };
  return (
    <Box className="create-template-questions">
      {renderQuestionHeader()}
      <Box className="create-template-questions-cards-wrapper">
        {renderQuestionPlaceholder()}
        {renderQuestionAction()}
      </Box>
    </Box>
  );
};

export default Questions;
