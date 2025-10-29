"use client"

import { ArrowRight, ArrowRightOutlined } from "@mui/icons-material";
import { Stack, Typography, Card, CardContent, Box, CardActions, Button } from "@mui/material";

export default function Feature1() {
  const cardMinWidth = { xs: 230, sm: 330 };
  const previewBoxSizes = { xs: 230, sm: 330 };
  const previewBoxMargins = { xs: "auto" };

  const cards = [
    {
      title: "Import Your Syllabus in Seconds",
      desc: "Send class deadlines to your calendar.",
    },
    {
      title: "Stay on Top of Every Task",
      desc: "All your notes and to-dos in one place.",
    },
    {
      title: "Focus Without Distractions",
      desc: "Block noise, lock in, and get work done.",
    },
  ].map((card) => (
    <Card sx={{ minWidth: cardMinWidth }}>
      <CardContent>
        <Typography variant="h6" align={"center"}>
          {card.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" align={"center"}>
          {card.desc}
        </Typography>
        <Box
          sx={{
            bgcolor: "whitesmoke",
            height: previewBoxSizes,
            width: previewBoxSizes,
            borderRadius: 2,
            mx: previewBoxMargins,
            mb: previewBoxMargins,
            mt: 1,
          }}
        ></Box>
      </CardContent>
    </Card>
  ));

  return (
    <>
      <Stack
        direction={"column"}
        sx={{
          padding: "4rem 1rem 7rem 1rem",
          backgroundColor: "whitesmoke",
        }}
      >
        <Typography variant="h4" align="center">
          Keep Up Effortlessly
        </Typography>
        <Stack direction={"row"} justifyContent={"center"} marginTop={4} flexWrap={"wrap"} gap={3}>
          {cards}
        </Stack>
      </Stack>
    </>
  );
}
