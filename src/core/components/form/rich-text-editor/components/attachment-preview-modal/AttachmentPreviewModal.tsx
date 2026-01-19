import { Box } from "@mui/material";

import CModal, { ModalBody } from "@/core/components/modal/Modal";

import "./AttachmentPreviewModal.scss";

const AttachmentPreviewModal = ({ attachmentPreviewModal, onClose }) => {
  const renderAttachmentPreview = () => {
    if (!attachmentPreviewModal?.file) return null;

    const file = attachmentPreviewModal.file;
    const fileURL = URL.createObjectURL(file);
    return (
      <Box className="ql-preview-modal__image-wrapper">
        <img
          src={fileURL}
          alt={file.name}
        />
      </Box>
    );
  };

  return (
    <CModal
      open={attachmentPreviewModal.show}
      onClose={onClose}
      title={attachmentPreviewModal.file?.name ?? null}
      showActions={false}
      size="large"
    >
      <ModalBody containerClassName="ql-preview-modal__body">
        <Box className="ql-attachment-modal">
          {!attachmentPreviewModal?.file ? null : renderAttachmentPreview()}
        </Box>
      </ModalBody>
    </CModal>
  );
};

export default AttachmentPreviewModal;
