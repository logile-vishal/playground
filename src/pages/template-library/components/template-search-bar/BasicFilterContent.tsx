import { Typography } from "@mui/material";

import CNoData from "@/core/components/no-data/NoData";
import { EmptyState, Search } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import type { DirectoryType } from "@/core/types/tree-view.type";

import "./BasicFilterContent.scss";
import FilterSuggestionCard from "./FilterSuggestionCard";
import type { TemplateType } from "../../types/template-library.type";
import { useTemplateLibraryTranslations } from "../../translation/useTemplateLibraryTranslations";
import type { BasicFilterContentProps } from "../../types/TemplateSearchbar.type";

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
  const { TEMPLATE_SEARCH_BAR: TEMPLATE_SEARCH_BAR_TRANSLATIONS } =
    useTemplateLibraryTranslations();
  const searchValue = filter.templateName;

  // TODO: Implement basic filter suggestion fetching logic here
  //   const {
  //   data: filteredSuggestionsList,
  //   mutateAsync: filterTemplateSuggestions,
  //   isPending: isFilterDataLoading,
  // } = useFilterSuggestion();

  //TODO: REMOVE ONCE API IS INTEGRATED
  const filteredSuggestionsList: TemplateType[] = [
    {
      templateId: 1926,
      templateName: "Barcode Scan test",
      tagType: "Checklist",
      status: "Linked",
      createdTime: "2018-12-05T16:52:35.717",
      lastModifiedTime: "2018-12-05T16:52:35.717",
      iconName: "Store-Trolly",
      iconColour: "05f0fc",
      tagId: 2003,
    },
    {
      templateId: 1887,
      templateName: "Deli Temperature Check",
      tagType: "Checklist",
      status: "Not_Assigned",
      createdTime: "2019-04-25T17:03:00.707",
      lastModifiedTime: "2019-04-29T20:41:57.263",
      iconName: "Store-Trolly",
      iconColour: "05f0fc",
      tagId: 2003,
    },
    {
      templateId: 1996,
      templateName: "Employee Satisfaction",
      tagType: "Survey",
      status: "Linked",
      createdTime: "2019-02-14T09:34:47.14",
      lastModifiedTime: "2019-02-14T09:34:52.17",
      iconName: "v15-Shop-supply",
      iconColour: "#bd9721",
      tagId: 2003,
    },
    {
      templateId: 2216,
      templateName: "Example Auto complete",
      tagType: "Checklist",
      status: "Linked",
      createdTime: "2019-08-16T17:40:38.05",
      lastModifiedTime: "2019-08-16T17:40:38.05",
      iconName: "Store-Trolly",
      iconColour: "05f0fc",
      tagId: 2003,
    },
    {
      templateId: 2334,
      templateName: "Example photo and tags",
      tagType: "Checklist",
      status: "Linked",
      createdTime: "2020-08-10T15:36:49.627",
      lastModifiedTime: "2020-08-10T15:38:53.951",
      iconName: "Store-Trolly",
      iconColour: "05f0fc",
      tagId: 2003,
    },
    {
      templateId: 2156,
      templateName: "Front End Quick Check",
      tagType: "Checklist",
      status: "Linked",
      createdTime: "2018-11-21T14:57:01.637",
      lastModifiedTime: "2019-01-10T09:37:37.71",
      iconName: "Store-Trolly",
      iconColour: "05f0fc",
      tagId: 2003,
    },
    {
      templateId: 2093,
      templateName: "Front End Quick Review",
      tagType: "Checklist",
      status: "Not_Assigned",
      createdTime: "2018-11-21T14:57:01.637",
      lastModifiedTime: "2019-01-10T09:58:47.69",
      iconName: "Store-Trolly",
      iconColour: "05f0fc",
      tagId: 2003,
    },
    {
      templateId: 2092,
      templateName: "Grid additional information",
      tagType: "Grid",
      status: "Linked",
      createdTime: "2018-12-27T14:11:21.84",
      lastModifiedTime: "2018-12-27T14:11:21.84",
      iconName: "v15-Shop-supply",
      iconColour: "#bd9721",
      tagId: 2003,
    },
    {
      templateId: 2229,
      templateName: "Heinens - Cook Log (>145)",
      tagType: "Logs",
      status: "Not_Assigned",
      createdTime: "2017-11-16T13:24:42",
      lastModifiedTime: "2019-12-18T00:35:26.837",
      iconName: "v15-Shop-supply",
      iconColour: "#bd9721",
      tagId: 2003,
    },
    {
      templateId: 2228,
      templateName: "Heinens - Cook Log (>145) copy",
      tagType: "Logs",
      status: "Not_Assigned",
      createdTime: "2017-11-16T13:24:42",
      lastModifiedTime: "2019-12-18T13:29:38.54",
      iconName: "v15-Shop-supply",
      iconColour: "#bd9721",
      tagId: 2003,
    },
    {
      templateId: 2242,
      templateName: "Heinens - Hot hold",
      tagType: "Checklist",
      status: "Linked",
      createdTime: "2019-12-18T12:20:25.747",
      lastModifiedTime: "2019-12-18T14:31:48.343",
      iconName: "Store-Trolly",
      iconColour: "05f0fc",
      tagId: 2003,
    },
    {
      templateId: 1992,
      templateName: "Heinens - Low Country Shrimp Boil Cook",
      tagType: "Checklist",
      status: "Linked",
      createdTime: "2019-12-17T23:20:54.653",
      lastModifiedTime: "2019-12-17T23:20:54.653",
      iconName: "Store-Trolly",
      iconColour: "05f0fc",
      tagId: 2003,
    },
    {
      templateId: 2227,
      templateName: "Heinens - Two-Hour Cool Down Interval",
      tagType: "Logs",
      status: "Not_Assigned",
      createdTime: "2017-11-16T13:33:18",
      lastModifiedTime: "2019-12-18T00:31:46.023",
      iconName: "v15-Shop-supply",
      iconColour: "#bd9721",
      tagId: 2003,
    },
    {
      templateId: 2230,
      templateName: "Heinens - Two-Hour Cool Down Interval copy",
      tagType: "Logs",
      status: "Not_Assigned",
      createdTime: "2017-11-16T13:33:18",
      lastModifiedTime: "2019-12-18T00:31:46.023",
      iconName: "v15-Shop-supply",
      iconColour: "#bd9721",
      tagId: 2003,
    },
    {
      templateId: 1791,
      templateName: "Pricing Introduction",
      tagType: "Checklist",
      status: "Linked",
      createdTime: "2019-02-14T10:16:05.447",
      lastModifiedTime: "2019-02-14T10:19:40.447",
      iconName: "Store-Trolly",
      iconColour: "05f0fc",
      tagId: 2003,
    },
    {
      templateId: 2020,
      templateName: "Robert Triggered Template 3",
      tagType: "Checklist",
      status: "Linked",
      createdTime: "2018-12-03T09:43:16.2",
      lastModifiedTime: "2018-12-03T09:43:16.2",
      iconName: "Store-Trolly",
      iconColour: "05f0fc",
      tagId: 2003,
    },
    {
      templateId: 1924,
      templateName: "Shared Trigger example",
      tagType: "Checklist",
      status: "Linked",
      createdTime: "2019-03-26T11:08:51.98",
      lastModifiedTime: "2019-03-26T11:08:51.98",
      iconName: "Store-Trolly",
      iconColour: "05f0fc",
      tagId: 2003,
    },
    {
      templateId: 2343,
      templateName: "Test completed trigger task",
      tagType: "Checklist",
      status: "Linked",
      createdTime: "2021-02-19T12:42:26.284",
      lastModifiedTime: "2021-02-19T12:42:26.284",
      iconName: "Store-Trolly",
      iconColour: "05f0fc",
      tagId: 2003,
    },
    {
      templateId: 2328,
      templateName: "Test response template",
      tagType: "Checklist",
      status: "Linked",
      createdTime: "2020-07-24T12:04:08.294",
      lastModifiedTime: "2020-07-24T12:04:08.294",
      iconName: "Store-Trolly",
      iconColour: "05f0fc",
      tagId: 2003,
    },
    {
      templateId: 2365,
      templateName: "Web Link Test",
      tagType: "Checklist",
      status: "Assigned",
      createdTime: "2022-08-16T09:09:49.52",
      lastModifiedTime: "2022-08-16T09:09:49.52",
      iconName: "Store-Trolly",
      iconColour: "05f0fc",
      tagId: 2003,
    },
    {
      templateId: 2021,
      templateName: "test 10009-1203",
      tagType: "Checklist",
      status: "Linked",
      createdTime: "2018-12-03T09:32:31.36",
      lastModifiedTime: "2018-12-03T09:34:02.9",
      iconName: "Store-Trolly",
      iconColour: "05f0fc",
      tagId: 2003,
    },
  ];
  const isNoData =
    !filteredSuggestionsList || filteredSuggestionsList.length === 0;
  return (
    <>
      <div className="basic-filter-content">
        {isNoData && (
          <CNoData
            title={"NO_DATA_SEARCH.title"}
            description={"NO_DATA_SEARCH.description"}
            imageSrcName={EmptyState}
            imageWidth={90}
          />
        )}
        {filteredSuggestionsList?.slice(0, 3).map((item) => {
          return (
            <FilterSuggestionCard
              templateNameFilterText={filter.templateName || ""}
              key={item.templateId}
              templateData={item}
              onClick={onTemplateSuggClick}
              tagPath={getTemplateDirectoryPath(directoriesList, item.tagId)
                ?.reverse()
                .join(" > ")}
            />
          );
        })}
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
