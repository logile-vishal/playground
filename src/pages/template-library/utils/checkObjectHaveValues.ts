import { isNonEmptyValue } from "@/utils";

export const checkObjectHaveValues = (data, skipValues = []) => {
  return Object.entries(data).some(([key, value]) => {
    if (skipValues.includes(key)) return false;
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return isNonEmptyValue(value);
  });
};
