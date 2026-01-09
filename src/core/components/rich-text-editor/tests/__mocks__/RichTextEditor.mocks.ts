import type {
  RichTextEditorProps,
  WildcardVariable,
} from "@/core/types/rich-text-editor.type";
import { vi } from "vitest";

/**
 * Mock wildcard variables
 */
export const mockWildcardVariables: WildcardVariable[] = [
  { name: "Employee Name", value: "%%employee_name%%" },
  { name: "Task Name", value: "%task_name%" },
  { name: "Template Name", value: "%template_name%" },
];

/**
 * Mock files for attachments
 */
export const mockFile1 = new File(["test content 1"], "test-file-1.pdf", {
  type: "application/pdf",
});

export const mockFile2 = new File(["test content 2"], "test-file-2.jpg", {
  type: "image/jpeg",
});

export const mockFile3 = new File(["test content 3"], "document.docx", {
  type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
});

export const mockAttachments: File[] = [mockFile1, mockFile2];

/**
 * Mock functions
 */
export const mockOnChange = vi.fn();
export const mockOnVariableInserted = vi.fn();
export const mockOnUpdateAttachments = vi.fn();

/**
 * Mock ReactQuill editor instance
 */
export const mockQuillEditor = {
  getEditor: vi.fn(() => ({
    getContents: vi.fn(() => ({
      ops: [{ insert: "Test content\n" }],
    })),
    setSelection: vi.fn(),
    container: {
      parentElement: {
        scrollTop: 0,
      },
    },
    insertEmbed: vi.fn(),
    getSelection: vi.fn(() => ({ index: 0, length: 0 })),
    deleteText: vi.fn(),
    insertText: vi.fn(),
    formatText: vi.fn(),
    getFormat: vi.fn(() => ({})),
  })),
  getEditorSelection: vi.fn(() => ({ index: 0, length: 0 })),
};

/**
 * Mock useWildcardVariableManager hook
 */
export const mockUseWildcardVariableManager = {
  handleTextChange: vi.fn(),
  preventCursorInWildcard: vi.fn(),
  renderVariableDropdown: vi.fn(() => null),
  showDropdown: false,
  setShowDropdown: vi.fn(),
  setVariableAnchorEl: vi.fn(),
  getEditorModules: vi.fn(() => ({
    toolbar: false,
    clipboard: {
      matchVisual: false,
    },
  })),
};

/**
 * Mock useCommonTranslation hook
 */
export const mockUseCommonTranslation = {
  EDITOR_ERROR: {
    REQUIRED_FIELD: "This field is required",
    INVALID_FORMAT: "Invalid format",
  },
  EDITOR_TOOLBAR: {
    bold: "Bold",
    italic: "Italic",
    underline: "Underline",
    link: "Link",
    attachment: "Attachment",
    clearFormat: "Clear Format",
    wildcard: "Wildcard",
  },
};

/**
 * Default props for CRichTextEditor
 */
export const mockDefaultRichTextEditorProps: RichTextEditorProps = {
  value: "",
  onChange: mockOnChange,
  placeholder: "Enter text here...",
  walkMeIdPrefix: ["test"],
};

export const mockRichTextEditorPropsWithValue: RichTextEditorProps = {
  value: "<p>Test content</p>",
  onChange: mockOnChange,
  placeholder: "Enter text here...",
  walkMeIdPrefix: ["test"],
};

export const mockRichTextEditorPropsWithError: RichTextEditorProps = {
  value: "",
  onChange: mockOnChange,
  error: true,
  helperText: "This field is required",
  walkMeIdPrefix: ["test"],
};

export const mockRichTextEditorPropsWithAttachments: RichTextEditorProps = {
  value: "<p>Content with attachments</p>",
  onChange: mockOnChange,
  attachments: mockAttachments,
  onUpdateAttachments: mockOnUpdateAttachments,
  walkMeIdPrefix: ["test"],
};

export const mockRichTextEditorPropsWithVariables: RichTextEditorProps = {
  value: "",
  onChange: mockOnChange,
  variables: mockWildcardVariables,
  onVariableInserted: mockOnVariableInserted,
  walkMeIdPrefix: ["test"],
};

export const mockRichTextEditorPropsComplete: RichTextEditorProps = {
  value: "<p>Complete test content</p>",
  onChange: mockOnChange,
  placeholder: "Type here...",
  variables: mockWildcardVariables,
  onVariableInserted: mockOnVariableInserted,
  error: false,
  helperText: "",
  attachments: mockAttachments,
  onUpdateAttachments: mockOnUpdateAttachments,
  walkMeIdPrefix: ["editor", "test"],
};

/**
 * Mock nested menu props
 */
export const mockNestedMenuProps = {
  anchorEl: null,
  onClose: vi.fn(),
  open: false,
};

/**
 * Reset all mocks
 */
export const resetMocks = () => {
  mockOnChange.mockClear();
  mockOnVariableInserted.mockClear();
  mockOnUpdateAttachments.mockClear();
  mockUseWildcardVariableManager.handleTextChange.mockClear();
  mockUseWildcardVariableManager.preventCursorInWildcard.mockClear();
  mockUseWildcardVariableManager.setShowDropdown.mockClear();
  mockUseWildcardVariableManager.setVariableAnchorEl.mockClear();
  mockUseWildcardVariableManager.getEditorModules.mockClear();
};
