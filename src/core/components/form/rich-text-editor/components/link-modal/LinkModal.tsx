import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import { CButton } from "@/core/components/button/button";
import CModal, { ModalBody, ModalFooter } from "@/core/components/modal/Modal";
import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
import CTextfield from "@/core/components/form/textfield/Textfield";
import { useWalkmeId } from "@/core/hooks/useWalkmeId";

type LinkModalProps = {
  data: { text: string; link: string };
  showLinkModal: boolean;
  handleLinkClose: () => void;
  handleLinkSubmit: (text: string, link: string) => void;
  walkMeIdPrefix?: string[];
};

/**
 * @component LinkModal
 * @description Modal component for link insertion in rich text editor
 * @param {LinkModalProps} props - Component props containing link data and handlers
 * @return {React.ReactNode} LinkModal JSX element
 */
const LinkModal: React.FC<LinkModalProps> = ({
  data,
  showLinkModal,
  handleLinkClose,
  handleLinkSubmit,
  walkMeIdPrefix = [],
}) => {
  const { EDITOR_LINK_UPLOAD } = useCommonTranslation();
  const { generateId } = useWalkmeId();

  const [linkData, setLinkData] = useState({
    text: data.text || "",
    link: data.link || "",
  });

  useEffect(() => {
    if (data?.text || data?.link) {
      setLinkData({
        text: data.text || "",
        link: data.link || "",
      });
    }
  }, [data]);

  /**
   * @method handleLinkDelete
   * @description Clears the link field value
   * @return {void}
   */
  const handleLinkDelete = () => {
    setLinkData((prev) => ({ ...prev, link: "" }));
  };

  /**
   * @method handleLinkModalClose
   * @description Closes the link modal and resets link data
   * @return {void}
   */
  const handleLinkModalClose = () => {
    setLinkData({ text: "", link: "" });
    handleLinkClose();
  };

  /**
   * @method handleLinkChange
   * @description Handles link input field change event
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   * @return {void}
   */
  const handleLinkChange = (e) => {
    setLinkData((prev) => ({ ...prev, link: e.target.value }));
  };

  /**
   * @method handleTextChange
   * @description Handles text input field change event
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   * @return {void}
   */
  const handleTextChange = (e) => {
    setLinkData((prev) => ({ ...prev, text: e.target.value }));
  };

  return (
    <CModal
      open={showLinkModal}
      onClose={handleLinkModalClose}
      title={
        linkData.link ? EDITOR_LINK_UPLOAD.editTitle : EDITOR_LINK_UPLOAD.title
      }
      size="medium"
      onConfirm={() => {
        const text = linkData.text;
        const link = linkData.link;
        handleLinkSubmit(text, link);
      }}
      disablePrimaryAction={true}
      confirmText={EDITOR_LINK_UPLOAD.submitBtn}
    >
      <ModalBody>
        <Box className="ql-link-modal">
          <CTextfield
            label={EDITOR_LINK_UPLOAD.text}
            value={linkData.text}
            onChange={handleTextChange}
            placeholder={EDITOR_LINK_UPLOAD.placeholder}
          />
          <CTextfield
            label={EDITOR_LINK_UPLOAD.link}
            value={linkData.link}
            onChange={handleLinkChange}
            placeholder={EDITOR_LINK_UPLOAD.placeholder}
          />
        </Box>
      </ModalBody>

      <ModalFooter>
        <CButton
          onClick={handleLinkModalClose}
          variant="outline"
          severity="secondary"
          data-walkme-id={generateId([
            ...walkMeIdPrefix,
            "rich text editor",
            "toolbar",
            "link modal",
            "cancel button",
          ])}
        >
          {EDITOR_LINK_UPLOAD.cancelBtn}
        </CButton>

        {linkData.link && (
          <CButton
            onClick={handleLinkDelete}
            severity="destructive"
            disabled={!linkData.link}
            data-walkme-id={generateId([
              ...walkMeIdPrefix,
              "rich text editor",
              "toolbar",
              "link modal",
              "remove link button",
            ])}
          >
            {EDITOR_LINK_UPLOAD.removeLinkBtn}
          </CButton>
        )}
        <CButton
          onClick={() => handleLinkSubmit(linkData.text, linkData.link)}
          severity="primary"
          disabled={!linkData.link}
          data-walkme-id={generateId([
            ...walkMeIdPrefix,
            "rich text editor",
            "toolbar",
            "link modal",
            "submit button",
          ])}
        >
          {EDITOR_LINK_UPLOAD.submitBtn}
        </CButton>
      </ModalFooter>
    </CModal>
  );
};

export default LinkModal;
