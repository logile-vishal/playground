import React, { useEffect, useMemo, useRef, useState } from "react";

import { Close, Filter, Search } from "@/core/constants/icons";
import CIconButton from "@/core/components/button/IconButton";
import CInputWithChip from "@/core/components/input-chip/InputWithChip";
import CSvgIcon from "@/core/components/icon/Icon";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";

import {
  SKIP_FILTER,
  TEMPLATE_SEARCH_BAR,
  TEMPLATE_SEARCH_DEFAULT_FILTER,
} from "../../constants/constant";
import type {
  TemplateFilter,
  TemplateLibraryFilterModes,
  TemplateType,
} from "../../types/template-library.type";
import { useTemplateLibraryTranslations } from "../../translation/useTemplateLibraryTranslations";
import type { TemplateSearchBarProps } from "../../types/TemplateSearchbar.type";
import TemplateSearchModal from "./TemplateSearchModal";
import "./TemplateSearchBar.scss";
import { checkObjectHaveValues } from "../../utils/checkObjectHaveValues";

/**
 * @method generateFilterChips
 * @description Transforms a template filter object into displayable chip items.
 * Handles arrays (joins labels), objects (extracts label), and primitives.
 * Skips empty, falsy, or undefined values.
 * @param {TemplateFilter} filter - Active filter values
 * @param {Record<string, string>} prefixMap - Map of filter keys to display labels
 * @returns {NestedMenuItem[]} Array of chip items for UI display
 */
const generateFilterChips = (
  filter: TemplateFilter,
  prefixMap: Record<string, string>
): NestedMenuItem[] => {
  const chips: NestedMenuItem[] = [];
  const skipFilterKeys = ["selectedSort"];
  Object.entries(filter).forEach(([key, value]) => {
    if (
      !value ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "string" && value.trim() === "") ||
      prefixMap[key] === undefined ||
      skipFilterKeys.includes(key)
    ) {
      return;
    }

    if (Array.isArray(value)) {
      const label = value.map((item) => item.filterPath).join(", ");
      chips.push({ label: `${prefixMap[key]}: (${label})`, value: key });
    } else if (typeof value === "object" && value !== null) {
      if ("label" in value && typeof value.label === "string") {
        chips.push({
          label: `${prefixMap[key]}: (${value.label})`,
          value: key,
        });
      }
    } else {
      chips.push({ label: `${prefixMap[key]}: (${value})`, value: key });
    }
  });
  return chips;
};

/**
 * @component TemplateSearchBar
 * @description Search bar component with filter chips and modal for template filtering.
 * Uses local state for filters that only apply to parent on search submission.
 */
