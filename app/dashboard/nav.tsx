'use client'

import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { Container, Typography, Button, AppBar, Toolbar, useMediaQuery, Box } from '@mui/material';
import LogoDevRoundedIcon from '@mui/icons-material/LogoDevRounded';
import NavButton from './NavButton';

export default function Nav() {
    const [open, setOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');

    if (isMobile) { // empty just wanted to test media query
        return (
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-around'}}>
                <NavButton>Dashboard</NavButton>
                <NavButton>Calendar</NavButton>
                <NavButton>Focus Mode</NavButton>
            </Toolbar>
        </AppBar>
        );
    }
    
    return (
        <Drawer 
            open={true}
            onClose={() => setOpen(false)}
            sx = {{ color: "black"}}
            slotProps={{ paper: {
                sx: {
                backgroundColor: '#0e0e0eff', 
                color: 'white',             
                }}}}
        >
            <Box sx={{ height: 200, pl: 4, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <LogoDevRoundedIcon sx={{fontSize: 100, pr: 4}}/>
                {/* <Typography variant='h4'>Easy Flow</Typography> */}
            </Box>
            <NavButton>Dashboard</NavButton>
            <NavButton>Calendar</NavButton>
            <NavButton>Focus Mode</NavButton>
        </Drawer>
    )
} 