"use client"

import { Card, Stack, Typography, Box, Button } from "@mui/material";
import Link from "next/link";

export default function Feature2() {
  const items = [
    { title: 'One app, total control', desc: 'Manage deadlines, notes, and to-dos without the chaos.' },
    { title: 'Work smarter, not harder', desc: 'Get reminders that actually help you plan ahead.' },
    { title: 'Designed for deep focus', desc: 'No distractions, just you and your goals.' },
    { title: 'Built for students', desc: 'Everything you need to stay on top and organized.' },
  ]

  return (
    <Stack spacing={3} sx={{ padding: { xs: '3rem 1rem', md: '4rem 3rem' }, backgroundColor: 'whitesmoke' }}>
      <Typography variant="h4" align="center">Why EasyFlow?</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="center">
        {items.map((it) => (
          <Card key={it.title} sx={{ minWidth: 240, maxWidth: 360, p: 2 }}>
            <Typography variant="h6" align="center">{it.title}</Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>{it.desc}</Typography>
          </Card>
        ))}
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button component={Link} href="/dashboard/courses" variant="contained" color="secondary" sx={{ textTransform: 'none' }}>Get Started</Button>
      </Box>
    </Stack>
  )
}
