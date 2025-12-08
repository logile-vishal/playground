import useCreateTemplateForm from "./useCreateTemplateForm";
import {
  removeOption,
  removeQuestion,
  removeSection,
  addOption,
  addQuestion,
  addSection,
} from "./questionListHelperMethods";
import type { questionsSchemaType } from "../types/create-template-form-schema.type";
import { CREATE_TEMPLATE_FORM_FIELDS } from "../constants/constant";

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
    const questionsList = getFormValues(
      CREATE_TEMPLATE_FORM_FIELDS.question
    ) as Array<questionsSchemaType>;
    const updatedQuestionsList = removeQuestion(questionsList, questionId);
    setFormValue(CREATE_TEMPLATE_FORM_FIELDS.questions, updatedQuestionsList);
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
    const questionsList = getFormValues(
      CREATE_TEMPLATE_FORM_FIELDS.question
    ) as Array<questionsSchemaType>;
    const updatedQuestionsList = removeSection(questionsList, sectionName);
    setFormValue(CREATE_TEMPLATE_FORM_FIELDS.questions, updatedQuestionsList);
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
    const questionsList = getFormValues(
      CREATE_TEMPLATE_FORM_FIELDS.questions
    ) as Array<questionsSchemaType>;
    const updatedQuestionsList = removeOption(
      questionsList,
      optionId,
      questionId
    );
    setFormValue(CREATE_TEMPLATE_FORM_FIELDS.questions, updatedQuestionsList);
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
    const questionsList = getFormValues(
      CREATE_TEMPLATE_FORM_FIELDS.questions
    ) as Array<questionsSchemaType>;
    const updatedQuestionsList = addQuestion(questionsList);
    setFormValue(CREATE_TEMPLATE_FORM_FIELDS.questions, updatedQuestionsList);
    triggerValidation(CREATE_TEMPLATE_FORM_FIELDS.questions);
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
    const questionsList = getFormValues(
      CREATE_TEMPLATE_FORM_FIELDS.questions
    ) as Array<questionsSchemaType>;
    const updatedQuestionsList: Array<questionsSchemaType> = addSection(
      questionsList,
      sectionName
    );
    setFormValue(CREATE_TEMPLATE_FORM_FIELDS.questions, updatedQuestionsList);
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
    triggerValidation(CREATE_TEMPLATE_FORM_FIELDS.questions);
    const questionsList = getFormValues(
      CREATE_TEMPLATE_FORM_FIELDS.questions
    ) as Array<questionsSchemaType>;
    const updatedQuestionsList: Array<questionsSchemaType> = addOption(
      questionsList,
      questionId
    );
    setFormValue(CREATE_TEMPLATE_FORM_FIELDS.questions, updatedQuestionsList);
  };

  /**
   * @method triggerQuestionValidation
   * @description Trigger validation for the entire questions list
   * @returns {void}
   */
  const triggerQuestionValidation = () => {
    triggerValidation(CREATE_TEMPLATE_FORM_FIELDS.questions);
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
