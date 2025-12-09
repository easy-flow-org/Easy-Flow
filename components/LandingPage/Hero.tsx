"use client"

import { Button, Container, Stack, Typography, Box, Fade, Zoom, useTheme, alpha, keyframes } from "@mui/material";
import Image from 'next/image'
import HeroNav from "./HeroNav";
import Link from "next/link";
import previewImg from "../../public/preview.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const HeroContainer = Container;

export default function Hero() {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <HeroNav />

      <HeroContainer maxWidth="lg" sx={{ 
        py: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Background Elements */}
        <Box sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.secondary.light, 0.1)} 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 50%)`,
          zIndex: 0
        }} />

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
          {/* Left Content */}
          <Box sx={{ flex: 1 }}>
            <Fade in={true} timeout={1000}>
              <Stack spacing={3}>
                {/* Badge */}
                <Box sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  px: 2,
                  py: 0.5,
                  borderRadius: 20,
                  background: alpha(theme.palette.secondary.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                  width: "fit-content"
                }}>
                  <Typography variant="caption" sx={{ 
                    fontWeight: 600,
                    color: theme.palette.secondary.main,
                    textTransform: "uppercase",
                    letterSpacing: 1
                  }}>
                    🚀 New Platform
                  </Typography>
                </Box>

                {/* Main Title */}
                <Typography variant="h2" component="h1" sx={{ 
                  fontWeight: 800,
                  lineHeight: 1.2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundSize: "200% 200%",
                  animation: `${gradientAnimation} 5s ease infinite`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  Transform Your Study
                  <br />
                  <span style={{ color: theme.palette.text.primary }}>Workflow with</span> EasyFlow
                </Typography>

                {/* Subtitle */}
                <Typography variant="h5" color="text.secondary" sx={{ 
                  fontWeight: 400,
                  lineHeight: 1.6,
                  maxWidth: "90%"
                }}>
                  The all-in-one platform designed for students. Organize courses, 
                  manage tasks, and optimize focus time in one beautifully 
                  integrated interface.
                </Typography>

                {/* Features List */}
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {['Course Management', 'Smart Task Tracking', 'Focus Timer', 'Progress Analytics'].map((feature, index) => (
                    <Stack key={feature} direction="row" alignItems="center" spacing={1}>
                      <Box sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: theme.palette.secondary.main
                      }} />
                      <Typography variant="body1" color="text.primary">
                        {feature}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                {/* CTA Buttons */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                  <Button 
                    component={Link} 
                    href="/register" 
                    variant="contained" 
                    color="secondary" 
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    sx={{ 
                      textTransform: 'none', 
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                      boxShadow: `0 8px 32px ${alpha(theme.palette.secondary.main, 0.3)}`,
                      transition: 'all 0.3s ease',
                      transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                      '&:hover': {
                        boxShadow: `0 12px 40px ${alpha(theme.palette.secondary.main, 0.4)}`,
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    Start Free Trial
                  </Button>
                  <Button 
                    component={Link} 
                    href="#features" 
                    variant="outlined" 
                    color="inherit" 
                    size="large"
                    sx={{ 
                      textTransform: 'none', 
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      borderRadius: 2,
                      borderColor: alpha(theme.palette.text.primary, 0.2),
                      color: theme.palette.text.primary,
                      '&:hover': {
                        borderColor: alpha(theme.palette.text.primary, 0.4),
                        backgroundColor: alpha(theme.palette.text.primary, 0.04),
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    See How It Works
                  </Button>
                </Stack>

                {/* Trust Indicator */}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                  🎓 Trusted by students from 100+ universities worldwide
                </Typography>
              </Stack>
            </Fade>
          </Box>

          {/* Right Image */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <Zoom in={true} timeout={1500}>
              <Box sx={{
                position: "relative",
                animation: `${floatAnimation} 6s ease-in-out infinite`
              }}>
                {/* Device Frame */}
                <Box sx={{
                  width: { xs: '100%', md: 560 },
                  height: { xs: 280, md: 420 },
                  borderRadius: 4,
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: `0 40px 80px ${alpha(theme.palette.common.black, 0.2)}`,
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  '&:before': {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 12,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    zIndex: 2
                  }
                }}>
                  <Image
                    src={previewImg}
                    alt="EasyFlow Dashboard Preview"
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 560px"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                  
                  {/* Overlay Gradient */}
                  <Box sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(to bottom, transparent 70%, ${alpha(theme.palette.background.paper, 0.3)})`
                  }} />
                </Box>

                {/* Floating Elements */}
                <Box sx={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: alpha(theme.palette.primary.main, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  backdropFilter: "blur(10px)"
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    🎯
                  </Typography>
                </Box>

                <Box sx={{
                  position: "absolute",
                  bottom: -20,
                  left: -20,
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: alpha(theme.palette.secondary.main, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                  backdropFilter: "blur(10px)"
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
                    ⚡
                  </Typography>
                </Box>
              </Box>
            </Zoom>
          </Box>
        </Stack>
      </HeroContainer>
    </>
  );
}