"use client"

import { useState } from "react"
import { Box, Paper, List, ListItemButton, ListItemText, Typography, Divider, Stack, Button } from "@mui/material"
import dummyContent from "@/lib/dummyContent"
import { Course } from "@/types/types"
import to12Hour from "@/lib/to12Hour"
import AddCourseModal from "../components/AddCourseModal"
import getDateAbbrev from "@/lib/getDateAbbrev"

export default function Courses() {
  // Load dummy course data
  const [courses, setCourses] = useState<Course[]>([...dummyContent.courses])
  //

  // Track the current user clicked on (selected) course
  const [selected, setSelected] = useState<Course | null>(null)
  //

  // Related to showing/hiding modal
  const [showAddCourseModal, setShowAddCourseModal] = useState(false)
  const closeModal = () => {
    setShowAddCourseModal(false)
    setTimeout(() => {
      setCourseToEdit(null)
    }, 500);
  }
  //

  // Related to setting course user wants to edit
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null)
  const editCourse = (course: Course) => {
    setCourseToEdit(course)
    setShowAddCourseModal(true)
  }
  //

  const addOrUpdateCourse = (newCourse: Course) => {
    setCourses((prev) => {
      const exists = prev.find((c) => c.id === newCourse.id)
      if (exists) {
        return prev.map((c) => (c.id === newCourse.id ? newCourse : c))
      }
      return [...prev, newCourse]
    })
    // if we updated the selected course, reflect it
    setSelected((s) => (s?.id === newCourse.id ? newCourse : s))
    closeModal()
  }

  return (
    <Box sx={{ display: "flex", gap: 2, width: "100%", p: 2 }}>
      {/* Left: course list */}
      <Paper variant="outlined" sx={{ width: { xs: "100%", md: 320 }, maxHeight: 640, overflow: "auto", p: 2 }}>
        <Stack direction={"row"} gap={2} sx={{ display: "flex", alignItems: "center", }}>
          <Typography variant="h6" sx={{ pl: 1 }}>Courses</Typography>
          <Button variant="contained" color="secondary" sx={{ textTransform: "none", ml: "auto" }} >New Course</Button>
        </Stack>
        <Divider sx={{ mt: 2 }} />
        <List>
          {courses.map((c) => (
            <ListItemButton
              key={c.id}
              selected={selected?.id === c.id}
              onClick={() => setSelected(c)}
            >
              <ListItemText
                primary={c.title}
                secondary={`${c.days.split(",").join(" ")} • ${to12Hour(c.startTime)}`}
              />
            </ListItemButton>
          ))}
        </List>
      </Paper>

      {/* Right: details panel */}
      <Box sx={{ flex: 1 }}>
        {/* Conditional Rendering based on if a course is selected or not*/}
        {!selected ? (
          // CHANGE STYLING HERE
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6">Select a course</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Click any course on the left to view details.
            </Typography>
          </Paper>
        ) : (
          // CHANGE STYLING HERE
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h5" fontWeight={700}>{selected.title}</Typography>
                <Typography variant="caption" color="text.secondary">{getDateAbbrev(selected.days)} • {to12Hour(selected.startTime)} - {to12Hour(selected.endTime)}</Typography>
              </Box>
              <Box>
                <Button variant="outlined" color="inherit" sx={{ mr: 1 }} onClick={() => editCourse(selected)}>Edit</Button>
                <Button variant="contained" color="secondary">Add to calendar</Button>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ mb: 1 }}>Description</Typography>
            <Typography variant="body2" color="text.secondary">{selected.description ?? "No description"}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ mb: 1 }}>Details</Typography>
            <Typography variant="body2">Days: {selected.days.replaceAll(",", ", ")}</Typography>
            <Typography variant="body2">Start: {to12Hour(selected.startTime)}</Typography>
            <Typography variant="body2">End: {to12Hour(selected.endTime)}</Typography>

            <Divider sx={{ my: 2 }} />
            <Button onClick={() => setSelected(null)} color="inherit" variant="outlined">Close</Button>
          </Paper>
        )}
      </Box>
      <AddCourseModal open={showAddCourseModal} close={closeModal} addNewCourse={addOrUpdateCourse} editingCourse={courseToEdit} />
    </Box>
  )
}