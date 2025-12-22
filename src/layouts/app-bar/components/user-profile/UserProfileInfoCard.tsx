import React, { useRef, type Ref } from "react";
import { Typography } from "@mui/material";

import CSvgIcon from "@/core/components/icon/Icon";
import clsx from "@/utils/clsx";
import { ArrowDownFill, ArrowUpFill } from "@/core/constants/icons";
//TODO: import { renderMacTruncate } from "@/utils/mac-truncate";
import CNestedMenu from "@/core/components/nested-menu/NestedMenu";

import "./UserProfile.scss";
import { useAdminMenuItemsList } from "./constants";

type UserProfileInfoCardProps = {
  user: { name: string; role: string; avatar: string };
};

const UserProfileInfoCard: React.FC<UserProfileInfoCardProps> = ({ user }) => {
  const adminMenuItemsList = useAdminMenuItemsList();
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

  const handleProfileMenuSelect = () => {
    handleClose();
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
          <Typography className="card-info__name">
            {/* TODO: Uncomment it later */}
            {/* {renderMacTruncate(user?.name || "User", 4, 150)} */}
            {"Logile Admin User"}
          </Typography>
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
      {isDropdownOpen && (
        <CNestedMenu
          className="user-profile-menu"
          onClose={handleClose}
          anchorEl={anchorEl.current as unknown as HTMLElement}
          menuItems={adminMenuItemsList}
          subMenuPosition="left"
          onMenuItemSelect={handleProfileMenuSelect}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        />
      )}
    </>
  );
};
export default UserProfileInfoCard;
