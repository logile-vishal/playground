/**
 * @method truncateLabel
 * @description Truncates text to a given character limit and appends ellipsis when required.
 * @param {string} text - The text content to truncate.
 * @param {number} limit - Maximum number of characters to display.
 * @param {boolean} required - Determines whether truncation should be applied.
 * @returns {string} The original or truncated text based on the conditions.
 */
export const truncateLabel: (
  text: string,
  limit: number,
  required: boolean
) => string = (text, limit, required = true) => {
  if (text.length <= limit) return text;
  if (!required) return text;
  return text.slice(0, limit) + "...";
};
