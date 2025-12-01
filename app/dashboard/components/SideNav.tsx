'use client'

import Drawer from '@mui/material/Drawer';
import { AppBar, Toolbar, Box, useMediaQuery } from '@mui/material';
import LogoDevRoundedIcon from '@mui/icons-material/LogoDevRounded';
import NavButton from './NavButton';

const DRAWER_WIDTH = 230;

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: 'SpaceDashboard' },
  { label: 'Calendar', href: '/dashboard/calendar', icon: 'CalendarMonth' },
  { label: 'Focus Mode', href: '/dashboard/pomodoro', icon: 'OfflineBolt' },
];

export default function SideNav() {
  // Treat <= 1000px as mobile
  const isMobile = useMediaQuery('(max-width:1000px)');

  if (isMobile) {
    return (
      <AppBar position="static" sx={{ backgroundColor: '#1e1e1e' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-around', px: 1 }}>
          {navItems.map((n) => (
            <NavButton key={n.href} href={n.href} icon={n.icon} compact />
          ))}
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <Drawer
      variant='permanent'
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#1e1e1e",
            color: "white",
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            pt: 2,
          }
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        <LogoDevRoundedIcon sx={{ fontSize: 50 }} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 1 }}>
        {navItems.map((n) => (
          <NavButton key={n.href} href={n.href} icon={n.icon} label={n.label} />
        ))}
      </Box>
    </ Drawer>
  );
}