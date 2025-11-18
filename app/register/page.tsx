"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import { Container, Box, TextField, Button, Typography, Alert, Stack } from "@mui/material";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signup, sendVerification, googleSignIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
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

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Create Account
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Sign Up"}
          </Button>
        </form>

        <Stack direction="column" gap={1} sx={{ mt: 1 }}>
          <Button variant="outlined" onClick={handleGoogle} disabled={isLoading}>
            {isLoading ? "Please wait..." : "Continue with Google"}
          </Button>
        </Stack>

        <Typography sx={{ mt: 2 }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#1976d2", cursor: "pointer" }}>
            Sign In
          </a>
        </Typography>
      </Box>
    </Container>
  );
}