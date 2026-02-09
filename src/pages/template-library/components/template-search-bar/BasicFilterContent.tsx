import { useEffect, useRef, useCallback } from "react";
import { Typography } from "@mui/material";

import CNoData from "@/core/components/no-data/NoData";
import { EmptyState, Search } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import type { DirectoryType } from "@/core/types/tree-view.type";
import { isNonEmptyValue } from "@/utils";

import "./BasicFilterContent.scss";
import FilterSuggestionCard from "./FilterSuggestionCard";
import { useTemplateLibraryTranslations } from "../../translation/useTemplateLibraryTranslations";
import type { BasicFilterContentProps } from "../../types/TemplateSearchbar.type";
import { useFilterTemplates } from "../../services/template-library-api-hooks";
import { renderSearchBarSkelton } from "../skeleton/Skeleton";

const getTemplateDirectoryPath = (
  directoryList: DirectoryType[],
  directoryId: number
): string[] => {
  for (const dir of directoryList) {
    if (dir.libraryId === directoryId) {
      return [dir.libraryName];
    }
    if (dir.subLibrary) {
      const ids = getTemplateDirectoryPath(dir.subLibrary, directoryId);
      if (ids.length > 0) {
        return [...ids, dir.libraryName];
      }
    }
  }
  return [];
};
const BasicFilterContent = ({
  filter,
  onShowAllSearchResults = () => {},
  onTemplateSuggClick,
  directoriesList = [],
}: BasicFilterContentProps) => {
  const {
    TEMPLATE_SEARCH_BAR: TEMPLATE_SEARCH_BAR_TRANSLATIONS,
    NO_DATA_SEARCH,
  } = useTemplateLibraryTranslations();
  const searchValue = filter.templateName;

  const {
    data: filteredSuggestionsList,
    mutateAsync: filterTemplateSuggestions,
    isPending: isFilterDataLoading,
  } = useFilterTemplates();

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getTemplateSuggestion = useCallback(
    (templateName: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(async () => {
        const payload = {
          templateName: templateName,
          pageSize: 3,
          currentPage: 1,
        };
        await filterTemplateSuggestions(payload);
      }, 300);
    },
    [filterTemplateSuggestions]
  );

  useEffect(() => {
    if (isNonEmptyValue(filter?.templateName))
      getTemplateSuggestion(filter?.templateName);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter?.templateName]);

  const isNoData =
    !filteredSuggestionsList?.data ||
    filteredSuggestionsList?.data?.length === 0;
  return (
    <>
      <div className="basic-filter-content">
        {isFilterDataLoading ? (
          renderSearchBarSkelton()
        ) : isNoData ? (
          <CNoData
            title={NO_DATA_SEARCH.title}
            description={NO_DATA_SEARCH.description}
            imageSrcName={EmptyState}
            imageWidth={90}
          />
        ) : (
          filteredSuggestionsList?.data?.map((item) => {
            const tagId = "tagId" in item ? item.tagId : undefined;
            return (
              <FilterSuggestionCard
                templateNameFilterText={filter.templateName || ""}
                key={item.templateId}
                templateData={item}
                onClick={onTemplateSuggClick}
                tagPath={
                  tagId
                    ? getTemplateDirectoryPath(directoriesList, tagId)
                        ?.reverse()
                        .join(" > ")
                    : ""
                }
              />
            );
          })
        )}
      </div>

      {searchValue && !isNoData && (
        <div
          className="basic-filter-content__search-all"
          onClick={onShowAllSearchResults}
        >
          <div>
            <CSvgIcon
              component={Search}
              color="secondary"
              size={24}
            />
          </div>
          <Typography className="basic-filter-content__search-all-text">
            {`${TEMPLATE_SEARCH_BAR_TRANSLATIONS.searchAllResults} '${searchValue}'`}
          </Typography>
        </div>
      )}
    </>
  );
};
export default BasicFilterContent;
