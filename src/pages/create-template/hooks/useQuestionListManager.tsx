import { v4 as uuidv4 } from "uuid";

import { CREATE_TEMPLATE } from "../constants/constant";
import useCreateTemplateForm from "./useCreateTemplateForm";
import type { QuestionStepType } from "../services/create-template-form-schema";

const newQuestionDefaultObject: QuestionStepType = {
  qId: "",
  type: CREATE_TEMPLATE.DEFAULT_QUESTION_TYPE as "radio",
  basicData: {
    title: "",
    response: [],
  },
  advancedSettings: {
    isRequired: false,
    notification: {
      title: "",
      description: "",
    },
  },
};
const newOptionDefaultData = {
  title: "",
};
const newSectionDefaultData: QuestionStepType = {
  type: "section",
  sectionName: "",
  questions: [],
};

/**
 * @method addQuestion
 * @param {Array<QuestionStepType>} data - data of the questions list to be updated
 * @description Add a new question object to the data
 * -Uses the newQuestionDefaultObject default data to create a new question object
 * -Adds a unique id to the question object at qId
 * -Adds the new question object to the data array
 * @returns {Array<QuestionStepType>} - updated data
 */
export const addQuestion = (data: Array<QuestionStepType>) => {
  return [...data, { ...newQuestionDefaultObject, qId: uuidv4() }];
};

/**
 * @method removeQuestion
 * @param {Array<QuestionStepType>} data - data of the questions list to be updated
 * @param {string} questionId - id of the question to be removed
 * @description Remove a question object from the data using recursion
 * -Removes the question object from the data array at root level and within a section
 * @returns {Array<QuestionStepType>} - updated data
 */
export const removeQuestion = (
  data: Array<QuestionStepType>,
  questionId: string
) => {
  const filteredList = [];
  data.forEach((item) => {
    if (item.type === "section") {
      filteredList.push({
        ...item,
        questions: removeQuestion(item.questions, questionId),
      });
    } else if (item.qId !== questionId) {
      filteredList.push(item);
    }
  });
  return filteredList;
};

/**
 * @method addSection
 * @param {Array<QuestionStepType>} data - data of the questions list to be updated
 * @param {string} sectionName - name of the section to be added
 * @description Add a new section to the questions list
 * -uses newSectionDefaultData constant to create a new section object
 * -Adds sectionName to the new section object
 * -Adds the new section object to the data array
 * @returns {Array<QuestionStepType>} - updated data
 */
export const addSection = (
  data: Array<QuestionStepType>,
  sectionName: string
) => {
  const newSection = { ...newSectionDefaultData, sectionName };
  return [...data, newSection];
};

/**
 * @method removeSection
 * @param {Array<QuestionStepType>} data - data of the questions list to be updated
 * @param {string} sectionName - name of the section to be removed
 * @description Remove a section from the data provided
 * -Removes the section from the data provided
 * @returns {Array<QuestionStepType>} - updated data
 */

export const removeSection = (
  data: Array<QuestionStepType>,
  sectionName: string
) => {
  return data.filter(
    (question) =>
      question.type !== "section" || question.sectionName !== sectionName
  );
};

/**
 * @method addOption
 * @param {Array<QuestionStepType>} data - data of the questions list to be updated
 * @param {string} questionId - id of the question to which the option belongs
 * @description Add a new option to the provided question
 * -uses newOptionDefaultData constant to create a new option object
 * -Adds a unique id to the option object at id
 * -Adds the new option object to the question at root level or within a section
 * @returns {Array<QuestionStepType>} - updated data
 */
export const addOption = (
  data: Array<QuestionStepType>,
  questionId: string
) => {
  const newOption = { ...newOptionDefaultData, optionId: uuidv4() };
  const questions: Array<QuestionStepType> = [...data];
  for (const q of questions) {
    if (q.type === "section") {
      q.questions.forEach((question) => {
        if (question.qId === questionId) {
          question.basicData?.response?.push(newOption);
        }
      });
    } else {
      if (q.qId === questionId) {
        q.basicData?.response?.push(newOption);
      }
    }
  }
  return questions;
};

