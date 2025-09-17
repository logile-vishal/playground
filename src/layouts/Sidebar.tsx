import React from 'react';
import type { RefObject } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

interface SidebarProps {
  drawerWidth: number;
  topBarHeight?: number;
  activePath: string;
  sidebarRef: RefObject<HTMLDivElement>;
}

const menuItems = [
  { text: 'Home', path: '/' },
  { text: 'About', path: '/about' },
];

const Sidebar: React.FC<SidebarProps> = ({ drawerWidth, topBarHeight }) => (
  <Drawer
    variant="permanent"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: { width: drawerWidth, top: `${topBarHeight}px`,boxSizing: 'border-box' },
    }}
  >
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.text} disablePadding>
          <ListItemButton component={Link} to={item.path}>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Drawer>
);

export default Sidebar;