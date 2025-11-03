'use client'

import Drawer from '@mui/material/Drawer';
import ClippedDrawer from '@mui/material/Drawer';   
import { Container, Typography, Button} from '@mui/material';
import { useState } from 'react';
import Nav from './nav';
import ThemeRegistry from '../theme-provider';
 
export default function Layout({ children }: { children: React.ReactNode }) {
   

    return (
    <>
        <Nav></Nav>
        <Container sx={{ color: 'black', backgroundColor: '#9c1b1bff'}}>{children}</Container>
    </>
    );
}
