
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import { useIsDesktopViewport } from '@/utils/get-viewport-size';

import AppBar from '../app-bar/AppBar';
import Sidebar from '../sidebar/Sidebar';
import './AppShell.scss'
import { NavigationGuard } from '@/core/guards/NavigationGuard';

export default function AppShell() {
  const location = useLocation();
  const activePath = location.pathname;
  const [showMenu, setShowMenu] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktopViewport();

  const handleMenuAnimation = (menuStatus: boolean) => {
    sidebarRef.current?.classList.toggle('sidebar--collapsed', !menuStatus);
  }

  const handleToggleMenu = () => {
    const menuStatus = !showMenu
    setShowMenu(menuStatus);
    handleMenuAnimation(menuStatus);
  }

  const handleMenuClose = () => {
    setShowMenu(false);
    handleMenuAnimation(false);
  }

  useEffect(() => {
    if (isDesktop) {
      setShowMenu(true);
      handleMenuAnimation(true);
    } else {
      setShowMenu(false);
      handleMenuAnimation(false);
    }
  }, [isDesktop]);

  return (
    <div className='app-shell'>
      <NavigationGuard />
      <AppBar handleToggleMenu={handleToggleMenu} />
      <div className='app-shell__layout'>
        <Sidebar activePath={activePath} sidebarRef={sidebarRef} showMenu={showMenu} handleMenuClose={handleMenuClose} />
        <main className='app-shell__content'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}