import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { useIsDesktopViewport } from "@/utils/get-viewport-size";

import AppBar from "../app-bar/AppBar";
import Sidebar from "../sidebar/Sidebar";
import "./AppShell.scss";
import { NavigationGuard } from "@/core/guards/NavigationGuard";

export default function AppShell() {
  const location = useLocation();
  const activePath = location.pathname;
  const [showMenu, setShowMenu] = useState(false);
  const isDesktop = useIsDesktopViewport();

  const handleToggleMenu = () => setShowMenu((prev) => !prev);
  const handleMenuClose = () => setShowMenu(false);

  // Close any open drawer when switching between desktop / mobile
  useEffect(() => {
    setShowMenu(false);
  }, [isDesktop]);

  return (
    <div className="app-shell">
      <NavigationGuard />
      <AppBar handleToggleMenu={handleToggleMenu} />
      <div className="app-shell__layout">
        <Sidebar
          activePath={activePath}
          showMenu={showMenu}
          handleMenuClose={handleMenuClose}
        />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
