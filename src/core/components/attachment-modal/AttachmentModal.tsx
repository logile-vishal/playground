import { Box } from "@mui/material";

import clsx from "@/utils/clsx";
import CSvgIcon from "@/core/components/icon/Icon";
import CModal from "@/core/components/modal/Modal";
import { Photo, Delete } from "@/core/constants/icons";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
import CTextfield from "@/core/components/form/textfield/Textfield";
import CIconButton from "@/core/components/button/IconButton";
import { useFileProcessor } from "@/core/hooks/useFileProcessor";
import { useFileIcon } from "@/core/hooks/useFileIcon";
import { FILE_CATEGORY, FILE_TYPES } from "@/core/constants/modal-constants";
import type {
  AttachmentModalProps,
  RenderAttachmentGalleryProps,
  RenderPdfGalleryProps,
} from "@/core/types/rich-text-editor.type";

import "./AttachmentModal.scss";

/**
 * @component AttachmentGalleryItem
 * @description Renders image attachment preview
 * @param {RenderAttachmentGalleryProps} props - Component props
 * @return {React.ReactNode} Image gallery item
 */
const AttachmentGalleryItem: React.FC<RenderAttachmentGalleryProps> = ({
  file,
  index,
  onDelete,
}): React.ReactNode => {
  return (
    <Box
      className="ql-attachment-modal-picture-wrapper"
      key={index}
    >
      <img
        src={URL.createObjectURL(file.file)}
        alt={file.file.name}
      />
      <Box className="ql-attachment-modal-action-wrapper">
        <Box
          onClick={() => onDelete(index)}
          className="ql-attachment-modal-delete-icon"
        >
          <CSvgIcon
            size={20}
            color="white"
            component={Delete}
          />
        </Box>
      </Box>
    </Box>
  );
};

/**
 * @component DocumentGalleryItem
 * @description Renders document attachment preview with appropriate icon
 * @param {RenderPdfGalleryProps} props - Component props
 * @return {React.ReactNode} Document gallery item
 */
const DocumentGalleryItem: React.FC<RenderPdfGalleryProps> = ({
  files,
  index,
  onDelete,
}): React.ReactNode => {
  const { file } = files;
  const { icon: fileIcon, color: fileIconColor } = useFileIcon(file.name);

  return (
    <Box
      className="ql-attachment-modal-pdf-wrapper"
      key={index}
    >
      <CSvgIcon
        size={24}
        color={fileIconColor}
        component={fileIcon}
      />
      <Box className="ql-attachment-modal-pdf-wrapper-file">
        <Box className="ql-attachment-modal-pdf-wrapper-file-text">
          {file?.name}
        </Box>
        <Box className="ql-attachment-modal-pdf-wrapper-file-size">
          <Box>{(file?.size / (1024 * 1024)).toFixed(2)} MB</Box>
          <CIconButton onClick={() => onDelete(index)}>
            <CSvgIcon
              size={18}
              color="violation"
              component={Delete}
            />
          </CIconButton>
        </Box>
      </Box>
    </Box>
  );
};

/**
 * @component AttachmentModal
 * @description Modal component for file attachment in rich text editor
 * @param {AttachmentModalProps} props - Component props
 * @return {React.ReactNode} AttachmentModal JSX element
 */
export const CAttachmentModal: React.FC<AttachmentModalProps> = ({
  showAttachmentModal,
  selectedFiles,
  setSelectedFiles,
  handleAttachmentClose,
  handleAttachmentSubmit,
  walkMeIdPrefix = [],
  size = "medium",
  title,
  acceptFileFormats,
  confirmBtnText,
}) => {
  const { EDITOR_FILE_UPLOAD } = useCommonTranslation();
  const { processedFiles } = useFileProcessor(selectedFiles);

  /**
   * @method handleFileSelect
   * @description Handles file selection in modal
   * @param {React.ChangeEvent<HTMLInputElement>} event - File input change event
   * @return {void}
   */
  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const files = event.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    setSelectedFiles((prevFiles) =>
      prevFiles ? [...prevFiles, ...newFiles] : newFiles
    );
  };

  /**
   * @method handleFileDelete
   * @description Handles file deletion from selected files
   * @param {number} index - Index of file to delete
   * @return {void}
   */
  const handleFileDelete = (index: number): void => {
    if (!selectedFiles) return;
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles.length > 0 ? updatedFiles : null);
  };

  const renderAttachmentPlaceholder = (): React.ReactNode => {
    return (
      <>
        <label
          className="ql-attachment-modal-label-wrapper"
          htmlFor="attachment-input"
        >
          <Box>
            <CSvgIcon
              size={34}
              color="secondary"
              component={Photo}
            />
          </Box>
          <Box className="ql-attachment-modal--text">
            {EDITOR_FILE_UPLOAD.text}
          </Box>
        </label>
        <CTextfield
          type="file"
          className="ql-attachment-modal-hidden-input"
          onChange={handleFileSelect}
          id="attachment-input"
          allowMultipleFileUpload={true}
          acceptFileFormats={acceptFileFormats || FILE_TYPES}
        />
      </>
    );
  };

  return (
    <CModal
      open={showAttachmentModal}
      onClose={handleAttachmentClose}
      title={title || EDITOR_FILE_UPLOAD.title}
      size={size}
      walkMeIdPrefix={[
        ...walkMeIdPrefix,
        "rich text editor",
        "toolbar",
        "attachment modal",
      ]}
      onConfirm={() => handleAttachmentSubmit(processedFiles)}
      confirmText={confirmBtnText}
      disablePrimaryAction={!selectedFiles || selectedFiles.length === 0}
    >
      <Box className="ql-attachment-modal">
        {!selectedFiles || selectedFiles.length === 0 ? (
          renderAttachmentPlaceholder()
        ) : (
          <Box
            className={clsx({
              "ql-attachment-modal-label-wrapper": true,
              "ql-attachment-modal-gallery-wrapper": true,
            })}
          >
            {processedFiles.length > 0 &&
              processedFiles.map((file, index) =>
                file.category === FILE_CATEGORY.IMAGE ? (
                  <AttachmentGalleryItem
                    key={`image-${index}`}
                    file={file}
                    index={index}
                    onDelete={handleFileDelete}
                  />
                ) : (
                  <DocumentGalleryItem
                    key={`doc-${index}`}
                    files={file}
                    index={index}
                    onDelete={handleFileDelete}
                  />
                )
              )}
          </Box>
        )}
      </Box>
    </CModal>
  );
};

export default CAttachmentModal;
