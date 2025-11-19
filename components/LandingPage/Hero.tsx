"use client"

import { Button, Container, Grid, Stack, styled, Typography } from "@mui/material";
import HeroNav from "./HeroNav";
import Link from "next/link";
// Defining Custom Styled Components Here
const StyledGrid = styled(Grid)(({ theme }) => ({
  marginTop: "1rem",
  padding: "7rem 1rem 7rem 1rem",
  backgroundColor: "whitesmoke",
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
}))

const StyledTypography = styled(Typography)(({ theme }) => ({
  textAlign: "center",
}))
//

export default function Hero() {
  return (
    <>
      <HeroNav />

      <StyledGrid container>
        <Stack direction={"column"} gap={"1rem"} sx={{ justifyContent: "center", alignItems: "center" }}>
          <StyledTypography variant="h2">
            EasyFlow
          </StyledTypography>
          <StyledTypography variant="h4">The All in One Productivity App For Students</StyledTypography>
          <StyledTypography variant="subtitle1" sx={{ maxWidth: "700px" }}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas, aspernatur rerum. Ipsum sunt id voluptates expedita asperiores dolor corporis nemo hic deserunt neque, cumque, itaque fugit adipisci reprehenderit. Error, ea!</StyledTypography>

          <Stack direction={"row"} gap={"1rem"} sx={{ justifyContent: "center", alignItems: "center", marginTop: "1.5rem", }}>
            <Button variant="contained" color="secondary" sx={{ textTransform: "none" }}>Try EasyFlow for Free</Button>
<Link href="/login" passHref>
  <Button 
    variant="outlined" 
    color="inherit" 
    sx={{ textTransform: "none" }}
  >
    Login
  </Button>
</Link>          </Stack>
        </Stack>
      </StyledGrid>
    </>
  )
}