/**
 * @method removeOption
 * @param {Array<QuestionStepType>} data - data of the questions list to be updated
 * @param {string} optionId - id of the option to be removed
 * @param {string} questionId - id of the question to which the option belongs
 * @description Remove an option from the provided question
 * -Removes the option from the question at root level or question present within a section
 * @returns {Array<QuestionStepType>} - updated data
 */
export const removeOption = (
  data: Array<QuestionStepType>,
  optionId: string,
  questionId: string
) => {
  const questions: Array<QuestionStepType> = JSON.parse(
    JSON.stringify([...data])
  );

  for (const qItem of questions) {
    if (qItem.type === "section") {
      qItem.questions.forEach((question) => {
        if (question.qId === questionId) {
          question.basicData.response = question.basicData?.response?.filter(
            (option) => option.optionId !== optionId
          );
        }
      });
    } else {
      if (qItem.qId === questionId) {
        qItem.basicData.response = qItem.basicData?.response?.filter(
          (option) => option.optionId !== optionId
        );
      }
    }
  }

  return questions;
};

const useQuestionListManager = () => {
  const { setFormValue, getFormValues, triggerValidation } =
    useCreateTemplateForm();

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
    const questionsList = getFormValues("questions") as Array<QuestionStepType>;
    const updatedQuestionsList = removeQuestion(questionsList, questionId);
    setFormValue("questions", updatedQuestionsList);
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
    const questionsList = getFormValues("questions") as Array<QuestionStepType>;
    const updatedQuestionsList = removeSection(questionsList, sectionName);
    setFormValue("questions", updatedQuestionsList);
  };

  /**
   * @method deleteOption
   * @param {string} optionId - id of the option to be deleted
   * @param {string} questionId - id of the question to which the option belongs
   * @description Deletes option from the questions list by option id and question id
   * -Method gets the questions list from the form
   * -uses @method removeOption to remove the option with the given optionid and questionid
   * -Sets the updated questions list back to the form
   * @returns {void}
   */
  const deleteOption = (optionId: string, questionId: string) => {
    const questionsList = getFormValues("questions") as Array<QuestionStepType>;
    const updatedQuestionsList = removeOption(
      questionsList,
      optionId,
      questionId
    );
    setFormValue("questions", updatedQuestionsList);
  };

  /**
   * @method addNewQuestion
   * @description Adds new question to the questions list
   * -Method gets the questions list from the form
   * -uses @method addQuestion to add a new question to the fetched list
   * -Sets the updated questions list back to the form
   * -Triggers validation for the questions list
   * @returns {void}
   */
  const addNewQuestion = () => {
    const questionsList = getFormValues("questions") as Array<QuestionStepType>;
    const updatedQuestionsList = addQuestion(questionsList);
    setFormValue("questions", updatedQuestionsList);
    triggerValidation("questions");
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
    const questionsList = getFormValues("questions") as Array<QuestionStepType>;
    const updatedQuestionsList: Array<QuestionStepType> = addSection(
      questionsList,
      sectionName
    );
    setFormValue("questions", updatedQuestionsList);
  };

  /**
   * @method addNewOption
   * @param {string} questionId - id of the question to which the option belongs
   * @description adds new option to the provided questionId
   * -Method gets the questions list from the form
   * -uses @method addOption to add a new option to the fetched list
   * -Sets the updated questions list back to the form
   * -Triggers validation for the questions list
   * @returns {void}
   */
  const addNewOption = (questionId: string) => {
    triggerValidation("questions");
    const questionsList = getFormValues("questions") as Array<QuestionStepType>;
    const updatedQuestionsList: Array<QuestionStepType> = addOption(
      questionsList,
      questionId
    );
    setFormValue("questions", updatedQuestionsList);
  };

  /**
   * @method triggerQuestionValidation
   * @description Trigger validation for the entire questions list
   * @returns {void}
   */
  const triggerQuestionValidation = () => {
    triggerValidation("questions");
  };

  return {
    deleteQuestion,
    deleteSection,
    deleteOption,
    addNewQuestion,
    addNewSection,
    addNewOption,
    triggerQuestionValidation,
  };
};

export default useQuestionListManager;
