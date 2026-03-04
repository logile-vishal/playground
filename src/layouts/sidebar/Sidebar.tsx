import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Drawer,
  ListItemButton,
  Stack,
  styled,
  Typography,
} from "@mui/material";

import { defaultConstants } from "@/core/constants/app-constants";
import { useIsDesktopViewport } from "@/utils/get-viewport-size";
import CSvgIcon from "@/core/components/icon/Icon";
import { Exchange } from "@/core/constants/icons";
import clsx from "@/utils/clsx";

import "./Sidebar.scss";
import { useLayoutTranslations } from "../translation/useLayoutTranslations";

type SidebarProps = {
  activePath: string;
  sidebarRef?: React.Ref<HTMLDivElement>;
  showMenu: boolean;
  handleMenuClose: () => void;
};

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "activePath",
})<{ activePath?: boolean; component?: React.ElementType; to?: string }>(
  ({ theme, activePath }) => ({
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    padding: "var(--space-m)",
    borderRadius: theme.shape.borderRadius,
    gap: ".4rem",
    width: "100%",
    margin: "var(--space-s) 0",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "normal",
    backgroundColor: activePath
      ? "var(--logile-bg-state-navbar-active)"
      : "transparent",
    color: activePath ? "var(--logile-text-state-navbar-active)" : "inherit",
    minHeight: "max-content",
    maxHeight: "max-content",
    transition: "all .2s ease-in-out",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "var(--logile-bg-state-navbar-active)",
      color: "var(--logile-text-state-navbar-active)",
    },
  })
);

const Sidebar: React.FC<SidebarProps> = ({
  activePath,
  sidebarRef,
  showMenu,
  handleMenuClose,
}) => {
  const { NAV_LINKS } = useLayoutTranslations();
  const [appSwitchValue, setAppSwitchValue] = useState<string>(
    defaultConstants.WFM
  );
  const isDesktop = useIsDesktopViewport();
  const handleSwitchAppName = () => {
    setAppSwitchValue((prev) =>
      prev == defaultConstants.IMS ? defaultConstants.WFM : defaultConstants.IMS
    );
  };
  const navlistItems = NAV_LINKS[defaultConstants.IMS];

  const renderDesktopSwitch = () => {
    return (
      <div className="sidebar__switch">
        <div onClick={handleSwitchAppName}>
          <CSvgIcon
            component={Exchange}
            size={18}
            fill="var(--logile-text-brand-primary-dark-mode-alt)"
          />
          <Typography className="sidebar__switch-text">
            {appSwitchValue}
          </Typography>
        </div>
      </div>
    );
  };

  const renderTabletSwitch = () => {
    const apps = [defaultConstants.WFM, defaultConstants.IMS];

    return (
      <div className="sidebar__app-toggle">
        {apps.map((app) => (
          <button
            key={app}
            className={clsx({
              "sidebar__toggle-item": true,
              active: appSwitchValue === app,
            })}
            onClick={() => setAppSwitchValue(app)}
          >
            {defaultConstants[app]}
          </button>
        ))}
      </div>
    );
  };

  const renderSidebarContent = (forceTabletStyle = false) => {
    const useTabletStyle = !isDesktop || forceTabletStyle;
    return (
      <Stack className="sidebar__content">
        {useTabletStyle ? renderTabletSwitch() : renderDesktopSwitch()}
        <Stack className="sidebar__list">
          {navlistItems.map((item) => {
            const isActive = activePath === item.path;

            return (
              <Box
                className={clsx({
                  "sidebar__list-container": true,
                  "sidebar__list-mobile-container": useTabletStyle,
                })}
              >
                {isActive && (
                  <Box
                    className={clsx({
                      "active-item-box": true,
                      "active-item-mobile": useTabletStyle,
                    })}
                  ></Box>
                )}
                <StyledListItemButton
                  component={Link}
                  to={item.path}
                  activePath={isActive}
                  className={clsx({
                    "sidebar__list-button-mobile": useTabletStyle,
                  })}
                >
                  <CSvgIcon
                    component={item.icon}
                    size={24}
                    fill={
                      isActive ? "currentColor" : "var(--logile-icon-secondary)"
                    }
                  />
                  <Typography
                    className={clsx({
                      "sidebar__list-item-label": true,
                      "sidebar__list-item-label--active": isActive,
                      "layout-tablet": useTabletStyle,
                    })}
                  >
                    {item.text}
                  </Typography>
                </StyledListItemButton>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    );
  };

  // Desktop: narrow sidebar always visible + extended drawer opened by hamburger
  if (isDesktop) {
    return (
      <>
        <Stack className="sidebar" ref={sidebarRef}>
          {renderSidebarContent()}
        </Stack>
        <Drawer anchor="left" open={showMenu} onClose={handleMenuClose}>
          <Stack className="sidebar sidebar-expanded">
            {renderSidebarContent(true)}
          </Stack>
        </Drawer>
      </>
    );
  }

  // Mobile / tablet: drawer only
  return (
    <Drawer anchor="left" open={showMenu} onClose={handleMenuClose}>
      <Stack
        className={clsx({ sidebar: true, "sidebar-mobile": true })}
        ref={sidebarRef}
      >
        {renderSidebarContent()}
      </Stack>
    </Drawer>
  );
};

export default Sidebar;
