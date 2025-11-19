'use client'

import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { Container, Typography, Button, AppBar, Toolbar, useMediaQuery, Box } from '@mui/material';
import LogoDevRoundedIcon from '@mui/icons-material/LogoDevRounded';
import NavButton from './NavButton';

export default function SideNav() {
  // const isMobile = useMediaQuery('(max-width:1000px)');

  // if (isMobile) {
  //   return (
  //     <AppBar position="static">
  //       <Toolbar sx={{ display: 'flex', justifyContent: 'space-around', backgroundColor: '#0e0e0eff' }}>
  //         <NavButton href='/dashboard' icon='SpaceDashboard'></NavButton>
  //         <NavButton href='/dashboard/calendar' icon='CalendarMonth'></NavButton>
  //         <NavButton href='/dashboard/focus-mode' icon='OfflineBolt'></NavButton>
  //       </Toolbar>
  //     </AppBar>
  //   );
  // }

  const width = "230px"

  return (
    <Drawer
      variant='permanent'
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#1e1e1e",
            color: "white",
            width: width,
          }
        }
      }}
    >
      <LogoDevRoundedIcon sx={{ fontSize: 50, ml: "auto", mr: "auto", mt: 2, mb: 2}} />
      <NavButton href='/dashboard' icon='SpaceDashboard'>Dashboard</NavButton>
      <NavButton href='/dashboard/calendar' icon='CalendarMonth'>Calendar</NavButton>
      <NavButton href='/dashboard/focus-mode' icon='OfflineBolt'>Focus Mode</NavButton>
    </ Drawer>
  )
} 