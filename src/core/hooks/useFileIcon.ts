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
  csv: Excel,
  pdf: Pdf,
  unknown: PlainTextFile,
};

const COLOR_MAP: Record<
  FileCategory,
  "brand-primary" | "primary" | "success" | "violation"
> = {
  word: "brand-primary",
  csv: "success",
  excel: "success",
  pdf: "violation",
  image: "brand-primary",
  unknown: "primary",
};

/**
 * @function getFileCategoryFromExtension
 * @description Extracts file extension from filename and returns file category
 * @param {string} fileName - The file name (e.g., 'document.pdf', 'image.png')
 * @return {FileCategory} File category (image, pdf, word, excel, csv, unknown)
 */
const getFileCategoryFromExtension = (fileName: string): FileCategory => {
  if (!fileName) return "unknown";

  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  const extensionMap: Record<string, FileCategory> = {
    // Images
    jpg: "image",
    jpeg: "image",
    png: "image",
    gif: "image",
    webp: "image",
    svg: "image",
    // PDF
    pdf: "pdf",
    // Word
    doc: "word",
    docx: "word",
    docm: "word",
    // Excel
    xls: "excel",
    xlsx: "excel",
    xlsm: "excel",
    // CSV
    csv: "csv",
  };

  return extensionMap[extension] || "unknown";
};

/**
 * @hook useFileIcon
 * @description Returns the appropriate icon and color based on file name extension
 * @param {string} fileName - The file name to extract extension from
 * @return {FileIconResult} Object containing icon component and color name
 */
export const useFileIcon = (fileName: string): FileIconResult => {
  const category = getFileCategoryFromExtension(fileName);

  return {
    icon: ICON_MAP[category],
    color: COLOR_MAP[category],
  };
};
