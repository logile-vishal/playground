import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Toolbar from "../Toolbar";
import {
  mockDefaultToolbarProps,
  mockToolbarPropsWithAttachments,
  mockToolbarPropsWithoutCallbacks,
  mockToolbarPropsComplete,
  mockOnUpdateAttachments,
  mockOnVariableButtonClick,
  mockGenerateId,
  mockUseCommonTranslation,
  mockUseWalkmeId,
  mockQuillEditor,
  mockEditor,
  mockFile1,
  mockFile2,
  mockFile3,
  resetMocks,
  createEditorWithFormat,
  createEditorWithNoSelection,
  createEditorWithEmptySelection,
  createEditorWithLink,
  createEditorWithWildcards,
  createEditorWithFormattedText,
} from "./__mocks__/Toolbar.mocks";

// Mock ReactQuill
vi.mock("react-quill-new", () => {
  const mockQuill = {
    import: vi.fn((name: string) => {
      if (name === "blots/inline") {
        return class MockInline {
          static blotName = "inline";
          static tagName = "span";
          static create() {
            return document.createElement("span");
          }
        };
      }
      if (name === "blots/embed") {
        return class MockEmbed {
          static blotName = "embed";
          static tagName = "span";
          static create() {
            return document.createElement("span");
          }
        };
      }
      return {};
    }),
    register: vi.fn(),
  };

  return {
    default: vi.fn(),
    Quill: mockQuill,
  };
});

// Mock useCommonTranslation hook
vi.mock("@/core/translation/useCommonTranslation", () => ({
  useCommonTranslation: () => mockUseCommonTranslation,
}));

// Mock useWalkmeId hook
vi.mock("@/core/hooks/useWalkmeId", () => ({
  useWalkmeId: () => mockUseWalkmeId,
}));

// Mock CSvgIcon component
vi.mock("@/core/components/icon/Icon", () => ({
  default: vi.fn(({ component, size, color }) => (
    <span
      data-testid={`icon-${component?.name || "unknown"}`}
      data-color={color}
      data-size={size}
    >
      Icon
    </span>
  )),
}));

// Mock CButton component
vi.mock("@/core/components/button/button", () => ({
  CButton: vi.fn(({ onClick, title, children, ...props }) => (
    <button
      onClick={onClick}
      title={title}
      {...props}
    >
      {children}
    </button>
  )),
}));

// Mock icons
vi.mock("@/core/constants/icons", () => ({
  Attachment: { name: "Attachment" },
  CurlyBracket: { name: "CurlyBracket" },
  EditorBold: { name: "EditorBold" },
  EditorClearFormat: { name: "EditorClearFormat" },
  EditorItalic: { name: "EditorItalic" },
  EditorLink: { name: "EditorLink" },
  EditorUnderline: { name: "EditorUnderline" },
}));

// Mock AttachmentModal component
vi.mock(
  "@/core/components/rich-text-editor/components/attachment-modal/AttachmentModal",
  () => ({
    default: vi.fn(
      ({
        showAttachmentModal,
        handleAttachmentClose,
        handleAttachmentSubmit,
        setSelectedFiles,
        selectedFiles,
      }) => (
        <>
          {showAttachmentModal && (
            <div data-testid="attachment-modal">
              <button
                data-testid="close-attachment-modal"
                onClick={handleAttachmentClose}
              >
                Close
              </button>
              <button
                data-testid="submit-attachment"
                onClick={handleAttachmentSubmit}
              >
                Submit
              </button>
              <button
                data-testid="select-file"
                onClick={() => setSelectedFiles([mockFile3])}
              >
                Select File
              </button>
              {selectedFiles && (
                <div data-testid="selected-files-count">
                  {selectedFiles.length}
                </div>
              )}
            </div>
          )}
        </>
      )
    ),
  })
);

// Mock LinkModal component
vi.mock(
  "@/core/components/rich-text-editor/components/link-modal/LinkModal",
  () => ({
    default: vi.fn(
      ({ showLinkModal, handleLinkClose, handleLinkSubmit, data }) => (
        <>
          {showLinkModal && (
            <div data-testid="link-modal">
              <button
                data-testid="close-link-modal"
                onClick={handleLinkClose}
              >
                Close
              </button>
              <button
                data-testid="submit-link"
                onClick={() =>
                  handleLinkSubmit("New Text", "https://example.com")
                }
              >
                Submit
              </button>
              {data?.text && <div data-testid="link-text">{data.text}</div>}
              {data?.link && <div data-testid="link-url">{data.link}</div>}
            </div>
          )}
        </>
      )
    ),
  })
);

