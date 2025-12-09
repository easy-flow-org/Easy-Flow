"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import { 
  Container, Box, TextField, Button, Typography, Alert, Stack, Paper, 
  Divider, Link as MuiLink, Fade, Zoom, InputAdornment, IconButton,
  useTheme, alpha
} from "@mui/material";
import { toast } from "react-toastify";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import NextLink from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, googleSignIn } = useAuth();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (!result.user.emailVerified) {
        toast.warning("Please verify your email before logging in.");
        setError("Email not verified");
        setIsLoading(false);
        return;
      }

      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      const errorMsg = err.message || "Login failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setIsLoading(true);
    try {
      await googleSignIn();
      toast.success("Signed in with Google");
      router.push("/dashboard");
    } catch (err: any) {
      const errorMsg = err.message || "Google sign-in failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      position: "relative",
      overflow: "hidden",
      background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`
    }}>
      {/* Subtle Background Elements */}
      <Box sx={{
        position: "absolute",
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
        zIndex: 0,
      }} />
      <Box sx={{
        position: "absolute",
        bottom: -100,
        left: -100,
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
        zIndex: 0,
      }} />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Zoom in={true} timeout={800}>
          <Paper elevation={0} sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 4,
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.1)}`
          }}>
            {/* Animated Header */}
            <Fade in={true} timeout={1000}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.secondary.main, 0.3)}`
                }}>
                  <LightbulbIcon sx={{ fontSize: 24, color: "white" }} />
                </Box>
                <Typography variant="h4" sx={{ 
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  Easy Flow
                </Typography>
              </Stack>
            </Fade>

            {/* Title */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography variant="h3" sx={{ 
                mb: 1, 
                fontWeight: 700,
                color: theme.palette.text.primary
              }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ 
                opacity: 0.8,
                fontSize: "1.1rem"
              }}>
                Sign in to your account to continue
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Fade in={!!error}>
                <Alert severity="error" sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  borderLeft: `4px solid ${theme.palette.error.main}`
                }}>
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
                placeholder="you@example.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="medium"
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
                placeholder="••••••••"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="medium"
              />
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                type="submit"
                disabled={isLoading}
                size="large"
                sx={{ 
                  mb: 2, 
                  textTransform: 'none',
                  height: 56,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.secondary.main, 0.3)}`,
                  '&:hover': {
                    boxShadow: `0 8px 30px ${alpha(theme.palette.secondary.main, 0.4)}`,
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                Or continue with
              </Typography>
            </Divider>

            {/* Google Sign In */}
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogle}
              disabled={isLoading}
              size="large"
              startIcon={<GoogleIcon />}
              sx={{ 
                mb: 3, 
                textTransform: 'none',
                height: 56,
                fontSize: "1rem",
                fontWeight: 500,
                borderRadius: 2,
                borderColor: alpha(theme.palette.text.primary, 0.2),
                color: theme.palette.text.primary,
                '&:hover': {
                  borderColor: alpha(theme.palette.text.primary, 0.4),
                  backgroundColor: alpha(theme.palette.text.primary, 0.04),
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {isLoading ? "Please wait..." : "Continue with Google"}
            </Button>

            {/* Sign Up Link */}
            <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
              Don't have an account?{" "}
              <MuiLink 
                component={NextLink} 
                href="/register" 
                sx={{ 
                  fontWeight: 600, 
                  textDecoration: "none",
                  color: theme.palette.secondary.main,
                  position: "relative",
                  '&:after': {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "2px",
                    bottom: -2,
                    left: 0,
                    backgroundColor: theme.palette.secondary.main,
                    transform: "scaleX(0)",
                    transition: "transform 0.3s ease"
                  },
                  '&:hover:after': {
                    transform: "scaleX(1)"
                  }
                }}
              >
                Sign Up
              </MuiLink>
            </Typography>
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
}