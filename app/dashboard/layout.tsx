'use client'

import SideNav from './components/SideNav';
import ThemeRegistry from '../theme-provider';
import { Box } from '@mui/material';

export default function Layout({ children }: { children: React.ReactNode }) {
  // This is to account for the Side Nav's width
  const sideNavWidth = "230px"

  return (
    <ThemeRegistry>
      <SideNav></SideNav>
      <Box sx={{marginLeft: sideNavWidth,}}>
        {children}
      </Box>
    </ThemeRegistry>
  );
}
