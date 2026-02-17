import CModal, { ModalBody } from "@/core/components/modal/Modal";
import { BUTTON_SEVERITY } from "@/core/constants/button-constant";
import { MODAL_SIZE } from "@/core/constants/modal-constants";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import { Box } from "@mui/material";

type DeleteQuestionModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const DeleteQuestionModal = ({
  open,
  onClose,
  onConfirm,
}: DeleteQuestionModalProps) => {
  const { QUESTIONS } = useCreateTemplateTranslations();

  return (
    <CModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={QUESTIONS.DELETE_QUESTION_REORDERING_MODAL.title}
      confirmText={QUESTIONS.DELETE_QUESTION_REORDERING_MODAL.confirmText}
      size={MODAL_SIZE.MEDIUM}
      severity={BUTTON_SEVERITY.destructive}
      walkMeIdPrefix={["delete", "question", "modal"]}
    >
      <ModalBody>
        <Box className="template-delete__modal-body">
          {QUESTIONS.DELETE_QUESTION_REORDERING_MODAL.description}
        </Box>
      </ModalBody>
    </CModal>
  );
};
