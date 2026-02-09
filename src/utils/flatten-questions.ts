import type { QuestionProps } from "@/pages/create-template/types/questions.type";

/**
 * @function flattenQuestions
 * @description Recursively flattens deeply nested question arrays into a single flat array
 * Traverses through subQuestions at any depth level and collects all questions
 * @param {QuestionProps[]} questions - Array of questions with potential subQuestions
 * @return {QuestionProps[]} Flattened array containing all questions from all levels
 * @example
 * const allQuestions = flattenQuestions(nestedQuestions);
 * // Returns: [question1, question2, subQuestion1, subQuestion2, ...]
 */
export const flattenQuestions = (
  questions: QuestionProps[]
): QuestionProps[] => {
  if (!Array.isArray(questions) || questions.length === 0) {
    return [];
  }

  const result: QuestionProps[] = [];

  const traverse = (questionList: QuestionProps[]): void => {
    for (const question of questionList) {
      result.push(question);

      // Recursively process subQuestions if they exist
      if (
        Array.isArray(question.subQuestions) &&
        question.subQuestions.length > 0
      ) {
        traverse(question.subQuestions);
      }
    }
  };

  traverse(questions);
  return result;
};
