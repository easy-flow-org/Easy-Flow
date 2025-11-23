'use client'

import SideNav from './components/SideNav';
import Theme from '../theme';
import { Box, useMediaQuery } from '@mui/material';

export default function Layout({ children }: { children: React.ReactNode }) {
  const sideNavWidth = "230px";
  const isMobile = useMediaQuery('(max-width:1000px)');

  return (
    <Theme>
      <SideNav />
      <Box sx={{ marginLeft: isMobile ? 0 : sideNavWidth }}>
        {children}
      </Box>
    </Theme>
  );
}
