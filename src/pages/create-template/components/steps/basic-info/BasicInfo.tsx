import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Controller, useWatch } from "react-hook-form";

import CTextfield from "@/core/components/form/textfield/Textfield";
import CSelect from "@/core/components/form/select";
import { AddIcon, ChevronRight, Delete } from "@/core/constants/icons";
import CMultiSelectWithChip from "@/core/components/multi-select-chip/MultiSelectWithChip";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";
import { useIsDesktopViewport } from "@/utils/get-viewport-size";
import clsx from "@/utils/clsx";
import { isNonEmptyValue } from "@/utils";
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
import useCreateTemplateForm from "@/pages/create-template/hooks/useCreateTemplateForm";
import { useGetTaskTypesOptions } from "@/pages/template-library/services/template-library-api-hooks";
import type { TaskTypeOptions } from "@/pages/template-library/types/template-library.type";
import type { AttachmentItemProps } from "@/pages/create-template/types/questions.type";
import { BASE_TEMPLATE_TYPE } from "@/pages/create-template/constants/constant";

import "./BasicInfo.scss";

const AttachmentItem: React.FC<AttachmentItemProps> = ({
  item,
  index,
  onDelete,
}) => {
  const fileName = item?.fileName;
  const { icon: fileIcon, color: fileIconColor } = useFileIcon(fileName);

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
const directoryDropdownOptions = [
  { value: 1, label: "Directory 1" },
  { value: 2, label: "Directory 2" },
];

const BasicInfo: React.FC = () => {
  const {
    control,
    formErrors,
    getFormValues,
    resetForm,
    setFormValue,
    triggerValidation,
  } = useCreateTemplateForm();

  const { BASIC_INFO } = useCreateTemplateTranslations();
  const { GENERAL } = useCommonTranslation();
  const [selectedTags, setSelectedTags] = useState([]);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const [attachmentFiles, setAttachmentFiles] = useState<
    { fileName: string; fileUrl: string }[]
  >([]);
  const isDesktop = useIsDesktopViewport();
  const { data: taskTypeOptions } = useGetTaskTypesOptions();
  const [templateTypeOptions, setTemplateTypeOptions] = useState([]);
  const watchedAttachments = useWatch({
    control,
    name: "basicData.attachment",
  });

  const handleTemplateTypeChange = (value: string): void => {
    const currentType = getFormValues("templateType");
    if (currentType === value) {
      return;
    }

    const templateTypeValue = value as keyof typeof BASE_TEMPLATE_TYPE;
    const currentBasicData = getFormValues("basicData");
    const advancedOptions = getFormValues("advancedOptions");
    const notifications = getFormValues("notifications");
    const followUpTask = getFormValues("followUpTask");

    switch (templateTypeValue) {
      case BASE_TEMPLATE_TYPE.checklist:
        resetForm({
          templateType: templateTypeValue,
          basicData: {
            ...currentBasicData,
            baseTemplateType: templateTypeValue,
          },
          advancedOptions,
          notifications,
          followUpTask,
          questions: getFormValues("questions") || [],
        });
        break;
      case BASE_TEMPLATE_TYPE.grid:
        resetForm({
          templateType: templateTypeValue,
          basicData: {
            ...currentBasicData,
            baseTemplateType: templateTypeValue,
          },
          advancedOptions,
          notifications,
          followUpTask,
          column: getFormValues("column") || { columnId: "", title: "" },
          row: getFormValues("row") || [],
        });
        break;
      case BASE_TEMPLATE_TYPE.form:
        resetForm({
          templateType: templateTypeValue,
          basicData: {
            ...currentBasicData,
            baseTemplateType: templateTypeValue,
            attachment: [],
          },
          advancedOptions,
          notifications,
          followUpTask,
        });
        break;
      case BASE_TEMPLATE_TYPE.spreadsheet:
        resetForm({
          templateType: templateTypeValue,
          basicData: {
            ...currentBasicData,
            baseTemplateType: templateTypeValue,
            attachment: [],
          },
          advancedOptions,
          notifications,
          followUpTask,
        });
        break;
    }
  };

  useEffect(() => {
    const data = taskTypeOptions?.data?.map((item: TaskTypeOptions) => ({
      label: item?.typeName,
      value: item?.typeName?.toLowerCase(),
    }));
    setTemplateTypeOptions(data);
  }, [taskTypeOptions]);

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
      const attachmentData = getFormValues("basicData.attachment");
      const fileList = attachmentData || [];
      processedFiles.forEach((files) => {
        const { file } = files;
        const fileName = "file" in files ? file.name : files.name;
        const fileUrl = "url" in file ? file.url : "";
        fileList.push({
          fileName: fileName,
          fileUrl: fileUrl,
        });
      });
      setFormValue("basicData.attachment", fileList);
      triggerValidation("basicData");
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
    const attachmentData = getFormValues("basicData.attachment");
    if (!isNonEmptyValue(attachmentData)) return;

    attachmentData.splice(index, 1);
    setFormValue("basicData.attachment", attachmentData);
    triggerValidation("basicData");
  };

  useEffect(() => {
    const validAttachments = (watchedAttachments || []).filter(
      (item): item is { fileName: string; fileUrl: string } =>
        typeof item?.fileName === "string" && typeof item?.fileUrl === "string"
    );
    setAttachmentFiles(validAttachments);
  }, [watchedAttachments]);

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
          <Controller
            name="basicData.templateName"
            control={control}
            render={({ field }) => (
              <CTextfield
                {...field}
                error={!!formErrors.basicData?.templateName}
                helperText={
                  formErrors.basicData?.templateName?.message as string
                }
                label={BASIC_INFO.templateName}
                required={true}
                placeholder={BASIC_INFO.templateNamePlaceholder}
              />
            )}
          />
        </Box>
        <Box
          className={clsx({
            "ct-basic-info__row-item": true,
            "ct-basic-info__row-first-item--desktop": isDesktop,
          })}
        >
          <Controller
            name="basicData.description"
            control={control}
            render={({ field }) => (
              <CTextfield
                {...field}
                error={!!formErrors.basicData?.description}
                helperText={
                  formErrors.basicData?.description?.message as string
                }
                label={BASIC_INFO.description}
                placeholder={BASIC_INFO.descriptionPlaceholder}
              />
            )}
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
          <Controller
            name="basicData.templateType"
            control={control}
            render={({ field }) => (
              <CSelect
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  handleTemplateTypeChange(
                    (e.target.value as string).toLowerCase()
                  );
                }}
                error={!!formErrors.basicData?.templateType}
                helperText={
                  formErrors.basicData?.templateType?.message as string
                }
                label={BASIC_INFO.type}
                required={true}
                optionValueKey="value"
                optionLabelKey="label"
                placeholder={BASIC_INFO.typePlaceholder}
                options={templateTypeOptions}
              />
            )}
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
            <Controller
              name="basicData.libraryId"
              control={control}
              render={({ field }) => (
                <CSelect
                  {...field}
                  value={field.value?.toString()}
                  error={!!formErrors.basicData?.libraryId}
                  helperText={
                    formErrors.basicData?.libraryId?.message as string
                  }
                  options={directoryDropdownOptions}
                  placeholder={BASIC_INFO.directoryPlaceholder}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                  }}
                  optionValueKey="value"
                  optionLabelKey="label"
                />
              )}
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

      <Controller
        name="basicData.templateType"
        control={control}
        render={({ field }) =>
          (field.value === BASE_TEMPLATE_TYPE.spreadsheet ||
            field?.value === BASE_TEMPLATE_TYPE.form) && (
            <Box className="ct-basic-info__row">
              <Box className="ct-basic-info__row-item">
                <Box
                  className={clsx({
                    "ct-basic-info__label": true,
                    "required-icon": true,
                    "ct-basic-info__label--error":
                      formErrors.basicData &&
                      "attachment" in formErrors.basicData &&
                      !!formErrors.basicData.attachment,
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
                  severity={
                    formErrors.basicData &&
                    "attachment" in formErrors.basicData &&
                    formErrors.basicData.attachment
                      ? "destructive"
                      : "primary"
                  }
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
                {formErrors.basicData &&
                  "attachment" in formErrors.basicData &&
                  formErrors.basicData.attachment && (
                    <Box className="ct-basic-info__error-text">
                      {
                        (
                          formErrors.basicData.attachment as {
                            message?: string;
                          }
                        )?.message
                      }
                    </Box>
                  )}
                <CAttachmentModal
                  size="large"
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  title={BASIC_INFO.attachment}
                  confirmBtnText={GENERAL.submitButtonLabel}
                  acceptFileFormats={
                    field.value === BASE_TEMPLATE_TYPE.form
                      ? FORM_FILE_TYPES
                      : SPREADSHEET_FILE_TYPES
                  }
                  showAttachmentModal={showAttachmentModal}
                  handleAttachmentClose={handleAttachmentClose}
                  handleAttachmentSubmit={handleAttachmentSubmit}
                  walkMeIdPrefix={["basic info step", "submit attachment"]}
                />
              </Box>
            </Box>
          )
        }
      />
    </Box>
  );
};

export default BasicInfo;
