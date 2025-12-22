import { useState } from "react";
import { Box } from "@mui/material";

import {
  ChevronCollapse,
  ChevronDown,
  DraggableDots,
  Setting,
} from "@/core/constants/icons";
import {
  QUESTION_MODAL,
  SECTION_SETTINGS_MENU_KEY,
  SECTION_SETTINGS_MENU_OPTIONS,
} from "@/pages/create-template/constants/questions";
import CSvgIcon from "@/core/components/icon/Icon";
import type { QuestionSectionProps } from "@/pages/create-template/types/questions.type";
import clsx from "@/utils/clsx";
import CNestedMenu from "@/core/components/nested-menu/NestedMenu";
import IconButton from "@/core/components/button/IconButton";

import DeleteSectionModal from "../delete-section-modal/DeleteSectionModal";
import AddEditSectionModal from "../add-edit-section-modal/AddEditSectionModal";
import QuestionCard from "../question-card/QuestionCard";
import "./Section.scss";

type SectionSettingProps = {
  anchor: HTMLElement | null;
  status: boolean;
};
const QuestionSection = (props: QuestionSectionProps) => {
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);
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

  const toggleSectionCollapse = () => {
    setIsSectionCollapsed(!isSectionCollapsed);
  };

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

  /* Rename Modal */
  const openRenameModal = (data) => {
    setRenameModal({
      status: true,
      data: data,
    });
  };

  const closeRenameModal = () => {
    setRenameModal({
      status: false,
      data: null,
    });
  };

  /* Delete Modal */
  const openDeleteModal = (data) => {
    setDeleteModal({
      status: true,
      data: data,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      status: false,
      data: null,
    });
  };

  const sectionCollapsed = () => {
    return (
      <>
        <Box
          className={clsx({
            "question-section__collapsed": true,
            "question-section__collapsed--error": props.hasError,
          })}
        >
          <Box className="question-section__collapsed-content">
            <Box className="question-section__collapsed-content-dnd">
              <CSvgIcon
                size={24}
                component={DraggableDots}
              />
            </Box>
            <Box className="question-section__collapsed-content-title">
              {props.title}
            </Box>
          </Box>

          <Box
            className={clsx({
              "question-section__collapsed-content": true,
              "question-section__collapsed-content--right": true,
            })}
          >
            <Box className="question-section__collapsed-content-label">
              2 Questions
            </Box>
            <Box
              className="question-section__collapsed-content-icon"
              onClick={toggleSectionCollapse}
            >
              <CSvgIcon
                component={ChevronDown}
                color="secondary"
              />
            </Box>
          </Box>
        </Box>
      </>
    );
  };

  const sectionSettingsMenu = () => {
    const { anchor: anchorEl } = sectionSetting;
    return (
      <CNestedMenu
        anchorEl={anchorEl}
        menuItems={SECTION_SETTINGS_MENU_OPTIONS}
        onClose={closeSectionSettingsMenu}
        showSearch={false}
        className="question-section__settings-menu"
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        onMenuItemSelect={(item) => {
          if (item?.value === SECTION_SETTINGS_MENU_KEY.RENAME) {
            openRenameModal(null);
          } else if (item?.value === SECTION_SETTINGS_MENU_KEY.DELETE) {
            openDeleteModal(null);
          }
        }}
      />
    );
  };

  const sectionExpanded = () => {
    return (
      <>
        <Box className="question-section__header">
          <Box className="question-section__header-title">
            <Box className="question-section__header-title-text">
              {props.title}
            </Box>
            <Box
              onClick={openSectionSettingsMenu}
              className={clsx({
                "question-section__header-title-icon": true,
                "question-section__header-title-icon--active":
                  sectionSetting.status,
              })}
            >
              <CSvgIcon
                size={18}
                component={Setting}
              />
            </Box>
          </Box>
          <IconButton
            className="question-section__header-icon"
            onClick={toggleSectionCollapse}
          >
            <CSvgIcon
              size={16}
              component={ChevronCollapse}
              color="secondary"
            />
          </IconButton>
        </Box>
        <Box className="question-section__questions-wrapper">
          {/* TODO: Replace question data after API data */}
          {/* {props.data.map((question) => (
            <Box
              className="question-section__questions-item"
              key={question.id}
            >
              <QuestionCardCollapsed
                label={question.label}
                isRequired={question.isRequired}
                orderIndex={question.orderIndex}
                optiontypeLabel={QUESTION_TYPES.RADIO_BUTTON.label} 
                />
            </Box>
          ))} */}
          {/* TODO: Replace hardcoded data with mapped questions fetched from the API */}
          {props.data && props.data?.length > 0
            ? props.data?.map((question) => (
                <Box
                  className="question-section__questions-item"
                  key={question.id}
                >
                  <QuestionCard
                    question={question}
                    expandedList={props?.expandedList}
                    toggleExpand={props?.toggleExpand}
                  />
                </Box>
              ))
            : null}
        </Box>
        {sectionSettingsMenu()}
        <DeleteSectionModal
          open={deleteModal.status}
          onClose={closeDeleteModal}
        />
        <AddEditSectionModal
          open={renameModal.status}
          onClose={closeRenameModal}
          type={QUESTION_MODAL.RENAME_SECTION}
        />
      </>
    );
  };

  return (
    <Box className="question-section">
      {isSectionCollapsed ? sectionCollapsed() : sectionExpanded()}
    </Box>
  );
};
export default QuestionSection;
