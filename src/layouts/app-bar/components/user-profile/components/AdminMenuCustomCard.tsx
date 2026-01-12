import { Typography } from "@mui/material";

import CSwitch from "@/core/components/switch/Switch";
import { useAdminModeList } from "../constants";

/**
 * @component AdminModeCustomMenu
 * @description Custom menu component for admin mode settings with toggle switches
 * @return {React.ReactNode} Admin mode menu JSX element
 */
const AdminModeCustomMenu = () => {
  const adminModeItems = useAdminModeList();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  return (
    <div className="admin-mode-custom-menu">
      {adminModeItems?.map((item) => (
        <div
          className="admin-mode-custom-menu__item"
          key={item.value}
        >
          <Typography>{item.label}</Typography>
          <CSwitch
            size="small"
            onChange={handleOnChange}
          />
        </div>
      ))}
    </div>
  );
};

export default AdminModeCustomMenu;
