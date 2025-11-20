import { Course } from "@/types/types";
import { Container, Divider, Paper, Stack, Typography } from "@mui/material";

// this enforces the `course` prop to use Course Interface
interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <>
      <Paper variant="outlined" sx={{ maxWidth: "250px", p: 1, pl: 2, pr: 2, }}>
        <Typography variant="h6" fontWeight={"bold"}>
          {course.title}
        </Typography>
        <Divider sx={{ mb: 1 }}></Divider>
        <Stack direction={"row"}>
          <Typography variant="subtitle1">
            {course.date}
          </Typography>
          <Typography variant="subtitle1" ml={"auto"}>
            {course.time}
          </Typography>
        </Stack>
      </Paper>
    </>
  )
}