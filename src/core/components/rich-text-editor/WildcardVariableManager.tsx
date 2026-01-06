import { useState, useRef, useCallback, type ReactNode } from "react";

import type {
  WildcardVariable,
  WildcardVariableManagerProps,
} from "@/core/types/rich-text-editor.type";
import CNestedMenu from "@/core/components/nested-menu/NestedMenu";

import { WILD_CARD_MAP } from "./wildcardLabel";

/**
 * @utility createWildcardRegex
 * @description Creates a regex pattern from wildcard map keys
 * Escapes special regex characters for safe pattern matching
 * @return {RegExp} Compiled regex pattern
 */
const createWildcardRegex = (): RegExp => {
  const escapedPatterns = Array.from(WILD_CARD_MAP.keys())
    .map((pattern) => pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  return new RegExp(escapedPatterns, "g");
};

/**
 * @utility calculateContentLength
 * @description Calculates total length of editor content
 * Treats text normally and embed blots as single characters
 * @param {Record<string, unknown>} contents - Quill Delta contents
 * @return {number} Total content length
 */
const calculateContentLength = (contents: Record<string, unknown>): number => {
  const ops =
    (contents.ops as Array<{ insert: string | Record<string, unknown> }>) || [];
  let length = 0;
  for (const op of ops) {
    if (typeof op.insert === "string") {
      length += op.insert.length;
    } else {
      // Embed blots (like wildcards) count as 1 character
      length += 1;
    }
  }
  return length;
};

/**
 * @hook useWildcardVariableManager
 * @description Custom hook that manages all wildcard variable features including:
 * - Auto-replacement of typed wildcards
 * - Manual insertion from dropdown
 * - Protection against editing/deleting wildcard content
 * - One-time deletion of entire wildcard blocks
 * @param {WildcardVariableManagerProps} props - Manager configuration props
 * @return {Object} Object containing handlers and render functions
 */
const useWildcardVariableManager = ({
  quillRef,
  variables = [],
  nestedMenuProps,
  onVariableInserted,
}: WildcardVariableManagerProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [variableAnchorEl, setVariableAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const processingWildcardRef = useRef(false);
  const lastInsertedVariableRef = useRef<string | null>(null);
  const isWildcardClickRef = useRef(false);

  /**
   * @method detectAndReplaceWildcards
   * @description Detects wildcard patterns in text and replaces them with blots
   * Auto-converts text %wildcard_value% to styled wildcard blot
   * Only processes text changes from user input, not from programmatic changes
   * @return {void}
   */
  const detectAndReplaceWildcards = useCallback(() => {
    if (processingWildcardRef.current || !quillRef.current) return;

    try {
      const editor = quillRef.current.getEditor();
      const regex = createWildcardRegex();

      if (!regex.source || regex.source === "") return;

      processingWildcardRef.current = true;

      // Process wildcards one by one from the end to avoid index shifting
      let found = true;
      while (found) {
        found = false;

        // Get fresh contents each iteration since Delta changes after insertions
        const contents = editor.getContents();
        regex.lastIndex = 0; // Reset regex state

        // Build the full text from contents to find matches
        let fullText = "";
        const positionMap: Array<{
          opIndex: number;
          startInOp: number;
          length: number;
        }> = [];

        for (let opIndex = 0; opIndex < contents.ops.length; opIndex++) {
          const op = contents.ops[opIndex];
          const opInsert = op.insert as Record<string, unknown>;
          const isWildcard =
            typeof opInsert === "object" && opInsert?.wildcard === true;

          if (typeof op.insert === "string") {
            const textLength = op.insert.length;
            positionMap.push({
              opIndex,
              startInOp: fullText.length,
              length: textLength,
            });
            fullText += op.insert;
          } else if (!isWildcard) {
            // Non-wildcard blots are skipped in text search
            // (we only care about plain text)
          }
        }

        // Find the first match
        const match = regex.exec(fullText);
        if (match) {
          found = true;

          // Find which op contains this match
          let editorIndex = 0;
          let currentTextIndex = 0;

          for (let opIndex = 0; opIndex < contents.ops.length; opIndex++) {
            const op = contents.ops[opIndex];
            const opInsert = op.insert as Record<string, unknown>;
            const isWildcard =
              typeof opInsert === "object" && opInsert?.wildcard === true;

            if (typeof op.insert === "string") {
              const textLength = op.insert.length;
              const textEndIndex = currentTextIndex + textLength;

              // Check if match starts within this text segment
              if (match.index < textEndIndex) {
                const offsetInOp = match.index - currentTextIndex;
                editorIndex += offsetInOp;
                break;
              }
              currentTextIndex += textLength;
              editorIndex += textLength;
            } else if (!isWildcard) {
              editorIndex += 1; // Blots count as 1 character
            }
          }

          // Delete the matched wildcard text
          editor.deleteText(editorIndex, match[0].length);
          // Insert the wildcard blot
          editor.insertEmbed(editorIndex, "wildcard", match[0]);
          // Position cursor right after the wildcard blot
          editor.setSelection(editorIndex + 1, 0);
        }
      }

      processingWildcardRef.current = false;
    } catch (error) {
      console.error("Error in detectAndReplaceWildcards:", error);
      processingWildcardRef.current = false;
    }
  }, [quillRef]);

  /**
   * @method insertWildcardFromDropdown
   * @description Inserts a wildcard variable selected from the dropdown menu
   * Prevents duplicate insertions and manages the dropdown state
   * @param {WildcardVariable} item - Selected variable item with value
   * @return {void}
   */
  const insertWildcardFromDropdown = useCallback(
    (item: WildcardVariable) => {
      const variable = item?.value;

      // Prevent duplicate insertions
      if (lastInsertedVariableRef.current === variable) {
        lastInsertedVariableRef.current = null;
        return;
      }

      lastInsertedVariableRef.current = variable;

      if (!quillRef.current) return;

      const editor = quillRef.current.getEditor();
      const range = editor.getSelection(true);

      // Set processing flag to prevent auto-detection
      processingWildcardRef.current = true;

      // Insert the wildcard blot directly
      editor.insertEmbed(range.index, "wildcard", variable);
      // Set cursor position right after the wildcard
      editor.setSelection(range.index + 1, 0);
      editor.focus();

      processingWildcardRef.current = false;

      setShowDropdown(false);
      onVariableInserted?.(variable);

      // Clear the ref after insertion
      setTimeout(() => {
        lastInsertedVariableRef.current = null;
      }, 100);
    },
    [quillRef, onVariableInserted]
  );

  /**
   * @method getWildcardAwareBackspaceHandler
   * @description Returns a keyboard binding handler for backspace key
   * Handles special cases for wildcard deletion:
   * - If cursor is at the end of a wildcard, delete the entire wildcard block
   * - If cursor is in normal text, use default backspace behavior
   * Prevents character-by-character deletion within wildcards
   * @return {Function} Handler function for backspace keyboard binding
   */
  const getWildcardAwareBackspaceHandler = useCallback(() => {
    return function () {
      try {
        // Use the quillRef to ensure we have the correct editor instance
        if (!quillRef.current) return true;
        const editor = quillRef.current.getEditor();

        const selection = editor.getSelection();
        if (!selection || selection.length !== 0) return true;

        const contents = editor.getContents();
        let currentPos = 0;

        // Find if cursor is adjacent to a wildcard blot
        for (const op of contents.ops) {
          // Check if this is a wildcard embed blot
          const opInsert = op.insert as Record<string, unknown>;
          const isWildcard =
            typeof opInsert === "object" && opInsert?.wildcard === true;

          if (isWildcard) {
            // If cursor is right after the wildcard, delete the entire wildcard blot
            if (selection.index === currentPos + 1) {
              // Delete the entire wildcard blot (1 character for embed)
              editor.deleteText(currentPos, 1);
              // Position cursor at the wildcard position
              editor.setSelection(currentPos, 0);
              return false; // Prevent default backspace
            }
            // If cursor is at the start of wildcard, still prevent default
            if (selection.index === currentPos) {
              return false;
            }
            // Move position past the wildcard (1 character for embed)
            currentPos += 1;
          } else if (typeof op.insert === "string") {
            currentPos += op.insert.length;
          } else {
            currentPos += 1;
          }
        }

        return true; // Allow default backspace for normal text
      } catch (error) {
        // If anything goes wrong, allow default backspace
        console.error("Error in wildcard backspace handler:", error);
        return true;
      }
    };
  }, [quillRef]);

  /**
   * @method preventCursorInWildcard
   * @description Prevents cursor from being placed inside wildcard blots
   * Forces cursor to move to before or after the wildcard, never inside
   * Also handles click on wildcard to move cursor to end of content
   * @return {void}
   */
  const preventCursorInWildcard = useCallback(() => {
    // Validate ref exists and has proper structure
    if (!quillRef.current) return;

    try {
      // Check if editor can be retrieved and has required methods
      let editor;
      try {
        editor = quillRef.current.getEditor();
      } catch {
        // Editor not yet initialized
        return;
      }

      // Validate editor has required methods and properties
      if (!editor || typeof editor.on !== "function" || !editor.getContents) {
        return;
      }

      editor.on("selection-change", (range) => {
        // Skip cursor prevention if wildcard was just clicked
        if (isWildcardClickRef.current) {
          isWildcardClickRef.current = false;
          return;
        }

        if (!range) return;

        const contents = editor.getContents();
        let currentPos = 0;
        const wildcardsMap: Array<{ start: number; end: number }> = [];

        // Find all wildcard positions (with Embed blots, they have length 1)
        for (const op of contents.ops) {
          // Check if this is a wildcard embed blot
          const opInsert = op.insert as Record<string, unknown>;
          const isWildcard =
            typeof opInsert === "object" && opInsert?.wildcard === true;

          if (isWildcard) {
            wildcardsMap.push({ start: currentPos, end: currentPos + 1 });
            currentPos += 1;
          } else if (typeof op.insert === "string") {
            currentPos += op.insert.length;
          } else {
            currentPos += 1;
          }
        }

        // Check if cursor is inside any wildcard
        for (const wildcard of wildcardsMap) {
          if (range.index > wildcard.start && range.index < wildcard.end + 1) {
            // Move cursor to after the wildcard
            editor.setSelection(wildcard.end, 0);
            // Ensure focus is maintained on the editor
            editor.focus();
            break;
          }
        }
      });

      // Add click handler to move cursor to end when wildcard is clicked
      const editorContainer = editor.container;
      if (editorContainer) {
        editorContainer.addEventListener("click", (e: Event) => {
          const target = e.target as HTMLElement;
          // Check if clicked element is a wildcard blot
          if (
            target.classList.contains("ql-wildcard") ||
            target.closest(".ql-wildcard")
          ) {
            // Set flag to skip cursor prevention in selection-change
            isWildcardClickRef.current = true;

            e.preventDefault();
            e.stopPropagation();

            // Get total content length to move cursor to the end
            const allContents = editor.getContents();
            const endPosition = calculateContentLength(allContents);

            // Move cursor to end of content
            setTimeout(() => {
              editor.setSelection(endPosition, 0);
              editor.focus();
            }, 0);
          }
        });
      }
    } catch {
      // Editor not yet initialized, silently fail
      console.debug("preventCursorInWildcard: Editor not ready yet");
    }
  }, [quillRef]);

  /**
   * @method handleTextChange
   * @description Processes text changes from the editor
   * Triggers wildcard auto-detection and replacement
   * @return {void}
   */
  const handleTextChange = useCallback(() => {
    // Detect and auto-replace wildcards when user types
    detectAndReplaceWildcards();
  }, [detectAndReplaceWildcards]);

  /**
   * @method getEditorModules
   * @description Returns the Quill editor modules configuration
   * Includes custom keyboard bindings for wildcard-aware backspace handling
   * @return {Object} Quill modules configuration
   */
  const getEditorModules = useCallback(() => {
    return {
      toolbar: { container: "#toolbar" },
      keyboard: {
        bindings: {
          backspaceWildcard: {
            key: "Backspace",
            handler: getWildcardAwareBackspaceHandler(),
          },
        },
      },
    };
  }, [getWildcardAwareBackspaceHandler]);

  /**
   * @method renderVariableDropdown
   * @description Renders the variable selection dropdown menu
   * @return {ReactNode} Dropdown JSX element or null
   */
  const renderVariableDropdown = useCallback((): ReactNode => {
    if (!showDropdown) return null;

    return (
      <CNestedMenu
        showSearch={true}
        anchorEl={variableAnchorEl}
        menuItems={variables}
        onClose={() => setShowDropdown(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        onMenuItemSelect={insertWildcardFromDropdown}
        className="editor__wrapper-dropdown"
        {...nestedMenuProps}
      />
    );
  }, [
    showDropdown,
    variableAnchorEl,
    variables,
    insertWildcardFromDropdown,
    nestedMenuProps,
  ]);

  return {
    handleTextChange,
    insertWildcardFromDropdown,
    getWildcardAwareBackspaceHandler,
    preventCursorInWildcard,
    renderVariableDropdown,
    showDropdown,
    setShowDropdown,
    variableAnchorEl,
    setVariableAnchorEl,
    getEditorModules,
  };
};

export default useWildcardVariableManager;
