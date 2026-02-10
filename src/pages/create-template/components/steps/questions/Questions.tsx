import type React from "react";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { Box, Typography } from "@mui/material";

import CIconButton from "@/core/components/button/IconButton";
import CSvgIcon from "@/core/components/icon/Icon";
import {
  AddIcon,
  ChevronCollapse,
  ChevronExpanded,
} from "@/core/constants/icons";
import { CButton } from "@/core/components/button/button";
import CNoData from "@/core/components/no-data/NoData";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import useQuestionListManager, {
  checkIfParentQuestionToBeDeleted,
} from "@/pages/create-template/hooks/useQuestionListManager";
import type { QuestionProps } from "@/pages/create-template/types/questions.type";
import {
  CDragAndDrop,
  CSortableContainer,
  type ExtendedDragEndEvent,
} from "@/core/components/drag-drop";

import AddEditSectionModal from "./components/add-edit-section-modal/AddEditSectionModal";
import QuestionCard from "./components/question-card/QuestionCard";
import QuestionSection from "./components/section/Section";
import "./Questions.scss";
import CModal, { ModalBody } from "@/core/components/modal/Modal";
import { BUTTON_SEVERITY } from "@/core/constants/button-constant";

export const RenderQuestion: React.FC<{
  index: number;
  question: QuestionProps;
  expandedList: Record<string, boolean>;
  toggleExpand: (id: string) => void;
  questionFormPath: string;
  handleQuestionAdd: () => Promise<boolean>;
  isAddQuestionAllowed: boolean;
  walkMeIdPrefix?: string[];
}> = ({
  index,
  question,
  expandedList,
  toggleExpand,
  questionFormPath,
  handleQuestionAdd,
  isAddQuestionAllowed,
  walkMeIdPrefix,
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
        walkMeIdPrefix={[...walkMeIdPrefix, "section"]}
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
      walkMeIdPrefix={walkMeIdPrefix}
    />
  );
};

