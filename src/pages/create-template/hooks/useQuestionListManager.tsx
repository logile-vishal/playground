import { v4 as uuidv4 } from "uuid";

import type { DropPosition } from "@/core/components/drag-drop";
import { isNonEmptyValue } from "@/utils";
import { DRAG_DROP } from "@/core/components/drag-drop/constants/dragAndDrop";

import useCreateTemplateForm from "./useCreateTemplateForm";
import { QUESTION_TYPE } from "../constants/questions";
import {
  ADVANCE_SETTINGS_DEFAULT,
  BARCODE_SCAN_TYPE_DEFAULT,
  CHECKBOX_TYPE_DEFAULT,
  DROPDOWN_TYPE_DEFAULT,
  DYNAMIC_DROPDOWN_TYPE_DEFAULT,
  LABEL_TYPE_DEFAULT,
  LONG_INPUT_TYPE_DEFAULT,
  OPTIONS_DEFAULT,
  RADIO_TYPE_DEFAULT,
  RESPONSE_TEMPLATE_TYPE_DEFAULT,
  SECTION_TYPE_DEFAULT,
  SORT_INPUT_TYPE_DEFAULT,
} from "../constants/question-type-default";
import type { QuestionProps, QuestionTypeKey } from "../types/questions.type";

export const newQuestionDefaultObject: () => QuestionProps = () => ({
  qId: uuidv4(),
  index: "",
  questionId: null,
  questionTypeId: null,
  parentTemplateId: null,
  isRequired: false,
  questionBasicData: {
    questionType: null,
    title: "",
    response: null,
  },
  questionAdvancedSettings: ADVANCE_SETTINGS_DEFAULT,
  subQuestions: [],
});

const newOptionDefaultData = {
  ...OPTIONS_DEFAULT,
};

/**
 * @method getNewQuestionDefaultObjectByType
 * @param {string} type - The question type to get default object for
 * @description Returns a new question object with default values based on the provided type
 * @returns {QuestionProps | undefined} - Default question object or undefined if type is not supported
 */
export const getNewQuestionDefaultObjectByType = (
  type: string
): QuestionProps | undefined => {
  switch (type) {
    case QUESTION_TYPE.RADIO:
      return {
        ...newQuestionDefaultObject(),
        questionBasicData: RADIO_TYPE_DEFAULT,
      };
    case QUESTION_TYPE.DROPDOWN:
      return {
        ...newQuestionDefaultObject(),
        questionBasicData: DROPDOWN_TYPE_DEFAULT,
      };
    case QUESTION_TYPE.CHECKBOX:
      return {
        ...newQuestionDefaultObject(),
        questionBasicData: CHECKBOX_TYPE_DEFAULT,
      };
    case QUESTION_TYPE.DYNAMIC_DROPDOWN:
      return {
        ...newQuestionDefaultObject(),
        questionBasicData: DYNAMIC_DROPDOWN_TYPE_DEFAULT,
      };
    case QUESTION_TYPE.SORT_INPUT:
      return {
        ...newQuestionDefaultObject(),
        questionBasicData: SORT_INPUT_TYPE_DEFAULT,
      };
    case QUESTION_TYPE.LONG_INPUT:
      return {
        ...newQuestionDefaultObject(),
        questionBasicData: LONG_INPUT_TYPE_DEFAULT,
      };
    case QUESTION_TYPE.LABEL:
      return {
        ...newQuestionDefaultObject(),
        questionBasicData: LABEL_TYPE_DEFAULT,
      };
    case QUESTION_TYPE.BARCODE_SCAN:
      return {
        ...newQuestionDefaultObject(),
        questionBasicData: BARCODE_SCAN_TYPE_DEFAULT,
      };
    case QUESTION_TYPE.RESPONSE_TEMPLATE:
      return {
        ...newQuestionDefaultObject(),
        questionBasicData: RESPONSE_TEMPLATE_TYPE_DEFAULT,
      };
  }
};

/**
 * @method deepCopyQuestions
 * @param {QuestionProps[]} questions - questions to deep copy
 * @description Creates a deep copy of questions array using structured clone
 * @returns {QuestionProps[]} - deep copied questions
 */
const deepCopyQuestions = (questions: QuestionProps[]): QuestionProps[] => {
  return JSON.parse(JSON.stringify(questions || []));
};

