import type ReactQuill from "react-quill-new";

import type { NestedMenuProps } from "@/core/components/nested-menu/NestedMenu";

import type { MandatoryFormElementProps } from "../components/form/types/form-element.type";
import type { IdentifierProps } from "./IdentifierProps.type";
import type { ProcessedFile } from "../hooks/useFileProcessor";

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

export type AttachmentModalProps = {
  selectedFiles: File[] | null;
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  showAttachmentModal: boolean;
  handleAttachmentClose: () => void;
  handleAttachmentSubmit: (processedFiles: ProcessedFile[] | File[]) => void;
  walkMeIdPrefix?: string[];
  size?: "small" | "medium" | "large";
  title?: string;
  acceptFileFormats?: string;
  confirmBtnText?: string;
};

export type RenderAttachmentGalleryProps = {
  file: ProcessedFile;
  index: number;
  onDelete: (index: number) => void;
  walkMeIdPrefix?: string[];
};

export type RenderPdfGalleryProps = {
  files: ProcessedFile;
  index: number;
  onDelete: (index: number) => void;
  walkMeIdPrefix?: string[];
};
