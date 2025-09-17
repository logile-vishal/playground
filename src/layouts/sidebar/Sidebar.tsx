import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { alpha, ButtonBase, ListItemButton, Stack, styled, Typography } from '@mui/material';
import './sidebar.style.scss'
import SvgIcon from '@/core/components/Icon';
import type { icons } from '@/core/constants/Icons';
import { useGetViewPortSize } from '@/utils/getViewPortSize';

interface SidebarProps {
  activePath: string;
  sidebarRef?: React.Ref<HTMLDivElement>;
}

const menuItems: {
  text: string;
  path:string;
  icon: keyof typeof icons
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

const StyledListItemButton = styled(ListItemButton,{
  shouldForwardProp: (prop) => prop !== 'activePath',
})<{activePath?: boolean, component?: React.ElementType, to?: string}>(({ theme,activePath }) => ({
  display:"flex",
  alignItems:"center",
  flexDirection:"column",
  justifyContent:"center",
  padding:"var(--space-md)",
  borderRadius:theme.shape.borderRadius,
  gap:".4rem",
  width:"100%",
  overflow:"hidden",
  whiteSpace:"normal",
  backgroundColor: activePath ? alpha(theme.palette.primary.main,0.1) : "transparent",
  color:activePath ? theme.palette.primary.main : "inherit",
  
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
  return (
 <Stack className='sidebar__container' ref={sidebarRef}>
  <div className='sidebar__switch'>
    <ButtonBase  disableRipple disableTouchRipple onClick={handleSwitchAppName}>
    <SvgIcon component='exchange' size={18} fill={'currentColor'}/>
    <Typography sx={()=>({
      textAlign:'center',
      fontWeight:500,
      lineHeight:'2.2rem',
      transition:'ease-in-out 1s',
      fontSize:"1.7rem"
    })}>{appSwitchValue}</Typography>
    </ButtonBase>
    </div>

    <Stack className='sidebar__list'>
      {menuItems.map((item) => {
        const isActive = activePath === item.path;  
        const isLargeView = viewportSize === 'xl';
          return <StyledListItemButton component={Link} to={item.path} activePath={isActive}>
            <SvgIcon component={item.icon} size={24} fill={isActive ? 'currentColor' : 'var(--icon-color-secondary)'}/>
                <Typography sx={()=>({
                  textAlign:'center',
                  fontSize: isLargeView ? "1.2rem": "1rem",
                  width: !isLargeView ? "7.1rem": "auto",
                  fontWeight:"inherit",
                  textOverflow: !isLargeView ? "ellipsis": "unset",
                  overflow:"hidden",
                  transition:'ease-in-out 1s',
                })}>{item.text}</Typography>
          </StyledListItemButton>
      
      })}
    </Stack>
</Stack>
)};

export default Sidebar;
