'use client'

import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { Container, Typography, Button, AppBar, Toolbar, useMediaQuery, Box } from '@mui/material';
import LogoDevRoundedIcon from '@mui/icons-material/LogoDevRounded';
import NavButton from './NavButton';

export default function Nav() {
    const [open, setOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:1000px)');

    if (isMobile) { 
        return (
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-around', backgroundColor: '#0e0e0eff'}}>
                <NavButton href='/dashboard' icon='SpaceDashboard'></NavButton>
                <NavButton href='/dashboard/calendar' icon='CalendarMonth'></NavButton>
                <NavButton href='/dashboard/focus-mode' icon='OfflineBolt'></NavButton>
            </Toolbar>
        </AppBar>
        );
    }
    
    return (
        <Drawer 
            open={true}
            variant='permanent'
            // onClose={() => setOpen(false)}
            sx = {{ color: "black"}}
            slotProps={{ 
                paper: {
                    sx: {
                        backgroundColor: '#0e0e0eff', 
                        color: 'white',   
                        borderRight: 0, 
                    }
                }}}
        >
            <Box sx={{ height: 200, pl: 4, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <LogoDevRoundedIcon sx={{fontSize: 100, pr: 4}}/>
                {/* <Typography variant='h4'>Easy Flow</Typography> */}
            </Box>
            <NavButton href='/dashboard' icon='SpaceDashboard'>Dashboard</NavButton>
            <NavButton href='/dashboard/calendar' icon='CalendarMonth'>Calendar</NavButton>
            <NavButton href='/dashboard/focus-mode' icon='OfflineBolt'>Focus Mode</NavButton>
        </Drawer>
    )
} 