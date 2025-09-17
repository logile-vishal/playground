import React from 'react';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { defaultConstants } from '@/core/constants';
import clientLogo from "@/assets/Logile Logo.svg"
import { Stack } from '@mui/material';
import Searchbar from '@/components/ui/Searchbar';
interface AppBarProps {
  drawerWidth: number;
}

const topBarHeight = defaultConstants.topBarHeight;

const AppBar: React.FC<AppBarProps> = () => {
const handleSearch = (value:string)=>{
  console.log(value)
}
return <MuiAppBar
    position="fixed"
    elevation={0}
    sx={{ height: topBarHeight, backgroundColor:(theme)=> theme.palette.background.secondary }}
  >
    <Toolbar>
      <Stack direction={"row"} sx={{
        height:"fit-content",
        alignItems:"flex-end"
      }}>

      <img src={clientLogo}/>
      <Typography variant='h6' sx={(theme)=>({
        color:theme.palette.primary.main,
        marginLeft:".5rem",
        fontWeight:800,
        lineHeight:1,
        fontSize:'1.5rem'
      })}>
        {defaultConstants.appAbbr}
        </Typography>
      </Stack>
      <Stack>
        <Searchbar placeholder='Search...' onSearch={handleSearch} iconPosition='start'/>
      </Stack>
    </Toolbar>
  </MuiAppBar>
};

export default AppBar;
