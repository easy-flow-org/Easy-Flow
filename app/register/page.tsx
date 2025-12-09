"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import { 
  Container, Box, TextField, Button, Typography, Alert, Stack, Paper, 
  Divider, Link as MuiLink, LinearProgress, Fade, Zoom, InputAdornment,
  IconButton, useTheme, alpha, Tooltip
} from "@mui/material";
import { toast } from "react-toastify";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InfoIcon from "@mui/icons-material/Info";
import NextLink from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signup, sendVerification, googleSignIn } = useAuth();
  const theme = useTheme();

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const checkPasswordCriteria = () => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(email, password);
      await sendVerification(result.user);

      toast.success("Account created! Check your email to verify.");
      router.push("/login");
    } catch (err: any) {
      const errorMsg = err.message || "Signup failed";
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
      const errorMsg = err.message || "Google sign-up failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();
  const passwordCriteria = checkPasswordCriteria();
  const passwordStrengthColor = passwordStrength < 50 ? "error" : passwordStrength < 75 ? "warning" : "success";

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      position: "relative",
      overflow: "hidden",
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`
    }}>
      {/* Background Elements */}
      <Box sx={{
        position: "absolute",
        top: -100,
        left: -100,
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
        zIndex: 0,
      }} />
      <Box sx={{
        position: "absolute",
        bottom: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
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
            {/* Header */}
            <Fade in={true} timeout={1000}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                }}>
                  <LightbulbIcon sx={{ fontSize: 24, color: "white" }} />
                </Box>
                <Typography variant="h4" sx={{ 
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
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
                Join Easy Flow
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ 
                opacity: 0.8,
                fontSize: "1.1rem"
              }}>
                Create your account to start organizing your academic life
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

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 3 }}
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
                sx={{ mb: 1 }}
                placeholder="••••••••"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Show password">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="medium"
              />
              
              {/* Password Strength Indicator */}
              {password && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={passwordStrength} 
                    color={passwordStrengthColor}
                    sx={{ 
                      height: 6,
                      borderRadius: 3,
                      mb: 1
                    }}
                  />
                  <Stack spacing={0.5}>
                    {Object.entries(passwordCriteria).map(([key, met]) => (
                      <Stack key={key} direction="row" alignItems="center" spacing={1}>
                        {met ? 
                          <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} /> : 
                          <ErrorIcon sx={{ fontSize: 16, color: "error.main" }} />
                        }
                        <Typography variant="caption" color={met ? "success.main" : "text.secondary"}>
                          {key === 'length' && 'At least 8 characters'}
                          {key === 'uppercase' && 'One uppercase letter'}
                          {key === 'number' && 'One number'}
                          {key === 'special' && 'One special character'}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              )}

              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
                placeholder="••••••••"
                error={confirmPassword !== "" && password !== confirmPassword}
                helperText={confirmPassword !== "" && password !== confirmPassword ? "Passwords do not match" : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Show password">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="medium"
              />
              
              <Button
                fullWidth
                variant="contained"
                color="primary"
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
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                  '&:hover': {
                    boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                Or sign up with
              </Typography>
            </Divider>

            {/* Google Sign Up */}
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

            {/* Sign In Link */}
            <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
              Already have an account?{" "}
              <MuiLink 
                component={NextLink} 
                href="/login" 
                sx={{ 
                  fontWeight: 600, 
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                  position: "relative",
                  '&:after': {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "2px",
                    bottom: -2,
                    left: 0,
                    backgroundColor: theme.palette.primary.main,
                    transform: "scaleX(0)",
                    transition: "transform 0.3s ease"
                  },
                  '&:hover:after': {
                    transform: "scaleX(1)"
                  }
                }}
              >
                Sign In
              </MuiLink>
            </Typography>
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
}