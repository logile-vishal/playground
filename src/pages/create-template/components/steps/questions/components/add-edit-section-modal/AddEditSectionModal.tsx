import CModal, { ModalBody } from "@/core/components/modal/Modal";
import CTextfield from "@/core/components/form/textfield/Textfield";
import { MODAL_SIZE } from "@/core/constants/modal-constants";
import { useCreateTemplateTranslations } from "@/pages/create-template/translation/useCreateTemplateTranslations";
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
};

const AddEditSectionModal: React.FC<SectionModalProps> = ({
  open = false,
  onClose = () => {},
  type = {} as TypeProps,
}) => {
  const { QUESTIONS } = useCreateTemplateTranslations();
  const { TITLE, PRIMARY_ACTION } = type;
  return (
    <div>
      <CModal
        open={open}
        onClose={onClose}
        confirmText={PRIMARY_ACTION}
        size={MODAL_SIZE.MEDIUM}
        title={TITLE}
      >
        <ModalBody>
          <CTextfield
            label={QUESTIONS.SECTION_ADD_EDIT_MODAL.FIELDS.sectionName}
            required
          />
        </ModalBody>
      </CModal>
    </div>
  );
};

export default AddEditSectionModal;