const Questions: React.FC<{ walkMeIdPrefix: string[] }> = ({
  walkMeIdPrefix,
}) => {
  const { QUESTIONS } = useCreateTemplateTranslations();
  const [addSectionModal, setAddSectionModal] = useState({
    status: false,
    data: null,
  });
  const [expandedList, setExpandedList] = useState<Record<string, boolean>>({});
  const { watch, triggerValidation, formErrors, getFormValues } =
    useCreateTemplateForm();
  const [isAddQuestionAllowed, setIsAddQuestionAllowed] = useState(true);
  const { addNewQuestion, onDragMoveQuestion } = useQuestionListManager();
  const watchQuestionList = watch("questions") as QuestionProps[];

  // Stores the pending drag move action for confirmation
  const pendingDragActionRef = useRef<(() => void) | null>(null);
  const [showDragConfirmModal, setShowDragConfirmModal] = useState(false);

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

  const handleQuestionAdd = (questionId?: string) => {
    const qId = questionId ? addNewQuestion(questionId) : addNewQuestion();
    toggleExpand(qId);
  };

  const handleQuestionClick = async (questionId?: string) => {
    const isValid =
      watchQuestionList?.length === 0 || (await triggerValidation("questions"));
    setIsAddQuestionAllowed(isValid);
    if (isValid) {
      if (questionId) {
        handleQuestionAdd(questionId);
      } else {
        handleQuestionAdd();
      }
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
   * @method findQuestionById
   * @description Finds a question by its ID in the question list or sub-questions.
   * @param questionId - The ID of the question to find
   * @returns The question object if found, null otherwise
   */
  const findQuestionById = (questionId: string | number) => {
    const idToFind = String(questionId);

    for (const [index, question] of watchQuestionList.entries()) {
      // Check main question
      if (String(question.qId) === idToFind) {
        return {
          ...question,
          index: index + 1,
        };
      }

      // Check sub-questions if they exist
      if (question?.subQuestions && question.subQuestions.length > 0) {
        const subQuestionIndex = `${index + 1}.${question.subQuestions.findIndex((subQ) => String(subQ.qId) === idToFind) + 1}`;
        const subQuestion = question.subQuestions.find(
          (subQ) => String(subQ.qId) === idToFind
        );
        if (subQuestion) {
          return {
            ...subQuestion,
            index: subQuestionIndex,
          };
        }
      }
    }

    return null;
  };

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
              variant="outline"
              size="medium"
              walkMeId={[...walkMeIdPrefix, "collapse-all-questions"]}
              onClick={handleCollapseAll}
            >
              <CSvgIcon component={ChevronCollapse} />
            </CIconButton>
            <CIconButton
              onClick={handleExpandAll}
              variant="outline"
              size="medium"
              walkMeId={[...walkMeIdPrefix, "expand-all-questions"]}
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
          onClick={() => handleQuestionClick()}
          walkMeId={[...walkMeIdPrefix, "add-question"]}
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
          walkMeId={[...walkMeIdPrefix, "add-section"]}
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

  const handleDragStart = () => {};

  /**
   * @method executePendingDragAction
   * @description Executes the stored pending drag action after user confirmation
   */
  const executePendingDragAction = () => {
    if (pendingDragActionRef.current) {
      pendingDragActionRef.current();
      pendingDragActionRef.current = null;
    }
    setShowDragConfirmModal(false);
  };
  const clearPendingDragAction = () => {
    pendingDragActionRef.current = null;
    setShowDragConfirmModal(false);
  };

  const handleDragEnd = (e: ExtendedDragEndEvent) => {
    const draggedId = e.active.id as string;
    const targetId = e.over.id as string;
    const dropPosition = e.dropPosition;
    const questions = getFormValues("questions") as QuestionProps[];
    // Closure that captures drag arguments for later execution
    const performDragMove = () => {
      onDragMoveQuestion(draggedId, targetId, dropPosition);
    };

    const [isLastQuestionInSection] = checkIfParentQuestionToBeDeleted(
      questions.filter((q) => q), //TODO: REMOVE THIS PATCH ONCE ISSUE IS FIXED
      draggedId
    );

    if (!isLastQuestionInSection) {
      performDragMove();
    } else {
      pendingDragActionRef.current = performDragMove;
      setShowDragConfirmModal(true);
    }
  };
  const handleRenderOverlay = (activeId) => {
    const foundQuestion = findQuestionById(String(activeId));

    if (!foundQuestion) return <></>;
    if (foundQuestion.subQuestions && foundQuestion.subQuestions.length > 0) {
      return (
        <QuestionSection
          index={foundQuestion.index}
          key={foundQuestion.qId}
          sectionId={foundQuestion.qId}
          title={foundQuestion.questionBasicData.title}
          questionFormPath={`questions.${foundQuestion.index}`}
          data={foundQuestion.subQuestions}
          expandedList={expandedList}
          toggleExpand={toggleExpand}
          handleQuestionAdd={handleQuestionClick}
          isAddQuestionAllowed={isAddQuestionAllowed}
          walkMeIdPrefix={walkMeIdPrefix}
          isExpanded={false}
        />
      );
    }
    return foundQuestion ? (
      <QuestionCard
        index={foundQuestion.index}
        question={foundQuestion as QuestionProps}
        toggleExpand={() => {}}
        expandedList={{}}
        isAddQuestionAllowed={false}
      />
    ) : null;
  };
  return (
    <Box className="ct-questions">
      {renderQuestionHeader()}
      <CModal
        open={showDragConfirmModal}
        onConfirm={executePendingDragAction}
        onClose={clearPendingDragAction}
        title={QUESTIONS.DRAG_DELETE_SECTION_MODAL.title}
        showActions={true}
        size="small"
        severity={BUTTON_SEVERITY.destructive}
      >
        <ModalBody>
          <Box className="template-delete__modal-body">
            {QUESTIONS.DRAG_DELETE_SECTION_MODAL.description}
          </Box>
        </ModalBody>
      </CModal>

      <Box className="ct-questions-cards-wrapper">
        {watchQuestionList?.length === 0 ? (
          <CNoData
            title={QUESTIONS.noQuestionPlaceholder}
            variant="box"
          />
        ) : (
          <CDragAndDrop
            callbacks={{
              onDragStart: handleDragStart,
              onDragEnd: handleDragEnd,
            }}
            renderDragOverlay={handleRenderOverlay}
            restrictToVertical={true}
          >
            <CSortableContainer
              sortableIds={watchQuestionList?.map((q) => String(q.qId))}
              id="questions-root-container"
            >
              <Box className="ct-questions-cards-wrapper__content">
                {watchQuestionList &&
                  watchQuestionList.map((question, index) => {
                    return (
                      <RenderQuestion
                        index={index}
                        key={question?.qId}
                        question={question}
                        expandedList={expandedList}
                        toggleExpand={toggleExpand}
                        questionFormPath={`questions.${index}`}
                        handleQuestionAdd={handleQuestionClick}
                        isAddQuestionAllowed={isAddQuestionAllowed}
                        walkMeIdPrefix={walkMeIdPrefix}
                      />
                    );
                  })}
              </Box>
            </CSortableContainer>
          </CDragAndDrop>
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
