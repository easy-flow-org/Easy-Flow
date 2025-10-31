"use client"

import { AppBar, Button, Link, Stack, Toolbar, Typography, styled } from "@mui/material";
import LightbulbIcon from '@mui/icons-material/Lightbulb';

// Defining Custom Styled Components Here
const StyledToolbar = styled(Toolbar)({
  display: "flex",
  alignContent: "center",
  gap: "1rem",
})

export default function AboutMeNav() {
  return (
    <>
      <AppBar position="static">
        <StyledToolbar>
          <LightbulbIcon sx={{ display: { xs: "block", sm: "none" }, alignItems: "center", height: "2rem", width: "2rem" }}></LightbulbIcon>
          <Typography variant="h6" flexShrink={0} sx={{ display: { xs: "none", sm: "block" } }}>Easy Flow</Typography>

          <Stack direction={"row"} spacing={"3rem"} flexShrink={0} marginLeft={"auto"} marginRight={"2rem"}>
            <Link href="/" color="inherit" variant="inherit" underline="none">Home</Link>
            <Link href="#features" color="inherit" variant="inherit" underline="none">Features</Link>
          </Stack>

          <Stack direction={"row"} spacing={"1rem"} flexShrink={0}>
            <Button variant="contained" color="secondary">Sign Up</Button>
            <Button variant="outlined" color="inherit">Log In</Button>
          </Stack>
        </StyledToolbar>
      </AppBar>
    </>
  )
}
