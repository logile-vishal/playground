import { useRef, useEffect, type FC, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Box } from "@mui/material";

import CSvgIcon from "@/core/components/icon/Icon";
import { Delete, Eye, Preview } from "@/core/constants/icons";
import type { RichTextEditorProps } from "@/core/components/form/types/rich-text-editor.type";
import { WILDCARD_LIST } from "@/core/constants/wildcard-list";
import clsx from "@/utils/clsx";

import useWildcardVariableManager from "./WildcardVariableManager";
import { WILD_CARD_MAP } from "./wildcardLabel";
import Toolbar from "./Toolbar";
import "./RichTextEditor.scss";
import AttachmentPreviewModal from "./components/attachment-preview-modal/AttachmentPreviewModal";

const CRichTextEditor: FC<RichTextEditorProps> = ({
  value = "",
  onChange,
  placeholder,
  nestedProps,
  variables: customVariables,
  onVariableInserted,
  error,
  name,
  helperText,
  attachments = [],
  onUpdateAttachments = () => {},
  walkMeIdPrefix = [],
  label,
  required,
  isInlineLabel,
}) => {
  const [attachmentPreviewModal, setAttachmentPreviewModal] = useState({
    show: false,
    file: null as File | null,
  });
  const [isUserInput, setIsUserInput] = useState(false);
  /**
   * @method CRichTextEditor
   * @description Rich text editor with custom toolbar, formatting tools, and wildcard variable support
   * @param {Object} props - Component props
   * @param {string} [props.value] - Editor content value
   * @param {Function} props.onChange - Callback when editor content changes
   * @param {Array} [props.variables] - Custom wildcard variables to display in dropdown
   * @param {Function} [props.onVariableInserted] - Callback when a variable is inserted
   * @return {React.ReactNode} Editor container JSX element
   */
  const quillRef = useRef<ReactQuill>(null);

  // Use custom variables if provided, otherwise use default
  const VARIABLES_OPTIONS = customVariables || WILDCARD_LIST;

  // Initialize wildcard variable manager hook
  const {
    handleTextChange: handleWildcardTextChange,
    preventCursorInWildcard,
    renderVariableDropdown,
    showDropdown,
    setShowDropdown,
    setVariableAnchorEl,
    getEditorModules,
  } = useWildcardVariableManager({
    quillRef,
    variables: VARIABLES_OPTIONS,
    nestedMenuProps: nestedProps,
    onVariableInserted,
  });

  // Initialize cursor prevention when editor is ready
  useEffect(() => {
    // Call preventCursorInWildcard which will internally validate editor readiness
    preventCursorInWildcard();
  }, [preventCursorInWildcard]);

  // Process initial content and existing wildcards on mount
  useEffect(() => {
    if (!quillRef.current || !value) return;

    const timer = setTimeout(() => {
      try {
        // Only process if editor has the initial value
        const editor = quillRef.current?.getEditor();
        if (!editor) return;

        const contents = editor.getContents();
        // Check if content has any plain text that might be wildcards
        const hasPlainText = contents.ops.some(
          (op) => typeof op.insert === "string" && op.insert.trim().length > 0
        );

        if (hasPlainText) {
          // Save current scroll position
          const scrollTop = window.scrollY;
          const editorScrollTop =
            editor.container.parentElement?.scrollTop || 0;

          // Trigger wildcard detection on initial content
          handleWildcardTextChange();

          // Move cursor to the end after wildcard replacement
          const finalContents = editor.getContents();
          let endPosition = 0;
          for (const op of finalContents.ops) {
            if (typeof op.insert === "string") {
              endPosition += op.insert.length;
            } else {
              // Embed blots (like wildcards) count as 1 character
              endPosition += 1;
            }
          }

          // Set selection to the end without scrolling
          setTimeout(() => {
            editor.setSelection(endPosition, 0, "silent");
            // Restore scroll position
            window.scrollTo(0, scrollTop);
            if (editor.container.parentElement) {
              editor.container.parentElement.scrollTop = editorScrollTop;
            }
          }, 0);
        }
      } catch {
        throw new Error("Error processing initial editor content");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [value, handleWildcardTextChange]);

  /**
   * @method handleEditorChange
   * @description Handles editor content changes and triggers wildcard detection
   * @param {string} content - The editor content
   * @return {void}
   */
  const handleEditorChange = (
    content: string,
    _delta: unknown,
    source: string
  ) => {
    // Only call onChange if the change is from user
    if (source === "user") {
      setIsUserInput(true);
    }
    if (!isUserInput && source !== "user") return;
    // Process wildcard patterns
    handleWildcardTextChange();

    // Replace label text with wildcard values for backend
    let contentWithWildCardValue = content;
    WILD_CARD_MAP.forEach((label, wildcard) => {
      contentWithWildCardValue = contentWithWildCardValue.replaceAll(
        `>${label}</`,
        `>${wildcard}</`
      );
    });

    // Call user's onChange callback
    if (typeof onChange === "function") {
      const syntheticEvent = {
        target: {
          name,
          value: contentWithWildCardValue,
        },
      };
      onChange(syntheticEvent as React.ChangeEvent<HTMLTextAreaElement>);
    }
  };

  /**
   * @method handleVariableButtonClick
   * @description Toggles variable dropdown menu on button click
   * @param {React.MouseEvent<HTMLButtonElement>} event - Click event
   * @return {void}
   */
  const handleVariableButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event?.stopPropagation();
    event?.preventDefault();
    setVariableAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

  const handleFileDelete = (index: number) => {
    if (!attachments) return;
    const updatedFiles = attachments.filter((_, i) => i !== index);
    onUpdateAttachments(updatedFiles);
  };

  const closePreviewModal = () => {
    setAttachmentPreviewModal({ show: false, file: null });
  };

  const handleFilePreview = (index: number) => {
    if (!attachments) return;
    const fileToPreview = attachments[index];
    setAttachmentPreviewModal({ show: true, file: fileToPreview });
  };

  const renderAttachments = () => {
    return (
      <>
        {attachments &&
          attachments?.length > 0 &&
          attachments?.map((file, index) => {
            return (
              <Box className="editor__footer-selected-file">
                <Box className="editor__footer-selected-file--label">
                  <CSvgIcon
                    size={18}
                    component={Preview}
                    color="violation"
                  />
                  {file.name}
                </Box>
                <Box
                  className="editor__footer-selected-file--icon"
                  onClick={() => handleFilePreview(index)}
                >
                  <CSvgIcon
                    size={20}
                    component={Eye}
                    color="secondary"
                  />
                </Box>
                <Box
                  className="editor__footer-selected-file--icon"
                  onClick={() => handleFileDelete(index)}
                >
                  <CSvgIcon
                    size={20}
                    component={Delete}
                    color="violation"
                  />
                </Box>
              </Box>
            );
          })}
      </>
    );
  };

  return (
    <>
      <Box
        className={clsx({
          editor: true,
          "editor--error": Boolean(error),
          "editor--inline-label": Boolean(isInlineLabel),
          "editor--required": Boolean(required),
          "editor-with-helper-text": Boolean(helperText),
        })}
      >
        <Box className="editor__body">
          {label && <Box className="editor__body-label">{label}</Box>}
          <div className="editor__body-content">
            <Box
              className={clsx({
                "editor__body-content-outlined": true,
              })}
            >
              {/* Quill Editor */}
              <ReactQuill
                ref={quillRef}
                defaultValue={value}
                onChange={handleEditorChange}
                modules={getEditorModules()}
                theme="snow"
                placeholder={placeholder}
                value={value}
              />
              <Toolbar
                quillRef={quillRef}
                onVariableButtonClick={handleVariableButtonClick}
                attachments={attachments}
                onUpdateAttachments={onUpdateAttachments}
                walkMeIdPrefix={walkMeIdPrefix}
              />

              {/* Variables Dropdown */}
              {renderVariableDropdown()}
            </Box>
            {
              <Box className="editor__body-content-helper-text">
                {helperText}
              </Box>
            }
          </div>
        </Box>
        <Box className="editor__footer">{renderAttachments()}</Box>
      </Box>
      <AttachmentPreviewModal
        attachmentPreviewModal={attachmentPreviewModal}
        onClose={closePreviewModal}
      />
    </>
  );
};

export default CRichTextEditor;
