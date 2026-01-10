import { SORT_DIRECTION } from "@/core/constants/sort";
import type { SortType } from "@/core/types/sort.type";
import type { OptionType } from "../types";

export const sortOptions = (
  list: OptionType[],
  optionLabelKey: string,
  sortDirection: SortType
): OptionType[] => {
  return list.sort((firstOption, secondOption) => {
    const firstValue =
      typeof firstOption === "string"
        ? firstOption
        : firstOption[optionLabelKey] || JSON.stringify(firstOption);
    const secondValue =
      typeof secondOption === "string"
        ? secondOption
        : secondOption[optionLabelKey] || JSON.stringify(secondOption);
    if (sortDirection === SORT_DIRECTION.ASCENDING) {
      return firstValue.localeCompare(secondValue);
    }
    return secondValue.localeCompare(firstValue);
  });
};
