"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  IconButton,
  Checkbox,
  CircularProgress,
  alpha,
  useTheme,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Tooltip,
  Fade,
  Zoom,
  Grow,
  Divider,
  InputBase,
  Menu,
  MenuItem,
  ListItemIcon,
  Skeleton,
} from "@mui/material"
import { 
  Edit, 
  Delete, 
  Add, 
  FilterList, 
  Search, 
  Sort,
  CalendarMonth,
  CheckCircle,
  Circle,
  MoreVert,
  Flag,
  Schedule,
  Note,
  Archive,
  TrendingUp,
  Lightbulb,
  KeyboardDoubleArrowDown
} from "@mui/icons-material"
import { Task, TaskBase } from "@/types/types"
import AddTaskModal from "../components/AddTaskModal"
import { useAuth } from "@/app/context/authContext"
import { getTasks, addTask, updateTask, deleteTask, toggleTaskComplete } from "@/lib/firebase/tasks"
import { toast } from "react-toastify"
import { formatDistanceToNow } from "date-fns"

function formatDueDate(d?: Date | string) {
  if (!d) return "No due date"
  const date = d instanceof Date ? d : new Date(d as any)
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return "Today"
  if (days === 1) return "Tomorrow"
  if (days < 0) return "Overdue"
  if (days < 7) return `${days} days`
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export default function TasksPage() {
  const theme = useTheme()
  const { user } = useAuth()
  // local tasks state (single source for this page)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"dueDate" | "importance" | "createdAt">("dueDate")
  const [filterBy, setFilterBy] = useState<"all" | "pending" | "completed">("all")

  // modal state
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [taskMenuAnchor, setTaskMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Load tasks from Firebase
  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [user])

  useEffect(() => {
    applyFilters()
  }, [tasks, searchTerm, sortBy, filterBy])

  const loadTasks = async () => {
    if (!user) return
    try {
      setLoading(true)
      const fetchedTasks = await getTasks(user.uid)
      setTasks(fetchedTasks)
    } catch (error) {
      console.error("Error loading tasks:", error)
      toast.error("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = tasks

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (filterBy === "pending") {
      filtered = filtered.filter(task => !task.completed)
    } else if (filterBy === "completed") {
      filtered = filtered.filter(task => task.completed)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "dueDate") {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
        return dateA - dateB
      } else if (sortBy === "importance") {
        const importanceOrder = { "Hard": 3, "Medium": 2, "Easy": 1 }
        return importanceOrder[b.importance] - importanceOrder[a.importance]
      }
      return 0
    })

    setFilteredTasks(filtered)
  }

  const openNew = () => {
    setEditingTask(null)
    setShowModal(true)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setShowModal(true)
  }

  const closeModal = () => {
    setEditingTask(null)
    setShowModal(false)
  }

  const addOrUpdateTask = async (task: TaskBase) => {
    if (!user) return
    try {
      const isUpdate = tasks.some((t) => t.id === task.id)
      if (isUpdate) {
        await updateTask(task, user.uid)
        toast.success("Task updated successfully!")
      } else {
        const newId = await addTask(task, user.uid)
        toast.success("Task created successfully!")
      }
      await loadTasks()
      closeModal()
    } catch (error) {
      console.error("Error saving task:", error)
      toast.error("Failed to save task. Please try again.")
    }
  }

  const toggleComplete = async (id: string) => {
    if (!user) return
    try {
      const task = tasks.find((t) => t.id === id)
      if (task) {
        await toggleTaskComplete(id, !task.completed)
        await loadTasks()
        toast.success(task.completed ? "Task marked as incomplete!" : "Task completed! Great work!")
      }
    } catch (error) {
      console.error("Error toggling task completion:", error)
      toast.error("Failed to update task. Please try again.")
    }
  }

  const removeTask = async (id: string) => {
    if (!user) return
    try {
      await deleteTask(id)
      await loadTasks()
      toast.success("Task deleted successfully!")
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task. Please try again.")
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleTaskMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setSelectedTask(task)
    setTaskMenuAnchor(event.currentTarget)
  }

  const handleTaskMenuClose = () => {
    setSelectedTask(null)
    setTaskMenuAnchor(null)
  }

  const importanceColor = (importance: Task["importance"]) => {
    switch (importance) {
      case "Hard":
        return theme.palette.error.main
      case "Medium":
        return theme.palette.warning.main
      default:
        return theme.palette.success.main
    }
  }

  const importanceBgColor = (importance: Task["importance"]) => {
    switch (importance) {
      case "Hard":
        return alpha(theme.palette.error.main, 0.1)
      case "Medium":
        return alpha(theme.palette.warning.main, 0.1)
      default:
        return alpha(theme.palette.success.main, 0.1)
    }
  }

  // Calculate statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = totalTasks - completedTasks
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false
    const dueDate = t.dueDate instanceof Date ? t.dueDate : new Date(t.dueDate as any)
    return dueDate < new Date()
  }).length

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Stack spacing={3}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={100} />
          ))}
        </Stack>
      </Box>
    )
  }

  if (!user) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Please log in to view your tasks.</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      p: { xs: 2, md: 4 },
      background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 1)} 0%, ${alpha(theme.palette.secondary.light, 0.03)} 100%)`,
    }}>
      {/* Header Section */}
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
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.secondary.main, 0.3)}`,
                }}>
                  <CheckCircle sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
                    Task Manager
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Organize, prioritize, and conquer your tasks
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<Add />}
              onClick={openNew}
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
              New Task
            </Button>
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
            <Stack spacing={2}>
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
                  <TrendingUp fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h3" fontWeight={800}>
                    {totalTasks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks
                  </Typography>
                </Box>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={totalTasks ? (completedTasks / totalTasks) * 100 : 0}
                sx={{ height: 6, borderRadius: 3 }}
              />
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
                background: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.main,
              }}>
                <Schedule fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight={800}>
                  {pendingTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
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
                background: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
              }}>
                <Flag fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight={800}>
                  {overdueTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overdue
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
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
            {/* Search */}
            <Paper
              component="form"
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                flex: 1,
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
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Paper>

            {/* Filter Chips */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                label="All"
                onClick={() => setFilterBy("all")}
                color={filterBy === "all" ? "secondary" : "default"}
                variant={filterBy === "all" ? "filled" : "outlined"}
                sx={{ borderRadius: 2 }}
              />
              <Chip
                label="Pending"
                onClick={() => setFilterBy("pending")}
                color={filterBy === "pending" ? "warning" : "default"}
                variant={filterBy === "pending" ? "filled" : "outlined"}
                sx={{ borderRadius: 2 }}
              />
              <Chip
                label="Completed"
                onClick={() => setFilterBy("completed")}
                color={filterBy === "completed" ? "success" : "default"}
                variant={filterBy === "completed" ? "filled" : "outlined"}
                sx={{ borderRadius: 2 }}
              />
            </Stack>

            {/* Sort Menu */}
            <Button
              startIcon={<Sort />}
              endIcon={<KeyboardDoubleArrowDown />}
              onClick={handleMenuOpen}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              }}
            >
              Sort by {sortBy === "dueDate" ? "Due Date" : sortBy === "importance" ? "Priority" : "Created"}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => { setSortBy("dueDate"); handleMenuClose() }}>
                <ListItemIcon>
                  <CalendarMonth fontSize="small" />
                </ListItemIcon>
                Due Date
              </MenuItem>
              <MenuItem onClick={() => { setSortBy("importance"); handleMenuClose() }}>
                <ListItemIcon>
                  <Flag fontSize="small" />
                </ListItemIcon>
                Priority
              </MenuItem>
            </Menu>
          </Stack>
        </Paper>
      </Zoom>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Zoom in={true}>
          <Paper sx={{ 
            p: 8, 
            textAlign: 'center', 
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          }}>
            <Box sx={{ fontSize: 64, mb: 2, opacity: 0.3 }}>📝</Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {searchTerm ? "No tasks found" : "No tasks yet"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? "Try a different search term" : "Create your first task to get started!"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openNew}
              sx={{ mt: 3, textTransform: 'none', borderRadius: 3 }}
            >
              Create Task
            </Button>
          </Paper>
        </Zoom>
      ) : (
        <Stack spacing={2}>
          {filteredTasks.map((task, index) => (
            <Grow in={true} timeout={500 + index * 100} key={task.id}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  background: alpha(theme.palette.background.paper, 0.9),
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: task.completed ? 0.8 : 1,
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.1)}`,
                    borderColor: alpha(importanceColor(task.importance), 0.3),
                  },
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background: importanceColor(task.importance),
                    opacity: 0.8,
                  }
                }}
              >
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
                  {/* Checkbox & Content */}
                  <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flex: 1, minWidth: 0 }}>
                    <Tooltip title={task.completed ? "Mark incomplete" : "Mark complete"}>
                      <Checkbox
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}
                        icon={<Circle />}
                        checkedIcon={<CheckCircle />}
                        sx={{
                          color: importanceColor(task.importance),
                          '&.Mui-checked': {
                            color: theme.palette.success.main,
                          }
                        }}
                      />
                    </Tooltip>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack spacing={1.5}>
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              textDecoration: task.completed ? 'line-through' : 'none',
                              color: task.completed ? 'text.secondary' : 'text.primary',
                              fontWeight: 600,
                            }}
                          >
                            {task.title}
                          </Typography>
                          {task.notes && (
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                              <Note sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {task.notes}
                              </Typography>
                            </Stack>
                          )}
                        </Box>

                        {/* Tags & Due Date */}
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Chip
                            label={task.importance}
                            size="small"
                            sx={{
                              background: importanceBgColor(task.importance),
                              color: importanceColor(task.importance),
                              fontWeight: 600,
                              borderRadius: 2,
                            }}
                          />
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <CalendarMonth sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {formatDueDate(task.dueDate)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>

                  {/* Actions */}
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
                    <Tooltip title="Edit task">
                      <IconButton
                        size="small"
                        onClick={() => openEdit(task)}
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
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="More options">
                      <IconButton
                        size="small"
                        onClick={(e) => handleTaskMenuOpen(e, task)}
                        sx={{
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          borderRadius: 2,
                        }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Menu
                      anchorEl={taskMenuAnchor}
                      open={Boolean(taskMenuAnchor && selectedTask?.id === task.id)}
                      onClose={handleTaskMenuClose}
                    >
                      <MenuItem onClick={() => { openEdit(task); handleTaskMenuClose() }}>
                        <ListItemIcon>
                          <Edit fontSize="small" />
                        </ListItemIcon>
                        Edit
                      </MenuItem>
                      <MenuItem onClick={() => { removeTask(task.id); handleTaskMenuClose() }}>
                        <ListItemIcon>
                          <Delete fontSize="small" />
                        </ListItemIcon>
                        Delete
                      </MenuItem>
                    </Menu>
                  </Stack>
                </Stack>
              </Paper>
            </Grow>
          ))}
        </Stack>
      )}

      {/* Footer Stats */}
      {filteredTasks.length > 0 && (
        <Fade in={true} timeout={1500}>
          <Paper sx={{ 
            p: 3, 
            mt: 4,
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Showing {filteredTasks.length} of {tasks.length} tasks
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip 
                  label={`${completedTasks} completed`}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
                <Chip 
                  label={`${overdueTasks} overdue`}
                  size="small"
                  color="error"
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
              </Stack>
            </Stack>
          </Paper>
        </Fade>
      )}

      <AddTaskModal 
        open={showModal} 
        close={closeModal} 
        addNewTask={addOrUpdateTask} 
        initialTask={editingTask} 
      />
    </Box>
  )
}