/**
 * @method addQuestion
 * @param {QuestionProps[]} data - data of the questions list to be updated
 * @param {string} type - type of the question to be added
 * @param {string} [afterQuestionId] - id of the question after which to insert the new question
 * @description Add a new question object to the data
 * -Uses the newQuestionDefaultObject default data to create a new question object
 * -Adds a unique id to the question object at qId
 * -Recursively finds the afterQuestionId in root level or within subQuestions
 * -Inserts the new question right after the specified question at the same nesting level
 * -If afterQuestionId not found, appends at the end
 * @returns {{ data: QuestionProps[], qId: string }} - updated data and qId of new question
 */
export const addQuestion = (
  data: QuestionProps[] = [],
  type: string,
  afterQuestionId?: string
) => {
  const newQuestion = getNewQuestionDefaultObjectByType(type);
  const qId = uuidv4();
  const newQuestionObj = {
    ...newQuestionDefaultObject(),
    ...newQuestion,
    qId,
  };

  // Deep copy the data to avoid mutations
  const dataCopy = deepCopyQuestions(data);

  // If no afterQuestionId specified, append to end
  if (!isNonEmptyValue(afterQuestionId)) {
    dataCopy.push(newQuestionObj);
    return { data: dataCopy, qId };
  }

  // Helper function to recursively find and insert after the question
  const insertAfterQuestion = (items: QuestionProps[]): boolean => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].qId === afterQuestionId) {
        // Found the question, insert after it
        items.splice(i + 1, 0, newQuestionObj);
        return true;
      }

      // Recursively check in subQuestions
      if (items[i]?.subQuestions?.length > 0) {
        if (insertAfterQuestion(items[i].subQuestions)) {
          return true;
        }
      }
    }
    return false;
  };

  // Try to find and insert after the question
  const found = insertAfterQuestion(dataCopy);

  // If not found anywhere, append to end
  if (!found) {
    dataCopy.push(newQuestionObj);
  }
  return { data: dataCopy, qId };
};

/**
 * @method isOptionRequired
 * @param {string} type - The question type to check
 * @description Checks if the provided question type requires options
 * @returns {boolean} - True if options are required for the question type
 */
export const isOptionRequired = (type: string) => {
  return (
    type === QUESTION_TYPE.RADIO ||
    type === QUESTION_TYPE.CHECKBOX ||
    type === QUESTION_TYPE.DROPDOWN ||
    type === QUESTION_TYPE.DYNAMIC_DROPDOWN
  );
};

/**
 * @method removeQuestion
 * @param {QuestionProps[]} data - data of the questions list to be updated
 * @param {string} questionId - id of the question to be removed
 * @description Remove a question object from the data using recursion
 * Removes the question object from the data array at root level and within a section.
 * Also recursively processes subQuestions to remove nested questions.
 * If a section becomes empty after removing a question, the section itself is removed.
 * @returns {QuestionProps[]} - updated data with the specified question removed
 */
export const removeQuestion = (
  data: QuestionProps[],
  questionId: string
): QuestionProps[] => {
  if (!data) return [];

  // First, remove the target question from current level and recursively process subQuestions
  const updated = data
    .filter((question) => question.qId !== questionId)
    .map((question) => {
      // If this question has subQuestions, recursively remove from them
      if (question.subQuestions && question.subQuestions?.length > 0) {
        return {
          ...question,
          subQuestions: removeQuestion(question.subQuestions, questionId),
        };
      }
      return question;
    });

  return updated;
};

/**
 * @method addSection
 * @param {QuestionProps[]} data - data of the questions list to be updated
 * @param {string} sectionName - name of the section to be added
 * @description Add a new section to the questions list
 * -uses newSectionDefaultData constant to create a new section object
 * -Adds sectionName to the new section object
 * -Adds the new section object to the data array
 * @returns {QuestionProps[]} - updated data
 */
export const addSection = (data: QuestionProps[], sectionName: string) => {
  const newSection = newQuestionDefaultObject();
  newSection.questionBasicData = SECTION_TYPE_DEFAULT;
  newSection.questionBasicData.title = sectionName;
  const subQuestion = getNewQuestionDefaultObjectByType(QUESTION_TYPE.RADIO);
  newSection.subQuestions = [subQuestion];
  return { qId: subQuestion?.qId, data: [...data, newSection] };
};

