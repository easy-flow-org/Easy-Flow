import { Course } from "@/types/types";
import { Container, Divider, Paper, Stack, Typography } from "@mui/material";

// this enforces the `course` prop to use Course Interface
interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  function getDateAbbrev(days: string) {
    let splitted = days.split(",")
    for (let i = 0; i < splitted.length; i++) {
      let day = splitted[i].toLowerCase()
      switch (day) {
        case "monday":
          splitted[i] = "Mon"
          break;
        case "tuesday":
          splitted[i] = "Tues"
          break;
        case "wednesday":
          splitted[i] = "Wed"
          break;
        case "thursday":
          splitted[i] = "Thurs"
          break;
        case "friday":
          splitted[i] = "Fri"
          break;
        case "saturday":
          splitted[i] = "Sat"
          break;
        case "sunday":
          splitted[i] = "Sun"
          break;
        default:
          break;
      }
    }
    return splitted.join(" ")
  }

  return (
    <>
      <Paper variant="outlined" sx={{ maxWidth: "250px", p: 1, pl: 2, pr: 2, }}>
        <Typography variant="h6" fontWeight={"bold"}>
          {course.title}
        </Typography>
        <Divider sx={{ mb: .5 }}></Divider>
        <Stack direction={"row"}>
          <Typography variant="subtitle2">
            {
              getDateAbbrev(course.days)
            }
          </Typography>
          <Typography variant="subtitle2" ml={"auto"}>
            {course.startTime + " - " + course.endTime}
          </Typography>
        </Stack>
      </Paper>
    </>
  )
}