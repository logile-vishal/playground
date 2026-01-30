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
import clsx from "@/utils/clsx";
import { CButton } from "@/core/components/button/button";
import CNoData from "@/core/components/no-data/NoData";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import useQuestionListManager from "@/pages/create-template/hooks/useQuestionListManager";
import type { QuestionProps } from "@/pages/create-template/types/questions.type";

import AddEditSectionModal from "./components/add-edit-section-modal/AddEditSectionModal";
import QuestionCard from "./components/question-card/QuestionCard";
import QuestionSection from "./components/section/Section";
import "./Questions.scss";

export const RenderQuestion: React.FC<{
  index: number;
  question: QuestionProps;
  expandedList: Record<string, boolean>;
  toggleExpand: (id: string) => void;
  questionFormPath: string;
  handleQuestionAdd: () => Promise<boolean>;
  isAddQuestionAllowed: boolean;
}> = ({
  index,
  question,
  expandedList,
  toggleExpand,
  questionFormPath,
  handleQuestionAdd,
  isAddQuestionAllowed,
}) => {
  if (question?.subQuestions && question?.subQuestions.length > 0) {
    return (
      <QuestionSection
        index={`${index + 1}`}
        sectionId={question.qId}
        title={question.questionBasicData.title}
        data={question.subQuestions}
        expandedList={expandedList}
        toggleExpand={toggleExpand}
        questionFormPath={questionFormPath}
        handleQuestionAdd={handleQuestionAdd}
        isAddQuestionAllowed={isAddQuestionAllowed}
      />
    );
  }
  return (
    <QuestionCard
      index={`${index + 1}`}
      question={question}
      expandedList={expandedList}
      toggleExpand={toggleExpand}
      questionFormPath={questionFormPath}
      handleQuestionAdd={handleQuestionAdd}
      isAddQuestionAllowed={isAddQuestionAllowed}
    />
  );
};

const Questions: React.FC = () => {
  const { QUESTIONS } = useCreateTemplateTranslations();
  const [addSectionModal, setAddSectionModal] = useState({
    status: false,
    data: null,
  });
  const [expandedList, setExpandedList] = useState<Record<string, boolean>>({});
  const { watch, triggerValidation, formErrors } = useCreateTemplateForm();
  const { addNewQuestion } = useQuestionListManager();
  const [isAddQuestionAllowed, setIsAddQuestionAllowed] = useState(true);
  const watchQuestionList = watch("questions") as QuestionProps[];

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

  const handleExpandList = (
    watchQuestionList: QuestionProps[] = [],
    newExpandedList: Record<string, boolean> = {}
  ) => {
    watchQuestionList?.forEach((question) => {
      newExpandedList[question?.qId] = true;
      if (!question?.subQuestions || question?.subQuestions.length === 0)
        return;
      handleExpandList(question?.subQuestions, newExpandedList);
    });
    return newExpandedList;
  };

  const handleExpandAll = () => {
    let newExpandedList = {};
    if (watchQuestionList && watchQuestionList?.length > 0) {
      newExpandedList = handleExpandList(watchQuestionList, newExpandedList);
    }
    setExpandedList(newExpandedList);
  };

  const handleCollapseAll = () => {
    setExpandedList({});
  };

  const handleQuestionAdd = () => {
    const qId = addNewQuestion();
    toggleExpand(qId);
  };

  const handleQuestionClick = async () => {
    const isValid =
      watchQuestionList?.length === 0 || (await triggerValidation("questions"));
    setIsAddQuestionAllowed(isValid);
    if (isValid) {
      handleQuestionAdd();
    }
    return isValid;
  };

  useEffect(() => {
    if (
      (formErrors as { questions: QuestionProps[] })?.questions &&
      watchQuestionList?.length !== 0
    ) {
      setIsAddQuestionAllowed(false);
    } else {
      setIsAddQuestionAllowed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    (formErrors as { questions: QuestionProps[] })?.questions,
    watchQuestionList,
  ]);

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
        {watchQuestionList?.length > 0 && (
          <Box className="ct-questions__all-ques-expand-container">
            <CIconButton
              className={clsx({
                "ct-questions__expanded-btn": true,
                "ct-questions__expanded-btn--active": true,
              })}
              variant="outline"
              size="medium"
              walkMeId={[
                "create-template",
                "questions",
                "collapse-all-questions",
              ]}
              onClick={handleCollapseAll}
            >
              <CSvgIcon component={ChevronCollapse} />
            </CIconButton>
            <CIconButton
              onClick={handleExpandAll}
              className="ct-questions__expanded-btn"
              variant="outline"
              size="medium"
              walkMeId={[
                "create-template",
                "questions",
                "expand-all-questions",
              ]}
            >
              <CSvgIcon component={ChevronExpanded} />
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
          disabled={!isAddQuestionAllowed}
          onClick={handleQuestionClick}
        >
          <CSvgIcon
            size={15}
            component={AddIcon}
          />
          {QUESTIONS.addQuestionButtonLabel}
        </CButton>
        <CButton
          className="ct-questions-cards-wrapper__action-item"
          variant="outline"
          severity="primary"
          size="small"
          disabled={!isAddQuestionAllowed}
          onClick={openAddSectionModal}
        >
          <CSvgIcon
            size={15}
            component={AddIcon}
          />
          {QUESTIONS.addSectionButtonLabel}
        </CButton>
      </Box>
    );
  };
  return (
    <Box className="ct-questions">
      {renderQuestionHeader()}
      <Box className="ct-questions-cards-wrapper">
        {watchQuestionList?.length === 0 ? (
          <CNoData
            title={QUESTIONS.noQuestionPlaceholder}
            variant="box"
          />
        ) : (
          <Box className="ct-questions-cards-wrapper__content">
            {watchQuestionList &&
              watchQuestionList.map((question, index) => {
                return (
                  <RenderQuestion
                    index={index}
                    key={question.qId}
                    question={question}
                    expandedList={expandedList}
                    toggleExpand={toggleExpand}
                    questionFormPath={`questions.${index}`}
                    handleQuestionAdd={handleQuestionClick}
                    isAddQuestionAllowed={isAddQuestionAllowed}
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
        toggleExpand={toggleExpand}
      />
    </Box>
  );
};

export default Questions;
