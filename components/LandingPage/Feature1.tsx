"use client"

import Link from "next/link";
import { ArrowRight, Rocket, School, TaskAlt, Timer } from "@mui/icons-material";
import { 
  Stack, Typography, Card, CardContent, Box, CardActions, Button, 
  useTheme, alpha, Zoom, Fade, Grow, keyframes, IconButton 
} from "@mui/material";

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const getIconForFeature = (title: string) => {
  if (title.includes('Tasks')) return <TaskAlt fontSize="large" />;
  if (title.includes('Courses')) return <School fontSize="large" />;
  if (title.includes('Focus')) return <Timer fontSize="large" />;
  return <Rocket fontSize="large" />;
};

export default function Feature1() {
  const theme = useTheme();
  
  const cards = [
    {
      title: 'Tasks: Add & Track',
      desc: 'Create tasks, set due dates, and mark progress. Your to-dos in one place.',
      href: '/dashboard/tasks',
      color: theme.palette.warning.main,
    },
    {
      title: 'Courses: Add Classes',
      desc: 'Add courses, set meeting days and times, and keep your schedule organized.',
      href: '/dashboard/courses',
      color: theme.palette.info.main,
    },
    {
      title: 'Focus Mode',
      desc: 'Start distraction-free sessions to get work done faster.',
      href: '/dashboard/focus-mode',
      color: theme.palette.success.main,
    },
  ];

  return (
    <Box
      sx={{
        padding: { xs: '6rem 1rem', md: '8rem 2rem' },
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.5)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 50%, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.light, 0.1)} 0%, transparent 50%)`,
          zIndex: 0,
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={true} timeout={1000}>
          <Stack alignItems="center" spacing={2} sx={{ mb: 6 }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 600,
                letterSpacing: 3,
                color: theme.palette.secondary.main,
                textTransform: 'uppercase',
              }}
            >
              Core Features
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                textAlign: 'center',
                background: `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${alpha(theme.palette.text.primary, 0.7)} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Everything You Need to
              <br />
              <span style={{ color: theme.palette.primary.main }}>Succeed</span>
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600, textAlign: 'center', fontSize: '1.1rem' }}
            >
              Streamline your academic workflow with our powerful yet simple tools
            </Typography>
          </Stack>
        </Fade>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
        >
          {cards.map((card, index) => (
            <Grow in={true} timeout={800 + index * 200} key={card.title}>
              <Card
                sx={{
                  width: { xs: '100%', md: 320 },
                  borderRadius: 4,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  background: alpha(theme.palette.background.paper, 0.95),
                  backdropFilter: 'blur(10px)',
                  overflow: 'visible',
                  transition: 'all 0.4s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.15)}`,
                  },
                }}
              >
                {/* Icon Container */}
                <Box
                  sx={{
                    position: 'relative',
                    mt: -3,
                    mx: 'auto',
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${alpha(card.color, 0.2)} 0%, ${alpha(card.color, 0.4)} 100%)`,
                      animation: `${floatAnimation} 3s ease-in-out infinite`,
                    }}
                  />
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: alpha(card.color, 0.1),
                      border: `2px solid ${alpha(card.color, 0.3)}`,
                      zIndex: 1,
                    }}
                  >
                    {getIconForFeature(card.title)}
                  </Box>
                </Box>

                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      mb: 3,
                      fontSize: '0.95rem',
                    }}
                  >
                    {card.desc}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', pb: 3, pt: 0 }}>
                  <Button
                    component={Link}
                    href={card.href}
                    variant="contained"
                    color="primary"
                    endIcon={<ArrowRight />}
                    sx={{
                      textTransform: 'none',
                      px: 4,
                      py: 1,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${alpha(card.color, 0.8)} 0%, ${card.color} 100%)`,
                      boxShadow: `0 4px 20px ${alpha(card.color, 0.3)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(4px)',
                        boxShadow: `0 8px 30px ${alpha(card.color, 0.4)}`,
                      },
                    }}
                  >
                    Explore
                  </Button>
                </CardActions>
              </Card>
            </Grow>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}