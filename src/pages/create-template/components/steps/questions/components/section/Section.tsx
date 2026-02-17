import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Controller, type Control, type FieldValues } from "react-hook-form";

import {
  ChevronCollapse,
  ChevronDown,
  DraggableDots,
  Setting,
} from "@/core/constants/icons";
import { SECTION_SETTINGS_MENU_KEY } from "@/pages/create-template/constants/questions";
import CSvgIcon from "@/core/components/icon/Icon";
import type { QuestionSectionProps } from "@/pages/create-template/types/questions.type";
import clsx from "@/utils/clsx";
import CNestedMenu from "@/core/components/nested-menu/NestedMenu";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import CIconButton from "@/core/components/button/IconButton";
import { CSortableContainer, CSortableItem } from "@/core/components/drag-drop";
import type { DragHandleProps } from "@/core/components/drag-drop/types/DragAndDrop.type";

import DeleteSectionModal from "../delete-modals/DeleteSectionModal";
import AddEditSectionModal from "../add-edit-section-modal/AddEditSectionModal";
import QuestionCard from "../question-card/QuestionCard";
import "./Section.scss";

type SectionSettingProps = {
  anchor: HTMLElement | null;
  status: boolean;
};
const QuestionSection = (props: QuestionSectionProps) => {
  const { QUESTIONS } = useCreateTemplateTranslations();
  const { control } = useCreateTemplateForm();
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

  useEffect(() => {
    if (props.isExpanded !== undefined) {
      setIsSectionCollapsed(!props.isExpanded);
    }
  }, [props.isExpanded]);

  const sectionCollapsed = () => {
    return (
      <CSortableItem id={props.sectionId}>
        {(dragHandleContext: DragHandleProps) => (
          <Box
            className={clsx({
              "question-section__collapsed": true,
              "question-section__collapsed--error": props.hasError,
            })}
          >
            <Box className="question-section__collapsed-content">
              <Box
                className="question-section__collapsed-content-dnd"
                {...dragHandleContext.listeners}
                {...dragHandleContext.attributes}
              >
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
                <Controller
                  name={`${props.questionFormPath}`}
                  control={control as unknown as Control<FieldValues>}
                  render={({ field }) => {
                    return (
                      <>{field.value?.subQuestions?.length || 0} Questions</>
                    );
                  }}
                />
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
        )}
      </CSortableItem>
    );
  };

  const sectionSettingsMenu = () => {
    const { anchor: anchorEl } = sectionSetting;
    return (
      <CNestedMenu
        anchorEl={anchorEl}
        menuItems={QUESTIONS.SECTION_SETTINGS_MENU_OPTIONS}
        onClose={closeSectionSettingsMenu}
        showSearch={false}
        className="question-section__settings-menu"
        onSelect={(item) => {
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
            <CIconButton
              size="small"
              variant="outline"
              onClick={openSectionSettingsMenu}
              className={clsx({
                "question-section__header-title-icon": true,
                "question-section__header-title-icon--active":
                  sectionSetting.status,
              })}
              walkMeId={[...props.walkMeIdPrefix, "settings"]}
            >
              <CSvgIcon component={Setting} />
            </CIconButton>
          </Box>
          <CIconButton
            size="medium"
            className="question-section__header-icon"
            onClick={toggleSectionCollapse}
            walkMeId={[...props.walkMeIdPrefix, "collapse-section"]}
          >
            <CSvgIcon component={ChevronCollapse} />
          </CIconButton>
        </Box>
        <Box className="question-section__questions-wrapper">
          <CSortableContainer
            id={props.sectionId}
            sortableIds={props.data.map((q) => q.qId.toString())}
          >
            {props.data && props.data?.length > 0
              ? props.data?.map((question, index) => (
                  <Box
                    className="question-section__questions-item"
                    key={question.qId}
                  >
                    <QuestionCard
                      index={`${props?.index}.${index + 1}`}
                      parentIndex={props.index}
                      sectionId={props.sectionId}
                      question={question}
                      expandedList={props?.expandedList}
                      toggleExpand={props?.toggleExpand}
                      questionFormPath={
                        props?.questionFormPath + `.subQuestions[${index}]`
                      }
                      handleQuestionAdd={props?.handleQuestionAdd}
                      isAddQuestionAllowed={props?.isAddQuestionAllowed}
                      walkMeIdPrefix={props?.walkMeIdPrefix}
                    />
                  </Box>
                ))
              : null}
          </CSortableContainer>
        </Box>
        {sectionSettingsMenu()}
        <DeleteSectionModal
          open={deleteModal.status}
          onClose={closeDeleteModal}
        />
        <AddEditSectionModal
          open={renameModal.status}
          onClose={closeRenameModal}
          type={QUESTIONS.SECTION_ADD_EDIT_MODAL.RENAME_SECTION}
          toggleExpand={props?.toggleExpand}
        />
      </>
    );
  };

  return (
    <div className="question-section">
      <CSortableContainer
        id={"question-section"} //replace with qid once gyan merges
        sortableIds={props.data.map((q) => q.qId.toString())}
      >
        {isSectionCollapsed ? sectionCollapsed() : sectionExpanded()}
      </CSortableContainer>
    </div>
  );
};
export default QuestionSection;
