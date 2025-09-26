import React, { useContext } from 'react';
import Typography from '@mui/material/Typography';
import { defaultConstants } from '@/core/constants/app-constants';
import clientLogo from "@/assets/logile-logo.svg"
import { Badge, Box, Button, Stack } from '@mui/material';
import IconButton from '@/core/components/button/IconButton';
import UserProfileInfoCard from './components/user-profile/UserProfileInfoCard';
import navAvatarPng from '@/assets/navbar-avatar.png'
import NavSearchBar from './components/search-bar/SearchBar';
import SvgIcon from '@/core/components/icon/Icon';
import { styled } from "@mui/material/styles";
import "./AppBar.scss";
import { ThemeContext } from '@/theme-mui/ThemeProvider';
interface AppBarProps {
  handleToggleMenu: () => void,
}

const MainMenu = styled(Button)(() => ({
  '&.MuiButton-root': {
    minWidth: 'auto',
    padding: '6px 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // border:'1px solid gray',
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
  return <Stack className='app-bar-main-container' component={"header"}
  >
    <div className='logo-section'>
      {/* Logo Section */}
      <Stack direction={"row"} sx={{
        height: "fit-content",
        alignItems: "center"
      }}>
            <Box sx={{marginRight: "2.4rem"}}>
          <MainMenu onClick={handleToggleMenu} startIcon={
            <SvgIcon component="hamburger" size={24} fill="var(--icon-primary)" />
          }>

          </MainMenu>
        </Box>

        <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
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
        </Stack>
    
       
      </Stack>

      {/* Search Bar */}
      <Stack sx={{ marginLeft: "auto", maxWidth:"24rem", maxHeight:"3.6rem" }}>
        <NavSearchBar placeholder='Search...' onSearch={handleSearch} iconPosition='left' icon='search' />
      </Stack>
      {/* Icons Section */}
      <Stack sx={{ marginLeft: "var(--space-4xl)", gap: "var(--space-xs)", flexDirection: "row" }}>
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
        <Badge badgeContent={'59+'}  sx={{
    "& .MuiBadge-badge": {
      top:".4rem", 
      fontWeight: "var(--weight-400)",
      fontSize: "1.5rem",
    },
  }}color="error" overlap="rectangular" >
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
  </Stack>
};

export default AppBar;
