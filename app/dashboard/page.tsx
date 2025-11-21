"use client"

import { Box, Card, Grid, Stack, Typography, Paper, Button, List, ListItem, Divider } from "@mui/material";
import CourseCard from "./components/CourseCard";
import FocusChart from "./components/FocusChart";
import dummyContent from "@/lib/dummyContent";
import Link from "next/link";

export default function Dashboard() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', minHeight: '100vh', p: 2 }}>
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
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" mb={1} fontWeight={700}>Courses</Typography>
            <Stack gap={1}>
              {dummyContent.courses.map((c) => (
                <CourseCard course={c} key={c.id} />
              ))}
            </Stack>
          </Paper>
          {/* Middle: Main panel (FocusChart + actions) */}
          <Card variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>Overview</Typography>
                <Typography variant="body2" color="text.secondary">Snapshot of your focus and upcoming items</Typography>
              </Box>
              <Box>
                <Link href="/dashboard/focus-mode" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="primary">Start Focus Mode</Button>
                </Link>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <FocusChart />
          </Card>
          {/* Right: Upcoming & quick actions */}
          <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight={700} mb={1}>Upcoming</Typography>
              <List>
                {dummyContent.courses.slice(0, 3).map((c) => (
                  <ListItem key={c.id} sx={{ p: 0, pb: 1 }}>
                    <Box sx={{ width: '100%' }}>
                      <Typography fontWeight={600}>{c.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{c.date} • {c.time}</Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight={700} mb={1}>Quick Actions</Typography>
              <Stack direction="column" spacing={1}>
                <Link href="/dashboard/calendar" style={{ textDecoration: 'none' }}>
                  <Button variant="outlined" fullWidth>Open Calendar</Button>
                </Link>
                <Link href="/dashboard/focus-mode" style={{ textDecoration: 'none' }}>
                  <Button variant="outlined" fullWidth>Enter Focus Mode</Button>
                </Link>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}