 
import { Divider, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'
import React, { useRef, type Ref } from 'react'
import './userProfile.style.scss'
import SvgIcon from '@/core/components/Icon'
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
            <SvgIcon component="arrowUpFill" size={20} fill="#5C5C5C" />
          ) : (
            <SvgIcon component="arrowDownFill" size={20} fill="#5C5C5C" />
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
            border: "1px solid var(--border-color-tertiary)",
            width: "22.2rem", 
          },
        }}
      >
        <MenuItem onClick={handleClose} color="#DCDCDC" sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="user" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading" sx={{color: "#333333"}}>Change Role</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="focus" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading" sx={{color: "#333333"}}>Set Focus</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="users" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading" sx={{color: "#333333"}}>User Profile</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="edit" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading" sx={{color: "#333333"}}>Modify Dashboard</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="userMinus" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading" sx={{color: "#333333"}}>Reduce Role</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="userSetting" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading" sx={{color: "#333333"}}>User Management</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="userStar" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading" sx={{color: "#333333"}}>Admin Mode</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="theme" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading" sx={{color: "#333333"}}>Theme</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="globe" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading" sx={{color: "#333333"}}>Language</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} sx={{padding:'1rem 1.5rem'}}>
            <ListItemIcon>
              <SvgIcon component="signout" size={18} fill="#F44336" />
            </ListItemIcon>
            <Typography className="menubar-heading" sx={{color: "#333333"}}>
              Logout
            </Typography>
          </MenuItem>

      </Menu>
      </div>
    </div>
  )
}
export default UserProfileInfoCard
 