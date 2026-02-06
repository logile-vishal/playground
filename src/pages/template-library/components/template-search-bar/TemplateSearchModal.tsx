import { useCallback, useLayoutEffect, useState } from "react";
import { Popper } from "@mui/material";

import { useClickAway } from "@/core/hooks/useClickAway";

import BasicFilterContent from "./BasicFilterContent";
import "./TemplateSearchModal.scss";
import { TEMPLATE_SEARCH_BAR } from "../../constants/constant";
import AdvanceFilterContent from "./AdvanceFilterContent";
import type { TemplateSearchModalProps } from "../../types/TemplateSearchbar.type";

const TemplateSearchModal = (props: TemplateSearchModalProps) => {
  const [modalWidth, setModalWidth] = useState<number>(0);
  const updateModalWidth = useCallback(() => {
    if (props.anchorEl) {
      const { width } = props.anchorEl.getBoundingClientRect();
      setModalWidth(width);
    }
  }, [props.anchorEl]);

  useLayoutEffect(() => {
    if (!props.anchorEl) return;
    updateModalWidth();
    const handleResize = () => {
      updateModalWidth();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [props.anchorEl, updateModalWidth]);

  // Classnames that should prevent modal from closing when clicked
  const excludedClassNames = [
    "MuiMenuItem-root",
    "MuiSelect-select",
    "MuiMenu-paper",
    "MuiMenu-list",
    "MuiPopover-paper",
    "MuiPopover-root",
    "MuiModal-backdrop",
    "MuiBackdrop-root",
    "MuiBackdrop-invisible",
    "select__menu",
    "select__menu-item",
    "select__input",
    "MuiSelect-nativeInput",
    "MuiOutlinedInput-root",
    "MuiInputBase-root",
  ];

  const handleClickOutside = (event: MouseEvent | TouchEvent): void => {
    if (props.anchorEl && !props.anchorEl.contains(event.target as Node)) {
      props.onClose(event);
    }
  };

  const popperRef = useClickAway<HTMLDivElement>(handleClickOutside, {
    excludedClassNames,
    enabled: true,
  });
  return (
    <Popper
      anchorEl={props.anchorEl}
      ref={popperRef}
      open={true}
      className={`template-search-modal`}
      placement="bottom-start"
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 2], // 2px gap
          },
        },
      ]}
      sx={{ width: modalWidth }}
    >
      {props.filterMode == TEMPLATE_SEARCH_BAR.FILTER_MODES.basic && (
        <BasicFilterContent
          filter={props.filter}
          onTemplateSuggClick={props.onTemplateSuggClick}
          onShowAllSearchResults={props.onShowAllSearchResults}
          directoriesList={props.directoriesList}
        />
      )}
      {props.filterMode == TEMPLATE_SEARCH_BAR.FILTER_MODES.advanced && (
        <AdvanceFilterContent
          filter={props.filter}
          onFilterChange={props.onFilterChange}
          onClearFilter={props.onClearFilter}
          onFilterSubmit={props.onFilterSubmit}
        />
      )}
    </Popper>
  );
};
export default TemplateSearchModal;
