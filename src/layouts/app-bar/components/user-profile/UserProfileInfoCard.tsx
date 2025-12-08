import React, { useRef, type Ref } from "react";
import { ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";

import CSvgIcon from "@/core/components/icon/Icon";
import clsx from "@/utils/clsx";
import {
  ArrowDownFill,
  ArrowUpFill,
  Edit,
  Focus,
  Globe,
  Theme,
  User,
  UserMinus,
  Users,
  UserSetting,
  UserStar,
  Signout,
} from "@/core/constants/icons";

import "./UserProfile.scss";

type UserProfileInfoCardProps = {
  user: { name: string; role: string; avatar: string };
};

const UserProfileInfoCard: React.FC<UserProfileInfoCardProps> = ({ user }) => {
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
      <div
        className={clsx({
          "user-profile-info-card": true,
          "user-profile-info-card--active": isDropdownOpen,
        })}
        onClick={handleDropdownClick}
        ref={anchorEl.current}
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="card-avatar"
        />
        <div className="card-info">
          <Typography className="card-info__name">{user.name}</Typography>
          <Typography className="card-info__role">{user.role}</Typography>
        </div>
        <div className="card-dropdown-icon">
          {isDropdownOpen ? (
            <CSvgIcon
              component={ArrowUpFill}
              size={20}
              color="secondary"
            />
          ) : (
            <CSvgIcon
              component={ArrowDownFill}
              size={20}
              color="secondary"
            />
          )}
        </div>
      </div>
      <Menu
        className="user-profile-menu"
        id="profile-menu"
        elevation={0}
        anchorEl={anchorEl.current as unknown as HTMLElement}
        open={isDropdownOpen}
        onClose={handleClose}
        autoFocus={false}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem
          onClick={handleClose}
          className="user-profile-menu__option-item"
        >
          <ListItemIcon>
            <CSvgIcon
              component={User}
              size={18}
            />
          </ListItemIcon>
          <Typography className="menubar-heading">Change Role</Typography>
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          className="user-profile-menu__option-item"
        >
          <ListItemIcon>
            <CSvgIcon
              component={Focus}
              size={18}
            />
          </ListItemIcon>
          <Typography className="menubar-heading">Set Focus</Typography>
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          className="user-profile-menu__option-item"
        >
          <ListItemIcon>
            <CSvgIcon
              component={Users}
              size={18}
            />
          </ListItemIcon>
          <Typography className="menubar-heading">User Profile</Typography>
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          className="user-profile-menu__option-item"
        >
          <ListItemIcon>
            <CSvgIcon
              component={Edit}
              size={18}
            />
          </ListItemIcon>
          <Typography className="menubar-heading">Modify Dashboard</Typography>
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          className="user-profile-menu__option-item"
        >
          <ListItemIcon>
            <CSvgIcon
              component={UserMinus}
              size={18}
            />
          </ListItemIcon>
          <Typography className="menubar-heading">Reduce Role</Typography>
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          className="user-profile-menu__option-item"
        >
          <ListItemIcon>
            <CSvgIcon
              component={UserSetting}
              size={18}
            />
          </ListItemIcon>
          <Typography className="menubar-heading">User Management</Typography>
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          className="user-profile-menu__option-item"
        >
          <ListItemIcon>
            <CSvgIcon
              component={UserStar}
              size={18}
            />
          </ListItemIcon>
          <Typography className="menubar-heading">Admin Mode</Typography>
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          className="user-profile-menu__option-item"
        >
          <ListItemIcon>
            <CSvgIcon
              component={Theme}
              size={18}
            />
          </ListItemIcon>
          <Typography className="menubar-heading">Theme</Typography>
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          className="user-profile-menu__option-item"
        >
          <ListItemIcon>
            <CSvgIcon
              component={Globe}
              size={18}
            />
          </ListItemIcon>
          <Typography className="menubar-heading">Language</Typography>
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          className="user-profile-menu__option-item"
        >
          <ListItemIcon>
            <CSvgIcon
              component={Signout}
              size={18}
              color="violation"
            />
          </ListItemIcon>
          <Typography className="menubar-heading">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
export default UserProfileInfoCard;
