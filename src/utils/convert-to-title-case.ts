/**
 * @function convertToTitleCase
 * @description Converts kebab-case or snake_case values to space-separated Title Case format (more explicit)
 * @param {string} value - The value to format (e.g., 'TASK_COMPLETED' or 'task-completed')
 * @return {string} Formatted string in Title Case (e.g., 'Task Completed')
 * @example
 * convertToTitleCase('TASK_COMPLETED') // Returns: 'Task Completed'
 */
export const convertToTitleCase = (value: string): string => {
  return value
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