/**
 * @method removeSection
 * @param {QuestionProps[]} data - data of the questions list to be updated
 * @param {string} qId - id of the section to be removed
 * @description Remove a section from the data provided
 * -Removes the section from the data provided
 * @returns {QuestionProps[]} - updated data
 */

export const removeSection = (data: QuestionProps[], qId: string) => {
  return data.filter(
    (question: QuestionProps) =>
      question.questionBasicData?.questionType !== "title" ||
      question.qId !== qId
  );
};

/**
 * @method addOption
 * @param {QuestionProps[]} data - data of the questions list to be updated
 * @param {string} questionId - id of the question to which the option belongs
 * @description Add a new option to the provided question
 * -uses newOptionDefaultData constant to create a new option object
 * -Adds a unique id to the option object at id
 * -Adds the new option object to the question at root level or within a section
 * @returns {QuestionProps[]} - updated data
 */
export const addOption = (data: QuestionProps[], questionId: string) => {
  const newOption = { ...newOptionDefaultData };
  return data.map((question) => {
    if (question.qId === questionId) {
      // Found the question at root level, add option
      const copyQuestion = JSON.parse(JSON.stringify(question));
      copyQuestion.questionBasicData.response.push(newOption);
      return copyQuestion;
    }

    // Recursively check subQuestions if they exist
    if (question.subQuestions && question.subQuestions.length > 0) {
      return {
        ...question,
        subQuestions: addOption(question.subQuestions, questionId),
      };
    }

    return question;
  });
};

/**
 * @method removeOption
 * @param {QuestionProps[]} data - data of the questions list to be updated
 * @param {string} questionId - id of the question to which the option belongs
 * @param {number} index - index of the option to be removed
 * @description Remove an option from the provided question's response array
 * Recursively searches for the question by questionId and removes the option at the given index.
 * Works for questions at root level or nested within sections (subQuestions).
 * @returns {QuestionProps[]} - updated data with the specified option removed
 */
export const removeOption = (
  data: QuestionProps[],
  questionId: string,
  index: number
): QuestionProps[] => {
  return data.map((question) => {
    if (question.qId === questionId) {
      // Found the question, remove the option at the specified index
      const copyQuestion = JSON.parse(JSON.stringify(question));
      copyQuestion.questionBasicData.response.splice(index, 1);
      return copyQuestion;
    }

    // Recursively process subQuestions if they exist
    if (question.subQuestions && question.subQuestions.length > 0) {
      return {
        ...question,
        subQuestions: removeOption(question.subQuestions, questionId, index),
      };
    }

    return question;
  });
};

/**
 * @method cloneQuestion
 * @param {QuestionProps[]} data - data of the questions list to be updated
 * @param {string} questionId - id of the question to be cloned
 * @description Clone a question and insert it right after the original question
 * Creates a deep copy of the question with a new unique qId and inserts it immediately
 * after the original question at the same nesting level using recursive helper function.
 * Validates that the question has a title before cloning.
 * @returns {{ data: QuestionProps[], qId: string, isValid: boolean }} - object containing updated data with the cloned question, the qId of the cloned question, and validation status
 */
export const cloneQuestion = (
  data: QuestionProps[],
  questionId: string
): { data: QuestionProps[]; qId: string; isValid: boolean } => {
  const clonedQId: string = uuidv4();
  const copyData: QuestionProps[] = deepCopyQuestions(data);

  let isQuestionValid = true;

  // Helper function to recursively find and clone the question
  const cloneInTree = (items: QuestionProps[]): boolean => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].qId === questionId) {
        // Validate that the column has a title before copying
        if (
          !items[i].questionBasicData.title ||
          items[i].questionBasicData.title.trim() === ""
        ) {
          isQuestionValid = false;
          return false;
        }

        // Found the question to clone, create a deep copy with new qId
        const clonedQuestion: QuestionProps = deepCopyQuestions([items[i]])[0];
        const newQuestion: QuestionProps = {
          ...clonedQuestion,
          qId: clonedQId,
        };
        // Insert cloned question right after the original
        items.splice(i + 1, 0, newQuestion);
        return true;
      }

      // Recursively check in subQuestions
      if (items[i].subQuestions?.length > 0) {
        if (cloneInTree(items[i].subQuestions)) {
          return true;
        }
      }
    }
    return false;
  };

  cloneInTree(copyData);
  return { data: copyData, qId: clonedQId, isValid: isQuestionValid };
};

