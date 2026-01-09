import { vi } from "vitest";
import type { ToolbarProps } from "../../Toolbar";

/**
 * Mock File for Toolbar Component Tests
 */

// Mock files for attachments
export const mockFile1 = new File(["content1"], "document.pdf", {
  type: "application/pdf",
});

export const mockFile2 = new File(["content2"], "image.jpg", {
  type: "image/jpeg",
});

export const mockFile3 = new File(["content3"], "spreadsheet.xlsx", {
  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
});

export const mockAttachments: File[] = [mockFile1, mockFile2];

// Mock functions
export const mockOnUpdateAttachments = vi.fn();
export const mockOnVariableButtonClick = vi.fn();
export const mockGenerateId = vi.fn((path: string[]) => path.join("-"));

// Create a shared mock editor instance
const createMockEditor = () => ({
  getFormat: vi.fn(() => ({
    bold: false,
    italic: false,
    underline: false,
    link: null,
  })),
  format: vi.fn(),
  getSelection: vi.fn(() => ({
    index: 0,
    length: 5,
  })),
  getText: vi.fn(() => "Sample text"),
  deleteText: vi.fn(),
  insertText: vi.fn(),
  getContents: vi.fn(() => ({
    ops: [{ insert: "Sample text" }],
  })),
  removeFormat: vi.fn(),
  formatText: vi.fn(),
  setSelection: vi.fn(),
});

export let mockEditor = createMockEditor();

// Mock Quill editor instance
export const mockQuillEditor = {
  getEditor: vi.fn(() => mockEditor),
  getContents: vi.fn(),
  setSelection: vi.fn(),
};

// Mock quillRef
export const createMockQuillRef = () => ({
  current: mockQuillEditor,
});

// Mock useCommonTranslation hook
export const mockUseCommonTranslation = {
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

// Mock useWalkmeId hook
export const mockUseWalkmeId = {
  generateId: mockGenerateId,
};

// Mock ToolbarProps
export const mockDefaultToolbarProps: ToolbarProps = {
  quillRef: createMockQuillRef() as any,
  attachments: [],
  onUpdateAttachments: mockOnUpdateAttachments,
  onVariableButtonClick: mockOnVariableButtonClick,
  walkMeIdPrefix: [],
};

export const mockToolbarPropsWithAttachments: ToolbarProps = {
  quillRef: createMockQuillRef() as any,
  attachments: mockAttachments,
  onUpdateAttachments: mockOnUpdateAttachments,
  onVariableButtonClick: mockOnVariableButtonClick,
  walkMeIdPrefix: ["template", "editor"],
};

export const mockToolbarPropsWithoutCallbacks: ToolbarProps = {
  quillRef: createMockQuillRef() as any,
  attachments: [],
  walkMeIdPrefix: [],
  onVariableButtonClick: mockOnVariableButtonClick,
};

export const mockToolbarPropsComplete: ToolbarProps = {
  quillRef: createMockQuillRef() as any,
  attachments: mockAttachments,
  onUpdateAttachments: mockOnUpdateAttachments,
  onVariableButtonClick: mockOnVariableButtonClick,
  walkMeIdPrefix: ["template", "editor", "toolbar"],
};

// Helper function to reset all mocks
export const resetMocks = () => {
  mockOnUpdateAttachments.mockClear();
  mockOnVariableButtonClick.mockClear();
  mockGenerateId.mockClear();

  // Create a new editor instance for each test
  mockEditor = createMockEditor();
  mockQuillEditor.getEditor.mockReturnValue(mockEditor);
  mockQuillEditor.getEditor.mockClear();
};

// Helper function to create editor with specific format state
export const createEditorWithFormat = (format: {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  link?: string | null;
}) => {
  mockEditor.getFormat.mockReturnValue({
    bold: format.bold ?? false,
    italic: format.italic ?? false,
    underline: format.underline ?? false,
    link: format.link ?? null,
  });
  return mockEditor;
};

// Helper function to create editor with no selection
export const createEditorWithNoSelection = () => {
  mockEditor.getSelection.mockReturnValue(null);
  return mockEditor;
};

// Helper function to create editor with empty selection
export const createEditorWithEmptySelection = () => {
  mockEditor.getSelection.mockReturnValue({
    index: 5,
    length: 0,
  });
  return mockEditor;
};

// Helper function to create editor with link format
export const createEditorWithLink = (text: string, link: string) => {
  mockEditor.getText.mockReturnValue(text);
  mockEditor.getFormat.mockReturnValue({
    bold: false,
    italic: false,
    underline: false,
    link: link,
  });
  return mockEditor;
};

// Helper function to create editor with complex content (wildcards)
export const createEditorWithWildcards = () => {
  mockEditor.getContents.mockReturnValue({
    ops: [
      { insert: "Hello " },
      { insert: { wildcard: "employee_name" } as any },
      { insert: " world" },
    ],
  });
  return mockEditor;
};

// Helper function to create editor with formatted text
export const createEditorWithFormattedText = () => {
  mockEditor.getContents.mockReturnValue({
    ops: [
      {
        insert: "Bold text",
        attributes: { bold: true },
      } as any,
      { insert: " " },
      {
        insert: "Italic text",
        attributes: { italic: true },
      } as any,
    ],
  });
  return mockEditor;
};
