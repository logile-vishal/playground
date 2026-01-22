import React, { useState } from "react";
import { Box } from "@mui/material";

import CTextfield from "@/core/components/form/textfield/Textfield";
import CSelect from "@/core/components/form/select";
import { AddIcon, ChevronRight, Delete } from "@/core/constants/icons";
import CMultiSelectWithChip from "@/core/components/multi-select-chip/MultiSelectWithChip";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";
import { useIsDesktopViewport } from "@/utils/get-viewport-size";
import clsx from "@/utils/clsx";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { basicTagsSampleData } from "@/pages/create-template/constants/sampleData";
import CSvgIcon from "@/core/components/icon/Icon";
import { CButton } from "@/core/components/button/button";
import CAttachmentModal from "@/core/components/attachment-modal/AttachmentModal";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
import type { ProcessedFile } from "@/core/hooks/useFileProcessor";
import { useFileIcon } from "@/core/hooks/useFileIcon";
import {
  FORM_FILE_TYPES,
  SPREADSHEET_FILE_TYPES,
} from "@/pages/create-template/constants/questions";

import "./BasicInfo.scss";

type AttachmentItemProps = {
  item: ProcessedFile | File;
  index: number;
  onDelete: (index: number) => void;
};

const AttachmentItem: React.FC<AttachmentItemProps> = ({
  item,
  index,
  onDelete,
}) => {
  const category = "category" in item ? item.category : undefined;
  const { icon: fileIcon, color: fileIconColor } = useFileIcon(category);
  const fileName = "file" in item ? item.file.name : item.name;

  return (
    <Box className="ct-basic-info__attachment-item">
      <CSvgIcon
        size={20}
        color={fileIconColor}
        component={fileIcon}
      />
      {fileName}
      <Box
        className="ct-basic-info__attachment-item-delete"
        onClick={() => onDelete(index)}
      >
        <CSvgIcon
          size={20}
          color="violation"
          component={Delete}
        />
      </Box>
    </Box>
  );
};

//TODO: To be removed static data when dropdown api response
const typeDropdownOptions = [
  { value: "Type 1", label: "Type 1" },
  { value: "Type 2", label: "Type 2" },
];
const directoryDropdownOptions = [
  { value: "Directory 1", label: "Directory 1" },
  { value: "Directory 2", label: "Directory 2" },
];

