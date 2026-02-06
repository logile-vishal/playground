import { IconButton } from "@mui/material";
import { useState } from "react";

import { ArrowDown, ArrowUp, Search } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import { SORT_DIRECTION } from "@/core/constants/sort";
import type { SortType } from "@/core/types/sort.type";
import CCheckbox from "@/core/components/form/checkbox/Checkbox";
import CTextfield from "@/core/components/form/textfield/Textfield";
import clsx from "@/utils/clsx";
import type {
  CFilterSortToolbarProps,
  SelectOption,
} from "@/core/components/form/types/select.type";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";

const sortOptions = (
  list: SelectOption[],
  optionLabelKey: string,
  sortDirection: SortType
): SelectOption[] => {
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

const CFilterSortToolbar: React.FC<CFilterSortToolbarProps> = (props) => {
  const { SELECT } = useCommonTranslation();
  const {
    allowFilter,
    allowSort,
    setOptions,
    options,
    optionFilterLabelKey,
    allowSelectAll,
    handleSelectAll,
    isAllOptionsSelected,
  } = props;
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
        return options.filter((option: SelectOption) => {
          if (typeof option === "string") {
            return (option as string).toLowerCase().includes(filterValue);
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
   * @returns CSvgIcon
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
        <CSvgIcon
          component={sort === SORT_DIRECTION.ASCENDING ? ArrowUp : ArrowDown}
          size={16}
          fill="var(--logile-icon-secondary)"
        />
      </IconButton>
    );
  };

  return (
    <div className="select-toolbar">
      {/* Select all feature option - only for multi-select */}
      {allowSelectAll && (
        <div className="select-toolbar__select-all">
          <div
            key="all-options-selected"
            className={clsx({
              "select__menu-item--selected": isAllOptionsSelected,
              "select__menu-item": true,
            })}
            onClick={handleSelectAll}
          >
            <CCheckbox
              id="all-options-selected"
              className="select__menu-item-checkbox"
              checked={isAllOptionsSelected}
            />
            <label htmlFor="all-options-selected">
              {SELECT.TOOLBAR.selectAllFeatureLabel}
            </label>
          </div>
        </div>
      )}
      {allowFilter && (
        <div className="select-toolbar__filter">
          <div className="select-toolbar__filter-field">
            <CTextfield
              className="select-menuitem__toolbar-filter-input"
              placeholder={SELECT.TOOLBAR.filterFeaturePlaceholder}
              onChange={handleFilterChange}
              fullWidth
              startIcon={<CSvgIcon component={Search} />}
            />
          </div>

          {allowSort && (
            <div className="select-toolbar__filter-sort-icon">
              {getSortIcon(sort, handleSortOptions)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default CFilterSortToolbar;