/**
 * @method dropQuestion
 * @param {QuestionProps[]} data - data of the questions list to be updated
 * @param {QuestionProps} draggedQuestion - deep copied question to be moved
 * @param {string} targetId - id of the target question where the dragged item will be placed
 * @param {DropPosition} dropPosition - position relative to target ("ABOVE" or "BELOW")
 * @description Moves a question to a new position based on drop position
 * Iterates to find the target item and places the dragged question
 * above or below it based on dropPosition.
 * @returns {QuestionProps[]} - updated questions list with the moved question
 */
export const dropQuestion = (
  data: QuestionProps[],
  draggedQuestion: QuestionProps,
  targetId: string,
  dropPosition: DropPosition
): QuestionProps[] => {
  const copyData = deepCopyQuestions(data);

  // Helper to insert at target position
  const insertAtTarget = (items: QuestionProps[]): boolean => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].qId === targetId) {
        const insertIndex = dropPosition === "ABOVE" ? i : i + 1;
        items.splice(insertIndex, 0, draggedQuestion);
        return true;
      }

      if (items[i].subQuestions?.length > 0) {
        if (insertAtTarget(items[i].subQuestions)) {
          return true;
        }
      }
    }
    return false;
  };

  insertAtTarget(copyData);
  return copyData;
};

