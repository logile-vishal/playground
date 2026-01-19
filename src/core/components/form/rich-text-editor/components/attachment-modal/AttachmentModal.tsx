import { Box } from "@mui/material";

import clsx from "@/utils/clsx";
import CSvgIcon from "@/core/components/icon/Icon";
import CModal from "@/core/components/modal/Modal";
import { Photo, Delete } from "@/core/constants/icons";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
import CTextfield from "@/core/components/form/textfield/Textfield";

import "./AttachmentModal.scss";

type AttachmentModalProps = {
  selectedFiles: File[] | null;
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  showAttachmentModal: boolean;
  handleAttachmentClose: () => void;
  handleAttachmentSubmit: () => void;
  walkMeIdPrefix?: string[];
};

/**
 * @component AttachmentModal
 * @description Modal component for file attachment in rich text editor
 * @param {AttachmentModalProps} props - Component props
 * @return {React.ReactNode} AttachmentModal JSX element
 */
const AttachmentModal: React.FC<AttachmentModalProps> = ({
  showAttachmentModal,
  selectedFiles,
  setSelectedFiles,
  handleAttachmentClose,
  handleAttachmentSubmit,
  walkMeIdPrefix = [],
}) => {
  const { EDITOR_FILE_UPLOAD } = useCommonTranslation();

  /**
   * @method handleFileSelect
   * @description Handles file selection in modal
   * @param {React.ChangeEvent<HTMLInputElement>} event - File input change event
   * @return {void}
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFiles([file]);
  };

  /**
   * @method handleFileDelete
   * @description Handles file deletion from selected files
   * @param {number} index - Index of file to delete
   * @return {void}
   */
  const handleFileDelete = (index: number) => {
    if (!selectedFiles) return;
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles.length > 0 ? updatedFiles : null);
  };

  const renderAttachmentPlaceholder = () => {
    return (
      <>
        {/* TODO: Label code will be revamped and moved to core Textfield component */}
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
          acceptFileFormats="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        />
      </>
    );
  };

  const renderAttachmentGallery = () => {
    return (
      <Box
        className={clsx({
          "ql-attachment-modal-label-wrapper": true,
          "ql-attachment-modal-gallery-wrapper": true,
        })}
      >
        {selectedFiles &&
          selectedFiles.map((file, index) => {
            return (
              <Box
                className="ql-attachment-modal-picture-wrapper"
                key={index}
              >
                <img src={URL.createObjectURL(file)} />
                <Box className="ql-attachment-modal-action-wrapper">
                  <Box
                    onClick={() => handleFileDelete(index)}
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
          })}
      </Box>
    );
  };

  return (
    <CModal
      open={showAttachmentModal}
      onClose={handleAttachmentClose}
      title={EDITOR_FILE_UPLOAD.title}
      size="medium"
      walkMeIdPrefix={[
        ...walkMeIdPrefix,
        "rich text editor",
        "toolbar",
        "attachment modal",
      ]}
      onConfirm={handleAttachmentSubmit}
      disablePrimaryAction={!selectedFiles || selectedFiles.length === 0}
    >
      <Box className="ql-attachment-modal">
        {!selectedFiles || selectedFiles.length === 0
          ? renderAttachmentPlaceholder()
          : renderAttachmentGallery()}
      </Box>
    </CModal>
  );
};

export default AttachmentModal;
