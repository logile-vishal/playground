import { useState, type FC } from "react";
import ReactQuill from "react-quill-new";

import {
  Attachment,
  CurlyBracket,
  EditorBold,
  EditorClearFormat,
  EditorItalic,
  EditorLink,
  EditorUnderline,
} from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";

import { useCommonTranslation } from "@/core/translation/useCommonTranslation";
import CIconButton from "@/core/components/button/IconButton";
import CAttachmentModal from "@/core/components/attachment-modal/AttachmentModal";

import "./RichTextEditor.scss";
import LinkModal from "./components/link-modal/LinkModal";

export type ToolbarProps = {
  quillRef: React.RefObject<ReactQuill>;
  attachments?: File[];
  onUpdateAttachments?: (files: File[]) => void;
  onVariableButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  walkMeIdPrefix?: string[];
};

/**
 * @component Toolbar
 * @description Reusable toolbar component for text formatting and variable insertion
 * @param {ToolbarProps} props - Component props
 * @return {React.ReactNode} Toolbar JSX element
 */
const Toolbar: FC<ToolbarProps> = ({
  quillRef,
  attachments,
  onUpdateAttachments = () => {},
  onVariableButtonClick,
  walkMeIdPrefix = [],
}) => {
  const { EDITOR_TOOLBAR } = useCommonTranslation();
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState({
    status: false,
    text: null,
    link: null,
    selection: null,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);

  /**
   * @method handleBold
   * @description Applies bold formatting to selected text
   * @return {void}
   */
  const handleBold = () => {
    if (!quillRef.current) return;
    const editor = quillRef.current.getEditor();
    const format = editor.getFormat();
    editor.format("bold", !format.bold);
  };

  /**
   * @method handleItalic
   * @description Applies italic formatting to selected text
   * @return {void}
   */
  const handleItalic = () => {
    if (!quillRef.current) return;
    const editor = quillRef.current.getEditor();
    const format = editor.getFormat();
    editor.format("italic", !format.italic);
  };

  /**
   * @method handleUnderline
   * @description Applies underline formatting to selected text
   * @return {void}
   */
  const handleUnderline = () => {
    if (!quillRef.current) return;
    const editor = quillRef.current.getEditor();
    const format = editor.getFormat();
    editor.format("underline", !format.underline);
  };

  /**
   * @method handleLink
   * @description Opens link insertion modal with selected text and existing link if any
   * Gets the current selection, retrieves text and existing link format, then opens the link modal
   * @return {void}
   */
  const handleLink = () => {
    if (!quillRef.current) return;
    const editor = quillRef.current.getEditor();
    const selection = editor.getSelection();
    const editorText = editor.getText(selection?.index, selection?.length);
    const editorLink = editor.getFormat(
      selection?.index,
      selection?.length
    ).link;
    if (!selection || selection.length === 0) {
      return;
    }
    setShowLinkModal({
      status: true,
      text: editorText,
      link: editorLink,
      selection,
    });
  };

  /**
   * @method handleLinkSubmit
   * @description Applies link format to selected text in the editor
   * Deletes the original selected text and inserts new text with the specified link format
   * @param {string} text - The text to display for the link
   * @param {string} link - The URL to attach to the link
   * @return {void}
   */
  const handleLinkSubmit = (text: string, link: string) => {
    if (!quillRef.current) return;
    const editor = quillRef.current.getEditor();
    const selection = showLinkModal.selection;

    // Apply link format to selected text
    editor.deleteText(selection.index, selection.length);
    editor.insertText(selection.index, text, "link", link);
    setShowLinkModal({
      status: false,
      text: null,
      link: null,
      selection: null,
    });
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
  const handleAttachmentSubmit = () => {
    if (selectedFiles) {
      onUpdateAttachments([...attachments, ...selectedFiles]);
      handleAttachmentClose();
    }
  };

  /**
   * @method handleClearFormat
   * @description Clears all formatting from selected text while preserving wildcard blots
   * @return {void}
   */
  const handleClearFormat = () => {
    if (!quillRef.current) return;
    const editor = quillRef.current.getEditor();
    const selection = editor.getSelection();

    if (!selection || selection.length === 0) {
      return;
    }

    const contents = editor.getContents(selection.index, selection.length);
    let currentPos = selection.index;

    // Process each operation and clear formatting
    (contents.ops || []).forEach((op) => {
      const isWildcard =
        typeof op.insert === "object" &&
        op.insert !== null &&
        "wildcard" in op.insert;

      if (typeof op.insert === "string") {
        // Remove formatting from text
        if (op.insert.length > 0) {
          editor.removeFormat(currentPos, op.insert.length);
        }
        currentPos += op.insert.length;
      } else if (isWildcard) {
        // For wildcards, remove all formatting by clearing attributes
        editor.formatText(currentPos, 1, "bold", false);
        editor.formatText(currentPos, 1, "italic", false);
        editor.formatText(currentPos, 1, "underline", false);
        editor.formatText(currentPos, 1, "link", false);
        currentPos += 1;
      } else {
        // Skip other embeds
        currentPos += 1;
      }
    });

    // Restore original selection
    editor.setSelection(selection.index, selection.length);
  };

  return (
    <>
      <div
        id="toolbar"
        className="ql-toolbar ql-snow"
      >
        <CIconButton
          size="small"
          onClick={handleBold}
          title={EDITOR_TOOLBAR.bold}
          walkMeId={[...walkMeIdPrefix, "rich text editor", "bold button"]}
        >
          <CSvgIcon component={EditorBold} />
        </CIconButton>
        <CIconButton
          size="small"
          onClick={handleItalic}
          title={EDITOR_TOOLBAR.italic}
          walkMeId={[...walkMeIdPrefix, "rich text editor", "italic button"]}
        >
          <CSvgIcon component={EditorItalic} />
        </CIconButton>
        <CIconButton
          size="small"
          onClick={handleUnderline}
          title={EDITOR_TOOLBAR.underline}
          walkMeId={[...walkMeIdPrefix, "rich text editor", "underline button"]}
        >
          <CSvgIcon component={EditorUnderline} />
        </CIconButton>
        <CIconButton
          size="small"
          onClick={handleLink}
          title={EDITOR_TOOLBAR.link}
          walkMeId={[...walkMeIdPrefix, "rich text editor", "link button"]}
        >
          <CSvgIcon component={EditorLink} />
        </CIconButton>
        <CIconButton
          size="small"
          onClick={handleAttachment}
          title={EDITOR_TOOLBAR.attachment}
          walkMeId={[
            ...walkMeIdPrefix,
            "rich text editor",
            "attachment button",
          ]}
        >
          <CSvgIcon component={Attachment} />
        </CIconButton>
        <CIconButton
          size="small"
          onClick={handleClearFormat}
          title={EDITOR_TOOLBAR.clearFormat}
          walkMeId={[
            ...walkMeIdPrefix,
            "rich text editor",
            "clear format button",
          ]}
        >
          <CSvgIcon component={EditorClearFormat} />
        </CIconButton>
        <CIconButton
          size="small"
          onClick={onVariableButtonClick}
          title={EDITOR_TOOLBAR.wildcard}
          walkMeId={[...walkMeIdPrefix, "rich text editor", "wildcard button"]}
        >
          <CSvgIcon component={CurlyBracket} />
        </CIconButton>
      </div>
      <CAttachmentModal
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        showAttachmentModal={showAttachmentModal}
        handleAttachmentClose={handleAttachmentClose}
        handleAttachmentSubmit={handleAttachmentSubmit}
        walkMeIdPrefix={walkMeIdPrefix}
      />
      <LinkModal
        showLinkModal={showLinkModal.status}
        data={showLinkModal}
        handleLinkClose={() =>
          setShowLinkModal({
            status: false,
            text: null,
            link: null,
            selection: null,
          })
        }
        handleLinkSubmit={handleLinkSubmit}
        walkMeIdPrefix={walkMeIdPrefix}
      />
    </>
  );
};

export default Toolbar;
