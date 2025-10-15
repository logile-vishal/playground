import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { alpha,  ListItemButton, Stack, styled, Typography } from '@mui/material';

import SvgIcon from '@/core/components/icon/Icon';
import { useGetViewPortSize } from '@/utils/get-viewport-size';
import type { ICONS } from '@/core/constants/icons';
import clsx from '@/utils/clsx';

import './Sidebar.scss';

type SidebarProps = {
  activePath: string;
  sidebarRef?: React.Ref<HTMLDivElement>;
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
    },
    "&::before":{
      content:`""`,
      position:"absolute",
      top:"50%",
      borderStartEndRadius:".4rem",
      borderEndEndRadius:".4rem",
      left:0,
      width:"0.3rem",
      height:"3.6rem",
      transform:"translateY(-50%)",
      backgroundColor: activePath ? (theme.palette.primary.main) : "transparent",
    }
}));

const Sidebar: React.FC<SidebarProps> = ({ activePath, sidebarRef }) => {
  const [appSwitchValue,setAppSwitchValue] = useState<"IMS"|"WFM">("IMS");
  const viewportSize = useGetViewPortSize();
  const handleSwitchAppName = ()=>{
    setAppSwitchValue(prev=> prev == 'IMS' ? 'WFM':'IMS')
  }
  const navlistItems = navLinkOptions['IMS'];

    const isDesktop = viewportSize === 'xl';
  return (
 <Stack className='sidebar' ref={sidebarRef}>
  <div className='sidebar__switch'>
    <div  onClick={handleSwitchAppName}>
    <SvgIcon component='exchange' size={18} fill="var(--icon-state-information)"/>
    <Typography className='sidebar__switch-text'>{appSwitchValue}</Typography>
    </div>
  </div>

    <Stack className='sidebar__list'>
      {navlistItems.map((item) => {
        const isActive = activePath === item.path;  
      
          return <StyledListItemButton component={Link} to={item.path} activePath={isActive}>
            <SvgIcon component={item.icon} size={24} fill={isActive ? 'currentColor' : 'var(--icon-secondary)'}/>
                <Typography className={clsx({
                  'sidebar__list-item-label': true,
                  'layout-desktop': isDesktop,
                  'layout-tablet': !isDesktop
                })}>{item.text}</Typography>
          </StyledListItemButton>
      
      })}
    </Stack>
</Stack>
)};

export default Sidebar;
