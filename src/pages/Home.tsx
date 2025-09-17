import React from 'react';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useGetViewPortSize } from '@/utils/getViewPortSize';
import SvgIcon from '@/core/components/Icon';

const Home: React.FC = () => {
  const viewportSize = useGetViewPortSize();
  return <>
    <Typography variant="h4">Home</Typography>
    {`Current viewport size: ${viewportSize}`}
    <Button startIcon={
      <>
        <SvgIcon component="search" size={18} fill="#888888" />
        <SvgIcon component="check" size={18} fill="#888888" />
        <SvgIcon component="close" size={18} fill="#888888" />
        <SvgIcon component="copy" size={18} fill="#888888" />
        <SvgIcon component="thumbsUp" size={18} fill="#888888" />
      </>
    } variant='outlined'>


      Search

    </Button>
  </>;
}


export default Home;