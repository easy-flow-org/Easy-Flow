"use client"

import { 
  Card, Stack, Typography, Box, Button, 
  useTheme, alpha, Fade, Zoom
} from "@mui/material";
import { CheckCircle, TrendingUp, Psychology, School } from "@mui/icons-material";
import Link from "next/link";

export default function Feature2() {
  const theme = useTheme();
  
  const items = [
    { 
      title: 'One app, total control', 
      desc: 'Manage deadlines, notes, and to-dos without the chaos.',
      icon: <CheckCircle fontSize="large" />,
      color: theme.palette.primary.main
    },
    { 
      title: 'Work smarter, not harder', 
      desc: 'Get reminders that actually help you plan ahead.',
      icon: <TrendingUp fontSize="large" />,
      color: theme.palette.secondary.main
    },
    { 
      title: 'Designed for deep focus', 
      desc: 'No distractions, just you and your goals.',
      icon: <Psychology fontSize="large" />,
      color: theme.palette.success.main
    },
    { 
      title: 'Built for students', 
      desc: 'Everything you need to stay on top and organized.',
      icon: <School fontSize="large" />,
      color: theme.palette.warning.main
    },
  ];

  return (
    <Box
      sx={{
        padding: { xs: '6rem 1rem', md: '8rem 3rem' },
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
          transform: 'translate(30%, -30%)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
          transform: 'translate(-30%, 30%)',
          zIndex: 0,
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={true} timeout={800}>
          <Stack alignItems="center" spacing={2} sx={{ mb: 6 }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 600,
                letterSpacing: 3,
                color: theme.palette.primary.main,
                textTransform: 'uppercase',
              }}
            >
              Why Choose EasyFlow
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                textAlign: 'center',
                color: theme.palette.text.primary,
              }}
            >
              The Student's
              <br />
              <span style={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Secret Weapon
              </span>
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ 
                maxWidth: 700, 
                textAlign: 'center', 
                fontSize: '1.1rem',
                lineHeight: 1.8 
              }}
            >
              Join thousands of students who have transformed their academic workflow with our intuitive platform
            </Typography>
          </Stack>
        </Fade>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          justifyContent="center"
          flexWrap="wrap"
          sx={{ mb: 6 }}
        >
          {items.map((item, index) => (
            <Zoom in={true} timeout={1000 + index * 200} key={item.title}>
              <Card
                sx={{
                  minWidth: 240,
                  maxWidth: 280,
                  flex: 1,
                  p: 4,
                  borderRadius: 4,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  background: alpha(theme.palette.background.paper, 0.9),
                  backdropFilter: 'blur(10px)',
                  boxShadow: `0 10px 30px ${alpha(theme.palette.common.black, 0.08)}`,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.12)}`,
                    borderColor: alpha(item.color, 0.3),
                  },
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(item.color, 0.1),
                    border: `2px solid ${alpha(item.color, 0.2)}`,
                    mb: 3,
                    color: item.color,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: theme.palette.text.primary,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6,
                    flexGrow: 1,
                  }}
                >
                  {item.desc}
                </Typography>
              </Card>
            </Zoom>
          ))}
        </Stack>

        <Fade in={true} timeout={1500}>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              component={Link}
              href="/dashboard/courses"
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                textTransform: 'none',
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.secondary.main, 0.3)}`,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 40px ${alpha(theme.palette.secondary.main, 0.4)}`,
                },
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'left 0.7s ease',
                },
                '&:hover:before': {
                  left: '100%',
                },
              }}
            >
              Start Your Journey
            </Button>
            
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: 'block',
                mt: 2,
                fontStyle: 'italic',
              }}
            >
              🎓 Join 50,000+ students who improved their grades
            </Typography>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}