"use client"

import React, { useState } from "react"
import { Box, Paper, List, ListItemButton, ListItemText, Typography, Divider, Stack, Button } from "@mui/material"
import dummyContent from "@/lib/dummyContent"
import { Course } from "@/types/types"
import to12Hour from "@/lib/to12Hour"
import AddCourseModal from "../components/AddCourseModal"

export default function Courses() {
  // Selected is a Course Type, or null
  const [selected, setSelected] = useState<Course | null>(null)

  // Related to edit course modal
  // Manage courses locally so we can edit
  const [courses, setCourses] = useState<Course[]>([...dummyContent.courses])

  const [showAddCourseModal, setShowAddCourseModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  const openEdit = (course: Course) => {
    setEditingCourse(course)
    setShowAddCourseModal(true)
  }

  const closeModal = () => {
    setEditingCourse(null)
    setShowAddCourseModal(false)
  }

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

  function getDateAbbrev(days: string) {
    return days
      .split(",")
      .map((d) => d.trim())
      .map((day) => {
        switch (day.toLowerCase()) {
          case "monday":
            return "Mon"
          case "tuesday":
            return "Tues"
          case "wednesday":
            return "Wed"
          case "thursday":
            return "Thurs"
          case "friday":
            return "Fri"
          case "saturday":
            return "Sat"
          case "sunday":
            return "Sun"
          default:
            return day
        }
      })
      .join(" ")
  }

  return (
    <Box sx={{ display: "flex", gap: 2, width: "100%", p: 2 }}>
      {/* Left: course list */}
      <Paper variant="outlined" sx={{ width: { xs: "100%", md: 320 }, maxHeight: 640, overflow: "auto", p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1, pl: 1 }}>Courses</Typography>
        <Divider />
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
        {/* Conditional Rendering */}
        {!selected ? (
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6">Select a course</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Click any course on the left to view details.
            </Typography>
          </Paper>
        ) : (
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h5" fontWeight={700}>{selected.title}</Typography>
                <Typography variant="caption" color="text.secondary">{getDateAbbrev(selected.days)} • {to12Hour(selected.startTime)} - {to12Hour(selected.endTime)}</Typography>
              </Box>
              <Box>
                <Button variant="outlined" color="inherit" sx={{ mr: 1 }} onClick={() => openEdit(selected)}>Edit</Button>
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
      <AddCourseModal open={showAddCourseModal} close={closeModal} addNewCourse={addOrUpdateCourse} initialCourse={editingCourse} />
    </Box>
  )
}