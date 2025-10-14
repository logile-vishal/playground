import React, { useContext } from 'react';
import Typography from '@mui/material/Typography';
import { Badge, ButtonBase, Stack } from '@mui/material';
import { styled } from "@mui/material/styles";

import { defaultConstants } from '@/core/constants/app-constants';
import clientLogo from "@/assets/logile-logo.svg"
import IconButton from '@/core/components/button/IconButton';
import navAvatarPng from '@/assets/navbar-avatar.png'
import SvgIcon from '@/core/components/icon/Icon';
import { ThemeContext } from '@/theme-mui/ThemeContext';

import UserProfileInfoCard from './components/user-profile/UserProfileInfoCard';
import NavSearchBar from './components/search-bar/SearchBar';
import "./AppBar.scss";

interface AppBarProps {
  handleToggleMenu: () => void,
}

const MainMenu = styled(ButtonBase)(() => ({
  '&.MuiButton-root': {
    padding:0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width:'max-content',
  },
  '.MuiButton-startIcon' : {
    margin: 0,
  }
}));


const AppBar: React.FC<AppBarProps> = ({  handleToggleMenu }) => {
  const { mode, toggleColorMode } = useContext(ThemeContext);

  const handleThemeToggle = () => {
    toggleColorMode();
  };

  const handleSearch = (value: string) => {
    console.log(value)
  }
  return <div className='app-bar'
  >
      {/* Logo Section */}
      <div className='app-bar__left-section'>

        
          <MainMenu onClick={handleToggleMenu}> 
               <SvgIcon component="hamburger" size={24} fill="var(--icon-primary)" />
          </MainMenu>
    

        <div className='app-bar__logo-box' >
        <img src={clientLogo} />
         <Typography sx={(theme) => ({
          color: theme.palette.primary.main,
          marginLeft: ".8rem",
          fontSize: "1.5rem",
          fontWeight: "var(--weight-500)",
          lineHeight: '2rem',
          
        })}>
          {defaultConstants.appAbbr}
        </Typography>
        </div>

      </div>
  

      {/* Search Bar */}
      <Stack className='app-bar__search-bar'>
        <NavSearchBar placeholder='Search...' onSearch={handleSearch} iconPosition='left' icon='search' />
      </Stack>

      <div className='app-bar__right-section'>
      {/* Icons Section */}
      <Stack className='action-icons-box' >
        <IconButton variant="primary" style={{padding:"1rem"}} onClick={handleThemeToggle}>
          {mode === "light" ? (
            <SvgIcon component="moon" fill={"var(--icon-secondary)"} size={18} />
          ) : (
            <SvgIcon component="sun" fill={"var(--icon-state-warning)"} size={20} />
          )}
        </IconButton>
        <IconButton variant="primary" style={{
          padding:"1rem"
        }}>
          <SvgIcon component="calendarBlank" fill={"var(--icon-secondary)"} size={20}  />
        </IconButton>
        <IconButton variant="primary" style={{
          padding:"1rem"
        }}>
          <SvgIcon component="clipboardToDo" fill={"var(--icon-secondary)"} size={20} />
        </IconButton>
        <IconButton variant="primary" style={{
          padding:"1rem"
        }}>
          <SvgIcon component="envelope" fill={"var(--icon-secondary)"} size={20} />
        </IconButton>
        <IconButton variant="primary"  style={{
          padding:"1rem"
        }}>
          <SvgIcon component="comment" fill={"var(--icon-secondary)"} size={20} />
        </IconButton>
        
        <Badge className='notifiction-badge' badgeContent={'59+'}  
        color="error" overlap="rectangular">

        <IconButton variant="primary" style={{
          padding:"1rem",
          
        }}>
          <SvgIcon component="notification" fill={"var(--icon-secondary)"} size={20} />
        </IconButton>
          </Badge>
      </Stack>
      {/* User Profile Section */}
          <UserProfileInfoCard user={{ name: "Nathaniel Sheetz", role: "Assoc. Vice President", avatar: navAvatarPng }} />
   
      </div>

  </div>
};

export default AppBar;
