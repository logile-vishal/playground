import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Controller, useWatch } from "react-hook-form";

import CTextfield from "@/core/components/form/textfield/Textfield";
import CSelect from "@/core/components/form/select";
import { AddIcon, ChevronRight, Delete } from "@/core/constants/icons";
import type { NestedMenuItem } from "@/core/components/nested-menu/types";
import { useIsDesktopViewport } from "@/utils/get-viewport-size";
import clsx from "@/utils/clsx";
import { isNonEmptyValue } from "@/utils";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import TagSelector from "@/pages/create-template/components/tag-selecter/TagSelector";
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
import {
  useGetAllDirectories,
  useGetTaskTypesOptions,
} from "@/pages/template-library/services/template-library-api-hooks";
import type { TaskTypeOptions } from "@/pages/template-library/types/template-library.type";
import type {
  AttachmentItemProps,
  TemplateTagsProps,
} from "@/pages/create-template/types/questions.type";
import {
  BASE_TEMPLATE_TYPE,
  COMPLETE_BASE_TEMPLATE_TYPE,
} from "@/pages/create-template/constants/constant";
import { TEMPLATE_TYPE } from "@/pages/template-library/constants/constant";

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

const BasicInfo: React.FC = () => {
  const {
    control,
    formErrors,
    getFormValues,
    resetForm,
    formState,
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
  const [templateDirectory, setTemplateDirectory] = useState([]);
  const [selectedDirectories, setSelectedDirectories] = useState<
    Array<{ libraryId: number; libraryName: string }>
  >([]);
  const watchedAttachments = useWatch({
    control,
    name: "basicData.attachment",
  });
  const { data: directoriesList } = useGetAllDirectories();

  const generateDirectoryOptions = (directory = []) => {
    const options = [];
    directory?.map((item) => {
      options.push({ value: item?.libraryId, label: item?.libraryName });
    });
    return options;
  };

  const handleTemplateTypeChange = (value: string): void => {
    const baseTemplateType = templateTypeOptions.find(
      (option) => option.value === value
    );

    const currentType = getFormValues("templateType");
    if (currentType === baseTemplateType?.value) {
      return;
    }

    const templateTypeValue =
      baseTemplateType.baseTemplateType.toLowerCase() as keyof typeof BASE_TEMPLATE_TYPE;

    const currentBasicData = getFormValues("basicData");
    const advancedOptions = getFormValues("advancedOptions");
    const notifications = getFormValues("notifications");
    const followUpTasks = getFormValues("followUpTasks");

    switch (templateTypeValue) {
      case (COMPLETE_BASE_TEMPLATE_TYPE.checklist,
      COMPLETE_BASE_TEMPLATE_TYPE.auditOrg,
      COMPLETE_BASE_TEMPLATE_TYPE.auditAssociate):
        resetForm({
          templateType: templateTypeValue,
          basicData: {
            ...currentBasicData,
            templateType: value,
            baseTemplateType: templateTypeValue,
          },
          advancedOptions,
          notifications,
          followUpTasks,
          questions: getFormValues("questions") || [],
        });
        break;
      case COMPLETE_BASE_TEMPLATE_TYPE.grid:
        resetForm({
          templateType: templateTypeValue,
          basicData: {
            ...currentBasicData,
            templateType: value,
            baseTemplateType: templateTypeValue,
          },
          advancedOptions,
          notifications,
          followUpTasks,
          columns: getFormValues("columns") || [],
          questions: getFormValues("questions") || [],
        });
        break;
      case COMPLETE_BASE_TEMPLATE_TYPE.form:
        resetForm({
          templateType: templateTypeValue,
          basicData: {
            ...currentBasicData,
            templateType: value,
            baseTemplateType: templateTypeValue,
            attachment: [],
          },
          advancedOptions,
          notifications,
          followUpTasks,
        });
        break;
      case COMPLETE_BASE_TEMPLATE_TYPE.spreadsheet:
        resetForm({
          templateType: templateTypeValue,
          basicData: {
            ...currentBasicData,
            templateType: value,
            baseTemplateType: templateTypeValue,
            attachment: [],
          },
          advancedOptions,
          notifications,
          followUpTasks,
        });
        break;
      default:
        resetForm({
          templateType:
            TEMPLATE_TYPE.CHECKLIST.toLowerCase() as keyof typeof BASE_TEMPLATE_TYPE,
          basicData: {
            ...currentBasicData,
            templateType: value,
            baseTemplateType:
              TEMPLATE_TYPE.CHECKLIST.toLowerCase() as keyof typeof BASE_TEMPLATE_TYPE,
          },
          advancedOptions,
          notifications,
          followUpTasks,
          questions: getFormValues("questions") || [],
        });
        break;
    }
  };

  useEffect(() => {
    const data = taskTypeOptions?.data?.map((item: TaskTypeOptions) => ({
      label: item?.typeName,
      value: item?.typeName?.toLowerCase(),
      ...item,
    }));
    setTemplateTypeOptions(data);
  }, [taskTypeOptions]);

  useEffect(() => {
    if (directoriesList?.data && directoriesList.data[0].subLibrary) {
      setTemplateDirectory(directoriesList.data[0].subLibrary || []);
    }
  }, [directoriesList]);

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

  /**
   * @method buildDirectoryPath
   * @description Builds the nested directory path structure
   * @param {Array} directories - List of selected directories
   * @return {Object} Nested directory path object
   */
  const buildDirectoryPath = (
    directories: Array<{ libraryId: number; libraryName: string }>
  ): { libraryId?: number; subLibrary?: Record<string, unknown> } => {
    if (directories.length < 1) return {};

    const path: { libraryId?: number; subLibrary?: Record<string, unknown> } = {
      libraryId: directories[0].libraryId,
    };
    let currentLevel = path;

    for (let i = 1; i < directories.length; i++) {
      currentLevel.subLibrary = {
        libraryId: directories[i].libraryId,
      };
      currentLevel = currentLevel.subLibrary as {
        libraryId?: number;
        subLibrary?: Record<string, unknown>;
      };
    }

    return path;
  };

  /**
   * @method getSubLibraryOptions
   * @description Gets the sub-library options for a given directory ID
   * @param {number} parentLibraryId - Parent library ID
   * @return {Array} Array of sub-library options
   */
  const getSubLibraryOptions = (parentLibraryId: number) => {
    const findSubLibrary = (libraries: Array<unknown>): Array<unknown> => {
      for (const lib of libraries) {
        const libItem = lib as {
          libraryId: number;
          libraryName: string;
          subLibrary?: Array<unknown>;
        };
        if (libItem.libraryId === parentLibraryId) {
          return libItem.subLibrary || [];
        }
        if (libItem.subLibrary && libItem.subLibrary.length > 0) {
          const result = findSubLibrary(libItem.subLibrary);
          if (result.length > 0) return result;
        }
      }
      return [];
    };

    return findSubLibrary(templateDirectory);
  };

  /**
   * @method findDirectoryById
   * @description Recursively finds a directory by ID in the nested structure
   * @param {number} libraryId - Library ID to search for
   * @param {Array} libraries - List of libraries to search in
   * @return {Object|null} Found directory or null
   */
  const findDirectoryById = (
    libraryId: number,
    libraries: Array<unknown>
  ): {
    libraryId: number;
    libraryName: string;
    subLibrary?: Array<unknown>;
  } | null => {
    for (const lib of libraries) {
      const libItem = lib as {
        libraryId: number;
        libraryName: string;
        subLibrary?: Array<unknown>;
      };
      if (libItem.libraryId === libraryId) {
        return libItem;
      }
      if (libItem.subLibrary && libItem.subLibrary.length > 0) {
        const result = findDirectoryById(libraryId, libItem.subLibrary);
        if (result) return result;
      }
    }
    return null;
  };

  const handleDirectoryChange = (
    e: React.ChangeEvent<{ value: unknown }>,
    level: number
  ): void => {
    const selectedId = e.target.value as number;
    const updatedDirectories = selectedDirectories.slice(0, level);

    let searchIn = templateDirectory;
    for (let i = 0; i < level; i++) {
      const currentDir = findDirectoryById(
        selectedDirectories[i].libraryId,
        searchIn
      );
      if (currentDir?.subLibrary) {
        searchIn = currentDir.subLibrary;
      }
    }

    const selectedDir = findDirectoryById(selectedId, searchIn);

    if (selectedDir) {
      updatedDirectories.push({
        libraryId: selectedDir.libraryId,
        libraryName: selectedDir.libraryName,
      });

      const basicData = getFormValues("basicData");
      basicData.libraryId = selectedDir.libraryId;
      basicData.libraryStructure = buildDirectoryPath(updatedDirectories);
      resetForm({
        ...formState.defaultValues,
        basicData: {
          ...basicData,
        },
      });

      setSelectedDirectories(updatedDirectories);
    }
  };

  /**
   * @method handleTemplateTags
   * @description Handles changes in template tags selection and updates form values accordingly
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the tags multi-select component
   * @return {void}
   */
  const handleTemplateTags = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value as unknown as TemplateTagsProps[];
    const basicData = getFormValues("basicData");
    const arr = [];
    tagsArray.forEach((item) => {
      arr.push({
        tagId: item?.tagId,
        tagName: item?.tagName || item?.tagValue,
        attributeId: item?.attributeId || null,
        attributeName: item?.attributeName || item?.attributeValue || null,
      });
    });

    basicData.tags = JSON.parse(JSON.stringify(arr));
    resetForm({
      basicData,
    });
  };

  /**
   * @method renderDirectoryDropdown
   * @description Recursively renders directory dropdowns for nested levels
   * @param {number} level - Current nesting level
   * @param {number} parentLibraryId - Parent library ID
   * @return {React.ReactNode} Nested dropdown JSX
   */
  const renderDirectoryDropdown = (
    level: number,
    parentLibraryId: number | null = null
  ): React.ReactNode => {
    const options =
      level === 0
        ? generateDirectoryOptions(templateDirectory)
        : generateDirectoryOptions(getSubLibraryOptions(parentLibraryId || 0));

    if (level > 0 && options.length === 0) return null;

    const currentSelection = selectedDirectories[level];
    const hasSubLibrary = currentSelection
      ? getSubLibraryOptions(currentSelection.libraryId).length > 0
      : false;

    return (
      <>
        <Box
          key={`directory-level-${level}`}
          className="ct-basic-info__dropdown-row"
        >
          <CSelect
            value={currentSelection?.libraryId?.toString() || ""}
            options={options}
            placeholder={
              level === 0
                ? BASIC_INFO.directoryPlaceholder
                : BASIC_INFO.subDirectoryPlaceholder
            }
            optionValueKey="value"
            optionLabelKey="label"
            onChange={(e) => handleDirectoryChange(e, level)}
            templates={{
              inputValueTemplate: () => (
                <>{currentSelection?.libraryName || ""}</>
              ),
            }}
          />
          {hasSubLibrary && (
            <CSvgIcon
              component={ChevronRight}
              color="secondary"
              size={24}
            />
          )}
        </Box>
        {hasSubLibrary &&
          renderDirectoryDropdown(level + 1, currentSelection.libraryId)}
      </>
    );
  };

  /**
   * @method extractDirectoriesFromPath
   * @description Extracts directory array from nested path structure
   * @param {Object} path - Nested directory path structure
   * @return {Array} Flattened array of directories
   */
  const extractDirectoriesFromPath = (
    path: { libraryId?: number; subLibrary?: Record<string, unknown> } | null
  ): Array<{ libraryId: number; libraryName: string }> => {
    const directories: Array<{ libraryId: number; libraryName: string }> = [];

    const traverse = (
      current: {
        libraryId?: number;
        subLibrary?: Record<string, unknown>;
      } | null
    ): void => {
      if (!current || !current.libraryId) return;

      const directory = findDirectoryById(current.libraryId, templateDirectory);
      if (directory) {
        directories.push({
          libraryId: directory.libraryId,
          libraryName: directory.libraryName,
        });
      }

      if (current.subLibrary && Object.keys(current.subLibrary).length > 0) {
        traverse(
          current.subLibrary as {
            libraryId?: number;
            subLibrary?: Record<string, unknown>;
          }
        );
      }
    };

    traverse(path);
    return directories;
  };

  /**
   * @method initializeDirectoriesFromForm
   * @description Initializes selected directories from form data on component mount or when form data changes
   * @return {void}
   */
  useEffect(() => {
    const libraryStructure = getFormValues("basicData.libraryStructure");
    if (
      libraryStructure &&
      Object.keys(libraryStructure).length > 0 &&
      selectedDirectories.length === 0
    ) {
      const extractedDirectories = extractDirectoriesFromPath(libraryStructure);
      if (extractedDirectories.length > 0) {
        setSelectedDirectories(extractedDirectories);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateDirectory]);

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
          <Controller
            name="basicData.tags"
            control={control}
            render={({ field }) => {
              return (
                <TagSelector
                  label={BASIC_INFO.tags}
                  placeholder={BASIC_INFO.tagsPlaceholder}
                  value={(field.value as TemplateTagsProps[]) || []}
                  onChange={handleTemplateTags}
                  onDelete={handleTagsDelete}
                  className={clsx({
                    "ct-basic-info__row-item-tags-dropdown": true,
                    "ct-basic-info__row-item-tags-dropdown--desktop": isDesktop,
                  })}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: 200 }}
                  menuWidth={"300px"}
                  menuHeight={"220px"}
                />
              );
            }}
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
          <div className="ct-basic-info__directory-dropdown-wrapper">
            {renderDirectoryDropdown(0)}
          </div>
          {formErrors?.basicData?.libraryId && (
            <div className="ct-basic-info__error-text">
              {formErrors?.basicData?.libraryId?.message as string}
            </div>
          )}
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
