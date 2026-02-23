import { useEffect, useRef, useState } from "react";

import CIconButton from "@/core/components/button/IconButton";
import CSvgIcon from "@/core/components/icon/Icon";
import CInputWithChip from "@/core/components/input-chip/InputWithChip";
import { Close, Search } from "@/core/constants/icons";
import { useTemplateLibraryTranslations } from "@/pages/template-library/translation/useTemplateLibraryTranslations";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { CButton } from "@/core/components/button/button";
import {
  SKIP_FILTER,
  TEMPLATE_SEARCH_BAR,
  TEMPLATE_SEARCH_DEFAULT_FILTER,
} from "@/pages/template-library/constants/constant";
import type { TemplateFilter } from "@/pages/template-library/types/template-library.type";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";
import { checkObjectHaveValues } from "@/pages/template-library/utils/checkObjectHaveValues";

import "../../FollowUpTemplate.scss";
import SearchbarModal from "./SearchbarModal";

const TemplateSearchbar = ({
  filter,
  localTemplateSelected,
  onTemplateSelect,
  directoryList,
  onTemplateSuggestClick,
  onShowAllSearchResults,
  onFilterClearAll,
}) => {
  const [isClearButtonVisible, setIsClearButtonVisible] = useState(false);
  const [localFilter, setLocalFilter] = useState(filter);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const searchBarAnchorRef = useRef<HTMLDivElement>(null);
  const { TEMPLATE_SEARCH_BAR: TEMPLATE_SEARCH_BAR_TRANSLATIONS } =
    useTemplateLibraryTranslations();
  const { FOLLOWUP_TASKS } = useCreateTemplateTranslations();

  const handleOpenSearchModal = (): void => {
    setIsSearchModalOpen(true);
  };

  const handleTemplateSuggestClick = (template) => {
    setIsSearchModalOpen(false);
    onTemplateSuggestClick(template);
  };

  const handleShowAllSearchResults = (): void => {
    setIsSearchModalOpen(false);
    onShowAllSearchResults(localFilter?.templateName || "");
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
   * @method handleCloseSearchModal
   * @description Closes modal and resets local filter to parent filter (discards unsaved changes).
   */
  const handleCloseSearchModal = (e?: MouseEvent | TouchEvent): void => {
    e?.stopPropagation();
    setIsSearchModalOpen(false);
    setLocalFilter(filter);
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
  };

  useEffect(() => {
    setIsClearButtonVisible(checkObjectHaveValues(localFilter, SKIP_FILTER));
  }, [localFilter]);

  useEffect(() => {
    setLocalFilter(filter);
  }, [filter]);

  const renderSearchInput = () => {
    return (
      <div
        ref={searchBarAnchorRef}
        className="ct-follow-up-template-searchbar-container"
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
          onClick={handleOpenSearchModal}
          disableInputFocus
          disableScrollToFocus
          startIcon={
            <div className="ct-follow-up-template-searchbar__start-icon-container">
              <CSvgIcon
                component={Search}
                color="secondary"
                size={18}
              />
            </div>
          }
          endIcon={
            <div className="template-search__icon-container">
              {isClearButtonVisible && (
                <CIconButton
                  onClick={onFilterClearAll}
                  size="small"
                >
                  <CSvgIcon component={Close} />
                </CIconButton>
              )}
            </div>
          }
        />
        {localTemplateSelected && (
          <CButton onClick={onTemplateSelect}>
            {FOLLOWUP_TASKS.ADD_FOLLOWUP_TASK_MODAL.selectButton}
          </CButton>
        )}
      </div>
    );
  };

  return (
    <div className="ct-follow-up-template-searchbar">
      {renderSearchInput()}
      {isSearchModalOpen && (
        <SearchbarModal
          filter={localFilter}
          anchorEl={searchBarAnchorRef.current}
          onTemplateSuggClick={handleTemplateSuggestClick}
          onShowAllSearchResults={handleShowAllSearchResults}
          directoriesList={directoryList}
          onClose={handleCloseSearchModal}
        />
      )}
    </div>
  );
};

export default TemplateSearchbar;
