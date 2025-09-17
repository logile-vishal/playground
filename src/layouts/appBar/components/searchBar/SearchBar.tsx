import { InputBase, styled } from "@mui/material";
import React from "react";

import SvgIcon from "@/core/components/Icon";
import type { IconName } from "@/core/types/icon.type";


interface navSearchBarProps {
    placeholder: string;
    onSearch: (value: string) => void;
    iconPosition?: 'left' | 'right'
    icon?: IconName
  }
  
  const SearchIconWrapper = styled('div',{
    shouldForwardProp: (prop) => prop !== 'iconPosition',
  })(() => ({
      width:"fit-content",
      backgroundColor:"transparent",
      padding: "0 var(--space-sm)",
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
      color: theme.palette.text.primary,
      width: '100%',
      backgroundColor:theme.palette.background.default,
      '& .MuiInputBase-input': {
          padding: "var(--space-xs) var(--space-sm)",
          fontSize: "1.7rem",
          transition: theme.transitions.create('width'),
      },
  }));
  
  const Search = styled('div',{
    shouldForwardProp: (prop) => prop !== 'iconPosition',
  })<{iconPosition?: string}>(({ theme,iconPosition }) => ({
      position: 'relative',
      display:"flex",
      alignItems:"center",

    flexGrow:1,
      borderRadius: theme.shape.borderRadius,
      backgroundColor:theme.palette.background.default,
     border:"1px solid var(--border-color-tertiary)",
      marginLeft: 0,
      overflow:"hidden",
      ...(iconPosition === 'left' && {
        flexDirection:"row-reverse",
      }),
      ...(iconPosition === 'right' && {
        flexDirection:"row",
      }),
  }));
  const NavSearchBar = (props: navSearchBarProps)=>{
      const [value, setValue] = React.useState('');
      const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
      };
      const onSearch = (value:string)=>{
        console.log(value)
      }
      const checkForEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          onSearch(value);
        }
      };
      return <Search iconPosition='left'>
      <StyledInputBase 
      size='small' 
      placeholder={props.placeholder}
      value={value} 
      onChange={onChange} 
      onKeyDown={checkForEnter}

      />
       <SearchIconWrapper>
      <SvgIcon component={props.icon as IconName} fill={"var(--icon-color-secondary)"} size={18}/>
      </SearchIconWrapper>
      </Search>
  }
  export default NavSearchBar