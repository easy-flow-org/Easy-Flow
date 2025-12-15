"use client"

import { AppBar, Button, Link, Stack, Toolbar, Typography, styled } from "@mui/material";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import NextLink from "next/link";

// Defining Custom Styled Components Here
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignContent: "center",
  gap: "1rem",
  padding: theme.spacing(1, 2),
}))

const NavLink = styled(Link)(({ theme }) => ({
  cursor: "pointer",
  transition: "color 0.2s ease",
  "&:hover": {
    color: theme.palette.secondary.main,
  },
}))
//

export default function HeroNav() {
  return (
    <>
      <AppBar position="static" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <StyledToolbar>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
            <LightbulbIcon sx={{ display: { xs: "block", sm: "none" }, height: "2rem", width: "2rem" }} />
            <Typography variant="h6" flexShrink={0} sx={{ display: { xs: "none", sm: "block" }, fontWeight: 700 }}>
              Easy Flow
            </Typography>
          </Stack>

          <Stack direction={"row"} spacing={"2rem"} flexShrink={0} marginLeft={"auto"} marginRight={"2rem"}>
            <NavLink href="#features" color="inherit" underline="none" sx={{ cursor: 'pointer' }}>
              Features
            </NavLink>
            <NavLink href="#about" color="inherit" underline="none" sx={{ cursor: 'pointer' }}>
              About
            </NavLink>
          </Stack>

          <Stack direction={"row"} spacing={"0.75rem"} flexShrink={0}>
            <Button component={NextLink} href="/login" variant="outlined" color="inherit" sx={{ textTransform: 'none' }}>
              Log In
            </Button>
            <Button component={NextLink} href="/register" variant="contained" color="secondary" sx={{ textTransform: 'none' }}>
              Sign Up
            </Button>
          </Stack>
        </StyledToolbar>
      </AppBar>
    </>
  )
}