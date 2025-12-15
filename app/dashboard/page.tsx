"use client"

import { 
  Box, Card, Stack, Typography, Paper, Button, Divider, Chip, 
  Tooltip, CircularProgress, alpha, useTheme, Zoom, Fade, Grow, 
  IconButton, AvatarGroup, Avatar, LinearProgress, Skeleton 
} from "@mui/material";
import CourseCard from "./components/CourseCard";
import FocusChart from "./components/FocusChart";
import Link from "next/link";
import AddCourseModal from "./components/AddCourseModal";
import { useState, useEffect } from "react";
import { Course, Task, TaskBase } from "@/types/types";
import AddTaskModal from "./components/AddTaskModal";
import { useAuth } from "@/app/context/authContext";
import { getCourses, addCourse } from "@/lib/firebase/courses";
import { getTasks, addTask } from "@/lib/firebase/tasks";
import { getPomodoroSessions, PomodoroSession } from "@/lib/firebase/pomodoro";
import { toast } from "react-toastify";
import { 
  Add, PlayArrow, Edit, TrendingUp, CalendarToday, 
  School, TaskAlt, Timer, Rocket, MoreVert, 
  Notifications, Dashboard as DashboardIcon, Refresh
} from "@mui/icons-material";

export default function Dashboard() {
  const theme = useTheme();
  const { user } = useAuth();

  // Related to courses
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesLoading, setCoursesLoading] = useState(true)

  // Related to tasks
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(true)

  // Related to pomodoro sessions
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>([])
  const [pomodoroLoading, setPomodoroLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Load data from Firebase
  useEffect(() => {
    if (user) {
      loadCourses()
      loadTasks()
      loadPomodoroSessions()
    }
  }, [user])

  const loadCourses = async () => {
    if (!user) return
    try {
      setCoursesLoading(true)
      const fetchedCourses = await getCourses(user.uid)
      setCourses(fetchedCourses)
    } catch (error) {
      console.error("Error loading courses:", error)
    } finally {
      setCoursesLoading(false)
    }
  }

  const loadTasks = async () => {
    if (!user) return
    try {
      setTasksLoading(true)
      const fetchedTasks = await getTasks(user.uid)
      setTasks(fetchedTasks)
    } catch (error) {
      console.error("Error loading tasks:", error)
      toast.error("Failed to load tasks")
    } finally {
      setTasksLoading(false)
    }
  }

  const loadPomodoroSessions = async () => {
    if (!user) return
    try {
      setPomodoroLoading(true)
      const fetchedSessions = await getPomodoroSessions(user.uid)
      setPomodoroSessions(fetchedSessions)
    } catch (error) {
      console.error("Error loading pomodoro sessions:", error)
      // Don't show toast for pomodoro loading error - it's non-critical
    } finally {
      setPomodoroLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([
      loadCourses(),
      loadTasks(),
      loadPomodoroSessions()
    ])
    setRefreshing(false)
    toast.success("Dashboard refreshed")
  }

  const addNewCourse = async (newCourse: Course) => {
    if (!user) return
    try {
      const newId = await addCourse(newCourse, user.uid)
      newCourse.id = newId
      await loadCourses()
      toast.success("Course added successfully!")
    } catch (error) {
      console.error("Error adding course:", error)
      toast.error("Failed to add course. Please try again.")
    }
  };

  // Related to add courses modal
  const [showAddCourseModal, setAddCourseModal] = useState(false)
  const handleAddCourseOpen = () => setAddCourseModal(true);
  const handleAddCourseClose = () => setAddCourseModal(false);

  const addNewTask = async (newTask: TaskBase) => {
    if (!user) return
    try {
      const newId = await addTask(newTask, user.uid)
      newTask.id = newId
      await loadTasks()
      toast.success("Task added successfully!")
    } catch (error) {
      console.error("Error adding task:", error)
      toast.error("Failed to add task. Please try again.")
    }
  }

  // Related to add new task modal
  const [showAddTaskModal, setAddTaskModal] = useState(false)
  const handleAddTaskOpen = () => setAddTaskModal(true);
  const handleAddTaskClose = () => setAddTaskModal(false);

  // Calculate statistics
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalFocusTime = pomodoroSessions.reduce((acc, session) => acc + (session.duration || 0), 0);
  const upcomingTasks = tasks.filter(t => !t.completed).slice(0, 5);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      p: { xs: 1, md: 3 },
      background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 1)} 0%, ${alpha(theme.palette.secondary.light, 0.03)} 100%)`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 70%)`,
        zIndex: 0,
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.1)} 0%, transparent 70%)`,
        zIndex: 0,
      }} />

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Fade in={true} timeout={800}>
          <Box sx={{ mb: 4 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={2}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.secondary.main, 0.3)}`,
                  }}>
                    <DashboardIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
                      Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Student'}!
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton 
                  onClick={handleRefresh}
                  sx={{
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'rotate(45deg)',
                      background: alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                >
                  <Refresh sx={{ 
                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    }
                  }} />
                </IconButton>
                <IconButton sx={{
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  borderRadius: 2,
                }}>
                  <Notifications />
                </IconButton>
                <IconButton sx={{
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  borderRadius: 2,
                }}>
                  <MoreVert />
                </IconButton>
              </Stack>
            </Stack>

            {/* Stats Cards */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
              <Grow in={true} timeout={500}>
                <Card sx={{ 
                  flex: 1, 
                  p: 3, 
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 10px 30px ${alpha(theme.palette.info.main, 0.1)}`,
                  }
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
                      <School fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {courses.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Courses
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grow>

              <Grow in={true} timeout={700}>
                <Card sx={{ 
                  flex: 1, 
                  p: 3, 
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 10px 30px ${alpha(theme.palette.warning.main, 0.1)}`,
                  }
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
                      <TaskAlt fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {completedTasks}/{tasks.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tasks Completed
                      </Typography>
                    </Box>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={tasks.length ? (completedTasks / tasks.length) * 100 : 0}
                    sx={{ mt: 2, height: 6, borderRadius: 3 }}
                  />
                </Card>
              </Grow>

              <Grow in={true} timeout={900}>
                <Card sx={{ 
                  flex: 1, 
                  p: 3, 
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 10px 30px ${alpha(theme.palette.success.main, 0.1)}`,
                  }
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
                      <Timer fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {Math.floor(totalFocusTime / 60)}h
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Focus Time
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grow>
            </Stack>
          </Box>
        </Fade>

        {/* Main Content Grid */}
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', lg: '320px 1fr 320px' },
            alignItems: 'start',
          }}
        >

          {/* Left: Courses Panel */}
          <Zoom in={true} timeout={800}>
            <Card sx={{ 
              p: 3, 
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
              boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.08)}`,
              height: 'fit-content',
              position: 'sticky',
              top: 24,
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <School sx={{ fontSize: 20, color: theme.palette.info.main }} />
                    Courses
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {courses.length} active courses
                  </Typography>
                </Box>
                <Link href="/dashboard/courses" style={{ textDecoration: 'none' }}>
                  <Button 
                    size="small" 
                    endIcon={<TrendingUp sx={{ fontSize: 16 }} />}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    View All
                  </Button>
                </Link>
              </Stack>

              <Stack gap={2} sx={{ maxHeight: 500, overflow: 'auto', pr: 1 }}>
                {coursesLoading ? (
                  [1, 2, 3].map((i) => (
                    <Paper key={i} sx={{ p: 2, borderRadius: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="60%" />
                          <Skeleton variant="text" width="40%" />
                        </Box>
                      </Stack>
                    </Paper>
                  ))
                ) : courses.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Box sx={{ fontSize: 48, opacity: 0.3, mb: 1 }}>📚</Box>
                    <Typography variant="body2" color="text.secondary">
                      No courses yet
                    </Typography>
                    <Button 
                      size="small" 
                      startIcon={<Add />}
                      onClick={handleAddCourseOpen}
                      sx={{ mt: 2, textTransform: 'none' }}
                    >
                      Add Your First Course
                    </Button>
                  </Box>
                ) : (
                  courses.map((course, index) => (
                    <Grow in={true} timeout={500 + index * 100} key={course.id}>
                      <Box>
                        <CourseCard course={course} />
                      </Box>
                    </Grow>
                  ))
                )}
              </Stack>
            </Card>
          </Zoom>

          {/* Middle: Main Dashboard Panel */}
          <Stack spacing={3}>
            <Zoom in={true} timeout={1000}>
              <Card sx={{ 
                p: 4, 
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
                boxShadow: `0 15px 50px ${alpha(theme.palette.common.black, 0.1)}`,
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                  <Box>
                    <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                      Focus Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Track your productivity and focus patterns
                    </Typography>
                  </Box>
                  <Link href="/dashboard/focus-mode" style={{ textDecoration: 'none' }}>
                    <Button 
                      variant="contained" 
                      color="secondary"
                      startIcon={<PlayArrow />}
                      sx={{ 
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                        boxShadow: `0 8px 30px ${alpha(theme.palette.secondary.main, 0.3)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 12px 40px ${alpha(theme.palette.secondary.main, 0.4)}`,
                        }
                      }}
                    >
                      Start Focus Session
                    </Button>
                  </Link>
                </Stack>

                <Divider sx={{ 
                  my: 3, 
                  borderColor: alpha(theme.palette.divider, 0.1),
                  '&:before, &:after': {
                    borderColor: alpha(theme.palette.divider, 0.1),
                  }
                }} />

                <FocusChart />
              </Card>
            </Zoom>

            {/* Quick Stats */}
            <Fade in={true} timeout={1200}>
              <Card sx={{ 
                p: 3, 
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
              }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                  Recent Activity
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={800} color="primary">
                      {pomodoroSessions.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Focus Sessions
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={800} color="secondary">
                      {upcomingTasks.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Tasks
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={800} color="success">
                      {courses.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Courses
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Fade>
          </Stack>

          {/* Right: Tasks & Quick Actions */}
          <Stack spacing={3}>
            <Zoom in={true} timeout={1200}>
              <Card sx={{ 
                p: 3, 
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
                boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.08)}`,
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TaskAlt sx={{ fontSize: 20, color: theme.palette.warning.main }} />
                      Upcoming Tasks
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {upcomingTasks.length} pending tasks
                    </Typography>
                  </Box>
                  <Link href="/dashboard/tasks" style={{ textDecoration: 'none' }}>
                    <Button 
                      size="small" 
                      endIcon={<TrendingUp sx={{ fontSize: 16 }} />}
                      sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                      View All
                    </Button>
                  </Link>
                </Stack>

                <Stack spacing={2}>
                  {tasksLoading ? (
                    [1, 2, 3].map((i) => (
                      <Paper key={i} sx={{ p: 2, borderRadius: 2 }}>
                        <Stack spacing={1}>
                          <Skeleton variant="text" width="70%" />
                          <Skeleton variant="text" width="40%" />
                        </Stack>
                      </Paper>
                    ))
                  ) : upcomingTasks.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Box sx={{ fontSize: 48, opacity: 0.3, mb: 1 }}>✓</Box>
                      <Typography variant="body2" color="text.secondary">
                        All caught up!
                      </Typography>
                    </Box>
                  ) : (
                    upcomingTasks.map((task, index) => (
                      <Grow in={true} timeout={600 + index * 100} key={task.id}>
                        <Paper 
                          sx={{ 
                            p: 2.5, 
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateX(4px)',
                              borderColor: alpha(theme.palette.warning.main, 0.3),
                              boxShadow: `0 5px 20px ${alpha(theme.palette.warning.main, 0.1)}`,
                            }
                          }}
                        >
                          <Stack spacing={1.5}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Typography variant="subtitle1" fontWeight={600}>
                                {task.title}
                              </Typography>
                              <Chip 
                                label={task.importance} 
                                size="small"
                                sx={{
                                  background: task.importance === 'Hard' 
                                    ? alpha(theme.palette.error.main, 0.1)
                                    : task.importance === 'Medium'
                                    ? alpha(theme.palette.warning.main, 0.1)
                                    : alpha(theme.palette.success.main, 0.1),
                                  color: task.importance === 'Hard'
                                    ? theme.palette.error.main
                                    : task.importance === 'Medium'
                                    ? theme.palette.warning.main
                                    : theme.palette.success.main,
                                  fontWeight: 500,
                                }}
                              />
                            </Stack>
                            
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <CalendarToday sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                              <Typography variant="caption" color="text.secondary">
                                Due {(() => {
                                  const d = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate as any);
                                  const now = new Date();
                                  const diff = d.getTime() - now.getTime();
                                  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                                  
                                  if (days === 0) return "today";
                                  if (days === 1) return "tomorrow";
                                  if (days < 7) return `in ${days} days`;
                                  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                })()}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Paper>
                      </Grow>
                    ))
                  )}
                </Stack>
              </Card>
            </Zoom>

            <Zoom in={true} timeout={1400}>
              <Card sx={{ 
                p: 3, 
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
                boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.08)}`,
              }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rocket sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                  Quick Actions
                </Typography>
                
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<Add />}
                    onClick={handleAddTaskOpen}
                    sx={{ 
                      textTransform: 'none',
                      py: 1.5,
                      borderRadius: 3,
                      justifyContent: 'flex-start',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
                      }
                    }}
                  >
                    New Task
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    startIcon={<Add />}
                    onClick={handleAddCourseOpen}
                    sx={{ 
                      textTransform: 'none',
                      py: 1.5,
                      borderRadius: 3,
                      justifyContent: 'flex-start',
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                      boxShadow: `0 4px 20px ${alpha(theme.palette.secondary.main, 0.3)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 30px ${alpha(theme.palette.secondary.main, 0.4)}`,
                      }
                    }}
                  >
                    New Course
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Edit />}
                    onClick={() => toast.info("Edit feature coming soon!")}
                    sx={{ 
                      textTransform: 'none',
                      py: 1.5,
                      borderRadius: 3,
                      justifyContent: 'flex-start',
                      borderColor: alpha(theme.palette.divider, 0.3),
                      color: theme.palette.text.primary,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        background: alpha(theme.palette.primary.main, 0.04),
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Edit Dashboard
                  </Button>
                </Stack>
              </Card>
            </Zoom>
          </Stack>
        </Box>
      </Box>

      {/* Modals */}
      <AddCourseModal open={showAddCourseModal} close={handleAddCourseClose} addNewCourse={addNewCourse} />
      <AddTaskModal open={showAddTaskModal} close={handleAddTaskClose} addNewTask={addNewTask} />
    </Box>
  );
}