const TemplateSearchBar: React.FC<TemplateSearchBarProps> = ({
  onShowAllSearchResults,
  onSearch,
  setIsTableDataLoading = () => {},
  onTemplateSuggClick = () => {},
  directoriesList,
  filter,
  isFilterDataLoading,
  onClearFilter,
  onFilterChipDelete,
  onFilterChange = () => {},
}) => {
  const { TEMPLATE_SEARCH_BAR: TEMPLATE_SEARCH_BAR_TRANSLATIONS } =
    useTemplateLibraryTranslations();

  const [filterMode, setFilterScenario] = useState<TemplateLibraryFilterModes>(
    TEMPLATE_SEARCH_BAR.FILTER_MODES.basic
  );
  const [localFilter, setLocalFilter] = useState<TemplateFilter>(filter);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isClearButtonVisible, setIsClearButtonVisible] = useState(false);

  const searchBarAnchorRef = useRef<HTMLDivElement>(null);
  const modalAnchorRef = useRef<HTMLDivElement>(null);

  const isAdvancedMode =
    filterMode === TEMPLATE_SEARCH_BAR.FILTER_MODES.advanced;
  const filterChips: NestedMenuItem[] = useMemo(
    () =>
      generateFilterChips(
        filter,
        TEMPLATE_SEARCH_BAR_TRANSLATIONS.FILTER_CHIPS_PREFIX
      ),
    [filter, TEMPLATE_SEARCH_BAR_TRANSLATIONS.FILTER_CHIPS_PREFIX]
  );

  /**
   * @method handleToggleAdvancedFilter
   * @description Toggles between basic and advanced filter modes and opens the search modal
   * - Toggles between FILTER_MODES.basic and FILTER_MODES.advanced
   * - Always sets search modal to open state
   * @returns {void}
   */
  const handleToggleAdvancedFilter = (): void => {
    setFilterScenario((prev) =>
      prev === TEMPLATE_SEARCH_BAR.FILTER_MODES.basic
        ? TEMPLATE_SEARCH_BAR.FILTER_MODES.advanced
        : TEMPLATE_SEARCH_BAR.FILTER_MODES.basic
    );
    setIsSearchModalOpen(true);
    setLocalFilter({ ...filter, templateName: localFilter.templateName });
  };

  const handleOpenSearchModal = (): void => {
    setIsSearchModalOpen(true);
  };

  /**
   * @method handleCloseSearchModal
   * @description Closes modal and resets local filter to parent filter (discards unsaved changes).
   */
  const handleCloseSearchModal = (e?: MouseEvent | TouchEvent): void => {
    e?.stopPropagation();
    setIsSearchModalOpen(false);
    setFilterScenario(TEMPLATE_SEARCH_BAR.FILTER_MODES.basic);
    setLocalFilter(filter);
  };

  const handleClearSearchBar = (): void => {
    handleClearAllFilters();
  };

  /**
   * @method handleOnShowAllSearchResults
   * @description Closes modal and triggers show all results callback with current template name.
   */
  const handleOnShowAllSearchResults = (): void => {
    setIsSearchModalOpen(false);
    setFilterScenario(TEMPLATE_SEARCH_BAR.FILTER_MODES.basic);
    onFilterChange(
      TEMPLATE_SEARCH_BAR.FILTER_NAMES.templateName,
      localFilter.templateName
    );
    onShowAllSearchResults(localFilter.templateName);
  };

  /**
   * @method handleLocalFilterChange
   * @description Updates the local/temporary filter state (not applied to parent yet)
   * @param {string} field - The filter field name to update
   * @param {unknown} value - The new value to set for the specified field
   * @returns {void}
   */
  const handleLocalFilterChange = (field: string, value: unknown) => {
    setLocalFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * @method handleRemoveFilterChip
   * @description Removes a filter chip from the search interface
   * This function handles the removal of filter chips when users click the delete button.
   * It updates both local state and parent state.
   * @param {React.MouseEvent} _event - The click event (unused but required by interface)
   * @param {NestedMenuItem} item - The chip item containing the filter key to remove
   * @returns {void}
   */
  const handleRemoveFilterChip = (
    _event: React.MouseEvent,
    item: NestedMenuItem
  ): void => {
    const keyToRemove = item.value as string;
    setLocalFilter((prev) => ({
      ...prev,
      [keyToRemove]: JSON.parse(JSON.stringify(TEMPLATE_SEARCH_DEFAULT_FILTER))[
        keyToRemove as keyof TemplateFilter
      ],
    }));
    onFilterChipDelete(keyToRemove);
  };

  /**
   * @method handleFilterSubmit
   * @description Applies local filter to parent state and triggers search.
   */
  const handleFilterSubmit = (): void => {
    handleCloseSearchModal();
    Object.entries(localFilter).forEach(([key, value]) => {
      onFilterChange(key, value);
    });
    onSearch(localFilter);
  };

  /**
   * @method handleClearAllFilters
   * @description Clears all filters (triggers parent clear which syncs to local).
   */
  const handleClearAllFilters = (): void => {
    onClearFilter();
    setLocalFilter(JSON.parse(JSON.stringify(TEMPLATE_SEARCH_DEFAULT_FILTER)));
  };

  /**
   * @method handleOnTemplateSuggClick
   * @description Handles template suggestion selection, closes modal and syncs template name.
   */
  const handleOnTemplateSuggClick = (template: TemplateType): void => {
    setIsSearchModalOpen(false);
    setFilterScenario(TEMPLATE_SEARCH_BAR.FILTER_MODES.basic);
    onFilterChange(
      TEMPLATE_SEARCH_BAR.FILTER_NAMES.templateName,
      localFilter.templateName
    );
    onTemplateSuggClick(template);
  };

  useEffect(() => {
    setIsClearButtonVisible(checkObjectHaveValues(localFilter, SKIP_FILTER));
  }, [localFilter]);

  useEffect(() => {
    setLocalFilter(filter);
  }, [filter]);

  useEffect(() => {
    setIsTableDataLoading(isFilterDataLoading);
  }, [isFilterDataLoading, setIsTableDataLoading]);

  return (
    <div
      className="template-search"
      ref={searchBarAnchorRef}
    >
      <CInputWithChip
        inputPlacement="start"
        placeholder={TEMPLATE_SEARCH_BAR_TRANSLATIONS.placeholder}
        hideEndIcon={false}
        onChange={(event) =>
          handleLocalFilterChange(
            TEMPLATE_SEARCH_BAR.FILTER_NAMES.templateName,
            event.target.value
          )
        }
        renderInputChipLabel={(item) => <span>{item.label}</span>}
        isInputVisible={true}
        onDelete={handleRemoveFilterChip}
        searchText={localFilter.templateName}
        selectedItems={isAdvancedMode ? [] : filterChips}
        onClick={handleOpenSearchModal}
        disableInputFocus
        disableScrollToFocus
        startIcon={
          <CSvgIcon
            component={Search}
            color="secondary"
            size={18}
          />
        }
        endIcon={
          <div className="template-search__icon-container">
            {isClearButtonVisible && (
              <CIconButton
                onClick={handleClearSearchBar}
                size="small"
              >
                <CSvgIcon component={Close} />
              </CIconButton>
            )}
            <CIconButton
              onClick={handleToggleAdvancedFilter}
              size="small"
              severity={isAdvancedMode ? "primary" : "secondary"}
            >
              <CSvgIcon component={Filter} />
            </CIconButton>
          </div>
        }
      />
      {isSearchModalOpen && (
        <TemplateSearchModal
          onFilterChange={handleLocalFilterChange}
          anchorEl={searchBarAnchorRef.current}
          modalAnchor={modalAnchorRef}
          filterMode={filterMode}
          onClose={handleCloseSearchModal}
          filter={localFilter}
          onTemplateSuggClick={handleOnTemplateSuggClick}
          onShowAllSearchResults={handleOnShowAllSearchResults}
          onClearFilter={handleClearAllFilters}
          onFilterSubmit={handleFilterSubmit}
          directoriesList={directoriesList}
        />
      )}
    </div>
  );
};
export default TemplateSearchBar;
