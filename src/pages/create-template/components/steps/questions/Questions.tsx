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
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import CNoData from "@/core/components/no-data/NoData";
import clsx from "@/utils/clsx";

import AddEditSectionModal from "./components/add-edit-section-modal/AddEditSectionModal";
import QuestionCard from "./components/question-card/QuestionCard";
import "./Questions.scss";
import "./Questions.scss";
import QuestionSection from "./components/section/Section";
import { QUESTION_ARRAY } from "@/pages/create-template/constants/questions";

const Questions: React.FC = () => {
  const { QUESTIONS } = useCreateTemplateTranslations();
  const [questionList, setQuestionList] = useState([]);
  const [addSectionModal, setAddSectionModal] = useState({
    status: false,
    data: null,
  });
  const [expandedList, setExpandedList] = useState({});

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

  const toggleExpand = (id) => {
    setExpandedList((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpandAll = () => {
    const newExpandedList = {};
    QUESTION_ARRAY.forEach((question) => {
      newExpandedList[question.id] = true;
      question?.subQuestions?.forEach((subQ) => {
        newExpandedList[subQ.id] = true;
      });
    });
    setExpandedList(newExpandedList);
  };

  const handleCollapseAll = () => {
    setExpandedList({});
  };

  const handleQuestionAdd = () => {
    setQuestionList(QUESTION_ARRAY);
  };

  useEffect(() => {
    setQuestionList(QUESTION_ARRAY); //TODO: Fetch question list from API and set it here
  }, []);

  /**
   * @method renderQuestionHeader
   * @description Renders the header section with title and expand/collapse controls.
   * @returns {JSX.Element} Box element with header title and toggle buttons
   */
  const renderQuestionHeader = () => {
    return (
      <Box className="ct-questions__header-wrapper">
        <Typography className="ct-questions__header">
          {QUESTIONS.header}
        </Typography>
        {questionList?.length > 0 && (
          <Box className="ct-questions__all-ques-expand-container">
            <CIconButton
              className={clsx({
                "ct-questions__expanded-btn": true,
                "ct-questions__expanded-btn--active": true,
              })}
              variant="primary"
              onClick={handleCollapseAll}
            >
              <CSvgIcon
                size={16}
                component={ChevronCollapse}
                color="secondary"
              />
            </CIconButton>
            <CIconButton
              onClick={handleExpandAll}
              className="ct-questions__expanded-btn"
            >
              <CSvgIcon
                color="secondary"
                size={16}
                component={ChevronExpanded}
              />
            </CIconButton>
          </Box>
        )}
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
      <Box className="ct-questions-cards-wrapper__action">
        <CButton
          className="ct-questions-cards-wrapper__action-item"
          variant="outline"
          severity="primary"
          size="small"
          onClick={handleQuestionAdd}
        >
          <CSvgIcon
            size={15}
            component={AddIcon}
          />{" "}
          {QUESTIONS.addQuestionButtonLabel}
        </CButton>
        <CButton
          className="ct-questions-cards-wrapper__action-item"
          variant="outline"
          severity="primary"
          size="small"
          onClick={openAddSectionModal}
        >
          <CSvgIcon
            size={15}
            component={AddIcon}
          />{" "}
          {QUESTIONS.addSectionButtonLabel}
        </CButton>
      </Box>
    );
  };
  return (
    <Box className="ct-questions">
      {renderQuestionHeader()}
      <Box className="ct-questions-cards-wrapper">
        {questionList?.length === 0 ? (
          <CNoData
            title={QUESTIONS.noQuestionPlaceholder}
            variant="box"
          />
        ) : (
          <Box className="ct-questions-cards-wrapper__content">
            {questionList?.map((question) => {
              if (question?.subQuestions && question?.subQuestions.length > 0) {
                return (
                  <QuestionSection
                    title={question.label}
                    orderindex={question.orderIndex}
                    data={question.subQuestions}
                    expandedList={expandedList}
                    toggleExpand={toggleExpand}
                  />
                );
              }
              return (
                <QuestionCard
                  question={question}
                  expandedList={expandedList}
                  toggleExpand={toggleExpand}
                />
              );
            })}
          </Box>
        )}
        {renderQuestionAction()}
      </Box>
      <AddEditSectionModal
        open={addSectionModal.status}
        onClose={closeAddSectionModal}
        type={QUESTIONS.SECTION_ADD_EDIT_MODAL.ADD_SECTION}
      />
    </Box>
  );
};

export default Questions;
