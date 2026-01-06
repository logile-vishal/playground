import type ReactQuill from "react-quill-new";

import type { NestedMenuProps } from "@/core/components/nested-menu/NestedMenu";

export type RichTextEditorProps = {
  name?: string;
  value: ReactQuill.Value | string;
  onChange: (content: string) => void;
  placeholder?: string;
  nestedProps?: NestedMenuProps;
  variables?: WildcardVariable[];
  error?: boolean;
  helperText?: string;
  attachments?: File[];
  onUpdateAttachments?: (files: File[]) => void;
  onVariableInserted?: (variable: string) => void;
  walkMeIdPrefix?: string[];
};

export type WildcardVariable = {
  name: string;
  value: string;
};

export type WildcardVariableManagerProps = {
  quillRef: React.RefObject<ReactQuill>;
  variables?: WildcardVariable[];
  nestedMenuProps?: NestedMenuProps;
  onVariableInserted?: (variable: string) => void;
};
