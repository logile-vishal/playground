import { v4 as uuidv4 } from "uuid";

import type { questionsSchemaType } from "../types/create-template-form-schema.type";
import { CREATE_TEMPLATE } from "../constants/constant";

const newQuestionDefaultObject: questionsSchemaType = {
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
const newSectionDefaultData: questionsSchemaType = {
  type: "section",
  sectionName: "",
  questions: [],
};

/**
 * @method addQuestion
 * @param {Array<questionsSchemaType>} data - data of the questions list to be updated
 * @description Add a new question object to the data
 * -Uses the newQuestionDefaultObject default data to create a new question object
 * -Adds a unique id to the question object at qId
 * -Adds the new question object to the data array
 * @returns {Array<questionsSchemaType>} - updated data
 */
export const addQuestion = (data: Array<questionsSchemaType>) => {
  return [...data, { ...newQuestionDefaultObject, qId: uuidv4() }];
};

/**
 * @method removeQuestion
 * @param {Array<questionsSchemaType>} data - data of the questions list to be updated
 * @param {string} questionId - id of the question to be removed
 * @description Remove a question object from the data using recursion
 * -Removes the question object from the data array at root level and within a section
 * @returns {Array<questionsSchemaType>} - updated data
 */
export const removeQuestion = (
  data: Array<questionsSchemaType>,
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
 * @param {Array<questionsSchemaType>} data - data of the questions list to be updated
 * @param {string} sectionName - name of the section to be added
 * @description Add a new section to the questions list
 * -uses newSectionDefaultData constant to create a new section object
 * -Adds sectionName to the new section object
 * -Adds the new section object to the data array
 * @returns {Array<questionsSchemaType>} - updated data
 */
export const addSection = (
  data: Array<questionsSchemaType>,
  sectionName: string
) => {
  const newSection = { ...newSectionDefaultData, sectionName };
  return [...data, newSection];
};

/**
 * @method removeSection
 * @param {Array<questionsSchemaType>} data - data of the questions list to be updated
 * @param {string} sectionName - name of the section to be removed
 * @description Remove a section from the data provided
 * -Removes the section from the data provided
 * @returns {Array<questionsSchemaType>} - updated data
 */

export const removeSection = (
  data: Array<questionsSchemaType>,
  sectionName: string
) => {
  return data.filter(
    (question) =>
      question.type !== "section" || question.sectionName !== sectionName
  );
};

/**
 * @method addOption
 * @param {Array<questionsSchemaType>} data - data of the questions list to be updated
 * @param {string} questionId - id of the question to which the option belongs
 * @description Add a new option to the provided question
 * -uses newOptionDefaultData constant to create a new option object
 * -Adds a unique id to the option object at id
 * -Adds the new option object to the question at root level or within a section
 * @returns {Array<questionsSchemaType>} - updated data
 */
export const addOption = (
  data: Array<questionsSchemaType>,
  questionId: string
) => {
  const newOption = { ...newOptionDefaultData, optionId: uuidv4() };
  const questions: Array<questionsSchemaType> = [...data];
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
 * @param {Array<questionsSchemaType>} data - data of the questions list to be updated
 * @param {string} optionId - id of the option to be removed
 * @param {string} questionId - id of the question to which the option belongs
 * @description Remove an option from the provided question
 * -Removes the option from the question at root level or question present within a section
 * @returns {Array<questionsSchemaType>} - updated data
 */
export const removeOption = (
  data: Array<questionsSchemaType>,
  optionId: string,
  questionId: string
) => {
  const questions: Array<questionsSchemaType> = JSON.parse(
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
