import { Typography } from "@mui/material";

import CModal, { ModalBody } from "@/core/components/modal/Modal";
import { MODAL_SIZE } from "@/core/constants/modal-constants";
import { DELETE_SECTION_MODAL } from "@/pages/create-template/constants/questions";
import { BUTTON_SEVERITY } from "@/core/constants/button-constant";

/**
 * Delete Section Modal component
 *
 * CSS Class Prefix Legend:
 * - cr-tpl: Create Template (cr = create, tpl = template)
 *
 * @component
 */

const DeleteSectionModal = ({ open = false, onClose = () => {} }) => {
  return (
    <div>
      <CModal
        open={open}
        onClose={onClose}
        confirmText={DELETE_SECTION_MODAL.CONFIRM_TEXT}
        size={MODAL_SIZE.MEDIUM}
        severity={BUTTON_SEVERITY.destructive}
        title={DELETE_SECTION_MODAL.TITLE}
      >
        <ModalBody>
          <Typography>{DELETE_SECTION_MODAL.DESCRIPTION}</Typography>
        </ModalBody>
      </CModal>
    </div>
  );
};

export default DeleteSectionModal;
