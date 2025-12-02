"use client"

import Link from "next/link";
import { ArrowRight, ArrowRightOutlined } from "@mui/icons-material";
import { Stack, Typography, Card, CardContent, Box, CardActions, Button } from "@mui/material";

export default function Feature1() {
  const cards = [
    {
      title: 'Tasks: Add & Track',
      desc: 'Create tasks, set due dates, and mark progress. Your to-dos in one place.',
      href: '/dashboard/tasks',
    },
    {
      title: 'Courses: Add Classes',
      desc: 'Add courses, set meeting days and times, and keep your schedule organized.',
      href: '/dashboard/courses',
    },
    {
      title: 'Focus Mode',
      desc: 'Start distraction-free sessions to get work done faster.',
      href: '/dashboard/focus-mode',
    },
  ]

  return (
    <Stack
      direction="column"
      sx={{ padding: { xs: '3rem 1rem', md: '4rem 2rem' }, backgroundColor: 'whitesmoke' }}
    >
      <Typography variant="h4" align="center">Core Features</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={3} justifyContent="center" sx={{ mt: 3 }}>
        {cards.map((c) => (
          <Card key={c.title} sx={{ width: { xs: '100%', md: 320 } }}>
            <CardContent>
              <Typography variant="h6" align="center">{c.title}</Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>{c.desc}</Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button component={Link} href={c.href} size="small" color="secondary" variant="contained" sx={{ textTransform: 'none' }}>Try it</Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}
