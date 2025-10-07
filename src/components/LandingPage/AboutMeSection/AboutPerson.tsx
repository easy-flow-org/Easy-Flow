import {Stack, Box, Typography, Avatar } from "@mui/material";

interface AboutPersonProps {
  name: string;
  imageSrc: string;
  summary: string;
}


export default function AboutPerson({ name, imageSrc, summary }: AboutPersonProps) {
    return (
    <Stack
      direction="row"
      gap="1.5rem"
      sx={{
        alignItems: "center",
        maxWidth: "700px",
        padding: "1rem",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Avatar src={imageSrc} alt={name} sx={{ width: 80, height: 80 }} />

      <Box>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2">{summary}</Typography>
      </Box>
    </Stack>
    );
}