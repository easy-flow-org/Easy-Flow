"use client"

import { Box, Card, Stack, Typography, Paper, Button, Divider, Chip, Tooltip, CircularProgress } from "@mui/material";
import CourseCard from "./components/CourseCard";
import FocusChart from "./components/FocusChart";
import Link from "next/link";
import { useTheme } from '@mui/material/styles';
import AddCourseModal from "./components/AddCourseModal";
import { useState, useEffect } from "react";
import { Course, Task } from "@/types/types";
import AddTaskModal from "./components/AddTaskModal";
import { useAuth } from "@/app/context/authContext";
import { getCourses, addCourse } from "@/lib/firebase/courses";
import { getTasks, addTask } from "@/lib/firebase/tasks";
import { getPomodoroSessions, PomodoroSession } from "@/lib/firebase/pomodoro";
import { toast } from "react-toastify";

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
  const handleAddCourseOpen = () => {
    setAddCourseModal(true);
  };

  const handleAddCourseClose = () => {
    setAddCourseModal(false);
  };
  //

  const addNewTask = async (newTask: Task) => {
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
  //

  // Related to add new task modal
  const [showAddTaskModal, setAddTaskModal] = useState(false)
  const handleAddTaskOpen = () => {
    setAddTaskModal(true);
  };

  const handleAddTaskClose = () => {
    setAddTaskModal(false);
  };
  //

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', minHeight: '100vh', p: 2, backgroundColor: (t) => t.palette.background.default }}>
      <Box sx={{ minWidth: 800, width: '100%', maxWidth: 1200 }}>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: '240px 1fr 240px' },
            alignItems: 'start',
          }}
        >

          {/* Left: Courses list */}
          <Paper variant="outlined" sx={{ p: 2, backgroundColor: (t) => t.palette.background.paper, boxShadow: 1, borderColor: (t) => t.palette.divider }}>
            <Link href="dashboard/courses" style={{ textDecoration: "none" }}>
              <Tooltip title="See all Courses"><Typography variant="h6" mb={1} fontWeight={700} sx={{ color: theme.palette.text.primary, width: "fit-content" }}>Courses</Typography></Tooltip>
            </Link>
            <Stack gap={1} overflow={"auto"} height={511}>
              {coursesLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : courses.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center" }}>
                  No courses yet. Add your first course!
                </Typography>
              ) : (
                courses.map((c) => (
                  <CourseCard course={c} key={c.id} />
                ))
              )}
            </Stack>
          </Paper>

          {/* Middle: Main panel (FocusChart + actions) */}
          <Card variant="outlined" sx={{ p: 2, backgroundColor: (t) => t.palette.background.paper, boxShadow: 1, height: "100%" }}>
            <Stack direction={"row"} gap={2} sx={{ alignItems: "center" }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>Overview</Typography>
                <Typography variant="body2" color="text.secondary">Snapshot of your focus and upcoming items</Typography>
              </Box>
              <Box>
                <Link href="/dashboard/focus-mode" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="secondary" sx={{ textTransform: 'none' }}>Start Focus Mode</Button>
                </Link>
              </Box>
            </Stack>
            <Divider sx={{ mt: 5, mb: 5 }} />
            <FocusChart />
          </Card>

          {/* Right: Upcoming & quick actions */}
          <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 2, backgroundColor: (t) => t.palette.background.paper, boxShadow: 1, }}>
              <Link href={"dashboard/tasks"} style={{ textDecoration: "none" }} >
                <Tooltip title="See all tasks" placement="bottom-start">
                  <Typography variant="h6" fontWeight={700} sx={{ color: theme.palette.text.primary, mb: 1 }}>Upcoming Tasks</Typography>
                </Tooltip>
              </Link>
              <Stack spacing={1}>
                {/* Task Cards */}
                {tasksLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : tasks.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 1, textAlign: "center" }}>
                    No tasks yet
                  </Typography>
                ) : (
                  tasks.slice(0, 3).map((task) => (
                  <Paper key={task.id} variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>{task.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(() => {
                          const d = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate as any)
                          return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                        })()}
                      </Typography>
                    </Box>
                    <Chip label={task.importance} size="small" color={task.importance === 'Hard' ? 'error' : task.importance === 'Medium' ? 'warning' : 'default'} />
                  </Paper>
                  ))
                )}
              </Stack>
            </Paper>
            <Paper variant="outlined" sx={{ p: 1.5, backgroundColor: (t) => t.palette.background.paper, boxShadow: 1 }}>
              <Typography variant="h6" fontWeight={700} mb={1} sx={{ color: theme.palette.text.primary }}>Quick Actions</Typography>
              <Stack direction="column" spacing={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ textTransform: 'none' }}
                  onClick={handleAddTaskOpen}
                >
                  New Task
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  color="secondary"
                  sx={{ textTransform: 'none' }}
                  onClick={handleAddCourseOpen}
                >
                  New Course
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  color="inherit"
                  sx={{ textTransform: 'none' }}
                  onClick={() => alert('Edit — not implemented')}
                >
                  Edit
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Box>
      <AddCourseModal open={showAddCourseModal} close={handleAddCourseClose} addNewCourse={addNewCourse}></AddCourseModal>
      <AddTaskModal open={showAddTaskModal} close={handleAddTaskClose} addNewTask={addNewTask}></AddTaskModal>
    </Box>
  );
}