import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { alpha, Box, Drawer, ListItemButton, Stack, styled, Typography } from '@mui/material';

import SvgIcon from '@/core/components/icon/Icon';
import type { ICONS } from '@/core/constants/icons';
import { defaultConstants } from '@/core/constants/app-constants';
import { useIsDesktopViewport } from '@/utils/get-viewport-size';
import clsx from '@/utils/clsx';

import './Sidebar.scss';

type SidebarProps = {
  activePath: string;
  sidebarRef?: React.Ref<HTMLDivElement>;
  showMenu: boolean;
  handleMenuClose: ()=>void;
}


const imsNavLinks: {
  text: string;
  path:string;
  icon: keyof typeof ICONS
}[] = [
  { text: 'Home', path: '/', icon: 'home' },
  { text: 'Quick Links', path: '/quickLinks', icon: 'quickLink' },
  { text: 'ESS', path: '/ess', icon: 'calendar' },
  { text: 'Communication', path: '/communication', icon: 'communication' },
  { text: 'Standards', path: '/standards', icon: 'standards' },
  { text: 'Labour Model', path: '/labourModel', icon: 'labourModel' },
  { text: 'Forecast', path: '/forecast', icon: 'forecast' },
  { text: 'Staffing', path: '/staffing', icon: 'staffing' },
  { text: 'Labour Report', path: '/labourReport', icon: 'labourReport' },
  { text: 'Food Safety', path: '/foodSafety', icon: 'foodSafety' },
  { text: 'Queue Management', path: '/queueManagement', icon: 'queueManagement' },

]
const wfmNavLinks: {
  text: string;
  path:string;
  icon: keyof typeof ICONS
}[] = [
  { text: 'Home', path: '/', icon: 'home' },
  { text: 'Quick Links', path: '/quickLinks', icon: 'quickLink' },
  { text: 'ESS', path: '/ess', icon: 'calendar' },
  { text: 'Communication', path: '/communication', icon: 'communication' },
 
  { text: 'Queue Management', path: '/queueManagement', icon: 'queueManagement' },

]
const navLinkOptions = {
  'IMS':imsNavLinks,
  'WFM':wfmNavLinks
}
const StyledListItemButton = styled(ListItemButton,{
  shouldForwardProp: (prop) => prop !== 'activePath',
})<{activePath?: boolean, component?: React.ElementType, to?: string}>(({ theme,activePath }) => ({
  display:"flex",
  alignItems:"center",
  flexDirection:"column",
  justifyContent:"center",
  padding:"var(--space-m)",
  borderRadius:theme.shape.borderRadius,
  gap:".4rem",
  width:"100%",
  margin:"var(--space-s) 0",
  overflow:"hidden",
  textOverflow:"ellipsis",
  whiteSpace:"normal",
  backgroundColor: activePath ? alpha(theme.palette.primary.main,0.1) : "transparent",
  color:activePath ? theme.palette.primary.main : "inherit",
  minHeight:'max-content',
  maxHeight:'max-content',
  transition:"all .2s ease-in-out",
  "&:hover":{
    cursor:"pointer",
    backgroundColor: alpha(theme.palette.primary.main,0.1),
    color:theme.palette.primary.main,
    }
}));

const Sidebar: React.FC<SidebarProps> = ({ activePath, sidebarRef, showMenu, handleMenuClose }) => {
  const [appSwitchValue,setAppSwitchValue] = useState<string>(defaultConstants.WFM);
  const isDesktop = useIsDesktopViewport();
  const handleSwitchAppName = ()=>{
    setAppSwitchValue(prev=> prev == defaultConstants.IMS ? defaultConstants.WFM : defaultConstants.IMS)
  }
  const navlistItems = navLinkOptions[defaultConstants.IMS];

  const renderDesktopSwitch = () => {
    return (
      <div className='sidebar__switch'>
        <div onClick={handleSwitchAppName}>
          <SvgIcon component='exchange' size={18} fill="var(--icon-state-information)"/>
          <Typography className='sidebar__switch-text'>{appSwitchValue}</Typography>
        </div>
      </div>
    )
  }

  const renderTabletSwitch = () => {
    const apps = [defaultConstants.WFM, defaultConstants.IMS];

    return <div className="sidebar__app-toggle">
      {apps.map((app) => (
        <button
          key={app}
          className={clsx(
            {
              "sidebar__toggle-item": true,
              "active": appSwitchValue === app 
            }
          )} 
          onClick={() => setAppSwitchValue(app)}
        >
          {defaultConstants[app]}
        </button>
      ))}
    </div>
  };

  const renderSidebarContent = () => {

    return <Stack className='sidebar__content'>
      { isDesktop ? renderDesktopSwitch() : renderTabletSwitch()}
      <Stack className='sidebar__list'>
        {navlistItems.map((item) => {
          const isActive = activePath === item.path;  
        
            return <Box className={clsx({"sidebar__list-container": true, "sidebar__list-mobile-container": !isDesktop})}>
             { isActive && <Box className={clsx({"active-item-box": true,"active-item-mobile": !isDesktop})}></Box>} 
              <StyledListItemButton component={Link} to={item.path} activePath={isActive} className={clsx({'sidebar__list-button-mobile': !isDesktop})}>
              <SvgIcon component={item.icon} size={24} fill={isActive ? 'currentColor' : 'var(--icon-secondary)'}/>
                  <Typography className={clsx({
                    'sidebar__list-item-label': true,
                    'layout-tablet': (() => !isDesktop)()
                  })}>{item.text}</Typography>
            </StyledListItemButton>
            </Box>
        })}
      </Stack>
    </Stack>
  }

  return (
    !isDesktop ?
      <Drawer
        anchor="left"
        open={showMenu}
        onClose={handleMenuClose}
      >
        <Stack className={clsx({"sidebar": true, "sidebar-mobile": !isDesktop})} ref={sidebarRef}>
          {renderSidebarContent()}
        </Stack>
      </Drawer> : 
      <Stack className="sidebar" ref={sidebarRef}>
        {renderSidebarContent()}
      </Stack>
)};

export default Sidebar;
