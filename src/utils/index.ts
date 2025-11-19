
/**
 * Validates a value based on its type.
 * @param {any} value - Validate (string, array, object, or number)
 * @returns {boolean} True if the field is valid, false otherwise
 */

export const isNonEmptyValue = (value) => {
  if (value === undefined || value === null) return false;

  if (typeof value === "string") return value.trim().length > 0;

  if (Array.isArray(value)) return value.length > 0;

  if (typeof value === "object") return Object.keys(value).length > 0;

  if (typeof value === "number") return true;

  return false;
};