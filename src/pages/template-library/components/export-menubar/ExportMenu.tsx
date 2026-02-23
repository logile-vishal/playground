import { forwardRef, useEffect, useState, type ForwardedRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Box, Menu, MenuItem, Typography } from "@mui/material";

import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
} from "@/utils/export-to-file";
import { isNonEmptyValue } from "@/utils";
import SvgIcon from "@/core/components/icon/Icon";
import { CSV, Excel, Pdf, Printer } from "@/core/constants/icons";
import clsx from "@/utils/clsx";

import type {
  ExportDataType,
  ExportMenuProps,
} from "../../types/template-library.type";
import { useTemplateLibraryTranslations } from "../../translation/useTemplateLibraryTranslations";
import "./ExportMenu.scss";

/**
 * @method getExportFileName
 * @description Extracts template/report name from export data for use as filename
 * @param {ExportDataType} data - The export data object
 * @return {string} The template name or default "template"
 */
const getExportFileName = (data: ExportDataType): string => {
  if (!data || Array.isArray(data)) return "template";

  if ("templateName" in data && data.templateName) {
    return data.templateName;
  }

  if ("name" in data && data.name) {
    return data.name;
  }

  return "template";
};

const RenderExportMenu = forwardRef(
  (props: ExportMenuProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      exportMenu,
      handleExportMenuClose,
      exportData,
      exportMethod = () => [],
    } = props;
    const [isDisabled, setIsDisabled] = useState(false);
    const printRef = ref as React.RefObject<HTMLDivElement>;
    const { EXPORT_MODAL } = useTemplateLibraryTranslations();
    const handlePrint = useReactToPrint({
      contentRef: printRef,
      documentTitle: "table-print",
    });

    const handleExcelExport = () => {
      if (!isNonEmptyValue(exportData)) return;

      const data = exportMethod(exportData);
      if (!data || data.length === 0) return;

      const fileName = getExportFileName(exportData);
      exportToExcel(data, `${fileName}.xlsx`);
    };

    const handleCSVExport = () => {
      if (!isNonEmptyValue(exportData)) return;

      const data = exportMethod(exportData);
      if (!data || data.length === 0) return;

      const fileName = getExportFileName(exportData);
      exportToCSV(data, `${fileName}.csv`);
    };

    const handlePdfExport = () => {
      if (!isNonEmptyValue(exportData)) return;

      const data = exportMethod(exportData);
      if (!data || data.length === 0) return;

      const fileName = getExportFileName(exportData);
      exportToPDF(data, `${fileName}.pdf`);
    };

    useEffect(() => {
      setIsDisabled(!isNonEmptyValue(exportData));
    }, [exportData]);

    return (
      <Menu
        anchorEl={exportMenu?.anchorEl}
        open={exportMenu?.status}
        onClose={() => handleExportMenuClose()}
        elevation={0}
        slotProps={{
          paper: {
            className: clsx({
              "template-library-export-menu-paper": true,
              "template-library-export-menu-paper--disabled": isDisabled,
            }),
          },
        }}
        className={clsx({
          "template-library-export-menu-wrapper": true,
          "template-library-export-menu-wrapper--disabled": isDisabled,
        })}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem disableRipple>
          <Box className="template-library-export-menu">
            <div className="template-library-export-menu__title">
              {EXPORT_MODAL.title}
            </div>
            <Box className="template-library-export-menu__tools-wrapper">
              <Box
                onClick={handlePrint}
                className="template-library-export-menu__tools-item"
              >
                <SvgIcon
                  component={Printer}
                  fill="var(--logile-utility-blue-dark-600)"
                  size={15}
                />
                <Typography className="template-library-export-menu__tools-item-label">
                  {EXPORT_MODAL.print}
                </Typography>
              </Box>
              <Box
                onClick={handlePdfExport}
                className="template-library-export-menu__tools-item"
              >
                <SvgIcon
                  component={Pdf}
                  fill="var(--logile-utility-red-dark-600)"
                  size={15}
                />
                <Typography className="template-library-export-menu__tools-item-label">
                  {EXPORT_MODAL.pdf}
                </Typography>
              </Box>

              <Box
                onClick={handleExcelExport}
                className="template-library-export-menu__tools-item"
              >
                <SvgIcon
                  component={Excel}
                  fill="var(--logile-utility-green-dark-600)"
                  size={15}
                />
                <Typography className="template-library-export-menu__tools-item-label">
                  {EXPORT_MODAL.excel}
                </Typography>
              </Box>

              <Box
                onClick={handleCSVExport}
                className="template-library-export-menu__tools-item"
              >
                <SvgIcon
                  component={CSV}
                  fill="var(--logile-utility-teal-dark-600)"
                  size={15}
                />
                <Typography className="template-library-export-menu__tools-item-label">
                  {EXPORT_MODAL.csv}
                </Typography>
              </Box>
            </Box>
          </Box>
        </MenuItem>
      </Menu>
    );
  }
);

export default RenderExportMenu;
