 
import { ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'
import React, { useRef, type Ref } from 'react'
import './UserProfile.scss'
import SvgIcon from '@/core/components/icon/Icon'
import clsx from '@/utils/clsx'


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
    <>
    <div className={clsx({'user-profile-info-card':true,'user-profile-info-card--active':isDropdownOpen})} onClick={handleDropdownClick} ref={anchorEl.current}>
        <img src={user.avatar} alt={user.name} className='card-avatar' />
        <div className='card-info'>
            <Typography className='card-info__name'>{user.name}</Typography>
            <Typography className='card-info__role'>{user.role}</Typography>
      </div>
      <div className='card-dropdown-icon'>
        {
          isDropdownOpen ? (
            <SvgIcon component="arrowUpFill" size={20} fill="var(--icon-secondary)" />
          ) : (
            <SvgIcon component="arrowDownFill" size={20} fill="var(--icon-secondary)" />
          )
        }
      
      </div>
    </div>
        <Menu
          className='user-profile-menu'
          id="profile-menu"
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
       
      >
        <MenuItem onClick={handleClose} className='user-profile-menu__option-item'>
            <ListItemIcon>
              <SvgIcon component="user" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">Change Role</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} className='user-profile-menu__option-item'>
            <ListItemIcon>
              <SvgIcon component="focus" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">Set Focus</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} className='user-profile-menu__option-item'>
            <ListItemIcon>
              <SvgIcon component="users" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">User Profile</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} className='user-profile-menu__option-item'>
            <ListItemIcon>
              <SvgIcon component="edit" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">Modify Dashboard</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} className='user-profile-menu__option-item'>
            <ListItemIcon>
              <SvgIcon component="userMinus" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">Reduce Role</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} className='user-profile-menu__option-item'>
            <ListItemIcon>
              <SvgIcon component="userSetting" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">User Management</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} className='user-profile-menu__option-item'>
            <ListItemIcon>
              <SvgIcon component="userStar" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">Admin Mode</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} className='user-profile-menu__option-item'>
            <ListItemIcon>
              <SvgIcon component="theme" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">Theme</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} className='user-profile-menu__option-item'>
            <ListItemIcon>
              <SvgIcon component="globe" size={18} />
            </ListItemIcon>
            <Typography className="menubar-heading">Language</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose} className='user-profile-menu__option-item'>
            <ListItemIcon>
              <SvgIcon component="signout" size={18} fill="#F44336" />
            </ListItemIcon>
            <Typography className="menubar-heading">
              Logout
            </Typography>
          </MenuItem>
      </Menu>
      </>
  )
}
export default UserProfileInfoCard
 