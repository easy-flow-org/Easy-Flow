"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Box, Typography, Button } from "@mui/material";
import { useAuth } from "../context/authContext";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!user) return null;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user.email}!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          This is your protected dashboard.
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => logout().then(() => router.push("/"))}>
          Sign Out
        </Button>
      </Box>
    </Container>
  );
}