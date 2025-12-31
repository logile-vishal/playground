import { Typography } from "@mui/material";

import CModal, { ModalBody } from "@/core/components/modal/Modal";
import { MODAL_SIZE } from "@/core/constants/modal-constants";
import { BUTTON_SEVERITY } from "@/core/constants/button-constant";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";

/**
 * Delete Section Modal component
 *
 * CSS Class Prefix Legend:
 * - cr-tpl: Create Template (cr = create, tpl = template)
 *
 * @component
 */

const DeleteSectionModal = ({ open = false, onClose = () => {} }) => {
  const { QUESTIONS } = useCreateTemplateTranslations();
  return (
    <div>
      <CModal
        open={open}
        onClose={onClose}
        confirmText={QUESTIONS.DELETE_SECTION_MODAL.confirmText}
        size={MODAL_SIZE.MEDIUM}
        severity={BUTTON_SEVERITY.destructive}
        title={QUESTIONS.DELETE_SECTION_MODAL.title}
      >
        <ModalBody>
          <Typography>{QUESTIONS.DELETE_SECTION_MODAL.description}</Typography>
        </ModalBody>
      </CModal>
    </div>
  );
};

export default DeleteSectionModal;
