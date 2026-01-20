import { Photo, Pdf, Excel, Word, PlainTextFile } from "@/core/constants/icons";

import type { FileCategory } from "./useFileProcessor";

type FileIconResult = {
  icon: typeof Pdf;
  color: "brand-primary" | "success" | "violation" | "primary";
};

const ICON_MAP: Record<FileCategory, typeof Pdf> = {
  image: Photo,
  word: Word,
  excel: Excel,
  csv: Word,
  pdf: Pdf,
  unknown: PlainTextFile,
};

const COLOR_MAP: Record<
  FileCategory,
  "brand-primary" | "primary" | "success" | "violation"
> = {
  word: "brand-primary",
  csv: "brand-primary",
  excel: "success",
  pdf: "violation",
  image: "brand-primary",
  unknown: "primary",
};

/**
 * @hook useFileIcon
 * @description Returns the appropriate icon and color based on file category
 * @param {FileCategory} category - The file category (image, pdf, word, excel, csv, unknown)
 * @return {FileIconResult} Object containing icon component and color name
 */
export const useFileIcon = (category: FileCategory): FileIconResult => {
  return {
    icon: ICON_MAP[category],
    color: COLOR_MAP[category],
  };
};
