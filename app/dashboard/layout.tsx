'use client'

import SideNav from './components/SideNav';
import { Box, useMediaQuery } from '@mui/material';

export default function Layout({ children }: { children: React.ReactNode }) {
  const sideNavWidth = "230px";
  const isMobile = useMediaQuery('(max-width:1000px)');

  return (
    <>
      <SideNav />
      <Box sx={{ marginLeft: isMobile ? 0 : sideNavWidth }}>
        {children}
      </Box>
    </>
  );
}
