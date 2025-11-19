
import { Box, Menu, MenuItem, Typography, type MenuProps } from '@mui/material';
import { styled } from "@mui/material/styles";

import SvgIcon from '@/core/components/icon/Icon';
import { Doc, Excel, Pdf, Printer } from '@/core/constants/icons';

import type { ExportMenuProps } from '../../types/template-library.type';
import "./ExportMenu.scss";
import { EXPORT_MODAL } from '../../constants/constant';

const StyledExportMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 'var(--radius-s)',
    marginTop: theme.spacing(1),
    minWidth: 180,
    border: '1px solid var(--border-secondary)',
    color: 'var(--text-primary)',
    padding: '0',
    boxShadow: 'none',
    '& .MuiMenuItem-root': {
        fontSize:'var(--size-body)',
        fontWeight: 'var(--weight-400)',
        color: 'var(--text-primary)',
        padding: 'var(--space-s) var(--space-l)',
      '& .MuiSvgIcon-root': {
        fontSize: 'var(--size-body-large)',
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
        ...theme.applyStyles('dark', {
          color: 'inherit',
        }),
      },
      '&:focus, &:hover, &:active':{
        background: 'transparent',
      },
    },
    ...theme.applyStyles('dark', {
      color: 'var(--text-tertiary)',
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
                <MenuItem
                  disableRipple
                >
                  <Box className="template-library-export-menu">
                    <Typography className='template-library-export-menu__title'>{EXPORT_MODAL.title}</Typography>
                    <Box className="template-library-export-menu__tools-wrapper">
                      <Box className="template-library-export-menu__tools-item">
                          <SvgIcon component={Printer} fill="var(--icon-state-information-bold)" size={15} />
                          <Typography className="template-library-export-menu__tools-item-label">{EXPORT_MODAL.print}</Typography>
                        </Box>
                      <Box className="template-library-export-menu__tools-item">
                          <SvgIcon component={Pdf} fill="var(--icon-state-violation)" size={15} />
                          <Typography className="template-library-export-menu__tools-item-label">{EXPORT_MODAL.pdf}</Typography>
                        </Box>
 
                        <Box className="template-library-export-menu__tools-item">
                          <SvgIcon component={Excel} fill="var(--icon-state-success)" size={15} />
                          <Typography className="template-library-export-menu__tools-item-label">{EXPORT_MODAL.excel}</Typography>
                        </Box>
                        
                        <Box className="template-library-export-menu__tools-item">
                          <SvgIcon component={Doc} fill="var(--teal-base)" size={15} />
                          <Typography className="template-library-export-menu__tools-item-label">{EXPORT_MODAL.csv}</Typography>
                        </Box>
                    </Box>
                  </Box>
                </MenuItem>
            </StyledExportMenu>
      )
}

export default RenderExportMenu;