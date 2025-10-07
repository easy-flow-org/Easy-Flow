import { Grid, Stack, Typography } from "@mui/material";

export default function Feature1() {
  return (
    <>
      <Grid container spacing={2} sx={{ backgroundColor: "whitesmoke" , padding: {xs: "2rem", md: "5rem 1rem 5rem 5rem", lg: "10rem 2rem 10rem 10rem"}, }}>
        <Grid size={5}>
          <Stack direction={"column"} gap={2}>
            <Typography variant="h4">Lorem</Typography>
            <Typography variant="subtitle1">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae saepe dolore praesentium. Aut, sit. Doloremque modi ea rem, incidunt suscipit doloribus maxime natus error eaque, recusandae commodi animi sed sit?</Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}