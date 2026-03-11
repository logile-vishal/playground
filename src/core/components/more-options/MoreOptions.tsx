import React, { useState } from "react";
import classNames from "classnames";
import { Popover } from "@mui/material";
import type { MoreOptionsProps } from "@/core/types/more-options.type";
import MoreOptionsPopover from "./MoreOptionsPopover";
import ManageColumnsPanel from "./ManageColumnsPanel";
import "./more-options.scss";

const MoreOptionIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 6C13.1046 6 14 5.10457 14 4C14 2.89543 13.1046 2 12 2C10.8954 2 10 2.89543 10 4C10 5.10457 10.8954 6 12 6ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM14 20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20C10 18.8954 10.8954 18 12 18C13.1046 18 14 18.8954 14 20Z" />
  </svg>
);

export const MoreOptions: React.FC<MoreOptionsProps> = ({
  className,
  compactView = false,
  rowStriping = false,
  columnGridlines = false,
  onCompactViewChange,
  onRowStripingChange,
  onColumnGridlinesChange,
  showPrint = true,
  showPdf = true,
  showExcel = true,
  showCsv = true,
  onPrint,
  onPdf,
  onExcel,
  onCsv,
  showManageColumn = true,
  columns = [],
  onColumnsChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [view, setView] = useState<"menu" | "manageColumns">("menu");

  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
    setView("menu"); // reset view
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classNames("more-options", className)}>
      <button
        type="button"
        className={classNames("more-options__trigger", {
          "more-options__trigger--open": open,
        })}
        onClick={handleClick}
        aria-label="More options"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <MoreOptionIcon />
      </button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: "4px",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
              borderRadius: "8px",
              border: "1px solid var(--logile-border-primary, #c1c1c1)",
            },
          },
        }}
      >
        {view === "menu" ? (
          <MoreOptionsPopover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            onManageColumnClick={() => setView("manageColumns")}
            compactView={compactView}
            rowStriping={rowStriping}
            columnGridlines={columnGridlines}
            onCompactViewChange={onCompactViewChange}
            onRowStripingChange={onRowStripingChange}
            onColumnGridlinesChange={onColumnGridlinesChange}
            showPrint={showPrint}
            showPdf={showPdf}
            showExcel={showExcel}
            showCsv={showCsv}
            onPrint={onPrint}
            onPdf={onPdf}
            onExcel={onExcel}
            onCsv={onCsv}
            manageColumnProps={{ visible: showManageColumn }}
          />
        ) : (
          <ManageColumnsPanel
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            onBack={() => setView("menu")}
            columns={columns}
            onColumnsChange={onColumnsChange}
          />
        )}
      </Popover>
    </div>
  );
};

export default MoreOptions;
