import { Typography } from "@mui/material";

import { Search } from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";

import "./FilterSuggestionCard.scss";
import { boldSearchedWord } from "@/utils/bold-searched-word";
import { useTemplateLibraryTranslations } from "../../translation/useTemplateLibraryTranslations";
import type { FilterSuggestionCardProps } from "../../types/TemplateSearchbar.type";
import { formatDate } from "../template-libarary-config/TemplatePreviewConfig";

const FilterSuggestionCard = ({
  templateData,
  onClick,
  tagPath,
  templateNameFilterText,
}: FilterSuggestionCardProps) => {
  const { TEMPLATE_SEARCH_BAR: TEMPLATE_SEARCH_BAR_TRANSLATIONS } =
    useTemplateLibraryTranslations();
  const handleOnClick = () => {
    onClick(templateData);
  };
  return (
    <div
      className="filter-suggestion-card"
      onClick={handleOnClick}
    >
      <div className="filter-suggestion-card__icon">
        <CSvgIcon
          component={Search}
          color="secondary"
          size={24}
        />
      </div>
      <div className="filter-suggestion-card__details">
        <Typography className="filter-suggestion-card__details-template-name">
          {boldSearchedWord(templateData.templateName, templateNameFilterText)}
          <span className="filter-suggestion-card__details-template-code">
            {` (ID-${templateData.templateId})`}
          </span>
        </Typography>
        <Typography className="filter-suggestion-card__details-template-path">
          {tagPath}
        </Typography>
      </div>
      <div className="filter-suggestion-card__last-modified">
        <Typography className="filter-suggestion-card__last-modified-label">
          {TEMPLATE_SEARCH_BAR_TRANSLATIONS.lastModifiedLabel}
        </Typography>
        <Typography className="filter-suggestion-card__last-modified-date">
          {formatDate(templateData.lastModifiedTime)}
        </Typography>
      </div>
    </div>
  );
};

export default FilterSuggestionCard;
