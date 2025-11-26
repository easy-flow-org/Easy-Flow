'use client'

import Drawer from '@mui/material/Drawer';
import ClippedDrawer from '@mui/material/Drawer';   
import { Container, Typography, Button} from '@mui/material';
import { useState } from 'react';
import Nav from './nav';
import ThemeRegistry from './theme-provider';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
 
export default function Layout({ children }: { children: React.ReactNode }) {
   

    return (
    <ThemeRegistry>
        <Nav></Nav>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            {children}      
        </LocalizationProvider>
    </ThemeRegistry>
    );
}
