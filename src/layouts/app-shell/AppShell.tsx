
import { Outlet, useLocation } from 'react-router-dom';
import AppBar from '../app-bar/AppBar';
import Sidebar from '../sidebar/Sidebar';
import './AppShell.style.scss'
import { useEffect, useRef, useState } from 'react';
import { useGetViewPortSize } from '@/utils/get-viewport-size';

export default function AppShell() {
  const location = useLocation();
  const activePath = location.pathname;
  const [showMenu, setShowMenu] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const viewportSize = useGetViewPortSize();
  const isDesktop = viewportSize === 'xl' || viewportSize === 'lg';

  const handleMenuAnimation = (menuStatus:boolean) => {
     if (sidebarRef.current) {
        if(menuStatus) {
          sidebarRef.current.style.width = "92px";
          sidebarRef.current.style.paddingRight = "var(--space-lg)";
          sidebarRef.current.style.transition = "width .3s";
        } else {
          sidebarRef.current.style.width = "0px";
          sidebarRef.current.style.paddingRight = "0px";
          sidebarRef.current.style.transition = "width .3s";
        }
      }
    }
  
  const handleToggleMenu = () => {
    const menuStatus = !showMenu
    setShowMenu(menuStatus);
    handleMenuAnimation(menuStatus);
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
      <AppBar  handleToggleMenu={handleToggleMenu}/>
      <div className='app-shell__layout'>
            <Sidebar activePath={activePath} sidebarRef={sidebarRef}/>
      <main
        className='app-shell__content'
      >
        <Outlet />
      </main>
      </div>
    </div>
  );
}