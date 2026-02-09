import type ReactQuill from "react-quill-new";

import type { NestedMenuProps } from "@/core/components/nested-menu/NestedMenu";
import type { MandatoryFormElementProps } from "./form-element.type";
import type { IdentifierProps } from "@/core/types/IdentifierProps.type";

export type RichTextEditorProps = MandatoryFormElementProps &
  IdentifierProps & {
    value?: ReactQuill.Value | string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    nestedProps?: NestedMenuProps;
    variables?: WildcardVariable[];
    attachments?: File[];
    onUpdateAttachments?: (files: File[]) => void;
    onVariableInserted?: (variable: string) => void;
    helperText?: string;
    isInlineLabel?: boolean;
    showOnlyWildcard?: boolean;
    className?: string;
  };

export type WildcardVariable = {
  label: string;
  value: string;
};

export type WildcardVariableManagerProps = {
  quillRef: React.RefObject<ReactQuill>;
  variables?: WildcardVariable[];
  nestedMenuProps?: NestedMenuProps;
  onVariableInserted?: (variable: string) => void;
};

export type ToolbarProps = {
  quillRef: React.RefObject<ReactQuill>;
  attachments?: File[];
  onUpdateAttachments?: (files: File[]) => void;
  onVariableButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  walkMeIdPrefix?: string[];
  showOnlyWildcard?: boolean;
  toolbarId?: string;
};
