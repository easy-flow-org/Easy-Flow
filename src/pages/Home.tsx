import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useAuth } from "../context/authContext";

const Home: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Welcome{user?.email ? `, ${user.email}` : ""}!
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          This is your protected home page.
        </Typography>

        <Button variant="contained" color="secondary" onClick={logout}>
          Sign out
        </Button>
      </Box>
    </Container>
  );
};

export default Home;