import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { EXPORT_COLUMN_KEYS } from "@/pages/template-library/constants/constant";

/**
 * @method autoFitColumns
 * @description Calculates optimal column widths based on the content length of each cell.
 * Iterates through all rows and determines the maximum width needed for each column.
 * @param {Record<string, string | number>[]} data - Array of row objects containing cell values
 * @returns {{ wch: number }[]} Array of column width objects compatible with XLSX library
 */
const autoFitColumns = (
  data: Record<string, string | number>[]
): { wch: number }[] => {
  const colWidths: number[] = [];

  data?.forEach((row) => {
    Object.values(row).forEach((value, index) => {
      const len = value ? value.toString().length : 10;
      colWidths[index] = Math.max(colWidths[index] || 10, len);
    });
  });

  return colWidths.map((w) => ({ wch: w + 2 }));
};

/**
 * @method getColumnOrder
 * @description Determines the column order for export, ensuring "Content" or "Row Label" columns
 * appear first if they exist. This is particularly useful for grid templates where the
 * content/row label column should be the leftmost column.
 * @param {Record<string, string | number>} firstRow - The first row of data used to extract column keys
 * @returns {string[]} Array of column keys in the desired order
 */
const getColumnOrder = (
  firstRow: Record<string, string | number>
): string[] => {
  const keys = Object.keys(firstRow);

  // If "Content" exists (grid), move it to the front
  if (keys.includes(EXPORT_COLUMN_KEYS.CONTENT)) {
    return [
      EXPORT_COLUMN_KEYS.CONTENT,
      ...keys.filter((k) => k !== EXPORT_COLUMN_KEYS.CONTENT),
    ];
  }

  // If "Row Label" exists, move it to the front (fallback)
  if (keys.includes(EXPORT_COLUMN_KEYS.ROW_LABEL)) {
    return [
      EXPORT_COLUMN_KEYS.ROW_LABEL,
      ...keys.filter((k) => k !== EXPORT_COLUMN_KEYS.ROW_LABEL),
    ];
  }

  return keys;
};

/**
 * @method exportToExcel
 * @description Exports data to an Excel (.xlsx) file. Automatically fits column widths
 * based on content and ensures proper column ordering with Content/Row Label first.
 * Creates a downloadable file that triggers automatic download in the browser.
 * @param {Record<string, string | number>[]} data - Array of row objects to export
 * @param {string} [fileName="table-data.xlsx"] - Name of the output Excel file
 * @returns {void}
 */
export const exportToExcel = (
  data: Record<string, string | number>[],
  fileName = "table-data.xlsx"
): void => {
  if (!data || data.length === 0) return;

  // Get column order with Row Label first if it exists
  const columnOrder = getColumnOrder(data[0]);

  // Reorder all rows according to column order
  const orderedData = data.map((row) => {
    const orderedRow: Record<string, string | number> = {};
    columnOrder.forEach((col) => {
      orderedRow[col] = row[col] !== undefined ? row[col] : "";
    });
    return orderedRow;
  });

  // Convert JSON to Worksheet with explicit column order
  const worksheet = XLSX.utils.json_to_sheet(orderedData, {
    header: columnOrder,
  });

  // Auto-fit column width
  worksheet["!cols"] = autoFitColumns(orderedData);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Convert to binary excel
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Save file
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  // saveAs(blob, fileName);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`;
  a.click();
};

/**
 * @method exportToCSV
 * @description Exports data to a CSV (Comma-Separated Values) file. Values are wrapped
 * in double quotes to handle special characters and commas within content.
 * Ensures proper column ordering with Content/Row Label first.
 * @param {Record<string, string | number>[]} data - Array of row objects to export
 * @param {string} [fileName="table-data.csv"] - Name of the output CSV file
 * @returns {void}
 */
export const exportToCSV = (
  data: Record<string, string | number>[],
  fileName = "table-data.csv"
): void => {
  if (!data || data.length === 0) return;

  // Get column order with Row Label first if it exists
  const columnOrder = getColumnOrder(data[0]);
  const header = columnOrder.join(",");

  const rows = data
    .map((row) =>
      columnOrder
        .map((col) => {
          const value = row[col] !== undefined ? row[col] : "";
          return `"${value}"`;
        })
        .join(",")
    )
    .join("\n");

  const csvString = header + "\n" + rows;

  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.endsWith(".csv") ? fileName : `${fileName}.csv`;
  a.click();
};

/**
 * @method exportToPDF
 * @description Exports data to a PDF file using jsPDF and jspdf-autotable libraries.
 * Creates a styled table with striped rows and appropriate font sizing.
 * Ensures proper column ordering with Content/Row Label first.
 * @param {Record<string, string | number>[]} data - Array of row objects to export
 * @param {string} [fileName="table.pdf"] - Name of the output PDF file
 * @returns {void}
 */
export const exportToPDF = (
  data: Record<string, string | number>[],
  fileName = "table.pdf"
): void => {
  if (!data || data.length === 0) return;

  const doc = new jsPDF();

  // Get column order with Row Label first if it exists
  const columnOrder = getColumnOrder(data[0]);
  const headers = [columnOrder];

  // Get row values in the correct column order
  const rows = data.map((obj) =>
    columnOrder.map((col) => (obj[col] !== undefined ? obj[col] : ""))
  );

  autoTable(doc, {
    head: headers,
    body: rows,
    theme: "striped",
    styles: { fontSize: 10 },
    startY: 15,
  });

  doc.save(fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`);
};
