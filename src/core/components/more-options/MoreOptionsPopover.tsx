import React from "react";
import CSwitch from "@/core/components/form/switch/Switch";
import type { MoreOptionsPopoverProps } from "@/core/types/more-options.type";

import ChevronRightIcon from "@/assets/icons/arrow/chevron-right-large.svg?react";
import PrintIcon from "@/assets/icons/common-icons/print.svg?react";
import PdfIcon from "@/assets/icons/file-type/pdf.svg?react";
import ExcelIcon from "@/assets/icons/file-type/excel.svg?react";
import CsvIcon from "@/assets/icons/file-type/csv.svg?react";

const MoreOptionsPopover: React.FC<MoreOptionsPopoverProps> = ({
  onManageColumnClick,
  compactView,
  rowStriping,
  columnGridlines,
  onCompactViewChange,
  onRowStripingChange,
  onColumnGridlinesChange,
  showPrint,
  showPdf,
  showExcel,
  showCsv,
  onPrint,
  onPdf,
  onExcel,
  onCsv,
  manageColumnProps
}) => {
  return (
    <div className="more-options__popover">
      {manageColumnProps.visible && (
        <button
          type="button"
          className="more-options__menu-item"
          onClick={onManageColumnClick}
        >
          <span>Manage Column</span>
          <ChevronRightIcon className="more-options__chevron-icon" />
        </button>
      )}

      <div className="more-options__menu-item">
        <span>Compact View</span>
        <CSwitch
          checked={compactView}
          onChange={(e) => onCompactViewChange?.((e.target as HTMLInputElement).checked)}
          size="small"
        />
      </div>

      <div className="more-options__menu-item">
        <span>Row Striping</span>
        <CSwitch
          checked={rowStriping}
          onChange={(e) => onRowStripingChange?.((e.target as HTMLInputElement).checked)}
          size="small"
        />
      </div>

      <div className="more-options__menu-item">
        <span>Column Gridlines</span>
        <CSwitch
          checked={columnGridlines}
          onChange={(e) => onColumnGridlinesChange?.((e.target as HTMLInputElement).checked)}
          size="small"
        />
      </div>

      {(showPrint || showPdf || showExcel || showCsv) && (
        <>
          <div className="more-options__menu-item more-options__menu-item--export-title">
            <span>Export</span>
          </div>
          <div className="more-options__export-grid">
            {showPrint && (
              <button className="more-options__export-btn more-options__export-btn--print" onClick={onPrint} title="Print">
                <PrintIcon />
                <span>Print</span>
              </button>
            )}
            {showPdf && (
              <button className="more-options__export-btn more-options__export-btn--pdf" onClick={onPdf} title="Export PDF">
                <PdfIcon />
                <span>PDF</span>
              </button>
            )}
            {showExcel && (
              <button className="more-options__export-btn more-options__export-btn--excel" onClick={onExcel} title="Export Excel">
                <ExcelIcon />
                <span>Excel</span>
              </button>
            )}
            {showCsv && (
              <button className="more-options__export-btn more-options__export-btn--csv" onClick={onCsv} title="Export CSV">
                <CsvIcon />
                <span>CSV</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MoreOptionsPopover;
