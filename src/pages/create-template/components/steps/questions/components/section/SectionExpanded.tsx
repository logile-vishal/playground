import { useState } from "react";
import { Box } from "@mui/material";

import { ChevronCollapse, Setting } from "@/core/constants/icons";
import { SECTION_SETTINGS_MENU_KEY } from "@/pages/create-template/constants/questions";
import CSvgIcon from "@/core/components/icon/Icon";
import type { QuestionProps } from "@/pages/create-template/types/questions.type";
import clsx from "@/utils/clsx";
import CNestedMenu from "@/core/components/nested-menu/NestedMenu";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import CIconButton from "@/core/components/button/IconButton";
import { CSortableContainer, CSortableItem } from "@/core/components/drag-drop";

import AddEditSectionModal from "../add-edit-section-modal/AddEditSectionModal";
import QuestionCard from "../question-card/QuestionCard";
import DeleteSectionModal from "../delete-modals/DeleteSectionModal";

type SectionSettingProps = {
  anchor: HTMLElement | null;
  status: boolean;
};

export type SectionExpandedProps = {
  sectionId: string;
  title: string;
  index: string | number;
  data: QuestionProps[];
  questionFormPath: string;
  expandedList: Record<string | number, boolean>;
  toggleExpand: (id: string) => void;
  handleQuestionAdd: (afterQuestionId?: string) => Promise<boolean>;
  isAddQuestionAllowed: boolean;
  walkMeIdPrefix: string[];
  onToggleCollapse: () => void;
};

export const SectionExpanded = ({
  sectionId,
  title,
  index,
  data,
  questionFormPath,
  expandedList,
  toggleExpand,
  handleQuestionAdd,
  isAddQuestionAllowed,
  walkMeIdPrefix,
  onToggleCollapse,
}: SectionExpandedProps) => {
  const { QUESTIONS } = useCreateTemplateTranslations();
  const [sectionSetting, setSectionSetting] = useState<SectionSettingProps>({
    anchor: null,
    status: false,
  });
  const [renameModal, setRenameModal] = useState({
    status: false,
    data: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    status: false,
    data: null,
  });

  const openSectionSettingsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setSectionSetting({
      anchor: event.currentTarget,
      status: true,
    });
  };

  const closeSectionSettingsMenu = () => {
    setSectionSetting({
      anchor: null,
      status: false,
    });
  };

  const openRenameModal = () => {
    setRenameModal({
      status: true,
      data: null,
    });
  };

  const closeRenameModal = () => {
    setRenameModal({
      status: false,
      data: null,
    });
  };

  const openDeleteModal = () => {
    setDeleteModal({
      status: true,
      data: null,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      status: false,
      data: null,
    });
  };

  const renderSectionSettingsMenu = () => {
    const { anchor: anchorEl } = sectionSetting;
    return (
      <CNestedMenu
        anchorEl={anchorEl}
        menuItems={QUESTIONS.SECTION_SETTINGS_MENU_OPTIONS}
        onClose={closeSectionSettingsMenu}
        showSearch={false}
        className="question-section__settings-menu"
        menuWidth={"var(--section-setting-menu-width)"}
        onSelect={(item) => {
          if (item?.value === SECTION_SETTINGS_MENU_KEY.RENAME) {
            openRenameModal();
          } else if (item?.value === SECTION_SETTINGS_MENU_KEY.DELETE) {
            openDeleteModal();
          }
        }}
      />
    );
  };

  return (
    <CSortableItem
      key={sectionId}
      id={sectionId}
      enableCustomDragHandle
    >
      <Box className="question-section__header">
        <Box className="question-section__header-title">
          <Box className="question-section__header-title-text">{title}</Box>
          <CIconButton
            size="small"
            variant="outline"
            onClick={openSectionSettingsMenu}
            className={clsx({
              "question-section__header-title-icon": true,
              "question-section__header-title-icon--active":
                sectionSetting.status,
            })}
            walkMeId={[...walkMeIdPrefix, "settings"]}
          >
            <CSvgIcon component={Setting} />
          </CIconButton>
        </Box>
        <CIconButton
          size="medium"
          className="question-section__header-icon"
          onClick={onToggleCollapse}
          walkMeId={[...walkMeIdPrefix, "collapse-section"]}
        >
          <CSvgIcon component={ChevronCollapse} />
        </CIconButton>
      </Box>
      <Box className="question-section__questions-wrapper">
        <CSortableContainer
          id={sectionId}
          sortableIds={data.map((q) => q.qId.toString())}
        >
          {data && data?.length > 0
            ? data?.map((question, idx) => (
                <Box
                  className="question-section__questions-item"
                  key={question.qId}
                >
                  <QuestionCard
                    index={`${index}.${idx + 1}`}
                    parentIndex={index}
                    sectionId={sectionId}
                    question={question}
                    expandedList={expandedList}
                    toggleExpand={toggleExpand}
                    questionFormPath={`${questionFormPath}.subQuestions[${idx}]`}
                    handleQuestionAdd={handleQuestionAdd}
                    isAddQuestionAllowed={isAddQuestionAllowed}
                    walkMeIdPrefix={walkMeIdPrefix}
                  />
                </Box>
              ))
            : null}
        </CSortableContainer>
      </Box>
      {renderSectionSettingsMenu()}

      <DeleteSectionModal
        open={deleteModal.status}
        onClose={closeDeleteModal}
      />
      <AddEditSectionModal
        open={renameModal.status}
        onClose={closeRenameModal}
        type={QUESTIONS.SECTION_ADD_EDIT_MODAL.RENAME_SECTION}
        toggleExpand={toggleExpand}
      />
    </CSortableItem>
  );
};
