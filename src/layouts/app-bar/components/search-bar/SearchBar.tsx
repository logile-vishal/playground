import React from "react";

import CSvgIcon, { type SvgIconComponent } from "@/core/components/icon/Icon";
import CTextfield from "@/core/components/form/textfield/Textfield";

import "./SearchBar.scss";

type navSearchBarProps = {
  placeholder: string;
  onSearch: (value: string) => void;
  iconPosition?: "left" | "right";
  icon?: SvgIconComponent;
};

const NavSearchBar = (props: navSearchBarProps) => {
  const [value, setValue] = React.useState("");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const onSearch = (value: string) => {
    props.onSearch(value);
  };
  const checkForEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(value);
    }
  };
  return (
    <CTextfield
      placeholder={props.placeholder}
      startIcon={
        <CSvgIcon
          component={props.icon}
          color="secondary"
          size={18}
        />
      }
      value={value}
      onChange={onChange}
      onKeyDown={checkForEnter}
      className="appbar-search-field"
    />
  );
};
export default NavSearchBar;
