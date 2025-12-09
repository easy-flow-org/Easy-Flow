"use client"

import React, { useState, useEffect } from "react"
import { Box, Paper, List, ListItemButton, ListItemText, Typography, Divider, Stack, Button, CircularProgress } from "@mui/material"
import { Course } from "@/types/types"
import to12Hour from "@/lib/to12Hour"
import AddCourseModal from "../components/AddCourseModal"
import { useAuth } from "@/app/context/authContext"
import { getCourses, addCourse, updateCourse, deleteCourse } from "@/lib/firebase/courses"
import { toast } from "react-toastify"

export default function Courses() {
  const { user } = useAuth()
  // Selected is a Course Type, or null
  const [selected, setSelected] = useState<Course | null>(null)

  // Related to edit course modal
  // Manage courses locally so we can edit
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  const [showAddCourseModal, setShowAddCourseModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  // Load courses from Firebase
  useEffect(() => {
    if (user) {
      loadCourses()
    }
  }, [user])

  const loadCourses = async () => {
    if (!user) return
    try {
      setLoading(true)
      const fetchedCourses = await getCourses(user.uid)
      setCourses(fetchedCourses)
    } catch (error) {
      console.error("Error loading courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const openEdit = (course: Course) => {
    setEditingCourse(course)
    setShowAddCourseModal(true)
  }

  const closeModal = () => {
    setEditingCourse(null)
    setShowAddCourseModal(false)
  }

  const addOrUpdateCourse = async (newCourse: Course) => {
    if (!user) return
    try {
      const isUpdate = courses.some((c) => c.id === newCourse.id)
      if (isUpdate) {
        await updateCourse(newCourse, user.uid)
        toast.success("Course updated successfully!")
      } else {
        const newId = await addCourse(newCourse, user.uid)
        newCourse.id = newId
        toast.success("Course added successfully!")
      }
      // Reload courses to get the latest data
      await loadCourses()
      // if we updated the selected course, reflect it
      setSelected((s) => (s?.id === newCourse.id ? newCourse : s))
      closeModal()
    } catch (error) {
      console.error("Error saving course:", error)
      toast.error("Failed to save course. Please try again.")
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!user) return
    if (!confirm("Are you sure you want to delete this course?")) return
    try {
      await deleteCourse(courseId)
      await loadCourses()
      if (selected?.id === courseId) {
        setSelected(null)
      }
      toast.success("Course deleted successfully!")
    } catch (error) {
      console.error("Error deleting course:", error)
      toast.error("Failed to delete course. Please try again.")
    }
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Please log in to view your courses.</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", gap: 2, width: "100%", p: 2 }}>
      {/* Left: course list */}
      <Paper variant="outlined" sx={{ width: { xs: "100%", md: 320 }, maxHeight: 640, overflow: "auto", p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ pl: 1 }}>Courses</Typography>
          <Button variant="contained" color="secondary" size="small" onClick={() => setShowAddCourseModal(true)} sx={{ textTransform: 'none' }}>Add</Button>
        </Stack>
        <Divider />
        {courses.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, pl: 1 }}>
            No courses yet. Add your first course!
          </Typography>
        ) : (
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
        )}
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
                <Button variant="outlined" color="error" sx={{ mr: 1 }} onClick={() => handleDeleteCourse(selected.id)}>Delete</Button>
                <Button variant="contained" color="secondary">Add to calendar</Button>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ mb: 1 }}>Description</Typography>
            <Typography variant="body2" color="text.secondary">{selected.description ?? "No description"}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ mb: 1 }}>Notes</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{selected.notes ?? "No notes yet. Add some!"}</Typography>

            <Divider sx={{ my: 2 }} />
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