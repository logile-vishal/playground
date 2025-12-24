/* TODO Demo: Will be modified later */
import { useState, useRef, type FC } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import {
  Attachment,
  EditorBold,
  EditorItalic,
  EditorLink,
  CurlyBracket,
  EditorClearFormat,
  EditorUnderline,
} from "@/core/constants/icons";
import CSvgIcon from "@/core/components/icon/Icon";
import CNestedMenu from "@/core/components/nested-menu/NestedMenu";

import "./QuillTextEditor.scss";

const VARIABLE_STYLES = {
  backgroundColor: "var(--logile-blue-50)",
  color: "var(--logile-blue-500)",
  padding: "var(--space-xxs) var(--space-s)",
  borderRadius: "var(--radius-xs)",
  margin: "var(--space-none) var(--space-xxs)",
  fontWeight: "var(--logile-weight-500)",
} as const;

// eslint-disable-next-line
const Inline = Quill.import("blots/inline") as any;
class VariableBlot extends Inline {
  static create(value: string): HTMLElement {
    const node = super.create() as HTMLElement;
    node.setAttribute("data-variable", value);
    node.textContent = `{{${value}}}`;

    // Apply styles using variables
    Object.entries(VARIABLE_STYLES).forEach(([key, val]) => {
      (node.style as unknown as Record<string, string>)[key] = val;
    });

    return node;
  }

  static value(node: HTMLElement): string {
    return node.getAttribute("data-variable") || "";
  }
}

VariableBlot.blotName = "variable1";
VariableBlot.tagName = "span";
VariableBlot.className = "ql-variable";

Quill.register(VariableBlot);

type CustomToolbarProps = {
  onVariableClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

/**
 * @method CustomToolbar
 * @description Renders custom toolbar with formatting and variable insertion buttons
 * @param {CustomToolbarProps} props - Component props
 * @param {Function} props.onVariableClick - Callback when variable button is clicked
 * @return {React.ReactNode} Toolbar JSX element
 */
const CustomToolbar: FC<CustomToolbarProps> = ({ onVariableClick }) => (
  <div
    id="toolbar"
    className="ql-toolbar ql-snow"
  >
    <button>
      <CSvgIcon
        component={EditorBold}
        color="secondary"
        size={24}
      />
    </button>
    <button>
      <CSvgIcon
        component={EditorItalic}
        color="secondary"
        size={24}
      />
    </button>
    <button>
      <CSvgIcon
        component={EditorUnderline}
        color="secondary"
        size={24}
      />
    </button>
    <button>
      <CSvgIcon
        component={EditorLink}
        color="secondary"
        size={24}
      />
    </button>
    <button>
      <CSvgIcon
        component={Attachment}
        color="secondary"
        size={24}
      />
    </button>
    <button
      type="button"
      color="secondary"
    >
      <CSvgIcon
        component={EditorClearFormat}
        color="secondary"
        size={24}
      />
    </button>
    <button
      onClick={onVariableClick}
      type="button"
    >
      <CSvgIcon
        component={CurlyBracket}
        color="secondary"
        size={24}
      />
    </button>
  </div>
);

const QuillTextEditor: FC<{
  value?: string;
  onChange: (content: string) => void;
}> = ({ value = "", onChange }) => {
  /**
   * @method QuillTextEditor
   * @description Rich text editor with custom toolbar, formatting tools, and template variable support
   * @param {Object} props - Component props
   * @param {string} [props.value] - Editor content value
   * @param {Function} props.onChange - Callback when editor content changes
   * @return {React.ReactNode} Editor container JSX element
   */
  const [showDropdown, setShowDropdown] = useState(false);
  const [variableAnchorEl, setVariableAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const quillRef = useRef<ReactQuill>(null);

  const VARIABLES_OPTIONS = [
    { name: "Template Name", value: "Template Name" },
    { name: "Assignee Position", value: "Assignee Position" },
    { name: "Assignee Org Type", value: "Assignee Org Type" },
  ];

  /**
   * @method handleVariableInsert
   * @description Inserts selected variable into editor at cursor position
   * @param {Object} item - Selected variable item
   * @param {string} item.value - Variable value to insert
   * @return {void}
   */
  const handleVariableInsert = (item) => {
    const variable = item?.value;
    if (!quillRef.current) return;
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection(true);
    editor.insertEmbed(range.index, "variable1", variable);
    editor.setSelection(range.index + 1);
    setShowDropdown(false);
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
    setVariableAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };

  /**
   * @method closeVariableMenu
   * @description Closes the variable selection dropdown menu
   * @return {void}
   */
  const closeVariableMenu = () => {
    setShowDropdown(false);
  };

  const modules = {
    toolbar: { container: "#toolbar" },
  };

  return (
    <div className="editor-wrapper">
      {/* Toolbar must be placed BEFORE ReactQuill for Quill to find it */}

      {/* Quill Editor */}
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={modules}
        theme="snow"
        placeholder="Question Text"
      />
      <CustomToolbar onVariableClick={handleVariableButtonClick} />

      {/* Variables Dropdown */}
      {showDropdown && (
        <CNestedMenu
          showSearch={true}
          anchorEl={variableAnchorEl}
          menuItems={VARIABLES_OPTIONS}
          onClose={closeVariableMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          onMenuItemSelect={handleVariableInsert}
        />
      )}
    </div>
  );
};

export default QuillTextEditor;
