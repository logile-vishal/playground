import { IconButton, TextField } from "@mui/material";
import { useState } from "react";

import { ArrowDown, ArrowUp } from "@/core/constants/icons";
import SvgIcon from "@/core/components/icon/Icon";
import { SORT_DIRECTION } from "@/core/constants/sort";
import type { SortType } from "@/core/types/sort.type";

import type { OptionType } from "../types";
import { MULTISELECT } from "../constants";

const sortOptions = (
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

const FilterSortToolbar: React.FC<{
  allowFilter?: boolean;
  allowSort?: boolean;
  setOptions?: React.Dispatch<React.SetStateAction<OptionType[]>>;
  options: OptionType[];
  optionFilterLabelKey: string | null;
}> = (props) => {
  const { allowFilter, allowSort, setOptions, options, optionFilterLabelKey } =
    props;
  const [sort, setSort] = useState<SortType | null>(null);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    event.preventDefault();

    const filterValue = event.target.value.toLowerCase();

    if (filterValue === "") {
      resetOptions(sort);
    }
    setOptions(() => {
      if (Array.isArray(options)) {
        return options.filter((option) => {
          if (typeof option === "string") {
            return option.toLowerCase().includes(filterValue);
          } else if (typeof option === "object" && option !== null) {
            return Object.values(option).some((value) =>
              String(value).toLowerCase().includes(filterValue)
            );
          }
          return false;
        });
      }
      return options;
    });
  };
  /**
   * @method handleSortOptions
   * @description This function is used to sort options based on sort direction and update sort state
   * @param sort
   * @returns void
   */
  const handleSortOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const direction =
      sort === SORT_DIRECTION.ASCENDING
        ? SORT_DIRECTION.DESCENDING
        : SORT_DIRECTION.ASCENDING;
    setSort(direction);
    setOptions(() => {
      if (Array.isArray(options)) {
        const sortedOptions = sortOptions(
          [...options],
          optionFilterLabelKey,
          sort
        );
        return sortedOptions;
      }
      return options;
    });
  };
  /**
   * @method resetOptions
   * @description This function is used to reset options when user clear filter
   * updates the options state by provided setOption setter method
   * @param sortDirection
   * @returns void
   */
  const resetOptions = (sortDirection: SortType) => {
    if (sortDirection) {
      const sortedOptions = sortOptions(
        options,
        optionFilterLabelKey,
        sortDirection
      );
      setOptions(sortedOptions);
    }
    setOptions(options);
  };
  /**
   * @method getSortIcon
   * @description This function is used to get sort icon based on current sort applied
   * @param sort
   * @param handleSortOptions
   * @returns SvgIcon
   */
  const getSortIcon = (
    sort: SortType | null,
    handleSortOptions: (e: React.MouseEvent<HTMLButtonElement>) => void
  ) => {
    return (
      <IconButton
        size="small"
        onClick={handleSortOptions}
      >
        <SvgIcon
          component={sort === SORT_DIRECTION.ASCENDING ? ArrowUp : ArrowDown}
          size={16}
          fill="var(--logile-icon-secondary)"
        />
      </IconButton>
    );
  };

  return (
    <div className="select-menuitem__toolbar">
      {allowFilter && (
        <TextField
          className="select-menuitem__toolbar-filter-input"
          onKeyDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          size="small"
          placeholder={MULTISELECT.SELECT_ALL_FEATURE_LABEL}
          variant="outlined"
          onChange={handleFilterChange}
          fullWidth
        />
      )}
      {allowSort && getSortIcon(sort, handleSortOptions)}
    </div>
  );
};
export default FilterSortToolbar;
