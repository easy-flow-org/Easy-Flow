"use client"

import { Box, Card, Stack, Typography, Paper, Button, Divider, Chip } from "@mui/material";
import CourseCard from "./components/CourseCard";
import FocusChart from "./components/FocusChart";
import dummyContent from "@/lib/dummyContent";
import Link from "next/link";
import { useTheme } from '@mui/material/styles';
import AddCourseModal from "./components/AddCourseModal";
import { useState } from "react";
import { Course, Task } from "@/types/types";

export default function Dashboard() {
  const theme = useTheme();

  // Related to courses
  const [courses, setCourses] = useState<Course[]>([...dummyContent.courses])

  const addNewCourse = (newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
  };
  //

  // Related to add courses modal
  const [showAddCourseModal, setAddCourseModal] = useState(false)
  const handleAddCourseOpen = () => {
    setAddCourseModal(true);
  };

  const handleAddCourseClose = () => {
    setAddCourseModal(false);
  };
  //

  // Related to tasks
  const [tasks, setTasks] = useState<Task[]>([...dummyContent.tasks])

  const addNewTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask])
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
      <Box sx={{ p: 2, minWidth: 800, width: '100%', maxWidth: 1200 }}>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: '240px 1fr 240px' },
            alignItems: 'start',
          }}
        >

          {/* Left: Courses list */}
          <Paper variant="outlined" sx={{ p: 2, height: "456px", backgroundColor: (t) => t.palette.background.paper, boxShadow: 1, borderColor: (t) => t.palette.divider }}>
            <Link href="dashboard/courses" style={{ textDecoration: "none" }}>
              <Typography variant="h6" mb={1} fontWeight={700} sx={{ color: theme.palette.text.primary, width: "fit-content" }}>Courses</Typography>
            </Link>
            <Stack gap={1} height={"380px"} overflow={"auto"}>
              {courses.map((c) => (
                <CourseCard course={c} key={c.id} />
              ))}
            </Stack>
          </Paper>

          {/* Middle: Main panel (FocusChart + actions) */}
          <Card variant="outlined" sx={{ p: 2, backgroundColor: (t) => t.palette.background.paper, boxShadow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>Overview</Typography>
                <Typography variant="body2" color="text.secondary">Snapshot of your focus and upcoming items</Typography>
              </Box>
              <Box>
                <Link href="/dashboard/focus-mode" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="secondary" sx={{ textTransform: 'none' }}>Start Focus Mode</Button>
                </Link>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <FocusChart />
          </Card>

          {/* Right: Upcoming & quick actions */}
          <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 2, backgroundColor: (t) => t.palette.background.paper, boxShadow: 1, }}>
              <Link href={"dashboard/tasks"} style={{ textDecoration: "none" }} >
                <Typography variant="h6" fontWeight={700} sx={{ color: theme.palette.text.primary, mb: 1 }}>Upcoming Tasks</Typography>
              </Link>
              <Stack spacing={1}>
                {/* Task Cards */}
                {tasks.slice(0, 3).map((task) => (
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
                ))}
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
                  onClick={() => alert('New Task — not implemented')}
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
    </Box>
  );
}