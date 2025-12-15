import { Typography } from "@mui/material";

import { StyledSwitch } from "./StyledSwitch";
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
          <Typography>{item.name}</Typography>
          <StyledSwitch onChange={handleOnChange} />
        </div>
      ))}
    </div>
  );
};
export default AdminModeCustomMenu;
