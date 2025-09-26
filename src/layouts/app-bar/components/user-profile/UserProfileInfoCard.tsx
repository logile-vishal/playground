 
import { Divider, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'
import React, { useRef, type Ref } from 'react'
import './UserProfile.scss'
import SvgIcon from '@/core/components/icon/Icon'
interface UserProfileInfoCardProps {
    user: {name: string, role: string,avatar: string}
}
const UserProfileInfoCard: React.FC<UserProfileInfoCardProps> = ({user}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const anchorEl = useRef<undefined | Ref<HTMLDivElement>>(undefined);
  const handleDropdownClick = (event: React.MouseEvent<HTMLDivElement>) => {
    anchorEl.current = event.currentTarget as unknown as Ref<HTMLDivElement>;
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleClose = () => {
    anchorEl.current = undefined;
    setIsDropdownOpen(false);
  };
  return (
    <div className={`userProfileInfoCard ${isDropdownOpen && 'userProfileInfoCardSelected' }`} onClick={handleDropdownClick} ref={anchorEl.current}>
        <img src={user.avatar} alt={user.name} className='avatar' />
        <div className='userInfo'>
            <Typography className='userInfo-name'>{user.name}</Typography>
            <Typography className='userInfo-role'>{user.role}</Typography>
      </div>
      <div>
        {
          isDropdownOpen ? (
            <SvgIcon component="arrowUpFill" size={20} fill="var(--icon-secondary)" />
          ) : (
            <SvgIcon component="arrowDownFill" size={20} fill="var(--icon-secondary)" />
          )
        }
          <Menu
          id="basic-menu"
          elevation={0}
          anchorEl={anchorEl.current as unknown as HTMLElement}
          open={isDropdownOpen}
          onClose={handleClose}
          autoFocus={false}
          slotProps={{
            list: {
              'aria-labelledby': 'basic-button',
            },
          }}
         PaperProps={{
          sx: {
            border: "1px solid var(--border-tertiary)",
            width: "22.2rem", 
          },
        }}
      >
        <MenuItem onClick={handleClose} color="#DCDCDC" sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="user" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">Change Role</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="focus" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">Set Focus</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="users" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">User Profile</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="edit" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">Modify Dashboard</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="userMinus" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">Reduce Role</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="userSetting" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">User Management</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="userStar" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">Admin Mode</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="theme" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">Theme</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="globe" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">Language</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="signout" size={18} fill="#F44336" />
            </ListItemIcon>
            <Typography className="menubar-heading">
              Logout
            </Typography>
          </MenuItem>

      </Menu>
      </div>
    </div>
  )
}
export default UserProfileInfoCard
 