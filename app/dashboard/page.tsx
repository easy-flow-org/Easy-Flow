"use client"

import { Box, Card, Stack, Typography, Paper, Button, List, ListItem, Divider } from "@mui/material";
import CourseCard from "./components/CourseCard";
import FocusChart from "./components/FocusChart";
import dummyContent from "@/lib/dummyContent";
import Link from "next/link";
import { useTheme } from '@mui/material/styles';
import AddCourseModal from "./components/AddCourseModal";
import { useState } from "react";
import { Course } from "@/types/types";
import to12Hour from "@/lib/to12Hour";

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
            <Typography variant="h6" mb={1} fontWeight={700} sx={{ color: theme.palette.text.primary }}>Courses</Typography>
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
              <Typography variant="h6" fontWeight={700} mb={1} sx={{ color: theme.palette.text.primary }}>Upcoming</Typography>
              <List>
                {courses.slice(0, 3).map((c) => (
                  <ListItem key={c.id} sx={{ p: 0, pb: 1 }}>
                    <Box sx={{ width: '100%' }}>
                      <Typography fontWeight={600}>{c.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{c.days.split(",")[0]} • {to12Hour(c.startTime)}</Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
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