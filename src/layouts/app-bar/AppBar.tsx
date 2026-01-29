import React from "react";
import Typography from "@mui/material/Typography";
import { Badge, ButtonBase, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

import { defaultConstants } from "@/core/constants/app-constants";
import CIconButton from "@/core/components/button/IconButton";
import navAvatarPng from "@/assets/navbar-avatar.png";
import CSvgIcon from "@/core/components/icon/Icon";
import {
  CalendarBlank,
  ClipboardToDo,
  Envelope,
  Hamburger,
  Comment,
  Notification,
  Search,
  ClientLogo,
} from "@/core/constants/icons";
import { useAuth } from "@/core/services/auth.service";

import UserProfileInfoCard from "./components/user-profile/UserProfileInfoCard";
import NavSearchBar from "./components/search-bar/SearchBar";
import "./AppBar.scss";
import { useLayoutTranslations } from "../translation/useLayoutTranslations";

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
  const { APP_BAR } = useLayoutTranslations();
  const { user } = useAuth();

  const handleSearch = (value: string) => {
    console.log(value);
  };
  return (
    <div className="appbar">
      {/* Logo Section */}
      <div className="appbar__left-section">
        <MainMenu onClick={handleToggleMenu}>
          <CSvgIcon
            component={Hamburger}
            size={24}
            color="primary"
          />
        </MainMenu>

        <div className="appbar__logo-box">
          <div>
            <CSvgIcon
              component={ClientLogo}
              className="appbar__logo-box--logo"
            />
          </div>
          <Typography className="appbar__logo-box--text">
            {defaultConstants.appAbbr}
          </Typography>
        </div>
      </div>

      {/* Search Bar */}
      <Stack className="appbar__search-bar">
        <NavSearchBar
          placeholder={APP_BAR.searchPlaceholder}
          onSearch={handleSearch}
          iconPosition="left"
          icon={Search}
        />
      </Stack>

      <div className="appbar__right-section">
        {/* Icons Section */}
        <Stack className="action-icons-box">
          <CIconButton
            size="large"
            walkMeId={["app-bar", "calendar"]}
          >
            <CSvgIcon component={CalendarBlank} />
          </CIconButton>
          <CIconButton
            size="large"
            walkMeId={["app-bar", "tasks"]}
          >
            <CSvgIcon component={ClipboardToDo} />
          </CIconButton>
          <CIconButton
            size="large"
            walkMeId={["app-bar", "envelope"]}
          >
            <CSvgIcon component={Envelope} />
          </CIconButton>
          <CIconButton
            size="large"
            walkMeId={["app-bar", "comment"]}
          >
            <CSvgIcon component={Comment} />
          </CIconButton>

          <Badge
            className="notifiction-badge"
            badgeContent={"59+"}
            color="error"
            overlap="rectangular"
          >
            <CIconButton
              size="large"
              walkMeId={["app-bar", "notification"]}
            >
              <CSvgIcon component={Notification} />
            </CIconButton>
          </Badge>
        </Stack>
        {/* User Profile Section */}
        <UserProfileInfoCard
          user={{
            name: user?.userName,
            role: user?.positionName,
            avatar: navAvatarPng,
          }}
        />
      </div>
    </div>
  );
};

export default AppBar;
