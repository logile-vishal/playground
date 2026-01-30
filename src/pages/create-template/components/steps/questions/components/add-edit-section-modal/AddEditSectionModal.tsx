import { useEffect, useState } from "react";

import { isNonEmptyValue } from "@/utils/index";
import CModal, { ModalBody } from "@/core/components/modal/Modal";
import CTextfield from "@/core/components/form/textfield/Textfield";
import { MODAL_SIZE } from "@/core/constants/modal-constants";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
import useQuestionListManager from "@/pages/create-template/hooks/useQuestionListManager";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
/**
 * Modal component for adding and editing sections in the template
 *
 * CSS Class Prefix Legend:
 * - cr-tpl: Create Template (cr = create, tpl = template)
 *
 * @component
 */

type TypeProps = {
  TITLE: string;
  PRIMARY_ACTION: string;
};
type SectionModalProps = {
  open: boolean;
  onClose: () => void;
  type: TypeProps;
  toggleExpand: (qId: string) => void;
};

const AddEditSectionModal: React.FC<SectionModalProps> = ({
  open = false,
  onClose = () => {},
  type = {} as TypeProps,
  toggleExpand,
}) => {
  const [sectionName, setSectionName] = useState<string | null>(null);
  const { QUESTIONS } = useCreateTemplateTranslations();
  const { EDITOR_ERROR } = useCommonTranslation();
  const { addNewSection } = useQuestionListManager();
  const isError = sectionName === null ? false : !isNonEmptyValue(sectionName);
  const { TITLE, PRIMARY_ACTION } = type;

  const handleSectionName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSectionName(e.target.value);
  };

  const handleAddSection = () => {
    if (!isNonEmptyValue(sectionName)) return;
    const qId = addNewSection(sectionName);
    onClose();
    toggleExpand(qId);
  };

  useEffect(() => {
    if (!open) {
      setSectionName(null);
    }
  }, [open]);

  return (
    <div>
      <CModal
        open={open}
        onClose={onClose}
        confirmText={PRIMARY_ACTION}
        size={MODAL_SIZE.MEDIUM}
        title={TITLE}
        onConfirm={handleAddSection}
      >
        <ModalBody>
          <CTextfield
            label={QUESTIONS.SECTION_ADD_EDIT_MODAL.FIELDS.sectionName}
            required
            onChange={handleSectionName}
            value={sectionName || ""}
            error={isError}
            helperText={isError ? EDITOR_ERROR.REQUIRED_FIELD : ""}
          />
        </ModalBody>
      </CModal>
    </div>
  );
};

export default AddEditSectionModal;
