"use client"

import { Button, Container, Stack, styled, Typography, Box } from "@mui/material";
import Image from 'next/image'
import HeroNav from "./HeroNav";
import Link from "next/link";
import previewImg from "../../public/preview.png"

const HeroContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}))

export default function Hero() {
  return (
    <>
      <HeroNav />

      <HeroContainer maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
          <Box sx={{ flex: 1 }}>
            <Stack spacing={2}>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
                EasyFlow — organize classes, tasks, and focus time
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Built for students: add courses, track tasks, and launch focused sessions — all in one clean interface.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                <Button component={Link} href="/dashboard/courses" variant="contained" color="secondary" sx={{ textTransform: 'none' }}>
                  View Courses
                </Button>
                <Button component={Link} href="/dashboard/tasks" variant="outlined" color="inherit" sx={{ textTransform: 'none' }}>
                  View Tasks
                </Button>
                <Button component={Link} href="/dashboard/focus-mode" variant="text" color="secondary" sx={{ textTransform: 'none' }}>
                  Try Focus Mode
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box
              sx={{
                bgcolor: 'whitesmoke',
                borderRadius: 2,
                width: '100%',
                maxWidth: 760,
                height: { xs: 220, md: 400 },
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 3,
              }}
            >
              <Image
                src={previewImg}
                alt="App Preview"
                fill
                sizes="(max-width:600px) 100vw, (max-width:1200px) 50vw, 760px"
              />
            </Box>
          </Box>
        </Stack>
      </HeroContainer>
    </>
  )
}