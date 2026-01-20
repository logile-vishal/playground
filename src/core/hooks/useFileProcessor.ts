import { useState, useEffect } from "react";

export type FileCategory =
  | "image"
  | "pdf"
  | "word"
  | "excel"
  | "csv"
  | "unknown";

export type ProcessedFile = {
  file: File;
  category: FileCategory;
  mimeType: string;
};

export type FileProcessorResult = {
  processedFiles: ProcessedFile[];
  categorizedFiles: Record<FileCategory, ProcessedFile[]>;
};

const FILE_TYPE_MAP: Record<string, FileCategory> = {
  // Images
  "image/jpeg": "image",
  "image/jpg": "image",
  "image/png": "image",
  "image/gif": "image",
  "image/webp": "image",
  "image/svg+xml": "image",

  // PDF
  "application/pdf": "pdf",

  // Word
  "application/msword": "word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.macro-enabled.document":
    "word",

  // Excel
  "application/vnd.ms-excel": "excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.macro-enabled.sheet":
    "excel",

  // CSV
  "text/csv": "csv",
  "text/plain": "csv",
};

export const useFileProcessor = (files: File[] | null): FileProcessorResult => {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [categorizedFiles, setCategorizedFiles] = useState<
    Record<FileCategory, ProcessedFile[]>
  >({
    image: [],
    pdf: [],
    word: [],
    excel: [],
    csv: [],
    unknown: [],
  });

  useEffect(() => {
    if (!files || files.length === 0) {
      setProcessedFiles([]);
      setCategorizedFiles({
        image: [],
        pdf: [],
        word: [],
        excel: [],
        csv: [],
        unknown: [],
      });
      return;
    }

    const processed: ProcessedFile[] = files.map((file) => {
      const category: FileCategory =
        FILE_TYPE_MAP[file.type] ||
        (file.name.endsWith(".csv") ? "csv" : "unknown");

      return {
        file,
        category,
        mimeType: file.type,
      };
    });

    setProcessedFiles(processed);

    // Categorize files
    const categorized: Record<FileCategory, ProcessedFile[]> = {
      image: [],
      pdf: [],
      word: [],
      excel: [],
      csv: [],
      unknown: [],
    };

    processed.forEach((pf) => {
      categorized[pf.category].push(pf);
    });

    setCategorizedFiles(categorized);
  }, [files]);

  return {
    processedFiles,
    categorizedFiles,
  };
};