export const getParentQuestion = (
  data: QuestionProps[],
  questionId: string
): QuestionProps | null => {
  for (const question of data) {
    if (question.subQuestions && question.subQuestions.length > 0) {
      if (question.subQuestions?.some((sub) => sub.qId === questionId)) {
        return question;
      }
      const found = getParentQuestion(question.subQuestions, questionId);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

const findQuestion = (
  items: QuestionProps[],
  targetId: string
): QuestionProps | null => {
  for (const item of items) {
    if (item.qId === targetId) {
      return deepCopyQuestions([item])[0];
    }
    if (item.subQuestions?.length > 0) {
      const found = findQuestion(item.subQuestions, targetId);
      if (found) return found;
    }
  }
  return null;
};

export const checkIfParentQuestionToBeDeleted = (
  items: QuestionProps[],
  targetId: string
): [boolean, QuestionProps | null] => {
  const parentQuestion = getParentQuestion(items, targetId);
  if (parentQuestion && parentQuestion?.subQuestions?.length < 2) {
    return [true, parentQuestion];
  }
  return [false, null];
};

const moveOption = (
  options,
  draggedIdx: number,
  targetIdx: number,
  dropPosition: DropPosition
) => {
  const updatedList = [...options];
  if (draggedIdx !== -1 && targetIdx !== -1) {
    const [draggedItem] = updatedList.splice(draggedIdx, 1);
    const placementIdx =
      dropPosition === DRAG_DROP.DROP_POSITION.above
        ? Number(targetIdx)
        : Number(targetIdx) + 1;
    updatedList.splice(placementIdx, 0, draggedItem);
  }

  return updatedList;
};

const useQuestionListManager = () => {
  const { setFormValue, getFormValues, triggerValidation, resetForm } =
    useCreateTemplateForm();

  /**
   * @method modifyQuestionType
   * @param {string} prevType - The previous question type
   * @param {string} newType - The new question type to change to
   * @param {string} questionId - The ID of the question to modify
   * @description Modifies the type of a question and updates the form accordingly
   * Recursively searches for the question at any nesting level (root or within subQuestions).
   * If both types require options, only updates questionBasicData to preserve object reference.
   * If option requirement changes, replaces the entire question with a new one.
   * @returns {string | null} - The ID of the new question or null if question was updated in place
   */
  const modifyQuestionType = (
    prevType: QuestionTypeKey,
    newType: QuestionTypeKey,
    questionId: string
  ) => {
    const questionsList = getFormValues("questions") as QuestionProps[];
    let newQuestionId: string | null = null;

    // Helper function to recursively find and modify the question
    const modifyQuestion = (items: QuestionProps[]): void => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].qId === questionId) {
          if (isOptionRequired(prevType) && isOptionRequired(newType)) {
            // Both require options, just update the type while preserving object reference
            items[i].questionBasicData.questionType = newType;
          } else {
            // Option requirement changed, replace the entire question
            const newQuestion = getNewQuestionDefaultObjectByType(newType);
            newQuestionId = newQuestion?.qId || null;
            if (newQuestion) {
              items[i] = newQuestion;
            }
          }
          return;
        }

        // Recursively check in subQuestions
        if (items[i].subQuestions?.length > 0) {
          modifyQuestion(items[i].subQuestions);
        }
      }
    };

    modifyQuestion(questionsList);
    setFormValue("questions", questionsList);
    return newQuestionId;
  };

  /**
   * @method deleteQuestion
   * @param {string} questionId - id of the question to be deleted
   * @description Deletes question from the questions list by question id
   * -Method gets the questions list from the form
   * -uses @method removeQuestion to remove the question with the given question id
   * -Sets the updated questions list back to the form
   * @returns {void}
   */
  const deleteQuestion = (questionId: string) => {
    const questionsList = getFormValues("questions") as QuestionProps[];
    const updatedQuestionsList = removeQuestion(questionsList, questionId);
    resetForm({
      ...getFormValues(),
      questions: updatedQuestionsList,
    } as { questions: QuestionProps[] });
  };

  /**
   * @method deleteSection
   * @param {string} sectionName - name of the section to be deleted
   * @description Deletes section from the questions list by section name
   * -Method gets the questions list from the form
   * -uses @method removeSection to remove the section with the given section name
   * -Sets the updated questions list back to the form
   * @returns {void}
   */
  const deleteSection = (sectionName: string) => {
    const questionsList = getFormValues("questions") as QuestionProps[];
    const updatedQuestionsList = removeSection(questionsList, sectionName);
    resetForm({
      ...getFormValues(),
      questions: updatedQuestionsList,
    } as { questions: QuestionProps[] });
  };

  /**
   * @method deleteOption
   * @param {string} questionId - id of the question to which the option belongs
   * @param {number} index - index of the option to be deleted
   * @description Deletes option from the questions list by option id and question id
   * -Method gets the questions list from the form
   * -uses @method removeOption to remove the option with the given index and questionid
   * -Sets the updated questions list back to the form
   * @returns {void}
   */
  const deleteOption = (questionId: string, index: number) => {
    const questionsList = getFormValues("questions") as QuestionProps[];
    const updatedQuestionsList = removeOption(questionsList, questionId, index);
    setFormValue("questions", updatedQuestionsList);
  };

  /**
   * @method cloneExistingQuestion
   * @param {string} questionId - id of the question to be cloned
   * @description Clones an existing question and inserts it right after the original
   * -Method gets the questions list from the form
   * -uses @method cloneQuestion to clone the question with the given questionId
   * -Validates that the question has a title before cloning
   * -Inserts the cloned question immediately after the original
   * -Sets the updated questions list back to the form
   * @returns {string} - the qId of the cloned question, or empty string if validation fails
   */
  const cloneExistingQuestion = (questionId: string): string => {
    const questionsList = getFormValues("questions") as QuestionProps[];
    const { data, qId, isValid } = cloneQuestion(questionsList, questionId);

    if (!isValid) {
      triggerValidation("questions");
      return "";
    }
    setFormValue("questions", data);
    return qId;
  };

  /**
   * @method addNewQuestion
   * @param {string} [afterQuestionId] - id of the question after which to insert the new question
   * @description Adds new question to the questions list
   * -Method gets the questions list from the form
   * -uses @method addQuestion to add a new question to the fetched list
   * -Recursively finds afterQuestionId at any nesting level and inserts adjacent to it
   * -Sets the updated questions list back to the form
   * @returns {string} - the qId of the newly added question
   */
  const addNewQuestion = (afterQuestionId?: string) => {
    const questionsList = getFormValues("questions") as QuestionProps[];
    const { data, qId } = addQuestion(
      questionsList,
      QUESTION_TYPE.RADIO,
      afterQuestionId
    );
    setFormValue("questions", data);
    return qId;
  };

  /**
   * @method addNewSection
   * @param {string} sectionName - name of the section to be added
   * @description Adds new section to the questions list
   * -Method gets the questions list from the form
   * -uses @method addSection to add a new section to the fetched list
   * -Sets the updated questions list back to the form
   * @returns {void}
   */
  const addNewSection = (sectionName: string) => {
    const questionsList = getFormValues("questions") as QuestionProps[];
    const { qId, data } = addSection(questionsList, sectionName);
    setFormValue("questions", data);
    return qId;
  };

  /**
   * @method addNewOption
   * @param {string | number} questionId - id of the question to which the option belongs
   * @description adds new option to the provided questionId
   * -Method gets the questions list from the form
   * -uses @method addOption to add a new option to the fetched list
   * -Sets the updated questions list back to the form
   * -Triggers validation for the questions list
   * @returns {void}
   */
  const addNewOption = (questionId: string) => {
    const questionsList = getFormValues("questions") as QuestionProps[];
    const updatedQuestionsList: QuestionProps[] = addOption(
      questionsList,
      questionId
    );
    setFormValue("questions", updatedQuestionsList);
  };

  const modifyOptions = (questionId: string, options) => {
    const questionsList = getFormValues("questions") as QuestionProps[];
    const updatedQuestionList = questionsList.map((question) => {
      if (question.qId === questionId) {
        question.questionBasicData.response = options;
      }
      return question;
    });

    setFormValue("questions", updatedQuestionList);
  };

  /**
   * @method onDragMoveQuestion
   * @param {string} draggedId - id of the question being dragged
   * @param {string} targetId - id of the target question
   * @param {DropPosition} dropPosition - position relative to target ("ABOVE" or "BELOW")
   * @description Handles drag and drop reordering of questions
   * Creates a deep copy of the dragged question, removes it from the list,
   * then moves it to the appropriate position relative to target.
   * @returns {void}
   */
  const onDragMoveQuestion = async (
    draggedId: string,
    targetId: string,
    dropPosition: DropPosition
  ) => {
    if (draggedId === targetId) return;
    let questionsList = getFormValues("questions") as QuestionProps[];
    questionsList = questionsList.filter((q) => q); // Filter out any null/undefined questions to avoid issues during drag and drop
    // Find and deep copy the dragged question, then remove it
    const draggedQuestion: QuestionProps | null = JSON.parse(
      JSON.stringify(findQuestion(questionsList, draggedId))
    );
    if (!draggedQuestion) return;
    // Incase of last left question being dragged out of section, section needs to be deleted
    const [isParentToBeRemoved, parentQuestion] =
      checkIfParentQuestionToBeDeleted(questionsList, draggedId);

    let listWithoutDragged = [];
    if (isParentToBeRemoved) {
      listWithoutDragged = removeQuestion(questionsList, parentQuestion?.qId);
    } else {
      listWithoutDragged = removeQuestion(questionsList, draggedId);
    }

    const updatedQuestionsList = dropQuestion(
      listWithoutDragged,
      draggedQuestion,
      targetId,
      dropPosition
    );

    await setFormValue("questions", updatedQuestionsList); //TODO: Ask with binay or this patch
    await setFormValue("questions", updatedQuestionsList); //TODO: Ask with binay or this patch
  };

  /**
   * @method triggerQuestionValidation
   * @description Trigger validation for the entire questions list
   * @returns {void}
   */
  const triggerQuestionValidation = () => {
    triggerValidation("questions");
  };
  const onDragMoveOption = (
    questionId: string,
    draggedIdx: number,
    targetIdx: number,
    dropPosition: DropPosition
  ) => {
    if (draggedIdx === targetIdx) return;
    const questionsList = getFormValues("questions") as QuestionProps[];

    // Find and deep copy the dragged option, then remove it
    const question: QuestionProps | null = findQuestion(
      questionsList,
      questionId
    );
    if (!question) return;
    const response = question.questionBasicData.response;
    const updatedOptionList = moveOption(
      response,
      draggedIdx,
      targetIdx,
      dropPosition
    );

    const updatedQuestionsList = questionsList.map((q) => {
      if (q.qId === questionId) {
        return {
          ...q,
          questionBasicData: {
            ...q.questionBasicData,
            response: updatedOptionList,
          },
        };
      }
      return q;
    });

    setFormValue("questions", updatedQuestionsList);
  };

  return {
    deleteQuestion,
    deleteSection,
    deleteOption,
    onDragMoveOption,
    cloneExistingQuestion,
    addNewQuestion,
    addNewSection,
    addNewOption,
    modifyQuestionType,
    modifyOptions,
    triggerQuestionValidation,
    onDragMoveQuestion,
  };
};

export default useQuestionListManager;
