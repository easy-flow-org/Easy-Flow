"use client"

import { Button, Container, Typography, Stack } from "@mui/material";
import { UploadFile } from "@mui/icons-material";

export default function Dashboard() {
  const handleUploadClick = () => {
    // Add your upload logic here
    console.log("Upload Syllabus clicked");
  };

  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Dashboard</Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<UploadFile />}
          onClick={handleUploadClick}
          sx={{ maxWidth: 200 }}
        >
          Upload Syllabus
        </Button>
      </Stack>
    </Container>
  )
}