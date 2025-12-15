"use client"

import React, { useState, useEffect } from "react"
import { 
  Box, Paper, List, ListItemButton, ListItemText, Typography, 
  Divider, Stack, Button, CircularProgress, alpha, useTheme,
  Fade, Zoom, Grow, Avatar, Chip, IconButton, InputBase,
  Tabs, Tab, Skeleton, Tooltip, Menu, MenuItem, ListItemIcon,
  Alert, AlertTitle, Badge
} from "@mui/material"
import { Course, ParsedCourseData, ParsedTaskData } from "@/types/types"
import to12Hour from "@/lib/to12Hour"
import AddCourseModal from "../components/AddCourseModal"
import SyllabusUploader from "@/components/SyllabusUploader"
import { useAuth } from "@/app/context/authContext"
import { getCourses, addCourse, updateCourse, deleteCourse } from "@/lib/firebase/courses"
import { addTask } from "@/lib/firebase/tasks"
import { toast } from "react-toastify"
import {
  Add, Edit, Delete, School, CalendarMonth, AccessTime,
  Book, Notes, MoreVert, Search, FilterList, Sort,
  TrendingUp, Groups, Schedule, Today, Close,
  Upload, Description
} from "@mui/icons-material"

export default function Courses() {
  const theme = useTheme()
  const { user } = useAuth()
  const [selected, setSelected] = useState<Course | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState<"title" | "days" | "time">("title")
  const [showAddCourseModal, setShowAddCourseModal] = useState(false)
  const [showSyllabusUploader, setShowSyllabusUploader] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedForMenu, setSelectedForMenu] = useState<Course | null>(null)
  const [aiImportCount, setAiImportCount] = useState(0) // Track AI imports

  useEffect(() => {
    if (user) {
      loadCourses()
    }
  }, [user])

  useEffect(() => {
    applyFilters()
  }, [courses, searchTerm, activeTab, sortBy])

  const loadCourses = async () => {
    if (!user) return
    try {
      setLoading(true)
      const fetchedCourses = await getCourses(user.uid)
      setCourses(fetchedCourses)
    } catch (error) {
      console.error("Error loading courses:", error)
      toast.error("Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = courses

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.days.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(course => course.days.toLowerCase().includes(activeTab.toLowerCase()))
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      } else if (sortBy === "days") {
        const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        const aDay = a.days.split(",")[0].trim()
        const bDay = b.days.split(",")[0].trim()
        return daysOrder.indexOf(aDay) - daysOrder.indexOf(bDay)
      } else if (sortBy === "time") {
        return a.startTime.localeCompare(b.startTime)
      }
      return 0
    })

    setFilteredCourses(filtered)
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
      await loadCourses()
      setSelected((s) => (s?.id === newCourse.id ? newCourse : s))
      closeModal()
    } catch (error) {
      console.error("Error saving course:", error)
      toast.error("Failed to save course. Please try again.")
    }
  }

  const handleSyllabusParsed = async (courseData: ParsedCourseData, tasksData: ParsedTaskData[]) => {
    try {
      if (!user) return

      // Create course from parsed data
      const newCourse: Course = {
        id: '',
        title: courseData.title || 'Untitled Course',
        days: courseData.days || '',
        startTime: courseData.startTime || '09:00',
        endTime: courseData.endTime || '10:00',
        description: courseData.description || '',
        notes: courseData.notes || '',
      }

      // Save the course
      const courseId = await addCourse(newCourse, user.uid)
      newCourse.id = courseId

      // Create tasks from parsed data
      if (tasksData.length > 0) {
        const taskPromises = tasksData.map(async (taskData) => {
          const task = {
            id: '',
            title: taskData.title,
            notes: taskData.description || '',
            dueDate: taskData.dueDate,
            importance: taskData.importance,
            completed: false,
          }
          return await addTask(task, user.uid)
        })

        await Promise.all(taskPromises)
      }

      // Refresh courses and select the new one
      await loadCourses()
      setSelected(newCourse)
      setAiImportCount(prev => prev + 1)
      
      toast.success(`Course and ${tasksData.length} assignments added from syllabus!`)
    } catch (error) {
      console.error("Error saving parsed data:", error)
      toast.error("Failed to save parsed data. Please try again.")
    }
  }

  const addMultipleTasks = async (tasksData: ParsedTaskData[]) => {
    if (!user) return
    
    try {
      const taskPromises = tasksData.map(async (taskData) => {
        const task = {
          id: '',
          title: taskData.title,
          notes: taskData.description || '',
          dueDate: taskData.dueDate,
          importance: taskData.importance,
          completed: false,
        }
        return await addTask(task, user.uid)
      })

      await Promise.all(taskPromises)
      toast.success(`${tasksData.length} tasks imported successfully!`)
    } catch (error) {
      console.error("Error importing tasks:", error)
      toast.error("Failed to import tasks")
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!user) return
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, course: Course) => {
    setSelectedForMenu(course)
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setSelectedForMenu(null)
    setAnchorEl(null)
  }

  const getCourseColor = (course: Course) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.error.main,
    ]
    const index = Math.abs(course.title.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length
    return colors[index]
  }

  const getDateAbbrev = (days: string) => {
    return days
      .split(",")
      .map((d) => d.trim())
      .map((day) => {
        switch (day.toLowerCase()) {
          case "monday": return "Mon"
          case "tuesday": return "Tue"
          case "wednesday": return "Wed"
          case "thursday": return "Thu"
          case "friday": return "Fri"
          case "saturday": return "Sat"
          case "sunday": return "Sun"
          default: return day
        }
      })
      .join(", ")
  }

  const getDayChips = (days: string) => {
    return days.split(",").map((day) => {
      const trimmed = day.trim()
      const colorMap: Record<string, string> = {
        "Monday": theme.palette.primary.main,
        "Tuesday": theme.palette.secondary.main,
        "Wednesday": theme.palette.success.main,
        "Thursday": theme.palette.warning.main,
        "Friday": theme.palette.info.main,
        "Saturday": theme.palette.error.main,
        "Sunday": theme.palette.primary.dark,
      }
      return {
        day: trimmed.substring(0, 3),
        full: trimmed,
        color: colorMap[trimmed] || theme.palette.grey[500]
      }
    })
  }

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Stack spacing={3}>
          <Skeleton variant="rounded" height={56} />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Skeleton variant="rounded" height={400} sx={{ flex: 1 }} />
            <Skeleton variant="rounded" height={400} sx={{ flex: 2 }} />
          </Stack>
        </Stack>
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
    <Box sx={{ 
      minHeight: '100vh',
      p: { xs: 2, md: 4 },
      background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 1)} 0%, ${alpha(theme.palette.secondary.light, 0.03)} 100%)`,
    }}>
      <Fade in={true} timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={3}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}>
                  <School sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
                    Course Manager
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Organize and track your academic schedule
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                startIcon={<Upload />}
                onClick={() => setShowSyllabusUploader(true)}
                sx={{
                  textTransform: 'none',
                  borderRadius: 3,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                Import Syllabus
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Add />}
                onClick={() => setShowAddCourseModal(true)}
                sx={{
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.secondary.main, 0.3)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 40px ${alpha(theme.palette.secondary.main, 0.4)}`,
                  }
                }}
              >
                New Course
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Fade>

      {/* Stats Cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
        <Grow in={true} timeout={500}>
          <Paper sx={{ 
            flex: 1, 
            p: 3, 
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}>
                <School fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight={800}>
                  {courses.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Courses
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grow>

        <Grow in={true} timeout={700}>
          <Paper sx={{ 
            flex: 1, 
            p: 3, 
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main,
              }}>
                <Schedule fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight={800}>
                  {new Set(courses.flatMap(c => c.days.split(',').map(d => d.trim()))).size}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Days
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grow>

        <Grow in={true} timeout={900}>
          <Paper sx={{ 
            flex: 1, 
            p: 3, 
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
              }}>
                <Description fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight={800}>
                  {aiImportCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  AI Syllabus Imports
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grow>
      </Stack>

      {/* Filter & Search Bar */}
      <Zoom in={true} timeout={1000}>
        <Paper sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
        }}>
          <Stack spacing={3}>
            {/* Search */}
            <Paper
              component="form"
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                background: alpha(theme.palette.background.paper, 0.8),
              }}
            >
              <IconButton sx={{ p: '10px' }} aria-label="search">
                <Search />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <IconButton onClick={() => setSearchTerm("")}>
                  <Close />
                </IconButton>
              )}
            </Paper>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All" value="all" />
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <Tab key={day} label={day.substring(0, 3)} value={day.toLowerCase()} />
              ))}
            </Tabs>
          </Stack>
        </Paper>
      </Zoom>

      <Box sx={{ 
        display: 'grid', 
        gap: 4, 
        gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
        alignItems: 'start' 
      }}>
        {/* Left: Course List */}
        <Zoom in={true} timeout={1200}>
          <Paper sx={{ 
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
            maxHeight: 600,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Box sx={{ 
              p: 3, 
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: alpha(theme.palette.background.paper, 0.8),
            }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Your Courses ({filteredCourses.length})
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Click to view details
              </Typography>
            </Box>

            <Box sx={{ overflow: 'auto', flex: 1 }}>
              {filteredCourses.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ fontSize: 48, opacity: 0.3, mb: 2 }}>📚</Box>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? "No courses match your search" : "No courses yet"}
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {filteredCourses.map((course, index) => (
                    <Grow in={true} timeout={500 + index * 100} key={course.id}>
                      <ListItemButton
                        selected={selected?.id === course.id}
                        onClick={() => setSelected(course)}
                        sx={{
                          p: 2.5,
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: alpha(getCourseColor(course), 0.05),
                            transform: 'translateX(4px)',
                          },
                          '&.Mui-selected': {
                            background: alpha(getCourseColor(course), 0.1),
                            borderLeft: `4px solid ${getCourseColor(course)}`,
                          }
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                          <Avatar sx={{ 
                            width: 44, 
                            height: 44,
                            background: alpha(getCourseColor(course), 0.1),
                            color: getCourseColor(course),
                            fontWeight: 600,
                          }}>
                            {course.title.charAt(0)}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle1" fontWeight={600} noWrap>
                              {course.title}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {to12Hour(course.startTime)} - {to12Hour(course.endTime)}
                              </Typography>
                            </Stack>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMenuOpen(e, course)
                            }}
                            sx={{
                              opacity: 0.6,
                              '&:hover': { opacity: 1 }
                            }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Stack>
                      </ListItemButton>
                    </Grow>
                  ))}
                </List>
              )}
            </Box>
          </Paper>
        </Zoom>

        {/* Right: Course Details */}
        <Zoom in={true} timeout={1400}>
          <Box>
            {!selected ? (
              <Paper sx={{ 
                p: 8, 
                textAlign: 'center', 
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
              }}>
                <Box sx={{ fontSize: 64, opacity: 0.3, mb: 2 }}>🎓</Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Select a Course
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose a course from the list to view details
                </Typography>
              </Paper>
            ) : (
              <Paper sx={{ 
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
                overflow: 'hidden',
              }}>
                {/* Header */}
                <Box sx={{ 
                  p: 4,
                  background: `linear-gradient(135deg, ${alpha(getCourseColor(selected), 0.1)} 0%, transparent 100%)`,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={3}>
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ 
                          width: 56, 
                          height: 56,
                          background: getCourseColor(selected),
                          color: 'white',
                          fontWeight: 700,
                          fontSize: 24,
                        }}>
                          {selected.title.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
                            {selected.title}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CalendarMonth sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body1" color="text.secondary">
                              {getDateAbbrev(selected.days)}
                            </Typography>
                            <AccessTime sx={{ fontSize: 16, color: 'text.secondary', ml: 1 }} />
                            <Typography variant="body1" color="text.secondary">
                              {to12Hour(selected.startTime)} - {to12Hour(selected.endTime)}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit course">
                        <IconButton
                          onClick={() => openEdit(selected)}
                          sx={{
                            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: alpha(theme.palette.primary.main, 0.1),
                              borderColor: theme.palette.primary.main,
                              transform: 'scale(1.1)',
                            }
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Add to calendar">
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<Today />}
                          sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                          Add to Calendar
                        </Button>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Box>

                {/* Content */}
                <Box sx={{ p: 4 }}>
                  <Stack spacing={4}>
                    {/* Day Chips */}
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarMonth /> Meeting Days
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {getDayChips(selected.days).map((chip, index) => (
                          <Chip
                            key={index}
                            label={chip.day}
                            sx={{
                              background: alpha(chip.color, 0.1),
                              color: chip.color,
                              fontWeight: 600,
                              borderRadius: 2,
                            }}
                            size="small"
                          />
                        ))}
                      </Stack>
                    </Box>

                    {/* Description */}
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Book /> Description
                      </Typography>
                      {selected.description ? (
                        <Paper sx={{ 
                          p: 3, 
                          borderRadius: 3,
                          background: alpha(theme.palette.background.paper, 0.5),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}>
                          <Typography variant="body1">
                            {selected.description}
                          </Typography>
                        </Paper>
                      ) : (
                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                          <AlertTitle>No Description</AlertTitle>
                          Add a description to provide more context about this course
                        </Alert>
                      )}
                    </Box>

                    {/* Notes */}
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Notes /> Notes
                      </Typography>
                      {selected.notes ? (
                        <Paper sx={{ 
                          p: 3, 
                          borderRadius: 3,
                          background: alpha(theme.palette.background.paper, 0.5),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          whiteSpace: 'pre-wrap',
                        }}>
                          <Typography variant="body1">
                            {selected.notes}
                          </Typography>
                        </Paper>
                      ) : (
                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                          <AlertTitle>No Notes</AlertTitle>
                          Add notes for assignments, reminders, or important information
                        </Alert>
                      )}
                    </Box>

                    {/* Time Info */}
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                        Schedule Details
                      </Typography>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                        <Paper sx={{ 
                          p: 3, 
                          flex: 1,
                          borderRadius: 3,
                          background: alpha(theme.palette.info.main, 0.05),
                          border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                        }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Start Time
                          </Typography>
                          <Typography variant="h6" fontWeight={700} color="info.main">
                            {to12Hour(selected.startTime)}
                          </Typography>
                        </Paper>
                        <Paper sx={{ 
                          p: 3, 
                          flex: 1,
                          borderRadius: 3,
                          background: alpha(theme.palette.success.main, 0.05),
                          border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                        }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            End Time
                          </Typography>
                          <Typography variant="h6" fontWeight={700} color="success.main">
                            {to12Hour(selected.endTime)}
                          </Typography>
                        </Paper>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Paper>
            )}
          </Box>
        </Zoom>
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedForMenu && (
          <>
            <MenuItem onClick={() => { openEdit(selectedForMenu); handleMenuClose() }}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              Edit Course
            </MenuItem>
            <MenuItem onClick={() => { 
              handleDeleteCourse(selectedForMenu.id)
              handleMenuClose()
            }}>
              <ListItemIcon>
                <Delete fontSize="small" />
              </ListItemIcon>
              Delete Course
            </MenuItem>
          </>
        )}
      </Menu>

      <SyllabusUploader
        open={showSyllabusUploader}
        onClose={() => setShowSyllabusUploader(false)}
        onParsed={handleSyllabusParsed}
      />

      <AddCourseModal 
        open={showAddCourseModal} 
        close={closeModal} 
        addNewCourse={addOrUpdateCourse} 
        editingCourse={editingCourse} 
      />
    </Box>
  )
}