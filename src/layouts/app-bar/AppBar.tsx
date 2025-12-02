import React, { useContext } from "react";
import Typography from "@mui/material/Typography";
import { Badge, ButtonBase, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

import { defaultConstants } from "@/core/constants/app-constants";
import clientLogo from "@/assets/logile-logo.svg";
import IconButton from "@/core/components/button/IconButton";
import navAvatarPng from "@/assets/navbar-avatar.png";
import SvgIcon from "@/core/components/icon/Icon";
import { ThemeContext } from "@/theme-mui/ThemeContext";
import {
  CalendarBlank,
  ClipboardToDo,
  Envelope,
  Hamburger,
  Moon,
  Sun,
  Comment,
  Notification,
  Search,
} from "@/core/constants/icons";

import UserProfileInfoCard from "./components/user-profile/UserProfileInfoCard";
import NavSearchBar from "./components/search-bar/SearchBar";
import "./AppBar.scss";

type AppBarProps = {
  handleToggleMenu: () => void;
};

const MainMenu = styled(ButtonBase)(() => ({
  "&.MuiButton-root": {
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "max-content",
  },
  ".MuiButton-startIcon": {
    margin: 0,
  },
}));

const AppBar: React.FC<AppBarProps> = ({ handleToggleMenu }) => {
  const { mode, toggleColorMode } = useContext(ThemeContext);

  const handleThemeToggle = () => {
    toggleColorMode();
  };

  const handleSearch = (value: string) => {
    console.log(value);
  };
  return (
    <div className="appbar">
      {/* Logo Section */}
      <div className="appbar__left-section">
        <MainMenu onClick={handleToggleMenu}>
          <SvgIcon
            component={Hamburger}
            size={24}
            color="primary"
          />
        </MainMenu>

        <div className="appbar__logo-box">
          <img src={clientLogo} />
          <Typography
            sx={(theme) => ({
              color: theme.palette.primary.main,
              marginLeft: ".8rem",
              fontSize: "1.5rem",
              fontWeight: "var(--logile-weight-500)",
              lineHeight: "2rem",
            })}
          >
            {defaultConstants.appAbbr}
          </Typography>
        </div>
      </div>

      {/* Search Bar */}
      <Stack className="appbar__search-bar">
        <NavSearchBar
          placeholder="Search..."
          onSearch={handleSearch}
          iconPosition="left"
          icon={Search}
        />
      </Stack>

      <div className="appbar__right-section">
        {/* Icons Section */}
        <Stack className="action-icons-box">
          <IconButton
            variant="primary"
            style={{ padding: "1rem" }}
            onClick={handleThemeToggle}
          >
            {mode === "light" ? (
              <SvgIcon
                component={Moon}
                color="secondary"
                size={18}
              />
            ) : (
              <SvgIcon
                component={Sun}
                color="warning"
                size={20}
              />
            )}
          </IconButton>
          <IconButton
            variant="primary"
            style={{
              padding: "1rem",
            }}
          >
            <SvgIcon
              component={CalendarBlank}
              color="secondary"
              size={20}
            />
          </IconButton>
          <IconButton
            variant="primary"
            style={{
              padding: "1rem",
            }}
          >
            <SvgIcon
              component={ClipboardToDo}
              color="secondary"
              size={20}
            />
          </IconButton>
          <IconButton
            variant="primary"
            style={{
              padding: "1rem",
            }}
          >
            <SvgIcon
              component={Envelope}
              color="secondary"
              size={20}
            />
          </IconButton>
          <IconButton
            variant="primary"
            style={{
              padding: "1rem",
            }}
          >
            <SvgIcon
              component={Comment}
              color="secondary"
              size={20}
            />
          </IconButton>

          <Badge
            className="notifiction-badge"
            badgeContent={"59+"}
            color="error"
            overlap="rectangular"
          >
            <IconButton
              variant="primary"
              style={{
                padding: "1rem",
              }}
            >
              <SvgIcon
                component={Notification}
                color="secondary"
                size={20}
              />
            </IconButton>
          </Badge>
        </Stack>
        {/* User Profile Section */}
        <UserProfileInfoCard
          user={{
            name: "Nathaniel Sheetz",
            role: "Assoc. Vice President",
            avatar: navAvatarPng,
          }}
        />
      </div>
    </div>
  );
};

export default AppBar;