const BasicInfo: React.FC = () => {
  const { BASIC_INFO } = useCreateTemplateTranslations();
  const { GENERAL } = useCommonTranslation();
  const [selectedTags, setSelectedTags] = useState([]);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const [attachmentFiles, setAttachmentFiles] = useState<
    ProcessedFile[] | File[] | null
  >(null);
  const isDesktop = useIsDesktopViewport();
  const [selectedType, setSelectedType] = useState([]);
  const handleTagsDelete = (_: React.MouseEvent, data: NestedMenuItem) => {
    const updatedItems = selectedTags.filter(
      (item) => item?.value !== data?.value
    );
    setSelectedTags(updatedItems);
  };

  /**
   * @method handleAttachment
   * @description Opens file attachment modal
   * @return {void}
   */
  const handleAttachment = () => {
    setShowAttachmentModal(true);
  };

  /**
   * @method handleAttachmentClose
   * @description Closes attachment modal and clears selected file
   * @return {void}
   */
  const handleAttachmentClose = () => {
    setShowAttachmentModal(false);
    setSelectedFiles(null);
  };

  /**
   * @method handleAttachmentSubmit
   * @description Handles attachment submission from modal and closes it
   * @return {void}
   */
  const handleAttachmentSubmit = (processedFiles: ProcessedFile[] | File[]) => {
    if (selectedFiles) {
      setAttachmentFiles((prevFiles) =>
        prevFiles
          ? ([...prevFiles, ...processedFiles] as ProcessedFile[] | File[])
          : processedFiles
      );
      setSelectedFiles(null);
      setShowAttachmentModal(false);
    }
  };

  /**
   * @method handleDeleteAttachment
   * @description Removes an attachment file from the attachmentFiles array by index.
   * @param {number} index - The index of the file to delete from attachmentFiles array
   * @return {void}
   */
  const handleDeleteAttachment = (index: number): void => {
    if (!attachmentFiles) return;
    const updatedFiles = attachmentFiles.filter((_, i) => i !== index) as
      | ProcessedFile[]
      | File[];
    setAttachmentFiles(updatedFiles.length > 0 ? updatedFiles : null);
  };

  return (
    <Box className="ct-basic-info">
      <Box
        className={clsx({
          "ct-basic-info__row": true,
          "ct-basic-info__row--desktop": isDesktop,
        })}
      >
        <Box
          className={clsx({
            "ct-basic-info__row-item": true,
            "ct-basic-info__row-first-item": true,
            "ct-basic-info__row-first-item--desktop": isDesktop,
          })}
        >
          <CTextfield
            label={BASIC_INFO.templateName}
            required={true}
            placeholder={BASIC_INFO.templateNamePlaceholder}
          />
        </Box>
        <Box
          className={clsx({
            "ct-basic-info__row-item": true,
            "ct-basic-info__row-first-item--desktop": isDesktop,
          })}
        >
          <CTextfield
            label={BASIC_INFO.description}
            placeholder={BASIC_INFO.descriptionPlaceholder}
          />
        </Box>
      </Box>

      <Box
        className={clsx({
          "ct-basic-info__row": true,
          "ct-basic-info__row--desktop": isDesktop,
        })}
      >
        <Box className="ct-basic-info__row-item ct-basic-info__row-first-item">
          <CSelect
            label={BASIC_INFO.type}
            required={true}
            optionValueKey="value"
            optionLabelKey="label"
            placeholder={BASIC_INFO.typePlaceholder}
            options={typeDropdownOptions}
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
            }}
          />
        </Box>
        <Box
          className={clsx({
            "ct-basic-info__row-item": true,
            "ct-basic-info__row-item-tags--desktop": isDesktop,
          })}
        >
          <CMultiSelectWithChip
            label={BASIC_INFO.tags}
            name="tags"
            options={basicTagsSampleData}
            placeholder={BASIC_INFO.tagsPlaceholder}
            onDelete={handleTagsDelete}
            onChange={() => {}}
            isInputVisible={true}
            className={clsx({
              "ct-basic-info__row-item-tags-dropdown": true,
              "ct-basic-info__row-item-tags-dropdown--desktop": isDesktop,
            })}
            width="100%"
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: 200 }}
            menuWidth={"300px"}
          />
        </Box>
      </Box>

      <Box className="ct-basic-info__row">
        <Box className="ct-basic-info__row-item ct-basic-info__dropdown-container">
          <Box
            className={clsx({
              "ct-basic-info__label": true,
              "required-icon": true,
            })}
          >
            {BASIC_INFO.directory}
          </Box>
          <Box className="ct-basic-info__dropdown-row">
            <CSelect
              options={directoryDropdownOptions}
              placeholder={BASIC_INFO.directoryPlaceholder}
              onChange={() => {}}
              optionValueKey="value"
              optionLabelKey="label"
            />
            <CSvgIcon
              component={ChevronRight}
              color="secondary"
              size={24}
            />
            <CSelect
              options={directoryDropdownOptions}
              placeholder={BASIC_INFO.subDirectoryPlaceholder}
              width="200px"
              optionValueKey="value"
              optionLabelKey="label"
            />
            <CSvgIcon
              component={ChevronRight}
              color="secondary"
              size={24}
            />
            <CSelect
              options={directoryDropdownOptions}
              placeholder={BASIC_INFO.subDirectoryPlaceholder}
              optionValueKey="value"
              optionLabelKey="label"
              width="200px"
            />
          </Box>
        </Box>
      </Box>

      {/* TODO: Add base template type condition for rendering attachment view */}
      <Box className="ct-basic-info__row">
        <Box className="ct-basic-info__row-item">
          <Box
            className={clsx({
              "ct-basic-info__label": true,
              "required-icon": true,
            })}
          >
            {BASIC_INFO.attachment}
          </Box>
          {attachmentFiles && attachmentFiles.length > 0 && (
            <Box className="ct-basic-info__attachment">
              {attachmentFiles.map((item, index) => {
                return (
                  <AttachmentItem
                    key={index}
                    item={item}
                    index={index}
                    onDelete={handleDeleteAttachment}
                  />
                );
              })}
            </Box>
          )}

          <CButton
            className="ct-basic-info__action-btn"
            variant="outline"
            severity="primary"
            size="small"
            onClick={handleAttachment}
            walkMeIdPrefix={["basic info step", "add attachment"]}
          >
            <CSvgIcon
              size={15}
              component={AddIcon}
            />
            {BASIC_INFO.addFile}
          </CButton>
          <CAttachmentModal
            size="large"
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            title={BASIC_INFO.attachment}
            confirmBtnText={GENERAL.submitButtonLabel}
            acceptFileFormats={
              // TODO: Implement dynamic file format selection based on baseTemplateType
              // - Form: accept FORM_FILE_TYPES
              // - Spreadsheet: accept SPREADSHEET_FILE_TYPES
              FORM_FILE_TYPES || SPREADSHEET_FILE_TYPES
            }
            showAttachmentModal={showAttachmentModal}
            handleAttachmentClose={handleAttachmentClose}
            handleAttachmentSubmit={handleAttachmentSubmit}
            walkMeIdPrefix={["basic info step", "submit attachment"]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BasicInfo;
