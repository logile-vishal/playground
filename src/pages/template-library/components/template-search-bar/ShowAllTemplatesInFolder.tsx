import { useTemplateLibraryTranslations } from "../../translation/useTemplateLibraryTranslations";
import "./ShowAllTemplatesInFolder.scss";
import type { ShowAllTemplatesInFolderProps } from "../../types/TemplateSearchbar.type";

const ShowAllTemplatesInFolder = (props: ShowAllTemplatesInFolderProps) => {
  const { TEMPLATE_SEARCH_BAR: TEMPLATE_SEARCH_BAR_TRANSLATIONS } =
    useTemplateLibraryTranslations();
  if (props.isVisible) {
    return (
      <div
        className="template-library__btn-show-more-templates"
        onClick={props.onGoToFolder}
      >
        <span>
          {`${TEMPLATE_SEARCH_BAR_TRANSLATIONS.SHOW_ALL_TEMPLATE_IN_FOLDER.showAll} ${props.totalTemplates} ${TEMPLATE_SEARCH_BAR_TRANSLATIONS.SHOW_ALL_TEMPLATE_IN_FOLDER.templates} `}
        </span>
        {
          TEMPLATE_SEARCH_BAR_TRANSLATIONS.SHOW_ALL_TEMPLATE_IN_FOLDER
            .inThisFolder
        }
      </div>
    );
  }
  return null;
};

export default ShowAllTemplatesInFolder;
