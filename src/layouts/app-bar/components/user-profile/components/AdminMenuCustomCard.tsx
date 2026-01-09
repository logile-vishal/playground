import { Typography } from "@mui/material";

import CSwitch from "@/core/components/switch/Switch";

import { adminModeList } from "../constants";

const AdminModeCustomMenu = () => {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };
  return (
    <div className="admin-mode-custom-menu">
      {adminModeList?.map((item) => (
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
