'use client'

import { Box, Card, Grid } from "@mui/material"
import CourseCard from "./components/CourseCard"
import dummyContent from "@/lib/dummyContent"

export default function Dashboard() {
  const gridItemPadding = 1

  return (
    <>
      <Grid container spacing={2} p={1} sx={{ minWidth: "800px", }}>
        {/* gridItemPadding Columns */}

        <Grid size={12} p={gridItemPadding}>
          {dummyContent.courses.map((c) => (
            <CourseCard course={c} key={c.id}></CourseCard>
          ))}
        </Grid>
        <Grid size={12} p={gridItemPadding}>
        </Grid>
        <Grid size={12} p={gridItemPadding}>
        </Grid>
      </Grid>
    </>
  )
}