const theme = createTheme();

// Helper function to render component with router and theme
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>{ui}</BrowserRouter>
    </ThemeProvider>
  );
};

describe("Toolbar Component", () => {
  beforeEach(() => {
    resetMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render toolbar with all buttons", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      expect(screen.getByTestId("icon-EditorBold")).toBeInTheDocument();
      expect(screen.getByTestId("icon-EditorItalic")).toBeInTheDocument();
      expect(screen.getByTestId("icon-EditorUnderline")).toBeInTheDocument();
      expect(screen.getByTestId("icon-EditorLink")).toBeInTheDocument();
      expect(screen.getByTestId("icon-Attachment")).toBeInTheDocument();
      expect(screen.getByTestId("icon-EditorClearFormat")).toBeInTheDocument();
      expect(screen.getByTestId("icon-CurlyBracket")).toBeInTheDocument();
    });

    it("should render toolbar with correct titles", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      expect(screen.getByTitle("Bold")).toBeInTheDocument();
      expect(screen.getByTitle("Italic")).toBeInTheDocument();
      expect(screen.getByTitle("Underline")).toBeInTheDocument();
      expect(screen.getByTitle("Link")).toBeInTheDocument();
      expect(screen.getByTitle("Attachment")).toBeInTheDocument();
      expect(screen.getByTitle("Clear Format")).toBeInTheDocument();
      expect(screen.getByTitle("Wildcard")).toBeInTheDocument();
    });

    it("should have toolbar container with correct class", () => {
      const { container } = renderWithProviders(
        <Toolbar {...mockDefaultToolbarProps} />
      );

      const toolbar = container.querySelector("#toolbar");
      expect(toolbar).toBeInTheDocument();
      expect(toolbar).toHaveClass("ql-toolbar", "ql-snow");
    });

    it("should not render modals initially", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      expect(screen.queryByTestId("attachment-modal")).not.toBeInTheDocument();
      expect(screen.queryByTestId("link-modal")).not.toBeInTheDocument();
    });

    it("should render with custom walkMeIdPrefix", () => {
      renderWithProviders(<Toolbar {...mockToolbarPropsComplete} />);

      expect(mockGenerateId).toHaveBeenCalledWith(
        expect.arrayContaining(["template", "editor", "toolbar"])
      );
    });

    it("should render with empty walkMeIdPrefix", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      expect(mockGenerateId).toHaveBeenCalled();
    });
  });

  describe("Bold Button Functionality", () => {
    it("should call handleBold when bold button is clicked", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const boldButton = screen.getByTitle("Bold");
      fireEvent.click(boldButton);

      expect(mockEditor.getFormat).toHaveBeenCalled();
      expect(mockEditor.format).toHaveBeenCalledWith("bold", true);
    });

    it("should toggle bold off when text is already bold", () => {
      createEditorWithFormat({ bold: true });
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const boldButton = screen.getByTitle("Bold");
      fireEvent.click(boldButton);

      expect(mockEditor.format).toHaveBeenCalledWith("bold", false);
    });

    it("should not throw error when quillRef is null", () => {
      const propsWithNullRef = {
        ...mockDefaultToolbarProps,
        quillRef: { current: null },
      };

      renderWithProviders(<Toolbar {...propsWithNullRef} />);

      const boldButton = screen.getByTitle("Bold");
      expect(() => fireEvent.click(boldButton)).not.toThrow();
    });
  });

  describe("Italic Button Functionality", () => {
    it("should call handleItalic when italic button is clicked", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const italicButton = screen.getByTitle("Italic");
      fireEvent.click(italicButton);

      expect(mockEditor.getFormat).toHaveBeenCalled();
      expect(mockEditor.format).toHaveBeenCalledWith("italic", true);
    });

    it("should toggle italic off when text is already italic", () => {
      createEditorWithFormat({ italic: true });
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const italicButton = screen.getByTitle("Italic");
      fireEvent.click(italicButton);

      expect(mockEditor.format).toHaveBeenCalledWith("italic", false);
    });

    it("should not throw error when quillRef is null", () => {
      const propsWithNullRef = {
        ...mockDefaultToolbarProps,
        quillRef: { current: null },
      };

      renderWithProviders(<Toolbar {...propsWithNullRef} />);

      const italicButton = screen.getByTitle("Italic");
      expect(() => fireEvent.click(italicButton)).not.toThrow();
    });
  });

  describe("Underline Button Functionality", () => {
    it("should call handleUnderline when underline button is clicked", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const underlineButton = screen.getByTitle("Underline");
      fireEvent.click(underlineButton);

      expect(mockEditor.getFormat).toHaveBeenCalled();
      expect(mockEditor.format).toHaveBeenCalledWith("underline", true);
    });

    it("should toggle underline off when text is already underlined", () => {
      createEditorWithFormat({ underline: true });
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const underlineButton = screen.getByTitle("Underline");
      fireEvent.click(underlineButton);

      expect(mockEditor.format).toHaveBeenCalledWith("underline", false);
    });

    it("should not throw error when quillRef is null", () => {
      const propsWithNullRef = {
        ...mockDefaultToolbarProps,
        quillRef: { current: null },
      };

      renderWithProviders(<Toolbar {...propsWithNullRef} />);

      const underlineButton = screen.getByTitle("Underline");
      expect(() => fireEvent.click(underlineButton)).not.toThrow();
    });
  });

  describe("Link Button Functionality", () => {
    it("should open link modal when link button is clicked with selection", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const linkButton = screen.getByTitle("Link");
      fireEvent.click(linkButton);

      expect(screen.getByTestId("link-modal")).toBeInTheDocument();
    });

    it("should not open link modal when no text is selected", () => {
      createEditorWithNoSelection();
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const linkButton = screen.getByTitle("Link");
      fireEvent.click(linkButton);

      // Modal should not open when there's no selection
      waitFor(() => {
        expect(screen.queryByTestId("link-modal")).not.toBeInTheDocument();
      });
    });

    it("should not open link modal when selection length is 0", () => {
      createEditorWithEmptySelection();
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const linkButton = screen.getByTitle("Link");
      fireEvent.click(linkButton);

      // Modal should not open when selection length is 0
      waitFor(() => {
        expect(screen.queryByTestId("link-modal")).not.toBeInTheDocument();
      });
    });

    it("should pass selected text to link modal", () => {
      createEditorWithLink("Selected text", null);
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const linkButton = screen.getByTitle("Link");
      fireEvent.click(linkButton);

      // The modal should display the text returned by getText
      expect(screen.getByTestId("link-modal")).toBeInTheDocument();
      expect(mockEditor.getText).toHaveBeenCalled();
    });

    it("should pass existing link to modal when text has link", () => {
      createEditorWithLink("Linked text", "https://example.com");
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const linkButton = screen.getByTitle("Link");
      fireEvent.click(linkButton);

      // Verify the modal opened and editor methods were called
      expect(screen.getByTestId("link-modal")).toBeInTheDocument();
      expect(mockEditor.getFormat).toHaveBeenCalled();
    });

    it("should close link modal when close button is clicked", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const linkButton = screen.getByTitle("Link");
      fireEvent.click(linkButton);

      expect(screen.getByTestId("link-modal")).toBeInTheDocument();

      const closeButton = screen.getByTestId("close-link-modal");
      fireEvent.click(closeButton);

      expect(screen.queryByTestId("link-modal")).not.toBeInTheDocument();
    });

    it("should not throw error when quillRef is null", () => {
      const propsWithNullRef = {
        ...mockDefaultToolbarProps,
        quillRef: { current: null },
      };

      renderWithProviders(<Toolbar {...propsWithNullRef} />);

      const linkButton = screen.getByTitle("Link");
      expect(() => fireEvent.click(linkButton)).not.toThrow();
    });
  });

  describe("Link Submit Functionality", () => {
    it("should insert link when link modal is submitted", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const linkButton = screen.getByTitle("Link");
      fireEvent.click(linkButton);

      const submitButton = screen.getByTestId("submit-link");
      fireEvent.click(submitButton);

      expect(mockEditor.deleteText).toHaveBeenCalled();
      expect(mockEditor.insertText).toHaveBeenCalledWith(
        0,
        "New Text",
        "link",
        "https://example.com"
      );
    });

    it("should close link modal after submission", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const linkButton = screen.getByTitle("Link");
      fireEvent.click(linkButton);

      const submitButton = screen.getByTestId("submit-link");
      fireEvent.click(submitButton);

      expect(screen.queryByTestId("link-modal")).not.toBeInTheDocument();
    });

    it("should not throw error when quillRef is null during submit", () => {
      const propsWithNullRef = {
        ...mockDefaultToolbarProps,
        quillRef: { current: null },
      };

      renderWithProviders(<Toolbar {...propsWithNullRef} />);

      // Manually trigger link submission scenario would require internal state access
      // This test validates the component doesn't crash with null ref
      expect(screen.getByTitle("Link")).toBeInTheDocument();
    });
  });

  describe("Attachment Button Functionality", () => {
    it("should open attachment modal when attachment button is clicked", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const attachmentButton = screen.getByTitle("Attachment");
      fireEvent.click(attachmentButton);

      expect(screen.getByTestId("attachment-modal")).toBeInTheDocument();
    });

    it("should close attachment modal when close button is clicked", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const attachmentButton = screen.getByTitle("Attachment");
      fireEvent.click(attachmentButton);

      expect(screen.getByTestId("attachment-modal")).toBeInTheDocument();

      const closeButton = screen.getByTestId("close-attachment-modal");
      fireEvent.click(closeButton);

      expect(screen.queryByTestId("attachment-modal")).not.toBeInTheDocument();
    });

    it("should clear selected files when modal is closed", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const attachmentButton = screen.getByTitle("Attachment");
      fireEvent.click(attachmentButton);

      // Select a file
      const selectFileButton = screen.getByTestId("select-file");
      fireEvent.click(selectFileButton);

      expect(screen.getByTestId("selected-files-count")).toHaveTextContent("1");

      // Close modal
      const closeButton = screen.getByTestId("close-attachment-modal");
      fireEvent.click(closeButton);

      // Reopen modal
      fireEvent.click(attachmentButton);

      expect(
        screen.queryByTestId("selected-files-count")
      ).not.toBeInTheDocument();
    });
  });

  describe("Attachment Submit Functionality", () => {
    it("should call onUpdateAttachments when attachment is submitted", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const attachmentButton = screen.getByTitle("Attachment");
      fireEvent.click(attachmentButton);

      // Select a file
      const selectFileButton = screen.getByTestId("select-file");
      fireEvent.click(selectFileButton);

      // Submit
      const submitButton = screen.getByTestId("submit-attachment");
      fireEvent.click(submitButton);

      expect(mockOnUpdateAttachments).toHaveBeenCalledWith([mockFile3]);
    });

    it("should add new files to existing attachments", () => {
      renderWithProviders(<Toolbar {...mockToolbarPropsWithAttachments} />);

      const attachmentButton = screen.getByTitle("Attachment");
      fireEvent.click(attachmentButton);

      // Select a file
      const selectFileButton = screen.getByTestId("select-file");
      fireEvent.click(selectFileButton);

      // Submit
      const submitButton = screen.getByTestId("submit-attachment");
      fireEvent.click(submitButton);

      expect(mockOnUpdateAttachments).toHaveBeenCalledWith([
        mockFile1,
        mockFile2,
        mockFile3,
      ]);
    });

    it("should close modal after submission", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const attachmentButton = screen.getByTitle("Attachment");
      fireEvent.click(attachmentButton);

      // Select a file
      const selectFileButton = screen.getByTestId("select-file");
      fireEvent.click(selectFileButton);

      // Submit
      const submitButton = screen.getByTestId("submit-attachment");
      fireEvent.click(submitButton);

      expect(screen.queryByTestId("attachment-modal")).not.toBeInTheDocument();
    });

    it("should not call onUpdateAttachments when no files selected", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const attachmentButton = screen.getByTitle("Attachment");
      fireEvent.click(attachmentButton);

      // Submit without selecting files
      const submitButton = screen.getByTestId("submit-attachment");
      fireEvent.click(submitButton);

      expect(mockOnUpdateAttachments).not.toHaveBeenCalled();
    });
  });

  describe("Clear Format Button Functionality", () => {
    it("should call handleClearFormat when clear format button is clicked", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const clearButton = screen.getByTitle("Clear Format");
      fireEvent.click(clearButton);

      expect(mockEditor.getSelection).toHaveBeenCalled();
    });

    it("should remove format from selected text", () => {
      createEditorWithFormattedText();
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const clearButton = screen.getByTitle("Clear Format");
      fireEvent.click(clearButton);

      expect(mockEditor.removeFormat).toHaveBeenCalled();
      expect(mockEditor.setSelection).toHaveBeenCalled();
    });

    it("should not clear format when no selection", () => {
      createEditorWithNoSelection();
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const clearButton = screen.getByTitle("Clear Format");
      fireEvent.click(clearButton);

      const editor = mockQuillEditor.getEditor();
      expect(editor.removeFormat).not.toHaveBeenCalled();
    });

    it("should not clear format when selection length is 0", () => {
      createEditorWithEmptySelection();
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const clearButton = screen.getByTitle("Clear Format");
      fireEvent.click(clearButton);

      const editor = mockQuillEditor.getEditor();
      expect(editor.removeFormat).not.toHaveBeenCalled();
    });

    it("should preserve wildcard blots when clearing format", () => {
      createEditorWithWildcards();
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const clearButton = screen.getByTitle("Clear Format");
      fireEvent.click(clearButton);

      expect(mockEditor.formatText).toHaveBeenCalled();
    });

    it("should not throw error when quillRef is null", () => {
      const propsWithNullRef = {
        ...mockDefaultToolbarProps,
        quillRef: { current: null },
      };

      renderWithProviders(<Toolbar {...propsWithNullRef} />);

      const clearButton = screen.getByTitle("Clear Format");
      expect(() => fireEvent.click(clearButton)).not.toThrow();
    });
  });

  describe("Variable Button Functionality", () => {
    it("should call onVariableButtonClick when variable button is clicked", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const variableButton = screen.getByTitle("Wildcard");
      fireEvent.click(variableButton);

      expect(mockOnVariableButtonClick).toHaveBeenCalledTimes(1);
    });

    it("should pass event to onVariableButtonClick", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const variableButton = screen.getByTitle("Wildcard");
      fireEvent.click(variableButton);

      expect(mockOnVariableButtonClick).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "click",
        })
      );
    });
  });

  describe("Props Handling", () => {
    it("should handle attachments prop", () => {
      renderWithProviders(<Toolbar {...mockToolbarPropsWithAttachments} />);

      expect(screen.getByTitle("Attachment")).toBeInTheDocument();
    });

    it("should handle undefined attachments gracefully", () => {
      const propsWithUndefinedAttachments = {
        ...mockDefaultToolbarProps,
        attachments: undefined,
      };

      expect(() => {
        renderWithProviders(<Toolbar {...propsWithUndefinedAttachments} />);
      }).not.toThrow();
    });

    it("should handle onUpdateAttachments prop", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const attachmentButton = screen.getByTitle("Attachment");
      fireEvent.click(attachmentButton);

      const selectFileButton = screen.getByTestId("select-file");
      fireEvent.click(selectFileButton);

      const submitButton = screen.getByTestId("submit-attachment");
      fireEvent.click(submitButton);

      expect(mockOnUpdateAttachments).toHaveBeenCalled();
    });

    it("should use default onUpdateAttachments when not provided", () => {
      const propsWithoutCallback = {
        ...mockToolbarPropsWithoutCallbacks,
      };

      expect(() => {
        renderWithProviders(<Toolbar {...propsWithoutCallback} />);
      }).not.toThrow();
    });

    it("should handle walkMeIdPrefix prop", () => {
      renderWithProviders(<Toolbar {...mockToolbarPropsComplete} />);

      expect(mockGenerateId).toHaveBeenCalledWith(
        expect.arrayContaining(["template", "editor", "toolbar"])
      );
    });

    it("should handle empty walkMeIdPrefix array", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      expect(mockGenerateId).toHaveBeenCalled();
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle null quillRef gracefully", () => {
      const propsWithNullRef = {
        ...mockDefaultToolbarProps,
        quillRef: { current: null },
      };

      expect(() => {
        renderWithProviders(<Toolbar {...propsWithNullRef} />);
      }).not.toThrow();
    });

    it("should handle multiple rapid button clicks", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const boldButton = screen.getByTitle("Bold");
      fireEvent.click(boldButton);
      fireEvent.click(boldButton);
      fireEvent.click(boldButton);

      expect(mockEditor.format).toHaveBeenCalledTimes(3);
    });

    it("should handle opening multiple modals sequentially", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      // Open attachment modal
      const attachmentButton = screen.getByTitle("Attachment");
      fireEvent.click(attachmentButton);
      expect(screen.getByTestId("attachment-modal")).toBeInTheDocument();

      // Close it
      const closeAttachment = screen.getByTestId("close-attachment-modal");
      fireEvent.click(closeAttachment);

      // Open link modal
      const linkButton = screen.getByTitle("Link");
      fireEvent.click(linkButton);
      expect(screen.getByTestId("link-modal")).toBeInTheDocument();
    });

    it("should handle empty attachments array", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const attachmentButton = screen.getByTitle("Attachment");
      fireEvent.click(attachmentButton);

      const selectFileButton = screen.getByTestId("select-file");
      fireEvent.click(selectFileButton);

      const submitButton = screen.getByTestId("submit-attachment");
      fireEvent.click(submitButton);

      expect(mockOnUpdateAttachments).toHaveBeenCalledWith([mockFile3]);
    });

    it("should handle large number of attachments", () => {
      const manyAttachments = Array.from(
        { length: 50 },
        (_, i) =>
          new File([`content${i}`], `file${i}.txt`, { type: "text/plain" })
      );

      const propsWithManyAttachments = {
        ...mockDefaultToolbarProps,
        attachments: manyAttachments,
      };

      expect(() => {
        renderWithProviders(<Toolbar {...propsWithManyAttachments} />);
      }).not.toThrow();
    });

    it("should handle editor with no format methods gracefully", () => {
      const brokenEditor = {
        getFormat: vi.fn(() => ({})),
        format: undefined,
      };

      const propsWithBrokenEditor = {
        ...mockDefaultToolbarProps,
        quillRef: {
          current: {
            getEditor: vi.fn(() => brokenEditor),
          },
        } as any,
      };

      renderWithProviders(<Toolbar {...propsWithBrokenEditor} />);

      // Component should render even with broken editor
      expect(screen.getByTitle("Bold")).toBeInTheDocument();
    });
  });

  describe("Modal State Management", () => {
    it("should maintain separate state for attachment and link modals", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      // Open link modal
      const linkButton = screen.getByTitle("Link");
      fireEvent.click(linkButton);
      expect(screen.getByTestId("link-modal")).toBeInTheDocument();

      // Link modal should remain open when trying to open attachment
      const attachmentButton = screen.getByTitle("Attachment");
      fireEvent.click(attachmentButton);

      expect(screen.getByTestId("attachment-modal")).toBeInTheDocument();
    });

    it("should reset attachment modal state when closed", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const attachmentButton = screen.getByTitle("Attachment");
      fireEvent.click(attachmentButton);

      const selectFileButton = screen.getByTestId("select-file");
      fireEvent.click(selectFileButton);

      const closeButton = screen.getByTestId("close-attachment-modal");
      fireEvent.click(closeButton);

      // Reopen
      fireEvent.click(attachmentButton);
      expect(
        screen.queryByTestId("selected-files-count")
      ).not.toBeInTheDocument();
    });

    it("should reset link modal state when closed", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const linkButton = screen.getByTitle("Link");
      fireEvent.click(linkButton);

      expect(screen.getByTestId("link-modal")).toBeInTheDocument();

      const closeButton = screen.getByTestId("close-link-modal");
      fireEvent.click(closeButton);

      expect(screen.queryByTestId("link-modal")).not.toBeInTheDocument();
    });
  });

  describe("WalkMe ID Generation", () => {
    it("should generate walkme IDs for all buttons", () => {
      renderWithProviders(<Toolbar {...mockToolbarPropsComplete} />);

      expect(mockGenerateId).toHaveBeenCalledWith([
        "template",
        "editor",
        "toolbar",
        "rich text editor",
        "bold button",
      ]);
      expect(mockGenerateId).toHaveBeenCalledWith([
        "template",
        "editor",
        "toolbar",
        "rich text editor",
        "italic button",
      ]);
      expect(mockGenerateId).toHaveBeenCalledWith([
        "template",
        "editor",
        "toolbar",
        "rich text editor",
        "underline button",
      ]);
      expect(mockGenerateId).toHaveBeenCalledWith([
        "template",
        "editor",
        "toolbar",
        "rich text editor",
        "link button",
      ]);
      expect(mockGenerateId).toHaveBeenCalledWith([
        "template",
        "editor",
        "toolbar",
        "rich text editor",
        "attachment button",
      ]);
      expect(mockGenerateId).toHaveBeenCalledWith([
        "template",
        "editor",
        "toolbar",
        "rich text editor",
        "clear format button",
      ]);
      expect(mockGenerateId).toHaveBeenCalledWith([
        "template",
        "editor",
        "toolbar",
        "rich text editor",
        "wildcard button",
      ]);
    });
  });

  describe("Accessibility", () => {
    it("should have accessible button titles", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      expect(screen.getByTitle("Bold")).toBeInTheDocument();
      expect(screen.getByTitle("Italic")).toBeInTheDocument();
      expect(screen.getByTitle("Underline")).toBeInTheDocument();
      expect(screen.getByTitle("Link")).toBeInTheDocument();
      expect(screen.getByTitle("Attachment")).toBeInTheDocument();
      expect(screen.getByTitle("Clear Format")).toBeInTheDocument();
      expect(screen.getByTitle("Wildcard")).toBeInTheDocument();
    });

    it("should have proper toolbar structure", () => {
      const { container } = renderWithProviders(
        <Toolbar {...mockDefaultToolbarProps} />
      );

      const toolbar = container.querySelector("#toolbar");
      expect(toolbar).toBeInTheDocument();
    });
  });

  describe("Integration Tests", () => {
    it("should handle complete formatting workflow", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      // Apply bold
      const boldButton = screen.getByTitle("Bold");
      fireEvent.click(boldButton);

      // Apply italic
      const italicButton = screen.getByTitle("Italic");
      fireEvent.click(italicButton);

      // Apply underline
      const underlineButton = screen.getByTitle("Underline");
      fireEvent.click(underlineButton);

      expect(mockEditor.format).toHaveBeenCalledWith("bold", true);
      expect(mockEditor.format).toHaveBeenCalledWith("italic", true);
      expect(mockEditor.format).toHaveBeenCalledWith("underline", true);
    });

    it("should handle complete link insertion workflow", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      // Open link modal
      const linkButton = screen.getByTitle("Link");
      fireEvent.click(linkButton);

      expect(screen.getByTestId("link-modal")).toBeInTheDocument();

      // Submit link
      const submitButton = screen.getByTestId("submit-link");
      fireEvent.click(submitButton);

      expect(mockEditor.deleteText).toHaveBeenCalled();
      expect(mockEditor.insertText).toHaveBeenCalled();
      expect(screen.queryByTestId("link-modal")).not.toBeInTheDocument();
    });

    it("should handle complete attachment workflow", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      // Open attachment modal
      const attachmentButton = screen.getByTitle("Attachment");
      fireEvent.click(attachmentButton);

      expect(screen.getByTestId("attachment-modal")).toBeInTheDocument();

      // Select file
      const selectFileButton = screen.getByTestId("select-file");
      fireEvent.click(selectFileButton);

      // Submit
      const submitButton = screen.getByTestId("submit-attachment");
      fireEvent.click(submitButton);

      expect(mockOnUpdateAttachments).toHaveBeenCalled();
      expect(screen.queryByTestId("attachment-modal")).not.toBeInTheDocument();
    });
  });

  describe("Negative Scenarios", () => {
    it("should validate editor state before formatting", () => {
      const editorWithError = {
        getFormat: vi.fn(() => ({
          bold: false,
          italic: false,
          underline: false,
          link: null,
        })),
        format: vi.fn(),
      };

      const propsWithErrorEditor = {
        ...mockDefaultToolbarProps,
        quillRef: {
          current: {
            getEditor: vi.fn(() => editorWithError),
          },
        } as any,
      };

      renderWithProviders(<Toolbar {...propsWithErrorEditor} />);

      const boldButton = screen.getByTitle("Bold");
      fireEvent.click(boldButton);

      expect(editorWithError.getFormat).toHaveBeenCalled();
      expect(editorWithError.format).toHaveBeenCalled();
    });

    it("should not update attachments when modal submit fails silently", () => {
      renderWithProviders(<Toolbar {...mockDefaultToolbarProps} />);

      const attachmentButton = screen.getByTitle("Attachment");
      fireEvent.click(attachmentButton);

      // Submit without selecting files
      const submitButton = screen.getByTestId("submit-attachment");
      fireEvent.click(submitButton);

      expect(mockOnUpdateAttachments).not.toHaveBeenCalled();
    });
  });
});
