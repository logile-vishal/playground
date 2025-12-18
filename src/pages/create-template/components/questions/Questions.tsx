import type React from "react";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import CIconButton from "@/core/components/button/IconButton";
import CSvgIcon from "@/core/components/icon/Icon";
import {
  AddIcon,
  ChevronCollapse,
  ChevronExpanded,
} from "@/core/constants/icons";
import { CButton } from "@/core/components/button/button";
import { QUESTION_TYPES } from "@/pages/template-library/constants/constant";
import clsx from "@/utils/clsx";

import "./Questions.scss";
import { QUESTION_SECTION } from "../../constants/constant";
import QuestionCardCollapsed from "./components/question-card-collapsed/QuestionCardCollapsed";
import QuestionSection from "./components/section/Section";
import { QUESTION_MODAL } from "../../constants/questions";
import AddEditSectionModal from "./components/AddEditSectionModal/AddEditSectionModal";

const Questions: React.FC = () => {
  const [questionList, setQuestionList] = useState([]);
  const [addSectionModal, setAddSectionModal] = useState({
    status: false,
    data: null,
  });

  const openAddSectionModal = (data) => {
    setAddSectionModal({
      status: true,
      data: data,
    });
  };

  const closeAddSectionModal = () => {
    setAddSectionModal({
      status: false,
      data: null,
    });
  };

  useEffect(() => {
    setQuestionList([]); //TODO: Fetch question list from API and set it here
  }, []);

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
            <CSvgIcon
              size={16}
              component={ChevronExpanded}
            />
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
          <CSvgIcon
            size={15}
            component={AddIcon}
          />{" "}
          {QUESTION_SECTION.ACTION_ADD_QUESTION}
        </CButton>
        <CButton
          className="create-template-questions-cards-wrapper__action-item"
          variant="outline"
          severity="primary"
          size="small"
          onClick={openAddSectionModal}
        >
          <CSvgIcon
            size={15}
            component={AddIcon}
          />{" "}
          {QUESTION_SECTION.ACTION_ADD_SECTION}
        </CButton>
      </Box>
    );
  };
  return (
    <Box className="create-template-questions">
      {renderQuestionHeader()}
      <Box className="create-template-questions-cards-wrapper">
        {questionList?.length !== 0 ? ( // TODO: Update condition after API integration (change !== 0 to === 0)
          renderQuestionPlaceholder()
        ) : (
          <Box className="create-template-questions-cards-wrapper__content">
            {/* TODO: Replace hardcoded data with mapped questions fetched from the API */}
            <QuestionCardCollapsed
              label="Is the floor clean %abc% and organised? Is the floor clean %abc% and organised?"
              isRequired={true}
              orderIndex={"1"}
              optiontypeLabel={QUESTION_TYPES.RADIO_BUTTON.label}
              isTagBadgeVisible={true}
              isFileBadgeVisible={true}
              isRandomBadgeVisible={true}
              isClusterBadgeVisible={true}
              isPreviousBadgeVisible={true}
              isTemperatureBadgeVisible={true}
              hasError={false}
            />
            <QuestionCardCollapsed
              label="Is the shared display case in use in the department?"
              isRequired={true}
              orderIndex={"2"}
              optiontypeLabel={QUESTION_TYPES.DROPDOWN.label}
              isFileBadgeVisible={true}
              isPreviousBadgeVisible={true}
              isAnswerBadgeVisible={true}
              isNumberBadgeVisible={true}
              isTemperatureBadgeVisible={true}
              hasError={false}
            />
            <QuestionSection
              title="Bakery"
              orderindex={"3"}
              data={[
                {
                  id: "2",
                  label: "Is the bakery area clean and organized?",
                  isRequired: true,
                  orderIndex: "3.1",
                },
              ]}
            />
          </Box>
        )}
        {renderQuestionAction()}
      </Box>
      <AddEditSectionModal
        open={addSectionModal.status}
        onClose={closeAddSectionModal}
        type={QUESTION_MODAL.ADD_SECTION}
      />
    </Box>
  );
};

export default Questions;
