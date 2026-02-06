import { isNonEmptyValue } from "@/utils";

export const checkObjectHaveValues = (data) => {
  return Object.values(data).some((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return isNonEmptyValue(value);
  });
};
