import { Box, Menu, MenuItem, Typography, type MenuProps } from "@mui/material";
import { styled } from "@mui/material/styles";

import SvgIcon from "@/core/components/icon/Icon";
import { CSV, Excel, Pdf, Printer } from "@/core/constants/icons";

import type { ExportMenuProps } from "../../types/template-library.type";
import "./ExportMenu.scss";
import { EXPORT_MODAL } from "../../constants/constant";

const StyledExportMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "var(--radius-s)",
    marginTop: theme.spacing(1),
    minWidth: 180,
    border: "1px solid var(--logile-border-secondary)",
    color: "var(--logile-text-primary)",
    padding: "0",
    boxShadow: "none",
    "& .MuiMenuItem-root": {
      fontSize: "var(--logile-size-body)",
      fontWeight: "var(--logile-weight-400)",
      color: "var(--logile-text-primary)",
      padding: "var(--space-s) var(--space-l)",
      "& .MuiSvgIcon-root": {
        fontSize: "var(--logile-size-body-large)",
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
        ...theme.applyStyles("dark", {
          color: "inherit",
        }),
      },
      "&:focus, &:hover, &:active": {
        background: "transparent",
      },
    },
    ...theme.applyStyles("dark", {
      color: "var(--logile-text-tertiary)",
    }),
  },
}));

const RenderExportMenu: React.FC<ExportMenuProps> = ({
  exportMenu,
  handleExportMenuClose,
}) => {
  return (
    <StyledExportMenu
      anchorEl={exportMenu?.anchorEl}
      open={exportMenu?.status}
      onClose={() => handleExportMenuClose()}
    >
      <MenuItem disableRipple>
        <Box className="template-library-export-menu">
          <Typography className="template-library-export-menu__title">
            {EXPORT_MODAL.title}
          </Typography>
          <Box className="template-library-export-menu__tools-wrapper">
            <Box className="template-library-export-menu__tools-item">
              <SvgIcon
                component={Printer}
                fill="var(--logile-utility-blue-dark-600)"
                size={15}
              />
              <Typography className="template-library-export-menu__tools-item-label">
                {EXPORT_MODAL.print}
              </Typography>
            </Box>
            <Box className="template-library-export-menu__tools-item">
              <SvgIcon
                component={Pdf}
                fill="var(--logile-utility-red-dark-600)"
                size={15}
              />
              <Typography className="template-library-export-menu__tools-item-label">
                {EXPORT_MODAL.pdf}
              </Typography>
            </Box>

            <Box className="template-library-export-menu__tools-item">
              <SvgIcon
                component={Excel}
                fill="var(--logile-utility-green-dark-600)"
                size={15}
              />
              <Typography className="template-library-export-menu__tools-item-label">
                {EXPORT_MODAL.excel}
              </Typography>
            </Box>

            <Box className="template-library-export-menu__tools-item">
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
    </StyledExportMenu>
  );
};

export default RenderExportMenu;
