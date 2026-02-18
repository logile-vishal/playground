import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import CIconButton from "@/core/components/button/IconButton";
import CSvgIcon from "@/core/components/icon/Icon";
import CNoData from "@/core/components/no-data/NoData";
import {
  AddIcon,
  ChevronCollapse,
  ChevronExpanded,
} from "@/core/constants/icons";
import { CButton } from "@/core/components/button/button";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import type { QuestionProps } from "@/pages/create-template/types/questions.type";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import useQuestionListManager from "@/pages/create-template/hooks/useQuestionListManager";
import {
  CDragAndDrop,
  CSortableContainer,
  type ExtendedDragEndEvent,
} from "@/core/components/drag-drop";

import "./Rows.scss";
import { RenderQuestion } from "../questions/Questions";

const Rows: React.FC<{ walkMeIdPrefix?: string[] }> = ({ walkMeIdPrefix }) => {
  const { ROWS } = useCreateTemplateTranslations();
  const [expandedList, setExpandedList] = useState({});
  const { watch, triggerValidation, formErrors } = useCreateTemplateForm();
  const { addNewQuestion, onDragMoveQuestion } = useQuestionListManager();
  const [isAddQuestionAllowed, setIsAddQuestionAllowed] = useState(true);
  const rowList = watch("questions") as QuestionProps[];

  const toggleExpand = (id) => {
    setExpandedList((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRowAdd = (questionId?: string): void => {
    const qId = questionId ? addNewQuestion(questionId) : addNewQuestion();
    setExpandedList((prev) => ({ ...prev, [qId]: true }));
  };

  const handleExpandList = (
    rowList: QuestionProps[] = [],
    newExpandedList: Record<string, boolean> = {}
  ) => {
    rowList?.forEach((question) => {
      newExpandedList[question?.qId] = true;
      if (!question?.subQuestions || question?.subQuestions.length === 0)
        return;
      handleExpandList(question?.subQuestions, newExpandedList);
    });
    return newExpandedList;
  };

  const handleExpandAll = () => {
    let newExpandedList = {};
    if (rowList && rowList?.length > 0) {
      newExpandedList = handleExpandList(rowList, newExpandedList);
    }
    setExpandedList(newExpandedList);
  };

  const handleCollapseAll = () => {
    setExpandedList({});
  };

  const handleRowClick = async (questionId?: string) => {
    const isValid =
      rowList?.length === 0 || (await triggerValidation("questions"));
    setIsAddQuestionAllowed(isValid);
    if (isValid) {
      handleRowAdd(questionId);
    }
    return isValid;
  };

  useEffect(() => {
    if (
      (formErrors as { questions: QuestionProps[] })?.questions &&
      rowList?.length !== 0
    ) {
      setIsAddQuestionAllowed(false);
    } else {
      setIsAddQuestionAllowed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    (formErrors as { questions: QuestionProps[] })?.questions,
    rowList,
  ]);

  /**
   * @method renderRowHeader
   * @description Renders the header section with title and expand/collapse controls.
   * @returns {JSX.Element} Box element with header title and toggle buttons
   */
  const renderRowHeader = () => {
    return (
      <Box className="ct-rows__header-wrapper">
        <Typography className="ct-rows__header">{ROWS.header}</Typography>
        {rowList?.length > 0 && (
          <Box className="ct-rows__all-rows-expand-container">
            <CIconButton
              variant="outline"
              size="medium"
              walkMeId={[...walkMeIdPrefix, "collapse-all-rows"]}
              onClick={handleCollapseAll}
            >
              <CSvgIcon
                component={ChevronCollapse}
                color="secondary"
              />
            </CIconButton>
            <CIconButton
              onClick={handleExpandAll}
              size="medium"
              variant="outline"
              walkMeId={[...walkMeIdPrefix, "expand-all-rows"]}
            >
              <CSvgIcon
                color="secondary"
                component={ChevronExpanded}
              />
            </CIconButton>
          </Box>
        )}
      </Box>
    );
  };

  /**
   * @method renderRowAction
   * @description Renders action buttons for adding rows
   * @returns {JSX.Element} Box element with action buttons
   */
  const renderRowAction = () => {
    return (
      <Box className="ct-rows-cards-wrapper__action">
        <CButton
          className="ct-rows-cards-wrapper__action-item"
          variant="outline"
          severity="primary"
          size="small"
          disabled={!isAddQuestionAllowed}
          onClick={() => handleRowClick()}
          walkMeId={[...walkMeIdPrefix, "add-row"]}
        >
          <CSvgIcon
            size={15}
            component={AddIcon}
          />
          {ROWS.addRowButtonLabel}
        </CButton>
      </Box>
    );
  };

  const handleDragEnd = (e: ExtendedDragEndEvent) => {
    const draggedId = e.active.id as string;
    const targetId = e.over.id as string;
    const dropPosition = e.dropPosition;

    if (draggedId == targetId) return;
    onDragMoveQuestion(draggedId, targetId, dropPosition);
  };

  return (
    <Box className="ct-rows">
      {renderRowHeader()}
      <Box className="ct-rows-cards-wrapper">
        {rowList?.length === 0 ? (
          <CNoData
            title={ROWS.noRowPlaceholder}
            variant="box"
          />
        ) : (
          <Box className="ct-rows-cards-wrapper__content">
            <CDragAndDrop callbacks={{ onDragEnd: handleDragEnd }}>
              <CSortableContainer
                sortableIds={rowList.map((row) => row.qId)}
                id="row-sortable-container"
              >
                {rowList &&
                  rowList?.map((row, index) => {
                    return (
                      <RenderQuestion
                        index={index}
                        key={row.qId}
                        question={row}
                        expandedList={expandedList}
                        toggleExpand={toggleExpand}
                        questionFormPath={`questions.${index}`}
                        handleQuestionAdd={handleRowClick}
                        isAddQuestionAllowed={isAddQuestionAllowed}
                        walkMeIdPrefix={walkMeIdPrefix}
                      />
                    );
                  })}
              </CSortableContainer>
            </CDragAndDrop>
          </Box>
        )}
      </Box>
      {renderRowAction()}
    </Box>
  );
};

export default Rows;
