'use client'

import { Box, Card, Grid } from "@mui/material"

export default function Dashboard() {
  const gridItemPadding = 2
  return (
    <>
      <Grid container spacing={2} sx={{ height: "100vh", minWidth: "800px", }}>
        {/* gridItemPadding Columns */}
        <Grid size={5} p={gridItemPadding}>
        </Grid>
        <Grid size={7} p={gridItemPadding}>
        </Grid>
        <Grid size={6} p={gridItemPadding}>
        </Grid>
        <Grid size={6} p={gridItemPadding}>
        </Grid>
      </Grid>
    </>
  )
}